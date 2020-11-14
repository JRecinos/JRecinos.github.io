import { StmtBaseTranslator } from './stmt-base-translator'
import { StmtTranslator } from './stmt-translator'
import { tree_types } from '../../ast/tree-types'
import { ExpressionTranslator } from '../expression/expression-translator'
import { FieldDeclarationTranslator } from '../classes/field-declaration-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Generator } from '../../generators/generator'
import { Backend } from '../../backend'
import { VariableAssignStmtTranslator } from './variable-assign-stmt-translator'

export class ForStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  firstPass(INode){
    const stmtTranslator = new StmtTranslator(this)
    const body = INode.getChild(INode.childrenSize() - 1)
    stmtTranslator.firstPass(body)
  }

  translate (INode) {
    this.iNode = INode

    let flag = false
    // declaration
    // expression
    // expression
    const decl = INode.lookupByType(tree_types.types.FOR_INIT)
    const condition = INode.lookupByType(tree_types.types.FOR_COND)
    const inc = INode.lookupByType(tree_types.types.FOR_UPDATE)
    const body = INode.getChild(INode.childrenSize() - 1)

    let code = TranslatorHelpers.comment('init of for')

    if (decl && decl.getChild(0).getType() === tree_types.types.VAR_DECLARATION) {
      flag = true
      Backend.ScopeStack.enterScope()
      const varDecl = new FieldDeclarationTranslator(this)
      varDecl.translate(false, decl.getChild(0))
      code += varDecl.getCode()
    } else if (decl) { // expression list
      const exprL = new ExpressionTranslator(this)
      for (const node of decl.getChild(0).getChildren()) {
        exprL.translate(node)
        code += exprL.getCode()
      }
    }

    const condition_label = Generator.genLabel(); const loop_begin_label = Generator.genLabel()
    const assign_label = Generator.genLabel()

    const conditionTranslator = new ExpressionTranslator(this)
    if (condition) {
      conditionTranslator.setBooleanLabels(loop_begin_label, this.siguiente)
      conditionTranslator.translate(condition.getChild(0))
    }

    // before we execute the statements we save the cicles information
    Backend.Display.Cicles.push([assign_label, this.siguiente])

    // we next need to get the stmt code
    const stmtTranslator = new StmtTranslator(this)
    stmtTranslator.setSiguiente(assign_label)
    stmtTranslator.translate(body)

    code += TranslatorHelpers.generateLabel(condition_label)
    code += (condition) ? conditionTranslator.getCode() : ''
    code += TranslatorHelpers.generateLabel(loop_begin_label)
    code += stmtTranslator.getCode()

    code += TranslatorHelpers.generateLabel(assign_label)

    if (inc) {
      const exprL = new ExpressionTranslator(this)
      const eqExp = new VariableAssignStmtTranslator(this)
      for (const node of inc.getChild(0).getChildren()) {
        if (node.getType() === tree_types.types.EQ) {
          eqExp.translate(node)
          code += TranslatorHelpers.comment('for update expression translator eq')
          code += eqExp.getCode()
        } else {
          exprL.translate(node)
          code += TranslatorHelpers.comment('for update expression translator')
          code += exprL.getCode()
        }
      }
    }
    code += TranslatorHelpers.inconditionalJMP(condition_label)
    Backend.Display.Cicles.pop()
    if (flag) { Backend.ScopeStack.exitScope() }
    this.setCode(code)
  }
}

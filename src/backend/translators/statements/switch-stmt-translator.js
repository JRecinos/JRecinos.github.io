import { StmtBaseTranslator } from '../statements/stmt-base-translator'
import { ExpressionTranslator } from '../expression/expression-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Generator } from '../../generators/generator'
import { CompilerTypes } from '../../../backend/compiler-types'
import { TypeChecking } from '../../helpers/type-checking'
import { tree_types } from '../../ast/tree-types'
import { StmtListTranslator } from './stmt-list-translator'
import { Backend } from '../../backend'

export class SwitchStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const caseList = INode.getChild(1)
    const stmtTranslator = new StmtListTranslator(this)
    for (const caseLabel of caseList.getChildren()) {
      stmtTranslator.firstPass(caseLabel.getChild(caseLabel.childrenSize() - 1))
    }
  }

  translate (INode) {
    /**
         * B.true = nuevaetiqueta () B.false = nuevaetiqueta () S 1 .siguiente = S 2
         * .siguiente = S.siguiente S.codigo = B.codigo || etiqueta (B.true) || S 1
         * .codigo || gen (  goto  S.siguiente) || etiqueta (B.false) || S 2 .codigo
         *
         */

    this.iNode = INode

    const eTranslator = new ExpressionTranslator(this)
    eTranslator.translate(INode.getChild(0))

    const isString = eTranslator.getType() === CompilerTypes.STRING
    let strTmp = ''
    if (isString) {
      strTmp = Generator.genTemporary()
    }
    // we initialize the code string, casue we will create a global container for
    // all switchs
    const testLabel = Generator.genLabel(); let bodyCode = ''; let evalCode = ''; let stmtLabel; let testCode = ''
    // we set the eval code
    evalCode += eTranslator.getCode()
    evalCode += TranslatorHelpers.inconditionalJMP(testLabel)

    testCode += TranslatorHelpers.generateLabel(testLabel)

    // ----------------------------------------------------------------------- //
    const caseList = INode.getChild(1)

    // We create the statement translator for every expression and for every
    // statement
    const caseTranslator = new ExpressionTranslator(this)
    const stmtTranslator = new StmtListTranslator(this)
    stmtTranslator.setSiguiente(this.siguiente)

    let def = null; let defStmt = null
    let defLabel = ''
    Backend.Display.Cicles.push([null, this.siguiente])
    for (const caseLabel of caseList.getChildren()) {
      // first we get all the constant values
      stmtLabel = Generator.genLabel()
      let j = 0
      for (let i = 0; i < caseLabel.childrenSize() - 1; i++) {
        if (caseLabel.getChild(i).getType() === tree_types.types.DEFAULT) {
          def = caseLabel
          defStmt = caseLabel.getChild(caseLabel.childrenSize() - 1)
          defLabel = stmtLabel
        } else {
          caseTranslator.translate(caseLabel.getChild(i))
          TypeChecking.RelationalTypeChecking(tree_types.types.EQEQ, eTranslator.getType(), caseTranslator.getType())
          testCode += caseTranslator.getCode()
          if (isString) {
            testCode += this.translateStringComparisson(strTmp, eTranslator.getTemporary(), caseTranslator.getTemporary())
            testCode += TranslatorHelpers.conditionalJMP('==', strTmp, '1', stmtLabel)
          } else { testCode += TranslatorHelpers.conditionalJMP('==', eTranslator.getTemporary(), caseTranslator.getTemporary(), stmtLabel) }
        }
        j++
      }

      stmtTranslator.translate(caseLabel.getChild(caseLabel.childrenSize() - 1))
      bodyCode += TranslatorHelpers.comment('default label thing' + stmtLabel)
      bodyCode += TranslatorHelpers.generateLabel(stmtLabel)
      bodyCode += stmtTranslator.getCode()
      // bodyCode += TranslatorHelpers.inconditionalJMP(this.siguiente)
    }

    if (def != null && defStmt != null) {
      testCode += TranslatorHelpers.comment('default label')
      testCode += TranslatorHelpers.inconditionalJMP(defLabel)
      /* bodyCode += TranslatorHelpers.generateLabel(defLabel)
      bodyCode += stmtTranslator.getCode()
      bodyCode += TranslatorHelpers.inconditionalJMP(this.siguiente) */
    }
    Backend.Display.Cicles.pop()
    this.setCode(`${evalCode}${bodyCode}${testCode}`)
  }

  translateStringComparisson (tmp, lTmp, rTmp) {
    const pointerSize = Backend.SymbolTable.getSize()
    let code = ''

    code += TranslatorHelpers.moveStackPointer(true, pointerSize + 1)
    code += TranslatorHelpers.arithmeticOperation('+', 'P', 1, tmp)
    code += TranslatorHelpers.generateStackAssign(tmp, lTmp)
    code += TranslatorHelpers.arithmeticOperation('+', 'P', 2, tmp)
    code += TranslatorHelpers.generateStackAssign(tmp, rTmp)
    code += TranslatorHelpers.functionCall('java_string_equals')
    code += TranslatorHelpers.generateStackAccess('P', tmp)
    code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)

    return code
  }
}

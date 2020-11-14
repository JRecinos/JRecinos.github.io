import { StmtBaseTranslator } from './stmt-base-translator'
import { ExpressionTranslator } from '../expression/expression-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Generator } from '../../generators/generator'
import { tree_types } from '../../ast/tree-types'
import { Backend } from '../../backend'
import { TypeChecking } from '../../helpers/type-checking'
import { CompilerTypes } from '../../compiler-types'

export class JumpStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    let code = ''
    this.iNode = INode

    switch (INode.getType()) {
      case tree_types.types.BREAK:
        if (Backend.Display.Cicles.length === 0) { throw Error(`UNABLE TO USE BREAK OUTSIDE OF A CICLE ${this.parseSemanticError(this.iNode)}`) }
        code += TranslatorHelpers.inconditionalJMP(Backend.Display.Cicles[Backend.Display.Cicles.length - 1][1])
        break
      case tree_types.types.CONTINUE:
        if (Backend.Display.Cicles.length === 0) { throw Error(`UNABLE TO USE CONTINUE OUTSIDE OF A CICLE ${this.parseSemanticError(this.iNode)}`) }
        if (Backend.Display.Cicles[Backend.Display.Cicles.length - 1][0] == null) { throw Error(`THIS STATEMENT IS NOT ALLOWED AT THIS LEVEL${this.parseSemanticError(this.iNode)}`) }
        code += TranslatorHelpers.inconditionalJMP(Backend.Display.Cicles[Backend.Display.Cicles.length - 1][0])
        break
      case tree_types.types.RETURN: {
        const functionData = Backend.Display.FunctionCallStack[Backend.Display.FunctionCallStack.length - 1]
        if (Backend.Display.OutLabel === '') { throw Error(`NO OUT LABEL SET FOR THIS FUNCTION/PROCEDURE, COMPILER ERROR ${this.parseSemanticError(this.iNode)}`) }
        if (INode.childrenSize() === 0) {
          if (functionData[2] !== CompilerTypes.VOID) { throw Error(`A RETURN VALUE WAS EXPECTED FOR THIS FUNCTION${this.parseSemanticError(this.iNode)}`) }
          code += TranslatorHelpers.comment('return void')
          code += TranslatorHelpers.inconditionalJMP(Backend.Display.OutLabel)
        } else {
          const eTranslator = new ExpressionTranslator(this)
          const tmp = Generator.genTemporary()
          eTranslator.translate(INode.getChild(0))
          // comment if not working

          if (functionData[2] === eTranslator.getType() && functionData[2] === CompilerTypes.OBJECT) {
            if (functionData[3] !== eTranslator.aux_type) {
              if (eTranslator.getAuxType() !== CompilerTypes.NULL) { throw Error(`RETURN TYPE AND FUNCTION TYPE ARE NOT THE SAME${this.parseSemanticError(this.iNode)}`) }
            }
          } else if (eTranslator.type !== functionData[2] || eTranslator.aux_type !== functionData[3] ||
              eTranslator.dimensions !== functionData[4]) {
            // implicit cast
            if (eTranslator.dimensions !== 0) { throw Error(`RETURN TYPE AND FUNCTION TYPE ARE NOT THE SAME${this.parseSemanticError(this.iNode)}`) }
            if (TypeChecking.ImplicitTypeChecking(functionData[2], eTranslator.getType()) === -1) {
              throw Error(`RETURN TYPE AND FUNCTION TYPE ARE NOT THE SAME${this.parseSemanticError(this.iNode)}`)
            }
          }

          code += eTranslator.getCode()
          code += TranslatorHelpers.comment('return statement')
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp)
          code += TranslatorHelpers.generateStackAssign(tmp, eTranslator.getTemporary())
          code += TranslatorHelpers.inconditionalJMP(Backend.Display.OutLabel)
          code += TranslatorHelpers.comment('fin return stmt')
        }
      }
        break
    }
    this.setCode(code)
  }
}

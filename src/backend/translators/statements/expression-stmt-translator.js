import { Translator } from '../translator'
import { tree_types } from '../../ast/tree-types'
import { VariableAssignStmtTranslator } from './variable-assign-stmt-translator'
import { ExpressionTranslator } from '../expression/expression-translator'

export class ExpressionStmtTranslator extends Translator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode
    switch (INode.getChild(0).getType()) {
      case tree_types.types.EQ:
        const variableAssignStmtTranslator = new VariableAssignStmtTranslator(this)
        variableAssignStmtTranslator.translate(INode.getChild(0))
        this.setCode(variableAssignStmtTranslator.getCode())
        break
      case tree_types.types.POSTDEC:
      case tree_types.types.POSTINC:
      case tree_types.types.PREDEC:
      case tree_types.types.PREINC:
      case tree_types.types.FUNCTION_CALL:
      case tree_types.types.NATIVE_FUNCTION_CALL:
      case tree_types.types.NEW:
      case tree_types.types.NEW_ARRAY:
        const expressionTranslator = new ExpressionTranslator(this)
        expressionTranslator.translate(INode.getChild(0))
        this.setCode(expressionTranslator.getCode())
        break
      default:
        throw `YOU CAN'T CALL THIS STATEMENT ${tree_types.names[INode.getChild(0).getType()]} AT THIS LEVEL ${this.parseSemanticError(this.iNode)}`
    }
  }
}

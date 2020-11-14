import { StmtBaseTranslator } from './stmt-base-translator'
import { ExpressionTranslator } from '../expression/expression-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Generator } from '../../generators/generator'
import { tree_types } from '../../ast/tree-types'
import { Backend } from '../../backend'

export class ThrowStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode
    let code = TranslatorHelpers.comment('throw statement')
    const outLabel = ''
    if (Backend.Display.TryCatchLabels.length === 0) {

    }
    if (INode.getChild(0).getType() !== tree_types.types.NEW) {
      throw Error(`UNABLE TO CALL THROW WITHOUT CREATING A NEW ERROR${this.parseSemanticError(this.iNode)}`)
    } else {
      const errorType = INode.getChild(0).getChild(0).getValue().toLowerCase()
      let err = -1
      if ((err = Backend.Display.ErrorTypeByName.get(errorType))) {
        code += TranslatorHelpers.setError(err);
        code += TranslatorHelpers.inconditionalJMP(outLabel);
      }
    }

    this.setCode(code)
  }
}

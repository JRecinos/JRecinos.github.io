import { StmtBaseTranslator } from './stmt-base-translator'
import { ExpressionTranslator } from '../expression/expression-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Generator } from '../../generators/generator'
import { tree_types } from '../../ast/tree-types'
import { Backend } from '../../backend'
import { StmtTranslator } from './stmt-translator'

export class TryCatchStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode
    let code = TranslatorHelpers.comment('try catch stmt')
    // this one has a next label which is basically the out of the last
    const tryCatch = Backend.Display.createTryCatchEnv()

    const outLabels = []
    try {
      for (const catchNode of INode.getChild(1).getChildren()) {
        const errorType = catchNode.getChild(0).getChild(0).getValue()
        outLabels.push(tryCatch.createLabel(errorType))
      }
    } catch (e) {
      throw Error(`${e.message}${this.parseSemanticError(INode.getChild(1))}`)
    }

    // first we perform the try statements
    const tryStmt = new StmtTranslator(this)
    tryStmt.setSiguiente(this.siguiente)
    tryStmt.translate(INode.getChild(0))

    code += tryStmt.getCode() + TranslatorHelpers.inconditionalJMP(this.siguiente)

    for (let i = 0; i < INode.getChild(1).childrenSize(); i++) {
      code += TranslatorHelpers.generateLabel(outLabels[i])
      code += TranslatorHelpers.unaryAssign('0', 'E')
      tryStmt.translate(INode.getChild(1).getChild(i).getChild(1))
      code += tryStmt.getCode()
    }

    // we exit
    Backend.Display.exitTryCatchEnv()
    this.setCode(code)
  }
}

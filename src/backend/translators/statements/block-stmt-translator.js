import { StmtListTranslator } from './stmt-list-translator'
import { Backend } from '../../backend'
import { StmtBaseTranslator } from './stmt-base-translator'

export class BlockStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  firstPass(INode){
    const stmtListTranslator = new StmtListTranslator(this)
    stmtListTranslator.firstPass(INode)
  }

  translate (INode, enterScope = true) {
    this.iNode = INode

    const stmtListTranslator = new StmtListTranslator(this)
    if (enterScope) { Backend.ScopeStack.enterScope() }
    stmtListTranslator.setSiguiente(this.siguiente)
    stmtListTranslator.translate(INode)
    if (enterScope) { Backend.ScopeStack.exitScope() }
    this.setCode(stmtListTranslator.getCode())
  }
}

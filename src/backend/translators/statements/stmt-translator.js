import { StmtBaseTranslator } from './stmt-base-translator'
import { tree_types } from '../../ast/tree-types'
import { FieldDeclarationTranslator } from '../classes/field-declaration-translator'
import { SpecialDeclarationTranslator } from '../classes/special-declaration-translator'
import { IfStmtTranslator } from '../statements/if-stmt-translator'
import { WhileStmtTranslator } from '../statements/while-stmt-translator'
import { DoWhileStmtTranslator } from '../statements/do-while-stmt-translator'
import { BlockStmtTranslator } from './block-stmt-translator'
import { ExpressionStmtTranslator } from './expression-stmt-translator'
import { ForStmtTranslator } from './for-stmt-translator'
import { JumpStmtTranslator } from './jump-stmt-translator'
import { SwitchStmtTranslator } from './switch-stmt-translator'
import { ThrowStmtTranslator } from './throw-stmt-translator'
import { TryCatchStmtTranslator } from './try-catch-stmt-translator'
import { Generator } from '../../generators/generator'

export class StmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    switch (INode.getType()) {
      case tree_types.types.IF: {
        const ifStmtTranslator = new IfStmtTranslator(this)
        ifStmtTranslator.firstPass(INode)
      }
        break
      case tree_types.types.FOR: {
        const forStmtTranslator = new ForStmtTranslator(this)
        forStmtTranslator.firstPass(INode)
      }
        break
      case tree_types.types.SWITCH: {
        const switchStmtTranslator = new SwitchStmtTranslator(this)
        switchStmtTranslator.firstPass(INode)
      }
        break
      case tree_types.types.WHILE: {
        const whileStmtTranslator = new WhileStmtTranslator(this)
        whileStmtTranslator.firstPass(INode)
      }
        break
      case tree_types.types.DO: {
        const doWhileStmtTranslator = new DoWhileStmtTranslator(this)
        doWhileStmtTranslator.firstPass(INode)
      }
        break
      case tree_types.types.BLOCK: {
        const blockStmtTranslator = new BlockStmtTranslator(this)
        blockStmtTranslator.firstPass(INode)
      }
        break
      case tree_types.types.RETURN:
      case tree_types.types.BREAK:
      case tree_types.types.CONTINUE:
      case tree_types.types.THROW:
      case tree_types.types.VAR_DECLARATION:
        break
      case tree_types.types.TRY: {
        const trycathcStmt = new TryCatchStmtTranslator(this)
        trycathcStmt.firstPass(INode)
      }
        break
      case tree_types.types.VAR_DECLARATION_NO_TYPE: {
        const specialDeclaration = new SpecialDeclarationTranslator(this)
        specialDeclaration.firstPass = true
        specialDeclaration.translate(true, INode)
        this.setCode(specialDeclaration.getCode())
      }
    }
  }

  translate (INode) {
    this.iNode = INode

    switch (INode.getType()) {
      case tree_types.types.EXPRESSION_STMT: {
        const expressionStmtTranslator = new ExpressionStmtTranslator(this)
        expressionStmtTranslator.translate(this.iNode)
        this.setCode(expressionStmtTranslator.getCode())
      }
        break
      case tree_types.types.IF: {
        const ifStmtTranslator = new IfStmtTranslator(this)
        ifStmtTranslator.setSiguiente(this.siguiente)
        ifStmtTranslator.translate(this.iNode)
        this.setCode(ifStmtTranslator.getCode())
      }
        break
      case tree_types.types.FOR: {
        const forStmtTranslator = new ForStmtTranslator(this)
        forStmtTranslator.setSiguiente(this.siguiente)
        forStmtTranslator.translate(this.iNode)
        this.setCode(forStmtTranslator.getCode())
      }
        break
      case tree_types.types.SWITCH: {
        const switchStmtTranslator = new SwitchStmtTranslator(this)
        switchStmtTranslator.setSiguiente(this.siguiente)
        switchStmtTranslator.translate(this.iNode)
        this.setCode(switchStmtTranslator.getCode())
      }
        break
      case tree_types.types.WHILE: {
        const whileStmtTranslator = new WhileStmtTranslator(this)
        whileStmtTranslator.setSiguiente(this.siguiente)
        whileStmtTranslator.translate(this.iNode)
        this.setCode(whileStmtTranslator.getCode())
      }
        break
      case tree_types.types.DO: {
        const doWhileStmtTranslator = new DoWhileStmtTranslator(this)
        doWhileStmtTranslator.setSiguiente(this.siguiente)
        doWhileStmtTranslator.translate(this.iNode)
        this.setCode(doWhileStmtTranslator.getCode())
      }
        break
      case tree_types.types.BLOCK: {
        const blockStmtTranslator = new BlockStmtTranslator(this)
        blockStmtTranslator.setSiguiente(this.siguiente)
        blockStmtTranslator.translate(this.iNode)
        this.setCode(blockStmtTranslator.getCode())
      }
        break
      case tree_types.types.RETURN:
      case tree_types.types.BREAK:
      case tree_types.types.CONTINUE: {
        const jumpStmtTranslator = new JumpStmtTranslator(this)
        jumpStmtTranslator.translate(this.iNode)
        this.setCode(jumpStmtTranslator.getCode())
      }
        break
      case tree_types.types.THROW: {
        window.dispatchEvent('snackbar-messages', { detail: 'throw and try were not implemented correctly' })
        const throwStmtTranslator = new ThrowStmtTranslator(this)
        throwStmtTranslator.translate(this.iNode)
        this.setCode(throwStmtTranslator.getCode())
      }
        break
      case tree_types.types.TRY: {
        window.dispatchEvent('snackbar-messages', { detail: 'throw and try were not implemented correctly' })
        const tryCatchStmtTranslator = new TryCatchStmtTranslator(this)
        tryCatchStmtTranslator.translate(this.iNode)
        this.setCode(tryCatchStmtTranslator.getCode())
      }
        break
      case tree_types.types.VAR_DECLARATION: {
        const varStmtDeclaration = new FieldDeclarationTranslator(this)
        varStmtDeclaration.translate(false, INode)
        this.setCode(varStmtDeclaration.getCode())
      }
        break
      case tree_types.types.VAR_DECLARATION_NO_TYPE: {
        const specialDeclaration = new SpecialDeclarationTranslator(this)
        specialDeclaration.translate(false, INode)
        this.setCode(specialDeclaration.getCode())
      }
        break
      case tree_types.types.NO_OP:
        break
    }
  }
}

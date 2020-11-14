import { StmtBaseTranslator } from './stmt-base-translator'
import { StmtTranslator } from './stmt-translator'
import { ExpressionTranslator } from '../expression/expression-translator'
import { Generator } from '../../generators/generator'
import { TranslatorHelpers } from '../../generators/translator-helpers'

export class IfStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const thenStmtTranslator = new StmtTranslator(this)
    thenStmtTranslator.firstPass(INode.getChild(1))
    if (INode.childrenSize() === 3) {
      thenStmtTranslator.firstPass(INode.getChild(2))
    }
  }

  translate (INode) {
    /**
         *  B.true = nuevaetiqueta ()
         *   B.false = nuevaetiqueta ()
         *   S 1 .siguiente = S 2 .siguiente = S.siguiente
         *   S.codigo = B.codigo
         *   || etiqueta (B.true) || S 1 .codigo
         *   || gen (  goto  S.siguiente)
         *   || etiqueta (B.false) || S 2 .codigo
         *
         */

    this.iNode = INode

    const expressionTranslator = new ExpressionTranslator(this)
    expressionTranslator.setBooleanLabels(Generator.genLabel(), Generator.genLabel())
    expressionTranslator.translate(INode.getChild(0))

    const thenStmtTranslator = new StmtTranslator(this)
    thenStmtTranslator.siguiente = this.siguiente
    thenStmtTranslator.translate(INode.getChild(1))

    // here we set back all the code
    let code = `${expressionTranslator.getCode()}\n`
    // here we must check if code has a goto
    code += TranslatorHelpers.generateLabel(expressionTranslator.getTrueLabel())
    code += thenStmtTranslator.getCode()
    // aqui si es true ejecuta el else
    code += TranslatorHelpers.inconditionalJMP(this.siguiente)
    code += TranslatorHelpers.generateLabel(expressionTranslator.getFalseLabel())
    code += TranslatorHelpers.comment('etiqueta false')

    if (INode.childrenSize() === 3) {
      const elseStmtTranslator = new StmtTranslator(this)
      elseStmtTranslator.setSiguiente(this.siguiente)
      code += TranslatorHelpers.comment('else body')
      elseStmtTranslator.translate(INode.getChild(2))
      code += elseStmtTranslator.getCode()
    }

    this.setCode(TranslatorHelpers.comment('inicio de if') + code)
  }
}

import { StmtBaseTranslator } from '../statements/stmt-base-translator'
import { Generator } from '../../generators/generator'
import { StmtListTranslator } from '../statements/stmt-list-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { ExpressionTranslator } from '../expression/expression-translator'
import { Backend } from '../../backend'
import { StmtTranslator } from './stmt-translator'

export class DoWhileStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const thenStmtTranslator = new StmtTranslator(this)
    thenStmtTranslator.firstPass(INode.getChild(0))
  }

  translate (INode) {
    // structure expr [0] stmt [1]
    this.iNode = INode
    /*
        * inicio = nuevaetiqueta () B.true = nuevaetiqueta () B.false = S.siguiente S 1
        * .siguiente = inicio S.codigo = etiqueta (inicio) || B.codigo || etiqueta
        * (B.true) || S 1 .codigo || gen (  goto  inicio)
        */

    const initial = Generator.genLabel()
    const out = Generator.genLabel()

    const expressionTranslator = new ExpressionTranslator(this)

    expressionTranslator.setBooleanLabels(initial, this.siguiente)
    expressionTranslator.translate(INode.getChild(1))

    // before we execute the statements we save the cicles information
    Backend.Display.Cicles.push([initial, this.siguiente])

    const thenStmtTranslator = new StmtTranslator(this)
    thenStmtTranslator.siguiente = out
    thenStmtTranslator.translate(INode.getChild(0))

    // here we set back all the code
    let code = TranslatorHelpers.generateLabel(initial)
    code += thenStmtTranslator.getCode()
    code += TranslatorHelpers.generateLabel(out)
    code += expressionTranslator.getCode()

    Backend.Display.Cicles.pop()
    this.setCode(code)
  }
}

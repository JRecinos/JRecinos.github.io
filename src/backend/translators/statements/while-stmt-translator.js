import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Backend } from '../../backend'
import { ExpressionTranslator } from '../expression/expression-translator'
import { StmtBaseTranslator } from '../statements/stmt-base-translator'
import { Generator } from '../../generators/generator'
import { StmtTranslator } from './stmt-translator'

export class WhileStmtTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const thenStmtTranslator = new StmtTranslator(this)
    thenStmtTranslator.firstPass(INode.getChild(1))
  }

  translate (INode) {
    // structure expr [0] stmt [1]
    this.iNode = INode
    /*
            inicio = nuevaetiqueta ()
            B.true = nuevaetiqueta ()
            B.false = S.siguiente
            S 1 .siguiente = inicio
            S.codigo = etiqueta (inicio) || B.codigo
            || etiqueta (B.true) || S 1 .codigo
            || gen (  goto  inicio)
         */

    const initial = Generator.genLabel()

    const expressionTranslator = new ExpressionTranslator(this)
    expressionTranslator.setBooleanLabels(Generator.genLabel(), this.siguiente)
    expressionTranslator.translate(INode.getChild(0))

    // before we execute the statements we save the cicles information
    Backend.Display.Cicles.push([initial, this.siguiente])

    const thenStmtTranslator = new StmtTranslator(this)
    thenStmtTranslator.siguiente = initial
    thenStmtTranslator.translate(INode.getChild(1))

    // here we set back all the code
    let code = TranslatorHelpers.comment('inicio de while') + TranslatorHelpers.generateLabel(initial)
    code += expressionTranslator.getCode()
    code += TranslatorHelpers.generateLabel(expressionTranslator.getTrueLabel())
    code += thenStmtTranslator.getCode()
    code += TranslatorHelpers.inconditionalJMP(initial)

    // we get rid of them
    Backend.Display.Cicles.pop()

    this.setCode(code)
  }
}

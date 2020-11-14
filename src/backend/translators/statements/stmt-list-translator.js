import { Generator } from '../../generators/generator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { StmtBaseTranslator } from '../../translators/statements/stmt-base-translator'
import { tree_types } from '../../ast/tree-types'
import { StmtTranslator } from '../../translators/statements/stmt-translator'

export class StmtListTranslator extends StmtBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const stmtTranslator = new StmtTranslator(this)
    for (const node of INode.getChildren()) {
      stmtTranslator.firstPass(node)
    }
  }

  translate (INode) {
    /**
         *
         * S 1 .siguiente = nuevaetiqueta () S 2 .siguiente = S.siguiente S.codigo = S 1
         * .codigo || etiqueta (S 1 .siguiente) || S 2 .codigo
         */

    this.iNode = INode
    let siguiente = Generator.genLabel()
    const stmtTranslator = new StmtTranslator(this)
    let code = ''

    let i = 0
    for (const node of this.iNode.getChildren()) {
      if (node.getType() === tree_types.types.NO_OP) { continue }

      if (i === this.iNode.getChildren().length - 1) {
        stmtTranslator.setSiguiente(this.siguiente)
      } else {
        stmtTranslator.setSiguiente(siguiente)
      }
      stmtTranslator.translate(node)
      code += stmtTranslator.getCode()

      if (node.getType() !== tree_types.types.EXPRESSION_STMT &&
                node.getType() !== tree_types.types.VAR_DECLARATION &&
                node.getType() !== tree_types.types.BREAK && node.getType() !== tree_types.types.CONTINUE &&
                node.getType() !== tree_types.types.RETURN) {
        code += TranslatorHelpers.generateLabel(siguiente)
        siguiente = Generator.genLabel()
      }
      i++
    }

    this.setCode(code)
  }
}

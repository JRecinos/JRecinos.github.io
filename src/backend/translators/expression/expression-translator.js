import { ExpressionBaseTranslator } from './expression-base-translator'
import { ConditionalTranslator } from './conditional-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Generator } from '../../generators/generator'

export class ExpressionTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode

    const ct = new ConditionalTranslator(this)
    this.copyLabels(ct)
    ct.translate(INode)

    if (ct.assignCode) {
      let code = ct.getCode();
      const tmp = Generator.genTemporary()
      const label = Generator.genLabel()
      code += TranslatorHelpers.generateLabel(ct.true_label)
      code += TranslatorHelpers.unaryAssign('1', tmp)
      code += TranslatorHelpers.inconditionalJMP(label)
      code += TranslatorHelpers.generateLabel(ct.false_label)
      code += TranslatorHelpers.unaryAssign('0', tmp)
      code += TranslatorHelpers.generateLabel(label)
      this.temporary = tmp
      this.type = ct.type
      this.aux_type = ct.aux_type
      this.dimensions = ct.dimensions
      this.is_array = ct.is_array
      this.position_code = ct.position_code
      this.setCode(code)
      return
    } else {
      this.setCode(ct.getCode())
    }

    this.setTemporary(ct.temporary)
    this.type = ct.getType()
    this.aux_type = ct.aux_type
    this.dimensions = ct.dimensions
    this.is_array = ct.is_array
    this.position_code = ct.position_code
  }
}

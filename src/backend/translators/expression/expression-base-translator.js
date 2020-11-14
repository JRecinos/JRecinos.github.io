import { Translator } from '../translator'
import { CompilerTypes } from '../../compiler-types'
import { tree_types } from '../../ast/tree-types'

export class ExpressionBaseTranslator extends Translator {
  constructor (translator) {
    super(translator)
    this.type = null
    this.aux_type = null
    this.temporary = null
    this.true_label = null
    this.false_label = null
    this.is_array = false
    this.dimensions = 0
  }

  /**
     *
     * @return : return the last value of the temporary
     */
  getTemporary () {
    return this.temporary
  }

  /**
     *
     * @param tmp : this temporary holds the value of the expression (last value)
     */
  setTemporary (tmp) {
    this.temporary = tmp
  }

  getType () {
    return this.type
  }

  setTrueLabel (str) {
    this.true_label = str
  }

  setFalseLabel (str) {
    this.false_label = str
  }

  getFalseLabel () {
    return this.false_label
  }

  getTrueLabel () {
    return this.true_label
  }

  copyLabels (ct) {
    if (this.true_label != null && this.false_label != null) {
      ct.setFalseLabel(this.false_label)
      ct.setTrueLabel(this.true_label)
    }
  }

  setBooleanLabels (true_label, false_label) {
    this.true_label = true_label
    this.false_label = false_label
  }

  copyInfo (eTrans) {
    this.temporary = eTrans.temporary
    this.type = eTrans.type
    this.aux_type = eTrans.getAuxType()
    this.is_array = eTrans.is_array
    this.dimensions = eTrans.dimensions
    this.position_code = eTrans.position_code
    this.setCode(eTrans.getCode())
  }

  getAuxType () {
    return this.aux_type
  }
}

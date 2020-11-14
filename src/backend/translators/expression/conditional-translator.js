import { ExpressionBaseTranslator } from './expression-base-translator'
import { ExpressionTranslator } from './expression-translator'
import { Generator } from '../../generators/generator'
import { CompilerTypes } from '../../compiler-types'
import { RelationalTranslator } from './relational-translator'
import { tree_types } from '../../ast/tree-types'
import { TranslatorHelpers } from '../../generators/translator-helpers'

export class ConditionalTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
    this.assignCode = false
    this.fromCondition = false
  }

  translate (INode) {
    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)

    const b1 = new ExpressionTranslator(this); const b2 = new ExpressionTranslator(this)

    // TODO: TYPECHECKING OF RETURNED EXPRESSION

    const flag = this.false_label == null && this.true_label == null
    // we add the labels if not existant so do we have the operation itself working

    if (flag) {
      switch (INode.getType()) {
        case tree_types.types.OROR:
        case tree_types.types.NOT:
        case tree_types.types.ANDAND:
        case tree_types.types.XOR:
          this.setBooleanLabels(Generator.genLabel(), Generator.genLabel())
          this.assignCode = true
      }
    }

    switch (INode.getType()) {
      case tree_types.types.OROR: {
        b1.setTrueLabel(this.true_label)
        b1.setFalseLabel(Generator.genLabel())
        b2.setTrueLabel(this.true_label)
        b2.setFalseLabel(this.false_label)

        b1.translate(leftNode)
        b2.translate(rightNode)

        this.type = CompilerTypes.BOOLEAN
        this.setCode(`${b1.getCode()} ${b1.false_label}:\n ${b2.getCode()}`)
      }
        break
      case tree_types.types.ANDAND: {
        b1.setTrueLabel(Generator.genLabel())
        b1.setFalseLabel(this.false_label)
        b2.setTrueLabel(this.true_label)
        b2.setFalseLabel(this.false_label)

        b1.translate(leftNode)
        b2.translate(rightNode)

        // check if there is actually a boolean
        this.type = CompilerTypes.BOOLEAN
        this.setCode(`${b1.getCode()}${b1.true_label}:\n${b2.getCode()}`)
      }
        break
      case tree_types.types.NOT: {
        b1.setTrueLabel(this.false_label)
        b1.setFalseLabel(this.true_label)

        b1.translate(leftNode)
        // this.temporary = b1.temporary;
        this.setCode(b1.getCode())
        this.type = b1.getType()
      }
        break
      case tree_types.types.XOR: {
        b1.setTrueLabel(Generator.genLabel())
        b1.setFalseLabel(Generator.genLabel())
        b1.translate(leftNode)

        b2.setTrueLabel(this.false_label)
        b2.setFalseLabel(this.true_label)
        b2.translate(rightNode)
        let codeXOR = TranslatorHelpers.comment('xor begin') + `${b1.getCode()}${b1.true_label}:\n${b2.getCode()}${b1.false_label}:\n`
        b2.setTrueLabel(this.true_label)
        b2.setFalseLabel(this.false_label)
        b2.translate(rightNode)
        codeXOR += b2.getCode()
        this.setCode(codeXOR)
        this.type = CompilerTypes.BOOLEAN
      }
        break
      case tree_types.types.BOOLEAN_LITERAL: {
        if (this.true_label != null) {
          this.type = CompilerTypes.BOOLEAN
          this.setCode(TranslatorHelpers
            .inconditionalJMP(INode.getValue() ? this.true_label : this.false_label))
        } else {
          this.temporary = (INode.getValue() ? '1' : '0')
          this.type = CompilerTypes.BOOLEAN
          this.setCode('')
        }
      }
        break
      default: {
        const rt = new RelationalTranslator(this)
        this.copyLabels(rt)
        rt.translate(INode)
        this.setTemporary(rt.getTemporary())

        if (rt.getType() === CompilerTypes.BOOLEAN) {
          let code = rt.getCode()
          if (!flag) {
            // hotfix here
            if (!(rt.getCode().includes(this.true_label) || rt.getCode().includes(this.false_label))) {
              code = TranslatorHelpers.comment('si trae flags y es un booleano no normal') + code
              code += TranslatorHelpers.conditionalJMP('==', this.temporary, '1', this.true_label)
              code += TranslatorHelpers.inconditionalJMP(this.false_label)
              this.setCode(code)
            } else {
              this.setCode(TranslatorHelpers.comment('si trae flags y es booleano operación ') + code)
            }
          } else {
            if (rt.true_label === null && rt.false_label === null && rt.dimensions === 0) {
              if (this.true_label == null && this.false_label == null) {
                this.setBooleanLabels(Generator.genLabel(), Generator.genLabel())
              }

              code += TranslatorHelpers.comment('no trae el true y false')
              code += TranslatorHelpers.conditionalJMP('==', rt.getTemporary(), '1', this.true_label)
              code += TranslatorHelpers.inconditionalJMP(this.false_label)
              this.assignCode = true
              this.setCode(code)
            } else {
              this.setCode(TranslatorHelpers.comment('true false seteadas en relational') + code)
            }
          }
        } else {
          this.setCode(rt.getCode())
          this.position_code = rt.position_code
        }

        this.type = rt.getType()
        this.aux_type = rt.aux_type
        this.dimensions = rt.dimensions
        this.is_array = rt.is_array
        this.position_code = rt.position_code
      }

        break
    }
  }
}

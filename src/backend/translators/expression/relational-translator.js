
import { ArithmeticTranslator } from './arithmetic-translator'
import { ExpressionTranslator } from './expression-translator'
import { ExpressionBaseTranslator } from '../expression/expression-base-translator'
import { tree_types } from '../../ast/tree-types'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Generator } from '../../generators/generator'
import { TypeChecking } from '../../helpers/type-checking'
import { CompilerTypes } from '../../compiler-types'
import { Backend } from '../../backend'

export class RelationalTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode

    switch (INode.getType()) {
      // structure: Je, t1, t2, L1
      case tree_types.types.LT:
      case tree_types.types.GT:
      case tree_types.types.LTEQ:
      case tree_types.types.GTEQ:
      case tree_types.types.EQEQ:
      case tree_types.types.NOTEQ:
      case tree_types.types.REQEQ:
        this.translateRelational(INode)
        break
      default: {
        const at = new ArithmeticTranslator(this)
        at.translate(INode)
        this.setTemporary(at.getTemporary())
        this.setCode(at.getCode())
        this.type = at.getType()
        this.aux_type = at.aux_type
        this.dimensions = at.dimensions
        this.is_array = at.is_array
        this.position_code = at.position_code
      }
        break
    }
  }

  translateRelational (INode) {
    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)

    const leftTranslator = new ExpressionTranslator(this)
    const rightTranslator = new ExpressionTranslator(this)

    leftTranslator.translate(leftNode)
    rightTranslator.translate(rightNode)

    if (this.false_label == null && this.true_label == null) {
      this.temporary = Generator.genTemporary()

      this.type = TypeChecking.RelationalTypeChecking(INode.getType(), leftTranslator.getType(),
        rightTranslator.getType())

      this.true_label = Generator.genLabel()
      this.false_label = Generator.genLabel()

      let code = leftTranslator.getCode() + rightTranslator.getCode()

      if (leftTranslator.getType() === CompilerTypes.STRING && rightTranslator.getType() === CompilerTypes.STRING &&
         (INode.getType() === tree_types.types.EQEQ || INode.getType() === tree_types.types.NOTEQ)) {
        const pointerSize = Backend.SymbolTable.getSize()
        const tmp = Generator.genTemporary()
        this.temporary = Generator.genTemporary()

        code += TranslatorHelpers.moveStackPointer(true, pointerSize + 1)
        code += TranslatorHelpers.arithmeticOperation('+', 'P', 1, tmp)
        code += TranslatorHelpers.generateStackAssign(tmp, leftTranslator.temporary)
        code += TranslatorHelpers.arithmeticOperation('+', 'P', 2, tmp)
        code += TranslatorHelpers.generateStackAssign(tmp, rightTranslator.temporary)
        code += TranslatorHelpers.functionCall('java_string_equals')
        code += TranslatorHelpers.generateStackAccess('P', this.temporary)
        code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)
      } else {
        code += TranslatorHelpers.comment('relational expression')
        /**
          * hotfix for var
         */
        if (leftTranslator.type === CompilerTypes.OBJECT && leftTranslator.aux_type === Backend.Classes.getType('var')) {
          code += TranslatorHelpers.generateHeapAccess(leftTranslator.temporary, leftTranslator.temporary)
        }

        if (rightTranslator.type === CompilerTypes.OBJECT && rightTranslator.aux_type === Backend.Classes.getType('var')) {
          code += TranslatorHelpers.generateHeapAccess(rightTranslator.temporary, rightTranslator.temporary)
        }

        code += TranslatorHelpers.conditionalJMP(this.getRelationalOp(INode), leftTranslator.getTemporary(),
          rightTranslator.getTemporary(), this.true_label)
        code += TranslatorHelpers.unaryAssign('0', this.temporary)
        code += TranslatorHelpers.inconditionalJMP(this.false_label)
        code += TranslatorHelpers.generateLabel(this.true_label)
        code += TranslatorHelpers.unaryAssign('1', this.temporary)
        code += TranslatorHelpers.generateLabel(this.false_label)
      }
      this.setCode(code)
      this.type = CompilerTypes.BOOLEAN
      this.aux_type = null
      this.dimensions = 0
      this.is_array = false
      return
    }

    // the code for sum is + , left_par, right_par, temporary
    // this.temporary = Generator.genTemporary();

    let code = leftTranslator.getCode() + rightTranslator.getCode()
    // hotfix for strings
    if (leftTranslator.getType() === CompilerTypes.STRING && rightTranslator.getType() === CompilerTypes.STRING &&
         (INode.getType() === tree_types.types.EQEQ || INode.getType() === tree_types.types.NOTEQ)) {
      const pointerSize = Backend.SymbolTable.getSize()
      const tmp = Generator.genTemporary()

      this.temporary = Generator.genTemporary()

      code += TranslatorHelpers.moveStackPointer(true, pointerSize + 1)
      code += TranslatorHelpers.arithmeticOperation('+', 'P', 1, tmp)
      code += TranslatorHelpers.generateStackAssign(tmp, leftTranslator.temporary)
      code += TranslatorHelpers.arithmeticOperation('+', 'P', 2, tmp)
      code += TranslatorHelpers.generateStackAssign(tmp, rightTranslator.temporary)
      code += TranslatorHelpers.functionCall('java_string_equals')
      code += TranslatorHelpers.generateStackAccess('P', this.temporary)
      code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)

      code += TranslatorHelpers.conditionalJMP('==', this.temporary, '1', this.true_label)
      code += TranslatorHelpers.inconditionalJMP(this.false_label)
    } else {
      code += TranslatorHelpers.comment('relational expression')

      if (leftTranslator.type === CompilerTypes.OBJECT && leftTranslator.aux_type === Backend.Classes.getType('var')) {
        code += TranslatorHelpers.generateHeapAccess(leftTranslator.temporary, leftTranslator.temporary)
      }

      if (rightTranslator.type === CompilerTypes.OBJECT && rightTranslator.aux_type === Backend.Classes.getType('var')) {
        code += TranslatorHelpers.generateHeapAccess(rightTranslator.temporary, rightTranslator.temporary)
      }

      code += TranslatorHelpers.conditionalJMP(this.getRelationalOp(INode), leftTranslator.getTemporary(), rightTranslator.getTemporary(), this.true_label)
      code += TranslatorHelpers.inconditionalJMP(this.false_label)
    }
    // TODO: CATCH THIS ERROR AND ADD IT TO THE ERROR STACK
    /* try {
            this.type = TypeChecking.RelationalTypeChecking(INode.getType(), leftTranslator.getType(),
                    rightTranslator.getType());
        } catch (Exception e) {
            throw new Exception(e.getMessage() + this.parseSemanticError(this.iNode));
        } */
    this.type = CompilerTypes.BOOLEAN
    this.aux_type = null
    this.dimensions = 0
    this.is_array = false
    this.setCode(code)
  }

  getRelationalOp (INode) {
    switch (INode.getType()) {
      // structure: Je, t1, t2, L1
      case tree_types.types.LT:
        return '<'
      case tree_types.types.GT:
        return '>'
      case tree_types.types.LTEQ:
        return '<='
      case tree_types.types.GTEQ:
        return '>='
      case tree_types.types.REQEQ:
      case tree_types.types.EQEQ:
        return '=='
      default:
        return '!='
    }
  }
}

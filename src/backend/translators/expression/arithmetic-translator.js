import { Backend } from '../../backend'
import { tree_types } from '../../ast/tree-types'
import { CompilerTypes, CompilerTypesNames } from '../../compiler-types'
import { ExpressionBaseTranslator } from './expression-base-translator'
import { ExpressionTranslator } from './expression-translator'
import { Generator } from '../../generators/generator'
import { TypeChecking } from '../../helpers/type-checking'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { VariableAssignStmtTranslator } from '../statements/variable-assign-stmt-translator'
import { IdentifierTranslator } from './identifier-translator'
import { FunctionCallTranslator } from '../expression/functions/function-call-translator'
import { ConstructorCallTranslator } from '../expression/functions/constructor-call-translator'
import { ObjectAccessTranslator } from '../expression/objects/object-access-translator'
import { ArrayLiteralTranslator } from './arrays/array-literal-translator'
import { ArrayDeclarationTranslator } from './arrays/array-declaration-translator'
import { ArrayAccessStmtTranslator } from './arrays/array-access-stmt-translator'

var string_one_native_functions = ['tochararray', 'tolowercase', 'touppercase', 'length']
var real_native_functions = ['trunk', 'round']

export class ArithmeticTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode

    switch (INode.getType()) {
      case tree_types.types.MINUS:
        if (INode.childrenSize() === 1) { this.translateUnaryNumber(this.iNode) } else { this.translateBinaryArithmetic(INode) }
        break
      case tree_types.types.PLUS:
      case tree_types.types.MULT:
      case tree_types.types.DIV:
      case tree_types.types.MOD:
        this.translateBinaryArithmetic(INode)
        break
      case tree_types.types.POW: {
        const size = Backend.SymbolTable.getSize() + 1
        const eTranslator1 = new ExpressionTranslator(this)
        const eTranslator2 = new ExpressionTranslator(this)

        eTranslator1.translate(INode.getChild(0))
        eTranslator2.translate(INode.getChild(1))

        try {
          TypeChecking.PowTypeChecking(eTranslator1.getType(), eTranslator2.getType())
        } catch (e) {
          throw `${e} ${this.parseSemanticError(INode)}`
        }
        this.code = TranslatorHelpers.comment('llamada a power')
        this.temporary = Generator.genTemporary()
        this.aux_type = null
        this.dimensions = 0
        this.type = CompilerTypes.DOUBLE
        this.code += eTranslator1.getCode() + eTranslator2.getCode()
        this.code += TranslatorHelpers.moveStackPointer(true, size)
        this.code += TranslatorHelpers.arithmeticOperation('+', 'P', 1, this.temporary)
        this.code += TranslatorHelpers.generateStackAssign(this.temporary, eTranslator1.getTemporary())
        this.code += TranslatorHelpers.arithmeticOperation('+', 'P', 2, this.temporary)
        this.code += TranslatorHelpers.generateStackAssign(this.temporary, eTranslator2.getTemporary())
        this.code += TranslatorHelpers.functionCall('native_java_pow')
        this.code += TranslatorHelpers.generateStackAccess('P', this.temporary)
        this.code += TranslatorHelpers.moveStackPointer(false, size)
      }
        break
      case tree_types.types.QUESTION:
        this.translateQuestion(INode)
        break
      case tree_types.types.CHARACTER_LITERAL:
      case tree_types.types.BOOLEAN_LITERAL:
      case tree_types.types.STRING_LITERAL:
      case tree_types.types.NULL_LITERAL:
      case tree_types.types.DOUBLE_LITERAL:
      case tree_types.types.INTEGER_LITERAL:
        this.translateConstant(INode)
        break
      case tree_types.types.CAST:
        this.translateCast(INode)
        break
      case tree_types.types.ARRAY_LITERAL:
        const aLiteral = new ArrayLiteralTranslator(this)
        aLiteral.translate(INode)
        this.aux_type = aLiteral.aux_type
        this.type = aLiteral.type
        this.temporary = aLiteral.temporary
        this.dimensions = aLiteral.dimensions
        this.is_array = aLiteral.is_array
        this.code = aLiteral.code
        break
      case tree_types.types.NEW_ARRAY:

        this.type = this.parseType(INode.getChild(0).getType())
        this.aux_type = (this.type === CompilerTypes.OBJECT) ? Backend.Classes.getType(INode.getChild(0).getValue()) : null
        if (this.aux_type === -1) { throw `UNABLE TO FIND THE SPECIFIED TYPE ${INode.getChild(0).getValue()}${this.parseSemanticError(INode.getChild(0))}` }
        this.dimensions = INode.getChild(1).childrenSize()
        this.is_array = true

        if (INode.childrenSize() === 3) {
          const arrLiteral = new ArrayLiteralTranslator(this)
          arrLiteral.translate(INode.getChild(2))

          if (arrLiteral.dimensions !== this.dimensions) { throw 'ARRAY LITERAL DOESN\'T HAVE THE SAME DIMENSIONS AS THE DECLARED ARRAY' }

          if (this.type !== arrLiteral.type || arrLiteral.aux_type !== this.aux_type) { throw `ARRAY LITERAL IS NOT THE SAME VALUE AS DECLARED${this.parseSemanticError(INode)}` }

          this.code = arrLiteral.getCode()
          this.temporary = arrLiteral.temporary
        } else {
          this.code = TranslatorHelpers.comment('ARRAY DECL NOT INITIALIZED INIT')
          this.code += TranslatorHelpers.moveHeapPointer(1)
          this.temporary = Generator.genTemporary()
          this.code += TranslatorHelpers.unaryAssign('H', this.temporary)
          this.code += ArrayDeclarationTranslator.translate(INode.getChild(1).getChildren())
        }
        break
      case tree_types.types.NEW:
        const constructorCall = new ConstructorCallTranslator(this)
        constructorCall.translate(this.iNode)
        this.copyInfo(constructorCall)
        this.aux_type = constructorCall.aux_type
        break
      case tree_types.types.NATIVE_FUNCTION_CALL:
        this.translateNativeCall(INode)
        break
      case tree_types.types.FUNCTION_CALL:
        const fCallTranslator = new FunctionCallTranslator(this)
        fCallTranslator.translate(INode)
        this.copyInfo(fCallTranslator)
        this.aux_type = fCallTranslator.aux_type
        break
      case tree_types.types.IDENTIFIER:
        const iTranslator = new IdentifierTranslator(this)
        iTranslator.translate(INode)
        this.copyInfo(iTranslator)
        this.aux_type = iTranslator.aux_type
        this.position_code = iTranslator.position_code
        break
      case tree_types.types.DOT: {
        const oAccessTranslator = new ObjectAccessTranslator(this)
        oAccessTranslator.translate(INode)
        this.copyInfo(oAccessTranslator)
        this.aux_type = oAccessTranslator.aux_type
        this.setCode(oAccessTranslator.access_code)
      }
        break
      case tree_types.types.ARRAY_ACCESS: {
        const arrayAccessStmtTranslator = new ArrayAccessStmtTranslator(this)
        arrayAccessStmtTranslator.translate(INode)
        this.setTemporary(arrayAccessStmtTranslator.temporary)
        this.type = arrayAccessStmtTranslator.type
        this.aux_type = arrayAccessStmtTranslator.aux_type
        this.dimensions = arrayAccessStmtTranslator.dimensions
        this.is_array = arrayAccessStmtTranslator.is_array
        this.code = arrayAccessStmtTranslator.access_code
      }
        break
      case tree_types.types.PREDEC:
      case tree_types.types.PREINC: {
        const plusAction = INode.getType() === tree_types.types.PREINC

        switch (INode.getChild(0).getType()) {
          case tree_types.types.IDENTIFIER: {
            const idTrans = new IdentifierTranslator(this)
            idTrans.translate(INode.getChild(0))
            this.type = idTrans.type
            this.dimensions = idTrans.dimensions
            this.is_array = idTrans.is_array
            let code = idTrans.position_code
            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== CompilerTypes.INTEGER && this.type !== CompilerTypes.DOUBLE && this.type !== CompilerTypes.CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            this.temporary = Generator.genTemporary()
            if (idTrans.stack === 1) {
              code += TranslatorHelpers.generateStackAccess(idTrans.getTemporary(), this.temporary)
              code += TranslatorHelpers.arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', this.temporary)
              code += TranslatorHelpers.generateStackAssign(idTrans.getTemporary(), this.temporary)
              this.setCode(code)
            } else {
              code += TranslatorHelpers.generateHeapAccess(idTrans.getTemporary(), this.temporary)
              code += TranslatorHelpers.arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', this.temporary)
              code += TranslatorHelpers.generateHeapAssign(idTrans.getTemporary(), this.temporary)
              this.setCode(code)
            }
          }
            break
          case tree_types.types.DOT: {
            const oAccessTrans = new ObjectAccessTranslator(this)
            oAccessTrans.translate(INode.getChild(0))
            this.type = oAccessTrans.type
            this.dimensions = oAccessTrans.dimensions

            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== CompilerTypes.INTEGER && this.type !== CompilerTypes.DOUBLE && this.type !== CompilerTypes.CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            let code = TranslatorHelpers.comment('dot access') + oAccessTrans.position_code
            this.temporary = Generator.genTemporary()
            code += TranslatorHelpers.generateHeapAccess(oAccessTrans.getTemporary(), this.temporary)
            code += TranslatorHelpers.arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', this.temporary)
            code += TranslatorHelpers.generateHeapAssign(oAccessTrans.getTemporary(), this.temporary)
            this.setCode(code)
          }
            break
          case tree_types.types.ARRAY_ACCESS: {
            const arrayAccessTrans = new ArrayAccessStmtTranslator(this)
            arrayAccessTrans.translate(INode.getChild(0))
            this.type = arrayAccessTrans.type
            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== CompilerTypes.INTEGER && this.type !== CompilerTypes.DOUBLE && this.type !== CompilerTypes.CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            let code = TranslatorHelpers.comment('array -- ++') + arrayAccessTrans.position_code
            this.temporary = Generator.genTemporary()
            code += TranslatorHelpers.generateHeapAccess(arrayAccessTrans.getTemporary(), this.temporary)
            code += TranslatorHelpers.arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', this.temporary)
            code += TranslatorHelpers.generateHeapAssign(arrayAccessTrans.getTemporary(), this.temporary)
            this.setCode(code)
          }
            break
          default:
            throw Error(`UNABLE TO USE ${plusAction ? '++' : '--'} IN ANYTHING OTHER THAN AN OBJECT, ARRAY ACCESS OR VARIABLE${this.parseSemanticError(INode)}`)
        }
      }
        break
      case tree_types.types.EQ: {
        const variableassign = new VariableAssignStmtTranslator(this)
        variableassign.translate(INode)
        this.code = variableassign.getCode()
        this.temporary = variableassign.getTemporary()
        this.aux_type = variableassign.aux_type
        this.dimensions = variableassign.dimension
        this.is_array = variableassign.is_array
      }
        break
      case tree_types.types.POSTDEC:
      case tree_types.types.POSTINC: {
        const plusAction = INode.getType() === tree_types.types.POSTINC

        switch (INode.getChild(0).getType()) {
          case tree_types.types.IDENTIFIER: {
            const idTrans = new IdentifierTranslator(this)
            idTrans.translate(INode.getChild(0))
            this.type = idTrans.type
            this.dimensions = idTrans.dimensions

            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== CompilerTypes.INTEGER && this.type !== CompilerTypes.DOUBLE && this.type !== CompilerTypes.CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }

            let code = idTrans.position_code
            const tmp = Generator.genTemporary()
            this.temporary = Generator.genTemporary()
            if (idTrans.stack === 1) {
              code += TranslatorHelpers.generateStackAccess(idTrans.getTemporary(), this.temporary)
              code += TranslatorHelpers.arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', tmp)
              code += TranslatorHelpers.generateStackAssign(idTrans.getTemporary(), tmp)
              this.setCode(code)
            } else {
              code += TranslatorHelpers.generateHeapAccess(idTrans.getTemporary(), this.temporary)
              code += TranslatorHelpers.arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', tmp)
              code += TranslatorHelpers.generateHeapAssign(idTrans.getTemporary(), tmp)
              this.setCode(code)
            }
          }
            break
          case tree_types.types.DOT: {
            const oAccessTrans = new ObjectAccessTranslator(this)
            oAccessTrans.translate(INode.getChild(0))
            this.type = oAccessTrans.type
            this.dimensions = oAccessTrans.dimensions

            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== CompilerTypes.INTEGER && this.type !== CompilerTypes.DOUBLE && this.type !== CompilerTypes.CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }

            let code = oAccessTrans.position_code
            const tmp = Generator.genTemporary()
            this.temporary = Generator.genTemporary()

            code += TranslatorHelpers.generateHeapAccess(oAccessTrans.getTemporary(), this.temporary)
            code += TranslatorHelpers.arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', tmp)
            code += TranslatorHelpers.generateHeapAssign(oAccessTrans.getTemporary(), tmp)
            this.setCode(code)
          }
            break
          case tree_types.types.ARRAY_ACCESS: {
            const arrayAccessTrans = new ArrayAccessStmtTranslator(this)
            arrayAccessTrans.translate(INode.getChild(0))
            this.type = arrayAccessTrans.type
            this.dimensions = arrayAccessTrans.dimensions

            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== CompilerTypes.INTEGER && this.type !== CompilerTypes.DOUBLE && this.type !== CompilerTypes.CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }

            let code = arrayAccessTrans.position_code
            const tmp = Generator.genTemporary()
            this.temporary = Generator.genTemporary()

            code += TranslatorHelpers.generateHeapAccess(arrayAccessTrans.getTemporary(), this.temporary)
            code += TranslatorHelpers.arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', tmp)
            code += TranslatorHelpers.generateHeapAssign(arrayAccessTrans.getTemporary(), tmp)
            this.setCode(code)
          }
            break
          default:
            throw Error(`UNABLE TO USE ${plusAction ? '++' : '--'} IN ANYTHING OTHER THAN AN OBJECT, ARRAY ACCESS OR VARIABLE${this.parseSemanticError(INode)}`)
        }
      }
        break
    }
  }

  translateBinaryArithmetic (INode) {
    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)

    const leftTranslator = new ExpressionTranslator(this)
    const rightTranslator = new ExpressionTranslator(this)

    leftTranslator.translate(leftNode)
    rightTranslator.translate(rightNode)

    try {
      this.type = TypeChecking.ExpressionTypeChecking(INode.getType(), leftTranslator.getType(),
        rightTranslator.getType())

      // here we check the sum of strings and the conversion
    } catch (e) {
      throw Error(`${e}${this.parseSemanticError(this.iNode)}`)
    }

    if (this.type === CompilerTypes.STRING) {
      this.aux_type = null
      this.dimensions = 0
      this.is_array = false

      const ct = (leftTranslator.getType() === CompilerTypes.STRING) ? rightTranslator.getType() : leftTranslator.getType()
      const left = ct === leftTranslator.getType()

      let code = `${leftTranslator.getCode()} ${rightTranslator.getCode()}`
      this.temporary = Generator.genTemporary()
      const current_size = Backend.SymbolTable.getSize() + 1 // get the current env stack size
      code += TranslatorHelpers.comment('native calls to concatenate strings')
      // TODO: add real and integer values
      switch (ct) {
        case CompilerTypes.CHAR: {
          const tmp_helper = Generator.genTemporary()
          const tmp_helper_2 = Generator.genTemporary()

          code += TranslatorHelpers.moveStackPointer(true, current_size) // here goes the current stack or method
          // size
          code += TranslatorHelpers.arithmeticOperation('+', '1', 'P', tmp_helper)
          code += TranslatorHelpers.generateStackAssign(tmp_helper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += TranslatorHelpers.functionCall('native_java_char_to_string\n')
          code += TranslatorHelpers.generateStackAccess('P', tmp_helper_2) // aqui ya tenemos el let

          // here we have to check if the other type is the left or the right
          if (left) {
            code += TranslatorHelpers.generateStackAssign(tmp_helper, tmp_helper_2)
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += TranslatorHelpers.generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += TranslatorHelpers.generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += TranslatorHelpers.generateStackAssign(tmp_helper, tmp_helper_2)
          }

          code += TranslatorHelpers.functionCall('native_java_concat_strings')
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
          code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
          code += TranslatorHelpers.moveStackPointer(false, current_size)
        }
          break
        case CompilerTypes.DOUBLE: {
          const tmp_helper = Generator.genTemporary()
          const tmp_helper_2 = Generator.genTemporary()
          code += TranslatorHelpers.moveStackPointer(true, current_size) // here goes the current stack or method
          // size

          code += TranslatorHelpers.arithmeticOperation('+', '1', 'P', tmp_helper)
          code += TranslatorHelpers.generateStackAssign(tmp_helper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += TranslatorHelpers.functionCall('native_java_real_to_string')
          code += TranslatorHelpers.generateStackAccess('P', tmp_helper_2)

          if (left) {
            code += TranslatorHelpers.generateStackAssign(tmp_helper, tmp_helper_2)
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += TranslatorHelpers.generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += TranslatorHelpers.generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += TranslatorHelpers.generateStackAssign(tmp_helper, tmp_helper_2)
          }

          code += TranslatorHelpers.functionCall('native_java_concat_strings')
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
          code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
          code += TranslatorHelpers.moveStackPointer(false, current_size)
        }
          break
        case CompilerTypes.INTEGER: {
          const tmp_helper = Generator.genTemporary(); const tmp_helper_2 = Generator.genTemporary()
          code += TranslatorHelpers.moveStackPointer(true, current_size) // here goes the current stack or method
          // size

          code += TranslatorHelpers.arithmeticOperation('+', '1', 'P', tmp_helper)
          code += TranslatorHelpers.generateStackAssign(tmp_helper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += TranslatorHelpers.functionCall('native_java_int_to_string')
          code += TranslatorHelpers.generateStackAccess('P', tmp_helper_2)

          if (left) {
            code += TranslatorHelpers.generateStackAssign(tmp_helper, tmp_helper_2)
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += TranslatorHelpers.generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += TranslatorHelpers.generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += TranslatorHelpers.generateStackAssign(tmp_helper, tmp_helper_2)
          }

          code += TranslatorHelpers.functionCall('native_java_concat_strings')
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
          code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
          code += TranslatorHelpers.moveStackPointer(false, current_size)
        }
          break
        case CompilerTypes.STRING: {
          const tmp_helper = Generator.genTemporary()
          code += TranslatorHelpers.moveStackPointer(true, current_size) // here goes the current stack or method
          // size
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp_helper)
          code += TranslatorHelpers.generateStackAssign(tmp_helper, leftTranslator.getTemporary())
          code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
          code += TranslatorHelpers.generateStackAssign(tmp_helper, rightTranslator.getTemporary())
          code += TranslatorHelpers.functionCall('native_java_concat_strings')
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
          code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
          code += TranslatorHelpers.moveStackPointer(false, current_size)
        }
          break
        case CompilerTypes.BOOLEAN: {
          const tmp_helper = Generator.genTemporary(); const tmp_helper_2 = Generator.genTemporary()
          code += TranslatorHelpers.moveStackPointer(true, current_size) // here goes the current stack or method
          // size

          code += TranslatorHelpers.arithmeticOperation('+', '1', 'P', tmp_helper)
          code += TranslatorHelpers.generateStackAssign(tmp_helper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += TranslatorHelpers.functionCall('native_java_boolean_to_string')
          code += TranslatorHelpers.generateStackAccess('P', tmp_helper_2)

          if (left) {
            code += TranslatorHelpers.generateStackAssign(tmp_helper, tmp_helper_2)
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += TranslatorHelpers.generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += TranslatorHelpers.generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += TranslatorHelpers.generateStackAssign(tmp_helper, tmp_helper_2)
          }

          code += TranslatorHelpers.functionCall('native_java_concat_strings')
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
          code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
          code += TranslatorHelpers.moveStackPointer(false, current_size)
        }
          break
        case CompilerTypes.OBJECT: {
          const tmpHelper = Generator.genTemporary(); const tmpHelper2 = Generator.genTemporary()
          code += TranslatorHelpers.moveStackPointer(true, current_size) // here goes the current stack or method
          // size

          code += TranslatorHelpers.arithmeticOperation('+', '1', 'P', tmpHelper)
          code += TranslatorHelpers.generateStackAssign(tmpHelper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += TranslatorHelpers.functionCall('default_object_to_string')
          code += TranslatorHelpers.generateStackAccess('P', tmpHelper2)

          if (left) {
            code += TranslatorHelpers.generateStackAssign(tmpHelper, tmpHelper2)
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmpHelper, tmpHelper)
            code += TranslatorHelpers.generateStackAssign(tmpHelper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += TranslatorHelpers.generateStackAssign(tmpHelper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += TranslatorHelpers.arithmeticOperation('+', '1', tmpHelper, tmpHelper)
            code += TranslatorHelpers.generateStackAssign(tmpHelper, tmpHelper2)
          }

          code += TranslatorHelpers.functionCall('native_java_concat_strings')
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
          code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
          code += TranslatorHelpers.moveStackPointer(false, current_size)
        }
      }

      this.setCode(code)
      return
    }

    // the code for sum is + , left_par, right_par, temporary
    this.temporary = Generator.genTemporary()
    let code = `${leftTranslator.getCode() == null ? '' : leftTranslator.getCode()}${rightTranslator.getCode() == null ? '' : rightTranslator.getCode()}`
    code += TranslatorHelpers.arithmeticOperation(this.getArithmeticOp(INode), leftTranslator.getTemporary(),
      rightTranslator.getTemporary(), this.temporary)

    this.setCode(code)
    // if not working comment
    this.aux_type = null
    this.dimensions = 0
    this.is_array = null
  }

  /**
     *
     * @param INode : the node that holds the current value
     */
  translateConstant (INode) {
    this.iNode = INode

    switch (INode.getType()) {
      case tree_types.types.CHARACTER_LITERAL:
        this.type = CompilerTypes.CHAR
        this.temporary = INode.getValue().length === 2 ? 0 : INode.getValue().charCodeAt(1)
        this.setCode('')
        break
      case tree_types.types.BOOLEAN_LITERAL:
        this.setCode('')
        this.type = CompilerTypes.BOOLEAN
        this.temporary = (INode.getValue()) ? '1' : '0'
        break
      case tree_types.types.STRING_LITERAL:
        this.type = CompilerTypes.STRING
        let str = INode.getValue().toString()
        str = str.replace(/\\\'/g, "\'")
          .replace(/\\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\r/g, '\r')
        this.temporary = Generator.genTemporary() // HOTFIX: <= THIS CAN BE CHANGED TO A STACK POINTER
        let code = TranslatorHelpers.moveHeapPointer(1)
        code += TranslatorHelpers.unaryAssign('H', this.temporary)
        code += this.translateString(str)
        this.setCode(code)
        break
      case tree_types.types.NULL_LITERAL:
        this.type = CompilerTypes.OBJECT
        this.aux_type = CompilerTypes.NULL
        this.temporary = '0'
        this.position_code = ''
        this.setCode(TranslatorHelpers.comment('null type'))
        break
      case tree_types.types.DOUBLE_LITERAL:
        this.temporary = INode.getValue().toString()
        this.type = CompilerTypes.DOUBLE
        this.setCode('')
        break
      case tree_types.types.INTEGER_LITERAL:
        this.temporary = INode.getValue().toString()
        this.type = CompilerTypes.INTEGER
        this.setCode('')
        break
    }
  }

  /**
     *
     * @param INode : the INode to get the info from
     * @return : the arithmetic operator
     */
  getArithmeticOp (INode) {
    switch (INode.getType()) {
      case tree_types.types.PLUS:
        return '+'
      case tree_types.types.MINUS:
        return '-'
      case tree_types.types.MULT:
        return '*'
      case tree_types.types.MOD:
        return '%'
      case tree_types.types.DIV:
        return '/'
    }
  }

  translateString (raw) {
    let str = ''
    for (let i = 0; i < raw.length; i++) {
      // asignación de la variable ascii en la posición de memoria
      str += TranslatorHelpers.generateHeapAssign('H', raw.charCodeAt(i))
      // aumento de la posición de memoria
      str += TranslatorHelpers.moveHeapPointer(1)
    }
    // asignación de fin de cadena
    str += TranslatorHelpers.generateHeapAssign('H', '0')
    return str
  }

  translateNativeCall (INode) {
    // SymTab current = Backend.SymbolTable;

    const id = INode.getChild(0).getValue()
    const pList = INode.getChild(1)
    switch (id) {
      case 'print':
      case 'println': {
        let code = ''

        if (pList == null) {
          code += (id === 'println') ? (TranslatorHelpers.printStmt('%c', '10') + TranslatorHelpers.printStmt('%c', '13')) : ''
          this.setCode(code)
          return
        }

        for (const pNode of pList.getChildren()) {
          const expressionTranslator = new ExpressionTranslator(this)
          expressionTranslator.translate(pNode)

          if (expressionTranslator.getType() === CompilerTypes.INTEGER) {
            code += expressionTranslator.getCode()
            code += TranslatorHelpers.printStmt('%i', expressionTranslator.getTemporary())
          } else if (expressionTranslator.getType() === CompilerTypes.DOUBLE) {
            code += expressionTranslator.getCode()
            code += TranslatorHelpers.printStmt('%d', expressionTranslator.getTemporary())
          } else if (expressionTranslator.getType() === CompilerTypes.STRING) {
            // obtenemos el symtab y cuánto debemos levantarlo
            const currSymTab = Backend.SymbolTable
            const size = currSymTab.getSize() + 1
            const tmp = Generator.genTemporary()

            code += expressionTranslator.getCode() // it gets the expression code
            code += TranslatorHelpers.moveStackPointer(true, size) // stack pointer
            // code +=
            // TranslatorHelpers.generateTmpStackSave(currSymTab.getInitialTemporary(),
            // Generator.getTemporary()-1); //save all the current temporary
            code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp)
            code += TranslatorHelpers.generateStackAssign(tmp, expressionTranslator.getTemporary())
            code += TranslatorHelpers.functionCall('native_java_print_string')
            // code +=
            // TranslatorHelpers.generateTmpStackRecover(currSymTab.getInitialTemporary(),
            // Generator.getTemporary()-1); //save all the current temporary
            code += TranslatorHelpers.moveStackPointer(false, size)
          } else if (expressionTranslator.getType() === CompilerTypes.CHAR) {
            code += expressionTranslator.getCode() // it gets the expression code
            code += TranslatorHelpers.printStmt('%c', expressionTranslator.getTemporary())
          } else if (expressionTranslator.getType() === CompilerTypes.BOOLEAN) {
            const currSymTab = Backend.SymbolTable
            const size = currSymTab.getSize() + 1
            const tmp = Generator.genTemporary()
            code += expressionTranslator.getCode() // it gets the expression code
            code += TranslatorHelpers.moveStackPointer(true, size) // stack pointer
            code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp)
            code += TranslatorHelpers.generateStackAssign(tmp, expressionTranslator.getTemporary())
            code += TranslatorHelpers.functionCall('native_java_print_boolean')
            code += TranslatorHelpers.moveStackPointer(false, size)
          } else {
            // TODO: pending for null
            if (expressionTranslator.is_array) {
              code += expressionTranslator.getCode() // it gets the expression code
              const label = Generator.genLabel()
              const label_out = Generator.genLabel()
              code += TranslatorHelpers.conditionalJMP('!=', expressionTranslator.temporary, 0, label)
              code += TranslatorHelpers.printStmt('%c', 110)
              code += TranslatorHelpers.printStmt('%c', 117)
              code += TranslatorHelpers.printStmt('%c', 108)
              code += TranslatorHelpers.printStmt('%c', 108)
              TranslatorHelpers.inconditionalJMP(label_out)
              TranslatorHelpers.generateLabel(label)
              code += TranslatorHelpers.printStmt('%c', 65)
              code += TranslatorHelpers.printStmt('%c', 114)
              code += TranslatorHelpers.printStmt('%c', 114)
              code += TranslatorHelpers.printStmt('%c', 97)
              code += TranslatorHelpers.printStmt('%c', 121)
              code += TranslatorHelpers.printStmt('%c', 64)
              code += TranslatorHelpers.printStmt('%i', expressionTranslator.temporary)
              TranslatorHelpers.generateLabel(label_out)
            } else if (expressionTranslator.type === CompilerTypes.OBJECT) {
              code += expressionTranslator.getCode() // it gets the expression code
              const label = Generator.genLabel()
              const labelOut = Generator.genLabel()
              code += TranslatorHelpers.comment('printing object')
              code += TranslatorHelpers.conditionalJMP('!=', expressionTranslator.temporary, 0, label)
              code += TranslatorHelpers.printStmt('%c', 110)
              code += TranslatorHelpers.printStmt('%c', 117)
              code += TranslatorHelpers.printStmt('%c', 108)
              code += TranslatorHelpers.printStmt('%c', 108)
              code += TranslatorHelpers.inconditionalJMP(labelOut)
              code += TranslatorHelpers.generateLabel(label)
              code += TranslatorHelpers.printStmt('%c', 79)
              code += TranslatorHelpers.printStmt('%c', 98)
              code += TranslatorHelpers.printStmt('%c', 106)
              code += TranslatorHelpers.printStmt('%c', 101)
              code += TranslatorHelpers.printStmt('%c', 99)
              code += TranslatorHelpers.printStmt('%c', 116)
              code += TranslatorHelpers.printStmt('%c', 64)
              code += TranslatorHelpers.printStmt('%i', expressionTranslator.temporary)
              code += TranslatorHelpers.generateLabel(labelOut)
            }
          }
        }
        code += (id === 'println')
          ? (TranslatorHelpers.printStmt('%c', '10') + TranslatorHelpers.printStmt('%c', '13'))
          : ''
        this.setCode(code)
      }
        break
    }

    // throw new Exception("PARAMETERS TYPES DOESN'T MATCH WITH THE DESIRED FUNCTION
    // " + id.toUpperCase());
  }

  getNativeType (id) {
    switch (id) {
      case 'write_file':
        return CompilerTypes.VOID
        // tipo real
      case 'equals':
        return CompilerTypes.BOOLEAN
    }

    return null
  }

  translateUnaryNumber (iNode) {
    // all we need to do is check types
    // and then do 0 - t0
    const unaryTranslator = new ExpressionTranslator(this)
    unaryTranslator.translate(iNode.getChild(0))
    if (unaryTranslator.getType() != CompilerTypes.INTEGER && unaryTranslator.getType() != CompilerTypes.DOUBLE) {
      throw Error(`UNABLE TO USE (-) WITH ${tree_types.names[unaryTranslator.getType()]}${this.parseSemanticError(this.iNode)}`)
    }
    this.temporary = Generator.genTemporary()
    let code = `${unaryTranslator.getCode()}`
    code += TranslatorHelpers.arithmeticOperation('-', '0', unaryTranslator.getTemporary(), this.getTemporary())
    this.setCode(code)
    this.type = unaryTranslator.getType()
  }

  translateQuestion (INode) {
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]
    this.temporary = Generator.genTemporary()

    const ct = new ExpressionTranslator(this)
    ct.translate(INode.getChild(0))

    if (ct.getType() !== CompilerTypes.BOOLEAN) { throw Error(`FIRST PARAMETER IN TERNARY OPERATOR IS NOT OF TYPE BOOLEAN ${this.parseSemanticError(INode)}`) }

    const thenP = new ExpressionTranslator(this); const elseP = new ExpressionTranslator(this)

    thenP.translate(INode.getChild(1))
    elseP.translate(INode.getChild(2))

    if (thenP.getType() !== elseP.getType() && thenP.getAuxType() !== elseP.getAuxType()) { throw Error(`TYPES IN TERNARY OPERATOR ARE NOT THE SAME ${this.parseSemanticError(INode)}`) }

    this.aux_type = thenP.aux_type
    this.type = thenP.type

    this.code += TranslatorHelpers.comment('question code')
    this.code += ct.getCode()
    this.code += TranslatorHelpers.conditionalJMP('==', ct.getTemporary(), '1', labels[0])
    this.code += TranslatorHelpers.inconditionalJMP(labels[1])
    this.code += TranslatorHelpers.generateLabel(labels[0])
    this.code += thenP.getCode()
    this.code += TranslatorHelpers.unaryAssign(thenP.getTemporary(), this.temporary)
    this.code += TranslatorHelpers.inconditionalJMP(labels[2])
    this.code += TranslatorHelpers.generateLabel(labels[1])
    this.code += elseP.getCode()
    this.code += TranslatorHelpers.unaryAssign(elseP.getTemporary(), this.temporary)
    this.code += TranslatorHelpers.generateLabel(labels[2])
  }

  translateCast (INode) {
    const rhs = new ExpressionTranslator(this)
    rhs.translate(INode.getChild(1))

    // WE CHECK THE INFORMATION
    // The possibles cast types are double - char - int and my guess is object
    const requestedType = this.parseType(INode.getChild(0).getType())

    // hot fix for var and global
    if (rhs.aux_type === Backend.Classes.getType('var')) {
      this.copyInfo(rhs)
      if (requestedType === CompilerTypes.OBJECT) {
        const objType = Backend.Classes.getType(INode.getChild(0).getValue())
        this.code = TranslatorHelpers.comment('object cast var') + rhs.getCode()
        this.code += TranslatorHelpers.generateInvalidCastError(rhs.temporary, objType, Backend.ErrorsLabels.get('invalidcast'))
        this.code += TranslatorHelpers.comment('var value access') + TranslatorHelpers.generateHeapAccess(rhs.temporary, rhs.temporary)
        this.type = CompilerTypes.OBJECT
        this.aux_type = objType
        this.dimensions = 0
        this.temporary = rhs.temporary
      } else {
        // this means parsed type is primitive
        this.code = TranslatorHelpers.comment('primitive cast var') + rhs.getCode()
        this.code += TranslatorHelpers.generateInvalidCastError(rhs.temporary, requestedType, Backend.ErrorsLabels.get('invalidcast'))
        this.code += TranslatorHelpers.comment('var value access') + TranslatorHelpers.generateHeapAccess(rhs.temporary, rhs.temporary)
        this.type = requestedType
        this.aux_type = null
        this.dimensions = 0
        this.temporary = rhs.temporary
      }
      return
    }

    switch (requestedType) {
      case CompilerTypes.INTEGER:
      {
        if (rhs.is_array) { throw Error(`UNABLE TO PARSE TYPE ARRAY TO PRIMITIVE${this.parseSemanticError(INode)}`) }
        if (rhs.type === CompilerTypes.INTEGER) {
          this.copyInfo(rhs)
          return
        } else if (rhs.type === CompilerTypes.CHAR) {
          this.copyInfo(rhs)
          this.type = CompilerTypes.INTEGER
          return
        } else if (rhs.type === CompilerTypes.DOUBLE) {
          this.copyInfo(rhs)
          /**
                         * CALL TO TRUNK
                         */
          this.temporary = Generator.genTemporary()
          this.code += TranslatorHelpers.comment('calling trunk')
          this.code += TranslatorHelpers.moveStackPointer(true, Backend.SymbolTable.size + 1)
          this.code += TranslatorHelpers.arithmeticOperation('+', 'P', 1, this.temporary)
          this.code += TranslatorHelpers.generateStackAssign(this.temporary, rhs.temporary)
          this.code += TranslatorHelpers.functionCall('native_java_trunk')
          this.code += TranslatorHelpers.generateStackAccess('P', this.temporary)
          this.code += TranslatorHelpers.moveStackPointer(false, Backend.SymbolTable.size + 1)
          this.type = CompilerTypes.INTEGER
          // fin conversion
          return
        } else { throw Error(`UNABLE TO PERFORM CAST WITH VALUES INTEGER AND ${CompilerTypesNames[rhs.getType()]}${this.parseSemanticError(this.iNode)}`) }
      }
      case CompilerTypes.CHAR: {
        if (rhs.is_array) { throw Error(`UNABLE TO PARSE TYPE ARRAY TO PRIMITIVE${this.parseSemanticError(INode)}`) }
        if (rhs.type === CompilerTypes.CHAR) {
          this.copyInfo(rhs)
          return
        } else if (rhs.type === CompilerTypes.INTEGER) {
          this.copyInfo(rhs)
          this.type = CompilerTypes.CHAR
          return
        } else if (rhs.type === CompilerTypes.DOUBLE) {
          this.copyInfo(rhs)
          this.type = CompilerTypes.CHAR
          this.temporary = Generator.genTemporary()
          this.code += TranslatorHelpers.comment('calling trunk')
          this.code += TranslatorHelpers.moveStackPointer(true, Backend.SymbolTable.size + 1)
          this.code += TranslatorHelpers.arithmeticOperation('+', 'P', 1, this.temporary)
          this.code += TranslatorHelpers.generateStackAssign(this.temporary, rhs.temporary)
          this.code += TranslatorHelpers.functionCall('native_java_trunk')
          this.code += TranslatorHelpers.generateStackAccess('P', this.temporary)
          this.code += TranslatorHelpers.moveStackPointer(false, Backend.SymbolTable.size + 1)
          return
        } else { throw Error(`UNABLE TO PERFORM CAST WITH VALUES CHAR AND ${CompilerTypesNames[rhs.getType()]}${this.parseSemanticError(this.iNode)}`) }
      }
      case CompilerTypes.DOUBLE: {
        if (rhs.is_array) { throw Error(`UNABLE TO PARSE TYPE ARRAY TO PRIMITIVE${this.parseSemanticError(INode)}`) }
        if (rhs.type === CompilerTypes.INTEGER || rhs.type === CompilerTypes.DOUBLE || rhs.type === CompilerTypes.CHAR) {
          this.copyInfo(rhs)
          this.type = CompilerTypes.DOUBLE
          return
        } else { throw Error(`UNABLE TO PERFORM CAST WITH VALUES DOUBLE AND ${CompilerTypesNames[rhs.getType()]}${this.parseSemanticError(this.iNode)}`) }
      }
      case CompilerTypes.OBJECT: {
        if (INode.getChild(0).getType() === tree_types.types.ARRAY) { throw Error(`UNABLE TO CAST ARRAY TYPE DONT KNOW HOW TO CAST${this.parseSemanticError(INode)}`) }
        const objType = Backend.Classes.getType(INode.getChild(0).getValue())
        if (objType === -1) { throw Error(`UNABLE TO FIND CLASS TYPE ${INode.getChild(0).getValue()}${this.parseSemanticError(INode)}`) }
        if (objType === rhs.aux_type) {
          this.copyInfo(rhs)
        } else {
          throw Error(`UNABLE TO CAST BETWEEN OBJECT TYPES${this.parseSemanticError(INode)}`)
        }
      }
        break
      default:
        throw Error(`INVALID CAST EXCEPTION${INode.getChild(0).getValue()}${this.parseSemanticError(INode)}`)
    }
  }
}

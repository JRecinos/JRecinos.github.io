import { ExpressionBaseTranslator } from '../expression-base-translator'
import { ExpressionTranslator } from '../expression-translator'
import { IdentifierTranslator } from '../identifier-translator'
import { tree_types } from '../../../ast/tree-types'
import { ObjectAccessTranslator } from '../objects/object-access-translator'
import { ConstructorCallTranslator } from '../functions/constructor-call-translator'
import { FunctionCallTranslator } from '../functions/function-call-translator'
import { ArrayAccessStmtTranslator } from '../arrays/array-access-stmt-translator'
import { ArrayLiteralTranslator } from '../arrays/array-literal-translator'
import { ArrayDeclarationTranslator } from '../arrays/array-declaration-translator'
import { TranslatorHelpers } from '../../../generators/translator-helpers'
import { CompilerTypes } from '../../../compiler-types'
import { Backend } from '../../../backend'
import { Generator } from '../../../generators/generator'

export class ParameterTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
    this.access_code = ''
    this.position_code = ''
  }

  translate (INode) {
    this.iNode = INode

    /**
         * WE CHECK THE LOGIC OF THE PARAMETER TRANSLATION, THIS WILL ONLY BE USED FOR
         * PARAMETERS, AND WILL TEMPORARILY SAVE THE SAME INFORMATION, PLUS CHECK IF THE
         * NODE HAS THE CORRECT ROL AND GET THE NESTING INFORMATION AND STUFF
         */
    switch (INode.getType()) {
      case tree_types.types.CAST: {
        const expressionTranslator = new ExpressionTranslator(this)
        expressionTranslator.translate(INode)

        this.aux_type = expressionTranslator.aux_type
        this.type = expressionTranslator.type
        this.dimensions = expressionTranslator.dimensions
        this.is_array = expressionTranslator.is_array
        this.position_code = expressionTranslator.getCode()
        this.setCode(expressionTranslator.getCode())
        this.access_code = expressionTranslator.getCode()
        this.temporary = expressionTranslator.getTemporary()
      }
        break
      case tree_types.types.IDENTIFIER: {
        const iTranslator = new IdentifierTranslator(this)
        iTranslator.translate(INode)
        // copy all data
        // this type is to check against the param type of the function call
        this.aux_type = iTranslator.aux_type
        this.type = iTranslator.type
        this.dimensions = iTranslator.dimensions
        this.is_array = iTranslator.is_array
        this.position_code = iTranslator.getCode()
        this.setCode(iTranslator.getCode())
        this.access_code = iTranslator.getCode()
        this.temporary = iTranslator.getTemporary()
      }
        break
      case tree_types.types.ARRAY_ACCESS: {
        const arrTranslator = new ArrayAccessStmtTranslator(this)
        arrTranslator.translate(INode)

        this.position_code = TranslatorHelpers.comment('array access param') + arrTranslator.access_code
        this.type = arrTranslator.getType()
        this.aux_type = arrTranslator.aux_type
        this.dimensions = arrTranslator.dimensions
        this.is_array = arrTranslator.is_array
        this.temporary = arrTranslator.getTemporary()
        this.access_code = arrTranslator.access_code
        this.setCode(this.access_code)
      }
        break
      case tree_types.types.DOT: {
        // console.log('dot');
        const objectAccessTranslator = new ObjectAccessTranslator(this)
        objectAccessTranslator.translate(INode)
        this.position_code = objectAccessTranslator.getCode()
        this.type = objectAccessTranslator.getType()
        this.aux_type = objectAccessTranslator.aux_type
        this.dimensions = objectAccessTranslator.dimensions
        this.is_array = objectAccessTranslator.is_array
        this.temporary = objectAccessTranslator.getTemporary()
        this.access_code = objectAccessTranslator.access_code
        this.setCode(this.access_code)
      }
        break
      case tree_types.types.FUNCTION_CALL: {
        // if this is a position the value itself should have a position, this has to be
        // run semantically
        const fCallTranslator = new FunctionCallTranslator(this)
        fCallTranslator.translate(INode)
        this.type = fCallTranslator.type
        this.aux_type = fCallTranslator.aux_type
        this.code = fCallTranslator.getCode()
        this.position_code = fCallTranslator.getCode()
        this.access_code = fCallTranslator.getCode()
        this.position_code = fCallTranslator.getCode()
        this.dimensions = fCallTranslator.dimensions
        this.is_array = fCallTranslator.dimensions
        this.temporary = fCallTranslator.getTemporary()
      }
        break
      case tree_types.types.NEW_ARRAY:

        this.type = this.parseType(INode.getChild(0).getType())
        this.aux_type = (this.type === CompilerTypes.OBJECT) ? Backend.Classes.getType(INode.getChild(0).getValue()) : null
        if (this.aux_type === -1) { throw Error(`UNABLE TO FIND THE SPECIFIED TYPE ${INode.getChild(0).getValue()}${this.parseSemanticError(INode.getChild(0))}`) }
        this.dimensions = INode.getChild(1).childrenSize()
        this.is_array = true

        if (INode.childrenSize() === 3) {
          const arrLiteral = new ArrayLiteralTranslator(this)
          arrLiteral.translate(INode.getChild(2))

          if (arrLiteral.dimensions !== this.dimensions) { throw Error('ARRAY LITERAL DOESN\'T HAVE THE SAME DIMENSIONS AS THE DECLARED ARRAY') }

          if (this.type !== arrLiteral.type || arrLiteral.aux_type !== this.aux_type) { throw Error(`ARRAY LITERAL IS NOT THE SAME VALUE AS DECLARED${this.parseSemanticError(INode)}`) }

          this.code = arrLiteral.getCode()
          this.temporary = arrLiteral.temporary
        } else {
          this.code = TranslatorHelpers.comment('ARRAY DECL NOT INITIALIZED INIT')
          this.code += TranslatorHelpers.moveHeapPointer(1)
          this.temporary = Generator.genTemporary()
          this.code += TranslatorHelpers.unaryAssign('H', this.temporary)
          this.code += ArrayDeclarationTranslator.translate(INode.getChild(1).getChildren())
        }
        this.position_code = this.code
        this.access_code = this.code
        break
      case tree_types.types.DOLLAR: {
        const exprTrans = new ExpressionTranslator(this)
        exprTrans.translate(INode.getChild(0))
        let code = exprTrans.getCode()
        this.position_code = exprTrans.getCode()
        this.type = exprTrans.getType()
        this.aux_type = exprTrans.aux_type
        this.access_code = exprTrans.access_code
        const pointerSize = Backend.SymbolTable.getSize()

        if (exprTrans.dimensions !== 0) {
          code += TranslatorHelpers.moveStackPointer(true, pointerSize + 1)
          code += TranslatorHelpers.generateStackAssign('P', exprTrans.getTemporary())
          code += TranslatorHelpers.functionCall('native_vector_linealize')
          code += TranslatorHelpers.generateStackAccess('P', exprTrans.getTemporary())
          code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)

          this.temporary = exprTrans.temporary
          this.type = exprTrans.type
          this.aux_type = exprTrans.aux_type
          this.code = code
          this.dimensions = exprTrans.dimensions
          this.is_array = true
        } else if (exprTrans.aux_type != null) {
          this.temporary = Generator.genTemporary()
          const symClass = Backend.ClassTemplates.get(exprTrans.aux_type)
          code += TranslatorHelpers.moveStackPointer(true, pointerSize + 1)
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
          code += TranslatorHelpers.generateStackAssign(this.temporary, exprTrans.getTemporary())
          code += TranslatorHelpers.arithmeticOperation('+', 'P', '2', this.temporary)
          code += TranslatorHelpers.generateStackAssign(this.temporary, symClass.getSize())
          code += TranslatorHelpers.comment('clonar parametro')
          code += TranslatorHelpers.functionCall('native_object_clone')
          code += TranslatorHelpers.generateStackAccess('P', this.temporary)
          code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)
        }
        this.position_code = code
        this.setCode(code)
      }
        break
      case tree_types.types.NEW:
        const constructorCall = new ConstructorCallTranslator(this)
        constructorCall.translate(this.iNode.getChild(0))
        this.copyInfo(constructorCall)
        this.aux_type = constructorCall.aux_type
        this.position_code = this.code
        this.access_code = this.code
        this.is_array = constructorCall.is_array
        this.dimensions = constructorCall.dimensions
        break
      case tree_types.types.NULL_LITERAL:
        this.type = CompilerTypes.OBJECT
        this.position_code = ''
        this.aux_type = CompilerTypes.NULL
        this.access_code = '0'
        this.dimensions = 0
        this.temporary = '0'
        this.is_array = false
        break
      case tree_types.types.NATIVE_FUNCTION_CALL:
      default: {
        const eTranslator = new ExpressionTranslator(this)
        eTranslator.translate(INode)

        /*
                 * Here we save all the temporary information of the parameters.
                 */
        this.type = eTranslator.getType()
        this.aux_type = eTranslator.aux_type
        this.setCode(eTranslator.getCode())
        this.access_code = eTranslator.getCode()
        this.temporary = eTranslator.getTemporary()
      }
        break
    }
  }
}

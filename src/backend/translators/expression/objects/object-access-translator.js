import { ExpressionBaseTranslator } from '../expression-base-translator'
import { tree_types } from '../../../ast/tree-types'
import { IdentifierTranslator } from '../identifier-translator'
import { Backend } from '../../../backend'
import { TranslatorHelpers } from '../../../generators/translator-helpers'
import { Generator } from '../../../generators/generator'
import { ArrayAccessStmtTranslator } from '../arrays/array-access-stmt-translator'
import { FunctionCallTranslator } from '../functions/function-call-translator'
import { CompilerTypes } from '../../../compiler-types'
import { ExpressionTranslator } from '../expression-translator'

export class ObjectAccessTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
    this.position_code = ''
    this.access_code = ''
    this.code = ''
  }

  translate (INode /* , SymTabImp symbols */) {
    this.iNode = INode

    /**
         * THERE ARE 6 TYPES POSSIBLE FOR LHS
         *      FUNCTION () (3) done
         *      THIS        (4) done
         *      SUPER       (5) done
         *      ARRAY       (4) done
         *      IDENTIFIER  (1) done
         *      DOT         (2) done
         *      CAST        (6) done
         * THERE ARE 2 POSSIBLES TYPES FOR RHS
         *      IDENTIFIER
         *
         */
    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)
    let code = ''

    const isLength = rightNode.getValue() === 'length'

    if (leftNode.getType() === tree_types.types.DOT) {
      const objectATranslator = new ObjectAccessTranslator(this)
      objectATranslator.translate(leftNode)
      code += objectATranslator.access_code

      if (objectATranslator.is_array) {
        if (isLength) {
          this.temporary = objectATranslator.temporary
          this.position_code = objectATranslator.access_code
          this.code = TranslatorHelpers.comment('length access')
          this.code += objectATranslator.access_code
          this.code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
          this.access_code = this.code
          this.type = CompilerTypes.INTEGER
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          return
        }
        throw Error(`THE LHS OF DOT OPERATOR IS OF TYPE ARRAY NOT OBJECT${this.parseSemanticError(INode)}`)
      }
      // console.log('entra acá en left node dot vez', code);
      const current = Backend.ClassTemplates.get(objectATranslator.aux_type)

      // this means that the trailed symboltable is null
      if (current == null) { throw Error(`UNABLE TO FIND THE SPECIFIED VALUE TYPE, MY ERROR ${this.parseSemanticError(this.iNode)}`) }

      let symbol = null

      if ((symbol = current.lookup(rightNode.getValue())) == null) { throw Error(`UNABLE TO FIND THE REQUESTED KEY ${identifier.toUpperCase()} ${this.parseSemanticError(this.iNode)}`) } else {
        this.temporary = objectATranslator.temporary
        code += TranslatorHelpers.comment('left hand dot access')
        code += TranslatorHelpers.arithmeticOperation('+', objectATranslator.getTemporary(), symbol.getPosition(), this.temporary)
        this.type = symbol.getType()
        this.aux_type = symbol.getAuxType()
        this.dimensions = symbol.dimensions
        this.is_array = symbol.is_array
      }

      this.position_code = code
      this.access_code = this.position_code + TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
      this.code = this.access_code
      // console.log(this.access_code);
    } else if (leftNode.getType() === tree_types.types.ARRAY_ACCESS) {
      const arrayATranslator = new ArrayAccessStmtTranslator(this)
      arrayATranslator.translate(leftNode)
      code += arrayATranslator.access_code

      if (arrayATranslator.is_array) {
        if (isLength) {
          this.temporary = arrayATranslator.temporary
          this.code = TranslatorHelpers.comment('length access')
          this.position_code = arrayATranslator.access_code
          this.code += arrayATranslator.access_code
          this.code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
          this.access_code = this.code + ''
          this.type = CompilerTypes.INTEGER
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          return
        }
        throw Error(`THE LHS OF DOT OPERATOR IS OF TYPE ARRAY NOT OBJECT${this.parseSemanticError(INode)}`)
      }

      const current = Backend.ClassTemplates.get(arrayATranslator.aux_type)
      // this means that the trailed symboltable is null
      if (current == null) { throw Error(`UNABLE TO FIND THE SPECIFIED VALUE TYPE, MY ERROR ${this.parseSemanticError(this.iNode)}`) }

      let symbol = null

      if ((symbol = current.lookup(rightNode.getValue())) == null) { throw Error(`UNABLE TO FIND THE REQUESTED KEY ${identifier.toUpperCase()} ${this.parseSemanticError(this.iNode)}`) } else {
        this.temporary = arrayATranslator.temporary
        code += TranslatorHelpers.comment('left hand dot access')
        code += TranslatorHelpers.arithmeticOperation('+', arrayATranslator.getTemporary(), symbol.getPosition(), this.temporary)
        this.type = symbol.getType()
        this.aux_type = symbol.getAuxType()
        this.dimensions = symbol.dimensions
        this.is_array = symbol.is_array
      }

      this.position_code = code
      this.access_code = this.position_code + TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
      this.code = this.access_code
    } else if (leftNode.getType() === tree_types.types.IDENTIFIER) {
      const idTrans = new IdentifierTranslator(this)
      idTrans.translate(leftNode)

      if (idTrans.is_array) {
        if (isLength) {
          this.temporary = idTrans.temporary
          this.code = TranslatorHelpers.comment('length access')
          this.code += idTrans.code
          this.position_code = idTrans.code
          this.code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
          this.access_code = this.code + ''
          this.type = CompilerTypes.INTEGER
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          return
        }
        throw Error(`THE LHS OF DOT OPERATOR IS OF TYPE ARRAY NOT OBJECT${this.parseSemanticError(INode)}`)
      }

      if (idTrans.aux_type == null) { throw Error(`LEFT HAND SIDE OF DOT OPERATION IS NOT OF TYPE OBJECT ${leftNode.getValue()}${this.parseSemanticError(leftNode)}`) }

      const symTab = Backend.ClassTemplates.get(idTrans.aux_type)

      /**
             * now we check the only possible rhs
             *      IDENTIFIER
            */
      let symbol = null
      if ((symbol = symTab.lookup(rightNode.getValue())) == null) { throw Error(`UNABLE TO FIND RIGHT HAND SIDE OF DOT OPERATION AT ${this.parseSemanticError(rightNode)}`) }

      // position code
      // here we have the object access
      this.temporary = Generator.genTemporary()
      this.position_code = idTrans.getCode()
      this.position_code += TranslatorHelpers.arithmeticOperation('+', idTrans.temporary, symbol.getPosition(), this.temporary)
      // access code
      this.access_code = this.position_code + ''
      this.access_code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
      this.aux_type = symbol.getAuxType()
      this.type = symbol.getType()
      this.dimensions = symbol.dimensions
      this.is_array = symbol.is_array
      this.code = this.access_code
    } else if (leftNode.getType() === tree_types.types.FUNCTION_CALL) {
      const fcall = new FunctionCallTranslator(this)
      fcall.translate(leftNode)
      this.temporary = fcall.temporary
      this.position_code = fcall.code

      if (fcall.is_array) {
        if (isLength) {
          this.temporary = fcall.temporary
          this.position_code = fcall.code
          this.code = TranslatorHelpers.comment('length access')
          this.code += fcall.code
          this.code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
          this.access_code = code
          this.type = CompilerTypes.INTEGER
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          return
        }
        throw Error(`THE LHS OF DOT OPERATOR IS OF TYPE ARRAY NOT OBJECT${this.parseSemanticError(INode)}`)
      }
      /**
             * WE NOW SEARCH FOR THE SPECIFIED TYPE
             */
      const currSymTab = Backend.ClassTemplates.get(fcall.aux_type)
      if (currSymTab === undefined) { throw Error(`LHS DIDN'T RETURN A VALID OBJECT TYPE${this.parseSemanticError(leftNode)}`) }

      const symbol = currSymTab.lookup(rightNode.getValue())
      if (symbol === null) {
        throw Error(`UNABLE TO FIND THE VARIABLE ${rightNode.getValue()} IN CURRENT ENV${this.parseSemanticError(INode)}`)
      }

      this.aux_type = symbol.getAuxType()
      this.type = symbol.getType()
      this.dimensions = symbol.dimensions
      this.is_array = symbol.is_array

      this.position_code += TranslatorHelpers.arithmeticOperation('+', this.temporary, symbol.getPosition(), this.temporary)
      this.access_code = this.position_code + TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
      this.code = this.access_code
    } else if (leftNode.getType() === tree_types.types.CAST) {
      const expr = new ExpressionTranslator(this)
      expr.translate(leftNode)

      this.position_code = expr.code
      const currSymTab = Backend.ClassTemplates.get(expr.aux_type)
      if (currSymTab === undefined) { throw Error(`LHS DIDN'T RETURN A VALID OBJECT TYPE${this.parseSemanticError(leftNode)}`) }

      const symbol = currSymTab.lookup(rightNode.getValue())
      if (symbol === null) {
        throw Error(`UNABLE TO FIND THE VARIABLE ${rightNode.getValue()} IN CURRENT ENV${this.parseSemanticError(INode)}`)
      }

      this.temporary = expr.temporary
      this.aux_type = symbol.getAuxType()
      this.type = symbol.getType()
      this.dimensions = symbol.dimensions
      this.is_array = symbol.is_array

      this.position_code += TranslatorHelpers.arithmeticOperation('+', this.temporary, symbol.getPosition(), this.temporary)
      this.access_code = this.position_code + TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
      this.code = this.access_code
    } else { throw Error(`UNABLE TO PERFORM DOT ACCESS ON LHS ${tree_types.names[leftNode.getType()]}${this.parseSemanticError(INode)}`) }
  }
}

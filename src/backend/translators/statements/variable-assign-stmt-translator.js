import { tree_types } from '../../ast/tree-types'
import { ExpressionTranslator } from '../expression/expression-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { IdentifierTranslator } from '../expression/identifier-translator'
import { ObjectAccessTranslator } from '../expression/objects/object-access-translator'
import { ArrayAccessStmtTranslator } from '../expression/arrays/array-access-stmt-translator'
import { ExpressionBaseTranslator } from '../expression/expression-base-translator'
import { Backend } from '../../backend'
import { Generator } from '../../generators/generator'
import { CompilerTypes } from '../../compiler-types'

export class VariableAssignStmtTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode

    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)

    const expressionTranslator = new ExpressionTranslator(this)
    expressionTranslator.translate(rightNode)
    this.code += expressionTranslator.getCode()

    /**
         * Here we check if there is a register in the left side, in case there is one
         * then the left hand side must only be either new or either null
         */

    if (leftNode.getType() === tree_types.types.ARRAY_ACCESS) {
      const arrayAccessStmtTranslator = new ArrayAccessStmtTranslator(this)
      arrayAccessStmtTranslator.translate(INode.getChild(0))

      if (arrayAccessStmtTranslator.type !== expressionTranslator.type || arrayAccessStmtTranslator.aux_type != expressionTranslator.aux_type ||
                (expressionTranslator.is_array && !arrayAccessStmtTranslator.is_array) || (expressionTranslator.dimensions != arrayAccessStmtTranslator.dimensions)) {
        if (!this.typeChecking(arrayAccessStmtTranslator.type, arrayAccessStmtTranslator.aux_type, arrayAccessStmtTranslator.dimensions, expressionTranslator.type, expressionTranslator.aux_type, expressionTranslator.dimensions)) { throw `UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(INode)}` } else { this.code += TranslatorHelpers.comment('impilicit cast' + this.iNode.line + ' ' + this.iNode.column) }
      }

      this.code += arrayAccessStmtTranslator.position_code
      this.code += TranslatorHelpers.generateHeapAssign(arrayAccessStmtTranslator.temporary, expressionTranslator.temporary)
      this.temporary = expressionTranslator.temporary
      this.type = expressionTranslator.type
      this.aux_type = expressionTranslator.aux_type
      this.dimensions = arrayAccessStmtTranslator.dimensions
      this.is_array = arrayAccessStmtTranslator.is_array
      // this.setCode(code);
      return
    }

    if (leftNode.getType() === tree_types.types.DOT) {
      /*
             * FIX: HERE WE DO NOT USE SOME TEMPORARY AND LABELS, WE CAN FIX IT BY STORING
             * IT, BUT ONLY IF NEEDED
             */
      const oAccessTranslator = new ObjectAccessTranslator(this)
      oAccessTranslator.translate(leftNode)

      this.code = expressionTranslator.code + oAccessTranslator.position_code
      if (oAccessTranslator.type !== expressionTranslator.type || oAccessTranslator.aux_type !== expressionTranslator.aux_type ||
                expressionTranslator.dimensions !== oAccessTranslator.dimensions) {
        if (!this.typeChecking(oAccessTranslator.type, oAccessTranslator.aux_type, oAccessTranslator.dimensions, expressionTranslator.type, expressionTranslator.aux_type, expressionTranslator.dimensions)) { throw `UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(INode)}` } else { this.code += TranslatorHelpers.comment('impilicit cast' + this.iNode.line + ' ' + this.iNode.column) }
      }

      // TODO: typechecking
      this.code += TranslatorHelpers.generateHeapAssign(oAccessTranslator.temporary, expressionTranslator.temporary)
      this.temporary = oAccessTranslator.temporary
      this.type = expressionTranslator.type
      this.aux_type = expressionTranslator.aux_type
      this.dimensions = oAccessTranslator.dimensions
      this.is_array = oAccessTranslator.is_array
      return
    }

    if (leftNode.getType() === tree_types.types.IDENTIFIER) {
      const idTrans = new IdentifierTranslator(this)
      idTrans.translate(leftNode)

      if (idTrans.isConstant) {
        throw new Error(`UNABLE TO REASIGN A VALUE TO A CONSTANT VARIABLE ${leftNode.getValue()}`)
      }

      // hotfix for var
      if (idTrans.aux_type === Backend.Classes.getType('var')) {
        this.code = expressionTranslator.code + idTrans.code
        this.code += TranslatorHelpers.comment('variable assign in heap para var / global')
        this.code += TranslatorHelpers.generateHeapAssign(idTrans.temporary, expressionTranslator.temporary)
        this.code += TranslatorHelpers.arithmeticOperation('+', idTrans.temporary, '1', idTrans.temporary)
        this.code += TranslatorHelpers.generateHeapAssign(idTrans.temporary, (expressionTranslator.type === CompilerTypes.OBJECT) ? expressionTranslator.aux_type : expressionTranslator.type)
        this.temporary = expressionTranslator.temporary
        this.type = CompilerTypes.OBJECT
        this.aux_type = idTrans.aux_type
        this.dimensions = 0
        this.is_array = false
        return
      }
      // i changed the idTrans position_code to getCode()
      if (idTrans.type !== expressionTranslator.type || idTrans.aux_type !== expressionTranslator.aux_type ||
                expressionTranslator.dimensions !== idTrans.dimensions) {
        // try implicit cast
        if (!this.typeChecking(idTrans.type, idTrans.aux_type, idTrans.dimensions, expressionTranslator.type, expressionTranslator.aux_type, expressionTranslator.dimensions)) { throw Error(`UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(INode)}`) } else { this.code += TranslatorHelpers.comment('impilicit cast' + this.iNode.line + ' ' + this.iNode.column) }
      }

      this.code = expressionTranslator.code + idTrans.position_code

      if (idTrans.stack === 1) {
        this.code += TranslatorHelpers.comment('variable assign in stack')
        this.code += TranslatorHelpers.generateStackAssign(idTrans.temporary, expressionTranslator.temporary)
        this.temporary = expressionTranslator.temporary
      } else {
        this.code += TranslatorHelpers.comment('variable assign in heap')
        this.code += TranslatorHelpers.generateHeapAssign(idTrans.temporary, expressionTranslator.temporary)
        this.temporary = expressionTranslator.temporary
      }

      this.type = idTrans.type
      this.aux_type = idTrans.aux_type
      this.dimensions = idTrans.dimensions
      this.is_array = idTrans.is_array
    }
  }
}

import { tree_types } from '../../../ast/tree-types'
import { ExpressionBaseTranslator } from '../../expression/expression-base-translator'
import { IdentifierTranslator } from '../identifier-translator'
import { TranslatorHelpers } from '../../../generators/translator-helpers'
import { ObjectAccessTranslator } from '../objects/object-access-translator'
import { ExpressionTranslator } from '../expression-translator'
import { Generator } from '../../../generators/generator'
import { Backend } from '../../../backend'
import { FunctionCallTranslator } from '../functions/function-call-translator'

export class ArrayAccessStmtTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
    this.position_code = ''
    this.access_code = ''
  }

  translate (INode /* , SymTabImp symbols */) {
    this.iNode = INode
    const tHelper = Generator.genTemporary()
    /**
         * There are only three possibilities to access in this function, one is the id,
         *      1. DOT          done
         *      2. FUNCTION     done
         *      3. IDENTIFIER   done
         */

    const left_node = INode.getChild(0)

    // now we have all the parameters, we just need to move the array in
    // lexicographic mode

    if (left_node.getType() === tree_types.types.DOT) {
      const oAccessTranslator = new ObjectAccessTranslator(this)
      oAccessTranslator.translate(left_node)

      // so now i have the the symbol that represents the array since i already have
      // the position
      // this.code += oAccessTranslator.position_code;
      // it is an attribute so we procede with the temporary value it brings

      this.code = TranslatorHelpers.comment('ARRAY ACCESS OBJECT ACCESS')
      this.code += oAccessTranslator.access_code

      // we get the temporary to access the data
      this.temporary = oAccessTranslator.temporary
      const eList = this.fillParameterList(INode)

      for (let j = 0; j < eList.length; j++) {
        this.code += eList[j].code
        // generate the arithmetic size checking
        this.code += TranslatorHelpers.generateHeapAccess(this.temporary, tHelper)
        this.code += TranslatorHelpers.comment('IOB')
        this.code += TranslatorHelpers.conditionalJMP('>=', eList[j].temporary, tHelper, Backend.ErrorsLabels.get('indexoutofbounds'))
        this.code += TranslatorHelpers.arithmeticOperation('+', this.temporary, '1', this.temporary)
        this.code += TranslatorHelpers.arithmeticOperation('+', this.temporary, eList[j].temporary, this.temporary)

        if (j === eList.length - 1) {
          this.position_code = this.code + ''
        }
        this.code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
        this.access_code = this.code
      }

      /**
             * WE RETURN ALL THE DATA INFO
            */

      this.dimensions = (oAccessTranslator.dimensions == eList.length) ? 0 : (oAccessTranslator.dimensions - eList.length)
      this.is_array = oAccessTranslator.dimensions != eList.length
      this.aux_type = oAccessTranslator.aux_type
      this.type = oAccessTranslator.type
    } else if (left_node.getType() === tree_types.types.IDENTIFIER) {
      const idTrans = new IdentifierTranslator(this)
      idTrans.translate(left_node)

      if (!idTrans.is_array) { throw `LEFT HAND SIDE IS NOT OF TYPE ARRAY ${left_node.getValue()}${this.parseSemanticError(left_node)}` }

      if (idTrans.dimensions < this.iNode.childrenSize() - 1) { throw `CAN'T ACCESS THE ARRAY, REQUESTED DIMENSIONS ARE BIGGER THAN DEFINED${this.parseSemanticError(this.iNode)}` }

      this.code = TranslatorHelpers.comment('ARRAY ACCESS IDENTIFIER')
      this.code += idTrans.code

      // we get the temporary to access the data
      this.temporary = idTrans.temporary
      const eList = this.fillParameterList(INode)

      for (let j = 0; j < eList.length; j++) {
        this.code += eList[j].code
        // generate the arithmetic size checking
        this.code += TranslatorHelpers.generateHeapAccess(this.temporary, tHelper)
        this.code += TranslatorHelpers.conditionalJMP('>=', eList[j].temporary, tHelper, Backend.ErrorsLabels.get('indexoutofbounds'))
        this.code += TranslatorHelpers.arithmeticOperation('+', this.temporary, '1', this.temporary)
        this.code += TranslatorHelpers.arithmeticOperation('+', this.temporary, eList[j].temporary, this.temporary)

        if (j === eList.length - 1) {
          this.position_code = this.code + ''
        }
        this.code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
        this.access_code = this.code
      }

      /**
             * WE RETURN ALL THE DATA INFO
            */

      this.dimensions = (idTrans.dimensions == eList.length) ? 0 : (idTrans.dimensions - eList.length)
      this.is_array = idTrans.dimensions != eList.length
      this.aux_type = idTrans.aux_type
      this.type = idTrans.type
    } else if (left_node.getType() == tree_types.types.FUNCTION_CALL) {
      const funcCall = new FunctionCallTranslator(this)
      funcCall.translate(left_node)

      if (!funcCall.is_array) { throw `LEFT HAND SIDE FUNCTION CALL IS NOT OF TYPE ARRAY ${left_node.getValue()}${this.parseSemanticError(left_node)}` }

      if (funcCall.dimensions < this.iNode.childrenSize() - 1) { throw `CAN'T ACCESS THE ARRAY, REQUESTED DIMENSIONS ARE BIGGER THAN DEFINED${this.parseSemanticError(this.iNode)}` }

      this.code = TranslatorHelpers.comment('ARRAY ACCESS FROM FUNCTION CALL')
      this.code += funcCall.code

      // we get the temporary to access the data
      this.temporary = funcCall.temporary
      const eList = this.fillParameterList(INode)

      for (let j = 0; j < eList.length; j++) {
        this.code += eList[j].code
        // generate the arithmetic size checking
        this.code += TranslatorHelpers.generateHeapAccess(this.temporary, tHelper)
        this.code += TranslatorHelpers.conditionalJMP('>=', eList[j].temporary, tHelper, Backend.ErrorsLabels.get('indexoutofbounds'))
        this.code += TranslatorHelpers.arithmeticOperation('+', this.temporary, '1', this.temporary)
        this.code += TranslatorHelpers.arithmeticOperation('+', this.temporary, eList[j].temporary, this.temporary)

        if (j === eList.length - 1) {
          this.position_code = this.code + ''
        }
        this.code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
        this.access_code = this.code
      }

      /**
             * WE RETURN ALL THE DATA INFO
            */

      this.dimensions = (funcCall.dimensions == eList.length) ? 0 : (funcCall.dimensions - eList.length)
      this.is_array = funcCall.dimensions != eList.length
      this.aux_type = funcCall.aux_type
      this.type = funcCall.type
    } else { throw `UNABLE TO ACCESS A VARIABLE THAT IS NOT OF TYPE ARRAY ${this.parseSemanticError(INode)}` }
  }

  fillParameterList (iNode) {
    const eList = []

    for (let i = 1; i < iNode.childrenSize(); i++) {
      if (iNode.getChild(i).getType() == tree_types.types.EXPRESSION_LIST) {
        for (const eNode of iNode.getChild(i).getChildren()) {
          const eTranslator = new ExpressionTranslator(this)
          eTranslator.translate(eNode)
          eList.add(eTranslator)
        }
      } else {
        const eTranslator = new ExpressionTranslator(this)
        eTranslator.translate(iNode.getChild(i))
        eList.push(eTranslator)
      }
    }

    return eList
  }

  getCode () {
    return this.access_code
  }
}

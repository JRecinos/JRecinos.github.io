import { ExpressionBaseTranslator } from '../expression-base-translator'
import { TranslatorHelpers } from '../../../generators/translator-helpers'
import { Generator } from '../../../generators/generator'
import { ParameterTranslator } from '../parameters/parameter-translator'
import { tree_types } from '../../../ast/tree-types'
import { CompilerTypes } from '../../../compiler-types'
import { Backend } from '../../../backend'

export class FunctionCallParameterNamesTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
    this.pointerInfo = ''
    this.auxTemporary = ''
  }

  translate (INode) {
    this.iNode = INode
    // Here we lookup by index, first we should get the identifier and the symbol
    // first we should get all the params
    const pList = INode.lookupByType(tree_types.types.EXPRESSION_LIST)
    let identifier
    const pointerSize = Backend.SymbolTable.getSize()

    this.temporary = Generator.genTemporary()

    if (this.iNode.getChild(0).getType() === tree_types.types.DOT) {
      throw Error(`CAN'T USE THIS KIND OF CALL (BY PARAMETERS NAME) WITH CURRENT LHS${this.parseSemanticError(this.iNode)}`)
    } else {
      identifier = INode.getChild(0).getValue().toLowerCase()
    }

    let code = ''
    const pEList = []
    const nList = []

    if (pList != null) {
      for (const pNode of pList.getChildren()) {
        pEList.push(new ParameterTranslator(this))
        pEList[pEList.length - 1].translate(pNode.getChild(1))
        nList.push(pNode.getChild(0).getValue())
      }
    }
    const current = Backend.SymbolTable

    if (current === undefined || current == null) { throw Error(`NULL POINTER EXCEPTION UNABLE TO FIND A VALID OBJECT TYPE IN LHS${this.parseSemanticError(lhs)}`) }

    // we lookup for the func itself
    let func
    const filters = []
    do {
      func = current.lookupFunction(identifier, filters)

      if (func == null) { throw Error(`${identifier} WASN'T FOUND IN THE CURRENT ENVIRONMENT ${this.parseSemanticError(this.iNode)}`) } else {
        if (pEList.length === 0 && func.getParameters() == null) { break }

        if (pEList.length !== 0 && func.getParameters() == null) {
          filters.push(func)
          continue
        }

        if (func.getParameters() != null && func.getParameters().length === pEList.length) {
          code = ''

          if (!this.parameterCheckingByName(pEList, func.getParameters(), nList)) {
            filters.push(func)
            continue
          }

          // console.log('supuestamente cambiaron', pEList)

          for (let j = 0; j < pEList.length; j++) {
            if (!func.getParameters()[j][2]) { code += pEList[j].getCode() } else {
              if (pEList[j].position_code == null) {
                throw Error(`EXPECTED A VARIABLE IN THE PARAMETER BY REF NUMBER (${j}) IN ${identifier}
                                                ${this.parseSemanticError(this.iNode)}`)
              }
              code += (pEList[j].stack === 1) ? pEList[j].getCode() : pEList[j].position_code
            }
          }

          break
        } else {
          filters.push(func)
          continue
        }
      }
    } while (func != null)

    if (func == null) { throw Error(`FUNCTION OR PROCEDURE WITH NAME ${identifier} NOT FOUND ${this.parseSemanticError(this.iNode)}`) }

    // CODE GENERATION FOR func CALL
    /* let stackPointer = Generator.genTemporary();
        code += TranslatorHelpers.unaryAssign("P", stackPointer);
        */
    /*
         * here we need to check if we are calling from main, if we are, then we move it
         * by 1 else we move it by the current environment size
         */
    // CHECK IF POINTER INFO IS PASSED
    let lastTemporary = -1
    /*
      this line was commented because we killed pointerInfo
     */
    // code += (this.pointerInfo !== '') ? this.pointerInfo : ''
    code += TranslatorHelpers.moveStackPointer(true, pointerSize + 1)
    // get init and final
    code += TranslatorHelpers.generateTmpStackSave(Backend.Display.FunctionCallStack[Backend.Display.FunctionCallStack.length - 1][1],
      (lastTemporary = Generator.getTemporary() - 1))
    // code += TranslatorHelpers.comment('aca se supone que se pasa el this')
    // code += TranslatorHelpers.generateStackAssign('P', this.temporary)
    code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
    // code += TranslatorHelpers.generateStackAssign(this.temporary, stackPointer);
    // code += TranslatorHelpers.arithmeticOperation("+", "1", this.temporary, this.temporary);

    for (let j = 0; j < pEList.length; j++) {
      if (!func.getParameters()[j][2]) {
        // by value
        code += TranslatorHelpers.comment('param by value')
        code += TranslatorHelpers.generateStackAssign(this.temporary, pEList[j].temporary)
        code += TranslatorHelpers.arithmeticOperation('+', this.temporary, '1', this.temporary)
      } else {
        // here the thing goes by reference
        code += TranslatorHelpers.comment('param by ref')
        code += TranslatorHelpers.generateStackAssign(this.temporary, pEList[j].temporary)
        code += TranslatorHelpers.arithmeticOperation('+', this.temporary, '1', this.temporary)
      }
    }

    code += TranslatorHelpers.functionCall(func.functionId)

    if (func.getRol() === CompilerTypes.FUNCTION) {
      this.temporary = Generator.genTemporary()
      code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
      code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
      code += TranslatorHelpers.comment('return in position P + 1')
    }

    code += TranslatorHelpers.generateTmpStackRecover(Backend.Display.FunctionCallStack[Backend.Display.FunctionCallStack.length - 1][1],
      lastTemporary)

    code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)

    this.setCode(code)
    this.type = func.getType()
    this.aux_type = func.getAuxType()
    this.dimensions = func.dimensions
    this.is_array = func.dimensions !== 0
  }

  parameterCheckingByName (pEList, params, name) {
    /**
     * We must order the parameter
     * params has the correct order
     * pEList should change to match params
     */
    const paramOrder = []
    for (let i = 0, index = 0; i < pEList.length; i++) {
      index = name.indexOf(params[i][0])

      if (index === -1) { throw Error(`UNKOWN PARAMETER NAME ${name[i]} IN FUNCTION CALL${this.parseSemanticError(this.iNode)}`) }

      if (!this.typeChecking(params[i][1], params[i][3], params[i][4], pEList[index].getType(), pEList[index].getAuxType(), pEList[index].dimensions)) { return false }
      paramOrder.push(pEList[index])
    }

    // clean the old array
    pEList.splice(0, pEList.length)

    // we take this approach case we need to change the primary array
    for (const el of paramOrder) {
      pEList.push(el)
    }

    return true
  }
}

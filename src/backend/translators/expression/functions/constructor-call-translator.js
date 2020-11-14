import { ExpressionBaseTranslator } from '../expression-base-translator'
import { TranslatorHelpers } from '../../../generators/translator-helpers'
import { Generator } from '../../../generators/generator'
import { ParameterTranslator } from '../parameters/parameter-translator'
import { tree_types } from '../../../ast/tree-types'
import { CompilerTypes } from '../../../compiler-types'
import { Backend } from '../../../backend'

export class ConstructorCallTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode
    // Here we lookup by index, first we should get the identifier and the symbol
    // first we should get all the params

    const pList = INode.lookupByType(tree_types.types.EXPRESSION_LIST)
    const identifier = INode.getChild(0).getValue()

    let code
    const pEList = []

    if (pList != null) {
      for (const pNode of pList.getChildren()) {
        pEList.push(new ParameterTranslator(this))
        pEList[pEList.length - 1].translate(pNode)
        // code += pEList.peek().getCode();
        // here we check the info and the types
      }
    }

    const pointer_size = Backend.SymbolTable.size + 1
    // console.log('Constructor', Backend.SymbolTable, pointer_size);
    const SymToLookup = Backend.ClassTemplates.get(Backend.Classes.getType(identifier))
    // we lookup for the func itself
    let func

    const filters = []
    do {
      func = SymToLookup.lookupFunction(identifier, filters)

      if (func == null) { throw `CONSTRUCTOR FOR ${identifier} DOESN'T MATCH ANY DECLARED OR CREATED BY DEFAULT ${this.parseSemanticError(this.iNode)}` } else {
        if (func.getRol() != CompilerTypes.CONSTRUCTOR) {
          filters.push(func)
          continue
        }

        if (pEList.length === 0 && func.getParameters() == null) { break }

        if (pEList.length !== 0 && func.getParameters() == null) {
          filters.push(func)
          continue
        }

        if (func.getParameters() != null && func.getParameters().length == pEList.length) {
          code = TranslatorHelpers.comment('constructor call begin')

          if (!this.parameterChecking(pEList, func.getParameters())) {
            filters.push(func)
            continue
          }

          for (let j = 0; j < pEList.length; j++) {
            if (!func.getParameters()[j][2]) { code += pEList[j].getCode() } else {
              if (pEList[j].position_code == null) {
                throw `EXPECTED A VARIABLE IN THE PARAMETER BY REF NUMBER (${j}) IN ${identifier}
                                                ${this.parseSemanticError(this.iNode)}`
              }
              code += (pEList[j].stack === 0) ? pEList[j].getCode() : pEList[j].position_code
            }
          }

          break
        } else {
          filters.push(func)
          continue
        }
      }
    } while (func != null)

    if (func == null) { throw ` CONSTRUCTOR FOR ${identifier} NOT FOUND ${this.parseSemanticError(this.iNode)}` }

    // CODE GENERATION FOR func CALL
    /* let stackPointer = Generator.genTemporary();
        code += TranslatorHelpers.unaryAssign("P", stackPointer); */
    this.temporary = Generator.genTemporary()
    /*
         * here we need to check if we are calling from main, if we are, then we move it
         * by 1 else we move it by the current environment size
         */
    let lastTemporary = -1
    code += TranslatorHelpers.moveStackPointer(true, pointer_size)
    // get init and final
    code += TranslatorHelpers.generateTmpStackSave(Backend.Display.FunctionCallStack[Backend.Display.FunctionCallStack.length - 1][1],
      (lastTemporary = Generator.getTemporary() - 1))
    // code += TranslatorHelpers.moveStackPointer(true, 1);
    code += TranslatorHelpers.comment('aca se supone que se pasa el this')
    code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', this.temporary)
    // code += TranslatorHelpers.generateStackAssign(this.temporary, stackPointer);
    // code += TranslatorHelpers.arithmeticOperation("+", "1", this.temporary, this.temporary);

    for (let j = 0; j < pEList.length; j++) {
      if (!func.getParameters()[j][2]) {
        // by value
        code += TranslatorHelpers.comment('param by value')
        code += TranslatorHelpers.generateStackAssign(this.temporary, pEList[j].getTemporary())
        code += TranslatorHelpers.arithmeticOperation('+', '1', this.temporary, this.temporary)
      } else {
        // here the thing goes by reference
        code += TranslatorHelpers.comment('param by ref')
        // code += pEList[j].position_code;
        code += TranslatorHelpers.generateStackAssign(this.temporary, pEList[j].temporary)
        code += TranslatorHelpers.arithmeticOperation('+', this.temporary, '1', this.temporary)
      }
    }

    code += TranslatorHelpers.functionCall(func.functionId)
    code += TranslatorHelpers.generateStackAccess('P', this.temporary)
    code += TranslatorHelpers.generateTmpStackRecover(Backend.Display.FunctionCallStack[Backend.Display.FunctionCallStack.length - 1][1],
      lastTemporary)
    code += TranslatorHelpers.moveStackPointer(false, pointer_size)

    this.setCode(code)
    this.type = func.getType()
    this.aux_type = func.getAuxType()
  }

  parameterChecking (pEList, params) {
    // implicit cast
    for (let i = 0; i < pEList.length; i++) {
      if (!this.typeChecking(params[i][1], params[i][3], params[i][4],
        pEList[i].getType(), pEList[i].getAuxType(), pEList[i].dimensions)) { return false }
    }

    return true
  }
}

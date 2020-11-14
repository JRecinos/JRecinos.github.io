import { ExpressionBaseTranslator } from '../expression-base-translator'
import { TranslatorHelpers } from '../../../generators/translator-helpers'
import { Generator } from '../../../generators/generator'
import { ParameterTranslator } from '../parameters/parameter-translator'
import { tree_types } from '../../../ast/tree-types'
import { CompilerTypes } from '../../../compiler-types'
import { Backend } from '../../../backend'
import { ExpressionTranslator } from '../expression-translator'
import { FunctionCallParameterNamesTranslator } from './function-call-parameter-names-translator'

export class FunctionCallTranslator extends ExpressionBaseTranslator {
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
    let fromObject = false
    const pointerSize = Backend.SymbolTable.getSize()

    this.temporary = Generator.genTemporary()

    if (this.iNode.getChild(0).getType() === tree_types.types.DOT) {
      identifier = this.iNode.getChild(0).getChild(1).getValue().toLowerCase()
      fromObject = true
    } else {
      identifier = INode.getChild(0).getValue().toLowerCase()
    }

    let code = ''
    const pEList = []

    // hotfix for functions by name
    if (pList != null) {
      let cx = 0
      for (const pNode of pList.getChildren()) {
        if (pNode.getType() === tree_types.types.EQ) { cx += 1 }
      }
      if (cx === pList.childrenSize()) {
        const funcByParameter = new FunctionCallParameterNamesTranslator(this)
        funcByParameter.translate(INode)

        this.aux_type = funcByParameter.aux_type
        this.type = funcByParameter.type
        this.temporary = funcByParameter.temporary
        this.code = funcByParameter.code
        this.is_array = funcByParameter.is_array
        this.dimensions = funcByParameter.dimensions
        return
      }
    }

    if (pList != null) {
      for (const pNode of pList.getChildren()) {
        pEList.push(new ParameterTranslator(this))
        if (fromObject && identifier === 'instanceof') { continue }
        pEList[pEList.length - 1].translate(pNode)
        // code += pEList.peek().getCode();
        // here we check the info and the types
      }
    }

    const current = Backend.SymbolTable

    if (fromObject) {
      const lhs = this.iNode.getChild(0).getChild(0)

      const expression = new ExpressionTranslator(lhs)
      expression.translate(lhs)
      code += expression.code

      if (expression.type === CompilerTypes.STRING) {
        if (['touppercase', 'tolowercase', 'tochararray', 'length', 'charat'].includes(identifier)) {
          if (identifier === 'charat') {
            if (pEList.length !== 1) {
              throw Error(`UNABLE TO CALL ${identifier} ON STRING BECAUSE OF PARAMS${this.parseSemanticError(this.iNode)}`)
            }
            const tmp = Generator.genTemporary()
            code += pEList[0].code
            code += TranslatorHelpers.moveStackPointer(true, pointerSize + 1)
            // code += TranslatorHelpers.generateStackAssign('P', expression.temporary)
            code += TranslatorHelpers.arithmeticOperation('+', 'P', 1, tmp)
            code += TranslatorHelpers.generateStackAssign(tmp, expression.getTemporary())
            code += TranslatorHelpers.arithmeticOperation('+', 'P', 2, tmp)
            code += TranslatorHelpers.generateStackAssign(tmp, pEList[0].getTemporary())
            code += TranslatorHelpers.functionCall('native_string_charat')
            code += TranslatorHelpers.generateStackAccess('P', this.temporary)
            code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)

            this.type = CompilerTypes.CHAR
            this.aux_type = null
            this.code = code
            this.dimensions = 0
            this.is_array = false
            return
          }

          if (pEList.length !== 0) {
            throw Error(`UNABLE TO CALL ${identifier} ON STRING${this.parseSemanticError(this.iNode)}`)
          }

          code += TranslatorHelpers.moveStackPointer(true, pointerSize + 1)
          code += TranslatorHelpers.generateStackAssign('P', expression.temporary)

          if (identifier === 'length') {
            const tmp = Generator.genTemporary()
            code += TranslatorHelpers.arithmeticOperation('+', 'P', 1, tmp)
            code += TranslatorHelpers.generateStackAssign(tmp, expression.getTemporary())
            code += TranslatorHelpers.functionCall('java_string_length')
            code += TranslatorHelpers.generateStackAccess('P', this.temporary)
            code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)

            this.type = CompilerTypes.INTEGER
            this.aux_type = null
            this.code = code
            this.dimensions = 0
            this.is_array = false
            return
          }

          if (identifier === 'tochararray') {
            code += TranslatorHelpers.functionCall('java_string_to_chararray')
            code += TranslatorHelpers.generateStackAccess('P', this.temporary)
            code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)

            this.type = CompilerTypes.CHAR
            this.aux_type = null
            this.code = code
            this.dimensions = 1
            this.is_array = true
            return
          }

          if (identifier === 'touppercase') { code += TranslatorHelpers.functionCall('java_string_to_uppercase') } else if (identifier === 'tolowercase') { code += TranslatorHelpers.functionCall('java_string_to_lowercase') }
          code += TranslatorHelpers.generateStackAccess('P', this.temporary)
          code += TranslatorHelpers.moveStackPointer(false, pointerSize + 1)

          this.type = CompilerTypes.STRING
          this.aux_type = null
          this.code = code
          this.dimensions = 0
          this.is_array = false
          return
        } else { throw Error(`UNABLE TO CALL ${identifier} ON STRING${this.parseSemanticError(this.iNode)}`) }
      } else if (expression.dimensions !== 0) {
        if (pEList.length !== 0) {
          throw Error(`UNABLE TO CALL ${identifier} ON ARRAY${this.parseSemanticError(this.iNode)}`)
        }

        if (identifier === 'linealize') {
          code += TranslatorHelpers.generateStackAssign('P', expression.getTemporary())
          code += TranslatorHelpers.functionCall('native_vector_linealize')
          code += TranslatorHelpers.generateStackAccess('P', this.temporary)

          this.type = expression.type
          this.aux_type = expression.aux_type
          this.code = code
          this.dimensions = expression.dimensions
          this.is_array = true
          return
        }
      } else if (expression.getType() === CompilerTypes.OBJECT && expression.aux_type !== null) {
        if (identifier === 'instanceof') {
          code += TranslatorHelpers.comment('inicio de instance')
          const labels = [Generator.genLabel(), Generator.genLabel()]
          this.temporary = Generator.genTemporary()

          if (pEList.length !== 1) {
            throw Error(`UNABLE TO CALL ${identifier} ON OBJECT, PARAMETER MISSMATCH${this.parseSemanticError(this.iNode)}`)
          }

          const className = pList.getChild(0).getValue()
          const ioType = Backend.Classes.getType(className)

          if (ioType === -1) { throw Error(`UNABLE TO FIND THE SPECIFIED TYPE${this.parseSemanticError(pList.getChild(0))}`) }

          if (expression.aux_type === Backend.Classes.getType('var')) {
            code += TranslatorHelpers.arithmeticOperation('+', expression.temporary, '1', expression.temporary)
            code += TranslatorHelpers.generateHeapAccess(expression.temporary, expression.temporary)
            code += TranslatorHelpers.conditionalJMP('==', ioType, expression.temporary, labels[0])
            code += TranslatorHelpers.unaryAssign('0', this.temporary)
            code += TranslatorHelpers.inconditionalJMP(labels[1])
            code += TranslatorHelpers.generateLabel(labels[0])
            code += TranslatorHelpers.unaryAssign('1', this.temporary)
            code += TranslatorHelpers.generateLabel(labels[1])
          } else {
            code += TranslatorHelpers.conditionalJMP('==', ioType, expression.aux_type, labels[0])
            code += TranslatorHelpers.unaryAssign('0', this.temporary)
            code += TranslatorHelpers.inconditionalJMP(labels[1])
            code += TranslatorHelpers.generateLabel(labels[0])
            code += TranslatorHelpers.unaryAssign('1', this.temporary)
            code += TranslatorHelpers.generateLabel(labels[1])
          }

          this.type = CompilerTypes.BOOLEAN
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          this.code = code
          return
        }

        if (identifier === 'size' || identifier === 'getreference') {
          if (pEList.length !== 0) {
            throw Error(`UNABLE TO CALL ${identifier} ON OBJECT, PARAMETER MISSMATCH${this.parseSemanticError(this.iNode)}`)
          }
          if (identifier === 'size') {
            const symClass = Backend.ClassTemplates.get(expression.aux_type)
            const auxLabel = Generator.genLabel()
            const outLabel = Generator.genLabel()

            code += TranslatorHelpers.conditionalJMP('==', expression.getTemporary(), '0', auxLabel)
            code += TranslatorHelpers.unaryAssign(symClass.getSize(), this.temporary)
            code += TranslatorHelpers.inconditionalJMP(outLabel)
            code += TranslatorHelpers.generateLabel(auxLabel)
            code += TranslatorHelpers.unaryAssign(0, this.temporary)
            code += TranslatorHelpers.generateLabel(outLabel)

            this.type = CompilerTypes.INTEGER
            this.aux_type = null
            this.code = code
            this.dimensions = 0
            this.is_array = false
            return
          }

          if (identifier === 'getreference') {
            this.type = CompilerTypes.INTEGER
            this.temporary = expression.getTemporary()
            this.aux_type = null
            this.code = code
            this.dimensions = 0
            this.is_array = false
            return
          }
        }
      }
    }

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

          if (!this.parameterChecking(pEList, func.getParameters())) {
            filters.push(func)
            continue
          }

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

  parameterChecking (pEList, params) {
    for (let i = 0; i < pEList.length; i++) {
      if (!this.typeChecking(params[i][1], params[i][3], params[i][4], pEList[i].getType(), pEList[i].getAuxType(), pEList[i].dimensions)) {

        return false
      }
    }

    return true
  }
}

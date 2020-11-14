import { Generator } from './generator'
import { Backend } from '../backend';
class Translator {
  generateInvalidArithmeticError (rhs, errorLabel) {
    return this.comment('division by zero exception') +
    this.conditionalJMP('!=', rhs, '0', errorLabel)
  }

  generateInvalidCastError (position, type, errorLabel) {
    const tmp = Generator.genTemporary()
    return this.comment('invalid cast exception') +
            this.arithmeticOperation('+', position, '1', tmp) +
            this.generateHeapAccess(tmp, tmp) +
            this.conditionalJMP('!=', type, tmp, errorLabel)
  }

  generateHeapAssign (origin, value) {
    return `Heap[(int)${origin}] = ${value};\n`
  }

  generateHeapAccess (position, destiny) {
    return `${destiny} = Heap[(int)${position}];\n`
  }

  generateStackAssign (origin, value) {
    return `Stack[(int)${origin}] = ${value};\n`
  }

  generateStackAccess (position, destiny) {
    return `${destiny} = Stack[(int)${position}];\n`
  }

  moveStackPointer (add, value) {
    return `P = P ${add ? '+' : '-'} ${value};\n`
  }

  moveHeapPointer (value) {
    return `H = H + ${value};\n`
  }

  arithmeticOperation (op, opL, opR, result) {
    if( op == "%")
    {
      return `${result} = fmod(${opL}, ${opR});\n`
    }else{
      return `${result} = ${opL} ${op} ${opR};\n`
    }    
  }

  inconditionalJMP (label) {
    return `goto ${label};\n`
  }

  conditionalJMP (relop, opL, opR, label) {
    return `if (${opL} ${relop} ${opR}) goto ${label};\n`
  }

  unaryAssign (value, destiny) {
    return `${destiny} = ${value};\n`
  }

  functionCall (name) {
    return `${name} ();\n`
  }

  generateLabel (name) {
    return `${name}:\n`
  }

  printStmt (type, value) {
    if(type == "%c" ){
      return `printf("${type}", (int)${value});\n`;
    }else if(type == "%i"){
      return `printf("%d", (int)${value});\n`;
    }else if(type == "%d"){
      return `printf("%.2f",(double)${value});\n`;
    }
    return `printf("${type}",${value});\n`;
  }
  

  generateCustomFunction (identifier, block) {
    return `\nvoid ${identifier} () {\n${block} ${Backend.createOutLabels()} return;\n}\n`
  }

  generateTmpStackSave (init, fin) {
    let code = '//STACK SAVE INIT\n'

    for (let i = init; i < fin; i++) {
      if (i > init) { code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', 'P') }
      code += TranslatorHelpers.generateStackAssign('P', 't' + i)
    }
    if (init < fin) {
      code += TranslatorHelpers.moveStackPointer(true, 1)
    }
    code += '//STACK SAVE FIN\n'
    return code
  }

  generateTmpStackRecover (init, fin) {
    let code = '//STACK RECOVER INIT \n'

    for (let i = fin - 1; i >= init; i--) {
      code += TranslatorHelpers.arithmeticOperation('-', 'P', '1', 'P')
      code += TranslatorHelpers.generateStackAccess('P', 't' + i)
    }
    code += '//STACK RECOVER FIN \n'
    return code
  }

  generateDefaultAssign (heap, position, value = '0', eCode = '') {
    if (heap) { return eCode + this.generateHeapAssign(position, value) } else {
      const tmp = Generator.genTemporary()
      let code = eCode + this.arithmeticOperation('+', 'P', position, tmp)
      code += this.generateStackAssign(tmp, value)
      return code
    }
  }

  comment (com) {
    return `//${com}\n`
  }

  setError (num) {
    return `E=${num};\n`
  }
}

export const TranslatorHelpers = new Translator()

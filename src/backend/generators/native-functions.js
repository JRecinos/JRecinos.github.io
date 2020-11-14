import { Generator } from './generator'
import { TranslatorHelpers } from './translator-helpers'
import { Backend } from '../backend'

class NativeFunctionsClass {
  cloneObject () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel()]

    return 'void native_object_clone (){\n' +
    // posicion en heap en p + 1
    // numero de posiciones a copiar
    TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
    TranslatorHelpers.generateStackAccess(tmp[0], tmp[0]) +
    TranslatorHelpers.arithmeticOperation('+', 'P', '2', tmp[1]) +
    TranslatorHelpers.generateStackAccess(tmp[1], tmp[1]) +
    TranslatorHelpers.moveHeapPointer(1) +
    TranslatorHelpers.unaryAssign('H', tmp[2]) +
    TranslatorHelpers.unaryAssign('0', tmp[3]) +
    TranslatorHelpers.generateLabel(labels[1]) +
    TranslatorHelpers.conditionalJMP('==', tmp[3], tmp[1], labels[0]) +
    TranslatorHelpers.arithmeticOperation('+', tmp[0], tmp[3], tmp[4]) +
    TranslatorHelpers.generateHeapAccess(tmp[4], tmp[4]) +
    TranslatorHelpers.generateHeapAssign('H', tmp[4]) +
    TranslatorHelpers.arithmeticOperation('+', tmp[3], '1', tmp[3]) +
    TranslatorHelpers.conditionalJMP('==', tmp[3], tmp[1], labels[1]) +
    TranslatorHelpers.moveHeapPointer(1) +
    TranslatorHelpers.inconditionalJMP(labels[1]) +
    TranslatorHelpers.generateLabel(labels[0]) +
    // return
    TranslatorHelpers.generateStackAssign('P', tmp[2]) +
     Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  boolean_to_string () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]

    return 'void native_java_boolean_to_string (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[0]) +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.unaryAssign('H', tmp[1]) +
            TranslatorHelpers.conditionalJMP('==', tmp[0], '1', labels[0]) +
            TranslatorHelpers.inconditionalJMP(labels[1]) +
            TranslatorHelpers.generateLabel(labels[0]) +
            TranslatorHelpers.generateHeapAssign('H', '116') +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '114') +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '117') +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '101') +
            // 102 97 108 115 101 10
            TranslatorHelpers.inconditionalJMP(labels[2]) +
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.generateHeapAssign('H', '102') +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '97') +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '108') +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '115') +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '101') +
            TranslatorHelpers.inconditionalJMP(labels[2]) +
            TranslatorHelpers.generateLabel(labels[2]) +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '0') +
            TranslatorHelpers.generateStackAssign('P', tmp[1]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  concat_string () {
    const tmp = []
    const labels = []

    for (let i = 0; i < 6; i++) { tmp.push(Generator.genTemporary()) }
    for (let i = 0; i < 4; i++) { labels.push(Generator.genLabel()) }

    return 'void native_java_concat_strings (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[2]) +
            TranslatorHelpers.generateHeapAccess(tmp[1], tmp[3]) +
            TranslatorHelpers.generateHeapAccess(tmp[2], tmp[4]) + TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.unaryAssign('H', tmp[5]) + labels[0] + ':\n' +
            TranslatorHelpers.conditionalJMP('==', tmp[3], '0', labels[1]) +
            TranslatorHelpers.generateHeapAssign('H', tmp[3]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[1], '1', tmp[1]) +
            TranslatorHelpers.generateHeapAccess(tmp[1], tmp[3]) + TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.inconditionalJMP(labels[0]) + TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.conditionalJMP('==', tmp[4], '0', labels[2]) +
            TranslatorHelpers.generateHeapAssign('H', tmp[4]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[2], '1', tmp[2]) +
            TranslatorHelpers.generateHeapAccess(tmp[2], tmp[4]) + TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.inconditionalJMP(labels[1]) + TranslatorHelpers.generateLabel(labels[2]) +
            TranslatorHelpers.generateHeapAssign('H', '0') +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAssign(tmp[0], tmp[5]) + 
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  truncate_string () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary()]

    return 'void native_java_trunk (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) +
            TranslatorHelpers.arithmeticOperation('%', tmp[1], '1', tmp[2]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[1], tmp[2], tmp[3]) +
            TranslatorHelpers.generateStackAssign('P', tmp[3]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  round_string () {
    const tmp = []
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]

    for (let i = 0; i < 6; i++) { tmp.push(Generator.genTemporary()) }

    return 'void native_java_round (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) +
            TranslatorHelpers.arithmeticOperation('%', tmp[1], '1', tmp[2]) +
            TranslatorHelpers.conditionalJMP('<', tmp[2], '0.5', labels[0]) +
            TranslatorHelpers.inconditionalJMP(labels[1]) + TranslatorHelpers.generateLabel(labels[0]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[1], tmp[2], tmp[3]) +
            TranslatorHelpers.generateStackAssign('P', tmp[3]) + TranslatorHelpers.inconditionalJMP(labels[2]) +
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.arithmeticOperation('-', '1', tmp[2], tmp[4]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[4], tmp[1], tmp[5]) +
            TranslatorHelpers.generateStackAssign('P', tmp[5]) + TranslatorHelpers.generateLabel(labels[2]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  length_string () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary()]
    const label = [Generator.genLabel(), Generator.genLabel()]

    return 'void java_string_length (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) + // posicion de memoria
            TranslatorHelpers.unaryAssign('0', tmp[2]) +
            TranslatorHelpers.generateLabel(label[0]) +
            TranslatorHelpers.generateHeapAccess(tmp[1], tmp[0]) +
            TranslatorHelpers.conditionalJMP('==', tmp[0], '0', label[1]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[1], '1', tmp[1]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[2], '1', tmp[2]) +
            TranslatorHelpers.inconditionalJMP(label[0]) +
            TranslatorHelpers.generateLabel(label[1]) +
            TranslatorHelpers.generateStackAssign('P', tmp[2]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  int_to_String () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary()]

    const label = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel(),
      Generator.genLabel()]

    return 'void native_java_int_to_string (){\n' + TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) + // the number itself
            TranslatorHelpers.unaryAssign(tmp[1], tmp[2]) + // we save the number value
            TranslatorHelpers.unaryAssign('1', tmp[5]) + // number holder
            TranslatorHelpers.unaryAssign('1', tmp[3]) + // counter
            TranslatorHelpers.moveHeapPointer(1) + TranslatorHelpers.unaryAssign('H', tmp[4]) + // i have the string
    // position

            TranslatorHelpers.generateLabel(label[0]) +
            TranslatorHelpers.conditionalJMP('<', tmp[1], '10', label[1]) +
            TranslatorHelpers.arithmeticOperation('/', tmp[1], '10', tmp[1]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[3], '1', tmp[3]) +
            TranslatorHelpers.arithmeticOperation('*', tmp[5], '10', tmp[5]) +
            TranslatorHelpers.inconditionalJMP(label[0]) + TranslatorHelpers.generateLabel(label[1]) +
            // here we check if it is positive or negative
            TranslatorHelpers.conditionalJMP('>=', tmp[2], '0', label[2]) +
            TranslatorHelpers.generateHeapAssign('H', '45') + TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateLabel(label[2]) +
            TranslatorHelpers.conditionalJMP('==', tmp[3], '0', label[3]) +
            TranslatorHelpers.arithmeticOperation('/', tmp[2], tmp[5], tmp[6]) +
            TranslatorHelpers.arithmeticOperation('%', tmp[6], '1', tmp[8]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[6], tmp[8], tmp[6]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[6], '48', tmp[7]) +
            TranslatorHelpers.generateHeapAssign('H', tmp[7]) + TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.arithmeticOperation('*', tmp[6], tmp[5], tmp[7]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[2], tmp[7], tmp[2]) +
            TranslatorHelpers.arithmeticOperation('/', tmp[5], '10', tmp[5]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[3], '1', tmp[3]) +
            TranslatorHelpers.inconditionalJMP(label[2]) + TranslatorHelpers.generateLabel(label[3]) +
            TranslatorHelpers.generateHeapAssign('H', '0') +
            TranslatorHelpers.generateStackAssign('P', tmp[4]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  power () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]
    const while_labels = [Generator.genLabel(), Generator.genLabel()]

    return 'void native_java_pow (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '2', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[0]) +
            TranslatorHelpers.conditionalJMP('<=', tmp[0], 0, labels[1]) +
            TranslatorHelpers.inconditionalJMP(labels[2]) +
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.generateStackAssign('P', 1) +
            TranslatorHelpers.inconditionalJMP(labels[0]) +
            TranslatorHelpers.generateLabel(labels[2]) +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[1]) +
            TranslatorHelpers.generateStackAccess(tmp[1], tmp[1]) +
            // valor a multiplicar
            TranslatorHelpers.unaryAssign(tmp[1], tmp[2]) +
            TranslatorHelpers.generateLabel(while_labels[0]) +
            TranslatorHelpers.conditionalJMP('<=', tmp[0], 1, while_labels[1]) +
            TranslatorHelpers.arithmeticOperation('*', tmp[1], tmp[2], tmp[1]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[0], 1, tmp[0]) +
            TranslatorHelpers.inconditionalJMP(while_labels[0]) +
            TranslatorHelpers.generateLabel(while_labels[1]) +
            TranslatorHelpers.generateStackAssign('P', tmp[1]) +
            TranslatorHelpers.generateLabel(labels[0]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  charToString () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary()]

    return 'void native_java_char_to_string (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) + // char value
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.unaryAssign('H', tmp[0]) +
            TranslatorHelpers.generateHeapAssign(tmp[0], tmp[1]) +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '0') +
            TranslatorHelpers.generateStackAssign('P', tmp[0]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  printString () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary()]
    const label = [Generator.genLabel(), Generator.genLabel()]

    return 'void native_java_print_string (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) + // string pointer value
            TranslatorHelpers.generateLabel(label[0]) + TranslatorHelpers.generateHeapAccess(tmp[1], tmp[2]) +
            TranslatorHelpers.conditionalJMP('==', tmp[2], '0', label[1]) +
            TranslatorHelpers.printStmt('%c', tmp[2]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[1], '1', tmp[1]) +
            TranslatorHelpers.inconditionalJMP(label[0]) + TranslatorHelpers.generateLabel(label[1]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  printBoolean () {
    const tmp = [Generator.genTemporary()]
    const label = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]

    return 'void native_java_print_boolean (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[0]) + // boolean value
            TranslatorHelpers.conditionalJMP('==', tmp[0], '1', label[0]) +
            TranslatorHelpers.inconditionalJMP(label[1]) +
            TranslatorHelpers.generateLabel(label[0]) +
            TranslatorHelpers.printStmt('%c', '116') +
            TranslatorHelpers.printStmt('%c', '114') +
            TranslatorHelpers.printStmt('%c', '117') +
            TranslatorHelpers.printStmt('%c', '101') +
            TranslatorHelpers.inconditionalJMP(label[2]) +
            TranslatorHelpers.generateLabel(label[1]) +
            // 102 97 108 115 101
            TranslatorHelpers.printStmt('%c', '102') +
            TranslatorHelpers.printStmt('%c', '97') +
            TranslatorHelpers.printStmt('%c', '108') +
            TranslatorHelpers.printStmt('%c', '115') +
            TranslatorHelpers.printStmt('%c', '101') +
            TranslatorHelpers.generateLabel(label[2]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  real_to_String () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary()]

    return 'void native_java_real_to_string (){\n' +
            TranslatorHelpers.arithmeticOperation('+', '1', 'P', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) + // valor en si
            TranslatorHelpers.arithmeticOperation('%', tmp[1], '1', tmp[2]) + // parte decimal
            TranslatorHelpers.arithmeticOperation('-', tmp[1], tmp[2], tmp[3]) + // parte entera
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.unaryAssign('H', tmp[4]) + // posicion del
            // punto
            TranslatorHelpers.generateHeapAssign('H', '46') + TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', '0') + TranslatorHelpers.moveStackPointer(true, 2) +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[5]) +
            TranslatorHelpers.generateStackAssign(tmp[5], tmp[3]) +
            TranslatorHelpers.functionCall('native_java_int_to_string') +
            TranslatorHelpers.generateStackAccess('P', tmp[6]) +
            TranslatorHelpers.generateStackAssign(tmp[5], tmp[6]) + // colocamos en la posicion 0 para llamar al
            // concat
            TranslatorHelpers.arithmeticOperation('+', '1', tmp[5], tmp[5]) +
            TranslatorHelpers.generateStackAssign(tmp[5], tmp[4]) + // colocamos en la posicion 0 para llamar al
            // concat
            TranslatorHelpers.functionCall('native_java_concat_strings') +
            TranslatorHelpers.arithmeticOperation('-', tmp[5], '1', tmp[5]) +
            TranslatorHelpers.generateStackAccess(tmp[5], tmp[7]) +
            // obtenemos el valor decimal
            TranslatorHelpers.arithmeticOperation('*', tmp[2], '100', tmp[8]) +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[5]) +
            TranslatorHelpers.generateStackAssign(tmp[5], tmp[8]) +
            TranslatorHelpers.functionCall('native_java_int_to_string') +
            TranslatorHelpers.generateStackAccess('P', tmp[9]) + // este es el valor de la última parte ahora
    // concatenamos el tmp[7] con el tmp[10]

            TranslatorHelpers.generateStackAssign(tmp[5], tmp[7]) + // colocamos en la posicion 0 para llamar al
            // concat
            TranslatorHelpers.arithmeticOperation('+', tmp[5], '1', tmp[5]) +
            TranslatorHelpers.generateStackAssign(tmp[5], tmp[9]) + // colocamos en la posicion 0 para llamar al
            // concat
            TranslatorHelpers.functionCall('native_java_concat_strings') +
            TranslatorHelpers.arithmeticOperation('+', '1', 'P', tmp[5]) +
            TranslatorHelpers.generateStackAccess(tmp[5], tmp[10]) +
            TranslatorHelpers.moveStackPointer(false, 2) +
            TranslatorHelpers.generateStackAssign('P', tmp[10]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  charAt () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary()]
    return 'void native_string_charat (){\n' +
    TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
    TranslatorHelpers.generateStackAccess(tmp[0], tmp[1]) + // tmp[2] es la posicion en heap del string
    TranslatorHelpers.arithmeticOperation('+', 'P', '2', tmp[0]) +
    TranslatorHelpers.generateStackAccess(tmp[0], tmp[2]) +
    TranslatorHelpers.arithmeticOperation('+', tmp[2], tmp[1], tmp[0]) +
    TranslatorHelpers.generateHeapAccess(tmp[0], tmp[0]) +
    TranslatorHelpers.generateStackAssign('P', tmp[0]) +
     Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  // TODO: CREATE LOGIC -> FIRST FUNCTION TO CALL FROM ANOTHER
  /*
     * public static String tochararray_sting () { return
     * "proc java_tochararray\n"
     *
     * +"end,,,java_tochararray\n"; }
     */

  string_to_Int () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel()]

    return 'void native_java_string_to_int (){\n' +
            TranslatorHelpers.unaryAssign(0, tmp[2]) +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[0]) +
            TranslatorHelpers.functionCall('java_string_length') +
            TranslatorHelpers.generateStackAccess('P', tmp[1]) + // tmp has counter
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.conditionalJMP('==', tmp[1], 0, labels[0]) +
            TranslatorHelpers.generateHeapAccess(tmp[0], tmp[3]) +
            TranslatorHelpers.conditionalJMP('<', tmp[3], 48, Backend.ErrorsLabels.get('illegalnumberformat')) +
            TranslatorHelpers.conditionalJMP('>', tmp[3], 57, Backend.ErrorsLabels.get('illegalnumberformat')) +
            TranslatorHelpers.arithmeticOperation('*', tmp[2], '10', tmp[2]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[3], 48, tmp[3]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[2], tmp[3], tmp[2]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[1], 1, tmp[1]) +
            TranslatorHelpers.inconditionalJMP(labels[1]) +
            TranslatorHelpers.generateLabel(labels[0]) +
            TranslatorHelpers.generateStackAssign('P', tmp[2]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  string_to_double () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]

    return 'void native_java_string_to_double (){\n' +
            TranslatorHelpers.unaryAssign(0, tmp[2]) +
            TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[0]) +
            TranslatorHelpers.functionCall('java_string_length') +
            TranslatorHelpers.generateStackAccess('P', tmp[1]) + // tmp has counter
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.conditionalJMP('==', tmp[1], 0, labels[0]) +
            TranslatorHelpers.generateHeapAccess(tmp[0], tmp[3]) +
            TranslatorHelpers.conditionalJMP('==', tmp[3], 46, labels[2]) +
            TranslatorHelpers.conditionalJMP('<', tmp[3], 48, Backend.ErrorsLabels.get('illegalnumberformat')) +
            TranslatorHelpers.conditionalJMP('>', tmp[3], 57, Backend.ErrorsLabels.get('illegalnumberformat')) +
            TranslatorHelpers.arithmeticOperation('*', tmp[2], '10', tmp[2]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[3], 48, tmp[3]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[2], tmp[3], tmp[2]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[1], 1, tmp[1]) +
            TranslatorHelpers.inconditionalJMP(labels[1]) +
            TranslatorHelpers.comment('inicio double') +
            TranslatorHelpers.generateLabel(labels[2]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[1], '1', tmp[1]) +
            TranslatorHelpers.unaryAssign(1, tmp[4]) +
            TranslatorHelpers.generateLabel(labels[3]) +
            TranslatorHelpers.conditionalJMP('==', tmp[1], 0, labels[0]) +
            TranslatorHelpers.arithmeticOperation('/', tmp[4], '10', tmp[4]) +
            TranslatorHelpers.generateHeapAccess(tmp[0], tmp[3]) +
            TranslatorHelpers.conditionalJMP('<', tmp[3], 48, Backend.ErrorsLabels.get('illegalnumberformat')) +
            TranslatorHelpers.conditionalJMP('>', tmp[3], 57, Backend.ErrorsLabels.get('illegalnumberformat')) +
            TranslatorHelpers.arithmeticOperation('-', tmp[3], 48, tmp[3]) +
            TranslatorHelpers.arithmeticOperation('*', tmp[4], tmp[3], tmp[5]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[2], tmp[5], tmp[2]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[1], 1, tmp[1]) +
            TranslatorHelpers.inconditionalJMP(labels[3]) +
            TranslatorHelpers.generateLabel(labels[0]) +
            TranslatorHelpers.generateStackAssign('P', tmp[2]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  string_equals () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]
    return 'void java_string_equals (){\n' +
            TranslatorHelpers.arithmeticOperation('+', 'P', 1, tmp[0]) +
            TranslatorHelpers.generateStackAccess(tmp[0], tmp[0]) +
            TranslatorHelpers.arithmeticOperation('+', 'P', 2, tmp[1]) +
            TranslatorHelpers.generateStackAccess(tmp[1], tmp[1]) +
            TranslatorHelpers.functionCall('java_string_length') +
            TranslatorHelpers.generateStackAccess('P', tmp[2]) +
            TranslatorHelpers.moveStackPointer(true, 1) +
            TranslatorHelpers.functionCall('java_string_length') +
            TranslatorHelpers.generateStackAccess('P', tmp[3]) +
            TranslatorHelpers.moveStackPointer(false, 1) +
            TranslatorHelpers.conditionalJMP('!=', tmp[2], tmp[3], labels[3]) +
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.conditionalJMP('==', tmp[3], 0, labels[2]) +
            TranslatorHelpers.generateHeapAccess(tmp[0], tmp[2]) +
            TranslatorHelpers.generateHeapAccess(tmp[1], tmp[4]) +
            TranslatorHelpers.conditionalJMP('!=', tmp[2], tmp[4], labels[3]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], 1, tmp[0]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[1], 1, tmp[1]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[3], '1', tmp[3]) +
            TranslatorHelpers.inconditionalJMP(labels[1]) +
            TranslatorHelpers.generateLabel(labels[2]) +
            TranslatorHelpers.generateStackAssign('P', 1) +
            TranslatorHelpers.inconditionalJMP(labels[0]) +
            TranslatorHelpers.generateLabel(labels[3]) +
            TranslatorHelpers.generateStackAssign('P', 0) +
            TranslatorHelpers.generateLabel(labels[0]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  string_to_lowercase () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]

    return 'void java_string_to_lowercase (){\n' +
            TranslatorHelpers.generateStackAccess('P', tmp[0]) + // tmp tiene el apuntador a heap
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.unaryAssign('H', tmp[2]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[0], 1, tmp[0]) +
            TranslatorHelpers.generateLabel(labels[0]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], 1, tmp[0]) +
            TranslatorHelpers.generateHeapAccess(tmp[0], tmp[1]) +
            TranslatorHelpers.conditionalJMP('==', tmp[1], 0, labels[1]) +
            TranslatorHelpers.conditionalJMP('<', tmp[1], 65, labels[2]) +
            TranslatorHelpers.conditionalJMP('>', tmp[1], 90, labels[2]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[1], 32, tmp[1]) +
            TranslatorHelpers.generateLabel(labels[2]) +
            TranslatorHelpers.generateHeapAssign('H', tmp[1]) +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.inconditionalJMP(labels[0]) +
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.generateHeapAssign('H', '0') +
            TranslatorHelpers.generateStackAssign('P', tmp[2]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  string_to_uppercase () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]

    return 'void java_string_to_uppercase (){\n' +
            TranslatorHelpers.generateStackAccess('P', tmp[0]) + // tmp tiene el apuntador a heap
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.unaryAssign('H', tmp[2]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[0], 1, tmp[0]) +
            TranslatorHelpers.generateLabel(labels[0]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], 1, tmp[0]) +
            TranslatorHelpers.generateHeapAccess(tmp[0], tmp[1]) +
            TranslatorHelpers.conditionalJMP('==', tmp[1], 0, labels[1]) +
            TranslatorHelpers.conditionalJMP('>', tmp[1], 122, labels[2]) +
            TranslatorHelpers.conditionalJMP('<', tmp[1], 97, labels[2]) +
            TranslatorHelpers.arithmeticOperation('-', tmp[1], 32, tmp[1]) +
            TranslatorHelpers.generateLabel(labels[2]) +
            TranslatorHelpers.generateHeapAssign('H', tmp[1]) +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.inconditionalJMP(labels[0]) +
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.generateHeapAssign('H', '0') +
            TranslatorHelpers.generateStackAssign('P', tmp[2]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  copyVector () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary(), Generator.genTemporary(),
      Generator.genTemporary()
    ]
    const labels = [Generator.genLabel(), Generator.genLabel()]

    return 'void native_vector_linealize (){\n' +
            TranslatorHelpers.generateStackAccess('P', tmp[0]) + // apuntador del heap
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.unaryAssign('H', tmp[1]) +
            TranslatorHelpers.generateHeapAccess(tmp[0], tmp[2]) +
            TranslatorHelpers.unaryAssign(tmp[2], tmp[3]) + // tmp[3] es el loop
            TranslatorHelpers.generateHeapAssign(tmp[1], tmp[2]) +
            // inicio de loop
            TranslatorHelpers.arithmeticOperation('-', '0', '1', tmp[4]) +
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[4], '1', tmp[4]) +
            TranslatorHelpers.conditionalJMP('==', tmp[4], tmp[3], labels[0]) +
    // a la posicion a copiar y a la posicion a asignar le sumamos 1
            TranslatorHelpers.arithmeticOperation('+', tmp[0], tmp[4], tmp[5]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[5], '1', tmp[5]) +
            TranslatorHelpers.generateHeapAccess(tmp[5], tmp[5]) +
            // posicion a asignar
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', tmp[5]) +
            // posicion más 1
            TranslatorHelpers.inconditionalJMP(labels[1]) +
            // fin de loop
            TranslatorHelpers.generateLabel(labels[0]) +
            TranslatorHelpers.generateStackAssign('P', tmp[1]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  string_to_chararray () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel()]

    return 'void java_string_to_chararray (){\n' +
            TranslatorHelpers.generateStackAccess('P', tmp[0]) + // tmp tiene el apuntador a heap
            TranslatorHelpers.moveStackPointer(true, 1) +
            TranslatorHelpers.arithmeticOperation('+', 'P', 1, tmp[1]) +
            TranslatorHelpers.generateStackAssign(tmp[1], tmp[0]) +
            TranslatorHelpers.functionCall('java_string_length') +
            TranslatorHelpers.generateStackAccess('P', tmp[1]) +
            TranslatorHelpers.moveStackPointer(false, 1) +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.unaryAssign('H', tmp[2]) +
            TranslatorHelpers.generateHeapAssign(tmp[2], tmp[1]) +
            TranslatorHelpers.generateLabel(labels[1]) +
            TranslatorHelpers.generateHeapAccess(tmp[0], tmp[3]) +
            TranslatorHelpers.conditionalJMP('==', tmp[3], 0, labels[0]) +
            TranslatorHelpers.moveHeapPointer(1) +
            TranslatorHelpers.generateHeapAssign('H', tmp[3]) +
            TranslatorHelpers.arithmeticOperation('+', tmp[0], 1, tmp[0]) +
            TranslatorHelpers.inconditionalJMP(labels[1]) +
            TranslatorHelpers.generateLabel(labels[0]) +
            TranslatorHelpers.generateStackAssign('P', tmp[2]) +
             Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  defaultObjectConstructor () {
    const tmp = Generator.genTemporary()

    return 'void default_object_constructor (){\n' +
    TranslatorHelpers.moveHeapPointer(1) +
    TranslatorHelpers.generateStackAssign('P', 'H') +
    // en p + 1 tenemos el valor
    // en p + 2 el tipo
    TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp) +
    TranslatorHelpers.generateStackAccess(tmp, tmp) +
    TranslatorHelpers.generateHeapAssign('H', tmp) +
    TranslatorHelpers.arithmeticOperation('+', 'P', '2', tmp) +
    TranslatorHelpers.generateStackAccess(tmp, tmp) +
    TranslatorHelpers.moveHeapPointer(1) +
    TranslatorHelpers.generateHeapAssign('H', tmp) +
     Backend.createOutLabels()  + 'return;\n' + ' \n}\n'
  }

  objectToString () {
    const tmp = Generator.genTemporary()
    const tmp2 = Generator.genTemporary()
    const tmp3 = Generator.genTemporary()

    const label = Generator.genLabel()
    const labelOut = Generator.genLabel()

    let code = 'void default_object_to_string (){\n'
    code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp2)
    code += TranslatorHelpers.generateStackAccess(tmp2, tmp2)
    code += TranslatorHelpers.conditionalJMP('!=', tmp2, 0, label)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.unaryAssign('H', tmp3)
    code += TranslatorHelpers.generateHeapAssign('H', 110)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 117)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 108)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 108)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 0)
    code += TranslatorHelpers.inconditionalJMP(labelOut)
    code += TranslatorHelpers.generateLabel(label)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.unaryAssign('H', tmp3)
    code += TranslatorHelpers.generateHeapAssign('H', 79)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 98)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 106)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 101)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 99)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 116)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 64)
    code += TranslatorHelpers.moveHeapPointer(1)
    code += TranslatorHelpers.generateHeapAssign('H', 0)
    code += TranslatorHelpers.functionCall('native_java_int_to_string')
    code += TranslatorHelpers.generateStackAccess('P', tmp)
    code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp2)
    code += TranslatorHelpers.generateStackAssign(tmp2, tmp3)
    code += TranslatorHelpers.arithmeticOperation('+', 'P', '2', tmp2)
    code += TranslatorHelpers.generateStackAssign(tmp2, tmp)
    code += TranslatorHelpers.functionCall('native_java_concat_strings')
    code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp3)
    code += TranslatorHelpers.generateStackAccess(tmp3, tmp3)
    code += TranslatorHelpers.generateLabel(labelOut)
    code += TranslatorHelpers.generateStackAssign('P', tmp3)
    code +=  Backend.createOutLabels()  + 'return;\n' + ' \n}\n'

    return code
  }

  all () {
    return this.concat_string() + '\n' + this.truncate_string() + '\n' + this.round_string() + '\n' + this.length_string() +
            '\n' + this.int_to_String() + '\n' + this.printString() + '\n' + this.real_to_String() + '\n' + this.boolean_to_string() +
            '\n' + this.printBoolean() + '\n' + this.charToString() + '\n' + this.power() + '\n' + this.string_to_Int() +
            '\n' + this.string_to_double() + '\n' + this.string_to_lowercase() + '\n' + this.string_to_uppercase() +
            '\n' + this.string_to_chararray() + '\n' + this.string_equals() + '\n' + this.cloneObject() + '\n' + this.copyVector() +
            '\n' + this.charAt() + '\n' + this.defaultObjectConstructor() + '\n' + this.objectToString()
  }

  headers () {
    let str = '#include <stdio.h>\n#include <stdlib.h>\n#include <math.h>\n';
    
    str += 'double H;\ndouble P;\ndouble E;\ndouble Stack[16384];\ndouble Heap[16384];\ndouble '

    for (let i = 0; i < Generator.getTemporary(); i++) { str += `${i === 0 ? '' : ','}t${i}` }

    str += ';\n'

    return str
  }
}

export const NativeFunctions = new NativeFunctionsClass()

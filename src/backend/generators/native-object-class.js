import { TranslatorHelpers } from './translator-helpers'
import { Generator } from './generator'
import { SymTabImp } from '../symbol-table/sym-tab-imp'
import { createDefaultConstructorEntry } from '../helpers/base-object'
import { SymImp } from '../symbol-table/sym-imp'
import { CompilerTypes } from '../compiler-types'
import { Backend } from '../backend'

export class ObjectClassCreator {
  static defaultConstructor () {
    return 'void default_object_constructor (){\n' +
      TranslatorHelpers.moveHeapPointer(1) +
      TranslatorHelpers.generateStackAssign('P', 'H') +
      'return; \n }\n'
  }

  static defaultObjectEquals () {
    const tmp = [Generator.genTemporary(), Generator.genTemporary()]
    const labels = [Generator.genLabel(), Generator.genLabel(), Generator.genLabel()]

    return 'void default_object_equals (){\n' +
      TranslatorHelpers.arithmeticOperation('+', 'P', '1', tmp[0]) +
      TranslatorHelpers.generateStackAccess(tmp[0], tmp[0]) +
      TranslatorHelpers.generateStackAccess('P', tmp[1]) + // this
      TranslatorHelpers.conditionalJMP('==', tmp[0], tmp[1], labels[1]) +
      TranslatorHelpers.inconditionalJMP(labels[2]) +
      TranslatorHelpers.generateLabel(labels[1]) +
      TranslatorHelpers.arithmeticOperation('+', 'P', 1, tmp[0]) +
      TranslatorHelpers.generateStackAssign(tmp[0], 1) +
      TranslatorHelpers.inconditionalJMP(labels[0]) +
      TranslatorHelpers.generateLabel(labels[2]) +
      TranslatorHelpers.arithmeticOperation('+', 'P', 0, tmp[0]) +
      TranslatorHelpers.generateStackAssign(tmp[0], 1) +
      TranslatorHelpers.generateLabel(labels[0]) +
      'return; \n }\n'
  }

  static getObjectMethods () {
    return this.defaultObjectEquals() + this.defaultConstructor()
  }

  static symbolTableGenerator () {
    const symTab = new SymTabImp(null)
    symTab.type = 18
    symTab.name = 'var'
    Backend.SymbolTable = symTab

    createDefaultConstructorEntry('Object', symTab, 'default_object_constructor')
    const symbol = new SymImp('equals', CompilerTypes.FUNCTION, CompilerTypes.BOOLEAN, 0, null, null, [['obj1', CompilerTypes.OBJECT, true, 18]], 0)
    symbol.setSymbols(new SymTabImp(symTab))
    symbol.functionId = 'default_object_equals'
    symTab.insert('equals', symbol)
    Backend.ClassTemplates.set(18, symTab)
    Backend.SymbolTable = null
  }
}

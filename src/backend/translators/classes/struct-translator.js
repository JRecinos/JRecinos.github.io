import { Translator } from '../translator'
import { SymTabImp } from '../../symbol-table/sym-tab-imp'
import { Backend } from '../../backend'
import { tree_types } from '../../ast/tree-types'
import { CompilerTypes } from '../../compiler-types'
import { FieldDeclarationTranslator } from './field-declaration-translator'
import { Generator } from '../../generators/generator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { ExpressionTranslator } from '../expression/expression-translator'
import {
  createDefaultConstructorEntry
} from '../../helpers/base-object'

export class StructTranslator extends Translator {
  constructor (parent) {
    super(parent)
    this.SymTab = new SymTabImp(null)
    this.ClassSave = null
  }

  staticPass (INode) {
    this.iNode = INode

    const class_identifier = INode.getChild(0).getValue()

    Backend.Classes.addType(class_identifier)
    Backend.ClassTemplates.set(Backend.Classes.getType(class_identifier), this.SymTab)
    this.SymTab.setInformation(class_identifier, Backend.Classes.getType(class_identifier))

    // we set the base class in the stack as the symbol table
    this.ClassSave = Backend.SymbolTable
    Backend.SymbolTable = this.SymTab

    // we iterate all the children nodes, possible actions are:
    //  1.  Class
    //  2.  Attributes
    //  3.  Function / Procedure
    //  4.  Constructor
    for (const node of INode.getChild(1).getChildren()) {
      const fDecl = new FieldDeclarationTranslator(this)
      fDecl.translate(true, node, true)
    } // fin del for

    Backend.SymbolTable = this.ClassSave
  }
  // HERE WE ARE GOING TO CUT IT;

  translate () {
    this.ClassSave = Backend.SymbolTable
    Backend.SymbolTable = this.SymTab

    const fnId = Generator.genFunctionId(this.SymTab.name, this.SymTab.name)
    // we add the info of the constructor
    createDefaultConstructorEntry(this.SymTab.name, this.SymTab, fnId)
    Backend.FunctionsCode.push(
      TranslatorHelpers.generateCustomFunction(
        fnId,
        this.createDefaultConstructor()
      )
    )

    Backend.SymbolTable = this.ClassSave
  }

  createDefaultConstructor (call_parent_constructor = null) {
    const tmp = Generator.genTemporary()
    const tmp_helper = Generator.genTemporary()

    let code = TranslatorHelpers.moveHeapPointer(1)
    if (call_parent_constructor == null) { code += TranslatorHelpers.generateStackAssign('P', 'H') }
    code += TranslatorHelpers.unaryAssign('H', tmp)
    if (this.SymTab.getSize() - 1 > 0) { code += TranslatorHelpers.moveHeapPointer(this.SymTab.getSize() - 1) } // we save all
    code += TranslatorHelpers.comment(
      'we save the space needed for all attributes'
    )
    const set = this.SymTab.getAllKeys()
    const eTrans = new ExpressionTranslator(this)

    for (const str of set) {
      const array = this.SymTab.getAllSyms(str)

      for (const sym of array) {
        if (sym.getRol() === CompilerTypes.ATTRIBUTE) {
          code += TranslatorHelpers.arithmeticOperation(
            '+',
            tmp,
            sym.getPosition(),
            tmp_helper
          )
          if (sym.node == null) {
            // value not initialized
            code += TranslatorHelpers.generateDefaultAssign(
              true,
              tmp_helper,
              '0'
            )
          } else {
            // value with initial value
            eTrans.translate(sym.node)
            code += TranslatorHelpers.generateDefaultAssign(
              true,
              tmp_helper,
              eTrans.getTemporary(),
              eTrans.getCode()
            )
          }
        }
      }
    }

    return code
  }
}

// VAR_DECLARATION_NO_TYPE
import { tree_types } from '../../ast/tree-types'
import { ExpressionTranslator } from '../expression/expression-translator'
import { CompilerTypes } from '../../compiler-types'
import { Translator } from '../translator'
import { insertInSymbolTable } from '../../helpers/base-object'
import { Backend } from '../../backend'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Generator } from '../../generators/generator'

export class SpecialDeclarationTranslator extends Translator {
  constructor (parent) {
    super(parent)
    this.firstPass = false // this one is for global
  }

  translate (global, iNode) {
    this.iNode = iNode

    const isStatic = iNode.getChild(0).getType() === tree_types.types.GLOBAL

    if (this.firstPass && !isStatic) { return }
    if (!this.firstPass && isStatic) { return }
    // so right now we are supoused to get the current size
    let relativePointer = (global) ? (Backend.Heap_Pointer + 0) : 1 + Backend.SymbolTable.getSize()

    const typeNode = iNode.getChild(0) // Here we save if its a const, global or var

    const eTrans = new ExpressionTranslator(this)
    eTrans.translate(iNode.getChild(1).getChild(1))

    const identifier = iNode.getChild(1).getChild(0).getValue()
    const isConstant = typeNode.getType() === tree_types.types.FINAL
    let symbol = null
    if (isConstant || Backend.VarFlag) {
      symbol = insertInSymbolTable(identifier, (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE, eTrans.type, relativePointer++, eTrans.aux_type, null, eTrans.dimensions)
      if (Backend.VarFlag && isConstant) { symbol.setConstant() }
      if (!global) {
        let code = ''
        code += TranslatorHelpers.generateDefaultAssign(global, symbol.position, eTrans.getTemporary(), eTrans.getCode())
        symbol.setCode(code)
        symbol.setTemporary(eTrans.getTemporary())
      } else {
        symbol.setCode(eTrans.getCode())
        symbol.setTemporary(eTrans.getTemporary())
      }
    } else {
      let code = eTrans.getCode()
      // if global this means that stack is null
      const auxTmp = Generator.genTemporary()
      if (global) {
        code += TranslatorHelpers.comment('codigo para globales')
        code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', auxTmp)
        code += TranslatorHelpers.generateStackAssign(auxTmp, eTrans.temporary)
        code += TranslatorHelpers.arithmeticOperation('+', 'P', '2', auxTmp)
        code += TranslatorHelpers.generateStackAssign(auxTmp, eTrans.type)
        code += TranslatorHelpers.functionCall('default_object_constructor')
        code += TranslatorHelpers.generateStackAccess('P', eTrans.temporary)
        symbol = insertInSymbolTable(identifier, (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE, CompilerTypes.OBJECT, relativePointer++, Backend.Classes.getType('var'), null, eTrans.dimensions, null, isStatic)
        symbol.setCode(code)
        symbol.setTemporary(eTrans.getTemporary())
      } else {
        code += TranslatorHelpers.moveStackPointer(true, Backend.SymbolTable.size + 1)
        code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', auxTmp)
        code += TranslatorHelpers.generateStackAssign(auxTmp, eTrans.temporary)
        code += TranslatorHelpers.arithmeticOperation('+', 'P', '2', auxTmp)
        code += TranslatorHelpers.generateStackAssign(auxTmp, eTrans.type)
        code += TranslatorHelpers.functionCall('default_object_constructor')
        code += TranslatorHelpers.generateStackAccess('P', eTrans.temporary)
        code += TranslatorHelpers.moveStackPointer(false, Backend.SymbolTable.size + 1)
        symbol = insertInSymbolTable(identifier, (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE, CompilerTypes.OBJECT, relativePointer++, Backend.Classes.getType('var'), null, eTrans.dimensions, null, isStatic)
        if (!isStatic) {
          code += TranslatorHelpers.comment('entró por no ser estático')
          code += TranslatorHelpers.generateDefaultAssign(global, symbol.position, eTrans.getTemporary(), '')
        }
        symbol.setCode(code)
        symbol.setTemporary(eTrans.getTemporary())
      }
    }

    if (global) { symbol.node = iNode.getChild(1).getChild(1) }
    // code += symbol.getCode();

    this.setCode(symbol.getCode())
  }
}

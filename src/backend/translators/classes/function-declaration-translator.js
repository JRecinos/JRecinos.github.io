import { Translator } from '../translator'
import { tree_types } from '../../ast/tree-types'
import { Backend } from '../../backend'
import { CompilerTypes } from '../../compiler-types'
import { BlockStmtTranslator } from '../statements/block-stmt-translator'
import { SymTabImp } from '../../symbol-table/sym-tab-imp'
import { insertInSymbolTable } from '../../helpers/base-object'
import { Generator } from '../../generators/generator'
import { TranslatorHelpers } from '../../generators/translator-helpers'

export class FunctionDeclarationTranslator extends Translator {

  firstPass(iNode){
    const block = iNode.lookupByType(tree_types.types.BLOCK)

    const block_stmt = new BlockStmtTranslator(this)
    block_stmt.firstPass(block)
  }

  translate (iNode, symbol) {
    this.iNode = iNode

    const RefSymTab = Backend.SymbolTable
    Backend.SymbolTable = new SymTabImp(RefSymTab)
    symbol.setSymbols(Backend.SymbolTable)

    const parameter_list = symbol.getParameters()

    // we search for all the var types
    // TODO: save register types as Object[]
    if (parameter_list != null) {
      let position_relative = Backend.SymbolTable.getSize() + 1

      for (const param of parameter_list) {
        insertInSymbolTable(
          param[0],
          param[2] ? CompilerTypes.REF_PARAM : CompilerTypes.VAL_PARAM,
          param[1],
          position_relative,
          param[3],
          null,
          param[4],
          null
        )
        position_relative += 1
      }
    }

    // codigo*
    const block = iNode.lookupByType(tree_types.types.BLOCK)

    const block_stmt = new BlockStmtTranslator(this)
    block_stmt.setSiguiente(Generator.genLabel())
    Backend.Display.OutLabel = block_stmt.siguiente
    block_stmt.translate(block, false)
    Backend.Display.OutLabel = ''
    Backend.SymbolTable = RefSymTab

    this.setCode(block_stmt.getCode() + TranslatorHelpers.generateLabel(block_stmt.siguiente))
  }
}

import { tree_types } from '../../ast/tree-types'
import { CompilerTypes } from '../../compiler-types'
import { Translator } from '../translator'
import { insertInSymbolTable } from '../../helpers/base-object'
import { Backend } from '../../backend'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { SymTabImp } from '../../symbol-table/sym-tab-imp'
import { BlockStmtTranslator } from '../statements/block-stmt-translator'
import { Generator } from '../../generators/generator'

export class ConstructorDeclarationTranslator extends Translator {
  constructor (parent) {
    super(parent)
    this.super_found = null
    this.should_extend = false
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
          param[4]
        )
        position_relative += 1
      }
    }

    let is_super_required = true

    // we have to check if it should extend
    if (this.should_extend) {
      /*
        * IF NO PARAMS, NO SUPER IS REQUIRED
        * IF PARAMS SUPER IS REQUIRED AS FIRST STMT
       */
      const super_constructors = RefSymTab.parent.constructors
      for (const sym_const of super_constructors) {
        if (sym_const.getParameters() == 0) {
          this.super_found = sym_const.functionId
          is_super_required = false
          break
        }
      }

      if (is_super_required && iNode.getChild(0).getType() != tree_types.types.EXPLICIT_CONSTRUCTOR) { throw `EXPLICIT SUPER CALL IS EXPECTED, UNABLE TO FIND DEFAULT CONSTRUCTOR IN SUPER CLASS${this.parseSemanticError(iNode)}` }

      if (is_super_required && (this.super_found = this.lookupExplicitConstructor(parameter_list, super_constructors)) == null) { throw `NO SUPER CONSTRUCTOR MATCHES THE CURRENT PARAMETERS${this.parseSemanticError(iNode)}` }

      if (this.super_found == null) throw `ERROR MIO DE COMPILACION...${this.parseSemanticError(iNode)}`
    }

    // codigo*
    const block = iNode
    const block_stmt = new BlockStmtTranslator(this)
    block_stmt.setSiguiente(Generator.genLabel())
    Backend.Display.OutLabel = block_stmt.siguiente
    block_stmt.translate(block, false)
    Backend.Display.OutLabel = ''
    Backend.SymbolTable = RefSymTab

    this.setCode(((this.super_found != null) ? TranslatorHelpers.functionCall(this.super_found) : '') + block_stmt.getCode() + TranslatorHelpers.generateLabel(block_stmt.siguiente))
    return this.super_found
  }

  lookupExplicitConstructor (parameter_list, super_constructor_list) {
    for (const sym of super_constructor_list) {
      const symbol_parameters = sym.getParameters()

      if (symbol_parameters == null && parameter_list == null) { return sym }

      if (sym.getParameters().length != parameter_list.length) { continue }

      if (this.parameterTypeChecking(symbol_parameters, parameter_list)) { return sym.functionId }
    }

    return null
  }

  parameterTypeChecking (symbol_parameters, parameter_list) {
    for (let i; i < parameter_list.length; i++) {
      if (!this.typeChecking(symbol_parameters[i][1], symbol_parameters[i][3], symbol_parameters[i][4],
        parameter_list[i][1], parameter_list[i][3], parameter_list[i][4])) { return false }
    }
    return true
  }
}

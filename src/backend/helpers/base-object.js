import { Backend } from '../backend'
import { SymTabImp } from '../symbol-table/sym-tab-imp'
import { SymImp } from '../symbol-table/sym-imp'
import { CompilerTypes } from '../compiler-types'

export const saveFunctionInSymbolTable = (identifier, rol, type, aux_type, params, node, dims = 0, modifiers = { static: false, protected: false, public: false, private: false }) => {
  const symbol = createVariable(identifier, rol, type, '-', '-', aux_type, params, dims)
  symbol.node = node
  Backend.SymbolTable.insert(identifier, symbol)
  return symbol
}

const createVariable = (identifier, rol, type, scope, position, aux_type, params = null, dims = 0, modifiers) => {
  return new SymImp(identifier, rol, type, scope, position, aux_type, params, dims, modifiers)
}

export const insertInSymbolTable = (identifier, rol, type, position, aux_type, params = null, dims = 0, modifiers, isStatic = false) => {
  const scope = Backend.ScopeStack.currentNestingLevel()
  const symbol = createVariable(identifier, rol, type, scope, position, aux_type, params, dims, modifiers)

  if (symbol.rol === CompilerTypes.GLOBAL || isStatic) {
    symbol.rol = CompilerTypes.GLOBAL
    Backend.Heap_Pointer += 1
  }

  if (!isStatic) {
    if (dims !== 0) { symbol.is_array = true } else { symbol.is_array = false }
    Backend.SymbolTable.insert(identifier, symbol)
    return symbol
  } else {
    let symTab = Backend.SymbolTable
    while (symTab.parent != null) { symTab = symTab.parent }
    symbol.scope = '0'
    symTab.insert(identifier, symbol)
    return symbol
  }
}

export const createObjectClass = () => {
  const ObjectTable = new SymTabImp(null)

  ObjectTable.insertInSymbolTable('equals', CompilerTypes.FUNCTION, CompilerTypes.BOOLEAN, 0, null, null, [['left', CompilerTypes.OBJECT], ['right', CompilerTypes.OBJECT]], null)
  ObjectTable.insertInSymbolTable('getClass', CompilerTypes.FUNCTION, CompilerTypes.STRING, 0, null, null, null, null)
  ObjectTable.insertInSymbolTable('toString', CompilerTypes.FUNCTION, CompilerTypes.STRING, 0, null, null, null, null)
}

export const createDefaultConstructorEntry = (identifier, parentSymTab, fnId) => {
  // identifier, rol, type, aux_type, params, node, dims = 0
  const symbol = saveFunctionInSymbolTable(identifier, CompilerTypes.CONSTRUCTOR, CompilerTypes.OBJECT, Backend.Classes.getType(identifier), [], null, 0)
  symbol.functionId = fnId
  symbol.setSymbols(new SymTabImp(parentSymTab))
}

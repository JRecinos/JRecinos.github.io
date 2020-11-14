import { CompilerTypes } from '../compiler-types'
import { Backend } from '../backend'
import { tree_types } from '../ast/tree-types'

export class Translator {
  constructor (parent = null) {
    this.parent = parent
    this.code = ''
  }

  setCode (str) {
    this.code = str
  }

  getCode () {
    return this.code
  }

  parseSemanticError (node) {
    let tmp = node
    while (tmp.getLine() == -1 && tmp.getColumn() == -1) {
      tmp = tmp.getParent()
    }

    return ` AT LINE: ${tmp.getLine()}, COLUMN ${tmp.getColumn()} IN FILE ${tmp.file}`
  }

  typeChecking (type1, aux_type1, dims1, type2, aux_type2, dims2) {
    /***
         * 1 -> lhs
         * 2 -> rhs
         */

    const dims_ok = dims1 == dims2
    let type_ok = type1 == type2
    let aux_ok = aux_type1 == aux_type2

    if (!aux_ok && aux_type1 && aux_type2 === CompilerTypes.NULL) {
      aux_ok = true
    } else if (!aux_ok && aux_type1 != null && aux_type2 != null) {
      // pueden existir aux_types primitivos
      // vamos a suponer que solo son objetos
      const tAux = Backend.ClassTemplates.get(aux_type2)
      if (tAux === undefined) aux_ok = false
    }

    /**
         * PRIMITIVE TYPE AREA
         */
    if (!type_ok) {
      /* IMPLICIT CAST */
      if (type2 === CompilerTypes.INTEGER && type1 === CompilerTypes.DOUBLE) { type_ok = true }
      if (type2 === CompilerTypes.CHAR && type1 === CompilerTypes.DOUBLE) { type_ok = true }
      if (type2 === CompilerTypes.CHAR && type1 === CompilerTypes.INTEGER) { type_ok = true }
    }

    return dims_ok && type_ok && aux_ok
  }

  parseType (type) {
    switch (type) {
      case tree_types.types.INTEGER:
        return CompilerTypes.INTEGER
      case tree_types.types.DOUBLE:
        return CompilerTypes.DOUBLE
      case tree_types.types.STRING:
        return CompilerTypes.STRING
      case tree_types.types.CHAR:
        return CompilerTypes.CHAR
      case tree_types.types.BOOLEAN:
        return CompilerTypes.BOOLEAN
      default:
        return CompilerTypes.OBJECT
    }
  }
}

import { tree_types } from '../ast/tree-types'
import { CompilerTypes, CompilerTypesNames } from '../compiler-types'

export class TypeChecking {
  static ExpressionTypeChecking (op, opL, opR) {
    /* if (!(opL instanceof CompilerTypes && opR instanceof CompilerTypes))
            throw new Exception("UNABLE TO PERFORM AN ARITHMETIC OPERATION BETWEEN " + opL.toString().toUpperCase()
                    + " " + opR.toString().toUpperCase()); */

    const op_left = opL; const op_right = opR

    switch (op) {
      case tree_types.types.PLUS: {
        if (op_left == CompilerTypes.DOUBLE) {
          switch (op_right) {
            case CompilerTypes.INTEGER:
            case CompilerTypes.CHAR:
            case CompilerTypes.DOUBLE:
              return CompilerTypes.DOUBLE
            case CompilerTypes.STRING:
              return CompilerTypes.STRING
          }
        }

        if (op_left == CompilerTypes.INTEGER) {
          switch (op_right) {
            case CompilerTypes.INTEGER:
            case CompilerTypes.CHAR:
              return CompilerTypes.INTEGER
            case CompilerTypes.DOUBLE:
              return CompilerTypes.DOUBLE
            case CompilerTypes.STRING:
              return CompilerTypes.STRING
          }
        }

        if (op_left == CompilerTypes.STRING) {
          switch (op_right) {
            case CompilerTypes.INTEGER:
            case CompilerTypes.CHAR:
            case CompilerTypes.DOUBLE:
            case CompilerTypes.STRING:
            case CompilerTypes.BOOLEAN:
            case CompilerTypes.OBJECT:
              return CompilerTypes.STRING
          }
        }

        if (op_left == CompilerTypes.CHAR) {
          switch (op_right) {
            case CompilerTypes.INTEGER:
              return CompilerTypes.INTEGER
            case CompilerTypes.DOUBLE:
              return CompilerTypes.DOUBLE
            case CompilerTypes.STRING:
              return CompilerTypes.STRING
          }
        }

        if (op_left == CompilerTypes.BOOLEAN) {
          switch (op_right) {
            case CompilerTypes.STRING:
              return CompilerTypes.STRING
          }
        }

        if (op_left == CompilerTypes.OBJECT) {
          switch (op_right) {
            case CompilerTypes.STRING:
              return CompilerTypes.STRING
          }
        }
      }
      case tree_types.types.MINUS: {
        if (op_left == CompilerTypes.DOUBLE) {
          switch (op_right) {
            case CompilerTypes.INTEGER:
            case CompilerTypes.CHAR:
            case CompilerTypes.DOUBLE:
              return CompilerTypes.DOUBLE
          }
        }

        if (op_left == CompilerTypes.INTEGER) {
          switch (op_right) {
            case CompilerTypes.INTEGER:
            case CompilerTypes.CHAR:
              return CompilerTypes.INTEGER
            case CompilerTypes.DOUBLE:
              return CompilerTypes.DOUBLE
          }
        }
      }
      case tree_types.types.DIV:
      case tree_types.types.MOD:
      case tree_types.types.MULT: {
        if (op_left === CompilerTypes.DOUBLE) {
          switch (op_right) {
            case CompilerTypes.INTEGER:
            case CompilerTypes.CHAR:
            case CompilerTypes.DOUBLE:
              return CompilerTypes.DOUBLE
          }
        }

        if (op_left === CompilerTypes.INTEGER) {
          switch (op_right) {
            case CompilerTypes.INTEGER:
            case CompilerTypes.CHAR:
              if (op === tree_types.types.DIV) { return CompilerTypes.DOUBLE } else { return CompilerTypes.INTEGER }

            case CompilerTypes.DOUBLE:
              return CompilerTypes.DOUBLE
          }
        }
      }
    }

    throw `UNABLE TO OPERATE TYPES ${CompilerTypesNames[opL]} AND ${CompilerTypesNames[opR]} UNDER SYMBOL ${tree_types.names[op]}`
  }

  static RelationalTypeChecking (op, opL, opR) {
    const op_left = opL; const op_right = opR

    switch (op) {
      case tree_types.types.NOTEQ:
      case tree_types.types.EQEQ: {
        switch (op_left) {
          case CompilerTypes.STRING: {
            switch (op_right) {
              case CompilerTypes.STRING:
              case CompilerTypes.NULL:
                return CompilerTypes.BOOLEAN
            }
          }
            break
          case CompilerTypes.DOUBLE:
          case CompilerTypes.INTEGER:
          case CompilerTypes.CHAR:
            switch (op_right) {
              case CompilerTypes.CHAR:
              case CompilerTypes.DOUBLE:
              case CompilerTypes.INTEGER:
                return CompilerTypes.BOOLEAN
            }
            break
          case CompilerTypes.BOOLEAN: {
            if (op_right == CompilerTypes.BOOLEAN) { return CompilerTypes.BOOLEAN }
          }
            break

          case CompilerTypes.OBJECT: {
            if (op_right == CompilerTypes.NULL || op_right == CompilerTypes.OBJECT) { return CompilerTypes.BOOLEAN }
          }
            break
        }
      }
        break
      case tree_types.types.LT:
      case tree_types.types.GT:
      case tree_types.types.GTE:
      case tree_types.types.LTE: {
        switch (op_left) {
          case CompilerTypes.DOUBLE:
          case CompilerTypes.INTEGER:
          case CompilerTypes.CHAR:
            switch (op_right) {
              case CompilerTypes.CHAR:
              case CompilerTypes.DOUBLE:
              case CompilerTypes.INTEGER:
                return CompilerTypes.BOOLEAN
            }
            break
        }
      }
        break
    }

    throw `UNABLE TO OPERATE TYPES ${CompilerTypesNames[op_left]} / ${CompilerTypesNames[op_right]} UNDER OP: ${tree_types.names[op]}`
  }

  static PowTypeChecking (op_left, op_right) {
    if ((op_left == CompilerTypes.INTEGER || op_left == CompilerTypes.DOUBLE || op_left == CompilerTypes.CHAR) &&
            (op_right == CompilerTypes.INTEGER || op_right == CompilerTypes.DOUBLE || op_right == CompilerTypes.CHAR)) { return true }

    throw 'PARAMETER TYPES CANT BE OPERATED UNDER FUNCTION POW'
  }

  static ImplicitTypeChecking (op_left, op_right) {
    switch (op_left) {
      case CompilerTypes.DOUBLE:
        if (op_right === CompilerTypes.INTEGER || op_right === CompilerTypes.CHAR) { return CompilerTypes.DOUBLE } else return -1
      case CompilerTypes.INTEGER:
        if (op_right === CompilerTypes.CHAR) { return CompilerTypes.DOUBLE } else return -1
      default:
        return -1
    }
  }
}

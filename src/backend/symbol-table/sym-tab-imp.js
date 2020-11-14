import { CompilerTypes } from '../compiler-types'

export class SymTabImp {
  // start in one because we are using this to add up to the stack
  constructor (parent = null) {
    this.parent = parent
    this.children = new Map()
    this.table = new Map()
    this.size = 0
    this.constSize = 0
    this.temporary = [0, 0]
    this.name = ''
    this.modifiers = {}
    this.symbols = null
    this.type = null
    this.constructors = []
  }

  /***
     *
     * @param identifier: key to insert in table
     * @param symbol:     the symbol information itself
     * @return: true or false if information was or not saved
     * @throws Exception
     */
  insert (identifier, symbol) {
    if (this.table.has(identifier)) {
      if (symbol.getRol() == CompilerTypes.FUNCTION || symbol.getRol() == CompilerTypes.PROCEDURE ||
                symbol.getRol() == CompilerTypes.CONSTRUCTOR) {
        const symList = this.table.get(symbol.getIdentifier())

        for (let i = 0; i < symList.length; i++) {
          if ((symbol.getRol() == CompilerTypes.FUNCTION || symbol.getRol() == CompilerTypes.PROCEDURE ||
                        symbol.getRol() == CompilerTypes.CONSTRUCTOR) &&
                        symList[i].getParameters().length == symbol.getParameters().length) { throw `THE FUNCTION / PROCEDURE ${symbol.identifier} IS ALREADY DEFINED` }
        }

        symList.push(symbol)
        symbol.setContainer(this)
        return true
      } else {
        const arr = this.getAllSyms(identifier)
        const size = arr.length

        for (let i = 0; i < size; i++) {
          if (arr[i].getRol() == CompilerTypes.FUNCTION || arr[i].getRol() == CompilerTypes.PROCEDURE ||
                        arr[i].getRol() == CompilerTypes.CONSTRUCTOR) { continue }

          if (symbol.getScope().length < arr[i].getScope().length) {
            arr.push(symbol)
            if (symbol.modifiers == null || !symbol.modifiers.static) { this.size += 1 }
            return true
          } else {
            if (this.checkScope(arr[i].getScope(), symbol.getScope()) < 0) {
              arr.push(symbol)
              if (symbol.modifiers == null || !symbol.modifiers.static) { this.size += 1 }
              return true
            }
          }
        }
      }

      throw `THE VARIABLE ${identifier} YOU ARE ABOUT TO SAVE IS ALREADY DEFINED`
    } else {
      const symList = []
      symList.push(symbol)

      this.table.set(identifier, symList)
      if (symbol.getRol() != CompilerTypes.FUNCTION && symbol.getRol() != CompilerTypes.PROCEDURE &&
                symbol.getRol() != CompilerTypes.CONSTRUCTOR) {
        if (symbol.modifiers == null || !symbol.modifiers.static) { this.size += 1}
      }
      symbol.setContainer(this)
      return true
    }
  }

  /***
     *
     * @param identifier: pop the current symbol
     * @return
     */
  pop (identifier) {
    if (this.table.has(identifier)) {
      this.table.delete(identifier)
      return true
    }

    return false
  }

  /***
     *
     * @param symTab: parent SymTab this references at the current parent
     */
  setParent (symTab) {
    this.parent = symTab
    this.size = symTab.size
  }

  /***
     * Function to clear the current datatable
     */
  clean () {
    this.table.clear()
  }

  /***
     *
     * @return: the current SymTab parent;
     */
  getParent () {
    return this.parent
  }

  /***
     *
     * @return : current size
     */
  getSize () {
    return this.size
  }

  /***
     *
     * @return : the current table
     */
  getTable () {
    return this.table
  }

  /***
     *
     * @return : the amount of temporary in the function
     */
  getTemporary () {
    return this.temporary[1] - this.temporary[0]
  }

  setInitialTemporary (init) {
    this.temporary[0] = init
  }

  /***
     *
     * @param init : initial temporary to save
     * @param fin  : final temporary to save
     */
  setTemporary (init, fin) {
    this.temporary[0] = init
    this.temporary[1] = fin
  }

  lookupFunction (identifier, filters) {
    if (this.table.has(identifier)) {
      const array = this.table.get(identifier)

      for (const symbol of array) {
        if (!filters.includes(symbol) && (symbol.getRol() == CompilerTypes.FUNCTION || symbol.getRol() == CompilerTypes.PROCEDURE || symbol.getRol() == CompilerTypes.CONSTRUCTOR)) { return symbol }
      }
      return null
    }

    if (this.parent != null) { return this.parent.lookupFunction(identifier, filters) }

    return null
  }

  lookup (identifier, scope = '0') {
    if (this.table.has(identifier)) {
      const array = this.table.get(identifier)

      for (const symbol of array) {
        if (scope.length < symbol.scope.length) { continue } else if (scope.length == symbol.scope.length) {
          if (this.checkScope(symbol.getScope(), scope) == 0) { return symbol }
        }
        // this means the symbol scope is less than the scope
        else if (scope.indexOf(symbol.getScope()) == 0) { return symbol }
      }

      return null
    }

    if (this.parent != null) { return this.parent.lookup(identifier, scope) }

    return null
  }

  getInitialTemporary () {
    return this.temporary[0]
  }

  getFinalTemporary () {
    return this.temporary[1]
  }

  setSize (size) {
    this.size = size
  }

  copy () {
    const nSymTab = new SymTabImp(null)

    /**
         * WE ITERATE EVERY SYMBOL
         */
    const set = this.getTable().keys()
    let symbol = null

    for (const str of set) {
      // we get the symbol entry from the table and set its position to the
      // relative_pointer
      symbol = this.lookup(str)

      nSymTab.insert(str, symbol.copy())
    }

    return nSymTab
  }

  setConstSize (size) {
    this.constSize = size
  }

  getConstSize () {
    return this.constSize
  }

  jsonify (id) {
    const jObject = {}
    const jArray = []

    if (id == null) { jObject.main = jArray } else { jObject[id] = jArray }

    const set = this.getTable().keys()
    let tTable

    for (const str of set) {
      // we get the symbol entry from the table and set its position to the
      // relative_pointer
      tTable = this.table.get(str)

      tTable.forEach(symImp => {
        if (symImp.getRol() != CompilerTypes.FUNCTION && symImp.getRol() != CompilerTypes.PROCEDURE && symImp.getRol() != CompilerTypes.CONSTRUCTOR) { jArray.push(symImp.jsonify()) } else {
          jArray.push(symImp.jsonify())
          this.parseFunctionToParent(jObject, symImp.getSymbols(), symImp)
        }
      })
    }

    return jObject
  }

  parseFunctionToParent (jObject, symTab, symImp) {
    const jArray = []
    const id = symImp.getIdentifier()

    if (jObject[id] != undefined) { jObject[symImp.functionId] = jArray } else { jObject[id] = jArray }

    const set = symTab.table.keys()
    let tTable

    for (const str of set) {
      // we get the symbol entry from the table and set its position to the
      // relative_pointer
      tTable = symTab.table.get(str)

      tTable.forEach(symImp => {
        if (symImp.getRol() != CompilerTypes.FUNCTION && symImp.getRol() != CompilerTypes.PROCEDURE) { jArray.push(symImp.jsonify()) } else { this.parseFunctionToParent(jObject, symImp.getSymbols(), symImp.getIdentifier()) }
      })
    }
  }

  parseObjectTable (jObject, id) {
    const jArray = []
    jObject[id] = jArray

    const set = this.getTable().keys()
    let tTable

    for (const str of set) {
      // we get the symbol entry from the table and set its position to the
      // relative_pointer
      tTable = this.table.get(str)

      tTable.forEach(symImp => {
        if (symImp.getRol() != CompilerTypes.FUNCTION && symImp.getRol() != CompilerTypes.PROCEDURE) { jArray.push(symImp.jsonify()) }
      })
    }
  }

  setInformation (id, type) {
    this.name = id
    this.type = type
  }

  checkScope (v1, v2, options) {
    // console.log(v1,'-',v2);

    const lexicographical = options && options.lexicographical
    const zeroExtend = options && options.zeroExtend
    let v1parts = v1.split('.')
    let v2parts = v2.split('.')

    function isValidPart (x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x)
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push('0')
      while (v2parts.length < v1parts.length) v2parts.push('0')
      // console.log(v1parts,'--',v2parts);
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number)
      v2parts = v2parts.map(Number)
    }

    for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        return 1
      }

      if (v1parts[i] == v2parts[i]) {
        continue
      } else if (v1parts[i] > v2parts[i]) {
        return 1
      } else {
        return -1
      }
    }

    if (v1parts.length != v2parts.length) {
      return -1
    }

    return 0
  }

  getAllSyms (identifier) {
    return this.table.get(identifier)
  }

  getAllKeys () {
    return this.getTable().keys()
  }

  addConstructor (constr) {
    this.constructors.push(constr)
  }
}

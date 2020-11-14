
export class CustomType {
  constructor () {
    this.cTypes = new Map()
    this.current = 18
    this.addType('var')
  }

  /***
     *
     * @param name
     * @throws Exception
     */
  addType (name) {
    if (this.cTypes.has(name)) { throw new Error('TYPE' + name.toUpperCase() + 'ALREADY DEFINED.') }

    this.cTypes.set(name, this.current++)
  }

  getType (name) {
    if (!this.cTypes.has(name)) { return -1 }
    return this.cTypes.get(name)
  }

  containsKey (name) {
    return this.cTypes.has(name)
  }

  clear () {
    this.cTypes.clear()
    this.current = 18
    this.addType('var')
  }

  keys () {
    return this.cTypes.keys()
  }

  reverseMap (key) {
    for (const i of this.keys()) {
      if (this.cTypes.get(i) === key) { return i }
    }
    return '-------------'
  }
}

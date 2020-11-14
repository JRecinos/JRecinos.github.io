import { tree_types } from './tree-types'
import { Backend } from '../backend'

export const AST = class {
  constructor (type, value, line, col) {
    this.grouped = false
    this.type_name = type
    this.file = Backend.CurrentFile[Backend.CurrentFile.length - 1]
    this.type = tree_types.types[type.toString().toUpperCase()]
    if (this.type === undefined) { console.log(type, line, col) }

    this.value = (this.type === tree_types.types.IDENTIFIER) ? value.toLowerCase() : value
    this.line = line
    this.column = col
    this.children = []
    this.last = null
    this.parent = null

    for (let i = 4; i < arguments.length; i++) {
      this.children.push(arguments[i])
      arguments[i].parent = this
    }
  }

  getLine () {
    return this.line
  }

  getColumn () {
    return this.column
  }

  getValue () {
    return this.value
  }

  changeType (type) {
    this.type = tree_types.types[type.toString().toUpperCase()]
    this.type_name = type.toString().toUpperCase()
  }

  addChild (...args) {
    args.forEach(element => {
      this.children.push(element)
      this.grouped = this.grouped || element.grouped
      element.parent = this
    })
  }

  getChild (index) {
    if (index > this.children.length) return null

    return this.children[index]
  }

  getChildren () {
    return this.children
  }

  printTree (indent = '') {
    console.log(`${indent}#${tree_types.names[this.type]} (${this.type})`)

    this.children.forEach(it => {
      it.printTree(indent + '\t')
    })

    if (this.next) { this.next.printTree(indent) }
  }

  copy () {
    const nodo = new AST(this.type_name, this.value, this.line, this.column)
    nodo.type = this.type
    return nodo
  }

  copyWithChildren () {
    const nodo = new AST(this.type_name, this.value, this.line, this.column)
    nodo.type = this.type
    this.children.forEach(item => nodo.addChild(item.copyWithChildren()))
    return nodo
  }

  insertAt (index, value, fromiterable = false) {
    if (fromiterable) { this.children.splice(index, 0, ...value) } else { this.children.splice(index, 0, value) }
  }

  setIndex () {
    this.index = window.index
    window.index++

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setIndex(window.index)
    }
  }

  deleteAt (index) {
    return this.children.splice(index, 1)
  }

  writeNode () {
    let str = `\n\tnode${this.index} [label="${tree_types.names[this.type]} (${this.index}) ${this.value != null ? this.value : ''}"];\n`

    for (let i = 0; i < this.children.length; i++) {
      str += this.children[i].writeNode()
      str += `\n\tnode${this.index} -> node${this.children[i].index};`
    }

    return str
  }

  lookupByIndex (index) {
    if (this.index === index) { return this }

    let value = null
    for (const n of this.children) {
      if ((value = n.lookupByIndex(index)) != null) { return value }
    }

    return null
  }

  lookupByType (type) {
    if (this.type === type) { return this }

    for (const n of this.children) {
      if (n.getType() === type) { return n }
    }

    return null
  }

  getType () {
    return this.type
  }

  getParent () {
    return this.parent
  }

  childrenSize () {
    return this.children.length
  }

  getPosition (ast) {
    for (let i = 0; i < this.childrenSize(); i++) {
      if (ast === this.children[i]) { return i }
    }

    return -1
  }
}

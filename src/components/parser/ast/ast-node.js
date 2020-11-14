import { tree_types } from './tree-types'

export const AstNode = class {
  constructor (type, value, line, col) {
    this.type = tree_types.types[type.toString().toLowerCase()]
    this.name = type.toString().toLowerCase()
    if (this.type === undefined) console.log(type)
    this.value = value
    this.line = line
    this.column = col
    this.children = []
    this.next = null
    this.last = null
    this.parent = null
    this.isFalse = false
    this.isLeader = false

    for (let i = 4; i < arguments.length; i++) {
      this.children.push(arguments[i])
      arguments[i].parent = this
    }
  }

  markLeader () {
    this.isLeader = true
  }

  getValue () {
    return this.value
  }

  addChild (...args) {
    args.forEach(element => {
      this.children.push(element)
      element.parent = this
    })
  }

  getChild (index) {
    if (index > this.children.length) return null

    return this.children[index]
  }

  getLine () {
    return this.line
  }

  setValue (val) {
    this.value = val
  }

  setNext (node) {
    let tmp = this

    while (tmp.next != null) { tmp = tmp.next }

    tmp.next = node
    if (node !== null) { node.last = tmp }
  }

  changeType (nType) {
    this.type = tree_types.types[nType]
    this.name = nType
  }

  printTree (indent = '') {
    console.log(`${indent}#${tree_types.names[this.type]} (${this.type})`)

    this.children.forEach(it => {
      it.printTree(indent + '\t')
    })

    if (this.next) { this.next.printTree(indent) }
  }

  toString () {
    switch (this.type) {
      case tree_types.types.stack:
        return `Stack[${this.getChild(0).toString()}]`
      case tree_types.types.heap:
        return `Heap[${this.getChild(0).toString()}]`
      case tree_types.types['-']:
      case tree_types.types['*']:
      case tree_types.types['/']:
      case tree_types.types['+']:
      case tree_types.types['%']:
        return `${this.getChild(0).toString()} ${tree_types.names[this.type]} ${this.getChild(1).toString()}`
      case tree_types.types.tmp:
      case tree_types.types.number:
        return this.value
      case tree_types.types.sp:
        return 'P'
      case tree_types.types.hp:
        return 'H'
      case tree_types.types.var: {
        if (this.getChild(0).type === tree_types.types.heap) {
          return 'var Heap[];\n'
        } else if (this.getChild(0).type === tree_types.types.stack) {
          return 'var Stack[];\n'
        } else {
          if (this.children.length > 1) {
            return `var ${this.children.map((el) => el.toString()).join(',')};\n`
          } else {
            return `var ${this.getChild(0).toString()};\n`
          }
        }
      }
      case tree_types.types.print: {
        return `print (${this.value}, ${this.getChild(0).toString()});\n`
      }
      case tree_types.types.label: {
        return `${this.value}:\n`
      }
      case tree_types.types.goto: {
        return `goto ${this.value};\n`
      }
      case tree_types.types['<']:
      case tree_types.types['>']:
      case tree_types.types['>=']:
      case tree_types.types['<=']:
      case tree_types.types['<>']:
      case tree_types.types['==']:
        return `if (${this.getChild(0).toString()}${(!this.isFalse) ? tree_types.names[this.type] : this.negate()}${this.getChild(1).toString()}) goto ${this.value};\n`
      case tree_types.types['=']:
        return `${this.getChild(0).toString()} = ${this.getChild(1).toString()};\n`
      case tree_types.types.call:
        return `${this.value}();\n`
      case tree_types.types.method: {
        let code = ''
        let tmp = this.getChild(0)
        while (tmp !== null) {
          code += tmp.toString()
          tmp = tmp.next
        }
        return `void ${this.value} {\n${code}return;\n}\n`
      }
      case tree_types.types.e:
        return 'E'
      default:
        return ''
    }
  }

  copy () {
    const nNode = new AstNode(this.name, this.value, this.line, this.column)
    nNode.name = this.name
    nNode.type = this.type
    nNode.isFalse = this.isFalse
    nNode.isLeader = this.isLeader
    // we copy the children by name
    for (const node of this.children) {
      nNode.addChild(node.copy())
    }
    return nNode
  }

  childrenSize () {
    return this.children.length
  }

  equals (nNode) {
    return nNode.name === this.name && nNode.type === this.type && this.value === nNode.value &&
            nNode.column === this.column && nNode.line === this.line
  }

  getNonNumericTypes () {
    switch (this.type) {
      case tree_types.types.hp:
        return ['H']
      case tree_types.types.sp:
        return ['P']
      case tree_types.types.tmp:
        return [this.getValue()]
      case tree_types.types['-']:
      case tree_types.types['*']:
      case tree_types.types['/']:
      case tree_types.types['+']:
      case tree_types.types['%']: {
        const arr = []
        if (this.getChild(0).getType() !== tree_types.types.number) { arr.push(this.getChild(0).getValue()) }
        if (this.getChild(1).getType() !== tree_types.types.number) { arr.push(this.getChild(1).getValue()) }
        return arr
      }
      default:
        return []
    }
  }

  typeEquality (nNode) {
    if (nNode.childrenSize() !== this.childrenSize) return false

    if (this.getType() === nNode.getType() && this.getValue() === nNode.getValue()) {
      for (let i = 0; i < nNode.childrenSize(); i++) {
        if (!this.getChild(i).typeEquality(nNode)) { return false }
      }
      return true
    }

    return false
  }

  getType () {
    return this.type
  }

  toStringSpecial () {
    switch (this.type) {
      case tree_types.types.var:
        return 'var lista temporales;'
      case tree_types.types['>']:
        return `if (${this.getChild(0).toString()} GT ${this.getChild(1).toString()}) goto ${this.value}`
      case tree_types.types['>=']:
        return `if (${this.getChild(0).toString()} GTE ${this.getChild(1).toString()}) goto ${this.value}`
      case tree_types.types['<']:
        return `if (${this.getChild(0).toString()} LT ${this.getChild(1).toString()}) goto ${this.value}`
      case tree_types.types['<=']:
        return `if (${this.getChild(0).toString()} LTE ${this.getChild(1).toString()}) goto ${this.value}`
      case tree_types.types['==']:
        return `if (${this.getChild(0).toString()} EQEQ ${this.getChild(1).toString()}) goto ${this.value}`
      case tree_types.types['<>']:
        return `if (${this.getChild(0).toString()} NOTEQ ${this.getChild(1).toString()}) goto ${this.value}`
      default:
        return this.toString()
    }
  }

  negate () {
    switch (this.type) {
      case tree_types.types['>']:
        return '<='
      case tree_types.types['>=']:
        return '<'
      case tree_types.types['<=']:
        return '>'
      case tree_types.types['<']:
        return '>='
      case tree_types.types['<>']:
        return '=='
      default:
        return '<>'
    }
  }

  hasZero () {
    if (this.getChild(0).getType() === tree_types.types.number && this.getChild(0).value === 0) { return 0 }
    if (this.getChild(1).getType() === tree_types.types.number && this.getChild(1).value === 0) { return 1 }
    return -1
  }

  hasTwo () {
    if (this.getChild(0).getType() === tree_types.types.number && this.getChild(0).value === 2) { return 0 }
    if (this.getChild(1).getType() === tree_types.types.number && this.getChild(1).value === 2) { return 1 }
    return -1
  }

  hasOne () {
    if (this.getChild(0).getType() === tree_types.types.number && this.getChild(0).value === 1) { return 0 }
    if (this.getChild(1).getType() === tree_types.types.number && this.getChild(1).value === 1) { return 1 }
    return -1
  }

  deleteAt (index) {
    return this.children.splice(index, 1)
  }

  converToFalse () {
    this.isFalse = true
  }

  isConstantOperation () {
    return this.getChild(0).getType() === tree_types.types.number && this.getChild(1).getType() === tree_types.types.number
  }

  trimMethodList () {
    if (this.getChild(0).next != null) {
      this.getChild(0).next.last = null
      this.children[0] = this.getChild(0).next
    }

    let tNode = this.getChild(0)
    while (tNode.next != null) {
      tNode = tNode.next
    }
    tNode.last.next = tNode.next
  }

  usesTmp (identifier) {
    switch (this.getChild(0)) {
      case tree_types.types.heap:
      case tree_types.types.stack:
        if (this.getChild(0).getChild(0).getType() === tree_types.types.tmp && this.getChild(0).getChild(0).getValue() === identifier) { return true }
        break
      case tree_types.types.tmp:
      case tree_types.types.sp:
      case tree_types.types.hp:
        switch (this.getChild(1)) {
          case tree_types.types['-']:
          case tree_types.types['*']:
          case tree_types.types['/']:
          case tree_types.types['+']:
          case tree_types.types['%']:
            if (this.getChild(1).getChild(0).getType() === tree_types.types.tmp && this.getChild(1).getChild(0).getValue() === identifier) {
              return true
            }
            if (this.getChild(1).getChild(1).getType() === tree_types.types.tmp && this.getChild(1).getChild(1).getValue() === identifier) {
              return true
            }
            break
          case tree_types.types.tmp:
            if (this.getChild(1).getValue() === identifier) {
              return true
            }
            break
          default:
            break
        }
    }
    return false
  }
}

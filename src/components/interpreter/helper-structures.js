class HelperStructrues {
  constructor () {
    this.reset()
  }

  changeHeapPointer (val) {
    this.heap_pointer = val
  }

  changeStackPointer (val) {
    this.stack_pointer = val
  }

  insertTemporary (name, val) {
    if (!this.tKeys.includes(name)) { throw Error(`${name} is not defined`) }
    this.data[name] = val
  }

  setError (value) {
    this.error = value
  }

  getError (value) {
    return this.error
  }

  getTemporary (name) {
    return this.data[name]
  }

  getStackPointer () {
    return this.stack_pointer
  }

  addToStackPointer (num) {
    this.stack_pointer += num
  }

  substractToStackPointer (num) {
    this.stack_pointer -= num
  }

  getHeapPointer () {
    return this.heap_pointer
  }

  getFromStack (num) {
    return this.stack[num]
  }

  getFromHeap (num) {
    return this.heap[num]
  }

  insertInHeap (num, val) {
    this.heap[num] = val
    window.dispatchEvent(new CustomEvent('heap-changed', { detail: this.heap }))
  }

  insertInStack (num, val) {
    this.stack[num] = val
    window.dispatchEvent(new CustomEvent('stack-changed', { detail: this.stack }))
  }

  createTemporary (name) {
    this.data[name.toLowerCase()] = 0
    this.tKeys.push(name.toLowerCase())
  }

  reset () {
    this.consola = ['']
    this.data = {}
    this.tKeys = []
    this.labels = new Map() // label -> astNode
    this.methods = new Map() // label -> astNode
    this.stack_pointer = 0
    this.heap_pointer = 0
    this.error = 0
    this.stack = new Array(5000).fill(-1)
    this.heap = new Array(5000).fill(-1)
    this.callStack = []
    window.dispatchEvent(new CustomEvent('console-changed', { detail: this.consola }))
    window.dispatchEvent(new CustomEvent('stack-changed', { detail: this.stack }))
    window.dispatchEvent(new CustomEvent('heap-changed', { detail: this.heap }))
    window.dispatchEvent(new CustomEvent('heap-pointer-changed', { detail: this.heap_pointer }))
    window.dispatchEvent(new CustomEvent('stack-pointer-changed', { detail: this.stack_pointer }))
  }

  insertInCallStack (node) {
    this.callStack.push(node)
  }

  lastNode () {
    return this.callStack.pop()
  }

  mapLabels (astNode) {
    let tmp = astNode

    while (tmp != null) {
      if (tmp.type === 10) {
        this.labels.set(tmp.value, tmp)
      } else if (tmp.type == 7) {
        this.mapLabels(tmp.getChild(0))
      }
      tmp = tmp.next
    }
  }

  mapMethods (astNode) {
    this.methods.clear()

    let tmp = astNode

    while (tmp != null) {
      if (tmp.type == 7) { this.methods.set(tmp.value, tmp) }

      tmp = tmp.next
    }
  }

  getNode (label) {
    return this.labels.get(label)
  }

  insertInConsole (str, newline = false) {
    if (newline) { this.consola.push(str) } else { this.consola[this.consola.length - 1] = this.consola[this.consola.length - 1] + str }

    window.dispatchEvent(new CustomEvent('console-changed', { detail: this.consola }))
  }
}

export const Structures = new HelperStructrues()
window.Structures = Structures

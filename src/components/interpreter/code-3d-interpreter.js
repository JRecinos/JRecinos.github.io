import {
  Structures
} from './helper-structures'
import { AstNode } from '../parser/ast/ast-node'
import { tree_types } from '../parser/ast/tree-types'

class Code3DInterpreter {
  constructor () {
    this.breakpoints = []
    this.onReject = null
    this.onResolve = null
    this.stop = true
    this.lineByLine = false
    window.addEventListener('debugger-mode', (e) => {
      // por linea es el true
      if (e.detail) { this.lineByLine = true } else {
        this.lineByLine = false
        this.stop = true
      }
    })
  }

  heapAccess (astNode) {
    const value = this.leftHandAccess(astNode.getChild(0))
    if (value === -1 || value === 0) {
      Structures.insertInConsole('null pointer exception...', true)
      console.log(astNode.line, astNode.column)
      executeLine.next(new AstNode('exit', null, -1, -1))
    }
    return Structures.heap[value]
  }

  stackAccess (astNode) {
    const value = this.leftHandAccess(astNode.getChild(0))
    return Structures.stack[value]
  }

  assignment (astNode) {
    const value = this.leftHandAccess(astNode.getChild(1))

    switch (astNode.getChild(0).type) {
      case tree_types.types.tmp:
        // tmp
        Structures.data[astNode.getChild(0).value] = value
        window.dispatchEvent(new CustomEvent('temporaries-changed', { detail: { temporaries: Structures.data, tmp: astNode.getChild(0).value } }))
        break
      case tree_types.types.sp:
        // sp
        Structures.stack_pointer = parseInt(value)
        window.dispatchEvent(new CustomEvent('stack-pointer-changed', { detail: Structures.stack_pointer }))
        break
      case tree_types.types.hp:
        // hp
        Structures.heap_pointer = parseInt(value)
        window.dispatchEvent(new CustomEvent('heap-pointer-changed', { detail: Structures.heap_pointer }))
        break
      case tree_types.types.stack:
        // stack
        const stack_index = this.leftHandAccess(astNode.getChild(0).getChild(0))
        Structures.insertInStack(stack_index, value)
        break
      case tree_types.types.heap:
        // heap
        const heap_index = this.leftHandAccess(astNode.getChild(0).getChild(0))
        if (heap_index == -1 || heap_index == 0) {
          Structures.insertInConsole('null pointer exception...', true)
          executeLine.next(new AstNode('exit', null, -1, -1))
        }
        Structures.insertInHeap(heap_index, value)
        break
    }
  }

  leftHandAccess (astNode) {
    switch (astNode.type) {
      /***
             * "+" : 0,
             * "-" : 1,
             * "*" : 2,
             * "%" : 3,
             * "/" : 4,
             */
      case tree_types.types['+']:
      case tree_types.types['-']:
      case tree_types.types['*']:
      case tree_types.types['%']:
      case tree_types.types['/']:
        return this.aritmethicStmt(astNode)
      case tree_types.types.number:
        return astNode.value
      case tree_types.types.tmp:
        return Structures.getTemporary(astNode.value.toString().toLowerCase())
      case tree_types.types.heap:
        return this.heapAccess(astNode)
      case tree_types.types.stack:
        return this.stackAccess(astNode)
      case tree_types.types.hp:
        return Structures.heap_pointer
      case tree_types.types.sp:
        return Structures.stack_pointer
    }
  }

  aritmethicStmt (astNode) {
    const left = this.leftHandAccess(astNode.getChild(0))
    const right = this.leftHandAccess(astNode.getChild(1))

    switch (astNode.type) {
      case tree_types.types['+']:
        return left + right
      case tree_types.types['-']:
        return left - right
      case tree_types.types['*']:
        return left * right
      case tree_types.types['%']:
        return Math.fmod(left, right)
      case tree_types.types['/']:
        return parseFloat(left / right).toPrecision(2)
    }

    return -1
  }

  printStmt (astNode) {
    const par = astNode.value
    const value = this.leftHandAccess(astNode.getChild(0))

    switch (par) {
      case '"%c"':
        if (value === 10) { Structures.insertInConsole('', true) } else if (value != 13) { Structures.insertInConsole(String.fromCharCode(value)) }
        break
      case '"%i"':
        Structures.insertInConsole(value)
        break
      case '"%d"':
        Structures.insertInConsole(Number(value).toFixed(2))
        break
    }
  }

  jmpInconditionalStmt (astNode) {
    const label = astNode.value.toString()
    const nodo = Structures.getNode(label)

    executeLine.next(nodo.last).value
  }

  jmpConditionalStmt (astNode) {
    const leftVal = this.leftHandAccess(astNode.getChild(0))
    const rightVal = this.leftHandAccess(astNode.getChild(1))
    const label = astNode.value
    const nodo = Structures.getNode(label)

    switch (astNode.type) {
      case tree_types.types['==']:
        if (leftVal === rightVal) { executeLine.next(nodo).value }
        // je
        break
      case tree_types.types['<>']:
        // jne
        if (leftVal !== rightVal) { executeLine.next(nodo).value }
        break
      case tree_types.types['>']:
        // jg
        if (leftVal > rightVal) { executeLine.next(nodo).value }
        break
      case tree_types.types['<']:
        // jl
        if (leftVal < rightVal) { executeLine.next(nodo).value }
        break
      case tree_types.types['>=']:
        // jge
        if (leftVal >= rightVal) { executeLine.next(nodo).value }
        break
      case tree_types.types['<=']:
        // jle
        if (leftVal <= rightVal) { executeLine.next(nodo).value }
        break
    }
  }

  async executeProgram (temporary) {
    console.log('STARTING EXECUTION...')

    let astNode = null
    let flag = true
    let lblFlag = false

    Structures.reset()

    while ((astNode = executeLine.next().value)) {
      if (flag) {
        // Structures.createAllTemporary(temporary)
        Structures.labels.clear()
        Structures.mapLabels(astNode)
        Structures.mapMethods(astNode)
        flag = false
      }

      if (this.lineByLine && this.breakpoints.length > 0) {
        if (lblFlag) { await this.stopLine(astNode.getLine()) } else
        if ((lblFlag = this.breakpoints[0] === astNode.getLine())) { await this.stopLine(astNode.getLine()) }
      } else if (this.stop && !this.lineByLine) {
        if (this.breakpoints.includes(astNode.getLine())) { await this.stopLine(astNode.getLine()) }

        this.stop = this.breakpoints.length > 0
      }

      switch (astNode.type) {
        case tree_types.types.var:
          this.declarationStmt(astNode)
          break
        case tree_types.types.goto:
          this.jmpInconditionalStmt(astNode)
          break
        case tree_types.types['<']:
        case tree_types.types['>']:
        case tree_types.types['<=']:
        case tree_types.types['>=']:
        case tree_types.types['<>']:
        case tree_types.types['==']:
          this.jmpConditionalStmt(astNode)
          break
        case tree_types.types['=']:
          this.assignment(astNode)
          break
        case tree_types.types.print:
          // print
          this.printStmt(astNode)
          break
        case tree_types.types.end:
          executeLine.next(Structures.lastNode())
          break
        case tree_types.types.call:
          // call
          Structures.insertInCallStack(astNode)
          const method_node = Structures.methods.get(astNode.value)
          executeLine.next(method_node.getChild(0))
          break
        /* case 9:
          // end
          executeLine.next(Structures.getStackPointer())
          break
          */
        default:
          /* console.log("$$$$$ ERRRRRROR $$$$$$");
                    console.log(tree_types.names[astNode.type]); */
          break
      }
    }

    console.log('EXECUTION FINISHED...')
    window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'interpreter has finished' }))
    window.dispatchEvent(new CustomEvent('finished'))
  }

  declarationStmt (astNode) {
    for (let i = 0; i < astNode.children.length; i++) {
      if (astNode.getChild(i).type === 11) {
        Structures.createTemporary[astNode.getChild(i).value] = -1
      }
    }
  }

  setBreakPoint (bp) {
    this.breakpoints = bp
  }

  stopLine (line) {
    window.dispatchEvent(new CustomEvent('stopped', { detail: line }))
    return new Promise((resolve, reject) => {
      this.onResolve = resolve
      this.onReject = reject
    })
  }
}

export const Interpreter = new Code3DInterpreter()

import { tree_types } from '../parser/ast/tree-types'

class PeepHole {
  constructor () {
    this.lineSize = 15
    this.optimization = [

    ]
  }

  reset () {
    this.optimization = []
  }

  performOptimization (ast) {
    let tmpNode = ast
    while (tmpNode != null) {
      switch (tmpNode.getType()) {
        case tree_types.types['=']:
          this.optimizationEq(tmpNode)
          break
        case tree_types.types.method:
          this.performOptimization(tmpNode.getChild(0))
          break
        case tree_types.types['<']:
        case tree_types.types['<=']:
        case tree_types.types['>']:
        case tree_types.types['>=']:
        case tree_types.types['<>']:
        case tree_types.types['==']:
        case tree_types.types.goto:
          this.optimizationJump(tmpNode)
          break
        default:
          break
      }

      tmpNode = tmpNode.next
    }
  }

  optimizationEq (ast) {
    let rhsNode = null
    let position = -1
    switch ((rhsNode = ast.getChild(1)).getType()) {
      case tree_types.types['+']:
        // regla 8
        // regla 12
        if ((position = rhsNode.hasZero()) !== -1) { this.inspectByRule812(ast, position !== 0) }
        break
      case tree_types.types['-']:
        // regla 9
        // regla 13
        if ((position = rhsNode.hasZero()) === 1) { this.inspectByRule913(ast) }
        break
      case tree_types.types['*']:
        if ((position = rhsNode.hasOne()) !== -1) { this.inspectByRule1014(ast, position !== 0); break }
        if ((position = rhsNode.hasZero()) !== -1) { this.inspectByRule17(ast, position !== 0); break }
        if ((position = rhsNode.hasTwo()) !== -1) { this.inspectByRule16(ast, position); break }
        break
      case tree_types.types['/']: {
        if ((position = rhsNode.hasOne()) === 1) { this.inspectByRule1115(ast); break }
        if ((position = rhsNode.hasZero()) === 0) { this.inspectByRule18(ast); break }
        break
      }
    }
  }

  optimizationJump (ast) {
    switch (ast.getType()) {
      case tree_types.types['<']:
      case tree_types.types['<=']:
      case tree_types.types['>']:
      case tree_types.types['>=']:
      case tree_types.types['<>']:
      case tree_types.types['==']:
        this.inspectByRule45(ast)
        if (ast.mark) break
        this.inspectByRule3(ast)
        break
    }
  }

  optimizationMessage (rule, line, oldval, newval) {
    this.optimization.push({ rule, line, oldval, newval })
  }

  inspectByRule45 (ast) {
    /**
     * 1. check if both are constant, perform operation
     */
    if (!ast.isConstantOperation()) {
      return
    }

    /**
     * 2. check if next stmt is of type goto, in case it is, it must disappear
     */
    const isGoto = ast.next.getType() === tree_types.types.goto
    const oldval = ast.toString() + ((isGoto) ? ast.next.toString() : '')
    const condition = this.evalOperation(ast)

    // si el resultado es verdadero
    if (ast.isFalse) { return }

    if (condition) {
      ast.children = []
      ast.next = ast.next.next
      ast.changeType('goto')

      this.optimizationMessage(4, ast.line, oldval, ast.toString())
    } else {
      if (isGoto) {
        ast.last.next = ast.next

        this.optimizationMessage(5, ast.line, oldval, ast.next.toString())
        ast.mark = true
      } else {
        ast.last = ast.next
        ast.mark = true
        this.optimizationMessage(4, ast.line, oldval, '')
      }
    }
  }

  inspectByRule1 (ast) {
    if (ast.getChild(1).children.length > 1 || ast.getChild(1).getChild(0).getType() !== tree_types.types.tmp) { return }

    const rhs = ast.getChild(1).getValue()
    const lhs = ast.getChild(0).getValue()

    let tmpNode = ast.next

    const nodes = []
    while (tmpNode != null) {
      if (tmpNode.getType() === tree_types.types['=']) {
        if (!this.rule1Helper(tmpNode, nodes, rhs, lhs)) { break }
      }
      tmpNode = tmpNode.next
    }

    for (const node of nodes) {
      this.optimizationMessage(1, node.line, node.toString(), '')
      node.last.next = node.next
    }
  }

  rule1Helper (ast, nodeList, rhs, lhs) {
    if (ast.getChild(0).getType() !== tree_types.types.tmp) { return true }
    if (ast.getChild(1).getType() !== tree_types.types.tmp) { return true }

    if (ast.getChild(0).getValue() === rhs && ast.getChild(1).getType() !== tree_types.types.tmp) { return false }
    if (ast.getChild(0).getValue() === rhs && ast.getChild(1).getValue() !== lhs) { return false }

    nodeList.push(ast)
    return true
  }

  inspectByRule3 (ast) {
    /*
      * if
      * goto
      * Label
     */
    const ifNode = ast // (0)
    const gotoNode = ast.next // (1)
    const label = gotoNode.next // (2)

    if (gotoNode.getType() !== tree_types.types.goto) return
    if (label.getType() !== tree_types.types.label) return

    const oldval = ifNode.toString() + gotoNode.toString() + label.toString()

    if (ifNode.getValue() === label.getValue()) {
      ifNode.converToFalse()
      ifNode.setValue(gotoNode.getValue())
      ifNode.next = label.next
      // (0).next -> (1)
      // (1).next -> (2)
      // (2).next -> (3)
      // cambio
      // (0).next -> (3)
    } else {
      return
    }

    this.optimizationMessage(3, ast.line, oldval, ifNode.toString())
  }

  inspectByRule16 (ast, position) {
    const lhs = (position === 0) ? ast.getChild(1).getChild(1).copy() : ast.getChild(1).getChild(0).copy()
    const oldval = ast.toString()

    // we duplicate the node
    ast.getChild(1).deleteAt(position)
    ast.getChild(1).addChild(lhs)

    // we change the type
    ast.getChild(1).changeType('+')
    this.optimizationMessage(16, ast.line, oldval, ast.toString())
  }

  inspectByRule1115 (ast) {
    const rhs = ast.getChild(0).getValue()
    const lhs = ast.getChild(1).getChild(0).getValue()

    this.moveByRule(ast, true, rhs === lhs ? 11 : 15)
  }

  inspectByRule17 (ast, position) {
    this.moveByRule(ast, position === 0, 17)
  }

  inspectByRule18 (ast, position) {
    this.moveByRule(ast, true, 18)
  }

  inspectByRule913 (ast) {
    const rhs = ast.getChild(0).getValue()
    const lhs = ast.getChild(1).getChild(0).getValue()

    this.moveByRule(ast, true, rhs === lhs ? 9 : 13)
  }

  inspectByRule67 (ast) {
    const jumpLabel = ast.getValue()

    let labelNode = ast.next
    while (labelNode !== null && labelNode.getValue() !== jumpLabel) {
      labelNode = labelNode.next
    }

    if (labelNode !== null && labelNode.next.getType() === tree_types.types.goto) {
      const oldval = `${ast.toString()} ... ${labelNode.toString()}${labelNode.next.toString()}`
      ast.setValue(labelNode.next.getValue())
      this.optimizationMessage(ast.getType() === tree_types.types.goto ? 6 : 7, ast.line, oldval, `${ast.toString()} ... ${labelNode.toString()}${labelNode.next.toString()}`)
    }
  }

  inspectByRule1014 (ast, left = true) {
    const rhs = ast.getChild(0).getValue()
    const lhs = ast.getChild(1).getChild(left ? 0 : 1).getValue()

    this.moveByRule(ast, left, rhs === lhs ? 10 : 14)
  }

  /**
    *             =
    *       id          +
    *             op1         op2
    *       t0 = t0 + 0 regla 8
    *       t0 = 0 + t1 regla 12
   */
  inspectByRule812 (ast, left = true) {
    const lhs = ast.getChild(0).getValue()
    const rhs = ast.getChild(1).getChild(left ? 0 : 1).getValue()

    this.moveByRule(ast, left, rhs === lhs ? 8 : 12)
  }

  moveByRule (ast, removeLeft = true, rule) {
    const oldval = ast.toString()
    const opNode = ast.deleteAt(1)[0] // =>  este es el nodo +
    ast.addChild(opNode.deleteAt(removeLeft ? 0 : 1)[0])
    this.optimizationMessage(rule, ast.line, oldval, ast.toString())
  }

  programOptimization (ast) {
    console.log('Starting optimization...')
    this.reset()
    this.performOptimization(ast)
    console.log('Optimization finished...')
    window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'optimization by peephole done' }))
    window.dispatchEvent(new CustomEvent('optimization-done', { detail: this.optimization }))
  }

  evalOperation (ast) {
    const opLeft = ast.getChild(0).getValue()
    const opRight = ast.getChild(1).getValue()

    switch (ast.getType()) {
      case tree_types.types['<']:
        return opLeft < opRight
      case tree_types.types['>']:
        return opLeft > opRight
      case tree_types.types['<=']:
        return opLeft <= opRight
      case tree_types.types['>=']:
        return opLeft >= opRight
      case tree_types.types['<>']:
        return opLeft !== opRight
      default:
        return opLeft === opRight
    }
  }
}

export const peepHole = new PeepHole()

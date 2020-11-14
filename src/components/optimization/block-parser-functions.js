import { tree_types } from '../parser/ast/tree-types'

class BlockOptimizationFunctions {
  isTemporal (astNode) {
    return astNode.getType() === tree_types.types.tmp
  }

  isPointer (astNode) {
    return astNode.getType() === tree_types.types.hp || astNode.getType() === tree_types.types.sp
  }

  optimizationMessage (rule, line, oldval, newval, optimization) {
    optimization.push({ rule, line, oldval, newval })
  }

  subExpressionDeletion (block, messages) {
    /**
     * el nodo en ast
     */
    let ast = block.ast
    // for por línea
    // simulando un quicksort
    while (ast != null) {
      if (!this.isTemporal(ast)) { ast = ast.next; continue }

      let tmpNode = ast.next
      // at this point we already know is a temporary
      const identifier = ast.getValue()
      // here we retrieve the rhs values, if they are number we discard them
      // else we save them in an array
      const rhsValues = this.getChild(1).getNonNumericTypes()

      while (tmpNode != null) {
        // while for each line
        if (tmpNode.getType() !== tree_types.types['=']) {
          tmpNode = tmpNode.next
          continue
        }

        if (this.isPointer(tmpNode.getChild(0))) {
          if (tmpNode.getChild(0).getType() === tree_types.types.hp && rhsValues.includes('H')) { break }
          if (tmpNode.getChild(0).getType() === tree_types.types.sp && rhsValues.includes('P')) { break }
        }

        if (this.isTemporal(tmpNode.getChild(0)) && tmpNode.getChild(0).getValue() === identifier) { break }

        if (this.isTemporal(tmpNode.getChild(0)) && tmpNode.getChild(1).typeEquality(ast.getChild(1))) {
          // here we make the substitution
          const oldval = tmpNode.toString()
          tmpNode.deleteAt(1)
          tmpNode.addChild(ast.getChild(0).copy())
          this.optimizationMessage(21, 'B' + block.key, oldval, tmpNode.toString(), messages)
        }
        // we iterate through every line from the current
        tmpNode = tmpNode.next
      }

      // next line
      ast = ast.next
    }
  }

  copyCatPropagation (block, messages) {
    /**
     * el nodo en ast
     */
    let ast = block.ast
    // for por línea
    // simulando un quicksort
    while (ast != null) {
      if (!this.isTemporal(ast)) { ast = ast.next; continue }

      let tmpNode = ast.next
      // at this point we already know is a temporary
      const identifier = ast.getValue()
      // here we retrieve the rhs values, if they are number we discard them
      // else we save them in an array
      const rhsValues = this.getChild(1).getNonNumericTypes()

      while (tmpNode != null) {
        // while for each line
        if (tmpNode.getType() !== tree_types.types['=']) {
          tmpNode = tmpNode.next
          continue
        }

        if (this.isPointer(tmpNode.getChild(0))) {
          if (tmpNode.getChild(0).getType() === tree_types.types.hp && rhsValues.includes('H')) { break }
          if (tmpNode.getChild(0).getType() === tree_types.types.sp && rhsValues.includes('P')) { break }
        }

        if (this.isTemporal(tmpNode.getChild(0)) && tmpNode.getChild(0).getValue() === identifier) { break }

        if (this.isTemporal(tmpNode.getChild(0)) && tmpNode.getChild(1).typeEquality(ast.getChild(1))) {
          // here we make the substitution
          const oldval = tmpNode.toString()
          tmpNode.deleteAt(1)
          tmpNode.addChild(ast.getChild(0).copy())
          this.optimizationMessage(21, 'B' + block.key, oldval, tmpNode.toString(), messages)
        }
        // we iterate through every line from the current
        tmpNode = tmpNode.next
      }

      // next line
      ast = ast.next
    }
  }

  unusedVariable (block, messages) {
    /**
     * el nodo en ast
     */
    let ast = block.ast
    // for por línea
    // simulando un quicksort
    const unusedNodes = []
    while (ast != null) {
      if (ast.getType() !== tree_types.types['=']) {
        ast = ast.next
        continue
      }
      if (!this.isTemporal(ast.getChild(0))) { ast = ast.next; continue }

      let tmpNode = ast.next
      // at this point we already know is a temporary
      const identifier = ast.getChild(0).getValue()
      // here we need to check if the temporary is not used in

      let flag = false

      while (tmpNode != null) {
        // while for each line
        if (tmpNode.getType() !== tree_types.types['=']) {
          tmpNode = tmpNode.next
          continue
        }

        // probamos si está siendo utilizado en alguna variable
        if (tmpNode.usesTmp(identifier)) {
          flag = true
          break
        }

        tmpNode = tmpNode.next
      }

      if (!flag) {
        unusedNodes.push(ast)
      }
      // next line
      ast = ast.next
    }

    // here we delete all the nodes
    for (const node of unusedNodes) {
      this.optimizationMessage(23, 'B' + block.key, node.toString(), '', messages)
      if (node.last !== null) { node.last.next = node.next }
      if (node.next !== null) { node.next.last = node.last }
    }
  }
}

export const optimizationByBlockFunctions = new BlockOptimizationFunctions()

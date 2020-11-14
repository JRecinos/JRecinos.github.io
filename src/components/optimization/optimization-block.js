import { tree_types } from '../parser/ast/tree-types'
import { optimizationByBlockFunctions } from './block-parser-functions'
let correlative = 0

class Block {
  constructor (ast) {
    this.links = []
    this.tLinks = []
    this.ast = ast
    this.key = correlative++
    this.visited = false
    this.optimization = []
  }

  setLink (destiny) {
    this.links.push(destiny)
  }

  isJump (type) {
    switch (type) {
      case tree_types.types['<=']:
      case tree_types.types['>=']:
      case tree_types.types['<']:
      case tree_types.types['>']:
      case tree_types.types['<>']:
      case tree_types.types['==']:
      case tree_types.types.goto:
        return true
      default:
        return false
    }
  }

  toString () {
    return `B${this.key}[label=<
        <table border='1' cellborder='0' >
          <tr><td bgcolor="lightblue"><font color="#0000ff">B${this.key}</font></td></tr>
          ${this.nodeInfo()}
        </table>
      >]

      ${this.links.map(el => `B${this.key}->B${el.key}`).join('\n')}`
  }

  isTmpVar (tNode) {
    return tNode.getType() === tree_types.types.var && tNode.getChild(0).getType() === tree_types.types.tmp
  }

  nodeInfo () {
    let tNode = this.ast
    let code = ''
    while (tNode != null) {
      if (this.isJump(tNode.getType()) || this.isTmpVar(tNode)) { code += `<tr><td>  ${tNode.toStringSpecial()}  </td></tr>\n` } else { code += `<tr><td>${tNode.toString()}</td></tr>\n` }
      tNode = tNode.next
    }
    return code
  }
}

class BlockOptimization {
  constructor () {
    this.ast = null
    this.methodStack = [['global', []]]
    this.blockStack = this.methodStack[this.methodStack.length - 1][1]
    this.Helpers = []
  }

  isJump (type) {
    switch (type) {
      case tree_types.types['<=']:
      case tree_types.types['>=']:
      case tree_types.types['<']:
      case tree_types.types['>']:
      case tree_types.types['<>']:
      case tree_types.types['==']:
      case tree_types.types.goto:
        return true
      default:
        return false
    }
  }

  findNextBlock (ast) {
    const iniNode = ast
    if (!iniNode.isLeader) {
      window.alert('el ini no es lider!!!!')
    }
    // hotfix para out label
    let lastNode = ast.next
    while (lastNode !== null && !lastNode.isLeader) {
      lastNode = lastNode.next
    }

    if (lastNode == null) {
      this.createBlock(iniNode)
      return null
    }

    // lastNode.next && lastNode.next.markLeader()
    const jumpNode = this.findJumpNode(lastNode.last.getValue())
    const block = this.createBlock(iniNode)
    if (lastNode !== null) {
      block.tLinks.push(lastNode)
    }
    if (jumpNode != null) {
      block.tLinks.push(jumpNode)
    }
    return lastNode
  }

  findJumpNode (label) {
    let tNode = this.ast
    while (tNode != null) {
      if (tNode.getType() === tree_types.types.label && tNode.getValue() === label) {
        return tNode
      }
      tNode = tNode.next
    }
    return null
  }

  createBlock (start, counter) {
    const leadingNode = start.copy()

    if (counter === 0) {
      this.blockStack.push(new Block(leadingNode))
      return this.blockStack[this.blockStack.length - 1]
    }
    while (start.next != null && !start.next.isLeader) {
      start = start.next
      leadingNode.setNext(start.copy())
    }
    leadingNode.setNext(null)
    this.blockStack.push(new Block(leadingNode))
    return this.blockStack[this.blockStack.length - 1]
  }

  markLeadersJump (label) {
    let tNode = this.ast
    while (tNode != null) {
      if (tNode.getType() === tree_types.types.label && tNode.getValue() === label) {
        tNode.markLeader()
        return tNode
      }
      tNode = tNode.next
    }
    return null
  }

  markAllLeadersInBlock () {
    let tNode = this.ast
    while (tNode != null) {
      if (this.isJump(tNode.getType())) {
        this.markLeadersJump(tNode.getValue())
        if (tNode.next) {
          tNode.next.markLeader()
        }
      }
      tNode = tNode.next
    }
  }

  makeLinks () {
    for (const block of this.blockStack) {
      for (const link of block.tLinks) {
        const found = this.getBlockByLeading(block, link)
        if (found !== null) // { throw Error('Leading label not found') }
        { block.links.push(found) }
      }
    }
  }

  getBlockByLeading (block, link) {
    for (const el of this.blockStack) {
      if (el === block) continue
      if (el.ast.equals(link)) return el
    }

    return null
  }

  divideByBlocks (ast) {
    correlative = 0
    this.methodStack = []
    this.Helpers = []
    this.blockStack = null

    let tNode = ast
    let flag = false
    this.Helpers.push(ast)

    while (tNode.next != null) {
      if (tNode.getType() === tree_types.types.method) {
        this.Helpers.push(tNode)
        if (!flag) {
          tNode.last.next = null
        }
        flag = true
      } else {
        if (flag) {
          ast.setNext(tNode)
          flag = false
        }
      }
      tNode = tNode.next
    }

    // we create all the blocks
    for (const block of this.Helpers) {
      block.last = null
      block.setNext(null)
    }

    for (const astBlock of this.Helpers) {
      this.blockCreation(astBlock)
    }

    window.dispatchEvent(new CustomEvent('graphblock-generated', { detail: this.graphBlocks() }))
  }

  blockCreation (ast) {
    if (ast.getType() === tree_types.types.method) {
      this.methodStack.push([ast.getValue(), []])
      this.blockStack = this.methodStack[this.methodStack.length - 1][1]
      // we trim the method
      ast.trimMethodList()
      this.ast = ast.getChild(0)
      this.ast.markLeader()
      let tNode = this.ast
      this.markAllLeadersInBlock()
      while (tNode !== null) { tNode = this.findNextBlock(tNode) }
      this.makeLinks()
    } else {
      this.methodStack.push(['global', []])
      this.blockStack = this.methodStack[this.methodStack.length - 1][1]
      this.ast = ast
      this.ast.markLeader()
      let tNode = this.ast
      this.markAllLeadersInBlock()
      while (tNode !== null) { tNode = this.findNextBlock(tNode) }
      this.makeLinks()
    }
  }

  graphBlocks () {
    let code = 'Digraph G {\n\trankdir="RL";'
    for (const block of this.methodStack) {
      code += `subgraph cluster_${block[0]} {
          label = "${block[0]}";
          node [shape=plaintext fontname="Sans serif" fontsize="8"];
          ${block[1].reverse().map(el => el.toString()).join('\n')}
      }`
    }
    code += '\n}'
    return code
  }

  performOptimization () {
    /**
     * We iterate through every method in the stack
     */
    this.optimization = []
    for (const method of this.methodStack) {
      for (const block of method[1]) {
        optimizationByBlockFunctions(block, this.optimization)
      }
    }
    window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'optimization by block done' }))
    window.dispatchEvent(new CustomEvent('optimization-done', { detail: this.optimization }))
  }
}

export const optimizationByBlock = new BlockOptimization()

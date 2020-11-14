import { ExpressionBaseTranslator } from '../expression/expression-base-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { Backend } from '../../backend'
import { Generator } from '../../generators/generator'
import { CompilerTypes } from '../../compiler-types'

export class IdentifierTranslator extends ExpressionBaseTranslator {
  constructor (parent) {
    super(parent)
    this.position_code
    // this.access_code;
    this.stack
    this.isConstant = false
  }

  translate (INode) {
    this.iNode = INode

    const identifier = INode.getValue().toString()
    const curr_symTab = Backend.SymbolTable

    if (curr_symTab == null) { throw new Exception('UNABLE TO FIND A VALID SYMBOL TABLE????' + this.parseSemanticError(this.iNode)) }

    // we get the current symbol
    const sym = curr_symTab.lookup(identifier, Backend.ScopeStack.currentNestingLevel())

    // we check if symbol is actually found
    if (sym === null) { throw `UNABLE TO FIND THE VARIABLE WITH THAT NAME ${identifier} ${this.parseSemanticError(this.iNode)}` }
    this.isConstant = sym.isConstant()

    this.temporary = Generator.genTemporary()
    let code = ''
    this.type = sym.getType()
    this.aux_type = sym.getAuxType()
    this.dimensions = sym.dimensions
    this.is_array = sym.is_array

    /**
     * hotfix for var
     */

    switch (sym.getRol()) {
      // heap access
      case CompilerTypes.GLOBAL: {
        code += TranslatorHelpers.unaryAssign(sym.getPosition() + '', this.temporary)
        this.position_code = code + ''
        code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
        this.stack = 0
        this.type = sym.getType()
        this.aux_type = sym.getAuxType()
      }
        break
        /*
             ** IN THE FOLLOWING CASES WE NEED TO CHECK WHETER OR NOT THE VARIABLE IS PART OF
             * ANOTHER STACK THE NUMBER OF ACCESSES TO THE STACK WE WILL PERFORM IS
             * PROPORTIONAL TO THE NESTING LEVEL
             */
      case CompilerTypes.ATTRIBUTE:
        code += TranslatorHelpers.comment('attribute access')
        code += TranslatorHelpers.generateStackAccess('P', this.temporary)
        code += TranslatorHelpers.arithmeticOperation('+', this.temporary, sym.getPosition(), this.temporary)
        this.position_code = code + ''
        code += TranslatorHelpers.generateHeapAccess(this.temporary, this.temporary)
        this.code = code
        this.stack = 0
        break
      case CompilerTypes.VARIABLE:
        code += TranslatorHelpers.comment('variable access')
        code += TranslatorHelpers.arithmeticOperation('+', 'P', sym.getPosition(), this.temporary)
        this.position_code = code + ''
        code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
        this.stack = 1
        break
      case CompilerTypes.REF_PARAM:
        code += TranslatorHelpers.comment('ref param access')
        code += TranslatorHelpers.arithmeticOperation('+', 'P', sym.getPosition(), this.temporary)
        this.position_code = code + ''
        code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
        this.stack = 1
        break
      case CompilerTypes.VAL_PARAM:
        code += TranslatorHelpers.comment('val_param access')
        code += TranslatorHelpers.arithmeticOperation('+', 'P', sym.getPosition(), this.temporary)
        this.position_code = code + ''
        code += TranslatorHelpers.generateStackAccess(this.temporary, this.temporary)
        this.stack = 1
        break
    }

    this.setCode(code)
  }
}

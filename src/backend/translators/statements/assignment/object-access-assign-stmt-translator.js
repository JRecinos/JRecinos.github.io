import { Translator } from '../../translator'
import { ExpressionTranslator } from '../../expression/expression-translator'

export class ObjectAccessAssignStmtTranslator extends Translator {
  constructor (parent) {
    super(parent)
  }

  translate (INode, objectAccessTranslator) {
    this.iNode = INode

    // we get the right-hand side information
    const eTranslator = new ExpressionTranslator(this)
    eTranslator.translate(INode.getChild(1))

    let code = ''
    const temporary = Generator.genTemporary()
    // code += TranslatorHelpers.unaryAssign(symbol.getPosition()+"", temporary);

    // we have the position of the current attribte in the object
    if (objectAccessTranslator.symbol.getType() == CompilerTypes.OBJECT) {
      if (eTranslator.getType() == CompilerTypes.NULL) {
        if (rol == CompilerTypes.GLOBAL) { code += TranslatorHelpers.generateHeapAssign(temporary, '0') } else if (rol == CompilerTypes.VARIABLE) { code += TranslatorHelpers.generateHeapAssign(temporary, '0') } else if (rol == CompilerTypes.REF_PARAM) {
          code += TranslatorHelpers.generateStackAccess(temporary, temporary)
          code += TranslatorHelpers.generateHeapAccess(temporary, temporary)
        } else if (rol == CompilerTypes.ATTRIBUTE) {
          code += objectAccessTranslator.position_code
          code += TranslatorHelpers.generateHeapAssign(objectAccessTranslator.temporary,
            eTranslator.temporary)
        } else { throw new Exception('OBJECTS BY VALUE ARE NOT ALLOWED AT ' + this.parseSemanticError(this.iNode)) }
      } else if (eTranslator.getType() == CompilerTypes.OBJECT &&
                    eTranslator.getAuxType() == objectAccessTranslator.getAuxType()) {
        code += eTranslator.getCode()
        /* if (rol == CompilerTypes.GLOBAL) {
                    code += TranslatorHelpers.generateHeapAssign(temporary, eTranslator.getTemporary());
                } else */ if (rol == CompilerTypes.VARIABLE) {
          code += TranslatorHelpers.generateHeapAssign(temporary, eTranslator.getTemporary())
        } else if (rol == CompilerTypes.REF_PARAM) {
          code += TranslatorHelpers.generateStackAccess(temporary, temporary)
          code += TranslatorHelpers.generateHeapAccess(temporary, temporary)
        } else if (rol == CompilerTypes.ATTRIBUTE) {
          code += objectAccessTranslator.position_code
          code += TranslatorHelpers.generateHeapAssign(objectAccessTranslator.temporary,
            eTranslator.temporary)
        } else { throw `OBJECTS BY VALUE ARE NOT ALLOWED AT ${this.parseSemanticError(this.iNode)}` }
      }
      this.setCode(code)
      return
    }

    // now we just check if the left-hand-side and the right-hand side are
    // compatible
    // in the top we just checked for the same thing but for registers
    objectAccessTranslator.getType()
    eTranslator.getType()

    code += `${eTranslator.getCode()}${objectAccessTranslator.position_code}`
    code += TranslatorHelpers.generateHeapAssign(objectAccessTranslator.getTemporary(), eTranslator.getTemporary())

    this.setCode(code)
  }
}

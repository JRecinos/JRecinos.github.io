import { tree_types } from '../../ast/tree-types'
import { ExpressionTranslator } from '../expression/expression-translator'
import { CompilerTypes } from '../../compiler-types'
import { Translator } from '../translator'
import { insertInSymbolTable } from '../../helpers/base-object'
import { Backend } from '../../backend'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { TypeChecking } from '../../helpers/type-checking'

export class FieldDeclarationTranslator extends Translator {
  constructor (parent) {
    super(parent)
  }

  translate (global, iNode, attribute = false) {
    this.iNode = iNode

    // so right now we are supoused to get the current size
    let relative_pointer = (global && !attribute) ? (Backend.Heap_Pointer + 0) : (attribute ? 0 : 1) + Backend.SymbolTable.getSize()

    // TODO: CHECK null, IF null ARE STATIC THEN IT TURNS GLOBAL AND ALSO THE SIZE DOESNT ADD UP
    const typeNode = iNode.getChild(0)
    let type = this.getCompilerType(typeNode)

    let vNode = null
    let code = ''
    let aux_type = (type === CompilerTypes.OBJECT) ? Backend.Classes.getType(typeNode.getValue()) : null

    if (aux_type === -1) { throw Error(`UNABLE TO FIND THE SPECIFIED CLASS OBJECT ${typeNode.getValue()} ${this.parseSemanticError(iNode)}`) }
    let flag = false

    for (let i = 1; i < iNode.childrenSize(); i++) {
      vNode = iNode.getChild(i)
      flag = false

      // HOTFIX FOR ARRAYS
      if (vNode.getType() === tree_types.types.EQ &&
               type === CompilerTypes.ARRAY) {
        flag = true

        type = this.getCompilerType(typeNode.getChild(0))
        const eTrans = new ExpressionTranslator(this)
        eTrans.translate(vNode.getChild(1))

        if (eTrans.getAuxType() !== aux_type || eTrans.getType() !== type ||
                    !eTrans.is_array || eTrans.dimensions !== typeNode.getChild(1).childrenSize()) {
          if ((type = TypeChecking.ImplicitTypeChecking(type, eTrans.getType())) === -1) { throw Error(`UNABLE TO PERFORM ASSIGN FOR ${vNode.getChild(0).getValue()} UNCOMPATIBLE TYPES ${this.parseSemanticError(vNode)}`) }
        }

        // same code as below
        // cambio porque la sintaxis es lista_ids = E

        for (let i = 0; i < vNode.getChild(0).childrenSize(); i++) {
          try {
            const identifier = vNode.getChild(0).getChild(i).getValue()

            const symbol = insertInSymbolTable(identifier, (attribute ? CompilerTypes.ATTRIBUTE : (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE), type,
              relative_pointer++, aux_type, null, eTrans.dimensions)

            console.log('%c array eq declaration!' + identifier + '\n', 'background: #222; color: #bada55')
            symbol.setCode(eTrans.getCode())
            symbol.setTemporary(eTrans.getTemporary())

            if (global) { symbol.node = vNode.getChild(1) }

            // code += symbol.getCode();
            code += TranslatorHelpers.generateDefaultAssign(global, symbol.position, eTrans.getTemporary(), eTrans.getCode())
          // fin same code as below
          } catch (e) {
            throw Error(`${e} ${this.parseSemanticError(this.iNode)}`)
          }
        }
      } else if (type === CompilerTypes.ARRAY) {
        flag = true
        try {
          type = this.getCompilerType(typeNode.getChild(0))
          aux_type = (type === CompilerTypes.OBJECT) ? Backend.Classes.getType(typeNode.getChild(0).getValue()) : null

          if (aux_type === -1) { throw Error(`UNABLE TO FIND THE SPECIFIED CLASS OBJECT ${typeNode.getValue()} ${this.parseSemanticError(iNode)}`) }

          console.log('%c array declaration only!' + '\n', 'background: #222; color: #021B55')
          for (const node of vNode.getChildren()) {
            const symbol = insertInSymbolTable(node.getValue(), (attribute ? CompilerTypes.ATTRIBUTE : (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE), type,
              relative_pointer++, aux_type, null, typeNode.getChild(1).childrenSize())
            symbol.setCode(TranslatorHelpers.generateDefaultAssign(global, symbol.position))
            symbol.setTemporary(null)
            code += symbol.getCode()
          }
        } catch (e) {
          if (e.includes('LINE')) { throw e }
          throw `${e} ${this.parseSemanticError(this.iNode)}`
        }
      }

      if (flag) { continue }

      switch (type) {
        case CompilerTypes.OBJECT: {
          // first we get the ctype then we get the value of the position of the recently created shit
          try {
            // if it has a value, start it with the default value
            if (vNode.getType() == tree_types.types.EQ) {
              const eTrans = new ExpressionTranslator(this)
              eTrans.translate(vNode.getChild(1))

              for (const node of vNode.getChild(0).getChildren()) {
                const identifier = node.getValue()

                // TYPECHEKCING
                // COMMENT IF NOT WORKING
                if (type != eTrans.type || aux_type != eTrans.aux_type ||
                                eTrans.dimensions != 0) {
                  if (!this.typeChecking(type, aux_type, 0, eTrans.type, eTrans.aux_type, eTrans.dimensions)) { throw `UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(iNode)}` }
                }

                const symbol = insertInSymbolTable(identifier, (attribute ? CompilerTypes.ATTRIBUTE : (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE), type,
                  relative_pointer++, aux_type, null, 0, null)

                symbol.setCode(eTrans.getCode())
                symbol.setTemporary(eTrans.getTemporary())

                if (global) { symbol.node = vNode.getChild(1) }

                // code += symbol.getCode();
                code += TranslatorHelpers.generateDefaultAssign(attribute, symbol.position, eTrans.getTemporary(), eTrans.getCode())
              }
            } else {
              for (const node of vNode.getChildren()) {
                const symbol = insertInSymbolTable(node.getValue(), (attribute ? CompilerTypes.ATTRIBUTE : (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE), type,
                  relative_pointer++, aux_type, null, 0, null)
                symbol.setCode(TranslatorHelpers.generateDefaultAssign(attribute, symbol.position))
                symbol.setTemporary(null)
                code += symbol.getCode()
              }
            }
          } catch (e) {
            if (e.includes('LINE')) { throw e }
            throw `${e}${this.parseSemanticError(this.iNode)}`
          }
        }
          break
        default: {
          try {
            // if it has a value, start it with the default value
            if (vNode.getType() == tree_types.types.EQ) {
              const eTrans = new ExpressionTranslator(this)
              eTrans.translate(vNode.getChild(1))

              for (const idNode of vNode.getChild(0).getChildren()) {
                const identifier = idNode.getValue()

                // TYPECHEKCING
                // COMMENT IF NOT WORKING
                if (type != eTrans.type || eTrans.aux_type != null ||
                                  eTrans.dimensions != 0) {
                  if (!this.typeChecking(type, null, 0, eTrans.type, eTrans.aux_type, eTrans.dimensions)) { throw `UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(iNode)}` }
                }

                const symbol = insertInSymbolTable(identifier, (attribute ? CompilerTypes.ATTRIBUTE : (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE), type,
                  relative_pointer++, null, null, 0, null)

                symbol.setCode(eTrans.getCode())
                symbol.setTemporary(eTrans.getTemporary())

                if (global) { symbol.node = vNode.getChild(1) }

                code += symbol.getCode()
                code += TranslatorHelpers.generateDefaultAssign(attribute, symbol.position, eTrans.getTemporary(), '')
              }
            } else {
              for (const node of vNode.getChildren()) {
                const symbol = insertInSymbolTable(node.getValue(), (attribute ? CompilerTypes.ATTRIBUTE : (global) ? CompilerTypes.GLOBAL : CompilerTypes.VARIABLE), type,
                  relative_pointer++, null, null, 0, null)
                symbol.setCode(TranslatorHelpers.generateDefaultAssign(attribute, symbol.position))
                symbol.setTemporary(null)
                code += symbol.getCode()
              }
            }
          } catch (e) {
            console.log(e)
            if (e.includes('LINE')) { throw e }
            throw `${e} ${this.parseSemanticError(this.iNode)}`
          }
        }
          break
      }
    }

    this.setCode(code)
  }

  getCompilerType (type) {
    switch (type.getType()) {
      case tree_types.types.INTEGER:
        return CompilerTypes.INTEGER
      case tree_types.types.DOUBLE:
        return CompilerTypes.DOUBLE
      case tree_types.types.STRING:
        return CompilerTypes.STRING
      case tree_types.types.CHAR:
        return CompilerTypes.CHAR
      case tree_types.types.BOOLEAN:
        return CompilerTypes.BOOLEAN
      case tree_types.types.ARRAY:
        return CompilerTypes.ARRAY
      default:
        return CompilerTypes.OBJECT
    }
  }
}

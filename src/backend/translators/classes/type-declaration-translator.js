import { Translator } from '../translator'
import { tree_types } from '../../ast/tree-types'
// import { ClassTranslator } from './struct-translator'
import { Backend } from '../../backend'
import { jsharp, JSharpRoot } from '../../parser/jsharp'
import { FunctionDeclarationTranslator } from './function-declaration-translator'
import { SpecialDeclarationTranslator } from './special-declaration-translator'
import { TranslatorHelpers } from '../../generators/translator-helpers'
import { CompilerTypes } from '../../compiler-types'
import {
  saveFunctionInSymbolTable
} from '../../helpers/base-object'
import { Generator } from '../../generators/generator'
import { StructTranslator } from './struct-translator'
import { FieldDeclarationTranslator } from './field-declaration-translator'
import { ExpressionTranslator } from '../expression/expression-translator'

export class TypeDeclarationTranslator extends Translator {
  constructor (parent) {
    super(parent)
    // this.SymTab = new SymTabImp(Backend.ClassTemplates.get(18))
    this.Functions = []
    this.StaticVariables = ''
  }

  translate (INode, firstPass = true, files = {}) {
    this.iNode = INode

    for (const node of INode.getChildren()) {
      switch (node.getType()) {
        case tree_types.types.IMPORTS:
          window.alert('import not working')
          break
        case tree_types.types.STRUCT_DECLARATION:
          {
            const struct = new StructTranslator(this)
            struct.staticPass(node)
            struct.translate(node)
          }
          break
        case tree_types.types.VAR_DECLARATION_NO_TYPE: {
          const notypedeclaration = new SpecialDeclarationTranslator(this)
          notypedeclaration.translate(true, node)
        }
          break
        case tree_types.types.VAR_DECLARATION: {
          const fieldDeclaration = new FieldDeclarationTranslator(this)
          fieldDeclaration.translate(true, node)
        }
          break
        default:
          break
      }
    }
    for (const node of INode.getChildren()) {
      switch (node.getType()) {
        case tree_types.types.IMPORTS:
          window.alert('import not working')
          break
        case tree_types.types.MAIN_DECLARATION:
        case tree_types.types.FUNCTION_DECLARATION:
          {
            // then we get the identifier and the type
            const identifier = node.getChild(1).getValue().toLowerCase()
            const voidType = node.lookupByType(tree_types.types.VOID)
            const funcBody = node.getChild(node.childrenSize() - 1)

            // we check if there are parameters in the function
            const pList = node.lookupByType(
              tree_types.types.FORMAL_PARAMETER_LIST
            )

            // if there are parameters we create List
            const parameters = []

            if (pList != null) {
              let tParam = null
              let auxType = null
              let dimensions = null

              for (const fParam of pList.getChildren()) {
                auxType = null
                dimensions = 0
                // fParam is the individual parameter
                // hotfix for array type
                if (fParam.getChild(0).getType() === tree_types.types.ARRAY) {
                  dimensions = fParam.getChild(0).getChild(1).childrenSize()
                  tParam = this.parseType(fParam.getChild(0).getChild(0).getType())
                  auxType = tParam === CompilerTypes.OBJECT ? Backend.Classes.getType(fParam.getChild(0).getChild(0).getValue()) : null
                  if (auxType === -1) { throw Error(`TYPE ${fParam.getChild(0).getValue()} NOT DECLARED ${this.parseSemanticError(this.iNode)}`) }
                  parameters.push([fParam.getChild(1).getValue(), tParam, true, auxType, dimensions])
                  continue
                }
                // hotfix finish

                if (fParam.getChild(0).getType() !== tree_types.types.IDENTIFIER) { tParam = this.parseType(fParam.getChild(0).getType()) } else {
                  if (Backend.Classes.containsKey(fParam.getChild(0).getValue())) {
                    tParam = CompilerTypes.OBJECT
                    auxType = Backend.Classes.getType(fParam.getChild(0).getValue())
                  } else { throw Error(`TYPE ${fParam.getChild(0).getValue()} NOT DECLARED ${this.parseSemanticError(this.iNode)}`) }
                }
                // identificador, tipo de parametro, es arreglo, tipo auxiliar, dimensiones
                parameters.push([fParam.getChild(1).getValue(), tParam, (auxType != null || dimensions > 0), auxType, dimensions])
              }
            }

            if (voidType === null) {
              const array_type = node.lookupByType(tree_types.types.ARRAY)
              const typeN = node.getChild(0)

              let type = null
              let auxType = null
              let dimensions = 0

              if (array_type) {
                type = this.parseType(array_type.getChild(0).getType())
                auxType = type === CompilerTypes.OBJECT ? Backend.Classes.getType(array_type.getChild(0).getValue()) : null

                if (auxType === -1) { throw Error(`UNABLE TO FIND THE REQUESTED TYPE ${array_type.getChild(0).getValue()}${this.parseSemanticError(array_type)}`) }

                dimensions = array_type.getChild(1).childrenSize()
              } else if (typeN.getType() !== tree_types.types.IDENTIFIER) {
                type = this.parseType(typeN.getType())
              } else {
                auxType = Backend.Classes.getType(typeN.getValue())
                type = CompilerTypes.OBJECT
              }

              this.Functions.push(
                saveFunctionInSymbolTable(
                  identifier,
                  CompilerTypes.FUNCTION,
                  type,
                  auxType,
                  parameters,
                  funcBody,
                  dimensions
                )
              )
              this.Functions[
                this.Functions.length - 1
              ].functionId = Generator.genFunctionId(
                '',
                identifier
              )

              // TODO: SET VISIBILITY AND MODIFIERS FUNCTIONALITY
            } else {
              this.Functions.push(
                saveFunctionInSymbolTable(
                  identifier,
                  CompilerTypes.PROCEDURE,
                  CompilerTypes.VOID,
                  null,
                  parameters,
                  funcBody
                )
              )
              this.Functions[
                this.Functions.length - 1
              ].functionId = Generator.genFunctionId(
                '',
                identifier
              )

              if (identifier === 'main') {
                this.main_identifier = this.Functions[this.Functions.length - 1].functionId
              }
              // TODO: SET VISIBILITY AND MODIFIERS FUNCTIONALITY
            }
          }
          break
      }
    }

    // Backend.ScopeStack.enterEnv()
    // this.ClassSave = Backend.SymbolTable
    // Backend.SymbolTable = this.SymTab
    // Here is the translation of the classes
    // if (!this.main) {
    // }

    // first pass for global variables
    this.firstPass()

    Backend.StaticSymbols.push(this.parseStaticVariables())
    Backend.ScopeStack.enterEnv()
    for (const sym of this.Functions) {
      const funcDecl = new FunctionDeclarationTranslator(this)
      Backend.ScopeStack.enterScope()
      Backend.Display.FunctionCallStack.push([sym.identifier, Generator.getTemporary(), sym.type, sym.auxType, sym.dimensions])
      funcDecl.translate(sym.node, sym)
      Backend.FunctionsCode.push(
        TranslatorHelpers.generateCustomFunction(
          sym.functionId,
          funcDecl.getCode()
        )
      )
      Backend.Display.FunctionCallStack.pop()
      Backend.ScopeStack.exitScope()
    }

    /* Backend.SymbolTable = this.ClassSave */
    Backend.ScopeStack.exitEnv()
    if (this.main_identifier === undefined || this.main_identifier === null) {
      Backend.Errores.push(`NO MAIN METHOD WAS FOUND IN CURRENT ENVIRONMENT${this.parseSemanticError(INode)}`)
      throw Error(`NO MAIN METHOD WAS FOUND IN CURRENT ENVIRONMENT${this.parseSemanticError(INode)}`)
    }
    return this.main_identifier
  }

  lookUpAllMainClasses (INode) {
    for (const node of INode.getChildren()) {
      if (node.getType() === tree_types.types.MAIN_DECLARATION) {
        if (Backend.MainClass.includes(node)) { throw Error(`THERE ARE MULTIPLE MAIN METHODS FOR THIS CLASS DEFINITION ${this.parseSemanticError(node)}`) } else {
          Backend.MainClass.push(node)
        }
      }
    }
  }

  lookupAllImports (INode) {
    const imps = []

    for (const node of INode.getChildren()) {
      if (node.getType() === tree_types.types.IMPORT) { imps.push(node) }
    }

    return imps
  }

  createSuperTree (INode, files) {
    const imps = INode.lookupByType(tree_types.types.IMPORTS)

    try {
      if (imps != null) {
        /**
         * Parse the node and then substitute in main node
         */
        for (const imp of imps.getChildren()) {
          /*
            * IMP ES EL NODO
          */
          const identifier = (imp.getType() === tree_types.types.STRING_LITERAL || imp.getType() === tree_types.types.IDENTIFIER) ? imp.getValue() : undefined
          let name = Object.keys(files).find(el => files[el].relative === identifier)
          if (name === undefined) {
            if ((name = Object.keys(files).find(el => files[el].name === identifier)) === undefined) { throw Error(`UNABLE TO FIND THE SPECIFIED FILE ${imp.getValue()}${this.parseSemanticError(imp)}`) }
          }

          if (!files[name].parsed) {
            Backend.CurrentFile.push(imp.getValue())
            jsharp.parse(files[name].src)
            files[name].parsed = true

            const tTree = JSharpRoot
            const parseImp = new TypeDeclarationTranslator(this)
            parseImp.createSuperTree(tTree, files)
            INode.insertAt(0, tTree.getChildren(), true)
            Backend.CurrentFile.pop()
          }
        }
        INode.deleteAt(INode.getPosition(imps))
      }
    } catch (e) {
      // TODO: parse and catch this error
      window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'Parse failed' }))
      if (e.hash !== undefined) {
        let parse = `[${e.hash.token === 'INVALID' ? 'LEXICO' : 'SINTACTICO'} AT LINE ${e.hash.loc.first_line}`
        parse += ` COLUMN ${e.hash.loc.first_column} FOUND ${e.hash.text} EXPECTED: ${e.hash.expected.join(',')}] IN FILE ${Backend.CurrentFile}`
        // window.dispatchEvent(new CustomEvent('error-catched', { detail: [parse] }))
        throw Error(parse)
      } else {
        // window.dispatchEvent(new CustomEvent('error-catched', { detail: [e] }))
        throw e
      }
    }
  }

  parseStaticVariables () {
    const tmpHelper = Generator.genTemporary()
    let code = TranslatorHelpers.comment('static var for ')

    const set = Backend.SymbolTable.getAllKeys()
    const eTrans = new ExpressionTranslator(this)

    for (const str of set) {
      const array = Backend.SymbolTable.getAllSyms(str)

      for (const sym of array) {
        if (sym.getRol() === CompilerTypes.GLOBAL) {
          code += TranslatorHelpers.unaryAssign(
            sym.getPosition(),
            tmpHelper
          )

          // hotfix for var and global
          if (sym.auxType === Backend.Classes.getType('var')) {
            code += TranslatorHelpers.generateDefaultAssign(
              true,
              tmpHelper,
              sym.getTemporary(),
              sym.getCode()
            )
            continue
          }

          if (sym.node == null) {
            // value not initialized
            code += TranslatorHelpers.generateDefaultAssign(
              true,
              tmpHelper,
              '0'
            )
          } else {
            // value with initial value
            eTrans.translate(sym.node)
            code += TranslatorHelpers.generateDefaultAssign(
              true,
              tmpHelper,
              eTrans.getTemporary(),
              eTrans.getCode()
            )
          }
        }
      }
    }

    return code
  }

  firstPass () {
    for (const sym of this.Functions) {
      const funcDecl = new FunctionDeclarationTranslator(this)
      funcDecl.firstPass(sym.node, sym)
    }
  }
}

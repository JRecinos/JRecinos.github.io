import { SymTabStack } from './symbol-table/sym-tab-stack'
import { CustomType } from './customtypes/custom-type'
import { Generator } from './generators/generator'
import { DisplayHelper } from './helpers/display-helper'
import { TypeDeclarationTranslator } from './translators/classes/type-declaration-translator'
import { NativeFunctions } from './generators/native-functions'
import { TranslatorHelpers } from './generators/translator-helpers'
import { SymTabImp } from './symbol-table/sym-tab-imp'

class BackendClass {
  constructor () {
    this.SymbolTable = null
    this.ScopeStack = new SymTabStack() // will only work for functions
    this.CodeCompiled = ''
    this.Classes = new CustomType()
    this.Errores = []
    this.Display = new DisplayHelper()
    this.ClassTemplates = new Map()
    this.Heap_Pointer = 1
    this.FunctionsCode = []
    this.ErrorsLabels = new Map()
    this.MainClass = null
    this.Files = null
    // the node to translate
    this.iNode = null
    this.CurrentFile = []
    this.StaticSymbols = []
    this.VarFlag = true
  }

  fillErrorMap () {
    this.ErrorsLabels.set('start', Generator.genLabel())
    this.ErrorsLabels.set('exit', Generator.genLabel())
    this.ErrorsLabels.set('indexoutofbounds', Generator.genLabel())
    this.ErrorsLabels.set('divisionbyzero', Generator.genLabel())
    this.ErrorsLabels.set('illegalnumberformat', Generator.genLabel())
    this.ErrorsLabels.set('invalidcast', Generator.genLabel())
  }

  getINode () {
    return this.iNode
  }

  getSymTabStack () {
    return this.SymbolTable
  }

  getSymbolTableStatus () {
    if (this.SymbolTable.getSymTabStack().empty()) { return null }

    const current = this.SymbolTable.jsonify(null)

    const set = this.Classes.keys()

    for (const str of set) {
      const template = this.ClassTemplates.get(this.Classes.getType(str))

      template.parseObjectTable(current, str)
    }

    return current
  }

  resetAll () {
    this.StaticSymbols = []
    this.SymbolTable = null
    this.CodeCompiled = ''
    this.Classes = new CustomType()
    this.Errores = []
    this.Display = new DisplayHelper()
    this.ScopeStack = new SymTabStack()
    this.ClassTemplates = new Map()
    this.ClassTemplates.set(18, new SymTabImp())
    this.Heap_Pointer = 1
    this.FunctionsCode = []
    this.ErrorsLabels = new Map()
    Generator.reset()
    this.MainClass = []
    this.fillErrorMap()
    this.Root = null
    // ObjectClassCreator.symbolTableGenerator()
  }

  process (iNode, files) {
    if (iNode == null) return
    this.iNode = iNode

    // vamos a probar sólo las expresiones
    // acá vamos a meter primero las nativas, luego el main y luego expresiones
    // vamo a probar sólo una suma
    // uncomment
    this.resetAll()
    this.Files = files

    Object.keys(this.Files).forEach(it => { this.Files[it].parsed = false })

    const tDeclaration = new TypeDeclarationTranslator(this)
    tDeclaration.createSuperTree(iNode, this.Files)
    tDeclaration.lookUpAllMainClasses(iNode)
    tDeclaration.firstPass()
    Backend.SymbolTable = new SymTabImp(null)
    this.Root = iNode
    try {
      // tDeclaration.translate(iNode.getChild(0));
      const mainMethod = tDeclaration.translate(iNode)
      let code = `${NativeFunctions.all()}\n${Backend.FunctionsCode.join('\n')}`
      code = NativeFunctions.headers() +
            //TranslatorHelpers.inconditionalJMP(this.ErrorsLabels.get('start')) +
            code +
            //TranslatorHelpers.generateLabel(this.ErrorsLabels.get('start')) +
            'int main(){\n' + 
            `${Backend.Heap_Pointer - 1 > 0 ? `H = H + ${Backend.Heap_Pointer - 1};\n` : ''}${this.StaticSymbols.join('\n')}P = P + 1;\n${mainMethod}();\nP = P - 1;\n` +
            'return;\n}\n'
            //this.createOutLabels()
      // code += `P = P + 1\ncall ${main_method}\nP = P - 1\n${this.createOutLabels()}`
      return code
    } catch (e) {
      throw Error(e)
    }
  }

  createOutLabels () {
    let code = TranslatorHelpers.inconditionalJMP(this.ErrorsLabels.get('exit'))
    code += TranslatorHelpers.generateLabel(this.ErrorsLabels.get('invalidcast'))
    code += TranslatorHelpers.printStmt('%c', 105)
    code += TranslatorHelpers.printStmt('%c', 110)
    code += TranslatorHelpers.printStmt('%c', 118)
    code += TranslatorHelpers.printStmt('%c', 97)
    code += TranslatorHelpers.printStmt('%c', 108)
    code += TranslatorHelpers.printStmt('%c', 105)
    code += TranslatorHelpers.printStmt('%c', 100)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 99)
    code += TranslatorHelpers.printStmt('%c', 97)
    code += TranslatorHelpers.printStmt('%c', 115)
    code += TranslatorHelpers.printStmt('%c', 116)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 101)
    code += TranslatorHelpers.printStmt('%c', 120)
    code += TranslatorHelpers.printStmt('%c', 99)
    code += TranslatorHelpers.printStmt('%c', 101)
    code += TranslatorHelpers.printStmt('%c', 112)
    code += TranslatorHelpers.printStmt('%c', 116)
    code += TranslatorHelpers.printStmt('%c', 105)
    code += TranslatorHelpers.printStmt('%c', 111)
    code += TranslatorHelpers.printStmt('%c', 110)
    code += TranslatorHelpers.printStmt('%c', 46)
    code += TranslatorHelpers.printStmt('%c', 46)
    code += TranslatorHelpers.printStmt('%c', 46)
    code += TranslatorHelpers.inconditionalJMP(Backend.ErrorsLabels.get('exit'))
    code += TranslatorHelpers.generateLabel(this.ErrorsLabels.get('divisionbyzero'))
    code += TranslatorHelpers.printStmt('%c', 100)
    code += TranslatorHelpers.printStmt('%c', 105)
    code += TranslatorHelpers.printStmt('%c', 118)
    code += TranslatorHelpers.printStmt('%c', 105)
    code += TranslatorHelpers.printStmt('%c', 115)
    code += TranslatorHelpers.printStmt('%c', 105)
    code += TranslatorHelpers.printStmt('%c', 111)
    code += TranslatorHelpers.printStmt('%c', 110)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 98)
    code += TranslatorHelpers.printStmt('%c', 121)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 122)
    code += TranslatorHelpers.printStmt('%c', 101)
    code += TranslatorHelpers.printStmt('%c', 114)
    code += TranslatorHelpers.printStmt('%c', 111)
    code += TranslatorHelpers.printStmt('%c', 46)
    code += TranslatorHelpers.printStmt('%c', 46)
    code += TranslatorHelpers.printStmt('%c', 46)
    code += TranslatorHelpers.inconditionalJMP(Backend.ErrorsLabels.get('exit'))
    code += TranslatorHelpers.generateLabel(this.ErrorsLabels.get('indexoutofbounds'))
    code += TranslatorHelpers.printStmt('%c', 105)
    code += TranslatorHelpers.printStmt('%c', 110)
    code += TranslatorHelpers.printStmt('%c', 100)
    code += TranslatorHelpers.printStmt('%c', 101)
    code += TranslatorHelpers.printStmt('%c', 120)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 111)
    code += TranslatorHelpers.printStmt('%c', 117)
    code += TranslatorHelpers.printStmt('%c', 116)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 111)
    code += TranslatorHelpers.printStmt('%c', 102)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 98)
    code += TranslatorHelpers.printStmt('%c', 111)
    code += TranslatorHelpers.printStmt('%c', 117)
    code += TranslatorHelpers.printStmt('%c', 110)
    code += TranslatorHelpers.printStmt('%c', 100)
    code += TranslatorHelpers.printStmt('%c', 115)
    code += TranslatorHelpers.inconditionalJMP(Backend.ErrorsLabels.get('exit'))
    code += TranslatorHelpers.generateLabel(Backend.ErrorsLabels.get('illegalnumberformat'))
    code += TranslatorHelpers.printStmt('%c', 105)
    code += TranslatorHelpers.printStmt('%c', 108)
    code += TranslatorHelpers.printStmt('%c', 101)
    code += TranslatorHelpers.printStmt('%c', 103)
    code += TranslatorHelpers.printStmt('%c', 97)
    code += TranslatorHelpers.printStmt('%c', 108)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 110)
    code += TranslatorHelpers.printStmt('%c', 117)
    code += TranslatorHelpers.printStmt('%c', 109)
    code += TranslatorHelpers.printStmt('%c', 98)
    code += TranslatorHelpers.printStmt('%c', 101)
    code += TranslatorHelpers.printStmt('%c', 114)
    code += TranslatorHelpers.printStmt('%c', 32)
    code += TranslatorHelpers.printStmt('%c', 102)
    code += TranslatorHelpers.printStmt('%c', 111)
    code += TranslatorHelpers.printStmt('%c', 114)
    code += TranslatorHelpers.printStmt('%c', 109)
    code += TranslatorHelpers.printStmt('%c', 97)
    code += TranslatorHelpers.printStmt('%c', 116)
    code += TranslatorHelpers.inconditionalJMP(Backend.ErrorsLabels.get('exit'))
    code += TranslatorHelpers.generateLabel(Backend.ErrorsLabels.get('exit'))
    return code
  }
}

export const Backend = new BackendClass()

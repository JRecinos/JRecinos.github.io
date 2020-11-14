(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./src/backend/ast/ast.js":
/*!********************************!*\
  !*** ./src/backend/ast/ast.js ***!
  \********************************/
/*! exports provided: AST */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AST", function() { return AST; });
/* harmony import */ var _tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../backend */ "./src/backend/backend.js");



const AST = class {
  constructor (type, value, line, col) {
    this.grouped = false
    this.type_name = type
    this.file = _backend__WEBPACK_IMPORTED_MODULE_1__["Backend"].CurrentFile[_backend__WEBPACK_IMPORTED_MODULE_1__["Backend"].CurrentFile.length - 1]
    this.type = _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types[type.toString().toUpperCase()]
    if (this.type === undefined) { console.log(type, line, col) }

    this.value = (this.type === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.IDENTIFIER) ? value.toLowerCase() : value
    this.line = line
    this.column = col
    this.children = []
    this.last = null
    this.parent = null

    for (let i = 4; i < arguments.length; i++) {
      this.children.push(arguments[i])
      arguments[i].parent = this
    }
  }

  getLine () {
    return this.line
  }

  getColumn () {
    return this.column
  }

  getValue () {
    return this.value
  }

  changeType (type) {
    this.type = _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types[type.toString().toUpperCase()]
    this.type_name = type.toString().toUpperCase()
  }

  addChild (...args) {
    args.forEach(element => {
      this.children.push(element)
      this.grouped = this.grouped || element.grouped
      element.parent = this
    })
  }

  getChild (index) {
    if (index > this.children.length) return null

    return this.children[index]
  }

  getChildren () {
    return this.children
  }

  printTree (indent = '') {
    console.log(`${indent}#${_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].names[this.type]} (${this.type})`)

    this.children.forEach(it => {
      it.printTree(indent + '\t')
    })

    if (this.next) { this.next.printTree(indent) }
  }

  copy () {
    const nodo = new AST(this.type_name, this.value, this.line, this.column)
    nodo.type = this.type
    return nodo
  }

  copyWithChildren () {
    const nodo = new AST(this.type_name, this.value, this.line, this.column)
    nodo.type = this.type
    this.children.forEach(item => nodo.addChild(item.copyWithChildren()))
    return nodo
  }

  insertAt (index, value, fromiterable = false) {
    if (fromiterable) { this.children.splice(index, 0, ...value) } else { this.children.splice(index, 0, value) }
  }

  setIndex () {
    this.index = window.index
    window.index++

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setIndex(window.index)
    }
  }

  deleteAt (index) {
    return this.children.splice(index, 1)
  }

  writeNode () {
    let str = `\n\tnode${this.index} [label="${_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].names[this.type]} (${this.index}) ${this.value != null ? this.value : ''}"];\n`

    for (let i = 0; i < this.children.length; i++) {
      str += this.children[i].writeNode()
      str += `\n\tnode${this.index} -> node${this.children[i].index};`
    }

    return str
  }

  lookupByIndex (index) {
    if (this.index === index) { return this }

    let value = null
    for (const n of this.children) {
      if ((value = n.lookupByIndex(index)) != null) { return value }
    }

    return null
  }

  lookupByType (type) {
    if (this.type === type) { return this }

    for (const n of this.children) {
      if (n.getType() === type) { return n }
    }

    return null
  }

  getType () {
    return this.type
  }

  getParent () {
    return this.parent
  }

  childrenSize () {
    return this.children.length
  }

  getPosition (ast) {
    for (let i = 0; i < this.childrenSize(); i++) {
      if (ast === this.children[i]) { return i }
    }

    return -1
  }
}


/***/ }),

/***/ "./src/backend/ast/graph-tree.js":
/*!***************************************!*\
  !*** ./src/backend/ast/graph-tree.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit_html_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit-html/directives/unsafe-html.js */ "./node_modules/lit-html/directives/unsafe-html.js");
/* harmony import */ var _components_base_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/base-element */ "./src/components/base-element.js");
/* harmony import */ var _components_style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/style-helpers/shared-styles */ "./src/components/style-helpers/shared-styles.js");




class GraphTree extends _components_base_element__WEBPACK_IMPORTED_MODULE_1__["BaseLit"] {
  static get properties () {
    return {
      src: { type: String, reflect: true },
      svg: { type: String }
    }
  }

  static get styles () {
    return [
      _components_style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_2__["SharedStyles"],
      _components_style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_2__["MainSharedStyle"],
      _components_base_element__WEBPACK_IMPORTED_MODULE_1__["css"]`
        main {
            overflow: auto;
            background: black;
            width: 100%;
            height: 100%;
        }
      `
    ]
  }

  constructor () {
    super()
    this.src = ''
  }

  render () {
    return _components_base_element__WEBPACK_IMPORTED_MODULE_1__["html"]`
      <main id="main-content">
          ${this.svg !== '' ? Object(lit_html_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_0__["unsafeHTML"])(this.svg) : ''}
      </main>
    `
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'src' && newValue !== '') {
      this.svg = Viz(newValue, { format: 'svg' })
    }
  }
}

window.customElements.define('graph-tree', GraphTree)


/***/ }),

/***/ "./src/backend/ast/tree-types.js":
/*!***************************************!*\
  !*** ./src/backend/ast/tree-types.js ***!
  \***************************************/
/*! exports provided: tree_types */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tree_types", function() { return tree_types; });
const tree_types = {

  names: [
    'LBRACE',
    'RBRACE',
    'LPAREN',
    'RPAREN',
    'LBRACK',
    'RBRACK',
    'COMMA',
    'QUESTION',
    'COLON',
    'SEMICOLON',
    'CATCH',
    'GLOBAL',
    'AS',
    'VOID',
    'IMPORT',
    'IF',
    'ELSE',
    'WHILE',
    'DO',
    'FOR',
    'BREAK',
    'CONTINUE',
    'SWITCH',
    'CASE',
    'DEFAULT',
    'BOOLEAN_LITERAL',
    'CONST',
    'VAR',
    'POW',
    'NEW',
    'RETURN',
    'BOOLEAN',
    'INTEGER',
    'DOUBLE',
    'CHAR',
    'STRING',
    'LTEQ',
    'LT',
    'REQEQ',
    'EQEQ',
    'GTEQ',
    'GT',
    'NOTEQ',
    'OROR',
    'XOR',
    'ANDAND',
    'NOT',
    'EQ',
    'PLUSPLUS',
    'PLUS',
    'MINUSMINUS',
    'MINUS',
    'MULT',
    'DIV',
    'MOD',
    'DOT',
    'ATTR_DECLARATION',
    'NULL_LITERAL',
    'IDENTIFIER',
    'DOUBLE_LITERAL',
    'INTEGER_LITERAL',
    'STRING_LITERAL',
    'CAST',
    'ARRAY',
    'PREINC',
    'PREDEC',
    'POSTINC',
    'POSTDEC',
    'ARRAY_ACCESS',
    'FUNCTION_CALL',
    'ARRAY_DIMS',
    'DIM',
    'NEW_ARRAY',
    'EXPRESSION_LIST',
    'CONSTRUCTOR_CALL',
    'CASE_LABEL_LIST',
    'SWITCH_BODY',
    'EXPRESSION_STMT',
    'NO_OP',
    'VAR_DECLARATION',
    'STMT_LIST',
    'BLOCK',
    'VARIABLE_INITIALIZER',
    'DEFINE',
    'TYPE_DECLARATIONS',
    'STRUCT_DECLARATION',
    'STRUCT_LIST',
    'ARRAY_TYPE',
    'ASSIGN_LIST',
    'FUNCTION_DECLARATION',
    'METHOD_HEADER',
    'FORMAL_PARAMETER',
    'FORMAL_PARAMETER_LIST',
    'CONSTRUCTOR_DECLARATOR',
    'CONSTRUCTOR_DECLARATION',
    'PROGRAM',
    'BODY',
    'METHOD_DECLARATOR',
    'NATIVE_FUNCTION_CALL',
    'OBJECT',
    'MAIN_DECLARATION',
    'ARRAY_IDENTIFIER',
    'CHARACTER_LITERAL',
    'ARRAY_LITERAL',
    'TRY',
    'VAR_DECLARATION_NO_TYPE',
    'ID_LIST',
    'FOR_INIT',
    'FOR_UPDATE',
    'FOR_COND',
    'IMPORTS',
    'FINAL',
    'DOLLAR',
    'THROW'
  ],
  types: {
    LBRACE: 0,
    RBRACE: 1,
    LPAREN: 2,
    RPAREN: 3,
    LBRACK: 4,
    RBRACK: 5,
    COMMA: 6,
    QUESTION: 7,
    COLON: 8,
    SEMICOLON: 9,
    CATCH: 10,
    GLOBAL: 11,
    AS: 12,
    VOID: 13,
    IMPORT: 14,
    IF: 15,
    ELSE: 16,
    WHILE: 17,
    DO: 18,
    FOR: 19,
    BREAK: 20,
    CONTINUE: 21,
    SWITCH: 22,
    CASE: 23,
    DEFAULT: 24,
    BOOLEAN_LITERAL: 25,
    CONST: 26,
    VAR: 27,
    POW: 28,
    NEW: 29,
    RETURN: 30,
    BOOLEAN: 31,
    INTEGER: 32,
    DOUBLE: 33,
    CHAR: 34,
    STRING: 35,
    LTEQ: 36,
    LT: 37,
    REQEQ: 38,
    EQEQ: 39,
    GTEQ: 40,
    GT: 41,
    NOTEQ: 42,
    OROR: 43,
    XOR: 44,
    ANDAND: 45,
    NOT: 46,
    EQ: 47,
    PLUSPLUS: 48,
    PLUS: 49,
    MINUSMINUS: 50,
    MINUS: 51,
    MULT: 52,
    DIV: 53,
    MOD: 54,
    DOT: 55,
    ATTR_DECLARATION: 56,
    NULL_LITERAL: 57,
    IDENTIFIER: 58,
    DOUBLE_LITERAL: 59,
    INTEGER_LITERAL: 60,
    STRING_LITERAL: 61,
    CAST: 62,
    ARRAY: 63,
    PREINC: 64,
    PREDEC: 65,
    POSTINC: 66,
    POSTDEC: 67,
    ARRAY_ACCESS: 68,
    FUNCTION_CALL: 69,
    ARRAY_DIMS: 70,
    DIM: 71,
    NEW_ARRAY: 72,
    EXPRESSION_LIST: 73,
    CONSTRUCTOR_CALL: 74,
    CASE_LABEL_LIST: 75,
    SWITCH_BODY: 76,
    EXPRESSION_STMT: 77,
    NO_OP: 78,
    VAR_DECLARATION: 79,
    STMT_LIST: 80,
    BLOCK: 81,
    VARIABLE_INITIALIZER: 82,
    DEFINE: 83,
    TYPE_DECLARATIONS: 84,
    STRUCT_DECLARATION: 85,
    STRUCT_LIST: 86,
    ARRAY_TYPE: 87,
    ASSIGN_LIST: 88,
    FUNCTION_DECLARATION: 89,
    METHOD_HEADER: 90,
    FORMAL_PARAMETER: 91,
    FORMAL_PARAMETER_LIST: 92,
    CONSTRUCTOR_DECLARATOR: 93,
    CONSTRUCTOR_DECLARATION: 94,
    PROGRAM: 95,
    BODY: 96,
    METHOD_DECLARATOR: 97,
    NATIVE_FUNCTION_CALL: 98,
    OBJECT: 99,
    MAIN_DECLARATION: 100,
    ARRAY_IDENTIFIER: 101,
    CHARACTER_LITERAL: 102,
    ARRAY_LITERAL: 103,
    TRY: 104,
    VAR_DECLARATION_NO_TYPE: 105,
    ID_LIST: 106,
    FOR_INIT: 107,
    FOR_UPDATE: 108,
    FOR_COND: 109,
    IMPORTS: 110,
    FINAL: 111,
    DOLLAR: 112,
    THROW: 113
  }
}


/***/ }),

/***/ "./src/backend/backend.js":
/*!********************************!*\
  !*** ./src/backend/backend.js ***!
  \********************************/
/*! exports provided: Backend */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Backend", function() { return Backend; });
/* harmony import */ var _symbol_table_sym_tab_stack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./symbol-table/sym-tab-stack */ "./src/backend/symbol-table/sym-tab-stack.js");
/* harmony import */ var _customtypes_custom_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./customtypes/custom-type */ "./src/backend/customtypes/custom-type.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _helpers_display_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/display-helper */ "./src/backend/helpers/display-helper.js");
/* harmony import */ var _translators_classes_type_declaration_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./translators/classes/type-declaration-translator */ "./src/backend/translators/classes/type-declaration-translator.js");
/* harmony import */ var _generators_native_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./generators/native-functions */ "./src/backend/generators/native-functions.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./symbol-table/sym-tab-imp */ "./src/backend/symbol-table/sym-tab-imp.js");









class BackendClass {
  constructor () {
    this.SymbolTable = null
    this.ScopeStack = new _symbol_table_sym_tab_stack__WEBPACK_IMPORTED_MODULE_0__["SymTabStack"]() // will only work for functions
    this.CodeCompiled = ''
    this.Classes = new _customtypes_custom_type__WEBPACK_IMPORTED_MODULE_1__["CustomType"]()
    this.Errores = []
    this.Display = new _helpers_display_helper__WEBPACK_IMPORTED_MODULE_3__["DisplayHelper"]()
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
    this.VarFlag = false
  }

  fillErrorMap () {
    this.ErrorsLabels.set('start', _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
    this.ErrorsLabels.set('exit', _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
    this.ErrorsLabels.set('indexoutofbounds', _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
    this.ErrorsLabels.set('divisionbyzero', _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
    this.ErrorsLabels.set('illegalnumberformat', _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
    this.ErrorsLabels.set('invalidcast', _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
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
    this.Classes = new _customtypes_custom_type__WEBPACK_IMPORTED_MODULE_1__["CustomType"]()
    this.Errores = []
    this.Display = new _helpers_display_helper__WEBPACK_IMPORTED_MODULE_3__["DisplayHelper"]()
    this.ScopeStack = new _symbol_table_sym_tab_stack__WEBPACK_IMPORTED_MODULE_0__["SymTabStack"]()
    this.ClassTemplates = new Map()
    this.ClassTemplates.set(18, new _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_7__["SymTabImp"]())
    this.Heap_Pointer = 1
    this.FunctionsCode = []
    this.ErrorsLabels = new Map()
    _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].reset()
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

    const tDeclaration = new _translators_classes_type_declaration_translator__WEBPACK_IMPORTED_MODULE_4__["TypeDeclarationTranslator"](this)
    tDeclaration.createSuperTree(iNode, this.Files)
    tDeclaration.lookUpAllMainClasses(iNode)
    tDeclaration.firstPass()
    Backend.SymbolTable = new _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_7__["SymTabImp"](null)
    this.Root = iNode
    try {
      // tDeclaration.translate(iNode.getChild(0));
      const mainMethod = tDeclaration.translate(iNode)
      let code = `${_generators_native_functions__WEBPACK_IMPORTED_MODULE_5__["NativeFunctions"].all()}\n${Backend.FunctionsCode.join('\n')}`
      code = _generators_native_functions__WEBPACK_IMPORTED_MODULE_5__["NativeFunctions"].headers() +
            _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].inconditionalJMP(this.ErrorsLabels.get('start')) +
            code +
            _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateLabel(this.ErrorsLabels.get('start')) +
            `${Backend.Heap_Pointer - 1 > 0 ? `H = H + ${Backend.Heap_Pointer - 1};\n` : ''}${this.StaticSymbols.join('\n')}P = P + 1;\ncall ${mainMethod};\nP = P - 1;\n` +
            this.createOutLabels()
      // code += `P = P + 1\ncall ${main_method}\nP = P - 1\n${this.createOutLabels()}`
      return code
    } catch (e) {
      throw Error(e)
    }
  }

  createOutLabels () {
    let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].inconditionalJMP(this.ErrorsLabels.get('exit'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateLabel(this.ErrorsLabels.get('invalidcast'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 105)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 110)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 118)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 97)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 108)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 105)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 100)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 99)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 97)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 115)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 116)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 101)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 120)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 99)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 101)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 112)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 116)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 105)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 111)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 110)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 46)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 46)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 46)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].inconditionalJMP(Backend.ErrorsLabels.get('exit'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateLabel(this.ErrorsLabels.get('divisionbyzero'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 100)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 105)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 118)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 105)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 115)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 105)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 111)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 110)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 98)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 121)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 122)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 101)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 114)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 111)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 46)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 46)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 46)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].inconditionalJMP(Backend.ErrorsLabels.get('exit'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateLabel(this.ErrorsLabels.get('indexoutofbounds'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 105)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 110)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 100)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 101)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 120)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 111)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 117)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 116)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 111)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 102)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 98)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 111)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 117)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 110)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 100)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 115)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].inconditionalJMP(Backend.ErrorsLabels.get('exit'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateLabel(Backend.ErrorsLabels.get('illegalnumberformat'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 105)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 108)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 101)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 103)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 97)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 108)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 110)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 117)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 109)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 98)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 101)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 114)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 32)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 102)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 111)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 114)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 109)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 97)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].printStmt('%c', 116)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].inconditionalJMP(Backend.ErrorsLabels.get('exit'))
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateLabel(Backend.ErrorsLabels.get('exit'))
    return code
  }
}

const Backend = new BackendClass()


/***/ }),

/***/ "./src/backend/compiler-types.js":
/*!***************************************!*\
  !*** ./src/backend/compiler-types.js ***!
  \***************************************/
/*! exports provided: CompilerTypes, CompilerTypesNames */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompilerTypes", function() { return CompilerTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompilerTypesNames", function() { return CompilerTypesNames; });
const CompilerTypes = {

  // ROL
  ATTRIBUTE: 0,
  CONSTANT: 1,
  FUNCTION: 2,
  REF_PARAM: 3,
  VAL_PARAM: 4,
  PROCEDURE: 5,
  ARRAY: 6,
  GLOBAL: 7,
  VARIABLE: 8,

  // TYPES
  INTEGER: 9,
  DOUBLE: 10,
  BOOLEAN: 11,
  STRING: 12,
  NULL: 13,
  CHAR: 14,
  OBJECT: 15,
  VOID: 16,
  CONSTRUCTOR: 17

}

const CompilerTypesNames = [
// ROL
  'ATTRIBUTE',
  'CONSTANT',
  'FUNCTION',
  'REF_PARAM',
  'VAL_PARAM',
  'PROCEDURE',
  'ARRAY',
  'GLOBAL',
  'VARIABLE',

  // TYPES
  'INTEGER',
  'DOUBLE',
  'BOOLEAN',
  'STRING',
  'NULL',
  'CHAR',
  'OBJECT',
  'VOID',
  'CONSTRUCTOR'
]


/***/ }),

/***/ "./src/backend/customtypes/custom-type.js":
/*!************************************************!*\
  !*** ./src/backend/customtypes/custom-type.js ***!
  \************************************************/
/*! exports provided: CustomType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomType", function() { return CustomType; });

class CustomType {
  constructor () {
    this.cTypes = new Map()
    this.current = 18
    this.addType('var')
  }

  /***
     *
     * @param name
     * @throws Exception
     */
  addType (name) {
    if (this.cTypes.has(name)) { throw new Error('TYPE' + name.toUpperCase() + 'ALREADY DEFINED.') }

    this.cTypes.set(name, this.current++)
  }

  getType (name) {
    if (!this.cTypes.has(name)) { return -1 }
    return this.cTypes.get(name)
  }

  containsKey (name) {
    return this.cTypes.has(name)
  }

  clear () {
    this.cTypes.clear()
    this.current = 18
    this.addType('var')
  }

  keys () {
    return this.cTypes.keys()
  }

  reverseMap (key) {
    for (const i of this.keys()) {
      if (this.cTypes.get(i) === key) { return i }
    }
    return '-------------'
  }
}


/***/ }),

/***/ "./src/backend/generators/generator.js":
/*!*********************************************!*\
  !*** ./src/backend/generators/generator.js ***!
  \*********************************************/
/*! exports provided: Generator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Generator", function() { return Generator; });

class Gen {

    constructor(){
        this.label = 0;
        this.temporary = 0;
        this.functionID = 0;
    }

    genLabel(){
        return `L${this.label++}`;
    }

    genTemporary(){
        return `t${this.temporary++}`;
    }

    reset(){
        this.label       = 0;
        this.temporary   = 0;
        this.functionID = 0;
    }

    getTemporary(){
        return this.temporary;
    }

    genFunctionId(class_name, identifier){
        return `${class_name}_${identifier}_${this.functionID++}`;
    }
}

const Generator = new Gen();

/***/ }),

/***/ "./src/backend/generators/native-functions.js":
/*!****************************************************!*\
  !*** ./src/backend/generators/native-functions.js ***!
  \****************************************************/
/*! exports provided: NativeFunctions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NativeFunctions", function() { return NativeFunctions; });
/* harmony import */ var _generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _translator_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../backend */ "./src/backend/backend.js");




class NativeFunctionsClass {
  cloneObject () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_object_clone begin\n' +
    // posicion en heap en p + 1
    // numero de posiciones a copiar
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[0]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '2', tmp[1]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[1], tmp[1]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[2]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('0', tmp[3]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[3], tmp[1], labels[0]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], tmp[3], tmp[4]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[4], tmp[4]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp[4]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[3], '1', tmp[3]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[3], tmp[1], labels[1]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
    // return
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[2]) +
    'end\n'
  }

  boolean_to_string () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_java_boolean_to_string begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[0], '1', labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '116') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '114') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '117') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '101') +
            // 102 97 108 115 101 10
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '102') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '97') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '108') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '115') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '101') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '0') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[1]) +
            'end\n'
  }

  concat_string () {
    const tmp = []
    const labels = []

    for (let i = 0; i < 6; i++) { tmp.push(_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()) }
    for (let i = 0; i < 4; i++) { labels.push(_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()) }

    return 'proc native_java_concat_strings begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[1], tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[2], tmp[4]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[5]) + labels[0] + ':\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[3], '0', labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[1], '1', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[1], tmp[3]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[0]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[4], '0', labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp[4]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[2], '1', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[2], tmp[4]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '0') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp[0], tmp[5]) + 'end\n'
  }

  truncate_string () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]

    return 'proc native_java_trunk begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('%', tmp[1], '1', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[1], tmp[2], tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[3]) +
            'end\n'
  }

  round_string () {
    const tmp = []
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    for (let i = 0; i < 6; i++) { tmp.push(_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()) }

    return 'proc native_java_round begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('%', tmp[1], '1', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<', tmp[2], '0.5', labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[1], tmp[2], tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[3]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', '1', tmp[2], tmp[4]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[4], tmp[1], tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[5]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[2]) +
            'end\n'
  }

  length_string () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const label = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc java_string_length begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) + // posicion de memoria
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('0', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[1], tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[0], '0', label[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[1], '1', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[2], '1', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(label[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[2]) +
            'end\n'
  }

  int_to_String () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]

    const label = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_java_int_to_string begin\n' + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) + // the number itself
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(tmp[1], tmp[2]) + // we save the number value
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('1', tmp[5]) + // number holder
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('1', tmp[3]) + // counter
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[4]) + // i have the string
    // position

            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<', tmp[1], '10', label[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('/', tmp[1], '10', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[3], '1', tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('*', tmp[5], '10', tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(label[0]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[1]) +
            // here we check if it is positive or negative
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('>=', tmp[2], '0', label[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '45') + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[3], '0', label[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('/', tmp[2], tmp[5], tmp[6]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('%', tmp[6], '1', tmp[8]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[6], tmp[8], tmp[6]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[6], '48', tmp[7]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp[7]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('*', tmp[6], tmp[5], tmp[7]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[2], tmp[7], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('/', tmp[5], '10', tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[3], '1', tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(label[2]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '0') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[4]) +
            'end\n'
  }

  power () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]
    const while_labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_java_pow begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '2', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<=', tmp[0], 0, labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', 1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[1], tmp[1]) +
            // valor a multiplicar
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(tmp[1], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(while_labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<=', tmp[0], 1, while_labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('*', tmp[1], tmp[2], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[0], 1, tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(while_labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(while_labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            'end\n'
  }

  charToString () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]

    return 'proc native_java_char_to_string begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) + // char value
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign(tmp[0], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '0') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[0]) +
            'end\n'
  }

  printString () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const label = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_java_print_string begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) + // string pointer value
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[0]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[1], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[2], '0', label[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[1], '1', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(label[0]) + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[1]) +
            'end\n'
  }

  printBoolean () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const label = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_java_print_boolean begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[0]) + // boolean value
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[0], '1', label[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(label[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '116') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '114') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '117') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '101') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(label[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[1]) +
            // 102 97 108 115 101
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '102') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '97') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '108') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '115') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].printStmt('%c', '101') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label[2]) +
            'end\n'
  }

  real_to_String () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]

    return 'proc native_java_real_to_string begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', '1', 'P', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) + // valor en si
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('%', tmp[1], '1', tmp[2]) + // parte decimal
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[1], tmp[2], tmp[3]) + // parte entera
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[4]) + // posicion del
            // punto
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '46') + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '0') + _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(true, 2) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp[5], tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('native_java_int_to_string') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[6]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp[5], tmp[6]) + // colocamos en la posicion 0 para llamar al
            // concat
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp[5], tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp[5], tmp[4]) + // colocamos en la posicion 0 para llamar al
            // concat
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('native_java_concat_strings') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[5], '1', tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[5], tmp[7]) +
            // obtenemos el valor decimal
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('*', tmp[2], '100', tmp[8]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp[5], tmp[8]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('native_java_int_to_string') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[9]) + // este es el valor de la última parte ahora
    // concatenamos el tmp[7] con el tmp[10]

            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp[5], tmp[7]) + // colocamos en la posicion 0 para llamar al
            // concat
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[5], '1', tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp[5], tmp[9]) + // colocamos en la posicion 0 para llamar al
            // concat
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('native_java_concat_strings') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', '1', 'P', tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[5], tmp[10]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, 2) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[10]) +
            'end\n'
  }

  charAt () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    return 'proc native_string_charat begin\n' +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[1]) + // tmp[2] es la posicion en heap del string
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '2', tmp[0]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[2]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[2], tmp[1], tmp[0]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[0]) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[0]) +
    'end\n'
  }

  // TODO: CREATE LOGIC -> FIRST FUNCTION TO CALL FROM ANOTHER
  /*
     * public static String tochararray_sting () { return
     * "proc java_tochararray\n"
     *
     * +"end,,,java_tochararray\n"; }
     */

  string_to_Int () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_java_string_to_int begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(0, tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_length') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[1]) + // tmp has counter
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[1], 0, labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<', tmp[3], 48, _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ErrorsLabels.get('illegalnumberformat')) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('>', tmp[3], 57, _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ErrorsLabels.get('illegalnumberformat')) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('*', tmp[2], '10', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[3], 48, tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[2], tmp[3], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[1], 1, tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[2]) +
            'end\n'
  }

  string_to_double () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_java_string_to_double begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(0, tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_length') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[1]) + // tmp has counter
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[1], 0, labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[3], 46, labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<', tmp[3], 48, _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ErrorsLabels.get('illegalnumberformat')) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('>', tmp[3], 57, _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ErrorsLabels.get('illegalnumberformat')) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('*', tmp[2], '10', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[3], 48, tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[2], tmp[3], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[1], 1, tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('inicio double') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[1], '1', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(1, tmp[4]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[1], 0, labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('/', tmp[4], '10', tmp[4]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<', tmp[3], 48, _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ErrorsLabels.get('illegalnumberformat')) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('>', tmp[3], 57, _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ErrorsLabels.get('illegalnumberformat')) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[3], 48, tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('*', tmp[4], tmp[3], tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[2], tmp[5], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], '1', tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[1], 1, tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[2]) +
            'end\n'
  }

  string_equals () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]
    return 'proc java_string_equals begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[0], tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', 2, tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp[1], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_length') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(true, 1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_length') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, 1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('!=', tmp[2], tmp[3], labels[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[3], 0, labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[1], tmp[4]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('!=', tmp[2], tmp[4], labels[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], 1, tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[1], 1, tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[3], '1', tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', 1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', 0) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            'end\n'
  }

  string_to_lowercase () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc java_string_to_lowercase begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[0]) + // tmp tiene el apuntador a heap
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[0], 1, tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], 1, tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[1], 0, labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<', tmp[1], 65, labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('>', tmp[1], 90, labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[1], 32, tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '0') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[2]) +
            'end\n'
  }

  string_to_uppercase () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc java_string_to_uppercase begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[0]) + // tmp tiene el apuntador a heap
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[0], 1, tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], 1, tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[1], 0, labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('>', tmp[1], 122, labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('<', tmp[1], 97, labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', tmp[1], 32, tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', '0') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[2]) +
            'end\n'
  }

  copyVector () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
      _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()
    ]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc native_vector_linealize begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[0]) + // apuntador del heap
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(tmp[2], tmp[3]) + // tmp[3] es el loop
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign(tmp[1], tmp[2]) +
            // inicio de loop
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('-', '0', '1', tmp[4]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[4], '1', tmp[4]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[4], tmp[3], labels[0]) +
    // a la posicion a copiar y a la posicion a asignar le sumamos 1
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], tmp[4], tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[5], '1', tmp[5]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[5], tmp[5]) +
            // posicion a asignar
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp[5]) +
            // posicion más 1
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) +
            // fin de loop
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[1]) +
            'end\n'
  }

  string_to_chararray () {
    const tmp = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()]
    const labels = [_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()]

    return 'proc java_string_to_chararray begin\n' +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[0]) + // tmp tiene el apuntador a heap
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(true, 1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp[1], tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_length') +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, 1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp[2]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign(tmp[2], tmp[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(tmp[0], tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', tmp[3], 0, labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp[3]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', tmp[0], 1, tmp[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0]) +
            _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp[2]) +
            'end\n'
  }

  defaultObjectConstructor () {
    const tmp = _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()

    return 'proc default_object_constructor begin\n' +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', 'H') +
    // en p + 1 tenemos el valor
    // en p + 2 el tipo
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp, tmp) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '2', tmp) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp, tmp) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1) +
    _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', tmp) +
    'end\n'
  }

  objectToString () {
    const tmp = _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()
    const tmp2 = _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()
    const tmp3 = _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()

    const label = _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()
    const labelOut = _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()

    let code = 'proc default_object_to_string begin\n'
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp2)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp2, tmp2)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('!=', tmp2, 0, label)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp3)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 110)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 117)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 108)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 108)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 0)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labelOut)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(label)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('H', tmp3)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 79)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 98)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 106)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 101)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 99)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 116)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 64)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveHeapPointer(1)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAssign('H', 0)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('native_java_int_to_string')
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', tmp)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp2)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp2, tmp3)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '2', tmp2)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp2, tmp)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('native_java_concat_strings')
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp3)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(tmp3, tmp3)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labelOut)
    code += _translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', tmp3)
    code += 'end\n'

    return code
  }

  all () {
    return this.concat_string() + '\n' + this.truncate_string() + '\n' + this.round_string() + '\n' + this.length_string() +
            '\n' + this.int_to_String() + '\n' + this.printString() + '\n' + this.real_to_String() + '\n' + this.boolean_to_string() +
            '\n' + this.printBoolean() + '\n' + this.charToString() + '\n' + this.power() + '\n' + this.string_to_Int() +
            '\n' + this.string_to_double() + '\n' + this.string_to_lowercase() + '\n' + this.string_to_uppercase() +
            '\n' + this.string_to_chararray() + '\n' + this.string_equals() + '\n' + this.cloneObject() + '\n' + this.copyVector() +
            '\n' + this.charAt() + '\n' + this.defaultObjectConstructor() + '\n' + this.objectToString()
  }

  headers () {
    let str = 'var H;\nvar P;\nvar E;\nvar Stack[];\nvar Heap[];\nvar '

    for (let i = 0; i < _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].getTemporary(); i++) { str += `${i === 0 ? '' : ','}t${i}` }

    str += ';\n'

    return str
  }
}

const NativeFunctions = new NativeFunctionsClass()


/***/ }),

/***/ "./src/backend/generators/translator-helpers.js":
/*!******************************************************!*\
  !*** ./src/backend/generators/translator-helpers.js ***!
  \******************************************************/
/*! exports provided: TranslatorHelpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TranslatorHelpers", function() { return TranslatorHelpers; });
/* harmony import */ var _generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generator */ "./src/backend/generators/generator.js");


class Translator {
  generateInvalidArithmeticError (rhs, errorLabel) {
    return this.comment('division by zero exception') +
    this.conditionalJMP('!=', rhs, '0', errorLabel)
  }

  generateInvalidCastError (position, type, errorLabel) {
    const tmp = _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()
    return this.comment('invalid cast exception') +
            this.arithmeticOperation('+', position, '1', tmp) +
            this.generateHeapAccess(tmp, tmp) +
            this.conditionalJMP('!=', type, tmp, errorLabel)
  }

  generateHeapAssign (origin, value) {
    return `Heap[${origin}] = ${value};\n`
  }

  generateHeapAccess (position, destiny) {
    return `${destiny} = Heap[${position}];\n`
  }

  generateStackAssign (origin, value) {
    return `Stack[${origin}] = ${value};\n`
  }

  generateStackAccess (position, destiny) {
    return `${destiny} = Stack[${position}];\n`
  }

  moveStackPointer (add, value) {
    return `P = P ${add ? '+' : '-'} ${value};\n`
  }

  moveHeapPointer (value) {
    return `H = H + ${value};\n`
  }

  arithmeticOperation (op, opL, opR, result) {
    return `${result} = ${opL} ${op} ${opR};\n`
  }

  inconditionalJMP (label) {
    return `goto ${label};\n`
  }

  conditionalJMP (relop, opL, opR, label) {
    return `if (${opL} ${relop === '!=' ? '<>' : relop} ${opR}) goto ${label};\n`
  }

  unaryAssign (value, destiny) {
    return `${destiny} = ${value};\n`
  }

  functionCall (name) {
    return `call ${name};\n`
  }

  generateLabel (name) {
    return `${name}:\n`
  }

  printStmt (type, value) {
    return `print("${type}",${value});\n`
  }

  generateCustomFunction (identifier, block) {
    return `\nproc ${identifier} begin\n${block} end\n`
  }

  generateTmpStackSave (init, fin) {
    let code = '##STACK SAVE INIT\n'

    for (let i = init; i < fin; i++) {
      if (i > init) { code += TranslatorHelpers.arithmeticOperation('+', 'P', '1', 'P') }
      code += TranslatorHelpers.generateStackAssign('P', 't' + i)
    }
    if (init < fin) {
      code += TranslatorHelpers.moveStackPointer(true, 1)
    }
    code += '##STACK SAVE FIN\n'
    return code
  }

  generateTmpStackRecover (init, fin) {
    let code = '##STACK RECOVER INIT \n'

    for (let i = fin - 1; i >= init; i--) {
      code += TranslatorHelpers.arithmeticOperation('-', 'P', '1', 'P')
      code += TranslatorHelpers.generateStackAccess('P', 't' + i)
    }
    code += '##STACK RECOVER FIN \n'
    return code
  }

  generateDefaultAssign (heap, position, value = '0', eCode = '') {
    if (heap) { return eCode + this.generateHeapAssign(position, value) } else {
      const tmp = _generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary()
      let code = eCode + this.arithmeticOperation('+', 'P', position, tmp)
      code += this.generateStackAssign(tmp, value)
      return code
    }
  }

  comment (com) {
    return `##${com}\n`
  }

  setError (num) {
    return `E=${num};\n`
  }
}

const TranslatorHelpers = new Translator()


/***/ }),

/***/ "./src/backend/helpers/base-object.js":
/*!********************************************!*\
  !*** ./src/backend/helpers/base-object.js ***!
  \********************************************/
/*! exports provided: saveFunctionInSymbolTable, insertInSymbolTable, createObjectClass, createDefaultConstructorEntry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveFunctionInSymbolTable", function() { return saveFunctionInSymbolTable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertInSymbolTable", function() { return insertInSymbolTable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createObjectClass", function() { return createObjectClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDefaultConstructorEntry", function() { return createDefaultConstructorEntry; });
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../backend */ "./src/backend/backend.js");
/* harmony import */ var _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../symbol-table/sym-tab-imp */ "./src/backend/symbol-table/sym-tab-imp.js");
/* harmony import */ var _symbol_table_sym_imp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../symbol-table/sym-imp */ "./src/backend/symbol-table/sym-imp.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../compiler-types */ "./src/backend/compiler-types.js");





const saveFunctionInSymbolTable = (identifier, rol, type, aux_type, params, node, dims = 0, modifiers = { static: false, protected: false, public: false, private: false }) => {
  const symbol = createVariable(identifier, rol, type, '-', '-', aux_type, params, dims)
  symbol.node = node
  _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable.insert(identifier, symbol)
  return symbol
}

const createVariable = (identifier, rol, type, scope, position, aux_type, params = null, dims = 0, modifiers) => {
  return new _symbol_table_sym_imp__WEBPACK_IMPORTED_MODULE_2__["SymImp"](identifier, rol, type, scope, position, aux_type, params, dims, modifiers)
}

const insertInSymbolTable = (identifier, rol, type, position, aux_type, params = null, dims = 0, modifiers, isStatic = false) => {
  const scope = _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].ScopeStack.currentNestingLevel()
  const symbol = createVariable(identifier, rol, type, scope, position, aux_type, params, dims, modifiers)

  if (symbol.rol === _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].GLOBAL || isStatic) {
    symbol.rol = _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].GLOBAL
    _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].Heap_Pointer += 1
  }

  if (!isStatic) {
    if (dims !== 0) { symbol.is_array = true } else { symbol.is_array = false }
    _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable.insert(identifier, symbol)
    return symbol
  } else {
    let symTab = _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable
    while (symTab.parent != null) { symTab = symTab.parent }
    symbol.scope = '0'
    symTab.insert(identifier, symbol)
    return symbol
  }
}

const createObjectClass = () => {
  const ObjectTable = new _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_1__["SymTabImp"](null)

  ObjectTable.insertInSymbolTable('equals', _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].FUNCTION, _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].BOOLEAN, 0, null, null, [['left', _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].OBJECT], ['right', _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].OBJECT]], null)
  ObjectTable.insertInSymbolTable('getClass', _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].FUNCTION, _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].STRING, 0, null, null, null, null)
  ObjectTable.insertInSymbolTable('toString', _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].FUNCTION, _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].STRING, 0, null, null, null, null)
}

const createDefaultConstructorEntry = (identifier, parentSymTab, fnId) => {
  // identifier, rol, type, aux_type, params, node, dims = 0
  const symbol = saveFunctionInSymbolTable(identifier, _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].CONSTRUCTOR, _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].OBJECT, _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].Classes.getType(identifier), [], null, 0)
  symbol.functionId = fnId
  symbol.setSymbols(new _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_1__["SymTabImp"](parentSymTab))
}


/***/ }),

/***/ "./src/backend/helpers/display-helper.js":
/*!***********************************************!*\
  !*** ./src/backend/helpers/display-helper.js ***!
  \***********************************************/
/*! exports provided: DisplayHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisplayHelper", function() { return DisplayHelper; });
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../generators/generator */ "./src/backend/generators/generator.js");


const ErrorTypeByName = new Map()
ErrorTypeByName.set('arithmeticexception', 1)
ErrorTypeByName.set('indexoutofbounds', 2)
ErrorTypeByName.set('uncaughtexception', 3)
ErrorTypeByName.set('nullpointerexception', 4)
ErrorTypeByName.set('invalidcastingexception', 5)
ErrorTypeByName.set('heapoverflowerror', 6)
ErrorTypeByName.set('stackoverflowerror', 7)

const ErrorEnum = Array.from(ErrorTypeByName.values())

class ErrorHelpers {
  constructor () {
    this.ErrorMapping = new Map()
  }

  createLabel (exceptionname) {
    let error = -1
    if ((error = ErrorTypeByName.get(exceptionname)) === undefined) {
      throw new Error("UNKNOWN ERROR CAN'T CONTINUE PARSING")
    } else {
      const label = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()
      this.ErrorMapping.set(error, label)
      return label
    }
  }

  fillDefaultExceptions (defaultlabel) {
    const labels = Array.from(this.ErrorMapping.keys())
    for (const key of ErrorEnum) {
      if (labels.includes(key)) continue
      else { this.ErrorMapping.set(key, defaultlabel) }
    }
  }
}

class DisplayHelper {
  constructor () {
    this.Cicles = []
    this.TryCatchErrors = []
    this.NativeFunc = []
    this.FunctionCallStack = []
    this.OutLabel = ''
    this.LeftHandSide = false
  }

  clear () {
    this.Cicles.clear()
    this.NativeFunc.clear()
    this.FunctionCallStack.clear()
    this.TryCatchErrors.clear()
  }

  createTryCatchEnv () {
    this.TryCatchErrors.push(new ErrorHelpers())
    return this.TryCatchErrors[this.TryCatchErrors.length - 1]
  }

  exitTryCatchEnv () {
    this.TryCatchErrors.pop()
  }

  getError (type) {
    return this.TryCatchErrors[this.TryCatchErrors.length - 1].ErrorMapping.get(type)
  }
}


/***/ }),

/***/ "./src/backend/helpers/type-checking.js":
/*!**********************************************!*\
  !*** ./src/backend/helpers/type-checking.js ***!
  \**********************************************/
/*! exports provided: TypeChecking */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TypeChecking", function() { return TypeChecking; });
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../compiler-types */ "./src/backend/compiler-types.js");



class TypeChecking {
  static ExpressionTypeChecking (op, opL, opR) {
    /* if (!(opL instanceof CompilerTypes && opR instanceof CompilerTypes))
            throw new Exception("UNABLE TO PERFORM AN ARITHMETIC OPERATION BETWEEN " + opL.toString().toUpperCase()
                    + " " + opR.toString().toUpperCase()); */

    const op_left = opL; const op_right = opR

    switch (op) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.PLUS: {
        if (op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING
          }
        }

        if (op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING
          }
        }

        if (op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].OBJECT:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING
          }
        }

        if (op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING
          }
        }

        if (op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING
          }
        }

        if (op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].OBJECT) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING
          }
        }
      }
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.MINUS: {
        if (op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE
          }
        }

        if (op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE
          }
        }
      }
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.DIV:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.MOD:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.MULT: {
        if (op_left === _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE
          }
        }

        if (op_left === _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER) {
          switch (op_right) {
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
              if (op === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.DIV) { return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE } else { return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER }

            case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE
          }
        }
      }
    }

    throw `UNABLE TO OPERATE TYPES ${_compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypesNames"][opL]} AND ${_compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypesNames"][opR]} UNDER SYMBOL ${_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].names[op]}`
  }

  static RelationalTypeChecking (op, opL, opR) {
    const op_left = opL; const op_right = opR

    switch (op) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.NOTEQ:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.EQEQ: {
        switch (op_left) {
          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING: {
            switch (op_right) {
              case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].STRING:
              case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].NULL:
                return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN
            }
          }
            break
          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
            switch (op_right) {
              case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
              case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
                return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN
            }
            break
          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN: {
            if (op_right == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN) { return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN }
          }
            break

          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].OBJECT: {
            if (op_right == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].NULL || op_right == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].OBJECT) { return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN }
          }
            break
        }
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.LT:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.GT:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.GTE:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.LTE: {
        switch (op_left) {
          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
          case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
            switch (op_right) {
              case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR:
              case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
              case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
                return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].BOOLEAN
            }
            break
        }
      }
        break
    }

    throw `UNABLE TO OPERATE TYPES ${_compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypesNames"][op_left]} / ${_compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypesNames"][op_right]} UNDER OP: ${_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].names[op]}`
  }

  static PowTypeChecking (op_left, op_right) {
    if ((op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER || op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE || op_left == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR) &&
            (op_right == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER || op_right == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE || op_right == _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR)) { return true }

    throw 'PARAMETER TYPES CANT BE OPERATED UNDER FUNCTION POW'
  }

  static ImplicitTypeChecking (op_left, op_right) {
    switch (op_left) {
      case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE:
        if (op_right === _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER || op_right === _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR) { return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE } else return -1
      case _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].INTEGER:
        if (op_right === _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].CHAR) { return _compiler_types__WEBPACK_IMPORTED_MODULE_1__["CompilerTypes"].DOUBLE } else return -1
      default:
        return -1
    }
  }
}


/***/ }),

/***/ "./src/backend/parser/jsharp.js":
/*!**************************************!*\
  !*** ./src/backend/parser/jsharp.js ***!
  \**************************************/
/*! exports provided: JSharpRoot, jsharp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JSharpRoot", function() { return JSharpRoot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jsharp", function() { return jsharp; });
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _ast_ast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ast/ast */ "./src/backend/ast/ast.js");
/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/


var JSharpRoot = null;

var native_functions = ['print', 'println'];

var jsharp = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,10],$V1=[1,22],$V2=[1,31],$V3=[1,32],$V4=[1,33],$V5=[1,30],$V6=[1,11],$V7=[1,25],$V8=[1,26],$V9=[1,27],$Va=[1,19],$Vb=[1,60],$Vc=[1,61],$Vd=[1,62],$Ve=[1,63],$Vf=[1,64],$Vg=[1,65],$Vh=[1,54],$Vi=[1,67],$Vj=[1,58],$Vk=[1,76],$Vl=[1,77],$Vm=[1,73],$Vn=[1,74],$Vo=[1,79],$Vp=[5,7,17,20,21,22,28,36,47,48,49,57],$Vq=[1,87],$Vr=[1,94],$Vs=[1,96],$Vt=[1,101],$Vu=[1,107],$Vv=[28,39,60],$Vw=[5,28,29,32,37,39,41,43,58,60,66,109,132,133,137,138,143,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$Vx=[5,32],$Vy=[5,32,41,60,66,109],$Vz=[5,29,32,39,41,60,66,109,132,133,137,138,143,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$VA=[2,146],$VB=[5,32,41,60,66,109,132,133,137,138,143,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$VC=[2,168],$VD=[1,114],$VE=[1,113],$VF=[1,115],$VG=[5,32,41,60,66,109,163,165],$VH=[1,116],$VI=[5,29,32,39,41,43,60,66,109,132,133,137,138,143,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$VJ=[5,32,41,60,66,109,161,163,165],$VK=[1,117],$VL=[5,29,32,41,60,66,109,132,133,137,138,143,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$VM=[5,32,41,60,66,109,159,161,163,165],$VN=[1,120],$VO=[1,121],$VP=[1,122],$VQ=[5,32,41,60,66,109,155,156,157,159,161,163,165],$VR=[1,127],$VS=[1,128],$VT=[1,129],$VU=[1,130],$VV=[5,32,41,60,66,109,150,151,152,153,155,156,157,159,161,163,165],$VW=[1,133],$VX=[1,134],$VY=[1,136],$VZ=[5,32,41,60,66,109,137,138,150,151,152,153,155,156,157,159,161,163,165],$V_=[1,139],$V$=[1,140],$V01=[1,141],$V11=[5,32,41,60,66,109,137,138,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$V21=[1,142],$V31=[5,32,41,60,66,109,137,138,143,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$V41=[1,180],$V51=[1,179],$V61=[1,154],$V71=[1,176],$V81=[1,177],$V91=[1,178],$Va1=[1,187],$Vb1=[1,188],$Vc1=[1,182],$Vd1=[1,183],$Ve1=[1,184],$Vf1=[1,185],$Vg1=[1,186],$Vh1=[5,7,9,10,11,12,13,14,17,20,21,22,28,36,47,48,49,57,58,64,66,88,90,91,96,97,101,107,110,111,113,114,115,122,132,133,137,138,141],$Vi1=[5,64],$Vj1=[5,43],$Vk1=[1,190],$Vl1=[28,60],$Vm1=[1,191],$Vn1=[5,32,43],$Vo1=[2,48],$Vp1=[1,192],$Vq1=[1,193],$Vr1=[1,205],$Vs1=[1,216],$Vt1=[1,223],$Vu1=[32,66],$Vv1=[2,68],$Vw1=[5,7,9,10,11,12,13,14,17,20,21,22,28,36,47,48,49,57,58,64,66,88,89,90,91,96,97,100,101,107,110,111,113,114,115,122,132,133,137,138,141],$Vx1=[5,9,10,11,12,13,14,17,20,21,22,28,47,48,49,58,64,66,88,90,91,96,97,101,107,110,111,113,114,115,122,132,133,137,138,141],$Vy1=[5,9,10,11,12,13,14,17,20,21,22,28,47,48,49,58,64,66,88,89,90,91,96,97,101,107,110,111,113,114,115,122,132,133,137,138,141],$Vz1=[1,243],$VA1=[1,265],$VB1=[32,60],$VC1=[1,297],$VD1=[32,41],$VE1=[1,319],$VF1=[5,32,60],$VG1=[5,9,10,11,12,13,14,17,20,21,22,28,47,48,49,58,64,66,88,89,90,91,96,97,100,101,107,110,111,113,114,115,122,132,133,137,138,141],$VH1=[1,362],$VI1=[1,363],$VJ1=[66,107,110];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"translation_unit":3,"import_declarations":4,"SEMICOLON":5,"type_declarations":6,"EOF":7,"literal":8,"INTEGER_LITERAL":9,"DOUBLE_LITERAL":10,"BOOLEAN_LITERAL":11,"CHARACTER_LITERAL":12,"STRING_LITERAL":13,"NULL_LITERAL":14,"primitive_type":15,"numeric_type":16,"BOOLEAN":17,"integral_type":18,"floating_point_type":19,"INTEGER":20,"CHAR":21,"DOUBLE":22,"array_type":23,"dims":24,"name":25,"simple_name":26,"qualified_name":27,"IDENTIFIER":28,"DOT":29,"IMPORT":30,"expression":31,"COMMA":32,"type_declaration":33,"class_member_declaration":34,"struct_declaration":35,"DEFINE":36,"AS":37,"struct_body":38,"LBRACK":39,"struct_attribute_list":40,"RBRACK":41,"struct_variable_declaration":42,"EQ":43,"field_declaration":44,"method_declaration":45,"modifiers":46,"FINAL":47,"GLOBAL":48,"VAR":49,"variable_declaration_statement":50,"variable_declarators":51,"variable_declarator":52,"variable_declarator_id":53,"method_header":54,"method_body":55,"method_declarator":56,"VOID":57,"LPAREN":58,"formal_parameter_list":59,"RPAREN":60,"formal_parameter":61,"block":62,"array_initializer":63,"LBRACE":64,"variable_initializers":65,"RBRACE":66,"variable_initializer":67,"block_statements":68,"block_statement":69,"statement":70,"variable_declaration":71,"special_declaration":72,"PEQ":73,"statement_without_trailing_substatement":74,"if_then_statement":75,"if_then_else_statement":76,"while_statement":77,"for_statement":78,"empty_statement":79,"expression_statement":80,"switch_statement":81,"do_statement":82,"break_statement":83,"continue_statement":84,"return_statement":85,"throw_statement":86,"try_statement":87,"IF":88,"ELSE":89,"WHILE":90,"FOR":91,"for_init":92,"for_update":93,"statement_expression_list":94,"statement_expression":95,"THROW":96,"TRY":97,"catches":98,"catch_clause":99,"CATCH":100,"SWITCH":101,"switch_block":102,"switch_block_statement_groups":103,"switch_labels":104,"switch_block_statement_group":105,"switch_label":106,"CASE":107,"constant_expression":108,"COLON":109,"DEFAULT":110,"DO":111,"expression_list":112,"BREAK":113,"CONTINUE":114,"RETURN":115,"primary":116,"primary_no_new_array":117,"array_creation_expression":118,"class_instance_creation_expression":119,"method_invocation":120,"left_hand_side":121,"NEW":122,"argument_list":123,"DOLLAR":124,"dim_exprs":125,"dim_expr":126,"field_access":127,"array_access":128,"postfix_expression":129,"postincrement_expression":130,"postdecrement_expression":131,"PLUSPLUS":132,"MINUSMINUS":133,"unary_expression":134,"preincrement_expression":135,"predecrement_expression":136,"PLUS":137,"MINUS":138,"unary_expression_not_plus_minus":139,"cast_expression":140,"NOT":141,"power_expression":142,"POT":143,"multiplicative_expression":144,"MULT":145,"DIV":146,"MOD":147,"additive_expression":148,"relational_expression":149,"LT":150,"GT":151,"LTEQ":152,"GTEQ":153,"equality_expression":154,"EQEQ":155,"REQEQ":156,"NOTEQ":157,"exclusive_or_expression":158,"XOR":159,"conditional_and_expression":160,"ANDAND":161,"conditional_or_expression":162,"OROR":163,"conditional_expression":164,"QUESTION":165,"assignment_expression":166,"assignment":167,"assignment_operator":168,"$accept":0,"$end":1},
terminals_: {2:"error",5:"SEMICOLON",7:"EOF",9:"INTEGER_LITERAL",10:"DOUBLE_LITERAL",11:"BOOLEAN_LITERAL",12:"CHARACTER_LITERAL",13:"STRING_LITERAL",14:"NULL_LITERAL",17:"BOOLEAN",20:"INTEGER",21:"CHAR",22:"DOUBLE",28:"IDENTIFIER",29:"DOT",30:"IMPORT",32:"COMMA",36:"DEFINE",37:"AS",39:"LBRACK",41:"RBRACK",43:"EQ",47:"FINAL",48:"GLOBAL",49:"VAR",57:"VOID",58:"LPAREN",60:"RPAREN",64:"LBRACE",66:"RBRACE",73:"PEQ",88:"IF",89:"ELSE",90:"WHILE",91:"FOR",96:"THROW",97:"TRY",100:"CATCH",101:"SWITCH",107:"CASE",109:"COLON",110:"DEFAULT",111:"DO",113:"BREAK",114:"CONTINUE",115:"RETURN",122:"NEW",124:"DOLLAR",132:"PLUSPLUS",133:"MINUSMINUS",137:"PLUS",138:"MINUS",141:"NOT",143:"POT",145:"MULT",146:"DIV",147:"MOD",150:"LT",151:"GT",152:"LTEQ",153:"GTEQ",155:"EQEQ",156:"REQEQ",157:"NOTEQ",159:"XOR",161:"ANDAND",163:"OROR",165:"QUESTION"},
productions_: [0,[3,4],[3,2],[8,1],[8,1],[8,1],[8,1],[8,1],[8,1],[15,1],[15,1],[16,1],[16,1],[18,1],[18,1],[19,1],[23,2],[23,2],[25,1],[25,1],[26,1],[27,3],[4,2],[4,3],[6,1],[6,2],[33,1],[33,1],[35,5],[38,3],[40,1],[40,3],[42,2],[42,2],[42,2],[42,4],[42,4],[42,4],[34,1],[34,1],[34,1],[46,1],[46,1],[46,1],[44,1],[51,1],[51,3],[52,1],[53,1],[45,2],[54,2],[54,2],[54,2],[54,2],[56,4],[56,3],[59,1],[59,3],[61,2],[61,2],[61,2],[55,1],[55,1],[63,4],[63,3],[63,3],[65,1],[65,3],[67,1],[62,3],[62,2],[68,1],[68,2],[69,1],[69,1],[50,4],[50,2],[50,2],[71,2],[71,2],[71,2],[72,4],[70,1],[70,1],[70,1],[70,1],[70,1],[74,1],[74,1],[74,1],[74,1],[74,1],[74,1],[74,1],[74,1],[74,1],[74,1],[75,5],[76,7],[77,5],[78,9],[78,8],[78,8],[78,7],[78,8],[78,7],[78,7],[78,6],[92,1],[92,3],[93,1],[94,1],[94,3],[86,3],[87,3],[98,1],[98,2],[99,5],[95,1],[79,1],[80,2],[81,5],[102,4],[102,3],[102,3],[102,2],[103,1],[103,2],[105,2],[104,1],[104,2],[106,3],[106,2],[82,7],[112,1],[112,3],[83,2],[84,2],[85,2],[85,3],[116,1],[116,1],[117,1],[117,3],[117,1],[117,1],[117,1],[119,4],[123,1],[123,2],[123,3],[123,4],[118,3],[118,3],[118,1],[125,1],[125,2],[126,3],[24,2],[24,3],[127,3],[120,4],[120,3],[120,5],[120,6],[128,4],[128,4],[129,1],[129,1],[129,1],[129,1],[130,2],[131,2],[134,1],[134,1],[134,2],[134,2],[134,1],[135,2],[136,2],[140,4],[140,4],[140,4],[139,1],[139,2],[139,1],[142,1],[142,3],[144,1],[144,3],[144,3],[144,3],[148,1],[148,3],[148,3],[149,1],[149,3],[149,3],[149,3],[149,3],[154,1],[154,3],[154,3],[154,3],[158,1],[158,3],[160,1],[160,3],[162,1],[162,3],[164,1],[164,5],[166,1],[166,1],[167,3],[167,3],[121,1],[121,1],[168,1],[31,1],[108,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("PROGRAM", null, _$[$0-3].first_line, _$[$0-3].first_column, $$[$0-3], ...$$[$0-1]);
		JSharpRoot = this.$;

break;
case 2:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("PROGRAM", null, _$[$0-1].first_line, _$[$0-1].first_column, ...$$[$0-1]);
		JSharpRoot = this.$;

break;
case 3:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("INTEGER_LITERAL", parseInt($$[$0]), _$[$0].first_line, _$[$0].first_column);

break;
case 4:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DOUBLE_LITERAL", parseFloat($$[$0]), _$[$0].first_line, _$[$0].first_column);

break;
case 5:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("BOOLEAN_LITERAL", $$[$0] == 'true', _$[$0].first_line, _$[$0].first_column);

break;
case 6:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("CHARACTER_LITERAL", $$[$0], _$[$0].first_line, _$[$0].first_column);

break;
case 7:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("STRING_LITERAL", $$[$0].substring(1,$$[$0].length-1), _$[$0].first_line, _$[$0].first_column);

break;
case 8:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("NULL_LITERAL", null, _$[$0].first_line, _$[$0].first_column);

break;
case 9: case 11: case 12: case 18: case 19: case 26: case 27: case 38: case 39: case 44: case 47: case 61: case 68: case 73: case 74:

		this.$ = $$[$0];

break;
case 10:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("BOOLEAN", null, _$[$0].first_line, _$[$0].first_column);

break;
case 13:

  	this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("INTEGER", null, _$[$0].first_line, _$[$0].first_column);

break;
case 14:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("CHAR", null, _$[$0].first_line, _$[$0].first_column);

break;
case 15:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DOUBLE", null, _$[$0].first_line, _$[$0].first_column);

break;
case 16:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ARRAY", null, _$[$0-1].first_line, _$[$0-1].first_column,
					$$[$0-1],
					$$[$0]
				);

break;
case 17:


		if($$[$0-1].value.toLowerCase() === 'string')
			$$[$0-1].changeType("STRING");

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ARRAY", null, _$[$0-1].first_line, _$[$0-1].first_column,
			$$[$0-1],
			$$[$0]
		);

break;
case 20:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER",$$[$0],_$[$0].first_line,_$[$0].first_column);

break;
case 21:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DOT", null, _$[$0-2].first_line, _$[$0-2].first_column,
					$$[$0-2],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER",$$[$0],_$[$0].first_line,_$[$0].first_column)
				)

break;
case 22:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IMPORTS", null, _$[$0-1].first_line, _$[$0-1].first_column, $$[$0]);

break;
case 23: case 31: case 57: case 67:

		this.$ = $$[$0-2];
		this.$.addChild($$[$0]);

break;
case 24:

		this.$ = [$$[$0]];

break;
case 25:

		this.$ = $$[$0-1];
		this.$.push($$[$0]);

break;
case 28:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("STRUCT_DECLARATION",null, _$[$0-4].first_line, _$[$0-4].first_column,
					$$[$0-3],
					$$[$0-1]
				)

break;
case 29: case 76: case 77: case 123:

		this.$ = $$[$0-1];

break;
case 30:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("STRUCT_LIST", null ,_$[$0].first_line, _$[$0].first_column,
						$$[$0]
					);

break;
case 32:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ATTR_DECLARATION", null, _$[$0-1].first_line, _$[$0-1].first_column,
					$$[$0-1],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ID_LIST", null,  _$[$0].first_line, _$[$0].first_column,
						new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0], _$[$0].first_line, _$[$0].first_column)
					)
				);

break;
case 33:

		if($$[$0-1].value.toLowerCase() === "string")
			$$[$0-1].changeType("STRING");

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ATTR_DECLARATION", null, _$[$0-1].first_line, _$[$0-1].first_column,
					$$[$0-1],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ID_LIST", null,  _$[$0].first_line, _$[$0].first_column,
						new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0], _$[$0].first_line, _$[$0].first_column)
					)
				);

break;
case 34:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ATTR_DECLARATION", null, _$[$0-1].first_line, _$[$0-1].first_column,
					$$[$0-1],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ID_LIST", null,  _$[$0].first_line, _$[$0].first_column,
						new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0], _$[$0].first_line, _$[$0].first_column)
					)
				);

break;
case 35:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("VAR_DECLARATION", null, _$[$0-3].first_line, _$[$0-3].first_column,
					$$[$0-3],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ", null, _$[$0-1].first_line, _$[$0-1].first_column,
						new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ID_LIST", null,  _$[$0-2].first_line, _$[$0-2].first_column,
							new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column),
						),
						$$[$0]
					)
				);

break;
case 36:

		if($$[$0-3].value.toLowerCase() === "string")
			$$[$0-3].changeType("STRING");

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ATTR_DECLARATION", null, _$[$0-3].first_line, _$[$0-3].first_column,
					$$[$0-3],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ", null, _$[$0-1].first_line, _$[$0-1].first_column,
						new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ID_LIST", null,  _$[$0-2].first_line, _$[$0-2].first_column,
							new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column),
						),
						$$[$0]
					)
				);

break;
case 37:


		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ATTR_DECLARATION", null, _$[$0-3].first_line, _$[$0-3].first_column,
						$$[$0-3],
						new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ", null, _$[$0-1].first_line, _$[$0-1].first_column,
							new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ID_LIST", null,  _$[$0-2].first_line, _$[$0-2].first_column,
								new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column),
							),
							$$[$0]
						)
					);

break;
case 40:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("NO_OP", null, _$[$0].first_line, _$[$0].first_column);

break;
case 41:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FINAL",null,_$[$0].first_line, _$[$0].first_column);

break;
case 42:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("GLOBAL",null,_$[$0].first_line, _$[$0].first_column);

break;
case 43:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("VAR",null,_$[$0].first_line, _$[$0].first_column);

break;
case 45:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ID_LIST",null,_$[$0].first_line,_$[$0].first_column, $$[$0]);

break;
case 46:

		this.$ = $$[$0-2]
		this.$.addChild($$[$0]);

break;
case 48:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0], _$[$0].first_line, _$[$0].first_column);

break;
case 49: case 72: case 127: case 156:

		this.$ = $$[$0-1];
		this.$.addChild($$[$0]);

break;
case 50:

		this.$ = $$[$0];
		this.$.insertAt(0,$$[$0-1]);

break;
case 51:

		this.$ = $$[$0];
		if($$[$0-1].value.toLowerCase() === "string"){
			$$[$0-1].changeType("STRING");
		}
		this.$.insertAt(0,$$[$0-1]);

break;
case 52:

		this.$ = $$[$0];
		this.$.insertAt(0, $$[$0-1]);

break;
case 53:

		this.$ = $$[$0];
		if(this.$.getChild(0).value.toLowerCase() === "principal")
			this.$.changeType("MAIN_DECLARATION");
		this.$.insertAt(0,new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("VOID",null,_$[$0-1].first_line, _$[$0-1].first_column));

break;
case 54:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FUNCTION_DECLARATION",$$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column,
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column),
					$$[$0-1]
				)

break;
case 55:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FUNCTION_DECLARATION",$$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column,
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column)
				)

break;
case 56:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FORMAL_PARAMETER_LIST', null, _$[$0].first_line, _$[$0].first_column, $$[$0]);

break;
case 58: case 60:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FORMAL_PARAMETER',null, _$[$0-1].first_line, _$[$0-1].first_column, $$[$0-1], $$[$0]);

break;
case 59:

		if($$[$0-1].value.toLowerCase() === 'string')
			$$[$0-1].changeType("STRING");
		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FORMAL_PARAMETER',null, _$[$0-1].first_line, _$[$0-1].first_column, $$[$0-1], $$[$0]);

break;
case 62:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("BLOCK", null, _$[$0].first_line, _$[$0].first_column);

break;
case 63:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('ARRAY_LITERAL', null, _$[$0-3].first_line, _$[$0-3].first_column,...$$[$0-2].getChildren());

break;
case 64:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('ARRAY_LITERAL', null, _$[$0-2].first_line, _$[$0-2].first_column,...$$[$0-1].getChildren());

break;
case 65:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('ARRAY_LITERAL', null, _$[$0-2].first_line, _$[$0-2].first_column);

break;
case 66:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('VARIABLE_INITIALIZER', null, _$[$0].first_line, _$[$0].first_column,$$[$0]);

break;
case 69:

		this.$ = $$[$0-1];
		this.$.changeType("BLOCK");

break;
case 70:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("BLOCK",null,_$[$0-1].first_line, _$[$0-1].first_column);

break;
case 71:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("STMT_LIST",null,_$[$0].first_line, _$[$0].first_column,$$[$0]) ;

break;
case 75:

		this.$ = $$[$0-3];
		let tmp = this.$.deleteAt(1);
		this.$.addChild(
							new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ",null,_$[$0-3].first_line,_$[$0-3].first_column,
								tmp[0],
								$$[$0-1]
							)
						)

break;
case 78:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("VAR_DECLARATION", null, _$[$0-1].first_line, _$[$0-1].first_column, $$[$0-1], $$[$0]);

break;
case 79:

		if($$[$0-1].value.toLowerCase() === 'string')
			$$[$0-1].changeType("STRING");
		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("VAR_DECLARATION", null, _$[$0-1].first_line, _$[$0-1].first_column, $$[$0-1], $$[$0]);

break;
case 80:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("VAR_DECLARATION", null, _$[$0-1].first_line, _$[$0-1].first_column, $$[$0-1], $$[$0]);

break;
case 81:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("VAR_DECLARATION_NO_TYPE", null, _$[$0-3].first_line, _$[$0-3].first_column,
					$$[$0-3],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ", null, _$[$0-1].first_line, _$[$0-1].first_column,
						$$[$0-2],
						$$[$0]
					)
				);

break;
case 82: case 83: case 84: case 85: case 86: case 87: case 88: case 89: case 90: case 91: case 92: case 94: case 95: case 96: case 118: case 140: case 141: case 142: case 144: case 145: case 146: case 167: case 169: case 170: case 173: case 174: case 177: case 183: case 185: case 188: case 192: case 195: case 200: case 204: case 206: case 208: case 210: case 212: case 213: case 219: case 220:

    this.$ = $$[$0];

break;
case 93:

     this.$ = $$[$0];

break;
case 97:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('IF', null, _$[$0-4].first_line, _$[$0-4].first_column, $$[$0-2], $$[$0]);

break;
case 98:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('IF', null, _$[$0-6].first_line, _$[$0-6].first_column, $$[$0-4], $$[$0-2], $$[$0]);

break;
case 99:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('WHILE', null, _$[$0-4].first_line, _$[$0-4].first_column, $$[$0-2], $$[$0]);

break;
case 100:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FOR', null, _$[$0-8].first_line, _$[$0-8].first_column, $$[$0-6], new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FOR_COND",null,_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-4]), $$[$0-2], $$[$0]);
    this.$.info = [true, true, true];

break;
case 101:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FOR', null, _$[$0-7].first_line, _$[$0-7].first_column, new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FOR_COND",null,_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-4]), $$[$0-2], $$[$0]);
    this.$.info = [false, true, true];

break;
case 102:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FOR', null, _$[$0-7].first_line, _$[$0-7].first_column, $$[$0-5], $$[$0-2], $$[$0]);
    this.$.info = [true, false, true];

break;
case 103:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FOR', null, _$[$0-6].first_line, _$[$0-6].first_column, $$[$0-4], $$[$0-2], $$[$01]);
    this.$.info = [false, false, true];

break;
case 104:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FOR', null, _$[$0-7].first_line, _$[$0-7].first_column, $$[$0-5], new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FOR_COND",null,_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-3]), $$[$0]);
    this.$.info = [true, true, false];

break;
case 105:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FOR', null, _$[$0-6].first_line, _$[$0-6].first_column, new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FOR_COND",null,_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-3]), $$[$0]);
    this.$.info = [false, true, false];

break;
case 106:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FOR', null, _$[$0-6].first_line, _$[$0-6].first_column, $$[$0-4], $$[$0]);
    this.$.info = [true, false, false];

break;
case 107:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('FOR', null, _$[$0-5].first_line, _$[$0-5].first_column, $$[$0]);
    this.$.info = [false, false, false];

break;
case 108:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FOR_INIT",null,_$[$0].first_line, _$[$0].first_column, $$[$0]);

break;
case 109:

			this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FOR_INIT",null,_$[$0-2].first_line, _$[$0-2].first_column, $$[$0-2]);
			let tt = $$[$0-2].deleteAt(1);
			$$[$0-2].addChild(
								new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ",null,_$[$0-2].first_line,_$[$0-2].first_column,
								tt[0],
								$$[$0]
							)
						);

break;
case 110:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FOR_UPDATE",null,_$[$0].first_line, _$[$0].first_column, $$[$0]);

break;
case 111:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("STMT_LIST", null, _$[$0].first_line,_$[$0].first_column, $$[$0]);

break;
case 112: case 135:

    this.$ = $$[$0-2];
    this.$.addChild($$[$0]);

break;
case 113:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("THROW", null, _$[$0-2].first_line,_$[$0-2].first_column, $$[$0-1]);

break;
case 114:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("TRY", null, _$[$0-2].first_line, _$[$0-2].first_column, $$[$0-1], $$[$0]);

break;
case 115:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("CATCH-LIST", null, _$[$0].first_line, _$[$0].first_column, $$[$0]);

break;
case 116:

    this.$ = $$[$0-1];
    this.$.addChild($$[$0]);

break;
case 117:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("CATCH", null, _$[$0-4].first_line, _$[$0-4].first_column,
            $$[$0-2],
						$$[$0]
        )

break;
case 119:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("NO_OP", null, _$[$0].first_line, _$[$0].first_column, $$[$0]);

break;
case 120:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EXPRESSION_STMT", null, _$[$0-1].first_line, _$[$0-1].first_column, $$[$0-1]);

break;
case 121:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('SWITCH', null, _$[$0-4].first_line, _$[$0-4].first_column, $$[$0-2], $$[$0]);

break;
case 122:

		this.$ = $$[$0-2];
		$$[$0-2].addChild($$[$0-1]);

break;
case 124:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("SWITCH_BODY", null, _$[$0-2].first_line, _$[$0-2].first_column, $$[$0-1]);

break;
case 125:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("SWITCH_BODY", null, _$[$0-1].first_line, _$[$0-1].first_column);

break;
case 126:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("SWITCH_BODY", null, _$[$0].first_line, _$[$0].first_column,$$[$0]);

break;
case 128:

		this.$ = $$[$0-1];
		$$[$0-1].addChild($$[$0]);

break;
case 129:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('CASE_LABEL_LIST', null, _$[$0].first_line, _$[$0].first_column, ...$$[$0]);

break;
case 130:

		this.$ = $$[$0-1];
		this.$.addChild(...$$[$0]);

break;
case 131:

		this.$ = [$$[$0-1]];

break;
case 132:

		this.$ = [new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DEFAULT", null, _$[$0-1].first_line, _$[$0-1].first_column)]

break;
case 133:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DO",null,_$[$0-6].first_line,_$[$0-6].first_column,
					$$[$0-5],
					$$[$0-2]
				);

break;
case 134: case 148:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('EXPRESSION_LIST',null,_$[$0].first_line,_$[$0].first_column,$$[$0]);

break;
case 136:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("BREAK", null, _$[$0-1].first_line, _$[$0-1].first_column);

break;
case 137:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("CONTINUE", null, _$[$0-1].first_line, _$[$0-1].first_column);

break;
case 138:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("RETURN", null, _$[$0-1].first_line, _$[$0-1].first_column);

break;
case 139:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("RETURN", null, _$[$0-2].first_line, _$[$0-2].first_column,$$[$0-1]);

break;
case 143:

    $$[$0-1].grouped = true
    this.$ = $$[$0-1];

break;
case 147:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("NEW", null, _$[$0-3].first_line, _$[$0-3].first_column, $$[$0-2]);

break;
case 149:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]('EXPRESSION_LIST',null,_$[$0-1].first_line,_$[$0-1].first_column,
          new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DOLLAR",null,_$[$0-1].first_line, _$[$0-1].first_column,
              new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0], _$[$0].first_line, _$[$0].first_column)
            )
        );

break;
case 150:

    this.$ = $$[$0-2];
		this.$.addChild($$[$0]);

break;
case 151:

    this.$ = $$[$0-3];
		this.$.addChild(new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DOLLAR",null,_$[$0-1].first_line, _$[$0-1].first_column,
                              new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER", $$[$0], _$[$0].first_line, _$[$0].first_column)
                            )
                    );

break;
case 152: case 153:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("NEW_ARRAY", null, _$[$0-2].first_line, _$[$0-2].first_column, $$[$0-1], $$[$0]);

break;
case 154: case 186: case 216: case 217:

    this.$ = $$[$0];

break;
case 155:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ARRAY_DIMS",null,_$[$0].first_line, _$[$0].first_column,
					$$[$0]
				);

break;
case 157:

	  this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DIM", null,_$[$0-2].first_line, _$[$0-2].first_column, $$[$0-1]);

break;
case 158:

	  this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ARRAY_DIMS",null,_$[$0-1].first_line, _$[$0-1].first_column,
        new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DIM", null,_$[$0-1].first_line, _$[$0-1].first_column)
      );

break;
case 159:

	  this.$ = $$[$0-2];
		this.$.addChild(new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DIM",null,_$[$0-1].first_line, _$[$0-1].first_column));

break;
case 160:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DOT",null,_$[$0-1].first_line,_$[$0-1].first_column,
        $$[$0-2],
        new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER",$$[$0],_$[$0].first_line,_$[$0].first_column)
      );

break;
case 161:

    {
			let type = native_functions.find(item => item == $$[$0-3].getValue());
			this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]((type === undefined?"FUNCTION_CALL":"NATIVE_FUNCTION_CALL"),null,_$[$0-3].first_line,_$[$0-3].first_column,
				$$[$0-3],
				$$[$0-1]
			);
		}

break;
case 162:

		{
			let type = native_functions.find(it=>it==$$[$0-2].getValue());
			this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]((type === undefined?"FUNCTION_CALL":"NATIVE_FUNCTION_CALL"),null,_$[$0-2].first_line,_$[$0-2].first_column,
				$$[$0-2]
			);
		}

break;
case 163:

			this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FUNCTION_CALL",null,_$[$0-2].first_line,_$[$0-2].first_column,
				new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DOT", null, _$[$0-3].first_line, _$[$0-3].first_column,
					$$[$0-4],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER",$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column)
				)
			);

break;
case 164:

			this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("FUNCTION_CALL",null,_$[$0-3].first_line,_$[$0-3].first_column,
				new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DOT", null, _$[$0-4].first_line, _$[$0-4].first_column,
					$$[$0-5],
					new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("IDENTIFIER",$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column)
				),
				$$[$0-1]
			);

break;
case 165:

		if($$[$0-3].type != _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.ARRAY_ACCESS){
			this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ARRAY_ACCESS", null, _$[$0-3].first_line, _$[$0-3].first_column, $$[$0-3], $$[$0-1]);
		}else{
			this.$ = $$[$0-3];
			this.$.addChild($$[$0-1]);
		}

break;
case 166:

    if($$[$0-3].type != _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.ARRAY_ACCESS){
			this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ARRAY_ACCESS", null, _$[$0-3].first_line, _$[$0-3].first_column, $$[$0-3], $$[$0-1]);
		}else{
			this.$ = $$[$0-3];
			this.$.addChild($$[$0-1]);
		}

break;
case 168:

	  this.$ = $$[$0];

break;
case 171:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("POSTINC", null, _$[$0].first_line, _$[$0].first_column, $$[$0-1]);

break;
case 172:

    	this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("POSTDEC", null, _$[$0].first_line, _$[$0].first_column, $$[$0-1]);

break;
case 175:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("PLUS", null,  _$[$0-1].first_line, _$[$0-1].first_column, $$[$0]);

break;
case 176:

		this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("MINUS", null,  _$[$0-1].first_line, _$[$0-1].first_column, $$[$0]);

break;
case 178:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("PREINC", null,  _$[$0-1].first_line, _$[$0-1].first_column, $$[$0]);

break;
case 179:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("PREDEC", null,  _$[$0-1].first_line, _$[$0-1].first_column, $$[$0]);

break;
case 180: case 182:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("CAST", null, _$[$0-3].first_line, _$[$0-3].first_column, $$[$0-2], $$[$0]);

break;
case 181:

		if($$[$0-2].getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.IDENTIFIER){
			if($$[$0-2].getValue() === "string")
				$$[$0-2].changeType("STRING")
		}
    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("CAST", null, _$[$0-3].first_line, _$[$0-3].first_column, $$[$0-2], $$[$0]);

break;
case 184:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("NOT", null, _$[$0-1].first_line, _$[$0-1].first_column, $$[$0]);

break;
case 187:

    /* FIX THE RECURSION */
    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("POW", null, _$[$0-1].first_line,_$[$0-1].first_column);

    //we check for lhs (if lhs type == ^) we must rotate
    if($$[$0-2].getType() == _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.POW && !$$[$0-2].grouped){
          let tmp = $$[$0-2].deleteAt(1)[0];
          this.$.addChild(tmp);
          this.$.addChild($$[$0]);
          $$[$0-2].addChild(this.$);
          this.$ = $$[$0-2];
    }else{
			this.$.addChild($$[$0-2],$$[$0]);
		}

break;
case 189:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("MULT", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 190:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("DIV", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 191:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("MOD", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 193:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("PLUS", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 194:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("MINUS", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 196:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("LT", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 197:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("GT", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 198:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("LTEQ", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 199:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("GTEQ", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 201:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQEQ", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 202:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("REQEQ", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 203:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("NOTEQ", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 205:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("XOR", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 207:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("ANDAND", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 209:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("OROR", null, _$[$0-1].first_line,_$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 211:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("QUESTION", null, _$[$0-3].first_line,_$[$0-3].first_column, $$[$0-4],$$[$0-2],$$[$0]);

break;
case 214:

	  this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ",null,_$[$0-1].first_line, _$[$0-1].first_column,$$[$0-2],$$[$0]);

break;
case 215:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ",null,_$[$0-1].first_line, _$[$0-1].first_column, $$[$0-2],$$[$0]);

break;
case 218:

    this.$ = new _ast_ast__WEBPACK_IMPORTED_MODULE_1__["AST"]("EQ", null, _$[$0].first_line, _$[$0].first_column);

break;
}
},
table: [{3:1,4:2,5:$V0,6:3,15:16,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:18,25:17,26:23,27:24,28:$V5,30:[1,4],33:5,34:6,35:7,36:$V6,44:8,45:9,46:20,47:$V7,48:$V8,49:$V9,50:12,54:13,57:$Va,71:14,72:15},{1:[3]},{5:[1,34],32:[1,35]},{5:$V0,7:[1,36],15:16,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:18,25:17,26:23,27:24,28:$V5,33:37,34:6,35:7,36:$V6,44:8,45:9,46:20,47:$V7,48:$V8,49:$V9,50:12,54:13,57:$Va,71:14,72:15},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:38,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vp,[2,24]),o($Vp,[2,26]),o($Vp,[2,27]),o($Vp,[2,38]),o($Vp,[2,39]),o($Vp,[2,40]),{25:83,26:23,27:24,28:$V5},o($Vp,[2,44]),{5:[1,86],55:84,62:85,64:$Vq},{5:[1,89],43:[1,88]},{5:[1,90]},{24:93,28:$Vr,39:$Vs,51:92,52:95,53:97,56:91},{24:100,28:$Vr,29:$Vt,39:$Vs,51:99,52:95,53:97,56:98},{28:$Vr,51:103,52:95,53:97,56:102},{28:[1,105],56:104},{28:$Vu,53:106},o($Vv,[2,9]),o($Vv,[2,10]),o($Vw,[2,18]),o($Vw,[2,19]),{28:[2,41]},{28:[2,42]},{28:[2,43]},o($Vv,[2,11]),o($Vv,[2,12]),o($Vw,[2,20]),o($Vv,[2,13]),o($Vv,[2,14]),o($Vv,[2,15]),{5:$V0,6:108,15:16,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:18,25:17,26:23,27:24,28:$V5,33:5,34:6,35:7,36:$V6,44:8,45:9,46:20,47:$V7,48:$V8,49:$V9,50:12,54:13,57:$Va,71:14,72:15},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:109,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{1:[2,2]},o($Vp,[2,25]),o($Vx,[2,22]),o($Vy,[2,219]),o($Vy,[2,212]),o($Vy,[2,213]),o($Vy,[2,210],{163:[1,111],165:[1,110]}),o($Vz,$VA,{43:[1,112]}),o($VB,$VC,{29:$Vt,39:$VD,43:$VE,58:$VF}),o($VG,[2,208],{161:$VH}),o($VI,[2,216]),o($VI,[2,217]),o($VJ,[2,206],{159:$VK}),o($VB,[2,167],{29:[1,118]}),o($VL,[2,140],{39:[1,119]}),o($VM,[2,204],{155:$VN,156:$VO,157:$VP}),o($VL,[2,141]),o($Vz,[2,142]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,15:124,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:125,25:126,26:23,27:24,28:$V5,31:123,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vz,[2,144]),o($Vz,[2,145]),o($VQ,[2,200],{150:$VR,151:$VS,152:$VT,153:$VU}),{15:131,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,25:132,26:23,27:24,28:$V5},o($VL,[2,154]),o($Vz,[2,3]),o($Vz,[2,4]),o($Vz,[2,5]),o($Vz,[2,6]),o($Vz,[2,7]),o($Vz,[2,8]),o($VV,[2,195],{137:$VW,138:$VX}),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:138,32:$VY,58:$Vh,63:59,64:$Vi,65:135,67:137,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($VZ,[2,192],{145:$V_,146:$V$,147:$V01}),o($V11,[2,188],{143:$V21}),o($V31,[2,186]),o($V31,[2,173]),o($V31,[2,174]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:143,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:146,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo},o($V31,[2,177]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:147,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:148,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo},o($V31,[2,183],{132:[1,149],133:[1,150]}),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:151,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo},o($V31,[2,185]),o($VB,[2,169]),o($VB,[2,170]),{29:$Vt,37:[1,152]},o($Vp,[2,49]),o($Vp,[2,61]),o($Vp,[2,62]),{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,15:163,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:165,25:164,26:23,27:24,28:$V5,31:181,46:20,47:$V7,48:$V8,49:$V9,50:156,58:$Vh,62:166,63:59,64:$V51,66:$V61,68:153,69:155,70:157,71:14,72:15,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:189,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vh1,[2,76]),o($Vh1,[2,77]),o($Vi1,[2,50]),o($Vj1,[2,78],{32:$Vk1}),o($Vl1,[2,16],{39:$Vm1}),o($Vn1,$Vo1,{58:$Vp1}),o($Vn1,[2,45]),{41:$Vq1},o($Vn1,[2,47]),o($Vi1,[2,51]),o($Vj1,[2,79],{32:$Vk1}),o($Vl1,[2,17],{39:$Vm1}),{28:[1,194]},o($Vi1,[2,52]),o($Vj1,[2,80],{32:$Vk1}),o($Vi1,[2,53]),{58:$Vp1},{73:[1,195]},o([5,32,43,60,73],$Vo1),{5:$V0,7:[1,196],15:16,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:18,25:17,26:23,27:24,28:$V5,33:37,34:6,35:7,36:$V6,44:8,45:9,46:20,47:$V7,48:$V8,49:$V9,50:12,54:13,57:$Va,71:14,72:15},o($Vx,[2,23]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:197,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:198},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:199,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:200,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:201,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:204,58:$Vh,60:[1,203],63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,123:202,124:$Vr1,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:206},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:207},{28:[1,208]},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:209,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:210},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:211},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:212},{60:[1,213]},{24:93,39:$Vs,60:[1,214]},{60:[1,215]},o([60,132,133,137,138,143,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$VC,{24:100,29:$Vt,39:$Vs1,43:$VE,58:$VF}),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:217},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:218},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:219},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:220},{39:$Vt1,125:221,126:222},{29:$Vt,39:$Vt1,58:[1,225],125:224,126:222},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:226},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:227},{32:[1,228],66:[1,229]},{66:[1,230]},o($Vu1,[2,66]),o($Vu1,$Vv1),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:231},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:232},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:233},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:234,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo},o($V31,[2,175]),o($VB,$VC,{29:$Vt,39:$VD,58:$VF}),o($Vz,$VA),o($V31,[2,176]),o($V31,[2,178]),o($V31,[2,179]),o($VB,[2,171]),o($VB,[2,172]),o($V31,[2,184]),{38:235,39:[1,236]},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,15:163,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:165,25:164,26:23,27:24,28:$V5,31:181,46:20,47:$V7,48:$V8,49:$V9,50:156,58:$Vh,62:166,63:59,64:$V51,66:[1,237],69:238,70:157,71:14,72:15,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vw1,[2,70]),o($Vx1,[2,71]),o($Vx1,[2,73]),o($Vx1,[2,74]),o($Vy1,[2,82]),o($Vy1,[2,83]),o($Vy1,[2,84]),o($Vy1,[2,85]),o($Vy1,[2,86]),{24:93,28:$Vu,39:$Vs,51:92,52:95,53:97},o([5,32,66,132,133,137,138,143,145,146,147,150,151,152,153,155,156,157,159,161,163,165],$VC,{52:95,53:97,51:99,24:100,28:$Vu,29:$Vt,39:$Vs1,43:$VE,58:$VF}),{28:$Vu,51:103,52:95,53:97},o($Vy1,[2,87]),o($Vy1,[2,88]),o($Vy1,[2,89]),o($Vy1,[2,90]),o($Vy1,[2,91]),o($Vy1,[2,92]),o($Vy1,[2,93]),o($Vy1,[2,94]),o($Vy1,[2,95]),o($Vy1,[2,96]),{58:[1,239]},{58:[1,240]},{58:[1,241]},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,15:163,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:165,25:164,26:23,27:24,28:$V5,31:242,32:$VY,46:20,47:$V7,48:$V8,49:$V9,50:156,58:$Vh,62:166,63:59,64:$V51,65:135,66:$V61,67:137,68:153,69:155,70:157,71:14,72:15,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vy1,[2,119]),{5:$Vz1},{58:[1,244]},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:245,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{5:[1,246]},{5:[1,247]},{5:[1,248],8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:249,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:250,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{62:251,64:$Vq},{5:[1,252]},{28:$Vu,52:253,53:97},{41:[1,254]},{15:258,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:260,25:259,26:23,27:24,28:$V5,59:255,60:[1,256],61:257},o($Vv,[2,158]),o($Vw,[2,21]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:261,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{1:[2,1]},{109:[1,262]},o($VG,[2,209],{161:$VH}),o($Vy,[2,214]),o($Vy,[2,215]),{41:[1,263]},{32:$VA1,60:[1,264]},o($Vz,[2,162]),o($VB1,[2,148]),{28:[1,266]},o($VJ,[2,207],{159:$VK}),o($VM,[2,205],{155:$VN,156:$VO,157:$VP}),o($VI,[2,160],{58:[1,267]}),{41:[1,268]},o($VQ,[2,201],{150:$VR,151:$VS,152:$VT,153:$VU}),o($VQ,[2,202],{150:$VR,151:$VS,152:$VT,153:$VU}),o($VQ,[2,203],{150:$VR,151:$VS,152:$VT,153:$VU}),o($Vz,[2,143],{26:23,27:24,127:46,128:47,116:49,117:50,118:52,8:53,119:55,120:56,63:59,129:78,140:80,130:81,131:82,25:144,121:145,139:269,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,28:$V5,58:$Vh,64:$Vi,122:$Vj,141:$Vo}),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:270,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,139:271,140:80,141:$Vo},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:201,41:$Vq1,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($VV,[2,196],{137:$VW,138:$VX}),o($VV,[2,197],{137:$VW,138:$VX}),o($VV,[2,198],{137:$VW,138:$VX}),o($VV,[2,199],{137:$VW,138:$VX}),o($VL,[2,152],{126:272,39:$Vt1}),o($Vz,[2,155]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:273,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($VL,[2,153],{126:272,39:$Vt1}),{60:[1,274]},o($VZ,[2,193],{145:$V_,146:$V$,147:$V01}),o($VZ,[2,194],{145:$V_,146:$V$,147:$V01}),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:138,58:$Vh,63:59,64:$Vi,66:[1,275],67:276,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($VL,[2,64]),o($VL,[2,65]),o($V11,[2,189],{143:$V21}),o($V11,[2,190],{143:$V21}),o($V11,[2,191],{143:$V21}),o($V31,[2,187]),{5:[1,277]},{15:280,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:282,25:281,26:23,27:24,28:$V5,40:278,42:279},o($Vw1,[2,69]),o($Vx1,[2,72]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:283,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:284,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{5:[1,286],8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,15:163,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:165,25:164,26:23,27:24,28:$V5,31:290,58:$Vh,63:59,64:$Vi,71:288,92:285,94:287,95:289,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vu1,$Vv1,{5:$Vz1}),o($Vy1,[2,120]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:291,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{90:[1,292]},o($Vy1,[2,136]),o($Vy1,[2,137]),o($Vy1,[2,138]),{5:[1,293]},{5:[1,294]},{98:295,99:296,100:$VC1},o($Vh1,[2,75]),o($Vn1,[2,46]),o($Vv,[2,159]),{32:[1,299],60:[1,298]},o($Vi1,[2,55]),o($VB1,[2,56]),{24:93,28:$Vu,39:$Vs,53:300},{24:100,28:$Vu,29:$Vt,39:$Vs,53:301},{28:$Vu,53:302},{5:[2,81]},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:144,26:23,27:24,28:$V5,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:145,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:303},o($VI,[2,165]),o($Vz,[2,161]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:304,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,124:[1,305],127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($VB1,[2,149]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:204,58:$Vh,60:[1,306],63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,123:307,124:$Vr1,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($VI,[2,166]),o($V31,[2,181]),o($V31,[2,180]),o($V31,[2,182]),o($Vz,[2,156]),{41:[1,308]},o($Vz,[2,147]),o($VL,[2,63]),o($Vu1,[2,67]),o($Vp,[2,28]),{32:[1,310],41:[1,309]},o($VD1,[2,30]),{24:93,28:[1,311],39:$Vs},{24:100,28:[1,312],29:$Vt,39:$Vs},{28:[1,313]},{60:[1,314]},{60:[1,315]},{5:[1,316]},{5:[1,318],8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:317,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{5:[2,108],32:$VE1},{43:[1,320]},o($VF1,[2,111]),o($VF1,[2,118]),{60:[1,321]},{58:[1,322]},o($Vy1,[2,139]),o($Vy1,[2,113]),o($Vy1,[2,114],{99:323,100:$VC1}),o($VG1,[2,115]),{58:[1,324]},o($Vi1,[2,54]),{15:258,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:260,25:259,26:23,27:24,28:$V5,61:325},o($VB1,[2,58]),o($VB1,[2,59]),o($VB1,[2,60]),o($Vy,[2,211]),o($VB1,[2,150]),{28:[1,326]},o($Vz,[2,163]),{32:$VA1,60:[1,327]},o($Vz,[2,157]),{5:[2,29]},{15:280,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:282,25:281,26:23,27:24,28:$V5,42:328},o($VD1,[2,32],{43:[1,329]}),o($VD1,[2,33],{43:[1,330]}),o($VD1,[2,34],{43:[1,331]}),{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:332,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:333,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{5:[1,335],8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:334,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{5:[1,336]},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:290,58:$Vh,60:[1,338],63:59,64:$Vi,93:337,94:339,95:289,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:290,58:$Vh,63:59,64:$Vi,95:340,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:341,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{64:[1,343],102:342},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:344,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($VG1,[2,116]),{15:258,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:260,25:259,26:23,27:24,28:$V5,61:345},o($VB1,[2,57]),o($VB1,[2,151]),o($Vz,[2,164]),o($VD1,[2,31]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:346,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:347,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:348,58:$Vh,63:59,64:$Vi,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vx1,[2,97],{89:[1,349]}),o($Vy1,[2,99]),{5:[1,350]},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:290,58:$Vh,60:[1,352],63:59,64:$Vi,93:351,94:339,95:289,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:290,58:$Vh,60:[1,354],63:59,64:$Vi,93:353,94:339,95:289,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{60:[1,355]},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:356,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{32:$VE1,60:[2,110]},o($VF1,[2,112]),{5:[2,109]},o($Vy1,[2,121]),{66:[1,359],103:357,104:358,105:360,106:361,107:$VH1,110:$VI1},{60:[1,364]},{60:[1,365]},o($VD1,[2,35]),o($VD1,[2,36]),o($VD1,[2,37]),{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:366,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:290,58:$Vh,60:[1,368],63:59,64:$Vi,93:367,94:339,95:289,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{60:[1,369]},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:370,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{60:[1,371]},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:372,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:373,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vy1,[2,107]),{66:[1,375],104:374,105:376,106:361,107:$VH1,110:$VI1},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,15:163,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:165,25:164,26:23,27:24,28:$V5,31:181,46:20,47:$V7,48:$V8,49:$V9,50:156,58:$Vh,62:166,63:59,64:$V51,66:[1,377],68:379,69:155,70:157,71:14,72:15,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,106:378,107:$VH1,110:$VI1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vy1,[2,125]),o($VJ1,[2,126]),o($Vx1,[2,129]),{8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:381,58:$Vh,63:59,64:$Vi,108:380,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{109:[1,382]},{5:[1,383]},{62:384,64:$Vq},o($Vy1,[2,98]),{60:[1,385]},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:386,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:387,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vy1,[2,106]),{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:388,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vy1,[2,105]),o($Vy1,[2,103]),{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,15:163,16:21,17:$V1,18:28,19:29,20:$V2,21:$V3,22:$V4,23:165,25:164,26:23,27:24,28:$V5,31:181,46:20,47:$V7,48:$V8,49:$V9,50:156,58:$Vh,62:166,63:59,64:$V51,66:[1,389],68:379,69:155,70:157,71:14,72:15,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,106:378,107:$VH1,110:$VI1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vy1,[2,123]),o($VJ1,[2,127]),o($Vy1,[2,124]),o($Vx1,[2,130]),o($VJ1,[2,128],{71:14,72:15,46:20,16:21,26:23,27:24,18:28,19:29,166:39,164:40,167:41,162:42,121:43,160:45,127:46,128:47,158:48,116:49,117:50,154:51,118:52,8:53,119:55,120:56,149:57,63:59,148:66,144:68,142:69,134:70,135:71,136:72,139:75,129:78,140:80,130:81,131:82,50:156,70:157,74:158,75:159,76:160,77:161,78:162,15:163,25:164,23:165,62:166,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,31:181,69:238,5:$V41,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,17:$V1,20:$V2,21:$V3,22:$V4,28:$V5,47:$V7,48:$V8,49:$V9,58:$Vh,64:$V51,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,122:$Vj,132:$Vk,133:$Vl,137:$Vm,138:$Vn,141:$Vo}),{109:[1,390]},{109:[2,220]},o($Vx1,[2,132]),o($Vy1,[2,133]),o($VG1,[2,117]),{5:$V41,8:53,9:$Vb,10:$Vc,11:$Vd,12:$Ve,13:$Vf,14:$Vg,25:44,26:23,27:24,28:$V5,31:181,58:$Vh,62:166,63:59,64:$V51,70:391,74:158,75:159,76:160,77:161,78:162,79:167,80:168,81:169,82:170,83:171,84:172,85:173,86:174,87:175,88:$V71,90:$V81,91:$V91,96:$Va1,97:$Vb1,101:$Vc1,111:$Vd1,113:$Ve1,114:$Vf1,115:$Vg1,116:49,117:50,118:52,119:55,120:56,121:43,122:$Vj,127:46,128:47,129:78,130:81,131:82,132:$Vk,133:$Vl,134:70,135:71,136:72,137:$Vm,138:$Vn,139:75,140:80,141:$Vo,142:69,144:68,148:66,149:57,154:51,158:48,160:45,162:42,164:40,166:39,167:41},o($Vy1,[2,104]),o($Vy1,[2,102]),o($Vy1,[2,101]),o($Vy1,[2,122]),o($Vx1,[2,131]),o($Vy1,[2,100])],
defaultActions: {25:[2,41],26:[2,42],27:[2,43],36:[2,2],196:[2,1],261:[2,81],309:[2,29],341:[2,109],381:[2,220]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip comments */
break;
case 1:this.begin('comment');
break;
case 2:this.popState();
break;
case 3:/* skip comment content*/
break;
case 4:/* skip whitespace */
break;
case 5:return 73;
break;
case 6:return 64; /* Basic Syntax */
break;
case 7:return 66;
break;
case 8:return 58;
break;
case 9:return 60;
break;
case 10:return 39;
break;
case 11:return 41;
break;
case 12:return 32;
break;
case 13:return 165;
break;
case 14:return 109;
break;
case 15:return 5;
break;
case 16:return 124
break;
case 17:return 47;
break;
case 18:return 49;
break;
case 19:return 48;
break;
case 20:return 57;
break;
case 21:return 30;
break;
case 22:return 88;
break;
case 23:return 89;
break;
case 24:return 90;
break;
case 25:return 111;
break;
case 26:return 91;
break;
case 27:return 113;
break;
case 28:return 114;
break;
case 29:return 101;
break;
case 30:return 107;
break;
case 31:return 110;
break;
case 32:return 97;
break;
case 33:return 100;
break;
case 34:return 96;
break;
case 35:return 11;
break;
case 36:return 11;
break;
case 37:return 36;
break;
case 38:return 37;
break;
case 39:return 122;
break;
case 40:return 115;
break;
case 41:return 17;
break;
case 42:return 20;
break;
case 43:return 22;
break;
case 44:return 21;
break;
case 45:return 152;
break;
case 46:return 150;
break;
case 47:return 156;
break;
case 48:return 155;
break;
case 49:return 153;
break;
case 50:return 151;
break;
case 51:return 157;
break;
case 52:return 163;
break;
case 53:return 143;
break;
case 54:return 159;
break;
case 55:return 161;
break;
case 56:return 141;
break;
case 57:return 43;
break;
case 58:return 132;
break;
case 59:return 137;
break;
case 60:return 133;
break;
case 61:return 138;
break;
case 62:return 145;
break;
case 63:return 146;
break;
case 64:return 147;
break;
case 65:return 29;
break;
case 66:return 14;
break;
case 67:return 28; /* Varying form */
break;
case 68:return 10;
break;
case 69:return 9;
break;
case 70:return 13;
break;
case 71:return 12;
break;
case 72:return 12;
break;
case 73:return 7;
break;
case 74:return 'INVALID';
break;
}
},
rules: [/^(?:\/\/.*)/i,/^(?:\/\*)/i,/^(?:\*\/)/i,/^(?:.)/i,/^(?:\s+)/i,/^(?::=)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\()/i,/^(?:\))/i,/^(?:\[)/i,/^(?:\])/i,/^(?:,)/i,/^(?:\?)/i,/^(?::)/i,/^(?:;)/i,/^(?:\$)/i,/^(?:const\b)/i,/^(?:var\b)/i,/^(?:global\b)/i,/^(?:void\b)/i,/^(?:import\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:while\b)/i,/^(?:do\b)/i,/^(?:for\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:default\b)/i,/^(?:try\b)/i,/^(?:catch\b)/i,/^(?:throw\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:define\b)/i,/^(?:as\b)/i,/^(?:strc\b)/i,/^(?:return\b)/i,/^(?:boolean\b)/i,/^(?:integer\b)/i,/^(?:double\b)/i,/^(?:char\b)/i,/^(?:<=)/i,/^(?:<)/i,/^(?:===)/i,/^(?:==)/i,/^(?:>=)/i,/^(?:>)/i,/^(?:!=)/i,/^(?:\|\|)/i,/^(?:\^\^)/i,/^(?:\^)/i,/^(?:&&)/i,/^(?:!)/i,/^(?:=)/i,/^(?:\+\+)/i,/^(?:\+)/i,/^(?:--)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:\.)/i,/^(?:null\b)/i,/^(?:[_a-zA-Z][a-zA-Z0-9_]*)/i,/^(?:(((0|([1-9])([0-9])*))\.((0|([1-9])([0-9])*))+))/i,/^(?:((0|([1-9])([0-9])*)))/i,/^(?:(("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*")))/i,/^(?:[']['])/i,/^(?:['][^\n]['])/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if ( true && typeof exports !== 'undefined') {
exports.parser = jsharp;
exports.Parser = jsharp.Parser;
exports.parse = function () { return jsharp.parse.apply(jsharp, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(__webpack_require__(/*! path */ "./node_modules/path-browserify/index.js").normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/backend/symbol-table/sym-imp.js":
/*!*********************************************!*\
  !*** ./src/backend/symbol-table/sym-imp.js ***!
  \*********************************************/
/*! exports provided: SymImp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymImp", function() { return SymImp; });
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../backend */ "./src/backend/backend.js");
//import { tree_types } from "../ast/tree-types";



class SymImp {

    constructor(...args) {
        this.identifier = args[0];
        this.rol = args[1];
        this.type = args[2];
        this.scope = args[3];
        this.position = args[4]
        this.auxType = args[5]
        this.params = args[6];
        this.dimensions = args[7];
        this.modifiers = args[8] || null;
        this.code = args[9];
        this.constant = (this.modifiers) ? this.modifiers.final : false;
        this.temporary = null;
        this.code = null;
        this.symbols = null;
    }

    getIdentifier() {
        return this.identifier;
    }

    setIdentifier(identifier) {
        this.identifier = identifier;
    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position = position;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getRol() {
        return this.rol;
    }

    setRol(rol) {
        this.rol = rol;
    }

    getDimensions() {
        return this.dimensions;
    }

    setDimensions(dimensions) {
        this.dimensions = dimensions;
    }

    getParameters() {
        return this.params;
    }

    setAuxType(aux) {
        this.auxType = aux;
    }

    setParameters(parameters) {
        this.params = parameters;
    }

    getNode() {
        return this.node;
    }

    getAuxType() {
        return this.auxType;
    }

    copy() {
        let symbol = new SymImp(this.identifier,
            this.rol,
            this.type,
            this.scope,
            this.position,
            this.auxType,
            (this.params != null ? [...this.params] : null),
            this.dimensions);
        this.symbol.constant = this.constant;
        this.symbol.container = this.container;
    }

    setConstant() {
        this.constant = true;
    }

    isConstant() {
        return this.constant;
    }

    setContainer(cont) {
        this.container = cont;
    }

    getContainer() {
        return this.container;
    }

    getScope() {
        return this.scope;
    }

    setScope(scope) {
        this.scope = scope;
    }

    setTemporary(tmp) {
        this.temporary = tmp;
    }

    setCode(code) {
        this.code = code;
    }

    getTemporary() {
        return this.temporary;
    }

    getCode() {
        return this.code;
    }

    jsonify() {

        let jObject = {};

        // "identifier","position","type", "rol","constant","dimensions", "parameters"
        jObject["identifier"] = this.identifier;
        jObject["position"] = (this.position != "-") ? "+" + this.position : this.position;
        jObject["type"] = _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypesNames"][this.type];
        jObject["aux-type"] = (this.auxType == null) ? "-" : _backend__WEBPACK_IMPORTED_MODULE_1__["Backend"].Classes.reverseMap(this.auxType);
        jObject["rol"] = _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypesNames"][this.rol];
        jObject["constant"] = this.constant;
        jObject["scope"] = this.scope;
        jObject["dimensions"] = this.dimensions == null ? '-' : this.dimensions;
        jObject["parameters"] = this.params == null ? '-' : this.params.length;

        //console.log(jObject);

        return jObject;
    }

    setSymbols(symbol) {
        this.symbols = symbol;
    }

    getSymbols() {
        return this.symbols;
    }
}

/***/ }),

/***/ "./src/backend/symbol-table/sym-tab-imp.js":
/*!*************************************************!*\
  !*** ./src/backend/symbol-table/sym-tab-imp.js ***!
  \*************************************************/
/*! exports provided: SymTabImp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymTabImp", function() { return SymTabImp; });
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../compiler-types */ "./src/backend/compiler-types.js");


class SymTabImp {
  // start in one because we are using this to add up to the stack
  constructor (parent = null) {
    this.parent = parent
    this.children = new Map()
    this.table = new Map()
    this.size = 0
    this.constSize = 0
    this.temporary = [0, 0]
    this.name = ''
    this.modifiers = {}
    this.symbols = null
    this.type = null
    this.constructors = []
  }

  /***
     *
     * @param identifier: key to insert in table
     * @param symbol:     the symbol information itself
     * @return: true or false if information was or not saved
     * @throws Exception
     */
  insert (identifier, symbol) {
    if (this.table.has(identifier)) {
      if (symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].FUNCTION || symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].PROCEDURE ||
                symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CONSTRUCTOR) {
        const symList = this.table.get(symbol.getIdentifier())

        for (let i = 0; i < symList.length; i++) {
          if ((symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].FUNCTION || symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].PROCEDURE ||
                        symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CONSTRUCTOR) &&
                        symList[i].getParameters().length == symbol.getParameters().length) { throw `THE FUNCTION / PROCEDURE ${symbol.identifier} IS ALREADY DEFINED` }
        }

        symList.push(symbol)
        symbol.setContainer(this)
        return true
      } else {
        const arr = this.getAllSyms(identifier)
        const size = arr.length

        for (let i = 0; i < size; i++) {
          if (arr[i].getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].FUNCTION || arr[i].getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].PROCEDURE ||
                        arr[i].getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CONSTRUCTOR) { continue }

          if (symbol.getScope().length < arr[i].getScope().length) {
            arr.push(symbol)
            if (symbol.modifiers == null || !symbol.modifiers.static) { this.size += 1 }
            return true
          } else {
            if (this.checkScope(arr[i].getScope(), symbol.getScope()) < 0) {
              arr.push(symbol)
              if (symbol.modifiers == null || !symbol.modifiers.static) { this.size += 1 }
              return true
            }
          }
        }
      }

      throw `THE VARIABLE ${identifier} YOU ARE ABOUT TO SAVE IS ALREADY DEFINED`
    } else {
      const symList = []
      symList.push(symbol)

      this.table.set(identifier, symList)
      if (symbol.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].FUNCTION && symbol.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].PROCEDURE &&
                symbol.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CONSTRUCTOR) {
        if (symbol.modifiers == null || !symbol.modifiers.static) { this.size += 1}
      }
      symbol.setContainer(this)
      return true
    }
  }

  /***
     *
     * @param identifier: pop the current symbol
     * @return
     */
  pop (identifier) {
    if (this.table.has(identifier)) {
      this.table.delete(identifier)
      return true
    }

    return false
  }

  /***
     *
     * @param symTab: parent SymTab this references at the current parent
     */
  setParent (symTab) {
    this.parent = symTab
    this.size = symTab.size
  }

  /***
     * Function to clear the current datatable
     */
  clean () {
    this.table.clear()
  }

  /***
     *
     * @return: the current SymTab parent;
     */
  getParent () {
    return this.parent
  }

  /***
     *
     * @return : current size
     */
  getSize () {
    return this.size
  }

  /***
     *
     * @return : the current table
     */
  getTable () {
    return this.table
  }

  /***
     *
     * @return : the amount of temporary in the function
     */
  getTemporary () {
    return this.temporary[1] - this.temporary[0]
  }

  setInitialTemporary (init) {
    this.temporary[0] = init
  }

  /***
     *
     * @param init : initial temporary to save
     * @param fin  : final temporary to save
     */
  setTemporary (init, fin) {
    this.temporary[0] = init
    this.temporary[1] = fin
  }

  lookupFunction (identifier, filters) {
    if (this.table.has(identifier)) {
      const array = this.table.get(identifier)

      for (const symbol of array) {
        if (!filters.includes(symbol) && (symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].FUNCTION || symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].PROCEDURE || symbol.getRol() == _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CONSTRUCTOR)) { return symbol }
      }
      return null
    }

    if (this.parent != null) { return this.parent.lookupFunction(identifier, filters) }

    return null
  }

  lookup (identifier, scope = '0') {
    if (this.table.has(identifier)) {
      const array = this.table.get(identifier)

      for (const symbol of array) {
        if (scope.length < symbol.scope.length) { continue } else if (scope.length == symbol.scope.length) {
          if (this.checkScope(symbol.getScope(), scope) == 0) { return symbol }
        }
        // this means the symbol scope is less than the scope
        else if (scope.indexOf(symbol.getScope()) == 0) { return symbol }
      }

      return null
    }

    if (this.parent != null) { return this.parent.lookup(identifier, scope) }

    return null
  }

  getInitialTemporary () {
    return this.temporary[0]
  }

  getFinalTemporary () {
    return this.temporary[1]
  }

  setSize (size) {
    this.size = size
  }

  copy () {
    const nSymTab = new SymTabImp(null)

    /**
         * WE ITERATE EVERY SYMBOL
         */
    const set = this.getTable().keys()
    let symbol = null

    for (const str of set) {
      // we get the symbol entry from the table and set its position to the
      // relative_pointer
      symbol = this.lookup(str)

      nSymTab.insert(str, symbol.copy())
    }

    return nSymTab
  }

  setConstSize (size) {
    this.constSize = size
  }

  getConstSize () {
    return this.constSize
  }

  jsonify (id) {
    const jObject = {}
    const jArray = []

    if (id == null) { jObject.main = jArray } else { jObject[id] = jArray }

    const set = this.getTable().keys()
    let tTable

    for (const str of set) {
      // we get the symbol entry from the table and set its position to the
      // relative_pointer
      tTable = this.table.get(str)

      tTable.forEach(symImp => {
        if (symImp.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].FUNCTION && symImp.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].PROCEDURE && symImp.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CONSTRUCTOR) { jArray.push(symImp.jsonify()) } else {
          jArray.push(symImp.jsonify())
          this.parseFunctionToParent(jObject, symImp.getSymbols(), symImp)
        }
      })
    }

    return jObject
  }

  parseFunctionToParent (jObject, symTab, symImp) {
    const jArray = []
    const id = symImp.getIdentifier()

    if (jObject[id] != undefined) { jObject[symImp.functionId] = jArray } else { jObject[id] = jArray }

    const set = symTab.table.keys()
    let tTable

    for (const str of set) {
      // we get the symbol entry from the table and set its position to the
      // relative_pointer
      tTable = symTab.table.get(str)

      tTable.forEach(symImp => {
        if (symImp.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].FUNCTION && symImp.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].PROCEDURE) { jArray.push(symImp.jsonify()) } else { this.parseFunctionToParent(jObject, symImp.getSymbols(), symImp.getIdentifier()) }
      })
    }
  }

  parseObjectTable (jObject, id) {
    const jArray = []
    jObject[id] = jArray

    const set = this.getTable().keys()
    let tTable

    for (const str of set) {
      // we get the symbol entry from the table and set its position to the
      // relative_pointer
      tTable = this.table.get(str)

      tTable.forEach(symImp => {
        if (symImp.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].FUNCTION && symImp.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].PROCEDURE) { jArray.push(symImp.jsonify()) }
      })
    }
  }

  setInformation (id, type) {
    this.name = id
    this.type = type
  }

  checkScope (v1, v2, options) {
    // console.log(v1,'-',v2);

    const lexicographical = options && options.lexicographical
    const zeroExtend = options && options.zeroExtend
    let v1parts = v1.split('.')
    let v2parts = v2.split('.')

    function isValidPart (x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x)
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push('0')
      while (v2parts.length < v1parts.length) v2parts.push('0')
      // console.log(v1parts,'--',v2parts);
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number)
      v2parts = v2parts.map(Number)
    }

    for (let i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        return 1
      }

      if (v1parts[i] == v2parts[i]) {
        continue
      } else if (v1parts[i] > v2parts[i]) {
        return 1
      } else {
        return -1
      }
    }

    if (v1parts.length != v2parts.length) {
      return -1
    }

    return 0
  }

  getAllSyms (identifier) {
    return this.table.get(identifier)
  }

  getAllKeys () {
    return this.getTable().keys()
  }

  addConstructor (constr) {
    this.constructors.push(constr)
  }
}


/***/ }),

/***/ "./src/backend/symbol-table/sym-tab-stack.js":
/*!***************************************************!*\
  !*** ./src/backend/symbol-table/sym-tab-stack.js ***!
  \***************************************************/
/*! exports provided: SymTabStack */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymTabStack", function() { return SymTabStack; });
class SymTabStack {
  constructor () {
    this.runtimeEnv = []
  }

  peek () {
    return this.runtimeEnv[this.runtimeEnv - 1]
  }

  getCurrentEnv () {
    return this.runtimeEnv[this.runtimeEnv.length - 1]
  }

  /**
     * This will work with the imports i suppose
     *
     * @param current: the Environment we are accessing
     */
  enterEnv (env = 0) {
    this.runtimeEnv.push([env.toString(), 0])
  }

  exitEnv () {
    this.runtimeEnv.pop()
  }

  enterScope () {
    const old = this.runtimeEnv[this.runtimeEnv.length - 1]
    const latest = [`${old[0]}.${old[1]}`, 0]
    old[1] = old[1] + 1

    this.runtimeEnv.push(latest)
  }

  /**
     * This will also pop the stack but will not affect other Enviroments
     */
  exitScope () {
    this.runtimeEnv.pop()
  }

  getSymTabStack () {
    return this.runtimeEnv
  }

  currentNestingLevel () {
    return (this.runtimeEnv.length === 0) ? '0' : (this.runtimeEnv[this.runtimeEnv.length - 1])[0]
  }

  clear () {
    this.runtimeEnv = []
  }
}


/***/ }),

/***/ "./src/backend/translators/classes/field-declaration-translator.js":
/*!*************************************************************************!*\
  !*** ./src/backend/translators/classes/field-declaration-translator.js ***!
  \*************************************************************************/
/*! exports provided: FieldDeclarationTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FieldDeclarationTranslator", function() { return FieldDeclarationTranslator; });
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../translator */ "./src/backend/translators/translator.js");
/* harmony import */ var _helpers_base_object__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers/base-object */ "./src/backend/helpers/base-object.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _helpers_type_checking__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../helpers/type-checking */ "./src/backend/helpers/type-checking.js");









class FieldDeclarationTranslator extends _translator__WEBPACK_IMPORTED_MODULE_3__["Translator"] {
  constructor (parent) {
    super(parent)
  }

  translate (global, iNode, attribute = false) {
    this.iNode = iNode

    // so right now we are supoused to get the current size
    let relative_pointer = (global && !attribute) ? (_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Heap_Pointer + 0) : (attribute ? 0 : 1) + _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].SymbolTable.getSize()

    // TODO: CHECK null, IF null ARE STATIC THEN IT TURNS GLOBAL AND ALSO THE SIZE DOESNT ADD UP
    const typeNode = iNode.getChild(0)
    let type = this.getCompilerType(typeNode)

    let vNode = null
    let code = ''
    let aux_type = (type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT) ? _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Classes.getType(typeNode.getValue()) : null

    if (aux_type === -1) { throw Error(`UNABLE TO FIND THE SPECIFIED CLASS OBJECT ${typeNode.getValue()} ${this.parseSemanticError(iNode)}`) }
    let flag = false

    for (let i = 1; i < iNode.childrenSize(); i++) {
      vNode = iNode.getChild(i)
      flag = false

      // HOTFIX FOR ARRAYS
      if (vNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.EQ &&
               type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ARRAY) {
        flag = true

        type = this.getCompilerType(typeNode.getChild(0))
        const eTrans = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
        eTrans.translate(vNode.getChild(1))

        if (eTrans.getAuxType() !== aux_type || eTrans.getType() !== type ||
                    !eTrans.is_array || eTrans.dimensions !== typeNode.getChild(1).childrenSize()) {
          if ((type = _helpers_type_checking__WEBPACK_IMPORTED_MODULE_7__["TypeChecking"].ImplicitTypeChecking(type, eTrans.getType())) === -1) { throw Error(`UNABLE TO PERFORM ASSIGN FOR ${vNode.getChild(0).getValue()} UNCOMPATIBLE TYPES ${this.parseSemanticError(vNode)}`) }
        }

        // same code as below
        // cambio porque la sintaxis es lista_ids = E

        for (let i = 0; i < vNode.getChild(0).childrenSize(); i++) {
          try {
            const identifier = vNode.getChild(0).getChild(i).getValue()

            const symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(identifier, (attribute ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ATTRIBUTE : (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE), type,
              relative_pointer++, aux_type, null, eTrans.dimensions)

            console.log('%c array eq declaration!' + identifier + '\n', 'background: #222; color: #bada55')
            symbol.setCode(eTrans.getCode())
            symbol.setTemporary(eTrans.getTemporary())

            if (global) { symbol.node = vNode.getChild(1) }

            // code += symbol.getCode();
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(global, symbol.position, eTrans.getTemporary(), eTrans.getCode())
          // fin same code as below
          } catch (e) {
            throw Error(`${e} ${this.parseSemanticError(this.iNode)}`)
          }
        }
      } else if (type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ARRAY) {
        flag = true
        try {
          type = this.getCompilerType(typeNode.getChild(0))
          aux_type = (type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT) ? _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Classes.getType(typeNode.getChild(0).getValue()) : null

          if (aux_type === -1) { throw Error(`UNABLE TO FIND THE SPECIFIED CLASS OBJECT ${typeNode.getValue()} ${this.parseSemanticError(iNode)}`) }

          console.log('%c array declaration only!' + '\n', 'background: #222; color: #021B55')
          for (const node of vNode.getChildren()) {
            const symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(node.getValue(), (attribute ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ATTRIBUTE : (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE), type,
              relative_pointer++, aux_type, null, typeNode.getChild(1).childrenSize())
            symbol.setCode(_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(global, symbol.position))
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
        case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT: {
          // first we get the ctype then we get the value of the position of the recently created shit
          try {
            // if it has a value, start it with the default value
            if (vNode.getType() == _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.EQ) {
              const eTrans = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
              eTrans.translate(vNode.getChild(1))

              for (const node of vNode.getChild(0).getChildren()) {
                const identifier = node.getValue()

                // TYPECHEKCING
                // COMMENT IF NOT WORKING
                if (type != eTrans.type || aux_type != eTrans.aux_type ||
                                eTrans.dimensions != 0) {
                  if (!this.typeChecking(type, aux_type, 0, eTrans.type, eTrans.aux_type, eTrans.dimensions)) { throw `UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(iNode)}` }
                }

                const symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(identifier, (attribute ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ATTRIBUTE : (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE), type,
                  relative_pointer++, aux_type, null, 0, null)

                symbol.setCode(eTrans.getCode())
                symbol.setTemporary(eTrans.getTemporary())

                if (global) { symbol.node = vNode.getChild(1) }

                // code += symbol.getCode();
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(attribute, symbol.position, eTrans.getTemporary(), eTrans.getCode())
              }
            } else {
              for (const node of vNode.getChildren()) {
                const symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(node.getValue(), (attribute ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ATTRIBUTE : (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE), type,
                  relative_pointer++, aux_type, null, 0, null)
                symbol.setCode(_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(attribute, symbol.position))
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
            if (vNode.getType() == _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.EQ) {
              const eTrans = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
              eTrans.translate(vNode.getChild(1))

              for (const idNode of vNode.getChild(0).getChildren()) {
                const identifier = idNode.getValue()

                // TYPECHEKCING
                // COMMENT IF NOT WORKING
                if (type != eTrans.type || eTrans.aux_type != null ||
                                  eTrans.dimensions != 0) {
                  if (!this.typeChecking(type, null, 0, eTrans.type, eTrans.aux_type, eTrans.dimensions)) { throw `UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(iNode)}` }
                }

                const symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(identifier, (attribute ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ATTRIBUTE : (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE), type,
                  relative_pointer++, null, null, 0, null)

                symbol.setCode(eTrans.getCode())
                symbol.setTemporary(eTrans.getTemporary())

                if (global) { symbol.node = vNode.getChild(1) }

                code += symbol.getCode()
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(attribute, symbol.position, eTrans.getTemporary(), '')
              }
            } else {
              for (const node of vNode.getChildren()) {
                const symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(node.getValue(), (attribute ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ATTRIBUTE : (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE), type,
                  relative_pointer++, null, null, 0, null)
                symbol.setCode(_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(attribute, symbol.position))
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
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.INTEGER:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.DOUBLE:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.STRING:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].STRING
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.CHAR:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.BOOLEAN:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].BOOLEAN
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.ARRAY:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].ARRAY
      default:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/classes/function-declaration-translator.js":
/*!****************************************************************************!*\
  !*** ./src/backend/translators/classes/function-declaration-translator.js ***!
  \****************************************************************************/
/*! exports provided: FunctionDeclarationTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionDeclarationTranslator", function() { return FunctionDeclarationTranslator; });
/* harmony import */ var _translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../translator */ "./src/backend/translators/translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _statements_block_stmt_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../statements/block-stmt-translator */ "./src/backend/translators/statements/block-stmt-translator.js");
/* harmony import */ var _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../symbol-table/sym-tab-imp */ "./src/backend/symbol-table/sym-tab-imp.js");
/* harmony import */ var _helpers_base_object__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../helpers/base-object */ "./src/backend/helpers/base-object.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");










class FunctionDeclarationTranslator extends _translator__WEBPACK_IMPORTED_MODULE_0__["Translator"] {

  firstPass(iNode){
    const block = iNode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.BLOCK)

    const block_stmt = new _statements_block_stmt_translator__WEBPACK_IMPORTED_MODULE_4__["BlockStmtTranslator"](this)
    block_stmt.firstPass(block)
  }

  translate (iNode, symbol) {
    this.iNode = iNode

    const RefSymTab = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable = new _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_5__["SymTabImp"](RefSymTab)
    symbol.setSymbols(_backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable)

    const parameter_list = symbol.getParameters()

    // we search for all the var types
    // TODO: save register types as Object[]
    if (parameter_list != null) {
      let position_relative = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable.getSize() + 1

      for (const param of parameter_list) {
        Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_6__["insertInSymbolTable"])(
          param[0],
          param[2] ? _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].REF_PARAM : _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].VAL_PARAM,
          param[1],
          position_relative,
          param[3],
          null,
          param[4],
          null
        )
        position_relative += 1
      }
    }

    // codigo*
    const block = iNode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.BLOCK)

    const block_stmt = new _statements_block_stmt_translator__WEBPACK_IMPORTED_MODULE_4__["BlockStmtTranslator"](this)
    block_stmt.setSiguiente(_generators_generator__WEBPACK_IMPORTED_MODULE_7__["Generator"].genLabel())
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Display.OutLabel = block_stmt.siguiente
    block_stmt.translate(block, false)
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Display.OutLabel = ''
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable = RefSymTab

    this.setCode(block_stmt.getCode() + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_8__["TranslatorHelpers"].generateLabel(block_stmt.siguiente))
  }
}


/***/ }),

/***/ "./src/backend/translators/classes/special-declaration-translator.js":
/*!***************************************************************************!*\
  !*** ./src/backend/translators/classes/special-declaration-translator.js ***!
  \***************************************************************************/
/*! exports provided: SpecialDeclarationTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpecialDeclarationTranslator", function() { return SpecialDeclarationTranslator; });
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../translator */ "./src/backend/translators/translator.js");
/* harmony import */ var _helpers_base_object__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers/base-object */ "./src/backend/helpers/base-object.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
// VAR_DECLARATION_NO_TYPE









class SpecialDeclarationTranslator extends _translator__WEBPACK_IMPORTED_MODULE_3__["Translator"] {
  constructor (parent) {
    super(parent)
    this.firstPass = false // this one is for global
  }

  translate (global, iNode) {
    this.iNode = iNode

    const isStatic = iNode.getChild(0).getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.GLOBAL

    if (this.firstPass && !isStatic) { return }
    if (!this.firstPass && isStatic) { return }
    // so right now we are supoused to get the current size
    let relativePointer = (global) ? (_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Heap_Pointer + 0) : 1 + _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].SymbolTable.getSize()

    const typeNode = iNode.getChild(0) // Here we save if its a const, global or var

    const eTrans = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
    eTrans.translate(iNode.getChild(1).getChild(1))

    const identifier = iNode.getChild(1).getChild(0).getValue()
    const isConstant = typeNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.FINAL
    let symbol = null
    if (isConstant || _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].VarFlag) {
      symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(identifier, (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE, eTrans.type, relativePointer++, eTrans.aux_type, null, eTrans.dimensions)
      if (_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].VarFlag && isConstant) { symbol.setConstant() }
      if (!global) {
        let code = ''
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(global, symbol.position, eTrans.getTemporary(), eTrans.getCode())
        symbol.setCode(code)
        symbol.setTemporary(eTrans.getTemporary())
      } else {
        symbol.setCode(eTrans.getCode())
        symbol.setTemporary(eTrans.getTemporary())
      }
    } else {
      let code = eTrans.getCode()
      // if global this means that stack is null
      const auxTmp = _generators_generator__WEBPACK_IMPORTED_MODULE_7__["Generator"].genTemporary()
      if (global) {
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].comment('codigo para globales')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', auxTmp)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateStackAssign(auxTmp, eTrans.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].arithmeticOperation('+', 'P', '2', auxTmp)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateStackAssign(auxTmp, eTrans.type)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].functionCall('default_object_constructor')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateStackAccess('P', eTrans.temporary)
        symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(identifier, (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE, _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT, relativePointer++, _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Classes.getType('var'), null, eTrans.dimensions, null, isStatic)
        symbol.setCode(code)
        symbol.setTemporary(eTrans.getTemporary())
      } else {
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].moveStackPointer(true, _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].SymbolTable.size + 1)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', auxTmp)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateStackAssign(auxTmp, eTrans.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].arithmeticOperation('+', 'P', '2', auxTmp)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateStackAssign(auxTmp, eTrans.type)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].functionCall('default_object_constructor')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateStackAccess('P', eTrans.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].moveStackPointer(false, _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].SymbolTable.size + 1)
        symbol = Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_4__["insertInSymbolTable"])(identifier, (global) ? _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].GLOBAL : _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VARIABLE, _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT, relativePointer++, _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Classes.getType('var'), null, eTrans.dimensions, null, isStatic)
        if (!isStatic) {
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].comment('entró por no ser estático')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(global, symbol.position, eTrans.getTemporary(), '')
        }
        symbol.setCode(code)
        symbol.setTemporary(eTrans.getTemporary())
      }
    }

    if (global) { symbol.node = iNode.getChild(1).getChild(1) }
    // code += symbol.getCode();

    this.setCode(symbol.getCode())
  }
}


/***/ }),

/***/ "./src/backend/translators/classes/struct-translator.js":
/*!**************************************************************!*\
  !*** ./src/backend/translators/classes/struct-translator.js ***!
  \**************************************************************/
/*! exports provided: StructTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StructTranslator", function() { return StructTranslator; });
/* harmony import */ var _translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../translator */ "./src/backend/translators/translator.js");
/* harmony import */ var _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../symbol-table/sym-tab-imp */ "./src/backend/symbol-table/sym-tab-imp.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _field_declaration_translator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./field-declaration-translator */ "./src/backend/translators/classes/field-declaration-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _helpers_base_object__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../helpers/base-object */ "./src/backend/helpers/base-object.js");











class StructTranslator extends _translator__WEBPACK_IMPORTED_MODULE_0__["Translator"] {
  constructor (parent) {
    super(parent)
    this.SymTab = new _symbol_table_sym_tab_imp__WEBPACK_IMPORTED_MODULE_1__["SymTabImp"](null)
    this.ClassSave = null
  }

  staticPass (INode) {
    this.iNode = INode

    const class_identifier = INode.getChild(0).getValue()

    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.addType(class_identifier)
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ClassTemplates.set(_backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.getType(class_identifier), this.SymTab)
    this.SymTab.setInformation(class_identifier, _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.getType(class_identifier))

    // we set the base class in the stack as the symbol table
    this.ClassSave = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable = this.SymTab

    // we iterate all the children nodes, possible actions are:
    //  1.  Class
    //  2.  Attributes
    //  3.  Function / Procedure
    //  4.  Constructor
    for (const node of INode.getChild(1).getChildren()) {
      const fDecl = new _field_declaration_translator__WEBPACK_IMPORTED_MODULE_5__["FieldDeclarationTranslator"](this)
      fDecl.translate(true, node, true)
    } // fin del for

    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable = this.ClassSave
  }
  // HERE WE ARE GOING TO CUT IT;

  translate () {
    this.ClassSave = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable = this.SymTab

    const fnId = _generators_generator__WEBPACK_IMPORTED_MODULE_6__["Generator"].genFunctionId(this.SymTab.name, this.SymTab.name)
    // we add the info of the constructor
    Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_9__["createDefaultConstructorEntry"])(this.SymTab.name, this.SymTab, fnId)
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].FunctionsCode.push(
      _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateCustomFunction(
        fnId,
        this.createDefaultConstructor()
      )
    )

    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable = this.ClassSave
  }

  createDefaultConstructor (call_parent_constructor = null) {
    const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_6__["Generator"].genTemporary()
    const tmp_helper = _generators_generator__WEBPACK_IMPORTED_MODULE_6__["Generator"].genTemporary()

    let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveHeapPointer(1)
    if (call_parent_constructor == null) { code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign('P', 'H') }
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].unaryAssign('H', tmp)
    if (this.SymTab.getSize() - 1 > 0) { code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveHeapPointer(this.SymTab.getSize() - 1) } // we save all
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment(
      'we save the space needed for all attributes'
    )
    const set = this.SymTab.getAllKeys()
    const eTrans = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_8__["ExpressionTranslator"](this)

    for (const str of set) {
      const array = this.SymTab.getAllSyms(str)

      for (const sym of array) {
        if (sym.getRol() === _compiler_types__WEBPACK_IMPORTED_MODULE_4__["CompilerTypes"].ATTRIBUTE) {
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(
            '+',
            tmp,
            sym.getPosition(),
            tmp_helper
          )
          if (sym.node == null) {
            // value not initialized
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateDefaultAssign(
              true,
              tmp_helper,
              '0'
            )
          } else {
            // value with initial value
            eTrans.translate(sym.node)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateDefaultAssign(
              true,
              tmp_helper,
              eTrans.getTemporary(),
              eTrans.getCode()
            )
          }
        }
      }
    }

    return code
  }
}


/***/ }),

/***/ "./src/backend/translators/classes/type-declaration-translator.js":
/*!************************************************************************!*\
  !*** ./src/backend/translators/classes/type-declaration-translator.js ***!
  \************************************************************************/
/*! exports provided: TypeDeclarationTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TypeDeclarationTranslator", function() { return TypeDeclarationTranslator; });
/* harmony import */ var _translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../translator */ "./src/backend/translators/translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _parser_jsharp__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../parser/jsharp */ "./src/backend/parser/jsharp.js");
/* harmony import */ var _function_declaration_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./function-declaration-translator */ "./src/backend/translators/classes/function-declaration-translator.js");
/* harmony import */ var _special_declaration_translator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./special-declaration-translator */ "./src/backend/translators/classes/special-declaration-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _helpers_base_object__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../helpers/base-object */ "./src/backend/helpers/base-object.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _struct_translator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./struct-translator */ "./src/backend/translators/classes/struct-translator.js");
/* harmony import */ var _field_declaration_translator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./field-declaration-translator */ "./src/backend/translators/classes/field-declaration-translator.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");


// import { ClassTranslator } from './struct-translator'












class TypeDeclarationTranslator extends _translator__WEBPACK_IMPORTED_MODULE_0__["Translator"] {
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
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IMPORTS:
          window.alert('import not working')
          break
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.STRUCT_DECLARATION:
          {
            const struct = new _struct_translator__WEBPACK_IMPORTED_MODULE_10__["StructTranslator"](this)
            struct.staticPass(node)
            struct.translate(node)
          }
          break
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.VAR_DECLARATION_NO_TYPE: {
          const notypedeclaration = new _special_declaration_translator__WEBPACK_IMPORTED_MODULE_5__["SpecialDeclarationTranslator"](this)
          notypedeclaration.translate(true, node)
        }
          break
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.VAR_DECLARATION: {
          const fieldDeclaration = new _field_declaration_translator__WEBPACK_IMPORTED_MODULE_11__["FieldDeclarationTranslator"](this)
          fieldDeclaration.translate(true, node)
        }
          break
        default:
          break
      }
    }
    for (const node of INode.getChildren()) {
      switch (node.getType()) {
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IMPORTS:
          window.alert('import not working')
          break
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.MAIN_DECLARATION:
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.FUNCTION_DECLARATION:
          {
            // then we get the identifier and the type
            const identifier = node.getChild(1).getValue().toLowerCase()
            const voidType = node.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.VOID)
            const funcBody = node.getChild(node.childrenSize() - 1)

            // we check if there are parameters in the function
            const pList = node.lookupByType(
              _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.FORMAL_PARAMETER_LIST
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
                if (fParam.getChild(0).getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.ARRAY) {
                  dimensions = fParam.getChild(0).getChild(1).childrenSize()
                  tParam = this.parseType(fParam.getChild(0).getChild(0).getType())
                  auxType = tParam === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT ? _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.getType(fParam.getChild(0).getChild(0).getValue()) : null
                  if (auxType === -1) { throw Error(`TYPE ${fParam.getChild(0).getValue()} NOT DECLARED ${this.parseSemanticError(this.iNode)}`) }
                  parameters.push([fParam.getChild(1).getValue(), tParam, true, auxType, dimensions])
                  continue
                }
                // hotfix finish

                if (fParam.getChild(0).getType() !== _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IDENTIFIER) { tParam = this.parseType(fParam.getChild(0).getType()) } else {
                  if (_backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.containsKey(fParam.getChild(0).getValue())) {
                    tParam = _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT
                    auxType = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.getType(fParam.getChild(0).getValue())
                  } else { throw Error(`TYPE ${fParam.getChild(0).getValue()} NOT DECLARED ${this.parseSemanticError(this.iNode)}`) }
                }
                // identificador, tipo de parametro, es arreglo, tipo auxiliar, dimensiones
                parameters.push([fParam.getChild(1).getValue(), tParam, (auxType != null || dimensions > 0), auxType, dimensions])
              }
            }

            if (voidType === null) {
              const array_type = node.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.ARRAY)
              const typeN = node.getChild(0)

              let type = null
              let auxType = null
              let dimensions = 0

              if (array_type) {
                type = this.parseType(array_type.getChild(0).getType())
                auxType = type === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT ? _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.getType(array_type.getChild(0).getValue()) : null

                if (auxType === -1) { throw Error(`UNABLE TO FIND THE REQUESTED TYPE ${array_type.getChild(0).getValue()}${this.parseSemanticError(array_type)}`) }

                dimensions = array_type.getChild(1).childrenSize()
              } else if (typeN.getType() !== _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IDENTIFIER) {
                type = this.parseType(typeN.getType())
              } else {
                auxType = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.getType(typeN.getValue())
                type = _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT
              }

              this.Functions.push(
                Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_8__["saveFunctionInSymbolTable"])(
                  identifier,
                  _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].FUNCTION,
                  type,
                  auxType,
                  parameters,
                  funcBody,
                  dimensions
                )
              )
              this.Functions[
                this.Functions.length - 1
              ].functionId = _generators_generator__WEBPACK_IMPORTED_MODULE_9__["Generator"].genFunctionId(
                '',
                identifier
              )

              // TODO: SET VISIBILITY AND MODIFIERS FUNCTIONALITY
            } else {
              this.Functions.push(
                Object(_helpers_base_object__WEBPACK_IMPORTED_MODULE_8__["saveFunctionInSymbolTable"])(
                  identifier,
                  _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].PROCEDURE,
                  _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].VOID,
                  null,
                  parameters,
                  funcBody
                )
              )
              this.Functions[
                this.Functions.length - 1
              ].functionId = _generators_generator__WEBPACK_IMPORTED_MODULE_9__["Generator"].genFunctionId(
                '',
                identifier
              )

              if (identifier === 'principal') {
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

    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].StaticSymbols.push(this.parseStaticVariables())
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ScopeStack.enterEnv()
    for (const sym of this.Functions) {
      const funcDecl = new _function_declaration_translator__WEBPACK_IMPORTED_MODULE_4__["FunctionDeclarationTranslator"](this)
      _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ScopeStack.enterScope()
      _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Display.FunctionCallStack.push([sym.identifier, _generators_generator__WEBPACK_IMPORTED_MODULE_9__["Generator"].getTemporary(), sym.type, sym.auxType, sym.dimensions])
      funcDecl.translate(sym.node, sym)
      _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].FunctionsCode.push(
        _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateCustomFunction(
          sym.functionId,
          funcDecl.getCode()
        )
      )
      _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Display.FunctionCallStack.pop()
      _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ScopeStack.exitScope()
    }

    /* Backend.SymbolTable = this.ClassSave */
    _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ScopeStack.exitEnv()
    if (this.main_identifier === undefined || this.main_identifier === null) {
      _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Errores.push(`NO MAIN METHOD WAS FOUND IN CURRENT ENVIRONMENT${this.parseSemanticError(INode)}`)
      throw Error(`NO MAIN METHOD WAS FOUND IN CURRENT ENVIRONMENT${this.parseSemanticError(INode)}`)
    }
    return this.main_identifier
  }

  lookUpAllMainClasses (INode) {
    for (const node of INode.getChildren()) {
      if (node.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.MAIN_DECLARATION) {
        if (_backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].MainClass.includes(node)) { throw Error(`THERE ARE MULTIPLE MAIN METHODS FOR THIS CLASS DEFINITION ${this.parseSemanticError(node)}`) } else {
          _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].MainClass.push(node)
        }
      }
    }
  }

  lookupAllImports (INode) {
    const imps = []

    for (const node of INode.getChildren()) {
      if (node.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IMPORT) { imps.push(node) }
    }

    return imps
  }

  createSuperTree (INode, files) {
    const imps = INode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IMPORTS)

    try {
      if (imps != null) {
        /**
         * Parse the node and then substitute in main node
         */
        for (const imp of imps.getChildren()) {
          /*
            * IMP ES EL NODO
          */
          const identifier = (imp.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.STRING_LITERAL || imp.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IDENTIFIER) ? imp.getValue() : undefined
          let name = Object.keys(files).find(el => files[el].relative === identifier)
          if (name === undefined) {
            if ((name = Object.keys(files).find(el => files[el].name === identifier)) === undefined) { throw Error(`UNABLE TO FIND THE SPECIFIED FILE ${imp.getValue()}${this.parseSemanticError(imp)}`) }
          }

          if (!files[name].parsed) {
            _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].CurrentFile.push(imp.getValue())
            _parser_jsharp__WEBPACK_IMPORTED_MODULE_3__["jsharp"].parse(files[name].src)
            files[name].parsed = true

            const tTree = _parser_jsharp__WEBPACK_IMPORTED_MODULE_3__["JSharpRoot"]
            const parseImp = new TypeDeclarationTranslator(this)
            parseImp.createSuperTree(tTree, files)
            INode.insertAt(0, tTree.getChildren(), true)
            _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].CurrentFile.pop()
          }
        }
        INode.deleteAt(INode.getPosition(imps))
      }
    } catch (e) {
      // TODO: parse and catch this error
      window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'Parse failed' }))
      if (e.hash !== undefined) {
        let parse = `[${e.hash.token === 'INVALID' ? 'LEXICO' : 'SINTACTICO'} AT LINE ${e.hash.loc.first_line}`
        parse += ` COLUMN ${e.hash.loc.first_column} FOUND ${e.hash.text} EXPECTED: ${e.hash.expected.join(',')}] IN FILE ${_backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].CurrentFile}`
        // window.dispatchEvent(new CustomEvent('error-catched', { detail: [parse] }))
        throw Error(parse)
      } else {
        // window.dispatchEvent(new CustomEvent('error-catched', { detail: [e] }))
        throw e
      }
    }
  }

  parseStaticVariables () {
    const tmpHelper = _generators_generator__WEBPACK_IMPORTED_MODULE_9__["Generator"].genTemporary()
    let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].comment('static var for ')

    const set = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable.getAllKeys()
    const eTrans = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_12__["ExpressionTranslator"](this)

    for (const str of set) {
      const array = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable.getAllSyms(str)

      for (const sym of array) {
        if (sym.getRol() === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].GLOBAL) {
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].unaryAssign(
            sym.getPosition(),
            tmpHelper
          )

          // hotfix for var and global
          if (sym.auxType === _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.getType('var')) {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(
              true,
              tmpHelper,
              sym.getTemporary(),
              sym.getCode()
            )
            continue
          }

          if (sym.node == null) {
            // value not initialized
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(
              true,
              tmpHelper,
              '0'
            )
          } else {
            // value with initial value
            eTrans.translate(sym.node)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].generateDefaultAssign(
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
      const funcDecl = new _function_declaration_translator__WEBPACK_IMPORTED_MODULE_4__["FunctionDeclarationTranslator"](this)
      funcDecl.firstPass(sym.node, sym)
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/arithmetic-translator.js":
/*!*********************************************************************!*\
  !*** ./src/backend/translators/expression/arithmetic-translator.js ***!
  \*********************************************************************/
/*! exports provided: ArithmeticTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArithmeticTranslator", function() { return ArithmeticTranslator; });
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _expression_base_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _helpers_type_checking__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../helpers/type-checking */ "./src/backend/helpers/type-checking.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _statements_variable_assign_stmt_translator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../statements/variable-assign-stmt-translator */ "./src/backend/translators/statements/variable-assign-stmt-translator.js");
/* harmony import */ var _identifier_translator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./identifier-translator */ "./src/backend/translators/expression/identifier-translator.js");
/* harmony import */ var _expression_functions_function_call_translator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../expression/functions/function-call-translator */ "./src/backend/translators/expression/functions/function-call-translator.js");
/* harmony import */ var _expression_functions_constructor_call_translator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../expression/functions/constructor-call-translator */ "./src/backend/translators/expression/functions/constructor-call-translator.js");
/* harmony import */ var _expression_objects_object_access_translator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../expression/objects/object-access-translator */ "./src/backend/translators/expression/objects/object-access-translator.js");
/* harmony import */ var _arrays_array_literal_translator__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./arrays/array-literal-translator */ "./src/backend/translators/expression/arrays/array-literal-translator.js");
/* harmony import */ var _arrays_array_declaration_translator__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./arrays/array-declaration-translator */ "./src/backend/translators/expression/arrays/array-declaration-translator.js");
/* harmony import */ var _arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./arrays/array-access-stmt-translator */ "./src/backend/translators/expression/arrays/array-access-stmt-translator.js");

















var string_one_native_functions = ['tochararray', 'tolowercase', 'touppercase', 'length']
var real_native_functions = ['trunk', 'round']

class ArithmeticTranslator extends _expression_base_translator__WEBPACK_IMPORTED_MODULE_3__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode

    switch (INode.getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.MINUS:
        if (INode.childrenSize() === 1) { this.translateUnaryNumber(this.iNode) } else { this.translateBinaryArithmetic(INode) }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.PLUS:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.MULT:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DIV:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.MOD:
        this.translateBinaryArithmetic(INode)
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.POW: {
        const size = _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable.getSize() + 1
        const eTranslator1 = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)
        const eTranslator2 = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)

        eTranslator1.translate(INode.getChild(0))
        eTranslator2.translate(INode.getChild(1))

        try {
          _helpers_type_checking__WEBPACK_IMPORTED_MODULE_6__["TypeChecking"].PowTypeChecking(eTranslator1.getType(), eTranslator2.getType())
        } catch (e) {
          throw `${e} ${this.parseSemanticError(INode)}`
        }
        this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('llamada a power')
        this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
        this.aux_type = null
        this.dimensions = 0
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE
        this.code += eTranslator1.getCode() + eTranslator2.getCode()
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, size)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, this.temporary)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(this.temporary, eTranslator1.getTemporary())
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', 2, this.temporary)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(this.temporary, eTranslator2.getTemporary())
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_pow')
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, size)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.QUESTION:
        this.translateQuestion(INode)
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.CHARACTER_LITERAL:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.BOOLEAN_LITERAL:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.STRING_LITERAL:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NULL_LITERAL:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DOUBLE_LITERAL:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.INTEGER_LITERAL:
        this.translateConstant(INode)
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.CAST:
        this.translateCast(INode)
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.ARRAY_LITERAL:
        const aLiteral = new _arrays_array_literal_translator__WEBPACK_IMPORTED_MODULE_13__["ArrayLiteralTranslator"](this)
        aLiteral.translate(INode)
        this.aux_type = aLiteral.aux_type
        this.type = aLiteral.type
        this.temporary = aLiteral.temporary
        this.dimensions = aLiteral.dimensions
        this.is_array = aLiteral.is_array
        this.code = aLiteral.code
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NEW_ARRAY:

        this.type = this.parseType(INode.getChild(0).getType())
        this.aux_type = (this.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT) ? _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].Classes.getType(INode.getChild(0).getValue()) : null
        if (this.aux_type === -1) { throw `UNABLE TO FIND THE SPECIFIED TYPE ${INode.getChild(0).getValue()}${this.parseSemanticError(INode.getChild(0))}` }
        this.dimensions = INode.getChild(1).childrenSize()
        this.is_array = true

        if (INode.childrenSize() === 3) {
          const arrLiteral = new _arrays_array_literal_translator__WEBPACK_IMPORTED_MODULE_13__["ArrayLiteralTranslator"](this)
          arrLiteral.translate(INode.getChild(2))

          if (arrLiteral.dimensions !== this.dimensions) { throw 'ARRAY LITERAL DOESN\'T HAVE THE SAME DIMENSIONS AS THE DECLARED ARRAY' }

          if (this.type !== arrLiteral.type || arrLiteral.aux_type !== this.aux_type) { throw `ARRAY LITERAL IS NOT THE SAME VALUE AS DECLARED${this.parseSemanticError(INode)}` }

          this.code = arrLiteral.getCode()
          this.temporary = arrLiteral.temporary
        } else {
          this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('ARRAY DECL NOT INITIALIZED INIT')
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveHeapPointer(1)
          this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].unaryAssign('H', this.temporary)
          this.code += _arrays_array_declaration_translator__WEBPACK_IMPORTED_MODULE_14__["ArrayDeclarationTranslator"].translate(INode.getChild(1).getChildren())
        }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NEW:
        const constructorCall = new _expression_functions_constructor_call_translator__WEBPACK_IMPORTED_MODULE_11__["ConstructorCallTranslator"](this)
        constructorCall.translate(this.iNode)
        this.copyInfo(constructorCall)
        this.aux_type = constructorCall.aux_type
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NATIVE_FUNCTION_CALL:
        this.translateNativeCall(INode)
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.FUNCTION_CALL:
        const fCallTranslator = new _expression_functions_function_call_translator__WEBPACK_IMPORTED_MODULE_10__["FunctionCallTranslator"](this)
        fCallTranslator.translate(INode)
        this.copyInfo(fCallTranslator)
        this.aux_type = fCallTranslator.aux_type
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IDENTIFIER:
        const iTranslator = new _identifier_translator__WEBPACK_IMPORTED_MODULE_9__["IdentifierTranslator"](this)
        iTranslator.translate(INode)
        this.copyInfo(iTranslator)
        this.aux_type = iTranslator.aux_type
        this.position_code = iTranslator.position_code
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DOT: {
        const oAccessTranslator = new _expression_objects_object_access_translator__WEBPACK_IMPORTED_MODULE_12__["ObjectAccessTranslator"](this)
        oAccessTranslator.translate(INode)
        this.copyInfo(oAccessTranslator)
        this.aux_type = oAccessTranslator.aux_type
        this.setCode(oAccessTranslator.access_code)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.ARRAY_ACCESS: {
        const arrayAccessStmtTranslator = new _arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_15__["ArrayAccessStmtTranslator"](this)
        arrayAccessStmtTranslator.translate(INode)
        this.setTemporary(arrayAccessStmtTranslator.temporary)
        this.type = arrayAccessStmtTranslator.type
        this.aux_type = arrayAccessStmtTranslator.aux_type
        this.dimensions = arrayAccessStmtTranslator.dimensions
        this.is_array = arrayAccessStmtTranslator.is_array
        this.code = arrayAccessStmtTranslator.access_code
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.PREDEC:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.PREINC: {
        const plusAction = INode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.PREINC

        switch (INode.getChild(0).getType()) {
          case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IDENTIFIER: {
            const idTrans = new _identifier_translator__WEBPACK_IMPORTED_MODULE_9__["IdentifierTranslator"](this)
            idTrans.translate(INode.getChild(0))
            this.type = idTrans.type
            this.dimensions = idTrans.dimensions
            this.is_array = idTrans.is_array
            let code = idTrans.position_code
            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
            if (idTrans.stack === 1) {
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess(idTrans.getTemporary(), this.temporary)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', this.temporary)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(idTrans.getTemporary(), this.temporary)
              this.setCode(code)
            } else {
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAccess(idTrans.getTemporary(), this.temporary)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', this.temporary)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAssign(idTrans.getTemporary(), this.temporary)
              this.setCode(code)
            }
          }
            break
          case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DOT: {
            const oAccessTrans = new _expression_objects_object_access_translator__WEBPACK_IMPORTED_MODULE_12__["ObjectAccessTranslator"](this)
            oAccessTrans.translate(INode.getChild(0))
            this.type = oAccessTrans.type
            this.dimensions = oAccessTrans.dimensions

            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('dot access') + oAccessTrans.position_code
            this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAccess(oAccessTrans.getTemporary(), this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAssign(oAccessTrans.getTemporary(), this.temporary)
            this.setCode(code)
          }
            break
          case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.ARRAY_ACCESS: {
            const arrayAccessTrans = new _arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_15__["ArrayAccessStmtTranslator"](this)
            arrayAccessTrans.translate(INode.getChild(0))
            this.type = arrayAccessTrans.type
            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('array -- ++') + arrayAccessTrans.position_code
            this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAccess(arrayAccessTrans.getTemporary(), this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAssign(arrayAccessTrans.getTemporary(), this.temporary)
            this.setCode(code)
          }
            break
          default:
            throw Error(`UNABLE TO USE ${plusAction ? '++' : '--'} IN ANYTHING OTHER THAN AN OBJECT, ARRAY ACCESS OR VARIABLE${this.parseSemanticError(INode)}`)
        }
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.EQ: {
        const variableassign = new _statements_variable_assign_stmt_translator__WEBPACK_IMPORTED_MODULE_8__["VariableAssignStmtTranslator"](this)
        variableassign.translate(INode)
        this.code = variableassign.getCode()
        this.temporary = variableassign.getTemporary()
        this.aux_type = variableassign.aux_type
        this.dimensions = variableassign.dimension
        this.is_array = variableassign.is_array
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.POSTDEC:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.POSTINC: {
        const plusAction = INode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.POSTINC

        switch (INode.getChild(0).getType()) {
          case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IDENTIFIER: {
            const idTrans = new _identifier_translator__WEBPACK_IMPORTED_MODULE_9__["IdentifierTranslator"](this)
            idTrans.translate(INode.getChild(0))
            this.type = idTrans.type
            this.dimensions = idTrans.dimensions

            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }

            let code = idTrans.position_code
            const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
            this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
            if (idTrans.stack === 1) {
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess(idTrans.getTemporary(), this.temporary)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', tmp)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(idTrans.getTemporary(), tmp)
              this.setCode(code)
            } else {
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAccess(idTrans.getTemporary(), this.temporary)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', tmp)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAssign(idTrans.getTemporary(), tmp)
              this.setCode(code)
            }
          }
            break
          case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DOT: {
            const oAccessTrans = new _expression_objects_object_access_translator__WEBPACK_IMPORTED_MODULE_12__["ObjectAccessTranslator"](this)
            oAccessTrans.translate(INode.getChild(0))
            this.type = oAccessTrans.type
            this.dimensions = oAccessTrans.dimensions

            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }

            let code = oAccessTrans.position_code
            const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
            this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAccess(oAccessTrans.getTemporary(), this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', tmp)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAssign(oAccessTrans.getTemporary(), tmp)
            this.setCode(code)
          }
            break
          case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.ARRAY_ACCESS: {
            const arrayAccessTrans = new _arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_15__["ArrayAccessStmtTranslator"](this)
            arrayAccessTrans.translate(INode.getChild(0))
            this.type = arrayAccessTrans.type
            this.dimensions = arrayAccessTrans.dimensions

            if (this.dimensions !== 0) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }
            if (this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE && this.type !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
              throw Error(`UNABLE TO USE THIS OPERATOR IN ANYTHING OTHER THAN NUMERIC TYPE${this.parseSemanticError(INode)}`)
            }

            let code = arrayAccessTrans.position_code
            const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
            this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAccess(arrayAccessTrans.getTemporary(), this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(plusAction ? '+' : '-', this.temporary, '1', tmp)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAssign(arrayAccessTrans.getTemporary(), tmp)
            this.setCode(code)
          }
            break
          default:
            throw Error(`UNABLE TO USE ${plusAction ? '++' : '--'} IN ANYTHING OTHER THAN AN OBJECT, ARRAY ACCESS OR VARIABLE${this.parseSemanticError(INode)}`)
        }
      }
        break
    }
  }

  translateBinaryArithmetic (INode) {
    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)

    const leftTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)
    const rightTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)

    leftTranslator.translate(leftNode)
    rightTranslator.translate(rightNode)

    try {
      this.type = _helpers_type_checking__WEBPACK_IMPORTED_MODULE_6__["TypeChecking"].ExpressionTypeChecking(INode.getType(), leftTranslator.getType(),
        rightTranslator.getType())

      // here we check the sum of strings and the conversion
    } catch (e) {
      throw Error(`${e}${this.parseSemanticError(this.iNode)}`)
    }

    if (this.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].STRING) {
      this.aux_type = null
      this.dimensions = 0
      this.is_array = false

      const ct = (leftTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].STRING) ? rightTranslator.getType() : leftTranslator.getType()
      const left = ct === leftTranslator.getType()

      let code = `${leftTranslator.getCode()} ${rightTranslator.getCode()}`
      this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
      const current_size = _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable.getSize() + 1 // get the current env stack size
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('native calls to concatenate strings')
      // TODO: add real and integer values
      switch (ct) {
        case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR: {
          const tmp_helper = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          const tmp_helper_2 = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, current_size) // here goes the current stack or method
          // size
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', 'P', tmp_helper)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_char_to_string\n')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess('P', tmp_helper_2) // aqui ya tenemos el let

          // here we have to check if the other type is the left or the right
          if (left) {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, tmp_helper_2)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, tmp_helper_2)
          }

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_concat_strings')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, current_size)
        }
          break
        case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE: {
          const tmp_helper = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          const tmp_helper_2 = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, current_size) // here goes the current stack or method
          // size

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', 'P', tmp_helper)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_real_to_string')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess('P', tmp_helper_2)

          if (left) {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, tmp_helper_2)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, tmp_helper_2)
          }

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_concat_strings')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, current_size)
        }
          break
        case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER: {
          const tmp_helper = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary(); const tmp_helper_2 = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, current_size) // here goes the current stack or method
          // size

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', 'P', tmp_helper)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_int_to_string')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess('P', tmp_helper_2)

          if (left) {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, tmp_helper_2)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, tmp_helper_2)
          }

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_concat_strings')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, current_size)
        }
          break
        case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].STRING: {
          const tmp_helper = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, current_size) // here goes the current stack or method
          // size
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp_helper)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, leftTranslator.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, rightTranslator.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_concat_strings')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, current_size)
        }
          break
        case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].BOOLEAN: {
          const tmp_helper = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary(); const tmp_helper_2 = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, current_size) // here goes the current stack or method
          // size

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', 'P', tmp_helper)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_boolean_to_string')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess('P', tmp_helper_2)

          if (left) {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, tmp_helper_2)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmp_helper, tmp_helper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp_helper, tmp_helper_2)
          }

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_concat_strings')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, current_size)
        }
          break
        case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT: {
          const tmpHelper = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary(); const tmpHelper2 = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, current_size) // here goes the current stack or method
          // size

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', 'P', tmpHelper)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmpHelper,
            (left) ? leftTranslator.getTemporary() : rightTranslator.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('default_object_to_string')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess('P', tmpHelper2)

          if (left) {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmpHelper, tmpHelper2)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmpHelper, tmpHelper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmpHelper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
          } else {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmpHelper,
              (left) ? rightTranslator.getTemporary() : leftTranslator.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', '1', tmpHelper, tmpHelper)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmpHelper, tmpHelper2)
          }

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_concat_strings')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, current_size)
        }
      }

      this.setCode(code)
      return
    }

    // the code for sum is + , left_par, right_par, temporary
    this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
    let code = `${leftTranslator.getCode() == null ? '' : leftTranslator.getCode()}${rightTranslator.getCode() == null ? '' : rightTranslator.getCode()}`
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation(this.getArithmeticOp(INode), leftTranslator.getTemporary(),
      rightTranslator.getTemporary(), this.temporary)

    this.setCode(code)
    // if not working comment
    this.aux_type = null
    this.dimensions = 0
    this.is_array = null
  }

  /**
     *
     * @param INode : the node that holds the current value
     */
  translateConstant (INode) {
    this.iNode = INode

    switch (INode.getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.CHARACTER_LITERAL:
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR
        this.temporary = INode.getValue().length === 2 ? 0 : INode.getValue().charCodeAt(1)
        this.setCode('')
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.BOOLEAN_LITERAL:
        this.setCode('')
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].BOOLEAN
        this.temporary = (INode.getValue()) ? '1' : '0'
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.STRING_LITERAL:
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].STRING
        let str = INode.getValue().toString()
        str = str.replace(/\\\'/g, "\'")
          .replace(/\\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\r/g, '\r')
        this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary() // HOTFIX: <= THIS CAN BE CHANGED TO A STACK POINTER
        let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveHeapPointer(1)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].unaryAssign('H', this.temporary)
        code += this.translateString(str)
        this.setCode(code)
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NULL_LITERAL:
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT
        this.aux_type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].NULL
        this.temporary = '0'
        this.position_code = ''
        this.setCode(_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('null type'))
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DOUBLE_LITERAL:
        this.temporary = INode.getValue().toString()
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE
        this.setCode('')
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.INTEGER_LITERAL:
        this.temporary = INode.getValue().toString()
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER
        this.setCode('')
        break
    }
  }

  /**
     *
     * @param INode : the INode to get the info from
     * @return : the arithmetic operator
     */
  getArithmeticOp (INode) {
    switch (INode.getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.PLUS:
        return '+'
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.MINUS:
        return '-'
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.MULT:
        return '*'
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.MOD:
        return '%'
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DIV:
        return '/'
    }
  }

  translateString (raw) {
    let str = ''
    for (let i = 0; i < raw.length; i++) {
      // asignación de la variable ascii en la posición de memoria
      str += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAssign('H', raw.charCodeAt(i))
      // aumento de la posición de memoria
      str += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveHeapPointer(1)
    }
    // asignación de fin de cadena
    str += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAssign('H', '0')
    return str
  }

  translateNativeCall (INode) {
    // SymTab current = Backend.SymbolTable;

    const id = INode.getChild(0).getValue()
    const pList = INode.getChild(1)
    switch (id) {
      case 'print':
      case 'println': {
        let code = ''

        if (pList == null) {
          code += (id === 'println') ? (_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', '10') + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', '13')) : ''
          this.setCode(code)
          return
        }

        for (const pNode of pList.getChildren()) {
          const expressionTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)
          expressionTranslator.translate(pNode)

          if (expressionTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER) {
            code += expressionTranslator.getCode()
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%i', expressionTranslator.getTemporary())
          } else if (expressionTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE) {
            code += expressionTranslator.getCode()
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%d', expressionTranslator.getTemporary())
          } else if (expressionTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].STRING) {
            // obtenemos el symtab y cuánto debemos levantarlo
            const currSymTab = _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable
            const size = currSymTab.getSize() + 1
            const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

            code += expressionTranslator.getCode() // it gets the expression code
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, size) // stack pointer
            // code +=
            // TranslatorHelpers.generateTmpStackSave(currSymTab.getInitialTemporary(),
            // Generator.getTemporary()-1); //save all the current temporary
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp, expressionTranslator.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_print_string')
            // code +=
            // TranslatorHelpers.generateTmpStackRecover(currSymTab.getInitialTemporary(),
            // Generator.getTemporary()-1); //save all the current temporary
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, size)
          } else if (expressionTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
            code += expressionTranslator.getCode() // it gets the expression code
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', expressionTranslator.getTemporary())
          } else if (expressionTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].BOOLEAN) {
            const currSymTab = _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable
            const size = currSymTab.getSize() + 1
            const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
            code += expressionTranslator.getCode() // it gets the expression code
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, size) // stack pointer
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(tmp, expressionTranslator.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_print_boolean')
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, size)
          } else {
            // TODO: pending for null
            if (expressionTranslator.is_array) {
              code += expressionTranslator.getCode() // it gets the expression code
              const label = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel()
              const label_out = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel()
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].conditionalJMP('!=', expressionTranslator.temporary, 0, label)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 110)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 117)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 108)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 108)
              _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].inconditionalJMP(label_out)
              _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateLabel(label)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 65)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 114)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 114)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 97)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 121)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 64)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%i', expressionTranslator.temporary)
              _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateLabel(label_out)
            } else if (expressionTranslator.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT) {
              code += expressionTranslator.getCode() // it gets the expression code
              const label = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel()
              const labelOut = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel()
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('printing object')
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].conditionalJMP('!=', expressionTranslator.temporary, 0, label)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 110)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 117)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 108)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 108)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].inconditionalJMP(labelOut)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateLabel(label)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 79)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 98)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 106)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 101)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 99)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 116)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', 64)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%i', expressionTranslator.temporary)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateLabel(labelOut)
            }
          }
        }
        code += (id === 'println')
          ? (_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', '10') + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].printStmt('%c', '13'))
          : ''
        this.setCode(code)
      }
        break
    }

    // throw new Exception("PARAMETERS TYPES DOESN'T MATCH WITH THE DESIRED FUNCTION
    // " + id.toUpperCase());
  }

  getNativeType (id) {
    switch (id) {
      case 'write_file':
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].VOID
        // tipo real
      case 'equals':
        return _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].BOOLEAN
    }

    return null
  }

  translateUnaryNumber (iNode) {
    // all we need to do is check types
    // and then do 0 - t0
    const unaryTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)
    unaryTranslator.translate(iNode.getChild(0))
    if (unaryTranslator.getType() != _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER && unaryTranslator.getType() != _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE) {
      throw Error(`UNABLE TO USE (-) WITH ${_ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].names[unaryTranslator.getType()]}${this.parseSemanticError(this.iNode)}`)
    }
    this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
    let code = `${unaryTranslator.getCode()}`
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('-', '0', unaryTranslator.getTemporary(), this.getTemporary())
    this.setCode(code)
    this.type = unaryTranslator.getType()
  }

  translateQuestion (INode) {
    const labels = [_generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel(), _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel(), _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel()]
    this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

    const ct = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)
    ct.translate(INode.getChild(0))

    if (ct.getType() !== _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].BOOLEAN) { throw Error(`FIRST PARAMETER IN TERNARY OPERATOR IS NOT OF TYPE BOOLEAN ${this.parseSemanticError(INode)}`) }

    const thenP = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this); const elseP = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)

    thenP.translate(INode.getChild(1))
    elseP.translate(INode.getChild(2))

    if (thenP.getType() !== elseP.getType() && thenP.getAuxType() !== elseP.getAuxType()) { throw Error(`TYPES IN TERNARY OPERATOR ARE NOT THE SAME ${this.parseSemanticError(INode)}`) }

    this.aux_type = thenP.aux_type
    this.type = thenP.type

    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('question code')
    this.code += ct.getCode()
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].conditionalJMP('==', ct.getTemporary(), '1', labels[0])
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].inconditionalJMP(labels[1])
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateLabel(labels[0])
    this.code += thenP.getCode()
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].unaryAssign(thenP.getTemporary(), this.temporary)
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].inconditionalJMP(labels[2])
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateLabel(labels[1])
    this.code += elseP.getCode()
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].unaryAssign(elseP.getTemporary(), this.temporary)
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateLabel(labels[2])
  }

  translateCast (INode) {
    const rhs = new _expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)
    rhs.translate(INode.getChild(1))

    // WE CHECK THE INFORMATION
    // The possibles cast types are double - char - int and my guess is object
    const requestedType = this.parseType(INode.getChild(0).getType())

    // hot fix for var and global
    if (rhs.aux_type === _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].Classes.getType('var')) {
      this.copyInfo(rhs)
      if (requestedType === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT) {
        const objType = _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].Classes.getType(INode.getChild(0).getValue())
        this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('object cast var') + rhs.getCode()
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateInvalidCastError(rhs.temporary, objType, _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].ErrorsLabels.get('invalidcast'))
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('var value access') + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAccess(rhs.temporary, rhs.temporary)
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT
        this.aux_type = objType
        this.dimensions = 0
        this.temporary = rhs.temporary
      } else {
        // this means parsed type is primitive
        this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('primitive cast var') + rhs.getCode()
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateInvalidCastError(rhs.temporary, requestedType, _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].ErrorsLabels.get('invalidcast'))
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('var value access') + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateHeapAccess(rhs.temporary, rhs.temporary)
        this.type = requestedType
        this.aux_type = null
        this.dimensions = 0
        this.temporary = rhs.temporary
      }
      return
    }

    switch (requestedType) {
      case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER:
      {
        if (rhs.is_array) { throw Error(`UNABLE TO PARSE TYPE ARRAY TO PRIMITIVE${this.parseSemanticError(INode)}`) }
        if (rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER) {
          this.copyInfo(rhs)
          return
        } else if (rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
          this.copyInfo(rhs)
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER
          return
        } else if (rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE) {
          this.copyInfo(rhs)
          /**
                         * CALL TO TRUNK
                         */
          this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('calling trunk')
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable.size + 1)
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, this.temporary)
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(this.temporary, rhs.temporary)
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_trunk')
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable.size + 1)
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER
          // fin conversion
          return
        } else { throw Error(`UNABLE TO PERFORM CAST WITH VALUES INTEGER AND ${_compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypesNames"][rhs.getType()]}${this.parseSemanticError(this.iNode)}`) }
      }
      case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR: {
        if (rhs.is_array) { throw Error(`UNABLE TO PARSE TYPE ARRAY TO PRIMITIVE${this.parseSemanticError(INode)}`) }
        if (rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
          this.copyInfo(rhs)
          return
        } else if (rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER) {
          this.copyInfo(rhs)
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR
          return
        } else if (rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE) {
          this.copyInfo(rhs)
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR
          this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].comment('calling trunk')
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(true, _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable.size + 1)
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, this.temporary)
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAssign(this.temporary, rhs.temporary)
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].functionCall('native_java_trunk')
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_7__["TranslatorHelpers"].moveStackPointer(false, _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].SymbolTable.size + 1)
          return
        } else { throw Error(`UNABLE TO PERFORM CAST WITH VALUES CHAR AND ${_compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypesNames"][rhs.getType()]}${this.parseSemanticError(this.iNode)}`) }
      }
      case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE: {
        if (rhs.is_array) { throw Error(`UNABLE TO PARSE TYPE ARRAY TO PRIMITIVE${this.parseSemanticError(INode)}`) }
        if (rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].INTEGER || rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE || rhs.type === _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].CHAR) {
          this.copyInfo(rhs)
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].DOUBLE
          return
        } else { throw Error(`UNABLE TO PERFORM CAST WITH VALUES DOUBLE AND ${_compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypesNames"][rhs.getType()]}${this.parseSemanticError(this.iNode)}`) }
      }
      case _compiler_types__WEBPACK_IMPORTED_MODULE_2__["CompilerTypes"].OBJECT: {
        if (INode.getChild(0).getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.ARRAY) { throw Error(`UNABLE TO CAST ARRAY TYPE DONT KNOW HOW TO CAST${this.parseSemanticError(INode)}`) }
        const objType = _backend__WEBPACK_IMPORTED_MODULE_0__["Backend"].Classes.getType(INode.getChild(0).getValue())
        if (objType === -1) { throw Error(`UNABLE TO FIND CLASS TYPE ${INode.getChild(0).getValue()}${this.parseSemanticError(INode)}`) }
        if (objType === rhs.aux_type) {
          this.copyInfo(rhs)
        } else {
          throw Error(`UNABLE TO CAST BETWEEN OBJECT TYPES${this.parseSemanticError(INode)}`)
        }
      }
        break
      default:
        throw Error(`INVALID CAST EXCEPTION${INode.getChild(0).getValue()}${this.parseSemanticError(INode)}`)
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/arrays/array-access-stmt-translator.js":
/*!***********************************************************************************!*\
  !*** ./src/backend/translators/expression/arrays/array-access-stmt-translator.js ***!
  \***********************************************************************************/
/*! exports provided: ArrayAccessStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrayAccessStmtTranslator", function() { return ArrayAccessStmtTranslator; });
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../expression/expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _identifier_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../identifier-translator */ "./src/backend/translators/expression/identifier-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _objects_object_access_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../objects/object-access-translator */ "./src/backend/translators/expression/objects/object-access-translator.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../backend */ "./src/backend/backend.js");
/* harmony import */ var _functions_function_call_translator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../functions/function-call-translator */ "./src/backend/translators/expression/functions/function-call-translator.js");










class ArrayAccessStmtTranslator extends _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
    this.position_code = ''
    this.access_code = ''
  }

  translate (INode /* , SymTabImp symbols */) {
    this.iNode = INode
    const tHelper = _generators_generator__WEBPACK_IMPORTED_MODULE_6__["Generator"].genTemporary()
    /**
         * There are only three possibilities to access in this function, one is the id,
         *      1. DOT          done
         *      2. FUNCTION     done
         *      3. IDENTIFIER   done
         */

    const left_node = INode.getChild(0)

    // now we have all the parameters, we just need to move the array in
    // lexicographic mode

    if (left_node.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.DOT) {
      const oAccessTranslator = new _objects_object_access_translator__WEBPACK_IMPORTED_MODULE_4__["ObjectAccessTranslator"](this)
      oAccessTranslator.translate(left_node)

      // so now i have the the symbol that represents the array since i already have
      // the position
      // this.code += oAccessTranslator.position_code;
      // it is an attribute so we procede with the temporary value it brings

      this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].comment('ARRAY ACCESS OBJECT ACCESS')
      this.code += oAccessTranslator.access_code

      // we get the temporary to access the data
      this.temporary = oAccessTranslator.temporary
      const eList = this.fillParameterList(INode)

      for (let j = 0; j < eList.length; j++) {
        this.code += eList[j].code
        // generate the arithmetic size checking
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].generateHeapAccess(this.temporary, tHelper)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].comment('IOB')
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].conditionalJMP('>=', eList[j].temporary, tHelper, _backend__WEBPACK_IMPORTED_MODULE_7__["Backend"].ErrorsLabels.get('indexoutofbounds'))
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, '1', this.temporary)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, eList[j].temporary, this.temporary)

        if (j === eList.length - 1) {
          this.position_code = this.code + ''
        }
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
        this.access_code = this.code
      }

      /**
             * WE RETURN ALL THE DATA INFO
            */

      this.dimensions = (oAccessTranslator.dimensions == eList.length) ? 0 : (oAccessTranslator.dimensions - eList.length)
      this.is_array = oAccessTranslator.dimensions != eList.length
      this.aux_type = oAccessTranslator.aux_type
      this.type = oAccessTranslator.type
    } else if (left_node.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.IDENTIFIER) {
      const idTrans = new _identifier_translator__WEBPACK_IMPORTED_MODULE_2__["IdentifierTranslator"](this)
      idTrans.translate(left_node)

      if (!idTrans.is_array) { throw `LEFT HAND SIDE IS NOT OF TYPE ARRAY ${left_node.getValue()}${this.parseSemanticError(left_node)}` }

      if (idTrans.dimensions < this.iNode.childrenSize() - 1) { throw `CAN'T ACCESS THE ARRAY, REQUESTED DIMENSIONS ARE BIGGER THAN DEFINED${this.parseSemanticError(this.iNode)}` }

      this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].comment('ARRAY ACCESS IDENTIFIER')
      this.code += idTrans.code

      // we get the temporary to access the data
      this.temporary = idTrans.temporary
      const eList = this.fillParameterList(INode)

      for (let j = 0; j < eList.length; j++) {
        this.code += eList[j].code
        // generate the arithmetic size checking
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].generateHeapAccess(this.temporary, tHelper)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].conditionalJMP('>=', eList[j].temporary, tHelper, _backend__WEBPACK_IMPORTED_MODULE_7__["Backend"].ErrorsLabels.get('indexoutofbounds'))
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, '1', this.temporary)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, eList[j].temporary, this.temporary)

        if (j === eList.length - 1) {
          this.position_code = this.code + ''
        }
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
        this.access_code = this.code
      }

      /**
             * WE RETURN ALL THE DATA INFO
            */

      this.dimensions = (idTrans.dimensions == eList.length) ? 0 : (idTrans.dimensions - eList.length)
      this.is_array = idTrans.dimensions != eList.length
      this.aux_type = idTrans.aux_type
      this.type = idTrans.type
    } else if (left_node.getType() == _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.FUNCTION_CALL) {
      const funcCall = new _functions_function_call_translator__WEBPACK_IMPORTED_MODULE_8__["FunctionCallTranslator"](this)
      funcCall.translate(left_node)

      if (!funcCall.is_array) { throw `LEFT HAND SIDE FUNCTION CALL IS NOT OF TYPE ARRAY ${left_node.getValue()}${this.parseSemanticError(left_node)}` }

      if (funcCall.dimensions < this.iNode.childrenSize() - 1) { throw `CAN'T ACCESS THE ARRAY, REQUESTED DIMENSIONS ARE BIGGER THAN DEFINED${this.parseSemanticError(this.iNode)}` }

      this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].comment('ARRAY ACCESS FROM FUNCTION CALL')
      this.code += funcCall.code

      // we get the temporary to access the data
      this.temporary = funcCall.temporary
      const eList = this.fillParameterList(INode)

      for (let j = 0; j < eList.length; j++) {
        this.code += eList[j].code
        // generate the arithmetic size checking
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].generateHeapAccess(this.temporary, tHelper)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].conditionalJMP('>=', eList[j].temporary, tHelper, _backend__WEBPACK_IMPORTED_MODULE_7__["Backend"].ErrorsLabels.get('indexoutofbounds'))
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, '1', this.temporary)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, eList[j].temporary, this.temporary)

        if (j === eList.length - 1) {
          this.position_code = this.code + ''
        }
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
        this.access_code = this.code
      }

      /**
             * WE RETURN ALL THE DATA INFO
            */

      this.dimensions = (funcCall.dimensions == eList.length) ? 0 : (funcCall.dimensions - eList.length)
      this.is_array = funcCall.dimensions != eList.length
      this.aux_type = funcCall.aux_type
      this.type = funcCall.type
    } else { throw `UNABLE TO ACCESS A VARIABLE THAT IS NOT OF TYPE ARRAY ${this.parseSemanticError(INode)}` }
  }

  fillParameterList (iNode) {
    const eList = []

    for (let i = 1; i < iNode.childrenSize(); i++) {
      if (iNode.getChild(i).getType() == _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.EXPRESSION_LIST) {
        for (const eNode of iNode.getChild(i).getChildren()) {
          const eTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_5__["ExpressionTranslator"](this)
          eTranslator.translate(eNode)
          eList.add(eTranslator)
        }
      } else {
        const eTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_5__["ExpressionTranslator"](this)
        eTranslator.translate(iNode.getChild(i))
        eList.push(eTranslator)
      }
    }

    return eList
  }

  getCode () {
    return this.access_code
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/arrays/array-declaration-translator.js":
/*!***********************************************************************************!*\
  !*** ./src/backend/translators/expression/arrays/array-declaration-translator.js ***!
  \***********************************************************************************/
/*! exports provided: ArrayDeclarationTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrayDeclarationTranslator", function() { return ArrayDeclarationTranslator; });
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");




class ArrayTypeTranslator {

    translate(dims) {

        let code = "";

        /**
         * The current variables display the next roles
         *      1. eTranslator evaluates the dimension
         *      2. currCx is the counter we are iterating trough
         *      3. lastCx the last counter so we multiply by it
         *      4. address the current address we are saving at
         *      5. temporaryCx the counter for each new array dim
         */
        let eTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this);
        let currCX = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), lastCX = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), address = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
            lastAddress = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(), temporaryCX = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary(),
            tmpLastCX = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary();

        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign("1", lastCX);

        for (let i = 0; i < dims.length; i++) {

            eTranslator.translate(dims[i].getChild(0));
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment(`Limites de vector ${i}`);
            code += eTranslator.getCode();
            /*
             * THIS PART IS FOR EVERYTHING
             */
            if (i == 0) {

                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign("H", address);
                code += this.vectorTranslator("H", currCX, eTranslator.temporary, null);

            } else {
                // we create a temporary to store the last address, i.e. the adress where we
                // will save
                // the information of the new array. this will we updated inside the loop

                // we create a temporary counter
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment("ronda" + i + "\n");
                // code += TranslatorHelpers.moveHeapPointer(1);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign(address, lastAddress);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment("last adrress \n");
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation("+", "1", "H", address);

                let fLoopLabelIn = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), fLoopLabelOut = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(),
                    sLoopLabelIn = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(), sLoopLabelOut = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel(),
                    tmpCX = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genTemporary();

                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign(lastCX, tmpLastCX);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(fLoopLabelIn);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].conditionalJMP("==", tmpLastCX, "0", fLoopLabelOut);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation("+", lastAddress, "1", lastAddress);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment("Aqui se asigna el contador actual al temporal\n");
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign(currCX, tmpCX);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(sLoopLabelIn);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].conditionalJMP("==", tmpCX, "0", sLoopLabelOut);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].moveHeapPointer(1);
                code += this.vectorTranslator("H", temporaryCX, eTranslator.temporary, lastAddress);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation("+", lastAddress, "1", lastAddress);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation("-", tmpCX, "1", tmpCX);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(sLoopLabelIn);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(sLoopLabelOut);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation("-", tmpLastCX, "1", tmpLastCX);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(fLoopLabelIn);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(fLoopLabelOut);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation("*", lastCX, currCX, lastCX);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign(temporaryCX, currCX);
                code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment("ULTIMA LINEA DE RONDA " + i + " \n");
            }
        }

        return code;

    }

    vectorTranslator(pHelper, currCX, maxT, vPos) {

        let code = "";

        /**
         * 0. El apuntador actual ya se encuentra en la posición de inicio -----------
         * 1. Coloca el mínimo en el heap --------------------------------------------
         * 2. Coloca el tamaño en la siguiente posición al mínimo --------------------
         * 3. Si hay un VPos (osea no es sólo una dim), guarda el h en esa pos -------
         * 4. Mueve el apuntador
         */
        if (vPos != null)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateHeapAssign(vPos, "H");

        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign(maxT, currCX);
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateHeapAssign(pHelper, currCX);
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation("+", "H", currCX, "H");
        return code;
    }
}

const ArrayDeclarationTranslator = new ArrayTypeTranslator();

/***/ }),

/***/ "./src/backend/translators/expression/arrays/array-literal-translator.js":
/*!*******************************************************************************!*\
  !*** ./src/backend/translators/expression/arrays/array-literal-translator.js ***!
  \*******************************************************************************/
/*! exports provided: ArrayLiteralTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrayLiteralTranslator", function() { return ArrayLiteralTranslator; });
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../expression/expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../expression-translator */ "./src/backend/translators/expression/expression-translator.js");







class ArrayLiteralTranslator extends _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_2__["ExpressionBaseTranslator"] {

  constructor(parent) {
    super(parent);
    this.position_code = "";
    this.access_code = "";
    this.symtab = null;
    this.symbol = null;
  }

  translate(INode /* , SymTabImp symbols */) {
    this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genTemporary();
    let tHelper = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genTemporary();

    this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('array initialization');
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].moveHeapPointer(1);
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].unaryAssign("H", this.temporary);
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAssign(this.temporary, INode.childrenSize());
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].moveHeapPointer(INode.childrenSize());

    /**
     * THERE ARE ONLY TWO CASES
     *    1. ARRAY LITERAL
     *    2. LITERAL
     *    3. NEW
     */
    let type = INode.getChild(0).getType();
    let eValues = [];
    let eTranslator = null;

    for (let node of INode.getChildren()) {

      if (node.getType() != type)
        throw `TYPES IN THE ARRAY LITERAL INITIALIZATION ARE NOT THE SAME, UNABLE TO CONTINUE ${this.parseSemanticError(node)}`;

      eTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_5__["ExpressionTranslator"](this);
      eTranslator.translate(node);

      eValues.push(eTranslator);

    }

    this.type = eValues[0].getType();
    this.aux_type = eValues[0].getAuxType();
    let dims = eValues[0].dimensions;
    let is_array = eValues[0].is_array;

    for (let i = 1; i < eValues.length; i++)
      if (this.type != eValues[i].getType() || this.aux_type != eValues[i].getAuxType()
        || dims != eValues[1].dimensions || is_array != eValues[i].is_array)
        throw `TYPES IN THE ARRAY LITERAL INITIALIZATION ARE NOT THE SAME, UNABLE TO CONTINUE ${this.parseSemanticError(node)}`;

    /** starting the assign code using the temporary */
    this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation("+", this.temporary, 1, tHelper);

    for (let j = 0; j < eValues.length; j++) {
      this.code += eValues[j].getCode();
      this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAssign(tHelper, eValues[j].temporary);
      if (j != eValues.length - 1)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation("+", tHelper, 1, tHelper);
    }

    this.is_array = true;
    this.dimensions = 1 + eValues[0].dimensions;

  }
}

/***/ }),

/***/ "./src/backend/translators/expression/conditional-translator.js":
/*!**********************************************************************!*\
  !*** ./src/backend/translators/expression/conditional-translator.js ***!
  \**********************************************************************/
/*! exports provided: ConditionalTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConditionalTranslator", function() { return ConditionalTranslator; });
/* harmony import */ var _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _relational_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./relational-translator */ "./src/backend/translators/expression/relational-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");








class ConditionalTranslator extends _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
    this.assignCode = false
    this.fromCondition = false
  }

  translate (INode) {
    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)

    const b1 = new _expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this); const b2 = new _expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)

    // TODO: TYPECHECKING OF RETURNED EXPRESSION

    const flag = this.false_label == null && this.true_label == null
    // we add the labels if not existant so do we have the operation itself working

    if (flag) {
      switch (INode.getType()) {
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.OROR:
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.NOT:
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.ANDAND:
        case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.XOR:
          this.setBooleanLabels(_generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel(), _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
          this.assignCode = true
      }
    }

    switch (INode.getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.OROR: {
        b1.setTrueLabel(this.true_label)
        b1.setFalseLabel(_generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
        b2.setTrueLabel(this.true_label)
        b2.setFalseLabel(this.false_label)

        b1.translate(leftNode)
        b2.translate(rightNode)

        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].BOOLEAN
        this.setCode(`${b1.getCode()} ${b1.false_label}:\n ${b2.getCode()}`)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.ANDAND: {
        b1.setTrueLabel(_generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
        b1.setFalseLabel(this.false_label)
        b2.setTrueLabel(this.true_label)
        b2.setFalseLabel(this.false_label)

        b1.translate(leftNode)
        b2.translate(rightNode)

        // check if there is actually a boolean
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].BOOLEAN
        this.setCode(`${b1.getCode()}${b1.true_label}:\n${b2.getCode()}`)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.NOT: {
        b1.setTrueLabel(this.false_label)
        b1.setFalseLabel(this.true_label)

        b1.translate(leftNode)
        // this.temporary = b1.temporary;
        this.setCode(b1.getCode())
        this.type = b1.getType()
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.XOR: {
        b1.setTrueLabel(_generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
        b1.setFalseLabel(_generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
        b1.translate(leftNode)

        b2.setTrueLabel(this.false_label)
        b2.setFalseLabel(this.true_label)
        b2.translate(rightNode)
        let codeXOR = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].comment('xor begin') + `${b1.getCode()}${b1.true_label}:\n${b2.getCode()}${b1.false_label}:\n`
        b2.setTrueLabel(this.true_label)
        b2.setFalseLabel(this.false_label)
        b2.translate(rightNode)
        codeXOR += b2.getCode()
        this.setCode(codeXOR)
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].BOOLEAN
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_5__["tree_types"].types.BOOLEAN_LITERAL: {
        if (this.true_label != null) {
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].BOOLEAN
          this.setCode(_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"]
            .inconditionalJMP(INode.getValue() ? this.true_label : this.false_label))
        } else {
          this.temporary = (INode.getValue() ? '1' : '0')
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].BOOLEAN
          this.setCode('')
        }
      }
        break
      default: {
        const rt = new _relational_translator__WEBPACK_IMPORTED_MODULE_4__["RelationalTranslator"](this)
        this.copyLabels(rt)
        rt.translate(INode)
        this.setTemporary(rt.getTemporary())

        if (rt.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_3__["CompilerTypes"].BOOLEAN) {
          let code = rt.getCode()
          if (!flag) {
            // hotfix here
            if (!(rt.getCode().includes(this.true_label) || rt.getCode().includes(this.false_label))) {
              code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].comment('si trae flags y es un booleano no normal') + code
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].conditionalJMP('==', this.temporary, '1', this.true_label)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].inconditionalJMP(this.false_label)
              this.setCode(code)
            } else {
              this.setCode(_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].comment('si trae flags y es booleano operación ') + code)
            }
          } else {
            if (rt.true_label === null && rt.false_label === null && rt.dimensions === 0) {
              if (this.true_label == null && this.false_label == null) {
                this.setBooleanLabels(_generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel(), _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel())
              }

              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].comment('no trae el true y false')
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].conditionalJMP('==', rt.getTemporary(), '1', this.true_label)
              code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].inconditionalJMP(this.false_label)
              this.assignCode = true
              this.setCode(code)
            } else {
              this.setCode(_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_6__["TranslatorHelpers"].comment('true false seteadas en relational') + code)
            }
          }
        } else {
          this.setCode(rt.getCode())
          this.position_code = rt.position_code
        }

        this.type = rt.getType()
        this.aux_type = rt.aux_type
        this.dimensions = rt.dimensions
        this.is_array = rt.is_array
        this.position_code = rt.position_code
      }

        break
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/expression-base-translator.js":
/*!**************************************************************************!*\
  !*** ./src/backend/translators/expression/expression-base-translator.js ***!
  \**************************************************************************/
/*! exports provided: ExpressionBaseTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpressionBaseTranslator", function() { return ExpressionBaseTranslator; });
/* harmony import */ var _translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../translator */ "./src/backend/translators/translator.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");




class ExpressionBaseTranslator extends _translator__WEBPACK_IMPORTED_MODULE_0__["Translator"] {
  constructor (translator) {
    super(translator)
    this.type = null
    this.aux_type = null
    this.temporary = null
    this.true_label = null
    this.false_label = null
    this.is_array = false
    this.dimensions = 0
  }

  /**
     *
     * @return : return the last value of the temporary
     */
  getTemporary () {
    return this.temporary
  }

  /**
     *
     * @param tmp : this temporary holds the value of the expression (last value)
     */
  setTemporary (tmp) {
    this.temporary = tmp
  }

  getType () {
    return this.type
  }

  setTrueLabel (str) {
    this.true_label = str
  }

  setFalseLabel (str) {
    this.false_label = str
  }

  getFalseLabel () {
    return this.false_label
  }

  getTrueLabel () {
    return this.true_label
  }

  copyLabels (ct) {
    if (this.true_label != null && this.false_label != null) {
      ct.setFalseLabel(this.false_label)
      ct.setTrueLabel(this.true_label)
    }
  }

  setBooleanLabels (true_label, false_label) {
    this.true_label = true_label
    this.false_label = false_label
  }

  copyInfo (eTrans) {
    this.temporary = eTrans.temporary
    this.type = eTrans.type
    this.aux_type = eTrans.getAuxType()
    this.is_array = eTrans.is_array
    this.dimensions = eTrans.dimensions
    this.position_code = eTrans.position_code
    this.setCode(eTrans.getCode())
  }

  getAuxType () {
    return this.aux_type
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/expression-translator.js":
/*!*********************************************************************!*\
  !*** ./src/backend/translators/expression/expression-translator.js ***!
  \*********************************************************************/
/*! exports provided: ExpressionTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpressionTranslator", function() { return ExpressionTranslator; });
/* harmony import */ var _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _conditional_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./conditional-translator */ "./src/backend/translators/expression/conditional-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");





class ExpressionTranslator extends _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode

    const ct = new _conditional_translator__WEBPACK_IMPORTED_MODULE_1__["ConditionalTranslator"](this)
    this.copyLabels(ct)
    ct.translate(INode)

    if (ct.assignCode) {
      let code = ct.getCode();
      const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genTemporary()
      const label = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genLabel()
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(ct.true_label)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign('1', tmp)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(label)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(ct.false_label)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign('0', tmp)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(label)
      this.temporary = tmp
      this.type = ct.type
      this.aux_type = ct.aux_type
      this.dimensions = ct.dimensions
      this.is_array = ct.is_array
      this.position_code = ct.position_code
      this.setCode(code)
      return
    } else {
      this.setCode(ct.getCode())
    }

    this.setTemporary(ct.temporary)
    this.type = ct.getType()
    this.aux_type = ct.aux_type
    this.dimensions = ct.dimensions
    this.is_array = ct.is_array
    this.position_code = ct.position_code
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/functions/constructor-call-translator.js":
/*!*************************************************************************************!*\
  !*** ./src/backend/translators/expression/functions/constructor-call-translator.js ***!
  \*************************************************************************************/
/*! exports provided: ConstructorCallTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConstructorCallTranslator", function() { return ConstructorCallTranslator; });
/* harmony import */ var _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _parameters_parameter_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../parameters/parameter-translator */ "./src/backend/translators/expression/parameters/parameter-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../backend */ "./src/backend/backend.js");








class ConstructorCallTranslator extends _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode
    // Here we lookup by index, first we should get the identifier and the symbol
    // first we should get all the params

    const pList = INode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.EXPRESSION_LIST)
    const identifier = INode.getChild(0).getValue()

    let code
    const pEList = []

    if (pList != null) {
      for (const pNode of pList.getChildren()) {
        pEList.push(new _parameters_parameter_translator__WEBPACK_IMPORTED_MODULE_3__["ParameterTranslator"](this))
        pEList[pEList.length - 1].translate(pNode)
        // code += pEList.peek().getCode();
        // here we check the info and the types
      }
    }

    const pointer_size = _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].SymbolTable.size + 1
    // console.log('Constructor', Backend.SymbolTable, pointer_size);
    const SymToLookup = _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].ClassTemplates.get(_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Classes.getType(identifier))
    // we lookup for the func itself
    let func

    const filters = []
    do {
      func = SymToLookup.lookupFunction(identifier, filters)

      if (func == null) { throw `CONSTRUCTOR FOR ${identifier} DOESN'T MATCH ANY DECLARED OR CREATED BY DEFAULT ${this.parseSemanticError(this.iNode)}` } else {
        if (func.getRol() != _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].CONSTRUCTOR) {
          filters.push(func)
          continue
        }

        if (pEList.length === 0 && func.getParameters() == null) { break }

        if (pEList.length !== 0 && func.getParameters() == null) {
          filters.push(func)
          continue
        }

        if (func.getParameters() != null && func.getParameters().length == pEList.length) {
          code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('constructor call begin')

          if (!this.parameterChecking(pEList, func.getParameters())) {
            filters.push(func)
            continue
          }

          for (let j = 0; j < pEList.length; j++) {
            if (!func.getParameters()[j][2]) { code += pEList[j].getCode() } else {
              if (pEList[j].position_code == null) {
                throw `EXPECTED A VARIABLE IN THE PARAMETER BY REF NUMBER (${j}) IN ${identifier}
                                                ${this.parseSemanticError(this.iNode)}`
              }
              code += (pEList[j].stack === 0) ? pEList[j].getCode() : pEList[j].position_code
            }
          }

          break
        } else {
          filters.push(func)
          continue
        }
      }
    } while (func != null)

    if (func == null) { throw ` CONSTRUCTOR FOR ${identifier} NOT FOUND ${this.parseSemanticError(this.iNode)}` }

    // CODE GENERATION FOR func CALL
    /* let stackPointer = Generator.genTemporary();
        code += TranslatorHelpers.unaryAssign("P", stackPointer); */
    this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genTemporary()
    /*
         * here we need to check if we are calling from main, if we are, then we move it
         * by 1 else we move it by the current environment size
         */
    let lastTemporary = -1
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(true, pointer_size)
    // get init and final
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateTmpStackSave(_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack[_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack.length - 1][1],
      (lastTemporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].getTemporary() - 1))
    // code += TranslatorHelpers.moveStackPointer(true, 1);
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('aca se supone que se pasa el this')
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
    // code += TranslatorHelpers.generateStackAssign(this.temporary, stackPointer);
    // code += TranslatorHelpers.arithmeticOperation("+", "1", this.temporary, this.temporary);

    for (let j = 0; j < pEList.length; j++) {
      if (!func.getParameters()[j][2]) {
        // by value
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('param by value')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(this.temporary, pEList[j].getTemporary())
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', '1', this.temporary, this.temporary)
      } else {
        // here the thing goes by reference
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('param by ref')
        // code += pEList[j].position_code;
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(this.temporary, pEList[j].temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, '1', this.temporary)
      }
    }

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall(func.functionId)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateTmpStackRecover(_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack[_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack.length - 1][1],
      lastTemporary)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, pointer_size)

    this.setCode(code)
    this.type = func.getType()
    this.aux_type = func.getAuxType()
  }

  parameterChecking (pEList, params) {
    // implicit cast
    for (let i = 0; i < pEList.length; i++) {
      if (!this.typeChecking(params[i][1], params[i][3], params[i][4],
        pEList[i].getType(), pEList[i].getAuxType(), pEList[i].dimensions)) { return false }
    }

    return true
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/functions/function-call-parameter-names-translator.js":
/*!**************************************************************************************************!*\
  !*** ./src/backend/translators/expression/functions/function-call-parameter-names-translator.js ***!
  \**************************************************************************************************/
/*! exports provided: FunctionCallParameterNamesTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionCallParameterNamesTranslator", function() { return FunctionCallParameterNamesTranslator; });
/* harmony import */ var _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _parameters_parameter_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../parameters/parameter-translator */ "./src/backend/translators/expression/parameters/parameter-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../backend */ "./src/backend/backend.js");








class FunctionCallParameterNamesTranslator extends _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
    this.pointerInfo = ''
    this.auxTemporary = ''
  }

  translate (INode) {
    this.iNode = INode
    // Here we lookup by index, first we should get the identifier and the symbol
    // first we should get all the params
    const pList = INode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.EXPRESSION_LIST)
    let identifier
    const pointerSize = _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].SymbolTable.getSize()

    this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genTemporary()

    if (this.iNode.getChild(0).getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.DOT) {
      throw Error(`CAN'T USE THIS KIND OF CALL (BY PARAMETERS NAME) WITH CURRENT LHS${this.parseSemanticError(this.iNode)}`)
    } else {
      identifier = INode.getChild(0).getValue().toLowerCase()
    }

    let code = ''
    const pEList = []
    const nList = []

    if (pList != null) {
      for (const pNode of pList.getChildren()) {
        pEList.push(new _parameters_parameter_translator__WEBPACK_IMPORTED_MODULE_3__["ParameterTranslator"](this))
        pEList[pEList.length - 1].translate(pNode.getChild(1))
        nList.push(pNode.getChild(0).getValue())
      }
    }
    const current = _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].SymbolTable

    if (current === undefined || current == null) { throw Error(`NULL POINTER EXCEPTION UNABLE TO FIND A VALID OBJECT TYPE IN LHS${this.parseSemanticError(lhs)}`) }

    // we lookup for the func itself
    let func
    const filters = []
    do {
      func = current.lookupFunction(identifier, filters)

      if (func == null) { throw Error(`${identifier} WASN'T FOUND IN THE CURRENT ENVIRONMENT ${this.parseSemanticError(this.iNode)}`) } else {
        if (pEList.length === 0 && func.getParameters() == null) { break }

        if (pEList.length !== 0 && func.getParameters() == null) {
          filters.push(func)
          continue
        }

        if (func.getParameters() != null && func.getParameters().length === pEList.length) {
          code = ''

          if (!this.parameterCheckingByName(pEList, func.getParameters(), nList)) {
            filters.push(func)
            continue
          }

          // console.log('supuestamente cambiaron', pEList)

          for (let j = 0; j < pEList.length; j++) {
            if (!func.getParameters()[j][2]) { code += pEList[j].getCode() } else {
              if (pEList[j].position_code == null) {
                throw Error(`EXPECTED A VARIABLE IN THE PARAMETER BY REF NUMBER (${j}) IN ${identifier}
                                                ${this.parseSemanticError(this.iNode)}`)
              }
              code += (pEList[j].stack === 1) ? pEList[j].getCode() : pEList[j].position_code
            }
          }

          break
        } else {
          filters.push(func)
          continue
        }
      }
    } while (func != null)

    if (func == null) { throw Error(`FUNCTION OR PROCEDURE WITH NAME ${identifier} NOT FOUND ${this.parseSemanticError(this.iNode)}`) }

    // CODE GENERATION FOR func CALL
    /* let stackPointer = Generator.genTemporary();
        code += TranslatorHelpers.unaryAssign("P", stackPointer);
        */
    /*
         * here we need to check if we are calling from main, if we are, then we move it
         * by 1 else we move it by the current environment size
         */
    // CHECK IF POINTER INFO IS PASSED
    let lastTemporary = -1
    /*
      this line was commented because we killed pointerInfo
     */
    // code += (this.pointerInfo !== '') ? this.pointerInfo : ''
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
    // get init and final
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateTmpStackSave(_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack[_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack.length - 1][1],
      (lastTemporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].getTemporary() - 1))
    // code += TranslatorHelpers.comment('aca se supone que se pasa el this')
    // code += TranslatorHelpers.generateStackAssign('P', this.temporary)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
    // code += TranslatorHelpers.generateStackAssign(this.temporary, stackPointer);
    // code += TranslatorHelpers.arithmeticOperation("+", "1", this.temporary, this.temporary);

    for (let j = 0; j < pEList.length; j++) {
      if (!func.getParameters()[j][2]) {
        // by value
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('param by value')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(this.temporary, pEList[j].temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, '1', this.temporary)
      } else {
        // here the thing goes by reference
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('param by ref')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(this.temporary, pEList[j].temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, '1', this.temporary)
      }
    }

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall(func.functionId)

    if (func.getRol() === _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].FUNCTION) {
      this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genTemporary()
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('return in position P + 1')
    }

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateTmpStackRecover(_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack[_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack.length - 1][1],
      lastTemporary)

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

    this.setCode(code)
    this.type = func.getType()
    this.aux_type = func.getAuxType()
    this.dimensions = func.dimensions
    this.is_array = func.dimensions !== 0
  }

  parameterCheckingByName (pEList, params, name) {
    /**
     * We must order the parameter
     * params has the correct order
     * pEList should change to match params
     */
    const paramOrder = []
    for (let i = 0, index = 0; i < pEList.length; i++) {
      index = name.indexOf(params[i][0])

      if (index === -1) { throw Error(`UNKOWN PARAMETER NAME ${name[i]} IN FUNCTION CALL${this.parseSemanticError(this.iNode)}`) }

      if (!this.typeChecking(params[i][1], params[i][3], params[i][4], pEList[index].getType(), pEList[index].getAuxType(), pEList[index].dimensions)) { return false }
      paramOrder.push(pEList[index])
    }

    // clean the old array
    pEList.splice(0, pEList.length)

    // we take this approach case we need to change the primary array
    for (const el of paramOrder) {
      pEList.push(el)
    }

    return true
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/functions/function-call-translator.js":
/*!**********************************************************************************!*\
  !*** ./src/backend/translators/expression/functions/function-call-translator.js ***!
  \**********************************************************************************/
/*! exports provided: FunctionCallTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionCallTranslator", function() { return FunctionCallTranslator; });
/* harmony import */ var _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _parameters_parameter_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../parameters/parameter-translator */ "./src/backend/translators/expression/parameters/parameter-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../backend */ "./src/backend/backend.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _function_call_parameter_names_translator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./function-call-parameter-names-translator */ "./src/backend/translators/expression/functions/function-call-parameter-names-translator.js");










class FunctionCallTranslator extends _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
    this.pointerInfo = ''
    this.auxTemporary = ''
  }

  translate (INode) {
    this.iNode = INode
    // Here we lookup by index, first we should get the identifier and the symbol
    // first we should get all the params
    const pList = INode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.EXPRESSION_LIST)
    let identifier
    let fromObject = false
    const pointerSize = _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].SymbolTable.getSize()

    this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genTemporary()

    if (this.iNode.getChild(0).getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.DOT) {
      identifier = this.iNode.getChild(0).getChild(1).getValue().toLowerCase()
      fromObject = true
    } else {
      identifier = INode.getChild(0).getValue().toLowerCase()
    }

    let code = ''
    const pEList = []

    // hotfix for functions by name
    if (pList != null) {
      let cx = 0
      for (const pNode of pList.getChildren()) {
        if (pNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.EQ) { cx += 1 }
      }
      if (cx === pList.childrenSize()) {
        const funcByParameter = new _function_call_parameter_names_translator__WEBPACK_IMPORTED_MODULE_8__["FunctionCallParameterNamesTranslator"](this)
        funcByParameter.translate(INode)

        this.aux_type = funcByParameter.aux_type
        this.type = funcByParameter.type
        this.temporary = funcByParameter.temporary
        this.code = funcByParameter.code
        this.is_array = funcByParameter.is_array
        this.dimensions = funcByParameter.dimensions
        return
      }
    }

    if (pList != null) {
      for (const pNode of pList.getChildren()) {
        pEList.push(new _parameters_parameter_translator__WEBPACK_IMPORTED_MODULE_3__["ParameterTranslator"](this))
        if (fromObject && identifier === 'instanceof') { continue }
        pEList[pEList.length - 1].translate(pNode)
        // code += pEList.peek().getCode();
        // here we check the info and the types
      }
    }

    const current = _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].SymbolTable

    if (fromObject) {
      const lhs = this.iNode.getChild(0).getChild(0)

      const expression = new _expression_translator__WEBPACK_IMPORTED_MODULE_7__["ExpressionTranslator"](lhs)
      expression.translate(lhs)
      code += expression.code

      if (expression.type === _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].STRING) {
        if (['touppercase', 'tolowercase', 'tochararray', 'length', 'charat'].includes(identifier)) {
          if (identifier === 'charat') {
            if (pEList.length !== 1) {
              throw Error(`UNABLE TO CALL ${identifier} ON STRING BECAUSE OF PARAMS${this.parseSemanticError(this.iNode)}`)
            }
            const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genTemporary()
            code += pEList[0].code
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
            // code += TranslatorHelpers.generateStackAssign('P', expression.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, tmp)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp, expression.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', 2, tmp)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp, pEList[0].getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('native_string_charat')
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

            this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].CHAR
            this.aux_type = null
            this.code = code
            this.dimensions = 0
            this.is_array = false
            return
          }

          if (pEList.length !== 0) {
            throw Error(`UNABLE TO CALL ${identifier} ON STRING${this.parseSemanticError(this.iNode)}`)
          }

          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', expression.temporary)

          if (identifier === 'length') {
            const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genTemporary()
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, tmp)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(tmp, expression.getTemporary())
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_length')
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

            this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].INTEGER
            this.aux_type = null
            this.code = code
            this.dimensions = 0
            this.is_array = false
            return
          }

          if (identifier === 'tochararray') {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_to_chararray')
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

            this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].CHAR
            this.aux_type = null
            this.code = code
            this.dimensions = 1
            this.is_array = true
            return
          }

          if (identifier === 'touppercase') { code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_to_uppercase') } else if (identifier === 'tolowercase') { code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('java_string_to_lowercase') }
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].STRING
          this.aux_type = null
          this.code = code
          this.dimensions = 0
          this.is_array = false
          return
        } else { throw Error(`UNABLE TO CALL ${identifier} ON STRING${this.parseSemanticError(this.iNode)}`) }
      } else if (expression.dimensions !== 0) {
        if (pEList.length !== 0) {
          throw Error(`UNABLE TO CALL ${identifier} ON ARRAY${this.parseSemanticError(this.iNode)}`)
        }

        if (identifier === 'linealize') {
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign('P', expression.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall('native_vector_linealize')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', this.temporary)

          this.type = expression.type
          this.aux_type = expression.aux_type
          this.code = code
          this.dimensions = expression.dimensions
          this.is_array = true
          return
        }
      } else if (expression.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].OBJECT && expression.aux_type !== null) {
        if (identifier === 'instanceof') {
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('inicio de instance')
          const labels = [_generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel(), _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel()]
          this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genTemporary()

          if (pEList.length !== 1) {
            throw Error(`UNABLE TO CALL ${identifier} ON OBJECT, PARAMETER MISSMATCH${this.parseSemanticError(this.iNode)}`)
          }

          const className = pList.getChild(0).getValue()
          const ioType = _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Classes.getType(className)

          if (ioType === -1) { throw Error(`UNABLE TO FIND THE SPECIFIED TYPE${this.parseSemanticError(pList.getChild(0))}`) }

          if (expression.aux_type === _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Classes.getType('var')) {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', expression.temporary, '1', expression.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(expression.temporary, expression.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', ioType, expression.temporary, labels[0])
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('0', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1])
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0])
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('1', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1])
          } else {
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', ioType, expression.aux_type, labels[0])
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('0', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(labels[1])
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[0])
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign('1', this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(labels[1])
          }

          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].BOOLEAN
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          this.code = code
          return
        }

        if (identifier === 'size' || identifier === 'getreference') {
          if (pEList.length !== 0) {
            throw Error(`UNABLE TO CALL ${identifier} ON OBJECT, PARAMETER MISSMATCH${this.parseSemanticError(this.iNode)}`)
          }
          if (identifier === 'size') {
            const symClass = _backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].ClassTemplates.get(expression.aux_type)
            const auxLabel = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel()
            const outLabel = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genLabel()

            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].conditionalJMP('==', expression.getTemporary(), '0', auxLabel)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(symClass.getSize(), this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].inconditionalJMP(outLabel)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(auxLabel)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(0, this.temporary)
            code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(outLabel)

            this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].INTEGER
            this.aux_type = null
            this.code = code
            this.dimensions = 0
            this.is_array = false
            return
          }

          if (identifier === 'getreference') {
            this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].INTEGER
            this.temporary = expression.getTemporary()
            this.aux_type = null
            this.code = code
            this.dimensions = 0
            this.is_array = false
            return
          }
        }
      }
    }

    if (current === undefined || current == null) { throw Error(`NULL POINTER EXCEPTION UNABLE TO FIND A VALID OBJECT TYPE IN LHS${this.parseSemanticError(lhs)}`) }

    // we lookup for the func itself
    let func
    const filters = []
    do {
      func = current.lookupFunction(identifier, filters)

      if (func == null) { throw Error(`${identifier} WASN'T FOUND IN THE CURRENT ENVIRONMENT ${this.parseSemanticError(this.iNode)}`) } else {
        if (pEList.length === 0 && func.getParameters() == null) { break }

        if (pEList.length !== 0 && func.getParameters() == null) {
          filters.push(func)
          continue
        }

        if (func.getParameters() != null && func.getParameters().length === pEList.length) {
          code = ''

          if (!this.parameterChecking(pEList, func.getParameters())) {
            filters.push(func)
            continue
          }

          for (let j = 0; j < pEList.length; j++) {
            if (!func.getParameters()[j][2]) { code += pEList[j].getCode() } else {
              if (pEList[j].position_code == null) {
                throw Error(`EXPECTED A VARIABLE IN THE PARAMETER BY REF NUMBER (${j}) IN ${identifier}
                                                ${this.parseSemanticError(this.iNode)}`)
              }
              code += (pEList[j].stack === 1) ? pEList[j].getCode() : pEList[j].position_code
            }
          }

          break
        } else {
          filters.push(func)
          continue
        }
      }
    } while (func != null)

    if (func == null) { throw Error(`FUNCTION OR PROCEDURE WITH NAME ${identifier} NOT FOUND ${this.parseSemanticError(this.iNode)}`) }

    // CODE GENERATION FOR func CALL
    /* let stackPointer = Generator.genTemporary();
        code += TranslatorHelpers.unaryAssign("P", stackPointer);
        */
    /*
         * here we need to check if we are calling from main, if we are, then we move it
         * by 1 else we move it by the current environment size
         */
    // CHECK IF POINTER INFO IS PASSED
    let lastTemporary = -1
    /*
      this line was commented because we killed pointerInfo
     */
    // code += (this.pointerInfo !== '') ? this.pointerInfo : ''
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
    // get init and final
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateTmpStackSave(_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack[_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack.length - 1][1],
      (lastTemporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].getTemporary() - 1))
    // code += TranslatorHelpers.comment('aca se supone que se pasa el this')
    // code += TranslatorHelpers.generateStackAssign('P', this.temporary)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
    // code += TranslatorHelpers.generateStackAssign(this.temporary, stackPointer);
    // code += TranslatorHelpers.arithmeticOperation("+", "1", this.temporary, this.temporary);

    for (let j = 0; j < pEList.length; j++) {
      if (!func.getParameters()[j][2]) {
        // by value
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('param by value')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(this.temporary, pEList[j].temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, '1', this.temporary)
      } else {
        // here the thing goes by reference
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('param by ref')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAssign(this.temporary, pEList[j].temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, '1', this.temporary)
      }
    }

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].functionCall(func.functionId)

    if (func.getRol() === _compiler_types__WEBPACK_IMPORTED_MODULE_5__["CompilerTypes"].FUNCTION) {
      this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_2__["Generator"].genTemporary()
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('return in position P + 1')
    }

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateTmpStackRecover(_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack[_backend__WEBPACK_IMPORTED_MODULE_6__["Backend"].Display.FunctionCallStack.length - 1][1],
      lastTemporary)

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

    this.setCode(code)
    this.type = func.getType()
    this.aux_type = func.getAuxType()
    this.dimensions = func.dimensions
    this.is_array = func.dimensions !== 0
  }

  parameterChecking (pEList, params) {
    for (let i = 0; i < pEList.length; i++) {
      if (!this.typeChecking(params[i][1], params[i][3], params[i][4], pEList[i].getType(), pEList[i].getAuxType(), pEList[i].dimensions)) {

        return false
      }
    }

    return true
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/identifier-translator.js":
/*!*********************************************************************!*\
  !*** ./src/backend/translators/expression/identifier-translator.js ***!
  \*********************************************************************/
/*! exports provided: IdentifierTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IdentifierTranslator", function() { return IdentifierTranslator; });
/* harmony import */ var _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../expression/expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");






class IdentifierTranslator extends _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_0__["ExpressionBaseTranslator"] {
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
    const curr_symTab = _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].SymbolTable

    if (curr_symTab == null) { throw new Exception('UNABLE TO FIND A VALID SYMBOL TABLE????' + this.parseSemanticError(this.iNode)) }

    // we get the current symbol
    const sym = curr_symTab.lookup(identifier, _backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].ScopeStack.currentNestingLevel())

    // we check if symbol is actually found
    if (sym === null) { throw `UNABLE TO FIND THE VARIABLE WITH THAT NAME ${identifier} ${this.parseSemanticError(this.iNode)}` }
    this.isConstant = sym.isConstant()

    this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genTemporary()
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
      case _compiler_types__WEBPACK_IMPORTED_MODULE_4__["CompilerTypes"].GLOBAL: {
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].unaryAssign(sym.getPosition() + '', this.temporary)
        this.position_code = code + ''
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
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
      case _compiler_types__WEBPACK_IMPORTED_MODULE_4__["CompilerTypes"].ATTRIBUTE:
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('attribute access')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, sym.getPosition(), this.temporary)
        this.position_code = code + ''
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
        this.code = code
        this.stack = 0
        break
      case _compiler_types__WEBPACK_IMPORTED_MODULE_4__["CompilerTypes"].VARIABLE:
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('variable access')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', sym.getPosition(), this.temporary)
        this.position_code = code + ''
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
        this.stack = 1
        break
      case _compiler_types__WEBPACK_IMPORTED_MODULE_4__["CompilerTypes"].REF_PARAM:
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('ref param access')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', sym.getPosition(), this.temporary)
        this.position_code = code + ''
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
        this.stack = 1
        break
      case _compiler_types__WEBPACK_IMPORTED_MODULE_4__["CompilerTypes"].VAL_PARAM:
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].comment('val_param access')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].arithmeticOperation('+', 'P', sym.getPosition(), this.temporary)
        this.position_code = code + ''
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateStackAccess(this.temporary, this.temporary)
        this.stack = 1
        break
    }

    this.setCode(code)
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/objects/object-access-translator.js":
/*!********************************************************************************!*\
  !*** ./src/backend/translators/expression/objects/object-access-translator.js ***!
  \********************************************************************************/
/*! exports provided: ObjectAccessTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectAccessTranslator", function() { return ObjectAccessTranslator; });
/* harmony import */ var _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _identifier_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../identifier-translator */ "./src/backend/translators/expression/identifier-translator.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../backend */ "./src/backend/backend.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../arrays/array-access-stmt-translator */ "./src/backend/translators/expression/arrays/array-access-stmt-translator.js");
/* harmony import */ var _functions_function_call_translator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../functions/function-call-translator */ "./src/backend/translators/expression/functions/function-call-translator.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../expression-translator */ "./src/backend/translators/expression/expression-translator.js");











class ObjectAccessTranslator extends _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
    this.position_code = ''
    this.access_code = ''
    this.code = ''
  }

  translate (INode /* , SymTabImp symbols */) {
    this.iNode = INode

    /**
         * THERE ARE 6 TYPES POSSIBLE FOR LHS
         *      FUNCTION () (3) done
         *      THIS        (4) done
         *      SUPER       (5) done
         *      ARRAY       (4) done
         *      IDENTIFIER  (1) done
         *      DOT         (2) done
         *      CAST        (6) done
         * THERE ARE 2 POSSIBLES TYPES FOR RHS
         *      IDENTIFIER
         *
         */
    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)
    let code = ''

    const isLength = rightNode.getValue() === 'length'

    if (leftNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DOT) {
      const objectATranslator = new ObjectAccessTranslator(this)
      objectATranslator.translate(leftNode)
      code += objectATranslator.access_code

      if (objectATranslator.is_array) {
        if (isLength) {
          this.temporary = objectATranslator.temporary
          this.position_code = objectATranslator.access_code
          this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('length access')
          this.code += objectATranslator.access_code
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
          this.access_code = this.code
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_8__["CompilerTypes"].INTEGER
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          return
        }
        throw Error(`THE LHS OF DOT OPERATOR IS OF TYPE ARRAY NOT OBJECT${this.parseSemanticError(INode)}`)
      }
      // console.log('entra acá en left node dot vez', code);
      const current = _backend__WEBPACK_IMPORTED_MODULE_3__["Backend"].ClassTemplates.get(objectATranslator.aux_type)

      // this means that the trailed symboltable is null
      if (current == null) { throw Error(`UNABLE TO FIND THE SPECIFIED VALUE TYPE, MY ERROR ${this.parseSemanticError(this.iNode)}`) }

      let symbol = null

      if ((symbol = current.lookup(rightNode.getValue())) == null) { throw Error(`UNABLE TO FIND THE REQUESTED KEY ${identifier.toUpperCase()} ${this.parseSemanticError(this.iNode)}`) } else {
        this.temporary = objectATranslator.temporary
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('left hand dot access')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', objectATranslator.getTemporary(), symbol.getPosition(), this.temporary)
        this.type = symbol.getType()
        this.aux_type = symbol.getAuxType()
        this.dimensions = symbol.dimensions
        this.is_array = symbol.is_array
      }

      this.position_code = code
      this.access_code = this.position_code + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
      this.code = this.access_code
      // console.log(this.access_code);
    } else if (leftNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.ARRAY_ACCESS) {
      const arrayATranslator = new _arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_6__["ArrayAccessStmtTranslator"](this)
      arrayATranslator.translate(leftNode)
      code += arrayATranslator.access_code

      if (arrayATranslator.is_array) {
        if (isLength) {
          this.temporary = arrayATranslator.temporary
          this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('length access')
          this.position_code = arrayATranslator.access_code
          this.code += arrayATranslator.access_code
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
          this.access_code = this.code + ''
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_8__["CompilerTypes"].INTEGER
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          return
        }
        throw Error(`THE LHS OF DOT OPERATOR IS OF TYPE ARRAY NOT OBJECT${this.parseSemanticError(INode)}`)
      }

      const current = _backend__WEBPACK_IMPORTED_MODULE_3__["Backend"].ClassTemplates.get(arrayATranslator.aux_type)
      // this means that the trailed symboltable is null
      if (current == null) { throw Error(`UNABLE TO FIND THE SPECIFIED VALUE TYPE, MY ERROR ${this.parseSemanticError(this.iNode)}`) }

      let symbol = null

      if ((symbol = current.lookup(rightNode.getValue())) == null) { throw Error(`UNABLE TO FIND THE REQUESTED KEY ${identifier.toUpperCase()} ${this.parseSemanticError(this.iNode)}`) } else {
        this.temporary = arrayATranslator.temporary
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('left hand dot access')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', arrayATranslator.getTemporary(), symbol.getPosition(), this.temporary)
        this.type = symbol.getType()
        this.aux_type = symbol.getAuxType()
        this.dimensions = symbol.dimensions
        this.is_array = symbol.is_array
      }

      this.position_code = code
      this.access_code = this.position_code + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
      this.code = this.access_code
    } else if (leftNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IDENTIFIER) {
      const idTrans = new _identifier_translator__WEBPACK_IMPORTED_MODULE_2__["IdentifierTranslator"](this)
      idTrans.translate(leftNode)

      if (idTrans.is_array) {
        if (isLength) {
          this.temporary = idTrans.temporary
          this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('length access')
          this.code += idTrans.code
          this.position_code = idTrans.code
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
          this.access_code = this.code + ''
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_8__["CompilerTypes"].INTEGER
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          return
        }
        throw Error(`THE LHS OF DOT OPERATOR IS OF TYPE ARRAY NOT OBJECT${this.parseSemanticError(INode)}`)
      }

      if (idTrans.aux_type == null) { throw Error(`LEFT HAND SIDE OF DOT OPERATION IS NOT OF TYPE OBJECT ${leftNode.getValue()}${this.parseSemanticError(leftNode)}`) }

      const symTab = _backend__WEBPACK_IMPORTED_MODULE_3__["Backend"].ClassTemplates.get(idTrans.aux_type)

      /**
             * now we check the only possible rhs
             *      IDENTIFIER
            */
      let symbol = null
      if ((symbol = symTab.lookup(rightNode.getValue())) == null) { throw Error(`UNABLE TO FIND RIGHT HAND SIDE OF DOT OPERATION AT ${this.parseSemanticError(rightNode)}`) }

      // position code
      // here we have the object access
      this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
      this.position_code = idTrans.getCode()
      this.position_code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', idTrans.temporary, symbol.getPosition(), this.temporary)
      // access code
      this.access_code = this.position_code + ''
      this.access_code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
      this.aux_type = symbol.getAuxType()
      this.type = symbol.getType()
      this.dimensions = symbol.dimensions
      this.is_array = symbol.is_array
      this.code = this.access_code
    } else if (leftNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.FUNCTION_CALL) {
      const fcall = new _functions_function_call_translator__WEBPACK_IMPORTED_MODULE_7__["FunctionCallTranslator"](this)
      fcall.translate(leftNode)
      this.temporary = fcall.temporary
      this.position_code = fcall.code

      if (fcall.is_array) {
        if (isLength) {
          this.temporary = fcall.temporary
          this.position_code = fcall.code
          this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('length access')
          this.code += fcall.code
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
          this.access_code = code
          this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_8__["CompilerTypes"].INTEGER
          this.aux_type = null
          this.dimensions = 0
          this.is_array = false
          return
        }
        throw Error(`THE LHS OF DOT OPERATOR IS OF TYPE ARRAY NOT OBJECT${this.parseSemanticError(INode)}`)
      }
      /**
             * WE NOW SEARCH FOR THE SPECIFIED TYPE
             */
      const currSymTab = _backend__WEBPACK_IMPORTED_MODULE_3__["Backend"].ClassTemplates.get(fcall.aux_type)
      if (currSymTab === undefined) { throw Error(`LHS DIDN'T RETURN A VALID OBJECT TYPE${this.parseSemanticError(leftNode)}`) }

      const symbol = currSymTab.lookup(rightNode.getValue())
      if (symbol === null) {
        throw Error(`UNABLE TO FIND THE VARIABLE ${rightNode.getValue()} IN CURRENT ENV${this.parseSemanticError(INode)}`)
      }

      this.aux_type = symbol.getAuxType()
      this.type = symbol.getType()
      this.dimensions = symbol.dimensions
      this.is_array = symbol.is_array

      this.position_code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, symbol.getPosition(), this.temporary)
      this.access_code = this.position_code + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
      this.code = this.access_code
    } else if (leftNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.CAST) {
      const expr = new _expression_translator__WEBPACK_IMPORTED_MODULE_9__["ExpressionTranslator"](this)
      expr.translate(leftNode)

      this.position_code = expr.code
      const currSymTab = _backend__WEBPACK_IMPORTED_MODULE_3__["Backend"].ClassTemplates.get(expr.aux_type)
      if (currSymTab === undefined) { throw Error(`LHS DIDN'T RETURN A VALID OBJECT TYPE${this.parseSemanticError(leftNode)}`) }

      const symbol = currSymTab.lookup(rightNode.getValue())
      if (symbol === null) {
        throw Error(`UNABLE TO FIND THE VARIABLE ${rightNode.getValue()} IN CURRENT ENV${this.parseSemanticError(INode)}`)
      }

      this.temporary = expr.temporary
      this.aux_type = symbol.getAuxType()
      this.type = symbol.getType()
      this.dimensions = symbol.dimensions
      this.is_array = symbol.is_array

      this.position_code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', this.temporary, symbol.getPosition(), this.temporary)
      this.access_code = this.position_code + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(this.temporary, this.temporary)
      this.code = this.access_code
    } else { throw Error(`UNABLE TO PERFORM DOT ACCESS ON LHS ${_ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].names[leftNode.getType()]}${this.parseSemanticError(INode)}`) }
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/parameters/parameter-translator.js":
/*!*******************************************************************************!*\
  !*** ./src/backend/translators/expression/parameters/parameter-translator.js ***!
  \*******************************************************************************/
/*! exports provided: ParameterTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParameterTranslator", function() { return ParameterTranslator; });
/* harmony import */ var _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _identifier_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../identifier-translator */ "./src/backend/translators/expression/identifier-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _objects_object_access_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../objects/object-access-translator */ "./src/backend/translators/expression/objects/object-access-translator.js");
/* harmony import */ var _functions_constructor_call_translator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../functions/constructor-call-translator */ "./src/backend/translators/expression/functions/constructor-call-translator.js");
/* harmony import */ var _functions_function_call_translator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../functions/function-call-translator */ "./src/backend/translators/expression/functions/function-call-translator.js");
/* harmony import */ var _arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../arrays/array-access-stmt-translator */ "./src/backend/translators/expression/arrays/array-access-stmt-translator.js");
/* harmony import */ var _arrays_array_literal_translator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../arrays/array-literal-translator */ "./src/backend/translators/expression/arrays/array-literal-translator.js");
/* harmony import */ var _arrays_array_declaration_translator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../arrays/array-declaration-translator */ "./src/backend/translators/expression/arrays/array-declaration-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../backend */ "./src/backend/backend.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../generators/generator */ "./src/backend/generators/generator.js");















class ParameterTranslator extends _expression_base_translator__WEBPACK_IMPORTED_MODULE_0__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
    this.access_code = ''
    this.position_code = ''
  }

  translate (INode) {
    this.iNode = INode

    /**
         * WE CHECK THE LOGIC OF THE PARAMETER TRANSLATION, THIS WILL ONLY BE USED FOR
         * PARAMETERS, AND WILL TEMPORARILY SAVE THE SAME INFORMATION, PLUS CHECK IF THE
         * NODE HAS THE CORRECT ROL AND GET THE NESTING INFORMATION AND STUFF
         */
    switch (INode.getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.CAST: {
        const expressionTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
        expressionTranslator.translate(INode)

        this.aux_type = expressionTranslator.aux_type
        this.type = expressionTranslator.type
        this.dimensions = expressionTranslator.dimensions
        this.is_array = expressionTranslator.is_array
        this.position_code = expressionTranslator.getCode()
        this.setCode(expressionTranslator.getCode())
        this.access_code = expressionTranslator.getCode()
        this.temporary = expressionTranslator.getTemporary()
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.IDENTIFIER: {
        const iTranslator = new _identifier_translator__WEBPACK_IMPORTED_MODULE_2__["IdentifierTranslator"](this)
        iTranslator.translate(INode)
        // copy all data
        // this type is to check against the param type of the function call
        this.aux_type = iTranslator.aux_type
        this.type = iTranslator.type
        this.dimensions = iTranslator.dimensions
        this.is_array = iTranslator.is_array
        this.position_code = iTranslator.getCode()
        this.setCode(iTranslator.getCode())
        this.access_code = iTranslator.getCode()
        this.temporary = iTranslator.getTemporary()
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.ARRAY_ACCESS: {
        const arrTranslator = new _arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_7__["ArrayAccessStmtTranslator"](this)
        arrTranslator.translate(INode)

        this.position_code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].comment('array access param') + arrTranslator.access_code
        this.type = arrTranslator.getType()
        this.aux_type = arrTranslator.aux_type
        this.dimensions = arrTranslator.dimensions
        this.is_array = arrTranslator.is_array
        this.temporary = arrTranslator.getTemporary()
        this.access_code = arrTranslator.access_code
        this.setCode(this.access_code)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.DOT: {
        // console.log('dot');
        const objectAccessTranslator = new _objects_object_access_translator__WEBPACK_IMPORTED_MODULE_4__["ObjectAccessTranslator"](this)
        objectAccessTranslator.translate(INode)
        this.position_code = objectAccessTranslator.getCode()
        this.type = objectAccessTranslator.getType()
        this.aux_type = objectAccessTranslator.aux_type
        this.dimensions = objectAccessTranslator.dimensions
        this.is_array = objectAccessTranslator.is_array
        this.temporary = objectAccessTranslator.getTemporary()
        this.access_code = objectAccessTranslator.access_code
        this.setCode(this.access_code)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.FUNCTION_CALL: {
        // if this is a position the value itself should have a position, this has to be
        // run semantically
        const fCallTranslator = new _functions_function_call_translator__WEBPACK_IMPORTED_MODULE_6__["FunctionCallTranslator"](this)
        fCallTranslator.translate(INode)
        this.type = fCallTranslator.type
        this.aux_type = fCallTranslator.aux_type
        this.code = fCallTranslator.getCode()
        this.position_code = fCallTranslator.getCode()
        this.access_code = fCallTranslator.getCode()
        this.position_code = fCallTranslator.getCode()
        this.dimensions = fCallTranslator.dimensions
        this.is_array = fCallTranslator.dimensions
        this.temporary = fCallTranslator.getTemporary()
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.NEW_ARRAY:

        this.type = this.parseType(INode.getChild(0).getType())
        this.aux_type = (this.type === _compiler_types__WEBPACK_IMPORTED_MODULE_11__["CompilerTypes"].OBJECT) ? _backend__WEBPACK_IMPORTED_MODULE_12__["Backend"].Classes.getType(INode.getChild(0).getValue()) : null
        if (this.aux_type === -1) { throw Error(`UNABLE TO FIND THE SPECIFIED TYPE ${INode.getChild(0).getValue()}${this.parseSemanticError(INode.getChild(0))}`) }
        this.dimensions = INode.getChild(1).childrenSize()
        this.is_array = true

        if (INode.childrenSize() === 3) {
          const arrLiteral = new _arrays_array_literal_translator__WEBPACK_IMPORTED_MODULE_8__["ArrayLiteralTranslator"](this)
          arrLiteral.translate(INode.getChild(2))

          if (arrLiteral.dimensions !== this.dimensions) { throw Error('ARRAY LITERAL DOESN\'T HAVE THE SAME DIMENSIONS AS THE DECLARED ARRAY') }

          if (this.type !== arrLiteral.type || arrLiteral.aux_type !== this.aux_type) { throw Error(`ARRAY LITERAL IS NOT THE SAME VALUE AS DECLARED${this.parseSemanticError(INode)}`) }

          this.code = arrLiteral.getCode()
          this.temporary = arrLiteral.temporary
        } else {
          this.code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].comment('ARRAY DECL NOT INITIALIZED INIT')
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].moveHeapPointer(1)
          this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_13__["Generator"].genTemporary()
          this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].unaryAssign('H', this.temporary)
          this.code += _arrays_array_declaration_translator__WEBPACK_IMPORTED_MODULE_9__["ArrayDeclarationTranslator"].translate(INode.getChild(1).getChildren())
        }
        this.position_code = this.code
        this.access_code = this.code
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.DOLLAR: {
        const exprTrans = new _expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
        exprTrans.translate(INode.getChild(0))
        let code = exprTrans.getCode()
        this.position_code = exprTrans.getCode()
        this.type = exprTrans.getType()
        this.aux_type = exprTrans.aux_type
        this.access_code = exprTrans.access_code
        const pointerSize = _backend__WEBPACK_IMPORTED_MODULE_12__["Backend"].SymbolTable.getSize()

        if (exprTrans.dimensions !== 0) {
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].generateStackAssign('P', exprTrans.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].functionCall('native_vector_linealize')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].generateStackAccess('P', exprTrans.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

          this.temporary = exprTrans.temporary
          this.type = exprTrans.type
          this.aux_type = exprTrans.aux_type
          this.code = code
          this.dimensions = exprTrans.dimensions
          this.is_array = true
        } else if (exprTrans.aux_type != null) {
          this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_13__["Generator"].genTemporary()
          const symClass = _backend__WEBPACK_IMPORTED_MODULE_12__["Backend"].ClassTemplates.get(exprTrans.aux_type)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].generateStackAssign(this.temporary, exprTrans.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].arithmeticOperation('+', 'P', '2', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].generateStackAssign(this.temporary, symClass.getSize())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].comment('clonar parametro')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].functionCall('native_object_clone')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_10__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)
        }
        this.position_code = code
        this.setCode(code)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.NEW:
        const constructorCall = new _functions_constructor_call_translator__WEBPACK_IMPORTED_MODULE_5__["ConstructorCallTranslator"](this)
        constructorCall.translate(this.iNode.getChild(0))
        this.copyInfo(constructorCall)
        this.aux_type = constructorCall.aux_type
        this.position_code = this.code
        this.access_code = this.code
        this.is_array = constructorCall.is_array
        this.dimensions = constructorCall.dimensions
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.NULL_LITERAL:
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_11__["CompilerTypes"].OBJECT
        this.position_code = ''
        this.aux_type = _compiler_types__WEBPACK_IMPORTED_MODULE_11__["CompilerTypes"].NULL
        this.access_code = '0'
        this.dimensions = 0
        this.temporary = '0'
        this.is_array = false
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.NATIVE_FUNCTION_CALL:
      default: {
        const eTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
        eTranslator.translate(INode)

        /*
                 * Here we save all the temporary information of the parameters.
                 */
        this.type = eTranslator.getType()
        this.aux_type = eTranslator.aux_type
        this.setCode(eTranslator.getCode())
        this.access_code = eTranslator.getCode()
        this.temporary = eTranslator.getTemporary()
      }
        break
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/expression/relational-translator.js":
/*!*********************************************************************!*\
  !*** ./src/backend/translators/expression/relational-translator.js ***!
  \*********************************************************************/
/*! exports provided: RelationalTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RelationalTranslator", function() { return RelationalTranslator; });
/* harmony import */ var _arithmetic_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arithmetic-translator */ "./src/backend/translators/expression/arithmetic-translator.js");
/* harmony import */ var _expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../expression/expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _helpers_type_checking__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../helpers/type-checking */ "./src/backend/helpers/type-checking.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");











class RelationalTranslator extends _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_2__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode

    switch (INode.getType()) {
      // structure: Je, t1, t2, L1
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.LT:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.GT:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.LTEQ:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.GTEQ:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.EQEQ:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.NOTEQ:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.REQEQ:
        this.translateRelational(INode)
        break
      default: {
        const at = new _arithmetic_translator__WEBPACK_IMPORTED_MODULE_0__["ArithmeticTranslator"](this)
        at.translate(INode)
        this.setTemporary(at.getTemporary())
        this.setCode(at.getCode())
        this.type = at.getType()
        this.aux_type = at.aux_type
        this.dimensions = at.dimensions
        this.is_array = at.is_array
        this.position_code = at.position_code
      }
        break
    }
  }

  translateRelational (INode) {
    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)

    const leftTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
    const rightTranslator = new _expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)

    leftTranslator.translate(leftNode)
    rightTranslator.translate(rightNode)

    if (this.false_label == null && this.true_label == null) {
      this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

      this.type = _helpers_type_checking__WEBPACK_IMPORTED_MODULE_6__["TypeChecking"].RelationalTypeChecking(INode.getType(), leftTranslator.getType(),
        rightTranslator.getType())

      this.true_label = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel()
      this.false_label = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genLabel()

      let code = leftTranslator.getCode() + rightTranslator.getCode()

      if (leftTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].STRING && rightTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].STRING &&
         (INode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.EQEQ || INode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.NOTEQ)) {
        const pointerSize = _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].SymbolTable.getSize()
        const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()
        this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, tmp)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateStackAssign(tmp, leftTranslator.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', 'P', 2, tmp)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateStackAssign(tmp, rightTranslator.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].functionCall('java_string_equals')
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)
      } else {
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('relational expression')
        /**
          * hotfix for var
         */
        if (leftTranslator.type === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT && leftTranslator.aux_type === _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].Classes.getType('var')) {
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(leftTranslator.temporary, leftTranslator.temporary)
        }

        if (rightTranslator.type === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT && rightTranslator.aux_type === _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].Classes.getType('var')) {
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(rightTranslator.temporary, rightTranslator.temporary)
        }

        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].conditionalJMP(this.getRelationalOp(INode), leftTranslator.getTemporary(),
          rightTranslator.getTemporary(), this.true_label)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].unaryAssign('0', this.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].inconditionalJMP(this.false_label)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateLabel(this.true_label)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].unaryAssign('1', this.temporary)
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateLabel(this.false_label)
      }
      this.setCode(code)
      this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].BOOLEAN
      this.aux_type = null
      this.dimensions = 0
      this.is_array = false
      return
    }

    // the code for sum is + , left_par, right_par, temporary
    // this.temporary = Generator.genTemporary();

    let code = leftTranslator.getCode() + rightTranslator.getCode()
    // hotfix for strings
    if (leftTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].STRING && rightTranslator.getType() === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].STRING &&
         (INode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.EQEQ || INode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.NOTEQ)) {
      const pointerSize = _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].SymbolTable.getSize()
      const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

      this.temporary = _generators_generator__WEBPACK_IMPORTED_MODULE_5__["Generator"].genTemporary()

      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, tmp)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateStackAssign(tmp, leftTranslator.temporary)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].arithmeticOperation('+', 'P', 2, tmp)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateStackAssign(tmp, rightTranslator.temporary)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].functionCall('java_string_equals')
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateStackAccess('P', this.temporary)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].conditionalJMP('==', this.temporary, '1', this.true_label)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].inconditionalJMP(this.false_label)
    } else {
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('relational expression')

      if (leftTranslator.type === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT && leftTranslator.aux_type === _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].Classes.getType('var')) {
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(leftTranslator.temporary, leftTranslator.temporary)
      }

      if (rightTranslator.type === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT && rightTranslator.aux_type === _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].Classes.getType('var')) {
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateHeapAccess(rightTranslator.temporary, rightTranslator.temporary)
      }

      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].conditionalJMP(this.getRelationalOp(INode), leftTranslator.getTemporary(), rightTranslator.getTemporary(), this.true_label)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].inconditionalJMP(this.false_label)
    }
    // TODO: CATCH THIS ERROR AND ADD IT TO THE ERROR STACK
    /* try {
            this.type = TypeChecking.RelationalTypeChecking(INode.getType(), leftTranslator.getType(),
                    rightTranslator.getType());
        } catch (Exception e) {
            throw new Exception(e.getMessage() + this.parseSemanticError(this.iNode));
        } */
    this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].BOOLEAN
    this.aux_type = null
    this.dimensions = 0
    this.is_array = false
    this.setCode(code)
  }

  getRelationalOp (INode) {
    switch (INode.getType()) {
      // structure: Je, t1, t2, L1
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.LT:
        return '<'
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.GT:
        return '>'
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.LTEQ:
        return '<='
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.GTEQ:
        return '>='
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.REQEQ:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.EQEQ:
        return '=='
      default:
        return '!='
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/block-stmt-translator.js":
/*!*********************************************************************!*\
  !*** ./src/backend/translators/statements/block-stmt-translator.js ***!
  \*********************************************************************/
/*! exports provided: BlockStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlockStmtTranslator", function() { return BlockStmtTranslator; });
/* harmony import */ var _stmt_list_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stmt-list-translator */ "./src/backend/translators/statements/stmt-list-translator.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _stmt_base_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");




class BlockStmtTranslator extends _stmt_base_translator__WEBPACK_IMPORTED_MODULE_2__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  firstPass(INode){
    const stmtListTranslator = new _stmt_list_translator__WEBPACK_IMPORTED_MODULE_0__["StmtListTranslator"](this)
    stmtListTranslator.firstPass(INode)
  }

  translate (INode, enterScope = true) {
    this.iNode = INode

    const stmtListTranslator = new _stmt_list_translator__WEBPACK_IMPORTED_MODULE_0__["StmtListTranslator"](this)
    if (enterScope) { _backend__WEBPACK_IMPORTED_MODULE_1__["Backend"].ScopeStack.enterScope() }
    stmtListTranslator.setSiguiente(this.siguiente)
    stmtListTranslator.translate(INode)
    if (enterScope) { _backend__WEBPACK_IMPORTED_MODULE_1__["Backend"].ScopeStack.exitScope() }
    this.setCode(stmtListTranslator.getCode())
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/do-while-stmt-translator.js":
/*!************************************************************************!*\
  !*** ./src/backend/translators/statements/do-while-stmt-translator.js ***!
  \************************************************************************/
/*! exports provided: DoWhileStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DoWhileStmtTranslator", function() { return DoWhileStmtTranslator; });
/* harmony import */ var _statements_stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../statements/stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _statements_stmt_list_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../statements/stmt-list-translator */ "./src/backend/translators/statements/stmt-list-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _stmt_translator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./stmt-translator */ "./src/backend/translators/statements/stmt-translator.js");








class DoWhileStmtTranslator extends _statements_stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const thenStmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_6__["StmtTranslator"](this)
    thenStmtTranslator.firstPass(INode.getChild(0))
  }

  translate (INode) {
    // structure expr [0] stmt [1]
    this.iNode = INode
    /*
        * inicio = nuevaetiqueta () B.true = nuevaetiqueta () B.false = S.siguiente S 1
        * .siguiente = inicio S.codigo = etiqueta (inicio) || B.codigo || etiqueta
        * (B.true) || S 1 .codigo || gen (  goto  inicio)
        */

    const initial = _generators_generator__WEBPACK_IMPORTED_MODULE_1__["Generator"].genLabel()
    const out = _generators_generator__WEBPACK_IMPORTED_MODULE_1__["Generator"].genLabel()

    const expressionTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_4__["ExpressionTranslator"](this)

    expressionTranslator.setBooleanLabels(initial, this.siguiente)
    expressionTranslator.translate(INode.getChild(1))

    // before we execute the statements we save the cicles information
    _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles.push([initial, this.siguiente])

    const thenStmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_6__["StmtTranslator"](this)
    thenStmtTranslator.siguiente = out
    thenStmtTranslator.translate(INode.getChild(0))

    // here we set back all the code
    let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].generateLabel(initial)
    code += thenStmtTranslator.getCode()
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_3__["TranslatorHelpers"].generateLabel(out)
    code += expressionTranslator.getCode()

    _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles.pop()
    this.setCode(code)
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/expression-stmt-translator.js":
/*!**************************************************************************!*\
  !*** ./src/backend/translators/statements/expression-stmt-translator.js ***!
  \**************************************************************************/
/*! exports provided: ExpressionStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExpressionStmtTranslator", function() { return ExpressionStmtTranslator; });
/* harmony import */ var _translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../translator */ "./src/backend/translators/translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _variable_assign_stmt_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./variable-assign-stmt-translator */ "./src/backend/translators/statements/variable-assign-stmt-translator.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");





class ExpressionStmtTranslator extends _translator__WEBPACK_IMPORTED_MODULE_0__["Translator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode
    switch (INode.getChild(0).getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.EQ:
        const variableAssignStmtTranslator = new _variable_assign_stmt_translator__WEBPACK_IMPORTED_MODULE_2__["VariableAssignStmtTranslator"](this)
        variableAssignStmtTranslator.translate(INode.getChild(0))
        this.setCode(variableAssignStmtTranslator.getCode())
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.POSTDEC:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.POSTINC:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.PREDEC:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.PREINC:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.FUNCTION_CALL:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NATIVE_FUNCTION_CALL:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NEW:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NEW_ARRAY:
        const expressionTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_3__["ExpressionTranslator"](this)
        expressionTranslator.translate(INode.getChild(0))
        this.setCode(expressionTranslator.getCode())
        break
      default:
        throw `YOU CAN'T CALL THIS STATEMENT ${_ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].names[INode.getChild(0).getType()]} AT THIS LEVEL ${this.parseSemanticError(this.iNode)}`
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/for-stmt-translator.js":
/*!*******************************************************************!*\
  !*** ./src/backend/translators/statements/for-stmt-translator.js ***!
  \*******************************************************************/
/*! exports provided: ForStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ForStmtTranslator", function() { return ForStmtTranslator; });
/* harmony import */ var _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _stmt_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stmt-translator */ "./src/backend/translators/statements/stmt-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _classes_field_declaration_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../classes/field-declaration-translator */ "./src/backend/translators/classes/field-declaration-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _variable_assign_stmt_translator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./variable-assign-stmt-translator */ "./src/backend/translators/statements/variable-assign-stmt-translator.js");










class ForStmtTranslator extends _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  firstPass(INode){
    const stmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_1__["StmtTranslator"](this)
    const body = INode.getChild(INode.childrenSize() - 1)
    stmtTranslator.firstPass(body)
  }

  translate (INode) {
    this.iNode = INode

    let flag = false
    // declaration
    // expression
    // expression
    const decl = INode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.FOR_INIT)
    const condition = INode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.FOR_COND)
    const inc = INode.lookupByType(_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.FOR_UPDATE)
    const body = INode.getChild(INode.childrenSize() - 1)

    let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_5__["TranslatorHelpers"].comment('init of for')

    if (decl && decl.getChild(0).getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.VAR_DECLARATION) {
      flag = true
      _backend__WEBPACK_IMPORTED_MODULE_7__["Backend"].ScopeStack.enterScope()
      const varDecl = new _classes_field_declaration_translator__WEBPACK_IMPORTED_MODULE_4__["FieldDeclarationTranslator"](this)
      varDecl.translate(false, decl.getChild(0))
      code += varDecl.getCode()
    } else if (decl) { // expression list
      const exprL = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_3__["ExpressionTranslator"](this)
      for (const node of decl.getChild(0).getChildren()) {
        exprL.translate(node)
        code += exprL.getCode()
      }
    }

    const condition_label = _generators_generator__WEBPACK_IMPORTED_MODULE_6__["Generator"].genLabel(); const loop_begin_label = _generators_generator__WEBPACK_IMPORTED_MODULE_6__["Generator"].genLabel()
    const assign_label = _generators_generator__WEBPACK_IMPORTED_MODULE_6__["Generator"].genLabel()

    const conditionTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_3__["ExpressionTranslator"](this)
    if (condition) {
      conditionTranslator.setBooleanLabels(loop_begin_label, this.siguiente)
      conditionTranslator.translate(condition.getChild(0))
    }

    // before we execute the statements we save the cicles information
    _backend__WEBPACK_IMPORTED_MODULE_7__["Backend"].Display.Cicles.push([assign_label, this.siguiente])

    // we next need to get the stmt code
    const stmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_1__["StmtTranslator"](this)
    stmtTranslator.setSiguiente(assign_label)
    stmtTranslator.translate(body)

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_5__["TranslatorHelpers"].generateLabel(condition_label)
    code += (condition) ? conditionTranslator.getCode() : ''
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_5__["TranslatorHelpers"].generateLabel(loop_begin_label)
    code += stmtTranslator.getCode()

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_5__["TranslatorHelpers"].generateLabel(assign_label)

    if (inc) {
      const exprL = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_3__["ExpressionTranslator"](this)
      const eqExp = new _variable_assign_stmt_translator__WEBPACK_IMPORTED_MODULE_8__["VariableAssignStmtTranslator"](this)
      for (const node of inc.getChild(0).getChildren()) {
        if (node.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.EQ) {
          eqExp.translate(node)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_5__["TranslatorHelpers"].comment('for update expression translator eq')
          code += eqExp.getCode()
        } else {
          exprL.translate(node)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_5__["TranslatorHelpers"].comment('for update expression translator')
          code += exprL.getCode()
        }
      }
    }
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_5__["TranslatorHelpers"].inconditionalJMP(condition_label)
    _backend__WEBPACK_IMPORTED_MODULE_7__["Backend"].Display.Cicles.pop()
    if (flag) { _backend__WEBPACK_IMPORTED_MODULE_7__["Backend"].ScopeStack.exitScope() }
    this.setCode(code)
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/if-stmt-translator.js":
/*!******************************************************************!*\
  !*** ./src/backend/translators/statements/if-stmt-translator.js ***!
  \******************************************************************/
/*! exports provided: IfStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IfStmtTranslator", function() { return IfStmtTranslator; });
/* harmony import */ var _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _stmt_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stmt-translator */ "./src/backend/translators/statements/stmt-translator.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");






class IfStmtTranslator extends _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const thenStmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_1__["StmtTranslator"](this)
    thenStmtTranslator.firstPass(INode.getChild(1))
    if (INode.childrenSize() === 3) {
      thenStmtTranslator.firstPass(INode.getChild(2))
    }
  }

  translate (INode) {
    /**
         *  B.true = nuevaetiqueta ()
         *   B.false = nuevaetiqueta ()
         *   S 1 .siguiente = S 2 .siguiente = S.siguiente
         *   S.codigo = B.codigo
         *   || etiqueta (B.true) || S 1 .codigo
         *   || gen (  goto  S.siguiente)
         *   || etiqueta (B.false) || S 2 .codigo
         *
         */

    this.iNode = INode

    const expressionTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_2__["ExpressionTranslator"](this)
    expressionTranslator.setBooleanLabels(_generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genLabel(), _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genLabel())
    expressionTranslator.translate(INode.getChild(0))

    const thenStmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_1__["StmtTranslator"](this)
    thenStmtTranslator.siguiente = this.siguiente
    thenStmtTranslator.translate(INode.getChild(1))

    // here we set back all the code
    let code = `${expressionTranslator.getCode()}\n`
    // here we must check if code has a goto
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateLabel(expressionTranslator.getTrueLabel())
    code += thenStmtTranslator.getCode()
    // aqui si es true ejecuta el else
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].inconditionalJMP(this.siguiente)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].generateLabel(expressionTranslator.getFalseLabel())
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('etiqueta false')

    if (INode.childrenSize() === 3) {
      const elseStmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_1__["StmtTranslator"](this)
      elseStmtTranslator.setSiguiente(this.siguiente)
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('else body')
      elseStmtTranslator.translate(INode.getChild(2))
      code += elseStmtTranslator.getCode()
    }

    this.setCode(_generators_translator_helpers__WEBPACK_IMPORTED_MODULE_4__["TranslatorHelpers"].comment('inicio de if') + code)
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/jump-stmt-translator.js":
/*!********************************************************************!*\
  !*** ./src/backend/translators/statements/jump-stmt-translator.js ***!
  \********************************************************************/
/*! exports provided: JumpStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JumpStmtTranslator", function() { return JumpStmtTranslator; });
/* harmony import */ var _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _helpers_type_checking__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../helpers/type-checking */ "./src/backend/helpers/type-checking.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");









class JumpStmtTranslator extends _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    let code = ''
    this.iNode = INode

    switch (INode.getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.BREAK:
        if (_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles.length === 0) { throw Error(`UNABLE TO USE BREAK OUTSIDE OF A CICLE ${this.parseSemanticError(this.iNode)}`) }
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles[_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles.length - 1][1])
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.CONTINUE:
        if (_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles.length === 0) { throw Error(`UNABLE TO USE CONTINUE OUTSIDE OF A CICLE ${this.parseSemanticError(this.iNode)}`) }
        if (_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles[_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles.length - 1][0] == null) { throw Error(`THIS STATEMENT IS NOT ALLOWED AT THIS LEVEL${this.parseSemanticError(this.iNode)}`) }
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles[_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.Cicles.length - 1][0])
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.RETURN: {
        const functionData = _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.FunctionCallStack[_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.FunctionCallStack.length - 1]
        if (_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.OutLabel === '') { throw Error(`NO OUT LABEL SET FOR THIS FUNCTION/PROCEDURE, COMPILER ERROR ${this.parseSemanticError(this.iNode)}`) }
        if (INode.childrenSize() === 0) {
          if (functionData[2] !== _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].VOID) { throw Error(`A RETURN VALUE WAS EXPECTED FOR THIS FUNCTION${this.parseSemanticError(this.iNode)}`) }
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('return void')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.OutLabel)
        } else {
          const eTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
          const tmp = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genTemporary()
          eTranslator.translate(INode.getChild(0))
          // comment if not working

          if (functionData[2] === eTranslator.getType() && functionData[2] === _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].OBJECT) {
            if (functionData[3] !== eTranslator.aux_type) {
              if (eTranslator.getAuxType() !== _compiler_types__WEBPACK_IMPORTED_MODULE_7__["CompilerTypes"].NULL) { throw Error(`RETURN TYPE AND FUNCTION TYPE ARE NOT THE SAME${this.parseSemanticError(this.iNode)}`) }
            }
          } else if (eTranslator.type !== functionData[2] || eTranslator.aux_type !== functionData[3] ||
              eTranslator.dimensions !== functionData[4]) {
            // implicit cast
            if (eTranslator.dimensions !== 0) { throw Error(`RETURN TYPE AND FUNCTION TYPE ARE NOT THE SAME${this.parseSemanticError(this.iNode)}`) }
            if (_helpers_type_checking__WEBPACK_IMPORTED_MODULE_6__["TypeChecking"].ImplicitTypeChecking(functionData[2], eTranslator.getType()) === -1) {
              throw Error(`RETURN TYPE AND FUNCTION TYPE ARE NOT THE SAME${this.parseSemanticError(this.iNode)}`)
            }
          }

          code += eTranslator.getCode()
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('return statement')
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation('+', 'P', '1', tmp)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateStackAssign(tmp, eTranslator.getTemporary())
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.OutLabel)
          code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('fin return stmt')
        }
      }
        break
    }
    this.setCode(code)
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/stmt-base-translator.js":
/*!********************************************************************!*\
  !*** ./src/backend/translators/statements/stmt-base-translator.js ***!
  \********************************************************************/
/*! exports provided: StmtBaseTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StmtBaseTranslator", function() { return StmtBaseTranslator; });
/* harmony import */ var _translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../translator */ "./src/backend/translators/translator.js");


class StmtBaseTranslator extends _translator__WEBPACK_IMPORTED_MODULE_0__["Translator"] {

    constructor(parent) {
        super(parent);
        this.siguiente = null;
    }

    setSiguiente(label) {
        this.siguiente = label;
    }
}

/***/ }),

/***/ "./src/backend/translators/statements/stmt-list-translator.js":
/*!********************************************************************!*\
  !*** ./src/backend/translators/statements/stmt-list-translator.js ***!
  \********************************************************************/
/*! exports provided: StmtListTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StmtListTranslator", function() { return StmtListTranslator; });
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _translators_statements_stmt_base_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../translators/statements/stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _translators_statements_stmt_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../translators/statements/stmt-translator */ "./src/backend/translators/statements/stmt-translator.js");






class StmtListTranslator extends _translators_statements_stmt_base_translator__WEBPACK_IMPORTED_MODULE_2__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const stmtTranslator = new _translators_statements_stmt_translator__WEBPACK_IMPORTED_MODULE_4__["StmtTranslator"](this)
    for (const node of INode.getChildren()) {
      stmtTranslator.firstPass(node)
    }
  }

  translate (INode) {
    /**
         *
         * S 1 .siguiente = nuevaetiqueta () S 2 .siguiente = S.siguiente S.codigo = S 1
         * .codigo || etiqueta (S 1 .siguiente) || S 2 .codigo
         */

    this.iNode = INode
    let siguiente = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()
    const stmtTranslator = new _translators_statements_stmt_translator__WEBPACK_IMPORTED_MODULE_4__["StmtTranslator"](this)
    let code = ''

    let i = 0
    for (const node of this.iNode.getChildren()) {
      if (node.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.NO_OP) { continue }

      if (i === this.iNode.getChildren().length - 1) {
        stmtTranslator.setSiguiente(this.siguiente)
      } else {
        stmtTranslator.setSiguiente(siguiente)
      }
      stmtTranslator.translate(node)
      code += stmtTranslator.getCode()

      if (node.getType() !== _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.EXPRESSION_STMT &&
                node.getType() !== _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.VAR_DECLARATION &&
                node.getType() !== _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.BREAK && node.getType() !== _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.CONTINUE &&
                node.getType() !== _ast_tree_types__WEBPACK_IMPORTED_MODULE_3__["tree_types"].types.RETURN) {
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_1__["TranslatorHelpers"].generateLabel(siguiente)
        siguiente = _generators_generator__WEBPACK_IMPORTED_MODULE_0__["Generator"].genLabel()
      }
      i++
    }

    this.setCode(code)
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/stmt-translator.js":
/*!***************************************************************!*\
  !*** ./src/backend/translators/statements/stmt-translator.js ***!
  \***************************************************************/
/*! exports provided: StmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StmtTranslator", function() { return StmtTranslator; });
/* harmony import */ var _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _classes_field_declaration_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../classes/field-declaration-translator */ "./src/backend/translators/classes/field-declaration-translator.js");
/* harmony import */ var _classes_special_declaration_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../classes/special-declaration-translator */ "./src/backend/translators/classes/special-declaration-translator.js");
/* harmony import */ var _statements_if_stmt_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../statements/if-stmt-translator */ "./src/backend/translators/statements/if-stmt-translator.js");
/* harmony import */ var _statements_while_stmt_translator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../statements/while-stmt-translator */ "./src/backend/translators/statements/while-stmt-translator.js");
/* harmony import */ var _statements_do_while_stmt_translator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../statements/do-while-stmt-translator */ "./src/backend/translators/statements/do-while-stmt-translator.js");
/* harmony import */ var _block_stmt_translator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./block-stmt-translator */ "./src/backend/translators/statements/block-stmt-translator.js");
/* harmony import */ var _expression_stmt_translator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./expression-stmt-translator */ "./src/backend/translators/statements/expression-stmt-translator.js");
/* harmony import */ var _for_stmt_translator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./for-stmt-translator */ "./src/backend/translators/statements/for-stmt-translator.js");
/* harmony import */ var _jump_stmt_translator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./jump-stmt-translator */ "./src/backend/translators/statements/jump-stmt-translator.js");
/* harmony import */ var _switch_stmt_translator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./switch-stmt-translator */ "./src/backend/translators/statements/switch-stmt-translator.js");
/* harmony import */ var _throw_stmt_translator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./throw-stmt-translator */ "./src/backend/translators/statements/throw-stmt-translator.js");
/* harmony import */ var _try_catch_stmt_translator__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./try-catch-stmt-translator */ "./src/backend/translators/statements/try-catch-stmt-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
















class StmtTranslator extends _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    switch (INode.getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IF: {
        const ifStmtTranslator = new _statements_if_stmt_translator__WEBPACK_IMPORTED_MODULE_4__["IfStmtTranslator"](this)
        ifStmtTranslator.firstPass(INode)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.FOR: {
        const forStmtTranslator = new _for_stmt_translator__WEBPACK_IMPORTED_MODULE_9__["ForStmtTranslator"](this)
        forStmtTranslator.firstPass(INode)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.SWITCH: {
        const switchStmtTranslator = new _switch_stmt_translator__WEBPACK_IMPORTED_MODULE_11__["SwitchStmtTranslator"](this)
        switchStmtTranslator.firstPass(INode)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.WHILE: {
        const whileStmtTranslator = new _statements_while_stmt_translator__WEBPACK_IMPORTED_MODULE_5__["WhileStmtTranslator"](this)
        whileStmtTranslator.firstPass(INode)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DO: {
        const doWhileStmtTranslator = new _statements_do_while_stmt_translator__WEBPACK_IMPORTED_MODULE_6__["DoWhileStmtTranslator"](this)
        doWhileStmtTranslator.firstPass(INode)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.BLOCK: {
        const blockStmtTranslator = new _block_stmt_translator__WEBPACK_IMPORTED_MODULE_7__["BlockStmtTranslator"](this)
        blockStmtTranslator.firstPass(INode)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.RETURN:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.BREAK:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.CONTINUE:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.THROW:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.VAR_DECLARATION:
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.TRY: {
        const trycathcStmt = new _try_catch_stmt_translator__WEBPACK_IMPORTED_MODULE_13__["TryCatchStmtTranslator"](this)
        trycathcStmt.firstPass(INode)
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.VAR_DECLARATION_NO_TYPE: {
        const specialDeclaration = new _classes_special_declaration_translator__WEBPACK_IMPORTED_MODULE_3__["SpecialDeclarationTranslator"](this)
        specialDeclaration.firstPass = true
        specialDeclaration.translate(true, INode)
        this.setCode(specialDeclaration.getCode())
      }
    }
  }

  translate (INode) {
    this.iNode = INode

    switch (INode.getType()) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.EXPRESSION_STMT: {
        const expressionStmtTranslator = new _expression_stmt_translator__WEBPACK_IMPORTED_MODULE_8__["ExpressionStmtTranslator"](this)
        expressionStmtTranslator.translate(this.iNode)
        this.setCode(expressionStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.IF: {
        const ifStmtTranslator = new _statements_if_stmt_translator__WEBPACK_IMPORTED_MODULE_4__["IfStmtTranslator"](this)
        ifStmtTranslator.setSiguiente(this.siguiente)
        ifStmtTranslator.translate(this.iNode)
        this.setCode(ifStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.FOR: {
        const forStmtTranslator = new _for_stmt_translator__WEBPACK_IMPORTED_MODULE_9__["ForStmtTranslator"](this)
        forStmtTranslator.setSiguiente(this.siguiente)
        forStmtTranslator.translate(this.iNode)
        this.setCode(forStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.SWITCH: {
        const switchStmtTranslator = new _switch_stmt_translator__WEBPACK_IMPORTED_MODULE_11__["SwitchStmtTranslator"](this)
        switchStmtTranslator.setSiguiente(this.siguiente)
        switchStmtTranslator.translate(this.iNode)
        this.setCode(switchStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.WHILE: {
        const whileStmtTranslator = new _statements_while_stmt_translator__WEBPACK_IMPORTED_MODULE_5__["WhileStmtTranslator"](this)
        whileStmtTranslator.setSiguiente(this.siguiente)
        whileStmtTranslator.translate(this.iNode)
        this.setCode(whileStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.DO: {
        const doWhileStmtTranslator = new _statements_do_while_stmt_translator__WEBPACK_IMPORTED_MODULE_6__["DoWhileStmtTranslator"](this)
        doWhileStmtTranslator.setSiguiente(this.siguiente)
        doWhileStmtTranslator.translate(this.iNode)
        this.setCode(doWhileStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.BLOCK: {
        const blockStmtTranslator = new _block_stmt_translator__WEBPACK_IMPORTED_MODULE_7__["BlockStmtTranslator"](this)
        blockStmtTranslator.setSiguiente(this.siguiente)
        blockStmtTranslator.translate(this.iNode)
        this.setCode(blockStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.RETURN:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.BREAK:
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.CONTINUE: {
        const jumpStmtTranslator = new _jump_stmt_translator__WEBPACK_IMPORTED_MODULE_10__["JumpStmtTranslator"](this)
        jumpStmtTranslator.translate(this.iNode)
        this.setCode(jumpStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.THROW: {
        window.dispatchEvent('snackbar-messages', { detail: 'throw and try were not implemented correctly' })
        const throwStmtTranslator = new _throw_stmt_translator__WEBPACK_IMPORTED_MODULE_12__["ThrowStmtTranslator"](this)
        throwStmtTranslator.translate(this.iNode)
        this.setCode(throwStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.TRY: {
        window.dispatchEvent('snackbar-messages', { detail: 'throw and try were not implemented correctly' })
        const tryCatchStmtTranslator = new _try_catch_stmt_translator__WEBPACK_IMPORTED_MODULE_13__["TryCatchStmtTranslator"](this)
        tryCatchStmtTranslator.translate(this.iNode)
        this.setCode(tryCatchStmtTranslator.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.VAR_DECLARATION: {
        const varStmtDeclaration = new _classes_field_declaration_translator__WEBPACK_IMPORTED_MODULE_2__["FieldDeclarationTranslator"](this)
        varStmtDeclaration.translate(false, INode)
        this.setCode(varStmtDeclaration.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.VAR_DECLARATION_NO_TYPE: {
        const specialDeclaration = new _classes_special_declaration_translator__WEBPACK_IMPORTED_MODULE_3__["SpecialDeclarationTranslator"](this)
        specialDeclaration.translate(false, INode)
        this.setCode(specialDeclaration.getCode())
      }
        break
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_1__["tree_types"].types.NO_OP:
        break
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/switch-stmt-translator.js":
/*!**********************************************************************!*\
  !*** ./src/backend/translators/statements/switch-stmt-translator.js ***!
  \**********************************************************************/
/*! exports provided: SwitchStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SwitchStmtTranslator", function() { return SwitchStmtTranslator; });
/* harmony import */ var _statements_stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../statements/stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _backend_compiler_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../backend/compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _helpers_type_checking__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../helpers/type-checking */ "./src/backend/helpers/type-checking.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _stmt_list_translator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stmt-list-translator */ "./src/backend/translators/statements/stmt-list-translator.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");










class SwitchStmtTranslator extends _statements_stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const caseList = INode.getChild(1)
    const stmtTranslator = new _stmt_list_translator__WEBPACK_IMPORTED_MODULE_7__["StmtListTranslator"](this)
    for (const caseLabel of caseList.getChildren()) {
      stmtTranslator.firstPass(caseLabel.getChild(caseLabel.childrenSize() - 1))
    }
  }

  translate (INode) {
    /**
         * B.true = nuevaetiqueta () B.false = nuevaetiqueta () S 1 .siguiente = S 2
         * .siguiente = S.siguiente S.codigo = B.codigo || etiqueta (B.true) || S 1
         * .codigo || gen (  goto  S.siguiente) || etiqueta (B.false) || S 2 .codigo
         *
         */

    this.iNode = INode

    const eTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
    eTranslator.translate(INode.getChild(0))

    const isString = eTranslator.getType() === _backend_compiler_types__WEBPACK_IMPORTED_MODULE_4__["CompilerTypes"].STRING
    let strTmp = ''
    if (isString) {
      strTmp = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genTemporary()
    }
    // we initialize the code string, casue we will create a global container for
    // all switchs
    const testLabel = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genLabel(); let bodyCode = ''; let evalCode = ''; let stmtLabel; let testCode = ''
    // we set the eval code
    evalCode += eTranslator.getCode()
    evalCode += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(testLabel)

    testCode += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(testLabel)

    // ----------------------------------------------------------------------- //
    const caseList = INode.getChild(1)

    // We create the statement translator for every expression and for every
    // statement
    const caseTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
    const stmtTranslator = new _stmt_list_translator__WEBPACK_IMPORTED_MODULE_7__["StmtListTranslator"](this)
    stmtTranslator.setSiguiente(this.siguiente)

    let def = null; let defStmt = null
    let defLabel = ''
    _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].Display.Cicles.push([null, this.siguiente])
    for (const caseLabel of caseList.getChildren()) {
      // first we get all the constant values
      stmtLabel = _generators_generator__WEBPACK_IMPORTED_MODULE_3__["Generator"].genLabel()
      let j = 0
      for (let i = 0; i < caseLabel.childrenSize() - 1; i++) {
        if (caseLabel.getChild(i).getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_6__["tree_types"].types.DEFAULT) {
          def = caseLabel
          defStmt = caseLabel.getChild(caseLabel.childrenSize() - 1)
          defLabel = stmtLabel
        } else {
          caseTranslator.translate(caseLabel.getChild(i))
          _helpers_type_checking__WEBPACK_IMPORTED_MODULE_5__["TypeChecking"].RelationalTypeChecking(_ast_tree_types__WEBPACK_IMPORTED_MODULE_6__["tree_types"].types.EQEQ, eTranslator.getType(), caseTranslator.getType())
          testCode += caseTranslator.getCode()
          if (isString) {
            testCode += this.translateStringComparisson(strTmp, eTranslator.getTemporary(), caseTranslator.getTemporary())
            testCode += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].conditionalJMP('==', strTmp, '1', stmtLabel)
          } else { testCode += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].conditionalJMP('==', eTranslator.getTemporary(), caseTranslator.getTemporary(), stmtLabel) }
        }
        j++
      }

      stmtTranslator.translate(caseLabel.getChild(caseLabel.childrenSize() - 1))
      bodyCode += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('default label thing' + stmtLabel)
      bodyCode += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(stmtLabel)
      bodyCode += stmtTranslator.getCode()
      // bodyCode += TranslatorHelpers.inconditionalJMP(this.siguiente)
    }

    if (def != null && defStmt != null) {
      testCode += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('default label')
      testCode += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(defLabel)
      /* bodyCode += TranslatorHelpers.generateLabel(defLabel)
      bodyCode += stmtTranslator.getCode()
      bodyCode += TranslatorHelpers.inconditionalJMP(this.siguiente) */
    }
    _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].Display.Cicles.pop()
    this.setCode(`${evalCode}${bodyCode}${testCode}`)
  }

  translateStringComparisson (tmp, lTmp, rTmp) {
    const pointerSize = _backend__WEBPACK_IMPORTED_MODULE_8__["Backend"].SymbolTable.getSize()
    let code = ''

    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].moveStackPointer(true, pointerSize + 1)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation('+', 'P', 1, tmp)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateStackAssign(tmp, lTmp)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation('+', 'P', 2, tmp)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateStackAssign(tmp, rTmp)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].functionCall('java_string_equals')
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateStackAccess('P', tmp)
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].moveStackPointer(false, pointerSize + 1)

    return code
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/throw-stmt-translator.js":
/*!*********************************************************************!*\
  !*** ./src/backend/translators/statements/throw-stmt-translator.js ***!
  \*********************************************************************/
/*! exports provided: ThrowStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThrowStmtTranslator", function() { return ThrowStmtTranslator; });
/* harmony import */ var _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");







class ThrowStmtTranslator extends _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode
    let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('throw statement')
    const outLabel = ''
    if (_backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.TryCatchLabels.length === 0) {

    }
    if (INode.getChild(0).getType() !== _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__["tree_types"].types.NEW) {
      throw Error(`UNABLE TO CALL THROW WITHOUT CREATING A NEW ERROR${this.parseSemanticError(this.iNode)}`)
    } else {
      const errorType = INode.getChild(0).getChild(0).getValue().toLowerCase()
      let err = -1
      if ((err = _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.ErrorTypeByName.get(errorType))) {
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].setError(err);
        code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(outLabel);
      }
    }

    this.setCode(code)
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/try-catch-stmt-translator.js":
/*!*************************************************************************!*\
  !*** ./src/backend/translators/statements/try-catch-stmt-translator.js ***!
  \*************************************************************************/
/*! exports provided: TryCatchStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TryCatchStmtTranslator", function() { return TryCatchStmtTranslator; });
/* harmony import */ var _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _stmt_translator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./stmt-translator */ "./src/backend/translators/statements/stmt-translator.js");








class TryCatchStmtTranslator extends _stmt_base_translator__WEBPACK_IMPORTED_MODULE_0__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode
    let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('try catch stmt')
    // this one has a next label which is basically the out of the last
    const tryCatch = _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.createTryCatchEnv()

    const outLabels = []
    try {
      for (const catchNode of INode.getChild(1).getChildren()) {
        const errorType = catchNode.getChild(0).getChild(0).getValue()
        outLabels.push(tryCatch.createLabel(errorType))
      }
    } catch (e) {
      throw Error(`${e.message}${this.parseSemanticError(INode.getChild(1))}`)
    }

    // first we perform the try statements
    const tryStmt = new _stmt_translator__WEBPACK_IMPORTED_MODULE_6__["StmtTranslator"](this)
    tryStmt.setSiguiente(this.siguiente)
    tryStmt.translate(INode.getChild(0))

    code += tryStmt.getCode() + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].inconditionalJMP(this.siguiente)

    for (let i = 0; i < INode.getChild(1).childrenSize(); i++) {
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateLabel(outLabels[i])
      code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].unaryAssign('0', 'E')
      tryStmt.translate(INode.getChild(1).getChild(i).getChild(1))
      code += tryStmt.getCode()
    }

    // we exit
    _backend__WEBPACK_IMPORTED_MODULE_5__["Backend"].Display.exitTryCatchEnv()
    this.setCode(code)
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/variable-assign-stmt-translator.js":
/*!*******************************************************************************!*\
  !*** ./src/backend/translators/statements/variable-assign-stmt-translator.js ***!
  \*******************************************************************************/
/*! exports provided: VariableAssignStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VariableAssignStmtTranslator", function() { return VariableAssignStmtTranslator; });
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ast/tree-types */ "./src/backend/ast/tree-types.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _expression_identifier_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../expression/identifier-translator */ "./src/backend/translators/expression/identifier-translator.js");
/* harmony import */ var _expression_objects_object_access_translator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../expression/objects/object-access-translator */ "./src/backend/translators/expression/objects/object-access-translator.js");
/* harmony import */ var _expression_arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../expression/arrays/array-access-stmt-translator */ "./src/backend/translators/expression/arrays/array-access-stmt-translator.js");
/* harmony import */ var _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../expression/expression-base-translator */ "./src/backend/translators/expression/expression-base-translator.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../compiler-types */ "./src/backend/compiler-types.js");











class VariableAssignStmtTranslator extends _expression_expression_base_translator__WEBPACK_IMPORTED_MODULE_6__["ExpressionBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  translate (INode) {
    this.iNode = INode

    const leftNode = INode.getChild(0); const rightNode = INode.getChild(1)

    const expressionTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_1__["ExpressionTranslator"](this)
    expressionTranslator.translate(rightNode)
    this.code += expressionTranslator.getCode()

    /**
         * Here we check if there is a register in the left side, in case there is one
         * then the left hand side must only be either new or either null
         */

    if (leftNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.ARRAY_ACCESS) {
      const arrayAccessStmtTranslator = new _expression_arrays_array_access_stmt_translator__WEBPACK_IMPORTED_MODULE_5__["ArrayAccessStmtTranslator"](this)
      arrayAccessStmtTranslator.translate(INode.getChild(0))

      if (arrayAccessStmtTranslator.type !== expressionTranslator.type || arrayAccessStmtTranslator.aux_type != expressionTranslator.aux_type ||
                (expressionTranslator.is_array && !arrayAccessStmtTranslator.is_array) || (expressionTranslator.dimensions != arrayAccessStmtTranslator.dimensions)) {
        if (!this.typeChecking(arrayAccessStmtTranslator.type, arrayAccessStmtTranslator.aux_type, arrayAccessStmtTranslator.dimensions, expressionTranslator.type, expressionTranslator.aux_type, expressionTranslator.dimensions)) { throw `UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(INode)}` } else { this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('impilicit cast' + this.iNode.line + ' ' + this.iNode.column) }
      }

      this.code += arrayAccessStmtTranslator.position_code
      this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateHeapAssign(arrayAccessStmtTranslator.temporary, expressionTranslator.temporary)
      this.temporary = expressionTranslator.temporary
      this.type = expressionTranslator.type
      this.aux_type = expressionTranslator.aux_type
      this.dimensions = arrayAccessStmtTranslator.dimensions
      this.is_array = arrayAccessStmtTranslator.is_array
      // this.setCode(code);
      return
    }

    if (leftNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.DOT) {
      /*
             * FIX: HERE WE DO NOT USE SOME TEMPORARY AND LABELS, WE CAN FIX IT BY STORING
             * IT, BUT ONLY IF NEEDED
             */
      const oAccessTranslator = new _expression_objects_object_access_translator__WEBPACK_IMPORTED_MODULE_4__["ObjectAccessTranslator"](this)
      oAccessTranslator.translate(leftNode)

      this.code = expressionTranslator.code + oAccessTranslator.position_code
      if (oAccessTranslator.type !== expressionTranslator.type || oAccessTranslator.aux_type !== expressionTranslator.aux_type ||
                expressionTranslator.dimensions !== oAccessTranslator.dimensions) {
        if (!this.typeChecking(oAccessTranslator.type, oAccessTranslator.aux_type, oAccessTranslator.dimensions, expressionTranslator.type, expressionTranslator.aux_type, expressionTranslator.dimensions)) { throw `UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(INode)}` } else { this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('impilicit cast' + this.iNode.line + ' ' + this.iNode.column) }
      }

      // TODO: typechecking
      this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateHeapAssign(oAccessTranslator.temporary, expressionTranslator.temporary)
      this.temporary = oAccessTranslator.temporary
      this.type = expressionTranslator.type
      this.aux_type = expressionTranslator.aux_type
      this.dimensions = oAccessTranslator.dimensions
      this.is_array = oAccessTranslator.is_array
      return
    }

    if (leftNode.getType() === _ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.IDENTIFIER) {
      const idTrans = new _expression_identifier_translator__WEBPACK_IMPORTED_MODULE_3__["IdentifierTranslator"](this)
      idTrans.translate(leftNode)

      if (idTrans.isConstant) {
        throw new Error(`UNABLE TO REASIGN A VALUE TO A CONSTANT VARIABLE ${leftNode.getValue()}`)
      }

      // hotfix for var
      if (idTrans.aux_type === _backend__WEBPACK_IMPORTED_MODULE_7__["Backend"].Classes.getType('var')) {
        this.code = expressionTranslator.code + idTrans.code
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('variable assign in heap para var / global')
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateHeapAssign(idTrans.temporary, expressionTranslator.temporary)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].arithmeticOperation('+', idTrans.temporary, '1', idTrans.temporary)
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateHeapAssign(idTrans.temporary, (expressionTranslator.type === _compiler_types__WEBPACK_IMPORTED_MODULE_9__["CompilerTypes"].OBJECT) ? expressionTranslator.aux_type : expressionTranslator.type)
        this.temporary = expressionTranslator.temporary
        this.type = _compiler_types__WEBPACK_IMPORTED_MODULE_9__["CompilerTypes"].OBJECT
        this.aux_type = idTrans.aux_type
        this.dimensions = 0
        this.is_array = false
        return
      }
      // i changed the idTrans position_code to getCode()
      if (idTrans.type !== expressionTranslator.type || idTrans.aux_type !== expressionTranslator.aux_type ||
                expressionTranslator.dimensions !== idTrans.dimensions) {
        // try implicit cast
        if (!this.typeChecking(idTrans.type, idTrans.aux_type, idTrans.dimensions, expressionTranslator.type, expressionTranslator.aux_type, expressionTranslator.dimensions)) { throw Error(`UNABLE TO PERFORM ASSIGN, TYPES DIFFER${this.parseSemanticError(INode)}`) } else { this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('impilicit cast' + this.iNode.line + ' ' + this.iNode.column) }
      }

      this.code = expressionTranslator.code + idTrans.position_code

      if (idTrans.stack === 1) {
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('variable assign in stack')
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateStackAssign(idTrans.temporary, expressionTranslator.temporary)
        this.temporary = expressionTranslator.temporary
      } else {
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].comment('variable assign in heap')
        this.code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_2__["TranslatorHelpers"].generateHeapAssign(idTrans.temporary, expressionTranslator.temporary)
        this.temporary = expressionTranslator.temporary
      }

      this.type = idTrans.type
      this.aux_type = idTrans.aux_type
      this.dimensions = idTrans.dimensions
      this.is_array = idTrans.is_array
    }
  }
}


/***/ }),

/***/ "./src/backend/translators/statements/while-stmt-translator.js":
/*!*********************************************************************!*\
  !*** ./src/backend/translators/statements/while-stmt-translator.js ***!
  \*********************************************************************/
/*! exports provided: WhileStmtTranslator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhileStmtTranslator", function() { return WhileStmtTranslator; });
/* harmony import */ var _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../generators/translator-helpers */ "./src/backend/generators/translator-helpers.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../backend */ "./src/backend/backend.js");
/* harmony import */ var _expression_expression_translator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../expression/expression-translator */ "./src/backend/translators/expression/expression-translator.js");
/* harmony import */ var _statements_stmt_base_translator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../statements/stmt-base-translator */ "./src/backend/translators/statements/stmt-base-translator.js");
/* harmony import */ var _generators_generator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../generators/generator */ "./src/backend/generators/generator.js");
/* harmony import */ var _stmt_translator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./stmt-translator */ "./src/backend/translators/statements/stmt-translator.js");







class WhileStmtTranslator extends _statements_stmt_base_translator__WEBPACK_IMPORTED_MODULE_3__["StmtBaseTranslator"] {
  constructor (parent) {
    super(parent)
  }

  firstPass (INode) {
    const thenStmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_5__["StmtTranslator"](this)
    thenStmtTranslator.firstPass(INode.getChild(1))
  }

  translate (INode) {
    // structure expr [0] stmt [1]
    this.iNode = INode
    /*
            inicio = nuevaetiqueta ()
            B.true = nuevaetiqueta ()
            B.false = S.siguiente
            S 1 .siguiente = inicio
            S.codigo = etiqueta (inicio) || B.codigo
            || etiqueta (B.true) || S 1 .codigo
            || gen (  goto  inicio)
         */

    const initial = _generators_generator__WEBPACK_IMPORTED_MODULE_4__["Generator"].genLabel()

    const expressionTranslator = new _expression_expression_translator__WEBPACK_IMPORTED_MODULE_2__["ExpressionTranslator"](this)
    expressionTranslator.setBooleanLabels(_generators_generator__WEBPACK_IMPORTED_MODULE_4__["Generator"].genLabel(), this.siguiente)
    expressionTranslator.translate(INode.getChild(0))

    // before we execute the statements we save the cicles information
    _backend__WEBPACK_IMPORTED_MODULE_1__["Backend"].Display.Cicles.push([initial, this.siguiente])

    const thenStmtTranslator = new _stmt_translator__WEBPACK_IMPORTED_MODULE_5__["StmtTranslator"](this)
    thenStmtTranslator.siguiente = initial
    thenStmtTranslator.translate(INode.getChild(1))

    // here we set back all the code
    let code = _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_0__["TranslatorHelpers"].comment('inicio de while') + _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_0__["TranslatorHelpers"].generateLabel(initial)
    code += expressionTranslator.getCode()
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_0__["TranslatorHelpers"].generateLabel(expressionTranslator.getTrueLabel())
    code += thenStmtTranslator.getCode()
    code += _generators_translator_helpers__WEBPACK_IMPORTED_MODULE_0__["TranslatorHelpers"].inconditionalJMP(initial)

    // we get rid of them
    _backend__WEBPACK_IMPORTED_MODULE_1__["Backend"].Display.Cicles.pop()

    this.setCode(code)
  }
}


/***/ }),

/***/ "./src/backend/translators/translator.js":
/*!***********************************************!*\
  !*** ./src/backend/translators/translator.js ***!
  \***********************************************/
/*! exports provided: Translator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Translator", function() { return Translator; });
/* harmony import */ var _compiler_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../compiler-types */ "./src/backend/compiler-types.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../backend */ "./src/backend/backend.js");
/* harmony import */ var _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ast/tree-types */ "./src/backend/ast/tree-types.js");




class Translator {
  constructor (parent = null) {
    this.parent = parent
    this.code = ''
  }

  setCode (str) {
    this.code = str
  }

  getCode () {
    return this.code
  }

  parseSemanticError (node) {
    let tmp = node
    while (tmp.getLine() == -1 && tmp.getColumn() == -1) {
      tmp = tmp.getParent()
    }

    return ` AT LINE: ${tmp.getLine()}, COLUMN ${tmp.getColumn()} IN FILE ${tmp.file}`
  }

  typeChecking (type1, aux_type1, dims1, type2, aux_type2, dims2) {
    /***
         * 1 -> lhs
         * 2 -> rhs
         */

    const dims_ok = dims1 == dims2
    let type_ok = type1 == type2
    let aux_ok = aux_type1 == aux_type2

    if (!aux_ok && aux_type1 && aux_type2 === _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].NULL) {
      aux_ok = true
    } else if (!aux_ok && aux_type1 != null && aux_type2 != null) {
      // pueden existir aux_types primitivos
      // vamos a suponer que solo son objetos
      const tAux = _backend__WEBPACK_IMPORTED_MODULE_1__["Backend"].ClassTemplates.get(aux_type2)
      if (tAux === undefined) aux_ok = false
    }

    /**
         * PRIMITIVE TYPE AREA
         */
    if (!type_ok) {
      /* IMPLICIT CAST */
      if (type2 === _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].INTEGER && type1 === _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].DOUBLE) { type_ok = true }
      if (type2 === _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CHAR && type1 === _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].DOUBLE) { type_ok = true }
      if (type2 === _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CHAR && type1 === _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].INTEGER) { type_ok = true }
    }

    return dims_ok && type_ok && aux_ok
  }

  parseType (type) {
    switch (type) {
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.INTEGER:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].INTEGER
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.DOUBLE:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].DOUBLE
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.STRING:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].STRING
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.CHAR:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].CHAR
      case _ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.BOOLEAN:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].BOOLEAN
      default:
        return _compiler_types__WEBPACK_IMPORTED_MODULE_0__["CompilerTypes"].OBJECT
    }
  }
}


/***/ }),

/***/ "./src/components/base-form.js":
/*!*************************************!*\
  !*** ./src/components/base-form.js ***!
  \*************************************/
/*! exports provided: fetchQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchQuery", function() { return fetchQuery; });
const fetchQuery =  (url, method, body, content="application/json")=> {
    return new Promise(async (solve,reject)=>{
            const headers = new Headers({'Accept': 'application/json','Content-Type': content });

            fetch(url,{
                method: method,
                body: JSON.stringify(body),
                //eliminar
                mode: 'cors',
                headers: headers,
            })
            .then(response=>{
                
                if(!response.ok)
                {
                    reject(response)
                }
                solve(response.json());
            })
            .catch(err=>{
                reject(err);
            })
    });
}

/***/ }),

/***/ "./src/components/collapsible-element.js":
/*!***********************************************!*\
  !*** ./src/components/collapsible-element.js ***!
  \***********************************************/
/*! exports provided: CollapsibleElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CollapsibleElement", function() { return CollapsibleElement; });
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-element */ "./src/components/base-element.js");



const CollapsibleElement = class extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {

    _animation(event, el = null){
        
        if(this.disabled) return;
       
        let current = (event != null && event.currentTarget.parentNode.parentNode) || el;
        current.classList.toggle("active");
        this.classList.toggle("active");
        let panel = current.nextElementSibling;
        if(panel !== null) {
            
            if(panel.classList.contains("hide"))
                panel.classList.toggle('hide');
            else
                setTimeout(() => panel.classList.toggle('hide'),500);
            
            panel.classList.toggle("chosen");
        }
    }

    close(event = null){
        let current = (event !== null) ? event.currentTarget: this.$$('.accordion');
        this._animation(null,current)
    }

    open(){
        let current = this.disabled;
        this.disabled = false;
        this.close();
        this.disabled = current;
    }
}


/***/ }),

/***/ "./src/components/console/console-element.js":
/*!***************************************************!*\
  !*** ./src/components/console/console-element.js ***!
  \***************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");
/* harmony import */ var _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style-helpers/shared-styles */ "./src/components/style-helpers/shared-styles.js");
/* harmony import */ var _style_helpers_button_shared_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style-helpers/button-shared-styles */ "./src/components/style-helpers/button-shared-styles.js");
/* harmony import */ var _polymer_iron_pages_iron_pages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @polymer/iron-pages/iron-pages */ "./node_modules/@polymer/iron-pages/iron-pages.js");
/* harmony import */ var _polymer_paper_tabs_paper_tabs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @polymer/paper-tabs/paper-tabs */ "./node_modules/@polymer/paper-tabs/paper-tabs.js");
/* harmony import */ var _polymer_paper_tabs_paper_tab__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @polymer/paper-tabs/paper-tab */ "./node_modules/@polymer/paper-tabs/paper-tab.js");
/* harmony import */ var _error_console_error_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../error-console/error-component */ "./src/components/error-console/error-component.js");
/* harmony import */ var _heap_stack_heap_stack_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../heap-stack/heap-stack-component */ "./src/components/heap-stack/heap-stack-component.js");
/* harmony import */ var _symbol_table_symbol_table__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../symbol-table/symbol-table */ "./src/components/symbol-table/symbol-table.js");
/* harmony import */ var _backend_ast_graph_tree__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../backend/ast/graph-tree */ "./src/backend/ast/graph-tree.js");











class ConsoleElement extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  static get properties () {
    return {
      selected: { type: Number },
      console: { type: Array },
      errors: { type: Array },
      stack: { type: Array },
      heap: { type: Array },
      information: { type: Object },
      graph: { type: String },
      blockgraph: { type: String }
    }
  }

  constructor () {
    super()
    window.addEventListener('console-changed', (e) => {
      this.console = e.detail
      this.requestUpdate()
    })

    window.addEventListener('optimization-done', (e) => {
      // console.log(e.detail)
      this.optimization = e.detail
      this.requestUpdate()
    })

    window.addEventListener('graphblock-generated', (e) => {
      this.blockgraph = e.detail
      this.requestUpdate()
    })

    window.addEventListener('error-catched', (e) => {
      this.errors = [...e.detail]
      this.requestUpdate()
    })

    this.console = []
    this.queries = []
    this.errors = []
    this.optimization = []
    this.information = {}
  }

  static get styles () {
    return [
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__["MainSharedStyle"],
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__["SharedStyles"],
      _style_helpers_button_shared_styles__WEBPACK_IMPORTED_MODULE_2__["ButtonSharedStyles"],
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__["OptionStyle"],
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__["FormSharedStyle"],
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
                :host {
                    --paper-tabs-selection-bar-color: var(--default-primary-color);
                    margin: 10px 3% 25px;
                    width: 94%;
                    background: white;
                    box-shadow: var(--shadow-box-2dp-custom);
                    display: block;
                    padding: 5px 0 0 0;
                    height: 75vh;
                }

                paper-tab.iron-selected, paper-tab:hover {
                    background: var(--accent-color);
                    color: var(--light-primary-color);
                    border-radius: 5px 5px 0 0;
                }

                #textarea {
                    background: #021B2B;
                    color: cyan;
                    display: block;
                    width: 100%;
                    height: 100%;
                    resize: none;
                    border-radius: 0 0 5px 5px;
                    overflow: auto;
                }

                #textarea span{
                    display: block;
                    width: 100%;
                    height: 14px !important;
                    white-space: pre-wrap;
                }

                div {
                    height: 100%;
                    width:100%;
                }

                iron-pages {
                    display:block;
                    height: 90%;
                }

                graph-tree {
                  height:100%;
                  border-radius: 0 0 10px 10px;
                }

                paper-tab {
                  background: var(--light-primary-color);
                  border-radius: 5px 5px 0 0;
                  color: var(--accent-color);
                }
            `
    ]
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<paper-tabs .selected="${this.selected}" scrollable >
                        <paper-tab @click="${() => { this.selected = 0 }}">Consola</paper-tab>
                        <paper-tab @click="${() => { this.selected = 1 }}">Errores</paper-tab>
                        <paper-tab @click="${() => { this.selected = 2 }}">Memoria</paper-tab>
                        <paper-tab @click="${() => { this.selected = 3 }}">Simbolos</paper-tab>
                        <paper-tab @click="${() => { this.selected = 4 }}">Grafo</paper-tab>
                        <paper-tab @click="${() => { this.selected = 5 }}">Optimizacion</paper-tab>
                        <paper-tab @click="${() => { this.selected = 6 }}">Grafo de bloque</paper-tab>
                    </paper-tabs>
                    <iron-pages .selected="${this.selected}" id="main-content">
                        <div>
                            <div id="textarea" readonly class="overflowable">
                                ${this.console.map(item => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<span>${item}</span>`)}
                            </div>
                        </div>
                        <div>
                            <error-component .errors=${this.errors} ?optimization=${false}></error-component>
                        </div>
                        <div>
                            <heap-stack-component ></heap-stack-component>
                        </div>
                        <div>
                            <symbol-table .information="${this.information}"></symbol-table>
                        </div>
                        <div>
                            <graph-tree .src="${this.graph}"></graph-tree>
                        </div>
                        <div>
                            <error-component .errors=${this.optimization} ?optimization=${true}></error-component>
                        </div>
                        <div>
                            <graph-tree .src="${this.blockgraph}"></graph-tree>
                        </div>
                    </iron-pages>`
  }
}

window.customElements.define('console-element', ConsoleElement)


/***/ }),

/***/ "./src/components/editors/codemirror-editor/CSSMirrorEditorStyles.js":
/*!***************************************************************************!*\
  !*** ./src/components/editors/codemirror-editor/CSSMirrorEditorStyles.js ***!
  \***************************************************************************/
/*! exports provided: codeMirrorEditorCSS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "codeMirrorEditorCSS", function() { return codeMirrorEditorCSS; });
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-element */ "./src/components/base-element.js");



const codeMirrorEditorCSS = _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
    .CodeMirror {
    /* Set height, width, borders, and global font properties here */
    font-family: monospace;
    height: 300px;
    color: black;
    direction: ltr;
    }

    /* PADDING */

    .CodeMirror-lines {
    padding: 4px 0; /* Vertical padding around content */
    }
    .CodeMirror pre {
    padding: 0 4px; /* Horizontal padding of content */
    }

    .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
    background-color: white; /* The little square between H and V scrollbars */
    }

    /* GUTTER */

    .CodeMirror-gutters {
    border-right: 1px solid #ddd;
    background-color: #f7f7f7;
    white-space: nowrap;
    }
    .CodeMirror-linenumbers {}
    .CodeMirror-linenumber {
    padding: 0 3px 0 5px;
    min-width: 20px;
    text-align: right;
    color: #999;
    white-space: nowrap;
    }

    .CodeMirror-guttermarker { color: black; }
    .CodeMirror-guttermarker-subtle { color: #999; }

    /* CURSOR */

    .CodeMirror-cursor {
    border-left: 1px solid black;
    border-right: none;
    width: 0;
    }
    /* Shown when moving in bi-directional text */
    .CodeMirror div.CodeMirror-secondarycursor {
    border-left: 1px solid silver;
    }
    .cm-fat-cursor .CodeMirror-cursor {
    width: auto;
    border: 0 !important;
    background: #7e7;
    }
    .cm-fat-cursor div.CodeMirror-cursors {
    z-index: 1;
    }
    .cm-fat-cursor-mark {
    background-color: rgba(20, 255, 20, 0.5);
    -webkit-animation: blink 1.06s steps(1) infinite;
    -moz-animation: blink 1.06s steps(1) infinite;
    animation: blink 1.06s steps(1) infinite;
    }
    .cm-animate-fat-cursor {
    width: auto;
    border: 0;
    -webkit-animation: blink 1.06s steps(1) infinite;
    -moz-animation: blink 1.06s steps(1) infinite;
    animation: blink 1.06s steps(1) infinite;
    background-color: #7e7;
    }
    @-moz-keyframes blink {
    0% {}
    50% { background-color: transparent; }
    100% {}
    }
    @-webkit-keyframes blink {
    0% {}
    50% { background-color: transparent; }
    100% {}
    }
    @keyframes blink {
    0% {}
    50% { background-color: transparent; }
    100% {}
    }

    /* Can style cursor different in overwrite (non-insert) mode */
    .CodeMirror-overwrite .CodeMirror-cursor {}

    .cm-tab { display: inline-block; text-decoration: inherit; }

    .CodeMirror-rulers {
    position: absolute;
    left: 0; right: 0; top: -50px; bottom: -20px;
    overflow: hidden;
    }
    .CodeMirror-ruler {
    border-left: 1px solid #ccc;
    top: 0; bottom: 0;
    position: absolute;
    }

    /* DEFAULT THEME */

    .cm-s-default .cm-header {color: blue;}
    .cm-s-default .cm-quote {color: #090;}
    .cm-negative {color: #d44;}
    .cm-positive {color: #292;}
    .cm-header, .cm-strong {font-weight: bold;}
    .cm-em {font-style: italic;}
    .cm-link {text-decoration: underline;}
    .cm-strikethrough {text-decoration: line-through;}

    .cm-s-default .cm-keyword {color: #708;}
    .cm-s-default .cm-atom {color: #219;}
    .cm-s-default .cm-number {color: #164;}
    .cm-s-default .cm-def {color: #00f;}
    .cm-s-default .cm-variable,
    .cm-s-default .cm-punctuation,
    .cm-s-default .cm-property,
    .cm-s-default .cm-operator {}
    .cm-s-default .cm-variable-2 {color: #05a;}
    .cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}
    .cm-s-default .cm-comment {color: #a50;}
    .cm-s-default .cm-string {color: #a11;}
    .cm-s-default .cm-string-2 {color: #f50;}
    .cm-s-default .cm-meta {color: #555;}
    .cm-s-default .cm-qualifier {color: #555;}
    .cm-s-default .cm-builtin {color: #30a;}
    .cm-s-default .cm-bracket {color: #997;}
    .cm-s-default .cm-tag {color: #170;}
    .cm-s-default .cm-attribute {color: #00c;}
    .cm-s-default .cm-hr {color: #999;}
    .cm-s-default .cm-link {color: #00c;}

    .cm-s-default .cm-error {color: #f00;}
    .cm-invalidchar {color: #f00;}

    .CodeMirror-composing { border-bottom: 2px solid; }

    /* Default styles for common addons */

    div.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}
    div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}
    .CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }
    .CodeMirror-activeline-background {background: #e8f2ff;}

    /* STOP */

    /* The rest of this file contains styles related to the mechanics of
    the editor. You probably shouldn't touch them. */

    .CodeMirror {
    position: relative;
    overflow: hidden;
    background: white;
    }

    .CodeMirror-scroll {
    overflow: scroll !important; /* Things will break if this is overridden */
    /* 30px is the magic margin used to hide the element's real scrollbars */
    /* See overflow: hidden in .CodeMirror */
    margin-bottom: -30px; margin-right: -30px;
    padding-bottom: 30px;
    height: 100%;
    outline: none; /* Prevent dragging from highlighting the element */
    position: relative;
    }
    .CodeMirror-sizer {
    position: relative;
    border-right: 30px solid transparent;
    }

    /* The fake, visible scrollbars. Used to force redraw during scrolling
    before actual scrolling happens, thus preventing shaking and
    flickering artifacts. */
    .CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
    position: absolute;
    z-index: 6;
    display: none;
    }
    .CodeMirror-vscrollbar {
    right: 0; top: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    }
    .CodeMirror-hscrollbar {
    bottom: 0; left: 0;
    overflow-y: hidden;
    overflow-x: scroll;
    }
    .CodeMirror-scrollbar-filler {
    right: 0; bottom: 0;
    }
    .CodeMirror-gutter-filler {
    left: 0; bottom: 0;
    }

    .CodeMirror-gutters {
    position: absolute; left: 0; top: 0;
    min-height: 100%;
    z-index: 3;
    }
    .CodeMirror-gutter {
    white-space: normal;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    margin-bottom: -30px;
    }
    .CodeMirror-gutter-wrapper {
    position: absolute;
    z-index: 4;
    background: none !important;
    border: none !important;
    }
    .CodeMirror-gutter-background {
    position: absolute;
    top: 0; bottom: 0;
    z-index: 4;
    }
    .CodeMirror-gutter-elt {
    position: absolute;
    cursor: default;
    z-index: 4;
    }
    .CodeMirror-gutter-wrapper ::selection { background-color: transparent }
    .CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }

    .CodeMirror-lines {
    cursor: text;
    min-height: 1px; /* prevents collapsing before first draw */
    }
    .CodeMirror pre {
    /* Reset some styles that the rest of the page might have set */
    -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;
    border-width: 0;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    white-space: pre;
    word-wrap: normal;
    line-height: inherit;
    color: inherit;
    z-index: 2;
    position: relative;
    overflow: visible;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-variant-ligatures: contextual;
    font-variant-ligatures: contextual;
    }
    .CodeMirror-wrap pre {
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: normal;
    }

    .CodeMirror-linebackground {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    z-index: 0;
    }

    .CodeMirror-linewidget {
    position: relative;
    z-index: 2;
    padding: 0.1px; /* Force widget margins to stay inside of the container */
    }

    .CodeMirror-widget {}

    .CodeMirror-rtl pre { direction: rtl; }

    .CodeMirror-code {
    outline: none;
    }

    /* Force content-box sizing for the elements where we expect it */
    .CodeMirror-scroll,
    .CodeMirror-sizer,
    .CodeMirror-gutter,
    .CodeMirror-gutters,
    .CodeMirror-linenumber {
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    }

    .CodeMirror-measure {
    position: absolute;
    width: 100%;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    }

    .CodeMirror-cursor {
    position: absolute;
    pointer-events: none;
    }
    .CodeMirror-measure pre { position: static; }

    div.CodeMirror-cursors {
    visibility: hidden;
    position: relative;
    z-index: 3;
    }
    div.CodeMirror-dragcursors {
    visibility: visible;
    }

    .CodeMirror-focused div.CodeMirror-cursors {
    visibility: visible;
    }

    .CodeMirror-selected { background: #d9d9d9; }
    .CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }
    .CodeMirror-crosshair { cursor: crosshair; }
    .CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }
    .CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }

    .cm-searching {
    background-color: #ffa;
    background-color: rgba(255, 255, 0, .4);
    }

    /* Used to force a border model for a node */
    .cm-force-border { padding-right: .1px; }

    @media print {
    /* Hide the cursor when printing */
    .CodeMirror div.CodeMirror-cursors {
    visibility: hidden;
    }
    }

    /* See issue #2901 */
    .cm-tab-wrap-hack:after { content: ''; }

    /* Help users use markselection to safely style text background */
    span.CodeMirror-selectedtext { background: none; }

    .CodeMirror::-webkit-scrollbar {
                    height:4px;
                    width: 4px;
                    background-color: #F5F5F5;
                }

                .CodeMirror::-webkit-scrollbar-thumb {
                    background-color: rgba(10, 10, 10, 0.69);
                }

                .CodeMirror::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.3);
                    background-color: #F5F5F5;
                }
    `;


/***/ }),

/***/ "./src/components/editors/codemirror-editor/code-mirror-global.js":
/*!************************************************************************!*\
  !*** ./src/components/editors/codemirror-editor/code-mirror-global.js ***!
  \************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var codemirror_src_codemirror_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! codemirror/src/codemirror.js */ "./node_modules/codemirror/src/codemirror.js");

window.CodeMirror = codemirror_src_codemirror_js__WEBPACK_IMPORTED_MODULE_0__["default"];

/***/ }),

/***/ "./src/components/editors/codemirror-editor/editor-cql.js":
/*!****************************************************************!*\
  !*** ./src/components/editors/codemirror-editor/editor-cql.js ***!
  \****************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../base-element */ "./src/components/base-element.js");
/* harmony import */ var _CSSMirrorEditorStyles_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CSSMirrorEditorStyles.js */ "./src/components/editors/codemirror-editor/CSSMirrorEditorStyles.js");
/* harmony import */ var _code_mirror_global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./code-mirror-global.js */ "./src/components/editors/codemirror-editor/code-mirror-global.js");
/* harmony import */ var codemirror_src_codemirror_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! codemirror/src/codemirror.js */ "./node_modules/codemirror/src/codemirror.js");
/* harmony import */ var codemirror_mode_pascal_pascal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! codemirror/mode/pascal/pascal */ "./node_modules/codemirror/mode/pascal/pascal.js");
/* harmony import */ var codemirror_mode_pascal_pascal__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(codemirror_mode_pascal_pascal__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var codemirror_mode_clike_clike__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! codemirror/mode/clike/clike */ "./node_modules/codemirror/mode/clike/clike.js");
/* harmony import */ var codemirror_mode_clike_clike__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(codemirror_mode_clike_clike__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _polymer_paper_button_paper_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @polymer/paper-button/paper-button */ "./node_modules/@polymer/paper-button/paper-button.js");
/* harmony import */ var _native_components_custom_switch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../native-components/custom-switch */ "./src/components/native-components/custom-switch.js");
/* harmony import */ var _native_components_custom_simple_modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../native-components/custom-simple-modal */ "./src/components/native-components/custom-simple-modal.js");
/* harmony import */ var _style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../style-helpers/my-icons */ "./src/components/style-helpers/my-icons.js");
/* harmony import */ var _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../style-helpers/shared-styles */ "./src/components/style-helpers/shared-styles.js");
/* harmony import */ var _interpreter_code_3d_interpreter__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../interpreter/code-3d-interpreter */ "./src/components/interpreter/code-3d-interpreter.js");
/* harmony import */ var _interpreter_generators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../interpreter/generators */ "./src/components/interpreter/generators.js");
/* harmony import */ var _backend_parser_jsharp__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../backend/parser/jsharp */ "./src/backend/parser/jsharp.js");
/* harmony import */ var _backend_backend__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../backend/backend */ "./src/backend/backend.js");
/* harmony import */ var _parser_code3d__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../parser/code3d */ "./src/components/parser/code3d.js");
/* harmony import */ var _optimization_optimization_peephole__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../optimization/optimization-peephole */ "./src/components/optimization/optimization-peephole.js");
/* harmony import */ var _optimization_optimization_block__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../optimization/optimization-block */ "./src/components/optimization/optimization-block.js");



















class EditorCQL extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  constructor () {
    super()
    this.files = {}
    window.addEventListener('stopped', (e) => {
      this.started = 1
      this.highLight(e.detail)
    })
    window.addEventListener('finished', () => {
      this.started = 0
      this.debugged_line = -1
    })
    window.addEventListener('run', () => {
      if (this.started !== 0) this.debugg()
    })
    this.breakPoints = []
    this.started = 0
    this.debugged_line = 0
    this.parsed = false
    this.name = 'MainClass.j'
    this.src = ''
  }

  static get styles () {
    return [
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_10__["MainSharedStyle"],
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_10__["SharedStyles"],
      _CSSMirrorEditorStyles_js__WEBPACK_IMPORTED_MODULE_1__["codeMirrorEditorCSS"],
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
      .CodeMirror {
          border-top: 1px solid black;
      }

      .upload-btn-wrapper{
          grid-column: 1 / 3;
          border-bottom: 1px solid black;
          padding: 5px;
      }

      custom-accordion {
        margin: 20px;
        grid-column: 1 / 3;
      }

      :host{
          display:block;
          width: 95%;
          height:100%;
          margin-left: 2.5%;
          transition: transform 250ms;
          box-shadow: var(--shadow-box-2dp-custom);
          background: white;
          border-radius: 5px;
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(0,1fr);
      }


      :host(:hover) {
          box-shadow: var(--shadow-box-8dp-custom);
      }

      textarea{ height: 95%; width:100%;}

      .upload-btn-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
      }

      .btn {
          border: 2px solid gray;
          color: gray;
          background-color: white;
          padding: 8px 20px;
          border-radius: 5px;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
      }

      .upload-btn-wrapper input[type=file] {
          font-size: 100px;
          position: absolute;
          width: 60px;
          height: 40px;
          top: 12px;
          left: 9px;
          opacity: 0;
          cursor: pointer;
      }

      paper-button{
          fill: black;
          border-radius: 5px;
          border: 2px solid grey;
      }

      .CodeMirror.cm-s-default {
          background: lightcyan;
          border-radius: 0 0 5px 5px;
          cursor: text;
      }

      .CodeMirror-gutter-elt{
          left: 0 !important;
      }

      .highlight-class{
          background: #00fff2 !important;
      }

      custom-switch {
          margin-left: 15%;
      }

      .overflowable {
        with: 100%;
      }

      .icon{
        width: 36px;
        height: 36px;
        display: block;
        padding: 5px;
        margin-left: 90%;
        border-radius: 100%;
        background: white;
        cursor: pointer;
        transition: 250ms all;
      }

      .icon:hover{
        fill: white;
        background: var(--dark-primary-color);
        box-shadow: var(--shadow-elevation-4dp);
      }

      pre {
        display: inline-block;
        width: calc(100% - 30px);
      }

      .lines{
        width: 25px;
      }`
    ]
  }

  static get properties () {
    return {
      src: {
        type: String
      },
      code3D: {
        type: String
      },
      name: {
        type: String
      },
      breakPoints: {
        type: Array
      },
      started: {
        type: Number
      },
      debugged_line: {
        type: Number
      },
      temporary: {
        type: String
      },
      index: {
        type: Number
      },
      files: {
        type: Object
      },
      optCode: {
        type: String
      }
    }
  }

  firstUpdated () {
    this.editor = this._('pascaltext')
    this.editor3D = this._('code3D')
    window.Modal = this._('modal')

    this.code_editor = codemirror_src_codemirror_js__WEBPACK_IMPORTED_MODULE_3__["default"].fromTextArea(this.editor, {
      lineNumbers: true,
      gutters: ['CodeMirror-linenumbers', 'breakpoints'],
      matchBrackets: true,
      mode: 'text/x-java'
    })

    this.code_editor_3D = codemirror_src_codemirror_js__WEBPACK_IMPORTED_MODULE_3__["default"].fromTextArea(this.editor3D, {
      lineNumbers: true,
      gutters: ['CodeMirror-linenumbers', 'breakpoints'],
      matchBrackets: true,
      mode: 'javascript'
    })

    this.code_editor_3D.on('gutterClick', (cm, n) => {
      const info = cm.lineInfo(n)
      this.setBreakPoint(info.line, info.gutterMarkers === undefined)
      cm.setGutterMarker(n, 'breakpoints', info.gutterMarkers ? null : this.makeMarker())
    })

    this.code_editor.on('change', (e) => {
      this.src = e.getValue()

      if (this.name !== '' && this.files[this.name] !== undefined) {
        this.files[this.name].src = this.src
      }

      this.dispatchEvent(new CustomEvent('editor-valor-cambio', {
        detail: e.getValue()
      }))
    })

    this.code_editor_3D.on('change', (e) => {
      this.codigo3D = e.getValue()
    })

    this._('real-input').addEventListener('change', (e) => {
      e.preventDefault()

      const reader = new FileReader()

      reader.addEventListener('load', (event) => {
        const text = event.target.result
        this.code_editor.setValue(text)
      })

      reader.readAsText(this._('real-input').files[0])
      this.name = this._('real-input').files[0].name
      this.dispatchEvent(new CustomEvent('name-changed', {
        detail: this.name
      }))
      _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].CurrentFile = [this.name]
    })
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
            <div class="upload-btn-wrapper" style="grid-column: 1 / 3;">
                <button class="btn"><span>${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["fileUpload"]}</span></button>
                <input type="file" name="myfile" id="real-input"/>
                <paper-button @click="${this.translate}">${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["translateIcon"]}</paper-button>
                ${this.started === 0 ? _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<paper-button @click="${this.interpret}">${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["playIcon"]}</paper-button>` : ''}
                ${this.started !== 0 ? _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<paper-button @click="${this.debugg}">
                    ${this.started == 1 ? _style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["keepPlaying"] : _style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["stopIcon"]}</paper-button>` : ''}
                <paper-button @click="${this.save}">${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["saveIcon"]}</paper-button>
                <paper-button @click="${this.refresh}">${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["refreshIcon"]}</paper-button>
                <paper-button @click="${this.optimization}" title="Optimización por mirilla">${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["assembly"]}</paper-button>
                <paper-button @click="${this.blockOptimization}" title="Optimización por bloques">${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["dnsIcon"]}</paper-button>
                <custom-switch off="Normal" on="Por línea" message="Debugger" @click="${this.debuggMode}"></custom-switch>
                <custom-switch off="Object" on="Autocast" message="Var / Global" @click="${this.setVarGlobal}" style="margin: 0;" id="varglobal"></custom-switch>
            </div>
            <div style="grid-column:1 / 3; border-bottom: 1px solid black;">${this.debugged_line > 0 ? `Current Line: ${this.debugged_line}` : ''}</div>
            <div>
                <h3>J#</h3>
                <textarea id="pascaltext"></textarea>
            </div>
            <div id="container-3D">
                <h3>3D</h3>
                <textarea id="code3D"></textarea>
            </div>
            <custom-accordion id="optimization">
              <label style="line-height: 1.75;" slot="title-box">Codigo optimizado</label>
              <div slot="panel-box" style="max-height:50vh; overflow:auto; width:100%;" class="overflowable">
                <span class="icon" @click=${this.copyToClipboard} title="Copiar contenido">${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_9__["pasteboardIcon"]}</span>
                <pre class="lines">${this.optCode ? this.optCode.split('\n').map((el, idx) => idx + 1).slice(0, -1).join('.\n') : ''}</pre>
                <pre>${this.optCode ? this.optCode : ''}</pre>
              </div>
            </custom-accordion>
            <custom-simple-modal id="modal"></custom-simple-modal>
        `
  }

  async translate () {
    if (this.src === '') return
    try {
      if (_backend_parser_jsharp__WEBPACK_IMPORTED_MODULE_13__["jsharp"].parse(this.src)) {
        window.index = 0
        _backend_parser_jsharp__WEBPACK_IMPORTED_MODULE_13__["JSharpRoot"].setIndex(window.index)
        //

        try {
          this.graphViz(_backend_parser_jsharp__WEBPACK_IMPORTED_MODULE_13__["JSharpRoot"])
          // execute the root node
          this.code3D = _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].process(_backend_parser_jsharp__WEBPACK_IMPORTED_MODULE_13__["JSharpRoot"], this.files)
          this.code_editor_3D.setValue(this.code3D)

          let alldata = {}
          // we set the symbol table information of every class

          for (const sT of _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].ClassTemplates.keys()) {
            // sT es the key
            alldata = { ...alldata, ..._backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].ClassTemplates.get(sT).jsonify(sT) }
          }

          // we iterate through the main symbol table
          alldata = { ..._backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].SymbolTable.jsonify('globales') }

          _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].Root.setIndex(window.index)

          this.fire('info-setted', {
            symtab: alldata,
            errors: _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].Errores
          })

          // this.temporary = Generator.genTemporary()
          window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'Parsed succesfully' }))
        } catch (e) {
          // console.log(e)
          window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'Parse failed' }))
          if (this.isObject(e) && e.message) {
            this.code_editor_3D.setValue(e.message)

            this.fire('info-setted', {
              symtab: {},
              errors: (_backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].Errores.length === 0) ? [e.message] : _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].Errores.map(it => `[SEMANTICO: ${it} ]`)
            })

            return
          } else {
            this.code_editor_3D.setValue('OCURRIO UN ERROR, VEA LA CONSOLA DE ERRORES')
          }

          if (_backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].Root != null) {
            _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].Root.setIndex(window.index)
            this.graphViz(_backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].Root)
          }

          this.fire('info-setted', {
            symtab: {},
            errors: _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].Errores.map(it => `[SEMANTICO: ${it} ]`)
          })
        }
      }
    } catch (e) {
      console.log(e)
      window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'parsing failed' }))
      if (this.isObject(e) && e.hash) {
        let parse = `[${e.hash.token === 'INVALID' ? 'LEXICO' : 'SINTACTICO'} AT LINE ${e.hash.loc.first_line}`
        parse += ` COLUMN ${e.hash.loc.first_column} FOUND ${e.hash.text} EXPECTED: ${e.hash.expected.join(',')} IN FILE ${_backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].CurrentFile}]`
        window.dispatchEvent(new CustomEvent('error-catched', { detail: [parse] }))
      } else {
        window.dispatchEvent(new CustomEvent('error-catched', { detail: [e] }))
      }
    }
  }

  debuggMode (e) {
    window.dispatchEvent(new CustomEvent('debugger-mode', {
      detail: e.currentTarget.value()
    }))
  }

  async interpret () {
    if (this.codigo3D === '') return

    if (_parser_code3d__WEBPACK_IMPORTED_MODULE_15__["code3d"].parse(this.codigo3D)) {
      _interpreter_code_3d_interpreter__WEBPACK_IMPORTED_MODULE_11__["Interpreter"].setBreakPoint(this.breakPoints)
      _interpreter_code_3d_interpreter__WEBPACK_IMPORTED_MODULE_11__["Interpreter"].lineByLine = this.$$('custom-switch').value()
      window.executeLine = Object(_interpreter_generators__WEBPACK_IMPORTED_MODULE_12__["programGen"])(_parser_code3d__WEBPACK_IMPORTED_MODULE_15__["Root"])

      this.parsed = true
    }

    _interpreter_code_3d_interpreter__WEBPACK_IMPORTED_MODULE_11__["Interpreter"].executeProgram(this.temporary)
  }

  save () {
    // este método es para write
    if (this.files[this.name] !== undefined) {
      this.files[this.name].src = this.code_editor.getValue()
    }
    var file = new Blob([this.code_editor.getValue()], {
      type: 'txt'
    })
    if (window.navigator.msSaveOrOpenBlob) // IE10+
    { window.navigator.msSaveOrOpenBlob(file, filename) } else { // Others
      var a = document.createElement('a')
      var url = URL.createObjectURL(file)
      a.href = url
      a.download = this.name
      document.body.appendChild(a)
      a.click()
      setTimeout(function () {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 0)
    }
  }

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  setBreakPoint (_info, _delete) {
    if (_delete) {
      this.breakPoints.push(_info + 1)
      this.breakPoints.sort()
    } else {
      const idx = this.breakPoints.indexOf(_info + 1)
      this.breakPoints.splice(idx, 1)
      this.breakPoints.sort()
      _interpreter_code_3d_interpreter__WEBPACK_IMPORTED_MODULE_11__["Interpreter"].setBreakPoint(this.breakPoints)
    }
  }

  makeMarker () {
    const marker = document.createElement('div')
    marker.style.color = '#822'
    marker.innerHTML = '●'
    return marker
  }

  set3D (str) {
    this.codigo3D = str
    this.code_editor_3D.setValue(str)
  }

  refresh () {
    this.breakPoints = []
    _interpreter_code_3d_interpreter__WEBPACK_IMPORTED_MODULE_11__["Interpreter"].setBreakPoint(this.breakPoints)
    Array.from(this.$$$('.highlight-class')).forEach(it => it.classList.remove('highlight-class'))
  }

  highLight (index) {
    const div = Array.from(this.$$$('#container-3D .CodeMirror-linenumber.CodeMirror-gutter-elt')).find((it) => Number(it.textContent) == index)
    if (div) div.parentNode.parentNode.classList.add('highlight-class')
    this.debugged_line = index
  }

  debugg () {
    this.started = 1
    Array.from(this.$$$('.highlight-class')).forEach(it => it.classList.remove('highlight-class'))
    _interpreter_code_3d_interpreter__WEBPACK_IMPORTED_MODULE_11__["Interpreter"].onResolve(true)
  }

  graphViz (node) {
    this.graph = `Digraph G {
            ${node.writeNode()}
        }`

    this.fire('graphviz-generated', this.graph)
  }

  blockOptimization () {
    if (this.codigo3D === '') return

    if (_parser_code3d__WEBPACK_IMPORTED_MODULE_15__["code3d"].parse(this.codigo3D)) {
      _optimization_optimization_block__WEBPACK_IMPORTED_MODULE_17__["optimizationByBlock"].divideByBlocks(_parser_code3d__WEBPACK_IMPORTED_MODULE_15__["Root"])
    }

    window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'optimization by blocks done' }))
  }

  openFile (e) {
    this.name = e
    this.src = this.files[e].src
    this.code_editor.setValue(this.src)
    _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].CurrentFile = [e]
    this.requestUpdate()
  }

  optimization () {
    if (this.codigo3D === '') return

    if (_parser_code3d__WEBPACK_IMPORTED_MODULE_15__["code3d"].parse(this.codigo3D)) {
      _optimization_optimization_peephole__WEBPACK_IMPORTED_MODULE_16__["peepHole"].programOptimization(_parser_code3d__WEBPACK_IMPORTED_MODULE_15__["Root"])
    }
    let tmpNode = _parser_code3d__WEBPACK_IMPORTED_MODULE_15__["Root"].next
    this.optCode = _parser_code3d__WEBPACK_IMPORTED_MODULE_15__["Root"].toString()
    while (tmpNode != null) {
      this.optCode += tmpNode.toString()
      tmpNode = tmpNode.next
    }
  }

  setVarGlobal () {
    _backend_backend__WEBPACK_IMPORTED_MODULE_14__["Backend"].VarFlag = this._('varglobal').value()
  }

  copyToClipboard () {
    const el = document.createElement('textarea')
    el.value = this.optCode
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}

customElements.define('editor-cql', EditorCQL)


/***/ }),

/***/ "./src/components/editors/codemirror-editor/import-component/import-component.js":
/*!***************************************************************************************!*\
  !*** ./src/components/editors/codemirror-editor/import-component/import-component.js ***!
  \***************************************************************************************/
/*! exports provided: ImportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportComponent", function() { return ImportComponent; });
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../base-element */ "./src/components/base-element.js");


class ImportComponent extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  constructor () {
    super()
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.')
    }

    this.output = {}
  }

  static get styles () {
    return [
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
        :host {
          height: fit-content;
          display: block;
          padding: 25px;
          width: 100%;
        }

        input {
          margin: auto;
          display: block;
          outline: none;
        }

        .objects{
          cursor: pointer;
          margin-top: 10px;
        }

        .objects > div{
            background: var(--default-primary-color);
            padding: 5px;
            color: white;
        }

        .objects > div:first-child{
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }

        .objects > div:last-child{
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }

        .objects > div:hover{
          background: var(--accent-color);
          transition: 250 ease-in;
          font-size: 2em;
          height: 36px;
        }

        span{
          float: right;
          display:block;
          padding: 1px 8px;
          box-sizing: border-box;
        }

        span:hover{
          color: var(--accent-color);
          background: white;
          border-radius:5px;
          transition: 250 ease-in;
          font-weight: bolder;
        }
      `
    ]
  }

  static get properties () {
    return {
      output: { type: Object }
    }
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<input type="file" webkitdirectory="" directory="" @change=${this.handleFileSelect}>
                <div class="objects"> ${this.isObjectEmpty(this.output) ? '' : Object.keys(this.output).map(it => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
                    <div @dblclick=${this.openFile} key="${it}">
                      ${it}
                      <span @click=${this.deleteFile} key="${it}">X</span>
                    </div>`)}
                </div>`
  }

  deleteFile (e) {
    delete this.output[e.currentTarget.getAttribute('key')]
    this.requestUpdate()
    this.fire('update-import', this.output)
  }

  openFile (e) {
    this.fire('open-file', e.currentTarget.getAttribute('key'))
  }

  handleFileSelect (e) {
    const reader = []
    const self = this

    for (const file of Array.from(e.target.files)) {
      if (file.webkitRelativePath.includes('.j')) {
        reader.push(new FileReader())
        reader[reader.length - 1].addEventListener('load', function (e) {
          const relative = file.webkitRelativePath.split('/')[0]
          self.output[file.name.toLowerCase()] = {
            src: e.target.result,
            relative: file.webkitRelativePath.split(relative).join('.'),
            name: file.name.toLowerCase().split('.')[0],
            parsed: false
          }
          self.requestUpdate()
          self.fire('update-import', self.output)
        })
        reader[reader.length - 1].readAsText(file)
      }
    };
  }
}

customElements.define('import-component', ImportComponent)


/***/ }),

/***/ "./src/components/error-console/error-component.js":
/*!*********************************************************!*\
  !*** ./src/components/error-console/error-component.js ***!
  \*********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");
/* harmony import */ var _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style-helpers/shared-styles */ "./src/components/style-helpers/shared-styles.js");



class ErrorComponent extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  static get properties () {
    return {
      optimization: { type: Boolean },
      errors: { type: Array }
    }
  }

  static get styles () {
    return [
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__["SharedStyles"],
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
        :host {
            --paper-tabs-selection-bar-color: var(--default-primary-color);
            height: 90%;
            background: white;
            display: block;
            padding: 5px 0 0 0;
            height: 100%;
        }

        div.row {
            width: 100%;
        }

        div.row:nth-child(n){
          background: #e0fdfd;
        }
        div.row:nth-child(2n){
          background: #2285c3;
          color: white;
        }

        div.row > div, div.header > div {
            width: 24%;
            font-size: 14px;
            font-weight: 500;
            display: inline-block;
        }

        main {
            overflow: auto;
            height: 100%;
        }
      `
    ]
  }

  constructor () {
    super()
    this.errors = []
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
      <main id="main-content">
            ${!this.optimization ? _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
              ${this.errors.map((it) => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<div class="row">
                    ${it}
                </div>`)}` : _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<div class="row header">
                  <div>Regla</div><div>Linea</div><div>Antiguo</div><div>Nuevo</div>
                </div>
                ${this.errors.map((it) => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<div class="row">
                  <div>${it.rule}</div><div>${it.line}</div><div>${it.oldval}</div><div>${it.newval}</div>
              </div>`)}`
            }
      </main>
    `
  }
}

window.customElements.define('error-component', ErrorComponent)


/***/ }),

/***/ "./src/components/heap-stack/heap-stack-component.js":
/*!***********************************************************!*\
  !*** ./src/components/heap-stack/heap-stack-component.js ***!
  \***********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");
/* harmony import */ var _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style-helpers/shared-styles */ "./src/components/style-helpers/shared-styles.js");


// import { floatIcon } from '../style-helpers/my-icons'

class HeapStackComponent extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  static get properties () {
    return {
      E: { type: Number },
      heap: { type: Array },
      stack: { type: Array },
      heapP: { type: Number },
      stackP: { type: Number },
      temporaries: { type: Object }
    }
  }

  static get styles () {
    return [
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__["SharedStyles"],
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__["MainSharedStyle"],
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
        :host {
            --paper-tabs-selection-bar-color: var(--default-primary-color);
            background: white;
            display: block;
            padding: 5px 0 0 0;
            height: 100%;
        }

        div.row {
            width: 100%;
        }

        div.row:nth-child(n){
            background: var(--light-primary-color);
        }
        div.row:nth-child(2n){
            background: var(--dark-primary-color);
        }

        div.row > div, div.header > div {
            width: 24%;
            font-size: 14px;
            font-weight: 500;
            display: inline-block;
        }

        main {
            overflow: auto;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(3,1fr);
            grid-gap: 25px;
            background: #021B2B;
            padding: 25px;
        }

        span {
            display: block;
            border: 1px solid gray;
        }

        span:first-child {
            background: var(--default-primary-color);
            text-align: center;
            color: white;
            font-weight: 800;
        }

        .line {
          display: grid;
          grid-template-columns: 1fr 4fr;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        main div {
            width: 50%;
            background: var(--dark-primary-color);
            color: white;
            margin: auto;
            text-align: center;
            margin-bottom: 25px;
        }

        span.occupied {
          background-color: white;
          color: black;
          font-weight: 500;
        }

        .current-info {
          position: -webkit-sticky; /* Safari */
          position: sticky;
          top: 0;
          grid-column: 1 / 4;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          background:#021B2B;
          margin: 0;
          padding: 25px 0;
          width: 100%;
          border-radius: 5px;
        }

        .current-info > div {
          margin: 0 auto;
        }

        #main-content{
          border-radius: 0 0 5px 5px;
        }
      `
    ]
  }

  constructor () {
    super()
    this.stack = new Array(5000).fill(-1)
    this.heap = new Array(5000).fill(-1)
    this.temporaries = {}
    this.tmp = ''
    this.stackP = 0
    this.heapP = 0
    window.addEventListener('heap-changed', (e) => { this.heap = e.detail; this.requestUpdate() })
    window.addEventListener('stack-changed', (e) => { this.stack = e.detail; this.requestUpdate() })
    window.addEventListener('temporaries-changed', (e) => { this.temporaries = e.detail.temporaries; this.tmp = e.detail.tmp; this.requestUpdate() })
    window.addEventListener('heap-pointer-changed', (e) => this.heapP = e.detail)
    window.addEventListener('stack-pointer-changed', (e) => this.stackP = e.detail)
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
      <main id="main-content">
            <div class="current-info">
                <div>
                  <span>Heap Pointer</span>
                  <span>${this.heapP}</span>
                </div>
                <div>
                  <span>Stack Pointer</span>
                  <span>${this.stackP}</span>
                </div>
                <div>
                  <span>Last Temporary</span>
                  <span>${this.tmp} : ${this.temporaries[this.tmp]}</span>
                </div>
                <div>
                  <span>E</span>
                  <span>${this.E}</span>
                </div>
            </div>
            <div>
                <span>HEAP</span>
                ${this.heap.map((it, index) => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<div class="line"><span>${index}:</span><span class="${it != -1 ? 'occupied' : 'free'}">${it}</span></div>`)}
            </div>
            <div>
                <span>STACK</span>
                ${this.stack.map((it, index) => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<div class="line"><span>${index}:</span><span class="${it != -1 ? 'occupied' : 'free'}">${it}</span></div>`)}
            </div>
            <div style="margin: 0 auto auto;">
                <span>TEMPORARY</span>
                ${Object.keys(this.temporaries).map((it) => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<div class="line"><span>${it}:</span><span>${this.temporaries[it]}</span></div>`)}
            </div>
      </main>
    `
  }

  /* floatWindow (e) {
    e.currentTarget.parentNode.style.position = (e.currentTarget.parentNode.style.position == 'absolute') ? 'relative' : 'absolute'
    e.currentTarget.parentNode.style.background = (e.currentTarget.parentNode.style.background != 'white') ? 'white' : '#021B2B'
  } */
}

window.customElements.define('heap-stack-component', HeapStackComponent)


/***/ }),

/***/ "./src/components/interpreter/code-3d-interpreter.js":
/*!***********************************************************!*\
  !*** ./src/components/interpreter/code-3d-interpreter.js ***!
  \***********************************************************/
/*! exports provided: Interpreter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Interpreter", function() { return Interpreter; });
/* harmony import */ var _helper_structures__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper-structures */ "./src/components/interpreter/helper-structures.js");
/* harmony import */ var _parser_ast_ast_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parser/ast/ast-node */ "./src/components/parser/ast/ast-node.js");
/* harmony import */ var _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../parser/ast/tree-types */ "./src/components/parser/ast/tree-types.js");




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
      _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInConsole('null pointer exception...', true)
      console.log(astNode.line, astNode.column)
      executeLine.next(new _parser_ast_ast_node__WEBPACK_IMPORTED_MODULE_1__["AstNode"]('exit', null, -1, -1))
    }
    return _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].heap[value]
  }

  stackAccess (astNode) {
    const value = this.leftHandAccess(astNode.getChild(0))
    return _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].stack[value]
  }

  assignment (astNode) {
    const value = this.leftHandAccess(astNode.getChild(1))

    switch (astNode.getChild(0).type) {
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.tmp:
        // tmp
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].data[astNode.getChild(0).value] = value
        window.dispatchEvent(new CustomEvent('temporaries-changed', { detail: { temporaries: _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].data, tmp: astNode.getChild(0).value } }))
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.sp:
        // sp
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].stack_pointer = parseInt(value)
        window.dispatchEvent(new CustomEvent('stack-pointer-changed', { detail: _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].stack_pointer }))
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.hp:
        // hp
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].heap_pointer = parseInt(value)
        window.dispatchEvent(new CustomEvent('heap-pointer-changed', { detail: _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].heap_pointer }))
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.stack:
        // stack
        const stack_index = this.leftHandAccess(astNode.getChild(0).getChild(0))
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInStack(stack_index, value)
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.heap:
        // heap
        const heap_index = this.leftHandAccess(astNode.getChild(0).getChild(0))
        if (heap_index == -1 || heap_index == 0) {
          _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInConsole('null pointer exception...', true)
          executeLine.next(new _parser_ast_ast_node__WEBPACK_IMPORTED_MODULE_1__["AstNode"]('exit', null, -1, -1))
        }
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInHeap(heap_index, value)
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
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['+']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['-']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['*']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['%']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['/']:
        return this.aritmethicStmt(astNode)
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.number:
        return astNode.value
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.tmp:
        return _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].getTemporary(astNode.value.toString().toLowerCase())
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.heap:
        return this.heapAccess(astNode)
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.stack:
        return this.stackAccess(astNode)
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.hp:
        return _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].heap_pointer
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.sp:
        return _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].stack_pointer
    }
  }

  aritmethicStmt (astNode) {
    const left = this.leftHandAccess(astNode.getChild(0))
    const right = this.leftHandAccess(astNode.getChild(1))

    switch (astNode.type) {
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['+']:
        return left + right
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['-']:
        return left - right
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['*']:
        return left * right
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['%']:
        return Math.fmod(left, right)
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['/']:
        return parseFloat(left / right).toPrecision(2)
    }

    return -1
  }

  printStmt (astNode) {
    const par = astNode.value
    const value = this.leftHandAccess(astNode.getChild(0))

    switch (par) {
      case '"%c"':
        if (value === 10) { _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInConsole('', true) } else if (value != 13) { _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInConsole(String.fromCharCode(value)) }
        break
      case '"%i"':
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInConsole(value)
        break
      case '"%d"':
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInConsole(Number(value).toFixed(2))
        break
    }
  }

  jmpInconditionalStmt (astNode) {
    const label = astNode.value.toString()
    const nodo = _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].getNode(label)

    executeLine.next(nodo.last).value
  }

  jmpConditionalStmt (astNode) {
    const leftVal = this.leftHandAccess(astNode.getChild(0))
    const rightVal = this.leftHandAccess(astNode.getChild(1))
    const label = astNode.value
    const nodo = _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].getNode(label)

    switch (astNode.type) {
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['==']:
        if (leftVal === rightVal) { executeLine.next(nodo).value }
        // je
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['<>']:
        // jne
        if (leftVal !== rightVal) { executeLine.next(nodo).value }
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['>']:
        // jg
        if (leftVal > rightVal) { executeLine.next(nodo).value }
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['<']:
        // jl
        if (leftVal < rightVal) { executeLine.next(nodo).value }
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['>=']:
        // jge
        if (leftVal >= rightVal) { executeLine.next(nodo).value }
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['<=']:
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

    _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].reset()

    while ((astNode = executeLine.next().value)) {
      if (flag) {
        // Structures.createAllTemporary(temporary)
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].labels.clear()
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].mapLabels(astNode)
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].mapMethods(astNode)
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
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.var:
          this.declarationStmt(astNode)
          break
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.goto:
          this.jmpInconditionalStmt(astNode)
          break
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['<']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['>']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['<=']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['>=']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['<>']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['==']:
          this.jmpConditionalStmt(astNode)
          break
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types['=']:
          this.assignment(astNode)
          break
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.print:
          // print
          this.printStmt(astNode)
          break
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.end:
          executeLine.next(_helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].lastNode())
          break
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_2__["tree_types"].types.call:
          // call
          _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].insertInCallStack(astNode)
          const method_node = _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].methods.get(astNode.value)
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
        _helper_structures__WEBPACK_IMPORTED_MODULE_0__["Structures"].createTemporary[astNode.getChild(i).value] = -1
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

const Interpreter = new Code3DInterpreter()


/***/ }),

/***/ "./src/components/interpreter/generators.js":
/*!**************************************************!*\
  !*** ./src/components/interpreter/generators.js ***!
  \**************************************************/
/*! exports provided: programGen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "programGen", function() { return programGen; });
const programGen = function * program (ast) {
  var astNode = ast

  while (astNode && astNode.type !== 26) {
    var reset = yield astNode
    astNode = astNode.next

    if (reset) {
      astNode = reset
    }
  }
}


/***/ }),

/***/ "./src/components/interpreter/helper-structures.js":
/*!*********************************************************!*\
  !*** ./src/components/interpreter/helper-structures.js ***!
  \*********************************************************/
/*! exports provided: Structures */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Structures", function() { return Structures; });
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

const Structures = new HelperStructrues()
window.Structures = Structures


/***/ }),

/***/ "./src/components/native-components/custom-accordion.js":
/*!**************************************************************!*\
  !*** ./src/components/native-components/custom-accordion.js ***!
  \**************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");
/* harmony import */ var _collapsible_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../collapsible-element */ "./src/components/collapsible-element.js");
/* harmony import */ var _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style-helpers/shared-styles */ "./src/components/style-helpers/shared-styles.js");
/* harmony import */ var _style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../style-helpers/my-icons */ "./src/components/style-helpers/my-icons.js");






/**
 * 
 */
class CustomAccordion extends _collapsible_element__WEBPACK_IMPORTED_MODULE_1__["CollapsibleElement"] {

    static get properties(){
        return {
            disabled : { type : Boolean }
        }
    }

    static get styles(){
        return [
            _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_2__["CollapsibleStyle"],
            _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
                div:first-child {
                    width: 100%;
                    display: grid;
                    grid-template-columns: minmax(0,0.9fr) minmax(0,0.1fr);
                }

                div.panel{
                    background: var(--secondary-background-color);
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: center;
                    align-content: center;
                    justify-content: space-between;
                }

                button {
                    background: transparent;
                    border: none;
                    outline: none;
                    fill: var(--disabled-color);
                }

                .active span:first-child, span:nth-child(2){
                    display:none
                }

                .active span:nth-child(2), span:first-child{
                    display: block;
                }

                slot[name="title-box"]::slotted(label){ 
                    margin-left: 16px; 
                }

                @media (max-width:440px){
                    div:first-child {
                        grid-template-columns: minmax(0,0.75fr) minmax(0,0.25fr);
                    }
                }

                @media (max-width:840px){
                    div.panel {
                        flex-direction: column;
                        flex-wrap: initial;
                    }
                    
                    ::slotted(:last-child){
                        margin-bottom:12.5px;
                    }
                }

                :host([no-header]) div.panel{
                    border-radius: 5px;
                }
                
                :host([no-hover]) .accordion:hover, :host([no-hover]) .panel, :host([no-hover]) .accordion.active{
                    border-radius: 0;
                }
                
                :host([no-options]) .accordion{
                    display: none;
                }
                
                :host([no-shadow]) div.panel{
                    box-shadow: none;
                    background: transparent;
                    padding: 0;
                }`,
        ];
    }

    render(){
        return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
            <div class="accordion">
                <slot name="title-box">
                </slot>
                <slot name="icons-box">
                    <button @click="${this._animation}">
                        <span>${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_3__["plusIcon"]}</span>
                        <span>${_style_helpers_my_icons__WEBPACK_IMPORTED_MODULE_3__["minusIcon"]}</span>
                    </button>
                </slot>
            </div>
            <div class="panel chosen hide">
                <slot name="panel-box">
                <div style="text-align: center;">Nada que mostrar!</div>
                </slot>
            </div>
        `
    }

    constructor(){
        super();
        this.disabled = false;
    }
}

customElements.define('custom-accordion',CustomAccordion);

/***/ }),

/***/ "./src/components/native-components/custom-simple-modal.js":
/*!*****************************************************************!*\
  !*** ./src/components/native-components/custom-simple-modal.js ***!
  \*****************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");
/* harmony import */ var _style_helpers_button_shared_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style-helpers/button-shared-styles */ "./src/components/style-helpers/button-shared-styles.js");
/* harmony import */ var _style_helpers_keyframes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style-helpers/keyframes */ "./src/components/style-helpers/keyframes.js");




class CustomSimpleModal extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  constructor () {
    super()
    this.opened = false
    this.optics = []
    this.setInitialValues()
  }

  setInitialValues () {
    this._optic = ''
    this.message = ''
  }

  static get styles () {
    return [
      _style_helpers_button_shared_styles__WEBPACK_IMPORTED_MODULE_1__["StyledButton"],
      _style_helpers_keyframes__WEBPACK_IMPORTED_MODULE_2__["RippleEffect"],
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
            paper-dropdown-menu{
                margin-left: 50%;
                transform: translateX(-50%);
            }

            :host {
                display: block;
                position: fixed;
                background-color: var(--default-primary-color);
                color: white;
                box-shadow: var(--shadow-box-4dp-custom);
                width: 320px;
                padding: 12px;
                visibility: hidden;
                will-change: transform;
                top: 225px;
                right: 16px;
                -webkit-transform: translate3d(calc(100% + 16px), 0, 0);
                transform: translate3d(calc(100% + 16px), 0, 0);
                transition-property: visibility, -webkit-transform, background-color;
                transition-property: visibility, transform, background-color;
                transition-duration: 0.25s;
                transition-delay: 0.1s;
                z-index : 300;
            }

            :host(.error){
                color: #fff;
                background-color: var(--error-color);
                box-shadow: var(--shadow-box-4dp-custom-error);
            }

            :host([opened]) {
                visibility: visible;
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }

            @media (min-width:840px){

                :host(.alert[opened]){
                    animation: ripple 5 .5s forwards linear;
                }
            }

            .layout-horizontal {
                display: var(--layout-horizontal_-_display); -ms-flex-direction: var(--layout-horizontal_-_-ms-flex-direction); -webkit-flex-direction: var(--layout-horizontal_-_-webkit-flex-direction); flex-direction: var(--layout-horizontal_-_flex-direction);
            }

            .label {
                -ms-flex: var(--layout-flex_-_-ms-flex); -webkit-flex: var(--layout-flex_-_-webkit-flex); flex: var(--layout-flex_-_flex); -webkit-flex-basis: var(--layout-flex_-_-webkit-flex-basis); flex-basis: var(--layout-flex_-_flex-basis);
                line-height: 24px;
                margin: 8px;
                font-size: 1.25em;
            }

            .modal-button {
                -ms-flex: var(--layout-flex_-_-ms-flex);
                -webkit-flex: var(--layout-flex_-_-webkit-flex);
                flex: var(--layout-flex_-_flex);
                -webkit-flex-basis: var(--layout-flex_-_-webkit-flex-basis);
                flex-basis: var(--layout-flex_-_flex-basis);
            }

            .modal-button > label {
                box-sizing: border-box;
                width: 100%;
                padding: 8px 24px;
            }

            #closeBtn {
                position: absolute;
                right: 5px;
                top: 5px;
            }

            @media (max-width: 770px) {
                :host {
                    top: auto;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: auto;
                    -webkit-transform: translate3d(0, 100%, 0);
                    transform: translate3d(0, 100%, 0);
                }
            }`
    ]
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
            <div class="layout-horizontal">
                <div class="label">${this.message}</div>
            </div>
            <paper-input label="Valor a ingresar" always-float-label id="sysin"></paper-input>
            <div class="layout-horizontal">
                <button class="styled-button modal-button" @click="${this.resolveVal}">
                    <label>Aceptar</label>
                </button>
            </div>`
  }

  static get properties () {
    return {
      message: {
        type: String
      },
      position: {
        type: String
      },
      opened: {
        type: Boolean,
        reflect: true
      }
    }
  }

  resolveVal () {
    this.onResolve(this._('sysin').value)
    this.closeModal()
  }

  closeModal () {
    this.opened = false
  }

  openModal (msn) {
    this.opened = true
    this.message = msn

    return new Promise((resolve, reject) => {
      this.onResolve = resolve
      this.onReject = reject
    })
  }

  reset () {
    this.setInitialValues()
    this.classList.remove('error')
  }

  animate () {
    this.classList.toggle('alert')
    setTimeout(() => this.classList.toggle('alert'), 2500)
  }
}

customElements.define('custom-simple-modal', CustomSimpleModal)


/***/ }),

/***/ "./src/components/native-components/custom-switch.js":
/*!***********************************************************!*\
  !*** ./src/components/native-components/custom-switch.js ***!
  \***********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");


class CustomSwitch extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"]{

    constructor(){
        super();
        this.on = 'true';
        this.off = 'false';
        this.checked = false;
    }

    static get styles(){
        return [
            _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
                :host{
                    display: inline-block;
                    width: 15%;
                    margin: 0 auto 0;
                }

                :host([checked]) .sl{
                    color: var(--default-primary-color);
                }

                .si {
                    display: none;
                }
                .sl {
                    position: relative;
                    display: block;
                    min-width: 112px;
                    cursor: pointer;
                    text-align: left;
                    margin: 0 16px;
                    padding: 8px 0 8px 0px;
                    font-size: 1.125em;
                    font-family: 'Josefin Sans', sans-serif;
                    color: var(--primary-text-color);
                }
                .sl:before, .sl:after {
                    content: "";
                    position: absolute;
                    margin: 0;
                    outline: 0;
                    top: 50%;
                    -ms-transform: translate(0, -50%);
                    -webkit-transform: translate(0, -50%);
                    transform: translate(0, -50%);
                    -webkit-transition: all 0.3s ease;
                    transition: all 0.3s ease;
                }
                .sl:before {
                    right: 8px;
                    width: 34px;
                    height: 14px;
                    background-color: #9E9E9E;
                    border-radius: 8px;
                }
                .sl:after {
                    right: 23px;
                    width: 20px;
                    height: 20px;
                    background-color: #FAFAFA;
                    border-radius: 50%;
                    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
                }
                .sl .ton {
                    display: none;
                }
                
                .sl .toff {
                    display: inline-block;
                }
                .si:checked + .sl:before {
                    background-color: var(--default-primary-color);
                }
                .si:checked + .sl:after {
                    background-color: var(--dark-primary-color);
                    -ms-transform: translate(80%, -50%);
                    -webkit-transform: translate(80%, -50%);
                    transform: translate(80%, -50%);
                }
                .si:checked + .sl .ton {
                    display: inline-block;
                }
                .si:checked + .sl .toff {
                    display: none;
                }
                
                @media (max-width:440px){
                    :host{
                        padding-left:0;
                    }
                }`,
        ];
    }


    render(){
        return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
            ${this.message}
            <div>
                <input type="checkbox" id="cb" name="cb" class="si" ?checked=${this.checked}>
                <label for="cb" class="sl" @click="${(e)=>{ e.preventDefault(); this.checked=!this.checked; this.fire("value-changed",this.value); }}">
                    <span class="ton">${this.on}</span>
                    <span class="toff">${this.off}</span>
                </label>
            </div>`
    }

    static get properties(){
        return {
            on          : { type: String  },
            off         : { type: String  },
            error       : { type: String  },
            checked     : { type: Boolean, reflect: true  },
            message     : { type: String }
        }
    }

    value(){
        return this.checked;
    }
    
}

customElements.define('custom-switch',CustomSwitch);

/***/ }),

/***/ "./src/components/optimization/block-parser-functions.js":
/*!***************************************************************!*\
  !*** ./src/components/optimization/block-parser-functions.js ***!
  \***************************************************************/
/*! exports provided: optimizationByBlockFunctions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "optimizationByBlockFunctions", function() { return optimizationByBlockFunctions; });
/* harmony import */ var _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parser/ast/tree-types */ "./src/components/parser/ast/tree-types.js");


class BlockOptimizationFunctions {
  isTemporal (astNode) {
    return astNode.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp
  }

  isPointer (astNode) {
    return astNode.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.hp || astNode.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.sp
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
        if (tmpNode.getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['=']) {
          tmpNode = tmpNode.next
          continue
        }

        if (this.isPointer(tmpNode.getChild(0))) {
          if (tmpNode.getChild(0).getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.hp && rhsValues.includes('H')) { break }
          if (tmpNode.getChild(0).getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.sp && rhsValues.includes('P')) { break }
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
        if (tmpNode.getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['=']) {
          tmpNode = tmpNode.next
          continue
        }

        if (this.isPointer(tmpNode.getChild(0))) {
          if (tmpNode.getChild(0).getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.hp && rhsValues.includes('H')) { break }
          if (tmpNode.getChild(0).getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.sp && rhsValues.includes('P')) { break }
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
      if (ast.getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['=']) {
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
        if (tmpNode.getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['=']) {
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

const optimizationByBlockFunctions = new BlockOptimizationFunctions()


/***/ }),

/***/ "./src/components/optimization/optimization-block.js":
/*!***********************************************************!*\
  !*** ./src/components/optimization/optimization-block.js ***!
  \***********************************************************/
/*! exports provided: optimizationByBlock */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "optimizationByBlock", function() { return optimizationByBlock; });
/* harmony import */ var _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parser/ast/tree-types */ "./src/components/parser/ast/tree-types.js");
/* harmony import */ var _block_parser_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block-parser-functions */ "./src/components/optimization/block-parser-functions.js");


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
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<=']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>=']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<>']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['==']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.goto:
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
    return tNode.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.var && tNode.getChild(0).getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp
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
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<=']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>=']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<>']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['==']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.goto:
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
      if (tNode.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.label && tNode.getValue() === label) {
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
      if (tNode.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.label && tNode.getValue() === label) {
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
      if (tNode.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.method) {
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
    if (ast.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.method) {
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
        Object(_block_parser_functions__WEBPACK_IMPORTED_MODULE_1__["optimizationByBlockFunctions"])(block, this.optimization)
      }
    }
    window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'optimization by block done' }))
    window.dispatchEvent(new CustomEvent('optimization-done', { detail: this.optimization }))
  }
}

const optimizationByBlock = new BlockOptimization()


/***/ }),

/***/ "./src/components/optimization/optimization-peephole.js":
/*!**************************************************************!*\
  !*** ./src/components/optimization/optimization-peephole.js ***!
  \**************************************************************/
/*! exports provided: peepHole */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "peepHole", function() { return peepHole; });
/* harmony import */ var _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parser/ast/tree-types */ "./src/components/parser/ast/tree-types.js");


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
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['=']:
          this.optimizationEq(tmpNode)
          break
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.method:
          this.performOptimization(tmpNode.getChild(0))
          break
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<=']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>=']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<>']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['==']:
        case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.goto:
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
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['+']:
        // regla 8
        // regla 12
        if ((position = rhsNode.hasZero()) !== -1) { this.inspectByRule812(ast, position !== 0) }
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['-']:
        // regla 9
        // regla 13
        if ((position = rhsNode.hasZero()) === 1) { this.inspectByRule913(ast) }
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['*']:
        if ((position = rhsNode.hasOne()) !== -1) { this.inspectByRule1014(ast, position !== 0); break }
        if ((position = rhsNode.hasZero()) !== -1) { this.inspectByRule17(ast, position !== 0); break }
        if ((position = rhsNode.hasTwo()) !== -1) { this.inspectByRule16(ast, position); break }
        break
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['/']: {
        if ((position = rhsNode.hasOne()) === 1) { this.inspectByRule1115(ast); break }
        if ((position = rhsNode.hasZero()) === 0) { this.inspectByRule18(ast); break }
        break
      }
    }
  }

  optimizationJump (ast) {
    switch (ast.getType()) {
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<=']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>=']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<>']:
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['==']:
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
    const isGoto = ast.next.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.goto
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
    if (ast.getChild(1).children.length > 1 || ast.getChild(1).getChild(0).getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp) { return }

    const rhs = ast.getChild(1).getValue()
    const lhs = ast.getChild(0).getValue()

    let tmpNode = ast.next

    const nodes = []
    while (tmpNode != null) {
      if (tmpNode.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['=']) {
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
    if (ast.getChild(0).getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp) { return true }
    if (ast.getChild(1).getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp) { return true }

    if (ast.getChild(0).getValue() === rhs && ast.getChild(1).getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp) { return false }
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

    if (gotoNode.getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.goto) return
    if (label.getType() !== _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.label) return

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

    if (labelNode !== null && labelNode.next.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.goto) {
      const oldval = `${ast.toString()} ... ${labelNode.toString()}${labelNode.next.toString()}`
      ast.setValue(labelNode.next.getValue())
      this.optimizationMessage(ast.getType() === _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.goto ? 6 : 7, ast.line, oldval, `${ast.toString()} ... ${labelNode.toString()}${labelNode.next.toString()}`)
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
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<']:
        return opLeft < opRight
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>']:
        return opLeft > opRight
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<=']:
        return opLeft <= opRight
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>=']:
        return opLeft >= opRight
      case _parser_ast_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<>']:
        return opLeft !== opRight
      default:
        return opLeft === opRight
    }
  }
}

const peepHole = new PeepHole()


/***/ }),

/***/ "./src/components/parser/ast/ast-node.js":
/*!***********************************************!*\
  !*** ./src/components/parser/ast/ast-node.js ***!
  \***********************************************/
/*! exports provided: AstNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AstNode", function() { return AstNode; });
/* harmony import */ var _tree_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tree-types */ "./src/components/parser/ast/tree-types.js");


const AstNode = class {
  constructor (type, value, line, col) {
    this.type = _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types[type.toString().toLowerCase()]
    this.name = type.toString().toLowerCase()
    if (this.type === undefined) console.log(type)
    this.value = value
    this.line = line
    this.column = col
    this.children = []
    this.next = null
    this.last = null
    this.parent = null
    this.isFalse = false
    this.isLeader = false

    for (let i = 4; i < arguments.length; i++) {
      this.children.push(arguments[i])
      arguments[i].parent = this
    }
  }

  markLeader () {
    this.isLeader = true
  }

  getValue () {
    return this.value
  }

  addChild (...args) {
    args.forEach(element => {
      this.children.push(element)
      element.parent = this
    })
  }

  getChild (index) {
    if (index > this.children.length) return null

    return this.children[index]
  }

  getLine () {
    return this.line
  }

  setValue (val) {
    this.value = val
  }

  setNext (node) {
    let tmp = this

    while (tmp.next != null) { tmp = tmp.next }

    tmp.next = node
    if (node !== null) { node.last = tmp }
  }

  changeType (nType) {
    this.type = _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types[nType]
    this.name = nType
  }

  printTree (indent = '') {
    console.log(`${indent}#${_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].names[this.type]} (${this.type})`)

    this.children.forEach(it => {
      it.printTree(indent + '\t')
    })

    if (this.next) { this.next.printTree(indent) }
  }

  toString () {
    switch (this.type) {
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.stack:
        return `Stack[${this.getChild(0).toString()}]`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.heap:
        return `Heap[${this.getChild(0).toString()}]`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['-']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['*']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['/']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['+']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['%']:
        return `${this.getChild(0).toString()} ${_tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].names[this.type]} ${this.getChild(1).toString()}`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number:
        return this.value
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.sp:
        return 'P'
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.hp:
        return 'H'
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.var: {
        if (this.getChild(0).type === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.heap) {
          return 'var Heap[];\n'
        } else if (this.getChild(0).type === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.stack) {
          return 'var Stack[];\n'
        } else {
          if (this.children.length > 1) {
            return `var ${this.children.map((el) => el.toString()).join(',')};\n`
          } else {
            return `var ${this.getChild(0).toString()};\n`
          }
        }
      }
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.print: {
        return `print (${this.value}, ${this.getChild(0).toString()});\n`
      }
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.label: {
        return `${this.value}:\n`
      }
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.goto: {
        return `goto ${this.value};\n`
      }
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>=']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<=']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<>']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['==']:
        return `if (${this.getChild(0).toString()}${(!this.isFalse) ? _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].names[this.type] : this.negate()}${this.getChild(1).toString()}) goto ${this.value};\n`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['=']:
        return `${this.getChild(0).toString()} = ${this.getChild(1).toString()};\n`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.call:
        return `call ${this.value};\n`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.method: {
        let code = ''
        let tmp = this.getChild(0)
        while (tmp !== null) {
          code += tmp.toString()
          tmp = tmp.next
        }
        return `proc ${this.value} begin\n${code}end\n`
      }
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.e:
        return 'E'
      default:
        return ''
    }
  }

  copy () {
    const nNode = new AstNode(this.name, this.value, this.line, this.column)
    nNode.name = this.name
    nNode.type = this.type
    nNode.isFalse = this.isFalse
    nNode.isLeader = this.isLeader
    // we copy the children by name
    for (const node of this.children) {
      nNode.addChild(node.copy())
    }
    return nNode
  }

  childrenSize () {
    return this.children.length
  }

  equals (nNode) {
    return nNode.name === this.name && nNode.type === this.type && this.value === nNode.value &&
            nNode.column === this.column && nNode.line === this.line
  }

  getNonNumericTypes () {
    switch (this.type) {
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.hp:
        return ['H']
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.sp:
        return ['P']
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp:
        return [this.getValue()]
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['-']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['*']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['/']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['+']:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['%']: {
        const arr = []
        if (this.getChild(0).getType() !== _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number) { arr.push(this.getChild(0).getValue()) }
        if (this.getChild(1).getType() !== _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number) { arr.push(this.getChild(1).getValue()) }
        return arr
      }
      default:
        return []
    }
  }

  typeEquality (nNode) {
    if (nNode.childrenSize() !== this.childrenSize) return false

    if (this.getType() === nNode.getType() && this.getValue() === nNode.getValue()) {
      for (let i = 0; i < nNode.childrenSize(); i++) {
        if (!this.getChild(i).typeEquality(nNode)) { return false }
      }
      return true
    }

    return false
  }

  getType () {
    return this.type
  }

  toStringSpecial () {
    switch (this.type) {
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.var:
        return 'var lista temporales;'
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>']:
        return `if (${this.getChild(0).toString()} GT ${this.getChild(1).toString()}) goto ${this.value}`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>=']:
        return `if (${this.getChild(0).toString()} GTE ${this.getChild(1).toString()}) goto ${this.value}`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<']:
        return `if (${this.getChild(0).toString()} LT ${this.getChild(1).toString()}) goto ${this.value}`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<=']:
        return `if (${this.getChild(0).toString()} LTE ${this.getChild(1).toString()}) goto ${this.value}`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['==']:
        return `if (${this.getChild(0).toString()} EQEQ ${this.getChild(1).toString()}) goto ${this.value}`
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<>']:
        return `if (${this.getChild(0).toString()} NOTEQ ${this.getChild(1).toString()}) goto ${this.value}`
      default:
        return this.toString()
    }
  }

  negate () {
    switch (this.type) {
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>']:
        return '<='
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['>=']:
        return '<'
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<=']:
        return '>'
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<']:
        return '>='
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['<>']:
        return '=='
      default:
        return '<>'
    }
  }

  hasZero () {
    if (this.getChild(0).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number && this.getChild(0).value === 0) { return 0 }
    if (this.getChild(1).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number && this.getChild(1).value === 0) { return 1 }
    return -1
  }

  hasTwo () {
    if (this.getChild(0).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number && this.getChild(0).value === 2) { return 0 }
    if (this.getChild(1).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number && this.getChild(1).value === 2) { return 1 }
    return -1
  }

  hasOne () {
    if (this.getChild(0).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number && this.getChild(0).value === 1) { return 0 }
    if (this.getChild(1).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number && this.getChild(1).value === 1) { return 1 }
    return -1
  }

  deleteAt (index) {
    return this.children.splice(index, 1)
  }

  converToFalse () {
    this.isFalse = true
  }

  isConstantOperation () {
    return this.getChild(0).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number && this.getChild(1).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.number
  }

  trimMethodList () {
    if (this.getChild(0).next != null) {
      this.getChild(0).next.last = null
      this.children[0] = this.getChild(0).next
    }

    let tNode = this.getChild(0)
    while (tNode.next != null) {
      tNode = tNode.next
    }
    tNode.last.next = tNode.next
  }

  usesTmp (identifier) {
    switch (this.getChild(0)) {
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.heap:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.stack:
        if (this.getChild(0).getChild(0).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp && this.getChild(0).getChild(0).getValue() === identifier) { return true }
        break
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.sp:
      case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.hp:
        switch (this.getChild(1)) {
          case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['-']:
          case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['*']:
          case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['/']:
          case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['+']:
          case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types['%']:
            if (this.getChild(1).getChild(0).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp && this.getChild(1).getChild(0).getValue() === identifier) {
              return true
            }
            if (this.getChild(1).getChild(1).getType() === _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp && this.getChild(1).getChild(1).getValue() === identifier) {
              return true
            }
            break
          case _tree_types__WEBPACK_IMPORTED_MODULE_0__["tree_types"].types.tmp:
            if (this.getChild(1).getValue() === identifier) {
              return true
            }
            break
          default:
            break
        }
    }
    return false
  }
}


/***/ }),

/***/ "./src/components/parser/ast/tree-types.js":
/*!*************************************************!*\
  !*** ./src/components/parser/ast/tree-types.js ***!
  \*************************************************/
/*! exports provided: tree_types */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tree_types", function() { return tree_types; });
const tree_types = {

  names: [
    '+',
    '-',
    '*',
    '%',
    '/',
    'number',
    'identifier',
    'method',
    'begin',
    'end',
    'label',
    'tmp',
    'stack',
    'heap',
    'goto',
    '==',
    '<>',
    '>',
    '<',
    '>=',
    '<=',
    'print',
    '=',
    'sp',
    'hp',
    'call',
    'var',
    'E'
  ],
  types: {
    '+': 0,
    '-': 1,
    '*': 2,
    '%': 3,
    '/': 4,
    number: 5,
    identifier: 6,
    method: 7,
    begin: 8,
    end: 9,
    label: 10,
    tmp: 11,
    stack: 12,
    heap: 13,
    goto: 14,
    '==': 15,
    '<>': 16,
    '>': 17,
    '<': 18,
    '>=': 19,
    '<=': 20,
    sysin: 21,
    print: 22,
    '=': 23,
    sp: 24,
    hp: 25,
    exit: 26,
    call: 27,
    var: 28,
    e: 29
  }
}


/***/ }),

/***/ "./src/components/parser/code3d.js":
/*!*****************************************!*\
  !*** ./src/components/parser/code3d.js ***!
  \*****************************************/
/*! exports provided: Root, code3d */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process, module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Root", function() { return Root; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "code3d", function() { return code3d; });
/* harmony import */ var _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ast/ast-node.js */ "./src/components/parser/ast/ast-node.js");
/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/

var Root = null;

var code3d = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,24],$V1=[1,20],$V2=[1,18],$V3=[1,17],$V4=[1,19],$V5=[1,14],$V6=[1,23],$V7=[1,13],$V8=[1,15],$V9=[1,25],$Va=[1,21],$Vb=[1,22],$Vc=[5,16,17,19,21,24,26,27,29,40,45,52,54,56],$Vd=[1,58],$Ve=[1,59],$Vf=[1,60],$Vg=[1,61],$Vh=[1,62],$Vi=[1,63],$Vj=[5,16,17,19,21,24,25,26,27,29,40,45,52,54,56],$Vk=[1,79],$Vl=[1,80],$Vm=[1,81],$Vn=[1,82],$Vo=[1,83],$Vp=[26,32],$Vq=[17,19,26,32];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"INICIO":3,"STMT_LIST":4,"EOF":5,"STMT":6,"CALL_STMT":7,"TMP_STMT":8,"JMP_STMT":9,"HEAP_STMT":10,"STACK_STMT":11,"PRINT_STMT":12,"METHOD_DECL_STMT":13,"LABEL_STMT":14,"DECL_STMT":15,"var":16,"sp":17,"E":18,"hp":19,"TMP_LIST":20,"heap":21,"squarel":22,"squarer":23,"stack":24,"comma":25,"tmp":26,"label":27,"colon":28,"call":29,"identifier":30,"eq":31,"number":32,"OPERATOR":33,"ERROR_ASSIGN":34,"plus":35,"min":36,"div":37,"mod":38,"mult":39,"goto":40,"IFINIT":41,"lpar":42,"GOTO_OP":43,"rpar":44,"if":45,"gotoeq":46,"gotoneq":47,"gotogt":48,"gotogte":49,"gotolt":50,"gotolte":51,"print":52,"parameter":53,"proc":54,"begin":55,"end":56,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",16:"var",17:"sp",18:"E",19:"hp",21:"heap",22:"squarel",23:"squarer",24:"stack",25:"comma",26:"tmp",27:"label",28:"colon",29:"call",30:"identifier",31:"eq",32:"number",35:"plus",36:"min",37:"div",38:"mod",39:"mult",40:"goto",42:"lpar",44:"rpar",45:"if",46:"gotoeq",47:"gotoneq",48:"gotogt",49:"gotogte",50:"gotolt",51:"gotolte",52:"print",53:"parameter",54:"proc",55:"begin",56:"end"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[15,2],[15,2],[15,2],[15,2],[15,4],[15,4],[20,3],[20,1],[14,3],[14,2],[7,2],[8,3],[8,3],[8,3],[8,3],[8,6],[8,6],[8,6],[8,6],[8,6],[8,6],[8,5],[8,5],[8,5],[8,5],[8,5],[8,5],[8,5],[8,5],[34,3],[33,1],[33,1],[33,1],[33,1],[33,1],[10,6],[10,6],[10,6],[10,6],[10,6],[10,6],[10,6],[10,6],[10,5],[10,5],[11,6],[11,6],[11,6],[11,6],[11,6],[11,6],[11,6],[11,6],[11,5],[11,5],[11,5],[11,5],[9,2],[9,8],[9,6],[9,8],[9,6],[9,8],[9,6],[9,8],[9,6],[41,1],[43,1],[43,1],[43,1],[43,1],[43,1],[43,1],[12,6],[12,6],[13,5]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

			Root = $$[$0-1];
            this.$ = $$[$0-1];

break;
case 2:

			$$[$0-1].setNext($$[$0]);

break;
case 3:

			this.$ = $$[$0];

break;
case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12: case 43: case 44: case 45: case 46: case 47: case 80: case 81: case 82: case 83: case 84: case 85:

		this.$ = $$[$0];

break;
case 13:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("var",null, _$[$0-1].first_line,_$[$0-1].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0].first_line,_$[$0].first_column)
						);

break;
case 14:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("var",null, _$[$0-1].first_line,_$[$0-1].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("e", null, _$[$0].first_line,_$[$0].first_column)
						);

break;
case 15:

			this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("var",null, _$[$0-1].first_line,_$[$0-1].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0].first_line,_$[$0].first_column)
					);

break;
case 16:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("var",null, _$[$0-1].first_line,_$[$0-1].first_column);
		$$[$0].forEach(el=>this.$.addChild(el));

break;
case 17:

			this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("var",null, _$[$0-3].first_line,_$[$0-3].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-2].first_line, _$[$0-2].first_column)
				);

break;
case 18:

			this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("var",null, _$[$0-1].first_line,_$[$0-1].first_column,
				new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-2].first_line, _$[$0-2].first_column)
			);

break;
case 19:

		this.$ = $$[$0-2];
		this.$.push(new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line, _$[$0].first_column));

break;
case 20:

		this.$ = [
			new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line, _$[$0].first_column)
		]

break;
case 21:

		$$[$0-2].next = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("label",$$[$0],_$[$0].first_line, _$[$0].first_column);
		this.$ = $$[$0-2];

break;
case 22:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("label", $$[$0-1], _$[$0-1].first_line, _$[$0-1].first_column);

break;
case 23:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("call", $$[$0], _$[$0-1].first_line, _$[$0-1].first_column );

break;
case 24:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-1].first_line,_$[$0-1].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-2], _$[$0-2].first_line,_$[$0-2].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line,_$[$0].first_column)
						);

break;
case 25:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-1].first_line,_$[$0-1].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-2], _$[$0-2].first_line,_$[$0-2].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line,_$[$0].first_column)
						);

break;
case 26:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-1].first_line,_$[$0-1].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-2], _$[$0-2].first_line,_$[$0-2].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0].first_line,_$[$0].first_column)
						);

break;
case 27:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-1].first_line,_$[$0-1].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-2], _$[$0-2].first_line,_$[$0-2].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0].first_line,_$[$0].first_column)
						);

break;
case 28:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-4].first_line,_$[$0-4].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-5], _$[$0-5].first_line, _$[$0-5].first_column),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-3].first_line, _$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number",parseFloat($$[$0-1]),_$[$0-1].first_line, _$[$0-1].first_column)
					)
				);


break;
case 29:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-4].first_line,_$[$0-4].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-5], _$[$0-5].first_line, _$[$0-5].first_column),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-3].first_line, _$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-1], _$[$0-1].first_line, _$[$0-1].first_column)
					)
				);


break;
case 30:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-4].first_line,_$[$0-4].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-5], _$[$0-5].first_line, _$[$0-5].first_column),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-3].first_line, _$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0-1].first_line, _$[$0-1].first_column)
					)
				);


break;
case 31:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-4].first_line,_$[$0-4].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-5], _$[$0-5].first_line, _$[$0-5].first_column),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-3].first_line, _$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number",parseFloat($$[$0-1]),_$[$0-1].first_line, _$[$0-1].first_column)
					)
				);


break;
case 32:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-4].first_line,_$[$0-4].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-5], _$[$0-5].first_line, _$[$0-5].first_column),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-3].first_line, _$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-1], _$[$0-1].first_line, _$[$0-1].first_column)
					)
				);


break;
case 33:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-4].first_line,_$[$0-4].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-5], _$[$0-5].first_line, _$[$0-5].first_column),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-3].first_line, _$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0-1].first_line, _$[$0-1].first_column)
					)
				);


break;
case 34:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-4], _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-2]), _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 35:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-4], _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-2]), _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 36:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-4], _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-2], _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 37:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-4], _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-2], _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line,_$[$0].first_column),
							)
						);

break;
case 38:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-4], _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 39:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-4], _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-2]), _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 40:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-4].first_line,_$[$0-4].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-4], _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 41:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-4].first_line,_$[$0-4].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-4], _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-2]), _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 42:

	this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null,_$[$0-1].first_line,_$[$0-1].first_column,
				new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("E",null, _$[$0-2].first_line,_$[$0-2].first_column),
				new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat(number), _$[$0].first_line, _$[$0].first_column)
			)

break;
case 48:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-3],_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line, _$[$0].first_column)
				);

break;
case 49:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp",null,_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line, _$[$0].first_column)
				);

break;
case 50:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-3],_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line, _$[$0].first_column)
				);

break;
case 51:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp",null,_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line, _$[$0].first_column)
				);

break;
case 52:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-3],_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp",null, _$[$0].first_line, _$[$0].first_column)
				);

break;
case 53:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp",null,_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0].first_line, _$[$0].first_column)
				);

break;
case 54:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-3],_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0].first_line, _$[$0].first_column)
				);

break;
case 55:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("heap",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp",null,_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0].first_line, _$[$0].first_column)
				);

break;
case 56:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 57:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 58:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-3],_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number",parseFloat($$[$0]),_$[$0].first_line, _$[$0].first_column)
				);


break;
case 59:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-3],_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line, _$[$0].first_column)
				);

break;
case 60:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp",null,_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0],_$[$0].first_line, _$[$0].first_column)
				);

break;
case 61:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp",null,_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]),_$[$0].first_line, _$[$0].first_column)
				);

break;
case 62:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-3],_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp",null,_$[$0].first_line, _$[$0].first_column)
				);


break;
case 63:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-3],_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0].first_line, _$[$0].first_column)
				);

break;
case 64:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp",null,_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null ,_$[$0].first_line, _$[$0].first_column)
				);

break;
case 65:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=", null, _$[$0-1].first_line,_$[$0-1].first_column,
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("stack",null,_$[$0-5].first_line, _$[$0-5].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp",null,_$[$0-3].first_line, _$[$0-3].first_column)
					),
					new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null,_$[$0].first_line, _$[$0].first_column)
				);

break;
case 66:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0-4].first_line,_$[$0-4].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
								new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0-2].first_line,_$[$0-2].first_column),
								new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 67:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line, _$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("hp", null, _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 68:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0]), _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 69:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("=",null, _$[$0-3].first_line,_$[$0-3].first_column,
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0-4].first_line,_$[$0-4].first_column),
						new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1], null, _$[$0-1].first_line,_$[$0-1].first_column,
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("sp", null, _$[$0-2].first_line,_$[$0-2].first_column),
							new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0], _$[$0].first_line,_$[$0].first_column)
							)
						);

break;
case 70:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-1],
						 $$[$0],
						 _$[$0-1].first_line,
						 _$[$0-1].first_column);


break;
case 71:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-4],
						 $$[$0],
						 _$[$0-7].first_line,
						 _$[$0-7].first_column,
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number",parseFloat($$[$0-5]), _$[$0-5].first_line, _$[$0-5].first_column),
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column)
						);
		if($$[$0-7] === true) this.$.converToFalse()

break;
case 72:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-3],
						 $$[$0],
						 _$[$0-5].first_line,
						 _$[$0-5].first_column,
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number",parseFloat($$[$0-4]), _$[$0-4].first_line, _$[$0-4].first_column),
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-2], _$[$0-1].first_line, _$[$0-2].first_column)
						);
		if($$[$0-5] === true) this.$.converToFalse()

break;
case 73:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-4],
						 $$[$0],
						 _$[$0-7].first_line,
						 _$[$0-7].first_column,
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-5], _$[$0-5].first_line, _$[$0-5].first_column),
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-3]), _$[$0-3].first_line, _$[$0-3].first_column)
						);
		if($$[$0-7] === true) this.$.converToFalse()

break;
case 74:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-3],
						 $$[$0],
						 _$[$0-5].first_line,
						 _$[$0-5].first_column,
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-4], _$[$0-4].first_line, _$[$0-4].first_column),
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-2]), _$[$0-2].first_line, _$[$0-2].first_column)
						);
		if($$[$0-5] === true) this.$.converToFalse()

break;
case 75:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-4],
						 $$[$0],
						 _$[$0-7].first_line,
						 _$[$0-7].first_column,
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-5], _$[$0-5].first_line, _$[$0-5].first_column),
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column)
						);
		if($$[$0-7] === true) this.$.converToFalse()

break;
case 76:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-3],
						 $$[$0],
						 _$[$0-5].first_line,
						 _$[$0-5].first_column,
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp",$$[$0-4], _$[$0-4].first_line, _$[$0-4].first_column),
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column)
						);
		if($$[$0-5] === true) this.$.converToFalse()

break;
case 77:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-4],
						 $$[$0],
						 _$[$0-7].first_line,
						 _$[$0-7].first_column,
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-5]), _$[$0-5].first_line, _$[$0-5].first_column),
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-3]), _$[$0-3].first_line, _$[$0-3].first_column)
						);
		if($$[$0-7] === true) this.$.converToFalse()

break;
case 78:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-3],
						 $$[$0],
						 _$[$0-5].first_line,
						 _$[$0-5].first_column,
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-4]), _$[$0-4].first_line, _$[$0-4].first_column),
						 new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-2]), _$[$0-2].first_line, _$[$0-2].first_column)
						);
		if($$[$0-5] === true) this.$.converToFalse()

break;
case 79:

		this.$ = false

break;
case 86:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-5], $$[$0-3], _$[$0-5].first_line, _$[$0-5].first_column,
				new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("tmp", $$[$0-1], _$[$0-1].first_line, _$[$0-1].first_column)
			);

break;
case 87:

		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]($$[$0-5], $$[$0-3], _$[$0-5].first_line, _$[$0-5].first_column,
				new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("number", parseFloat($$[$0-1]), _$[$0-1].first_line, _$[$0-1].first_column)
			);

break;
case 88:

		let begin_node = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("begin",null,_$[$0-2].first_line, _$[$0-2].first_column);
		begin_node.setNext($$[$0-1]);
		begin_node.setNext(new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("end",null,_$[$0].first_line, _$[$0].first_column));
		this.$ = new _ast_ast_node_js__WEBPACK_IMPORTED_MODULE_0__["AstNode"]("method", $$[$0-3], _$[$0-3].first_line, _$[$0-3].first_column, begin_node);

break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V0,17:$V1,19:$V2,21:$V3,24:$V4,26:$V5,27:$V6,29:$V7,40:$V8,41:16,45:$V9,52:$Va,54:$Vb},{1:[3]},{5:[1,26],6:27,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V0,17:$V1,19:$V2,21:$V3,24:$V4,26:$V5,27:$V6,29:$V7,40:$V8,41:16,45:$V9,52:$Va,54:$Vb},o($Vc,[2,3]),o($Vc,[2,4]),o($Vc,[2,5]),o($Vc,[2,6]),o($Vc,[2,7]),o($Vc,[2,8]),o($Vc,[2,9]),o($Vc,[2,10]),o($Vc,[2,11]),o($Vc,[2,12]),{30:[1,28]},{31:[1,29]},{27:[1,30]},{26:[1,33],32:[1,32],42:[1,31]},{22:[1,34]},{31:[1,35]},{22:[1,36]},{31:[1,37]},{42:[1,38]},{30:[1,39]},{25:[1,40],28:[1,41]},{17:[1,42],18:[1,43],19:[1,44],20:45,21:[1,46],24:[1,47],26:[1,48]},o([26,32,42],[2,79]),{1:[2,1]},o($Vc,[2,2]),o($Vc,[2,23]),{17:[1,51],19:[1,52],21:[1,54],24:[1,53],26:[1,49],32:[1,50]},o($Vc,[2,70]),{26:[1,56],32:[1,55]},{43:57,46:$Vd,47:$Ve,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{43:64,46:$Vd,47:$Ve,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{19:[1,66],26:[1,65]},{19:[1,67]},{17:[1,69],26:[1,68]},{17:[1,71],19:[1,70]},{53:[1,72]},{55:[1,73]},{14:74,27:$V6},o($Vc,[2,22]),o($Vc,[2,13]),o($Vc,[2,14]),o($Vc,[2,15]),o($Vc,[2,16],{25:[1,75]}),{22:[1,76]},{22:[1,77]},o($Vj,[2,20]),o($Vc,[2,24],{33:78,35:$Vk,36:$Vl,37:$Vm,38:$Vn,39:$Vo}),o($Vc,[2,25],{33:84,35:$Vk,36:$Vl,37:$Vm,38:$Vn,39:$Vo}),o($Vc,[2,26],{33:85,35:$Vk,36:$Vl,37:$Vm,38:$Vn,39:$Vo}),o($Vc,[2,27],{33:86,35:$Vk,36:$Vl,37:$Vm,38:$Vn,39:$Vo}),{22:[1,87]},{22:[1,88]},{43:89,46:$Vd,47:$Ve,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{43:90,46:$Vd,47:$Ve,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{26:[1,91],32:[1,92]},o($Vp,[2,80]),o($Vp,[2,81]),o($Vp,[2,82]),o($Vp,[2,83]),o($Vp,[2,84]),o($Vp,[2,85]),{26:[1,94],32:[1,93]},{23:[1,95]},{23:[1,96]},{33:97,35:$Vk,36:$Vl,37:$Vm,38:$Vn,39:$Vo},{23:[1,98]},{23:[1,99]},{33:100,35:$Vk,36:$Vl,37:$Vm,38:$Vn,39:$Vo},{33:101,35:$Vk,36:$Vl,37:$Vm,38:$Vn,39:$Vo},{25:[1,102]},{4:103,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V0,17:$V1,19:$V2,21:$V3,24:$V4,26:$V5,27:$V6,29:$V7,40:$V8,41:16,45:$V9,52:$Va,54:$Vb},o($Vc,[2,21]),{26:[1,104]},{23:[1,105]},{23:[1,106]},{26:[1,107],32:[1,108]},o($Vq,[2,43]),o($Vq,[2,44]),o($Vq,[2,45]),o($Vq,[2,46]),o($Vq,[2,47]),{17:[1,111],19:[1,112],26:[1,110],32:[1,109]},{32:[1,113]},{32:[1,114]},{17:[1,117],26:[1,116],32:[1,115]},{19:[1,120],26:[1,119],32:[1,118]},{26:[1,121],32:[1,122]},{26:[1,124],32:[1,123]},{40:[1,125]},{40:[1,126]},{40:[1,127]},{40:[1,128]},{31:[1,129]},{31:[1,130]},{26:[1,132],32:[1,131]},{31:[1,133]},{31:[1,134]},{26:[1,136],32:[1,135]},{26:[1,138],32:[1,137]},{26:[1,139],32:[1,140]},{6:27,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V0,17:$V1,19:$V2,21:$V3,24:$V4,26:$V5,27:$V6,29:$V7,40:$V8,41:16,45:$V9,52:$Va,54:$Vb,56:[1,141]},o($Vj,[2,19]),o($Vc,[2,17]),o($Vc,[2,18]),o($Vc,[2,36]),o($Vc,[2,37]),o($Vc,[2,34]),o($Vc,[2,35]),o($Vc,[2,39]),o($Vc,[2,41]),o($Vc,[2,38]),o($Vc,[2,40]),{23:[1,142]},{23:[1,143]},{23:[1,144]},{23:[1,145]},{23:[1,146]},{23:[1,147]},{44:[1,148]},{44:[1,149]},{44:[1,150]},{44:[1,151]},{27:[1,152]},{27:[1,153]},{27:[1,154]},{27:[1,155]},{17:[1,159],19:[1,158],26:[1,157],32:[1,156]},{17:[1,163],19:[1,162],26:[1,161],32:[1,160]},o($Vc,[2,56]),o($Vc,[2,57]),{17:[1,166],19:[1,167],26:[1,165],32:[1,164]},{17:[1,170],19:[1,171],26:[1,168],32:[1,169]},o($Vc,[2,66]),o($Vc,[2,67]),o($Vc,[2,68]),o($Vc,[2,69]),{44:[1,172]},{44:[1,173]},o($Vc,[2,88]),o($Vc,[2,28]),o($Vc,[2,29]),o($Vc,[2,30]),o($Vc,[2,31]),o($Vc,[2,32]),o($Vc,[2,33]),{40:[1,174]},{40:[1,175]},{40:[1,176]},{40:[1,177]},o($Vc,[2,72]),o($Vc,[2,78]),o($Vc,[2,74]),o($Vc,[2,76]),o($Vc,[2,48]),o($Vc,[2,50]),o($Vc,[2,52]),o($Vc,[2,54]),o($Vc,[2,49]),o($Vc,[2,51]),o($Vc,[2,53]),o($Vc,[2,55]),o($Vc,[2,58]),o($Vc,[2,59]),o($Vc,[2,62]),o($Vc,[2,63]),o($Vc,[2,60]),o($Vc,[2,61]),o($Vc,[2,64]),o($Vc,[2,65]),o($Vc,[2,86]),o($Vc,[2,87]),{27:[1,178]},{27:[1,179]},{27:[1,180]},{27:[1,181]},o($Vc,[2,71]),o($Vc,[2,77]),o($Vc,[2,73]),o($Vc,[2,75])],
defaultActions: {26:[2,1]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"flex":true,"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */;
break;
case 1:return 16;
break;
case 2:return 18
break;
case 3:return 27;
break;
case 4:return 26;
break;
case 5:return 32
break;
case 6:return 29;
break;
case 7:return 19;
break;
case 8:return 17;
break;
case 9:return 21;
break;
case 10:return 24;
break;
case 11:return 45;
break;
case 12:return 31;
break;
case 13:return 25;
break;
case 14:return "plus";
break;
case 15:return "min";
break;
case 16:return "div";
break;
case 17:return "parameter";
break;
case 18:return "parameter";
break;
case 19:return "parameter";
break;
case 20:return "mod";
break;
case 21:return "mult";
break;
case 22:return "goto";
break;
case 23:return 54
break;
case 24:return "gotoeq";
break;
case 25:return "gotoneq";
break;
case 26:return "gotogt";
break;
case 27:return "gotolt";
break;
case 28:return "gotogte";
break;
case 29:return "gotolte";
break;
case 30:return "begin";
break;
case 31:return "end";
break;
case 32:return "squarel";
break;
case 33:return "squarer";
break;
case 34:return "print";
break;
case 35:return 42;
break;
case 36:return 44;
break;
case 37:return 28;
break;
case 38:return 30;
break;
case 39:/comentario lineal/
break;
case 40:/comentario lineal/
break;
case 41:return 'invalid';
break;
case 42:return 5;
break;
case 43:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:\s+)/i,/^(?:var)/i,/^(?:E)/i,/^(?:[l][0-9]+)/i,/^(?:[t][0-9]+)/i,/^(?:[0-9]+(\.[0-9]+)?\b)/i,/^(?:call)/i,/^(?:H)/i,/^(?:P)/i,/^(?:Heap)/i,/^(?:Stack)/i,/^(?:if)/i,/^(?:=)/i,/^(?:,)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\/)/i,/^(?:"%c")/i,/^(?:"%i")/i,/^(?:"%d")/i,/^(?:%)/i,/^(?:\*)/i,/^(?:goto)/i,/^(?:proc)/i,/^(?:==)/i,/^(?:<>)/i,/^(?:>)/i,/^(?:<)/i,/^(?:>=)/i,/^(?:<=)/i,/^(?:begin)/i,/^(?:end)/i,/^(?:\[)/i,/^(?:\])/i,/^(?:print)/i,/^(?:\()/i,/^(?:\))/i,/^(?::)/i,/^(?:[_A-Za-z][_A-Za-z0-9]*)/i,/^(?:;[^\n]*)/i,/^(?:##[^\n]*)/i,/^(?:.)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if ( true && typeof exports !== 'undefined') {
exports.parser = code3d;
exports.Parser = code3d.Parser;
exports.parse = function () { return code3d.parse.apply(code3d, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(__webpack_require__(/*! path */ "./node_modules/path-browserify/index.js").normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if ( true && __webpack_require__.c[__webpack_require__.s] === module) {
  exports.main(process.argv.slice(1));
}
}


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/components/style-helpers/button-shared-styles.js":
/*!**************************************************************!*\
  !*** ./src/components/style-helpers/button-shared-styles.js ***!
  \**************************************************************/
/*! exports provided: ButtonSharedStyles, StyledButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ButtonSharedStyles", function() { return ButtonSharedStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StyledButton", function() { return StyledButton; });
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");


const ButtonSharedStyles = _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
  a,button {
    font-size: inherit;
    vertical-align: middle;
    background: #fff;
    border: none;
    cursor: pointer;
    outline:none;
    box-shadow: var(--shadow-elevation-4dp_-_box-shadow);
    text-decoration: none;
  }

  button.rounded {
    border-radius:100%;
    width: 44px;
    height: 44px;
  }

  button:hover svg {
    fill: var(--accent-color);
  }

  .md{
    height: 50px;
    margin-top: 25px;
  }

  .primary {
    background-color:var(--dark-primary-color);
    color:white;    
    font-weight: 600;
  }

  .primary span svg{
    fill:white;
  }

  .text {
    border: 1px solid var(--dark-primary-color);
    color: var(--dark-primary-color);
  }

  .text span svg{
    fill: var(--dark-primary-color);
  }

  .centered {
    transform: translateX(-50%);
    margin-left: 50%;
    margin-top: 25px;
  }
  
  @media (max-width: 840px){
    form .centered{
      transform: none;
      margin: auto;
    }

    form .centered.md {
      margin-top: 12.5px;
    }

  }`;

const StyledButton = _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
    .styled-button {
        display: inline-block;
    }
    
    .styled-button {
        display: inline-block;
        box-sizing: border-box;
        border: 2px solid var(--dark-primary-color);
        background-color: #FFF;
        font-size: 14px;
        font-weight: 500;
        color: var(--dark-primary-color);
        margin: 0;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        border-radius: 0;
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
        padding: 0;
    }
    
    .styled-button > * {
        width:100%;
        display:inline-block;
        cursor:pointer;
        font-weight:bolder;
    }
    
    .styled-button:focus, .styled-button > *:focus {
        background-color: #c5cad3;
    }
    
    .styled-button:hover, .styled-button:active, .styled-button  > *:active {
        background-color: var(--dark-primary-color);
        color: #FFF;
    }
    
    @media (max-width: 767px) {
        .styled-button [responsive] {
        position: var(--layout-fixed-bottom_-_position); 
        right: var(--layout-fixed-bottom_-_right); 
        bottom: var(--layout-fixed-bottom_-_bottom); 
        left: var(--layout-fixed-bottom_-_left);
        height: 64px;
        z-index: 1;
    }
    
    .styled-button [responsive] > * {
        background-color: var(--dark-primary-color);
        border: none;
        color: white;
        padding: 20px;
        width: 100%;
        height: 100%;
        font-size: 15px;
    }
    
    .styled-button [responsive] > *:focus {
        background-color: var(--dark-primary-color);
    }
}`;

/***/ }),

/***/ "./src/components/style-helpers/keyframes.js":
/*!***************************************************!*\
  !*** ./src/components/style-helpers/keyframes.js ***!
  \***************************************************/
/*! exports provided: flipEffect, RippleEffect, HostFadeEffects, ComponentsFadeEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flipEffect", function() { return flipEffect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RippleEffect", function() { return RippleEffect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HostFadeEffects", function() { return HostFadeEffects; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentsFadeEffect", function() { return ComponentsFadeEffect; });
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");


const flipEffect = _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
  .spin {
    -webkit-animation-name: spinner;
    -webkit-animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-duration: 6s;

    animation-name: spinner;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-duration: 6s;

    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .spin:hover {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }`;

const RippleEffect = _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
  @keyframes ripple {
    0% {
        box-shadow: 0px 0px 0px 1px rgba(1, 136, 209, 0);
    }
    50% {
        box-shadow: 0px 0px 2.5px 25px rgba(1, 136, 209, 0.20);
    }
    100% {
        box-shadow: 0px 0px 2.5px 50px rgba(1, 136, 209, 0.10);;
    }
  }`;


const HostFadeEffects = _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`

  @keyframes fade-in-opacity-transition {
    from { visibility: hidden; opacity: 0; }
    to { opacity: 1; visibility: visible; }
  }

  @keyframes fade-out-opacity-transition {
    from { opacity: 1; visibility: visible; }
    to { visibility: hidden; opacity: 0; }
  }

  :host(.fadein) {
    animation: fade-in-opacity-transition .5s 1 normal linear;
  }

  :host(.fadeout) {
    animation: fade-out-opacity-transition .5s 1 normal linear forwards;
  }

  :host(.hide){
    display: none;
  }
`;

const ComponentsFadeEffect = _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`

    @keyframes fade-opacity-forwards{
        from { opacity: 0; visibility: hidden; }
        to { opacity: 1; visibility: visible; }
    }
    
    @keyframes fade-opacity-reverse{
        from { opacity: 1; visibility: visible; }
        to { opacity: 0; visibility: hidden; }
    }

    .fadein {
        animation: fade-opacity-forwards ease-in-out 250ms forwards normal;
    }

    .fadeout {
        animation: fade-opacity-reverse ease-in-out 250ms forwards normal;
    }

    .fadeout-delay {
        animation: fade-opacity-reverse ease-in-out 250ms forwards normal;
        visibility: visible;
        opacity: 1;
        animation-delay: 250ms;
    }

    .fadein-delay {
        animation: fade-opacity-forwards ease-in-out 250ms forwards normal;
        visibility: hidden;
        opacity: 0;
        animation-delay: 250ms;
    }

    .iron-selected label.index::after{
        content: none;
    }
`

/***/ }),

/***/ "./src/components/symbol-table/symbol-table.js":
/*!*****************************************************!*\
  !*** ./src/components/symbol-table/symbol-table.js ***!
  \*****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");
/* harmony import */ var _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style-helpers/shared-styles */ "./src/components/style-helpers/shared-styles.js");
/* harmony import */ var _backend_backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../backend/backend */ "./src/backend/backend.js");




class SymbolTable extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  static get properties () {
    return {
      information: Object,
      keys: Array
    }
  }

  static get styles () {
    return [
      _style_helpers_shared_styles__WEBPACK_IMPORTED_MODULE_1__["MainSharedStyle"],
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
        * {
            box-sizing: border-box;
        }
        :host {
            display:block;
            height: 100%;
        }

        .row,.header {
            display: grid;
            grid-template-columns: repeat(9,1fr);
            text-align:center;
        }

        .header {
            background: var(--accent-color);
            color: white;
            border-radius: 5px 5px 0 0;
            font-size: 1.5em;
            padding: 8px;
        }

        .title{
            background: var(--default-primary-color);
            font-size: 1.5em;
        }

        .row label, .header label {
            display: inline-block;
            width: auto;
        }

        .row:last-child{
            border-radius: 0 0 5px 5px;
        }

        .body{
            overflow: auto;
            height: 87.5%;
            display: block;
        }

        .container {
            height: 100%;
        }
        `
    ]
  }

  constructor () {
    super()
    this.keys = ['identifier', 'position', 'type', 'aux-type', 'rol', 'constant', 'scope', 'dimensions', 'parameters']
    this.information = {}
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
        <div class="container">
            <div class="header">
                ${this.keys.map(it => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<label>${it}</label>`)}
            </div>
            <div class="body" id="main-content">
                ${this.isObjectEmpty(this.information) ? ''
                : Object.keys(this.information).map((key) => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
                            <div class ="title">${isNaN(key) ? key : _backend_backend__WEBPACK_IMPORTED_MODULE_2__["Backend"].Classes.reverseMap(key)}</div>
                            ${this.information[key].map(el =>
                    _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<div class="row">${this.keys.map((it) => _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`<label>${el[it]}</label>`)}</div>`
                )}
                    `)
            }
            </div>
        </div>`
  }
}

customElements.define('symbol-table', SymbolTable)


/***/ }),

/***/ "./src/components/views/page-view-element.js":
/*!***************************************************!*\
  !*** ./src/components/views/page-view-element.js ***!
  \***************************************************/
/*! exports provided: PageViewElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageViewElement", function() { return PageViewElement; });
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");


class PageViewElement extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  // Only render this page if it's actually visible.
  shouldUpdate() {
    return this.active;
  }
  
  static get styles(){
    return [
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
        :host {
          height: fit-content;
          display: block;
          padding: 25px;
          background: var(--light-secondary-color);
        }
      `
    ];
  }

  static get properties() {
    return {
      active: { type: Boolean }
    }
  }
}


/***/ }),

/***/ "./src/components/views/primary-view.js":
/*!**********************************************!*\
  !*** ./src/components/views/primary-view.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page_view_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page-view-element.js */ "./src/components/views/page-view-element.js");
/* harmony import */ var _style_helpers_shared_styles_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style-helpers/shared-styles.js */ "./src/components/style-helpers/shared-styles.js");
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");
/* harmony import */ var _console_console_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../console/console-element */ "./src/components/console/console-element.js");
/* harmony import */ var _editors_codemirror_editor_editor_cql__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../editors/codemirror-editor/editor-cql */ "./src/components/editors/codemirror-editor/editor-cql.js");
/* harmony import */ var _native_components_custom_accordion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../native-components/custom-accordion */ "./src/components/native-components/custom-accordion.js");
/* harmony import */ var _base_form__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../base-form */ "./src/components/base-form.js");
/* harmony import */ var _style_helpers_button_shared_styles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../style-helpers/button-shared-styles */ "./src/components/style-helpers/button-shared-styles.js");
/* harmony import */ var _editors_codemirror_editor_import_component_import_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../editors/codemirror-editor/import-component/import-component */ "./src/components/editors/codemirror-editor/import-component/import-component.js");
/* harmony import */ var _style_helpers_my_icons_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../style-helpers/my-icons.js */ "./src/components/style-helpers/my-icons.js");










// import { AstNode } from '../parser/ast/ast-node.js';
// MAYBE USE CODE MIRROR

class PrimaryView extends _page_view_element_js__WEBPACK_IMPORTED_MODULE_0__["PageViewElement"] {
  static get styles () {
    return [
      _style_helpers_shared_styles_js__WEBPACK_IMPORTED_MODULE_1__["SharedStyles"],
      _style_helpers_shared_styles_js__WEBPACK_IMPORTED_MODULE_1__["MainSharedStyle"],
      _style_helpers_button_shared_styles__WEBPACK_IMPORTED_MODULE_7__["ButtonSharedStyles"],
      ...super.styles,
      _base_element__WEBPACK_IMPORTED_MODULE_2__["css"]`
        :host {
          --paper-tabs-selection-bar-color: var(--light-primary-color);
          --iron-icon-fill-color: var(--dark-primary-color);
        }

        custom-accordion{
          width: 95%;
          margin: auto;
          background: white;
          box-shadow: var(--shadow-box-2dp-custom);
          border-radius: 5px;
          margin: 5px auto;
        }

        textarea {
          background: blue;
          color: white;
          width: 100%;
          height: 1000px;
          outline: none;
          border: 0;
        }

        paper-tab.iron-selected{
          background: var(--accent-color);
          color: var(--light-primary-color);
          fill: var(--light-primary-color);
        }

        paper-tab {
          width: 30%;
          max-width: 30%;
          min-width: 30%;
          background: var(--dark-primary-color);
          color: white;
          fill: white;
          border-radius: 5px 5px 0 0;
        }

        paper-tab:not(:last-child){
          margin: 2px;
        }

        #plus-paper-tab {
          width: 50px;
          min-width: 50px;
          max-width: 50px;
        }

        paper-tab:hover {
          background: var(--accent-color);
          color: var(--light-primary-color);
          fill: var(--light-primary-color);
        }

        paper-tabs{
          width: 90% !important;
          margin: auto;
        }

        paper-tab span {
          position: absolute;
          right: 0;
          top: 11px;
        }
      `
    ]
  }

  static get properties () {
    return {
      information: { type: Object },
      errors: { type: Array },
      graph: { type: String },
      blockgraph: { type: String },
      files: { type: Object },
      selected: { type: Number },
      windows: { type: Array },
      current: { type: Number }
    }
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_2__["html"]`
      <custom-accordion id="import">
        <label style="line-height: 1.75;" slot="title-box">Carpeta para importar</label>
        <import-component slot="panel-box" @update-import=${this.updateData} @open-file="${this.open}"></import-component>
      </custom-accordion>
      <paper-tabs scrollable fit-container .selected="${this.selected}">
      ${this.windows.map((el, idx) => _base_element__WEBPACK_IMPORTED_MODULE_2__["html"]`<paper-tab idx="${idx}" @click="${this.selectTab}">${el}${idx === 0 ? '' : _base_element__WEBPACK_IMPORTED_MODULE_2__["html"]`<span idx="${idx}" @click=${this.close}>${_style_helpers_my_icons_js__WEBPACK_IMPORTED_MODULE_9__["closeIcon"]}</span>`}</paper-tab>`)}
        <paper-tab @click="${this.newTab}" id="plus-paper-tab">${_style_helpers_my_icons_js__WEBPACK_IMPORTED_MODULE_9__["plusIcon"]}</paper-tab>
      </paper-tabs>
      <iron-pages .selected="${this.selected}">
        ${this.windows.map(el => _base_element__WEBPACK_IMPORTED_MODULE_2__["html"]`<editor-cql
          @info-setted="${this.setInfo}"
          @graphviz-generated="${this.changeGraph}"
          .files=${this.files}
          @blockgraph-generated="${this.changeBlockGraph}"></editor-cql>`)}
      </iron-pages>
      <console-element .information=${this.information} .errors="${this.errors}" .graph="${this.graph}" .blockgraph="${this.blockgraph}"></console-element>
    `
  }

  updateData (e) {
    this.files = e.detail
    this.requestUpdate()
  }

  open (e) {
    // changed this to work on multiple windows
    this.$$$('editor-cql')[this.selected].openFile(e.detail)
  }

  setInfo (e) {
    this.information = e.detail.symtab
    this.errors = e.detail.errors
    this.requestUpdate()
  }

  selectTab (e) {
    this.selected = Number(e.currentTarget.getAttribute('idx'))
  }

  newTab () {
    this.windows.push(`New${this.current++}.j`)
    this.requestUpdate()
  }

  constructor () {
    super()
    this.information = {}
    this.files = {}
    this.errors = []
    this.graph = ''
    this.selected = 0
    this.windows = ['New0.j']
    this.current = 1
  }

  changeGraph (e) {
    this.graph = e.detail
  }

  changeBlockGraph (e) {
    this.blockgraph = e.detail
  }

  close (e) {
    e.preventDefault()
    this.windows.splice(Number(e.currentTarget.getAttribute('idx')), 1)
    setTimeout(() => { this.selected = this.windows.length - 1 }, 250)
  }
}

window.customElements.define('primary-view', PrimaryView)


/***/ })

}]);
import {
  BaseLit,
  css,
  html
} from '../../base-element'
import {
  codeMirrorEditorCSS
} from './CSSMirrorEditorStyles.js'
import './code-mirror-global.js'
import CodeMirror from 'codemirror/src/codemirror.js'
import 'codemirror/mode/pascal/pascal'
import 'codemirror/mode/clike/clike'
import '@polymer/paper-button/paper-button'
import '../../native-components/custom-switch'
import '../../native-components/custom-simple-modal'
import "../../../backend2/utilities/datos";
import { TablaSimbolos } from "../../../backend2/estructuras/tabla-simbolos";
import { TablaObjetos } from "../../../backend2/estructuras/tabla-objetos";
import {
  fileUpload,
  playIcon,
  saveIcon,
  refreshIcon,
  translateIcon,
  stopIcon,
  keepPlaying,
  assembly,
  pasteboardIcon,
  dnsIcon,
  plusIcon
} from '../../style-helpers/my-icons'
import {
  MainSharedStyle,
  SharedStyles
} from '../../style-helpers/shared-styles'
import {
  Interpreter
} from '../../interpreter/code-3d-interpreter'
import {
  programGen
} from '../../interpreter/generators'
import { jsharp, JSharpRoot } from '../../../backend/parser/jsharp'
import { Backend } from '../../../backend/backend'
import { code3d, Root } from '../../parser/code3d'
import { peepHole } from '../../optimization/optimization-peephole'
import { optimizationByBlock } from '../../optimization/optimization-block'
import { ejecutor } from "../../../backend2/gramaticas/ejecutor";

class EditorCQL extends BaseLit {
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
      MainSharedStyle,
      SharedStyles,
      codeMirrorEditorCSS,
      css`
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

    this.code_editor = CodeMirror.fromTextArea(this.editor, {
      lineNumbers: true,
      gutters: ['CodeMirror-linenumbers', 'breakpoints'],
      matchBrackets: true,
      mode: 'text/x-java'
    })

    this.code_editor_3D = CodeMirror.fromTextArea(this.editor3D, {
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
      Backend.CurrentFile = [this.name]
    })
  }

  render () {
    return html`
            <div class="upload-btn-wrapper" style="grid-column: 1 / 3;">
                <button class="btn"><span>${fileUpload}</span></button>
                <input type="file" name="myfile" id="real-input"/>
                <paper-button @click="${this.translate}">${translateIcon}</paper-button>
                ${this.started === 0 ? html`<paper-button @click="${this.interpret}">${playIcon}</paper-button>` : ''}
                ${this.started !== 0 ? html`<paper-button @click="${this.debugg}">
                    ${this.started == 1 ? keepPlaying : stopIcon}</paper-button>` : ''}
                <paper-button @click="${this.save}">${saveIcon}</paper-button>
                <paper-button @click="${this.refresh}">${refreshIcon}</paper-button>
                <paper-button @click="${this.optimization}" title="Optimización por mirilla">${assembly}</paper-button>
                <paper-button @click="${this.blockOptimization}" title="Optimización por bloques">${dnsIcon}</paper-button>
            </div>
            <div style="grid-column:1 / 3; border-bottom: 1px solid black;">${this.debugged_line > 0 ? `Current Line: ${this.debugged_line}` : ''}</div>
            <div>
                <h3>MATRIOSHTS</h3>
                <textarea id="pascaltext"></textarea>
            </div>
            <div id="container-3D">
                <h3>3D CODE</h3>
                <textarea id="code3D"></textarea>
            </div>
            <custom-accordion id="optimization">
              <label style="line-height: 1.75;" slot="title-box">Codigo optimizado</label>
              <div slot="panel-box" style="max-height:50vh; overflow:auto; width:100%;" class="overflowable">
                <span class="icon" @click=${this.copyToClipboard} title="Copiar contenido">${pasteboardIcon}</span>
                <pre class="lines">${this.optCode ? this.optCode.split('\n').map((el, idx) => idx + 1).slice(0, -1).join('.\n') : ''}</pre>
                <pre>${this.optCode ? this.optCode : ''}</pre>
              </div>
            </custom-accordion>
            <custom-simple-modal id="modal"></custom-simple-modal>
        `
  }


  async translate() {
    window.limpiarTodo();
    let arbol;
   try {
      arbol = ejecutor.parse(this.src);
    } catch (e) {
      window.dispatchEvent(
       new CustomEvent("graficar-errores", { detail: window.errores })
      );
    }
    if (!arbol) {
      return;
    }
    let declasGlobales = arbol.declasGlobales();
    window.primeraPasada = false;
    let resultado = arbol.traducir();
    arbol.graficarArbol2();
    window.dispatchEvent(
      new CustomEvent("graficar-tree", { detail: window.strArbol })
    );
    this.translate2(declasGlobales + window.strObjetos + window.strFunciones +   "void main() {\n" + resultado+"}");
    if (window.errores.length > 0) {
      window.dispatchEvent(
        new CustomEvent("graficar-errores", { detail: window.errores })
      );
      return;
    }
  }

  async translate2 (src) {
    if (src === '') return
    try {
      if (jsharp.parse(src)) {
        window.index = 0
        JSharpRoot.setIndex(window.index)
        //

        try {
          this.graphViz(JSharpRoot)
          // execute the root node
          this.code3D = Backend.process(JSharpRoot, this.files)
          this.code_editor_3D.setValue(this.code3D)

          let alldata = {}
          // we set the symbol table information of every class

          for (const sT of Backend.ClassTemplates.keys()) {
            // sT es the key
            alldata = { ...alldata, ...Backend.ClassTemplates.get(sT).jsonify(sT) }
          }

          // we iterate through the main symbol table
          alldata = { ...Backend.SymbolTable.jsonify('globales') }

          Backend.Root.setIndex(window.index)

          this.fire('info-setted', {
            symtab: alldata,
            errors: Backend.Errores
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
              errors: (Backend.Errores.length === 0) ? [e.message] : Backend.Errores.map(it => `[SEMANTICO: ${it} ]`)
            })

            return
          } else {
            this.code_editor_3D.setValue('OCURRIO UN ERROR, VEA LA CONSOLA DE ERRORES')
          }

          if (Backend.Root != null) {
            Backend.Root.setIndex(window.index)
            this.graphViz(Backend.Root)
          }

          this.fire('info-setted', {
            symtab: {},
            errors: Backend.Errores.map(it => `[SEMANTICO: ${it} ]`)
          })
        }
      }
    } catch (e) {
      console.log(e)
      window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'parsing failed' }))
      if (this.isObject(e) && e.hash) {
        let parse = `[${e.hash.token === 'INVALID' ? 'LEXICO' : 'SINTACTICO'} AT LINE ${e.hash.loc.first_line}`
        parse += ` COLUMN ${e.hash.loc.first_column} FOUND ${e.hash.text} EXPECTED: ${e.hash.expected.join(',')} IN FILE ${Backend.CurrentFile}]`
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

    if (code3d.parse(this.codigo3D)) {
      Interpreter.setBreakPoint(this.breakPoints)
      Interpreter.lineByLine = this.$$('custom-switch').value()
      window.executeLine = programGen(Root)

      this.parsed = true
    }

    Interpreter.executeProgram(this.temporary)
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
      Interpreter.setBreakPoint(this.breakPoints)
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
    Interpreter.setBreakPoint(this.breakPoints)
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
    Interpreter.onResolve(true)
  }

  graphViz (node) {
    this.graph = `Digraph G {
            ${node.writeNode()}
        }`

    this.fire('graphviz-generated', this.graph)
  }

  blockOptimization () {
    if (this.codigo3D === '') return

    if (code3d.parse(this.codigo3D)) {
      optimizationByBlock.divideByBlocks(Root)
    }

    window.dispatchEvent(new CustomEvent('snackbar-message', { detail: 'optimization by blocks done' }))
  }

  openFile (e) {
    this.name = e
    this.src = this.files[e].src
    this.code_editor.setValue(this.src)
    Backend.CurrentFile = [e]
    this.requestUpdate()
  }

  optimization () {
    if (this.codigo3D === '') return

    if (code3d.parse(this.codigo3D)) {
      peepHole.programOptimization(Root)
    }
    let tmpNode = Root.next
    this.optCode = Root.toString()
    while (tmpNode != null) {
      this.optCode += tmpNode.toString()
      tmpNode = tmpNode.next
    }
  }

  setVarGlobal () {
    Backend.VarFlag = this._('varglobal').value()
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

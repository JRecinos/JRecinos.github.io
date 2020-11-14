import {
  PageViewElement
} from './page-view-element.js'
import {
  SharedStyles, MainSharedStyle
} from '../style-helpers/shared-styles.js'
import {
  css,
  html
} from '../base-element'
import '../console/console-element'
import '../editors/codemirror-editor/editor-cql'
import '../native-components/custom-accordion'
import { fetchQuery } from '../base-form'
import { ButtonSharedStyles } from '../style-helpers/button-shared-styles'
import '../editors/codemirror-editor/import-component/import-component'
import { plusIcon, closeIcon } from '../style-helpers/my-icons.js'
// import { AstNode } from '../parser/ast/ast-node.js';
// MAYBE USE CODE MIRROR

class PrimaryView extends PageViewElement {
  static get styles () {
    return [
      SharedStyles,
      MainSharedStyle,
      ButtonSharedStyles,
      ...super.styles,
      css`
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
    return html`
      <custom-accordion id="import">
        <label style="line-height: 1.75;" slot="title-box">Carpeta para importar</label>
        <import-component slot="panel-box" @update-import=${this.updateData} @open-file="${this.open}"></import-component>
      </custom-accordion>
      <paper-tabs scrollable fit-container .selected="${this.selected}">
      ${this.windows.map((el, idx) => html`<paper-tab idx="${idx}" @click="${this.selectTab}">${el}${idx === 0 ? '' : html`<span idx="${idx}" @click=${this.close}>${closeIcon}</span>`}</paper-tab>`)}
        <paper-tab @click="${this.newTab}" id="plus-paper-tab">${plusIcon}</paper-tab>
      </paper-tabs>
      <iron-pages .selected="${this.selected}">
        ${this.windows.map(el => html`<editor-cql
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

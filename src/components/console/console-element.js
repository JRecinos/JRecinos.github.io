import { html, css, BaseLit } from '../base-element'
import { SharedStyles, OptionStyle, FormSharedStyle, MainSharedStyle } from '../style-helpers/shared-styles'
import { ButtonSharedStyles } from '../style-helpers/button-shared-styles'
import '@polymer/iron-pages/iron-pages'
import '@polymer/paper-tabs/paper-tabs'
import '@polymer/paper-tabs/paper-tab'
import '../error-console/error-component'
import '../heap-stack/heap-stack-component'
import '../symbol-table/symbol-table'
import '../../backend/ast/graph-tree'

class ConsoleElement extends BaseLit {
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
      MainSharedStyle,
      SharedStyles,
      ButtonSharedStyles,
      OptionStyle,
      FormSharedStyle,
      css`
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
    return html`<paper-tabs .selected="${this.selected}" scrollable >
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
                                ${this.console.map(item => html`<span>${item}</span>`)}
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

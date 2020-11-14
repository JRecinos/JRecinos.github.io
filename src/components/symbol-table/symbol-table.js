import {
  BaseLit,
  html,
  css
} from '../base-element'
import { MainSharedStyle } from '../style-helpers/shared-styles'
import { Backend } from '../../backend/backend'

class SymbolTable extends BaseLit {
  static get properties () {
    return {
      information: Object,
      keys: Array
    }
  }

  static get styles () {
    return [
      MainSharedStyle,
      css`
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
    return html`
        <div class="container">
            <div class="header">
                ${this.keys.map(it => html`<label>${it}</label>`)}
            </div>
            <div class="body" id="main-content">
                ${this.isObjectEmpty(this.information) ? ''
                : Object.keys(this.information).map((key) => html`
                            <div class ="title">${isNaN(key) ? key : Backend.Classes.reverseMap(key)}</div>
                            ${this.information[key].map(el =>
                    html`<div class="row">${this.keys.map((it) => html`<label>${el[it]}</label>`)}</div>`
                )}
                    `)
            }
            </div>
        </div>`
  }
}

customElements.define('symbol-table', SymbolTable)

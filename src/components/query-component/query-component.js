import { html, css, BaseLit } from '../base-element'
import { SharedStyles, HostEditStyle, OptionStyle, FormSharedStyle, MainSharedStyle } from '../style-helpers/shared-styles'
import { ButtonSharedStyles } from '../style-helpers/button-shared-styles'

class QueryComponent extends BaseLit {
  static get properties () {
    return {
      idx: { type: Number, reflect: true },
      dataset: { type: Array }
    }
  }

  constructor () {
    super()
    this.dataset = []
  }

  static get styles () {
    return [
      SharedStyles,
      ButtonSharedStyles,
      OptionStyle,
      FormSharedStyle,
      MainSharedStyle,
      css`
                :host {
                    --paper-tabs-selection-bar-color: var(--default-primary-color);
                    height: 90%;
                    background: white;
                    display: block;
                    padding: 5px 0 0 0;
                    height: 100%;
                }

                div.table, div.header, div.row {
                    width: max-content;
                    padding: 0;
                    font-size: 0;
                }

                div.row:nth-child(n){
                    background: var(--light-primary-color);
                }
                div.row:nth-child(2n){
                    background: var(--dark-primary-color);
                }

                div.row > div, div.header > div {
                    width: max-content;
                    min-width: 250px;
                    font-size: 14px;
                    display: inline-block;
                }

                main {
                    overflow: auto;
                    height: 100%;
                }

                main:hover{
                    transform: none;
                }
            `
    ]
  }

  render () {
    return html`
            <main id="main-content">
                ${this.dataset.length > 0 ? html`
                    <div class="table">
                        <div class="header">
                            ${Object.keys(this.dataset[0]).map(it => html`<div>${it}</div>`)}
                        </div>
                        <div class="body">
                            ${this.dataset.map(item => html`
                                <div class="row">
                                ${
                                    Object.keys(item).map(subitem =>
                                        html`${this.isObject(item[subitem])
                                            ? html`<div><pre>${JSON.stringify(item[subitem])}</pre></div>` : (Array.isArray(item[subitem]))
                                            ? html`<div><pre>${JSON.stringify(item[subitem])}</pre></div>` : html`<div>${item[subitem]}</div>`}`)
                                }
                                </div>
                            `)}
                        </div>
                    </div>`
                    : html`<div class="empty"></div>`}
            </main>
        `
  }
}

window.customElements.define('query-component', QueryComponent)

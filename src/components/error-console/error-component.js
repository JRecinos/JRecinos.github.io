import { css, html, BaseLit } from '../base-element'
import { SharedStyles } from '../style-helpers/shared-styles'

import {} from "../../backend2/utilities/plantillaError";
class ErrorComponent extends BaseLit {
  static get properties () {
    return {
      optimization: { type: Boolean },
      errors: { type: Array }
    }
  }

  static get styles () {
    return [
      SharedStyles,
      css`
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

  constructor() {
    super();
    this.errores = [];
    window.addEventListener("graficar-errores", (e) => {
      this.errores = e.detail;
      this.requestUpdate();
    });
  }

  render2 () {
    return html`
    
      <main id="main-content">
            ${!this.optimization ? html`
              ${this.errors.map((it) => html`<div class="row">
                    ${it}
                </div>`)}` : html`<div class="row header">
                  <div>Regla</div><div>Linea</div><div>Antiguo</div><div>Nuevo</div>
                </div>
                ${this.errors.map((it) => html`<div class="row">
                  <div>${it.rule}</div><div>${it.line}</div><div>${it.oldval}</div><div>${it.newval}</div>
              </div>`)}`
            }
      </main>

    `
  }

  render(){
    return html`
    <main id="main-content">
        <div class="header">
          <div style="text-align: center; font-weight: bolder; width: 23%;">
            Tipo
          </div>
          <div style="text-align: center; font-weight: bolder; width: 23%;">
            Descripcion
          </div>
          <div style="text-align: center; font-weight: bolder; width: 23%;">
            Linea
          </div>
          <div style="text-align: center; font-weight: bolder; width: 23%;">
            Columna
          </div>
        </div>
        ${this.errores.map(
          (err) => html`<div class="row">
            <div style="text-align: center;">${err.getTipo()}</div>
            <div>${err.getDescripcion()}</div>
            <div style="text-align: center;">${err.getLinea()}</div>
            <div style="text-align: center;">${err.getColumna()}</div>
          </div>`
        )}
      </main>`
  }
}

window.customElements.define('error-component', ErrorComponent)

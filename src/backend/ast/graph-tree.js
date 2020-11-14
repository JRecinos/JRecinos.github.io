import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'
import { css, html, BaseLit } from '../../components/base-element'
import { SharedStyles, MainSharedStyle } from '../../components/style-helpers/shared-styles'

class GraphTree extends BaseLit {
  static get properties () {
    return {
      src: { type: String, reflect: true },
      svg: { type: String }
    }
  }

  static get styles () {
    return [
      SharedStyles,
      MainSharedStyle,
      css`
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
    return html`
      <main id="main-content">
          ${this.svg !== '' ? unsafeHTML(this.svg) : ''}
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

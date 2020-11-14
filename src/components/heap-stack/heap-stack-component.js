import { css, html, BaseLit } from '../base-element'
import { SharedStyles, MainSharedStyle } from '../style-helpers/shared-styles'
// import { floatIcon } from '../style-helpers/my-icons'

class HeapStackComponent extends BaseLit {
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
      SharedStyles,
      MainSharedStyle,
      css`
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
    return html`
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
                ${this.heap.map((it, index) => html`<div class="line"><span>${index}:</span><span class="${it != -1 ? 'occupied' : 'free'}">${it}</span></div>`)}
            </div>
            <div>
                <span>STACK</span>
                ${this.stack.map((it, index) => html`<div class="line"><span>${index}:</span><span class="${it != -1 ? 'occupied' : 'free'}">${it}</span></div>`)}
            </div>
            <div style="margin: 0 auto auto;">
                <span>TEMPORARY</span>
                ${Object.keys(this.temporaries).map((it) => html`<div class="line"><span>${it}:</span><span>${this.temporaries[it]}</span></div>`)}
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

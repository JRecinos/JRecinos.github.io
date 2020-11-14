import { html, css, BaseLit } from '../../../base-element'

export class ImportComponent extends BaseLit {
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
      css`
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
    return html`<input type="file" webkitdirectory="" directory="" @change=${this.handleFileSelect}>
                <div class="objects"> ${this.isObjectEmpty(this.output) ? '' : Object.keys(this.output).map(it => html`
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

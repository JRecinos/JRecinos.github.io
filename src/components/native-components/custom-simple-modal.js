import {
  html,
  css,
  BaseLit
} from '../base-element'
import {
  StyledButton
} from '../style-helpers/button-shared-styles'
import {
  RippleEffect
} from '../style-helpers/keyframes'

class CustomSimpleModal extends BaseLit {
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
      StyledButton,
      RippleEffect,
      css`
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
    return html`
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

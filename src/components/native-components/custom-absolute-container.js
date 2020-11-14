import { html, css, BaseLit } from '../base-element';
import { SharedStyles } from '../style-helpers/shared-styles';
import { ButtonSharedStyles } from '../style-helpers/button-shared-styles';
import { messageIcon, accountCircleIcon } from '../style-helpers/my-icons';

class CustomAbsoluteContainer extends BaseLit {

    static get styles() {
        return [
            SharedStyles,
            ButtonSharedStyles,
            css`
                :host{
                    position: relative;
                    display: block;
                    width: 52px;
                }

                :host([left]) .container{
                    left: calc(-50vw - 40px);
                }

                .container{
                    left: 40px;
                    top: 36px;
                    max-height: 0;
                    transform: scale(0);
                    position: absolute;
                    width: auto;
                    border-radius: 5px;
                    background: var(--secondary-background-color);
                    box-shadow: var(--shadow-elevation-8dp_-_box-shadow);
                    z-index: 140;
                    transition-property: transform, max-height;
                    transition: all 250ms ease;
                    min-width: 50vw;
                    text-align: center;
                }         

                
                .selected{
                    max-height: max-content;
                    padding: 25px;
                    transform: scale(1);
                    left: -650px;
                    width: 400px;
                    z-index: 200;
                    top: 0;
                    background: var(--accent-color);
                } 

                .show {
                    display: block;
                }

                .hidden {
                    display: none;
                }

                paper-button{
                    min-width: 50px;
                    height: 50px;
                    border-radius: 50px;
                    margin: 0;
                    padding: 0;
                }

                paper-button[toggles][active] {
                    background: #ccc;
                }

                paper-button span {
                    fill: white;
                    padding-top: 4px;
                }
            `
        ]
    }

    render() {
        return html`
            <paper-button @click="${this._showContainer}" toggles>
                <span class="${this.icon == "message" ? "show" : "hidden"}">${messageIcon}</span>
                <span class="${this.icon == "account" ? "show" : "hidden"}">${accountCircleIcon}</span>
            </paper-button>
            <div class="container">
                <slot></slot>
            </div>
        `;
    }

    static get properties() {
        return {
            icon: { type: String },
            open: { type: Boolean }
        }
    }

    _showContainer() {
        this.$$(".container").classList.toggle("selected");
        this.open = !this.open;
        this.fire(`container-${this.open ? "opened" : "closed"}`);
    }

}

customElements.define('custom-absolute-container', CustomAbsoluteContainer);
import { html, css, BaseLit } from '../base-element';
import {DividerStyle, SharedStyles} from '../style-helpers/shared-styles';
import './custom-spinner'

class CardElement extends BaseLit{

    static get styles(){
        return [
            SharedStyles,
            DividerStyle,
            css`
            :host{
                box-shadow: var(--shadow-elevation-4dp_-_box-shadow);
                cursor: pointer;                    
                background: var(--secondary-background-color);
                transition: all 250ms ease;
                border-radius: 5px;
                margin: 5px;
                padding: 5px;
                transition-property: background, transform;
            }
            
            :host([active]){
                background: var(--accent-color);
                box-shadow: var(--shadow-elevation-8dp_-_box-shadow);
                transform: translateY(-5px);
            }

            :host([active]) ::slotted(*), :host([active]) h1{
                color:white;
            }

            :host(:hover){
                box-shadow: var(--shadow-elevation-8dp_-_box-shadow);
                transform: translateY(-5px);
            }
            /*
            ::slotted(label){
                margin: auto;
                width: 30%;
                font-size: 1.143em;
                padding: 4px 16px;
                color: var(--dark-primary-color);
                display: inline-block;
                text-align: center;
            }

            ::slotted(label:nth-child(2n+1)){
                font-weight: 700;
                text-align: left;
            }

            ::slotted(label:nth-child(2n+1)){
                text-align: right;
            }*/

            h1 {
                text-transform:uppercase;
                font-size: 2.75em;
            }

            slot[name="img"]{
                display: block;
                margin: auto;
                text-align: center;
            }
            
            .show {
                transform: scale(1);
                max-height: max-content;
                transition: transform 250ms ease-out, max-height 250ms ease-out;
            }
            
            .underline.show {
                max-height: 1px;
            }

            .hidden{
                transform: scale(0);
                max-height: 0;
            }
            
            custom-spinner{
                margin-top: 37.5px;
            }`
        ]
      }

    constructor(){
        super();
        this.paint = false;
        this.timeout = 1000;
    }

    static get properties(){
        return {
            label : { type : String },
            paint : { type : Boolean },
            timeout: { type : Number  },
            active : { type : Boolean, reflect: true }
        }
    }

    render(){
        return html`         
            <custom-spinner ?hidden="${this.paint}"></custom-spinner>
            <h1 class="${(!this.paint)?"hidden":"show"}">${(this.paint)?this.label:""}</h1>
            <div class="${(!this.paint)?"hidden":"show"} underline"></div>
            <div class="${(!this.paint)?"hidden":"show img"}">
                <slot name="img"></slot>
            </div>
            <div class="${(!this.paint)?"hidden":"show"}">
                <slot></slot>
            </div>
        `;
    }

    firstUpdated(){
        setTimeout(()=>{
            this.paint = true;
            this.requestUpdate();
        },this.timeout)
    }
}

customElements.define('card-element',CardElement);

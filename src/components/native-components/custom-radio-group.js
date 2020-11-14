import { html, css, BaseLit } from '../base-element';
import { SharedStyles } from '../style-helpers/shared-styles';
import { RippleEffect } from '../style-helpers/keyframes';


class CustomRadioGroup extends BaseLit {

    static get styles(){
        return [
            SharedStyles,
            RippleEffect,
            css`
            .md-radio {
                margin: 4px -3px;
                height: 30px;
            }
            .md-radio.md-radio-inline {
                display: inline-block;
            }
            .md-radio input[type="radio"] {
                display: none;
            }
            .md-radio input[type="radio"]:checked + label:before {
                border-color: var(--dark-primary-color);
                animation: ripple 0.25s linear;
            }


            .md-radio input[type="radio"]:checked:disabled + label:before, .md-radio input[type="radio"]:checked:disabled + label {
                border-color: var(--disabled-color);
            }

            .md-radio input[type="radio"]:checked:disabled + label:after {
                background-color: var(--disabled-color);
            }

            .md-radio input[type="radio"]:checked + label:after {
                transform: scale(1);
            }

            .md-radio label {
                color: var(--primary-text-color);
                display: inline-block;
                font-size: 1.143em;
                line-height: 2;
                height: 20px;
                position: relative;
                padding: 0 30px;
                margin-bottom: 0;
                cursor: pointer;
                vertical-align: bottom;
            }
            .md-radio label:before, .md-radio label:after {
                position: absolute;
                content: '';
                border-radius: 50%;
                transition: all 0.3s ease;
                transition-property: transform, border-color;
            }
            .md-radio label:before {
                left: 2px;
                top: 2px;
                width: 18px;
                height: 18px;
                border: 2px solid rgba(1, 136, 209, 0.54);
            }
            .md-radio label:after {
                top: 8px;
                left: 8px;
                width: 10px;
                height: 10px;
                transform: scale(0);
                background: var(--dark-primary-color);
            }

            .title{
                font-family :var(--app-font-family);
                padding : 0 2px;
                font-size : 1em;
                color : var(--ternary-text-color);
            }

            .invalid {
                border-radius: 5px;
                border: 1px solid var(--error-color);
            }`
        ];
    }

    constructor(){
        super();
        this.value = "";
        this.inline = false;
        this.options = [];
        this.selected = -1;
    }

    render(){
        return html`
            <label class="title">${this.title}</label>
            ${this.options.map((key,index) => html`
                <div class="md-radio ${this.inline?"inline":""} ${this.invalid?"invalid":""}">
                    <input type="radio" value="${key}" name="option" id="${key}" .checked="${this.selected==index}">
                    <label for="${key}" @click="${this._check}" value="${index}">${key}</label>
                </div>`)}`;
    }

    _check(event){
        event.preventDefault();
        let val = Number(event.currentTarget.getAttribute("value"));
        this.value = val == this.selected ? "" : event.currentTarget.innerText;
        this.selected = val == this.selected ? -1 : val;
        this.fire('value-changed', this.value);
    }

    uncheck(){
        this.selected = -1;
    }

    static get properties(){
        return {
            selected : { type : Number },
            value : { type : String },
            options : { type : Array },
            inline : { type : Boolean },
            required : { type : Boolean },
            invalid : { type : Boolean }
        }
    }

    update(changedProperties){
        
        if(changedProperties.has("value") && !changedProperties.get("value") ){
            this.invalid = false;
        }
        super.update(changedProperties);
    }

    validate(){

        if(this.required && !this.value) { this.invalid = true; return false; }

        return true;
    }
}

customElements.define('custom-radio-group',CustomRadioGroup);
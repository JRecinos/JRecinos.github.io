import { css, html, BaseLit } from '../base-element';
import { SharedStyles } from '../style-helpers/shared-styles';


class CustomProgressionBar extends BaseLit {
    
    static get styles(){
        return [
            SharedStyles,
            css`
                :host{
                    padding: 8px 0;
                    text-align:center;
                    height: fit-content;
                }

                div {
                    height: 14px;
                    display: inline-block;
                    width: 100px;
                    background: var(--app-disabled-color);
                    position: relative;
                    transition: background 1s ease-out;
                }

                div:first-of-type{ 
                    border-top-left-radius: 5px; 
                    border-bottom-left-radius: 5px;
                }
                div:last-of-type{ 
                    border-bottom-right-radius: 5px; 
                    border-top-right-radius: 5px;
                }

                div::after{
                    content: attr(status);
                    max-height: 150px;
                    min-width: 68px;
                    width: 68px;
                    padding: 8px 16px;
                    top: 19px;
                    color: white;
                    border-radius: 5px;
                    background: var(--dark-primary-color);
                }

                div::after, div::before{
                    position: absolute;
                    display:none;
                }

                div::before{
                    content: "";
                    width: 0;
                    height: 0;
                    top: 14px;
                    left: 45px;
                    border-style: solid;
                    border-width: 0 5px 5px 5px;
                    border-color: transparent transparent var(--dark-primary-color) transparent;
                }

                div:hover::after,div:hover::before{
                    display:block;
                }

                div.inuse{
                    background: var(--default-primary-color);
                }

                div.success{
                    background: var(--paper-green-a200);
                }

                div.error{
                    background: var(--error-color);
                }

                div:not(:first-of-type){
                    margin-left:5px;
                }

                span {
                    position: absolute;
                    display: none;
                }

                @media (max-width:540px){
                    :host { 
                        display:none;
                    }
                }

                p { font-size: 12px; color: var(--primary-text-color); }
            `,
        ];
    }

    static get properties(){
        return {
            states:     { type: Array  },
            status:     { type: Array  },
            selected:   { type: Number }
        }
    }

    render(){
        return html`
            <p> ${this.status.filter(item => item == 1).length} de ${ this.status.length} pasos completados ${this.status.filter(item => item == 2).length > 0? html`,${this.status.filter(item => item == 2)} invalidos`:""} </p>
            ${this.states.map((item,idx)=>html`<div status="${this.status[idx]==0?"Pendiente":this.status[idx]==3?"Llenando":this.status[idx]==1?"Válido":"Inválido"}" class="${this.status[idx]==0?"":this.status[idx]==3?"inuse":this.status[idx]==1?"success":"error"}"></div>`)}
        `;
    }

    constructor(){
        super();
        this.states = [];
    }

    changeStatus(idx,status){
        this.status[idx] = status;
    }

    attributeChangedCallback(name, oldval, newval){
        
        if(name === "selected" && newval){
            if(newval!=-1){
                this.status[newval] = 3;
                this.requestUpdate();
            }else if(newval == -1 && oldval){
                this.status[oldval] = (this.status[oldval] != 3 && this.status[oldval]) || 0;   
            }
        }

        super.attributeChangedCallback(name,oldval,newval);
    }
}

customElements.define("custom-progression-bar",CustomProgressionBar);
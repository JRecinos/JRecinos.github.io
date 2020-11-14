import {html, css } from '../base-element';
import { CollapsibleElement } from '../collapsible-element'
import { CollapsibleStyle } from '../style-helpers/shared-styles';
import { plusIcon, minusIcon } from '../style-helpers/my-icons';


/**
 * 
 */
class CustomAccordion extends CollapsibleElement {

    static get properties(){
        return {
            disabled : { type : Boolean }
        }
    }

    static get styles(){
        return [
            CollapsibleStyle,
            css`
                div:first-child {
                    width: 100%;
                    display: grid;
                    grid-template-columns: minmax(0,0.9fr) minmax(0,0.1fr);
                }

                div.panel{
                    background: var(--secondary-background-color);
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: center;
                    align-content: center;
                    justify-content: space-between;
                }

                button {
                    background: transparent;
                    border: none;
                    outline: none;
                    fill: var(--disabled-color);
                }

                .active span:first-child, span:nth-child(2){
                    display:none
                }

                .active span:nth-child(2), span:first-child{
                    display: block;
                }

                slot[name="title-box"]::slotted(label){ 
                    margin-left: 16px; 
                }

                @media (max-width:440px){
                    div:first-child {
                        grid-template-columns: minmax(0,0.75fr) minmax(0,0.25fr);
                    }
                }

                @media (max-width:840px){
                    div.panel {
                        flex-direction: column;
                        flex-wrap: initial;
                    }
                    
                    ::slotted(:last-child){
                        margin-bottom:12.5px;
                    }
                }

                :host([no-header]) div.panel{
                    border-radius: 5px;
                }
                
                :host([no-hover]) .accordion:hover, :host([no-hover]) .panel, :host([no-hover]) .accordion.active{
                    border-radius: 0;
                }
                
                :host([no-options]) .accordion{
                    display: none;
                }
                
                :host([no-shadow]) div.panel{
                    box-shadow: none;
                    background: transparent;
                    padding: 0;
                }`,
        ];
    }

    render(){
        return html`
            <div class="accordion">
                <slot name="title-box">
                </slot>
                <slot name="icons-box">
                    <button @click="${this._animation}">
                        <span>${plusIcon}</span>
                        <span>${minusIcon}</span>
                    </button>
                </slot>
            </div>
            <div class="panel chosen hide">
                <slot name="panel-box">
                <div style="text-align: center;">Nada que mostrar!</div>
                </slot>
            </div>
        `
    }

    constructor(){
        super();
        this.disabled = false;
    }
}

customElements.define('custom-accordion',CustomAccordion);
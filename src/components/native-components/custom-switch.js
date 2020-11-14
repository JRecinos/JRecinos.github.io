import { html, css, BaseLit } from '../base-element'

class CustomSwitch extends BaseLit{

    constructor(){
        super();
        this.on = 'true';
        this.off = 'false';
        this.checked = false;
    }

    static get styles(){
        return [
            css`
                :host{
                    display: inline-block;
                    width: 15%;
                    margin: 0 auto 0;
                }

                :host([checked]) .sl{
                    color: var(--default-primary-color);
                }

                .si {
                    display: none;
                }
                .sl {
                    position: relative;
                    display: block;
                    min-width: 112px;
                    cursor: pointer;
                    text-align: left;
                    margin: 0 16px;
                    padding: 8px 0 8px 0px;
                    font-size: 1.125em;
                    font-family: 'Josefin Sans', sans-serif;
                    color: var(--primary-text-color);
                }
                .sl:before, .sl:after {
                    content: "";
                    position: absolute;
                    margin: 0;
                    outline: 0;
                    top: 50%;
                    -ms-transform: translate(0, -50%);
                    -webkit-transform: translate(0, -50%);
                    transform: translate(0, -50%);
                    -webkit-transition: all 0.3s ease;
                    transition: all 0.3s ease;
                }
                .sl:before {
                    right: 8px;
                    width: 34px;
                    height: 14px;
                    background-color: #9E9E9E;
                    border-radius: 8px;
                }
                .sl:after {
                    right: 23px;
                    width: 20px;
                    height: 20px;
                    background-color: #FAFAFA;
                    border-radius: 50%;
                    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
                }
                .sl .ton {
                    display: none;
                }
                
                .sl .toff {
                    display: inline-block;
                }
                .si:checked + .sl:before {
                    background-color: var(--default-primary-color);
                }
                .si:checked + .sl:after {
                    background-color: var(--dark-primary-color);
                    -ms-transform: translate(80%, -50%);
                    -webkit-transform: translate(80%, -50%);
                    transform: translate(80%, -50%);
                }
                .si:checked + .sl .ton {
                    display: inline-block;
                }
                .si:checked + .sl .toff {
                    display: none;
                }
                
                @media (max-width:440px){
                    :host{
                        padding-left:0;
                    }
                }`,
        ];
    }


    render(){
        return html`
            ${this.message}
            <div>
                <input type="checkbox" id="cb" name="cb" class="si" ?checked=${this.checked}>
                <label for="cb" class="sl" @click="${(e)=>{ e.preventDefault(); this.checked=!this.checked; this.fire("value-changed",this.value); }}">
                    <span class="ton">${this.on}</span>
                    <span class="toff">${this.off}</span>
                </label>
            </div>`
    }

    static get properties(){
        return {
            on          : { type: String  },
            off         : { type: String  },
            error       : { type: String  },
            checked     : { type: Boolean, reflect: true  },
            message     : { type: String }
        }
    }

    value(){
        return this.checked;
    }
    
}

customElements.define('custom-switch',CustomSwitch);
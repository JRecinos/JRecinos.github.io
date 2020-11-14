import { css, html, BaseLit } from '../base-element'
import { BaseModal } from './modal-base'
import { SharedStyles } from '../style-helpers/shared-styles';
import { ButtonSharedStyles } from '../style-helpers/button-shared-styles';
import "@polymer/paper-button/paper-button";

export const CustomModal = class extends BaseModal{

constructor(){
    super();
    this.show = false;
}

static get styles(){
    return [ 
        SharedStyles,
        ButtonSharedStyles,
        css`
        h1{
            color:#FFF;
        }

        .md-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 50%;
            max-width: 600px;
            min-width: 400px;
            height: auto;
            z-index: 170;
            visibility: hidden;
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-transform: translateX(-50%) translateY(-50%);
            -moz-transform: translateX(-50%) translateY(-50%);
            -ms-transform: translateX(-50%) translateY(-50%);
            transform: translateX(-50%) translateY(-50%);
        }

        .md-show {
            visibility: visible;
        }

        .md-overlay {
            position: fixed;
            width: 100vw;
            height: 100vh;
            visibility: hidden;
            top: 0;
            left: 0;
            z-index: 160;
            opacity: 0;
            background: rgba(0,0,0,0.8);
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            transition: all 0.3s;
        }

        .md-show ~ .md-overlay {
            opacity: 1;
            visibility: visible;
        }

        /* Content styles */
        .md-content {
            color: var(--dark-primary-color);
            background: white;
            position: relative;
            margin: 0 auto;
            border-radius: 5px;
            background: transparent;
        }

        .md-content h3 {
            margin: 0;
            color: var(--text-primary-color);
        }

        .md-content > div {
            padding: 30px;
            margin: 0;
            font-weight: 300;
            font-size: 1.15em;
            background: #fff;
        }

        .md-content > div p {
            margin: 0;
            padding: 10px 0;
            color: var(--primary-text-color);
        }

        .md-content > div ul {
            margin: 0;
            padding: 0 0 30px 20px;
        }

        .md-content > div ul li {
            padding: 5px 0;
        }

        .md-content button {
            display: block;
            margin: 0 auto;
            font-size: 1em;
        }

        .md-effect-1 .md-content {
            -webkit-transform: scale(0.7);
            -moz-transform: scale(0.7);
            -ms-transform: scale(0.7);
            transform: scale(0.7);
            opacity: 0;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            transition: all 0.3s;
        }

        .md-show.md-effect-1 .md-content {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
            opacity: 1;
        }

        .body {
            border-bottom: 2px solid var(--divider-color);
            border-top: 2px solid var(--divider-color);
        }

        .md-content > div.title {
            padding: 16px;
            background: var(--app-primary-color);
            border-radius: 5px 5px 0 0;
        }

        .md-content > div.footer{
            text-align: right;
            padding: 8px 16px;
            border-radius: 0 0 5px 5px;
        }
    `,
    css`
    paper-button {
        /*background-color: var(--dark-primary-color);
        color: white;*/
        color: var(--app-primary-color);
        font-size: 1em;
        font-weight: 500;
        transition: 0.250s;
        width: auto;
        --paper-button-ink-color: var(--paper-indigo-100);
    }

    paper-button:hover{
        background: var(--app-primary-color);
        color: var(--text-primary-color);
    }

    paper-button.secondary {
        background-color: var(--text-primary-color);
        color: var(--dark-primary-color);
        border: 1px solid var(--dark-primary-color);
    }
    
    @media (max-width: 440px){
        .md-content{
            max-width: 350px;
        }
    }`];
}

render(){
    return html`
    <div class="md-modal md-effect-1" id="modal">
        <div class="md-content" >
            <div class="title">
                <h3>${this.title}</h3>
            </div>
            <div class="body">
                <slot name="body">
                    <p>${this.body}</p>
                </slot>
            </div>
            <div class="footer">
                ${(this._confirmDialog)?html`
                <paper-button class="secondary" @click="${this._reject}">
                    ${this.rejectMsn}
                </paper-button>`:""}
                <paper-button @click="${this._accept}">
                    ${this.acceptMsn}
                </paper-button>
            </div>
        </div>
    </div>
    <div class="md-overlay"></div>`;
    }

    static get properties(){
        return {
            acceptMsn : { type : String },
            rejectMsn : { type : String },
            body : { type: String },
            title : { type: String },
            show : { type: Boolean, reflect: true },
            _confirmDialog : { type: Boolean },
        }
    }
    
    showDialogFromWC( title, body, accept, reject = "", confirm = false){
        
        this.title = title;
        this.body = body;
        this._confirmDialog = confirm
        this.acceptMsn = accept;
        this.rejectMsn = reject;
        this.requestUpdate();
        this._openModal();        

        return new Promise((resolve,reject)=>{
            this.onResolve = resolve;
            this.onReject = reject;
        });
    }

}

customElements.define('custom-modal',CustomModal);


import { BaseLit,css,html } from '../base-element'

class CustomSpinner extends BaseLit{

    static get properties(){
        return {
            hidden : { type: Boolean  },
            square : { type: Boolean  }
        }
    }

    static get styles(){
        return [
            css`
            
            :host {
                text-align: center;
            }

            :host([hidden="true"]){
                display: none;
            }
            
            :host([hidden="false"]){
                display: block;
            }

            .spinner {
                margin: 100px auto;
                width: 50px;
                height: 40px;
                text-align: center;
                font-size: 10px;
            }

            .spinner > div {
                background-color: #333;
                height: 100%;
                width: 6px;
                display: inline-block;

                -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
                animation: sk-stretchdelay 1.2s infinite ease-in-out;
            }

            .spinner .rect2 {
                -webkit-animation-delay: -1.1s;
                animation-delay: -1.1s;
            }

            .spinner .rect3 {
                -webkit-animation-delay: -1.0s;
                animation-delay: -1.0s;
            }

            .spinner .rect4 {
                -webkit-animation-delay: -0.9s;
                animation-delay: -0.9s;
            }

            .spinner .rect5 {
                -webkit-animation-delay: -0.8s;
                animation-delay: -0.8s;
            }

            @-webkit-keyframes sk-stretchdelay {
                0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
                20% { -webkit-transform: scaleY(1.0) }
            }

            @keyframes sk-stretchdelay {
            0%, 40%, 100% { 
                transform: scaleY(0.4);
                -webkit-transform: scaleY(0.4);
                }  20% { 
                    transform: scaleY(1.0);
                    -webkit-transform: scaleY(1.0);
                }
            }
            `,
            css`
                .circle {
                    animation: rotator 1.4s linear infinite;
                }
                @keyframes rotator {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(270deg);
                    }
                }
                .path {
                    stroke-dasharray: 187;
                    stroke-dashoffset: 0;
                    transform-origin: center;
                    animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;
                }
                @keyframes colors {
                    0% {
                        stroke: #4285f4;
                    }
                    25% {
                        stroke: #de3e35;
                    }
                    50% {
                        stroke: #f7c223;
                    }
                    75% {
                        stroke: #1b9a59;
                    }
                    100% {
                        stroke: #4285f4;
                    }
                }
                @keyframes dash {
                    0% {
                        stroke-dashoffset: 187;
                    }
                    50% {
                        stroke-dashoffset: 46.75;
                        transform: rotate(135deg);
                    }
                    100% {
                        stroke-dashoffset: 187;
                        transform: rotate(450deg);
                    }
                }
            `];
    }

    render(){
        return html`
            ${(this.square)?html`
                <div class="spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>`:
                html`<svg class="circle" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                    </svg>`}`;
    }
}

customElements.define('custom-spinner',CustomSpinner);
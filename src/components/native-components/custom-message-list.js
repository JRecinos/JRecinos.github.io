import { html, css, BaseLit } from '../base-element';
import { MainSharedStyle } from '../style-helpers/shared-styles';

class CustomMessageList extends BaseLit{

    static get styles(){
        return [
            MainSharedStyle,
            css`
                .div{
                    position:relative;
                    height:500px;
                    width:500px;
                    margin:50px auto;
                    background: url('http://lorempixel.com/output/people-q-c-640-480-8.jpg');
                    background-size:cover;
                    -moz-box-shadow: inset 0px 850px 500px -500px #fff;
                    -webkit-box-shadow: inset 0px 850px 500px -500px #fff;
                    -o-box-shadow: inset 0px 850px 500px -500px #fff;
                    box-shadow: inset 0px 850px 500px -500px #fff;
                }
                .div:before,.div:after{
                    content:'';
                    position:absolute;
                    left:5%;
                    opacity:0.5;
                }
                .div:before{
                    top:0;
                    width:20%;
                    height:100%;
                    -moz-box-shadow: inset 0px 850px 500px -500px #000;
                    -webkit-box-shadow: inset 0px 850px 500px -500px #000;
                    -o-box-shadow: inset 0px 850px 500px -500px #000;
                    box-shadow: inset 0px 850px 500px -500px #000;
                }
                .div:after{
                    width:20%;
                    height:10%;
                    top:100%;
                    background:#000;
                }
            `,
        ];
    }

    render(){
        return html`
            <div id="main-content">

            </div>`;
    }

    static get properties(){
        return {
            _messages : { type: Array }
        };
    }
}

customElements.define("custom-message-list", CustomMessageList);
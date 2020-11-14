import { html, css, BaseLit } from '../base-element';
//import '@polymer/iron-flex-layout/iron-flex-layout.js';

class ImageContainer extends  BaseLit{

    static get styles(){
        return [
            css`:host {
                display: block;
                position: relative;
                overflow: hidden;
                background-size: cover;
                background-position: center;
            }
    
            img {
                position: var(--layout-fit_-_position);
                top: var(--layout-fit_-_top);
                bottom: var(--layout-fit_-_bottom);
                left: var(--layout-fit_-_left);
                right: var(--layout-fit_-_right);
                max-width: 100%;
                max-height: 100%;
                margin: 0 auto;
                opacity: 0;
                transition: 0.5s opacity;
                position: relative;
                height: 320px;
                overflow: hidden;
            }`
        ];
    }

    render(){
        return html`
        <img id="img" alt="${this.alt}" @load="${this._onImgLoad}" @error="${this._onImgError}">
    `;
    }

  static get is() { return 'shop-image'; }

  static get properties() { return {

    alt: String,

    src: {
      type: String,
    },

    placeholderImg: {
      type: String,
    }

  }}

  _srcChanged(src) {
    if(!src) return;
    this._('img').removeAttribute('src');
    this._('img').style.transition = '';
    this._('img').style.opacity = 0;
    this._('img').src = src;
  }

  attributeChangedCallback(name, oldval, newval) {
    
    if(name==="src")
        _srcChanged(newval);
    if(name==="placeholderImg")
        _placeholderImgChanged(newval);
        
  }

  _onImgLoad() {
    this._('img').style.transition = '0.5s opacity';
    this._('img').style.opacity = 1;
  }

  _onImgError() {
    if (!this.placeholderImg) {
      this._('img').src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#CCC" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>');
    }
  }

  _placeholderImgChanged(placeholder) {
    this.style.backgroundImage = 'url(\'' + placeholder + '\')';
  }
}

customElements.define('image-container', ImageContainer);
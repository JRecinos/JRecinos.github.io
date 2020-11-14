import { html, css, BaseLit } from '../base-element';

export class PageViewElement extends BaseLit {
  // Only render this page if it's actually visible.
  shouldUpdate() {
    return this.active;
  }
  
  static get styles(){
    return [
      css`
        :host {
          height: fit-content;
          display: block;
          padding: 25px;
          background: var(--light-secondary-color);
        }
      `
    ];
  }

  static get properties() {
    return {
      active: { type: Boolean }
    }
  }
}

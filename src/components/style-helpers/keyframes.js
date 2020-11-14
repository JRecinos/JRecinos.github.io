import { css } from '../base-element';

export const flipEffect = css`
  .spin {
    -webkit-animation-name: spinner;
    -webkit-animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-duration: 6s;

    animation-name: spinner;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-duration: 6s;

    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .spin:hover {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }`;

export const RippleEffect = css`
  @keyframes ripple {
    0% {
        box-shadow: 0px 0px 0px 1px rgba(1, 136, 209, 0);
    }
    50% {
        box-shadow: 0px 0px 2.5px 25px rgba(1, 136, 209, 0.20);
    }
    100% {
        box-shadow: 0px 0px 2.5px 50px rgba(1, 136, 209, 0.10);;
    }
  }`;


export const HostFadeEffects = css`

  @keyframes fade-in-opacity-transition {
    from { visibility: hidden; opacity: 0; }
    to { opacity: 1; visibility: visible; }
  }

  @keyframes fade-out-opacity-transition {
    from { opacity: 1; visibility: visible; }
    to { visibility: hidden; opacity: 0; }
  }

  :host(.fadein) {
    animation: fade-in-opacity-transition .5s 1 normal linear;
  }

  :host(.fadeout) {
    animation: fade-out-opacity-transition .5s 1 normal linear forwards;
  }

  :host(.hide){
    display: none;
  }
`;

export const ComponentsFadeEffect = css`

    @keyframes fade-opacity-forwards{
        from { opacity: 0; visibility: hidden; }
        to { opacity: 1; visibility: visible; }
    }
    
    @keyframes fade-opacity-reverse{
        from { opacity: 1; visibility: visible; }
        to { opacity: 0; visibility: hidden; }
    }

    .fadein {
        animation: fade-opacity-forwards ease-in-out 250ms forwards normal;
    }

    .fadeout {
        animation: fade-opacity-reverse ease-in-out 250ms forwards normal;
    }

    .fadeout-delay {
        animation: fade-opacity-reverse ease-in-out 250ms forwards normal;
        visibility: visible;
        opacity: 1;
        animation-delay: 250ms;
    }

    .fadein-delay {
        animation: fade-opacity-forwards ease-in-out 250ms forwards normal;
        visibility: hidden;
        opacity: 0;
        animation-delay: 250ms;
    }

    .iron-selected label.index::after{
        content: none;
    }
`
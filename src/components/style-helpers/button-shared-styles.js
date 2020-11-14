import { css } from "../base-element";

export const ButtonSharedStyles = css`
  a,button {
    font-size: inherit;
    vertical-align: middle;
    background: #fff;
    border: none;
    cursor: pointer;
    outline:none;
    box-shadow: var(--shadow-elevation-4dp_-_box-shadow);
    text-decoration: none;
  }

  button.rounded {
    border-radius:100%;
    width: 44px;
    height: 44px;
  }

  button:hover svg {
    fill: var(--accent-color);
  }

  .md{
    height: 50px;
    margin-top: 25px;
  }

  .primary {
    background-color:var(--dark-primary-color);
    color:white;    
    font-weight: 600;
  }

  .primary span svg{
    fill:white;
  }

  .text {
    border: 1px solid var(--dark-primary-color);
    color: var(--dark-primary-color);
  }

  .text span svg{
    fill: var(--dark-primary-color);
  }

  .centered {
    transform: translateX(-50%);
    margin-left: 50%;
    margin-top: 25px;
  }
  
  @media (max-width: 840px){
    form .centered{
      transform: none;
      margin: auto;
    }

    form .centered.md {
      margin-top: 12.5px;
    }

  }`;

export const StyledButton = css`
    .styled-button {
        display: inline-block;
    }
    
    .styled-button {
        display: inline-block;
        box-sizing: border-box;
        border: 2px solid var(--dark-primary-color);
        background-color: #FFF;
        font-size: 14px;
        font-weight: 500;
        color: var(--dark-primary-color);
        margin: 0;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        border-radius: 0;
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
        padding: 0;
    }
    
    .styled-button > * {
        width:100%;
        display:inline-block;
        cursor:pointer;
        font-weight:bolder;
    }
    
    .styled-button:focus, .styled-button > *:focus {
        background-color: #c5cad3;
    }
    
    .styled-button:hover, .styled-button:active, .styled-button  > *:active {
        background-color: var(--dark-primary-color);
        color: #FFF;
    }
    
    @media (max-width: 767px) {
        .styled-button [responsive] {
        position: var(--layout-fixed-bottom_-_position); 
        right: var(--layout-fixed-bottom_-_right); 
        bottom: var(--layout-fixed-bottom_-_bottom); 
        left: var(--layout-fixed-bottom_-_left);
        height: 64px;
        z-index: 1;
    }
    
    .styled-button [responsive] > * {
        background-color: var(--dark-primary-color);
        border: none;
        color: white;
        padding: 20px;
        width: 100%;
        height: 100%;
        font-size: 15px;
    }
    
    .styled-button [responsive] > *:focus {
        background-color: var(--dark-primary-color);
    }
}`;
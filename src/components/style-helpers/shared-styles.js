import { css } from '../base-element'

export const FormSharedStyle = css`

  * {
    box-sizing: border-box;
  }

  :host {
    display:block;
    width: 100%;
  }

  custom-accordion{
    width: 100%;
    background: var(--primary-background-color);
  }

  custom-accordion:not(:last-of-type){
    border-bottom: 1px solid var(--divider-color);
  }

  custom-accordion:first-of-type{
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  custom-accordion:last-of-type {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }



  custom-accordion.active, custom-accordion:hover {
    border-bottom: none;
  }


  /*paper-input,paper-dropdown-menu, paper-textarea{
    --paper-input-container-focus-color: var( --app-primary-color);
  }*/

  paper-input, paper-dropdown-menu {
    width: 45%;
  }

  form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    padding: 0 25px 12.5px;
    height: 100%;
    width: auto;
    -webkit-overflow-scrolling: touch;
  }

  paper-textarea{
    width: auto;
    flex-grow: 1;
    max-width: 100%;
    width: 90%;
  }

  custom-radio-group{
    width: 100%;
  }

  .h-hack{
    flex: 0 1 25%;
    min-width: 0;
  }


  .h-layout {
    flex: 0 1 45%;
    min-width: 0;
    background: blue;
  }

  /*
  paper-input:nth-child(n+1), paper-dropdown-menu:nth-child(n+1) {
    margin-left:4.5%;
  }*/

  .controls {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 25px;
  }

  .controls button{
    width:25%;
    margin:auto;
    padding-top:1.5em;
    border-radius: 8px;
  }

  span {
    width: 24px;
    height: 24px;
  }

  .contactos{
    width: 75%;
    margin: 10px auto;
    box-shadow: var(--shadow-elevation-4dp_-_box-shadow);
    min-height: 0;
    border-radius: 5px;
  }

  .contactos div{
    height: 40px;
    background: var(--secondary-background-color);
  }

  .contactos div:first-of-type{
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .contactos div:last-of-type{
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .contactos div:not(:last-of-type){
    border-bottom: 1px solid var(--divider-color);
  }

  .contactos div:hover{
    box-shadow: var(--shadow-elevation-4dp_-_box-shadow);
    background-color:white;
  }

  .contactos div button{
    box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
    font-size: 0.8em;
    border-radius: 15px;
    height: 20px;
    width: 20px;
  }

  label {
    padding: 8px;
    line-height: 1.74;
    display: inline-block;
    width: auto;
  }

  button {
    float: right;
    margin: 10px;
    box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
  }

  button:hover{
    color: var(--primary-text-color);
  }

  .primary {
    background-color:var(--dark-primary-color);
    color:white;
    font-weight: 600;
  }

  .primary span svg{
    fill:white;
  }

  .hidden{
    display: none;
  }

  @media (max-width:840px){
    form {
      flex-direction: column;
    }

    paper-input, paper-dropdown-menu, custom-radio-group {
      flex: 1;
      width: 90%;
      max-width: 90%;
    }

    .contactos{
      width: 100%;
    }
  }
  `;

export const SharedStyles = css`
  h1,h2,h3,h4,h5,h6 {
    font-family: 'Josefin Slab', serif;
    width: 100%;
    text-align: center;
    margin: 0 auto 10px auto;
    padding: 0;
    font-weight: 100;
    color: var(--dark-primary-color);
    padding: 8px;
  }

  h1 { font-size: 6em; }
  h2 { font-size: 3.75em; }
  h3 { font-size: 3em; }
  h4 { font-size: 2.125em; }
  h5 { font-size: 1.5em; }
  h6 { font-size: 1.25em; }
  .subtitle-1 { font-size: 1em; }
  .subtitle-2 { font-size: 0.875em; }

  :host {
    display: block;
    box-sizing: border-box;
  }

  * {
      box-sizing: border-box;
  }

  section {
    padding: 24px;
    background: content-box;
    text-align: justify;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: auto;
   }

  section > * {
    margin-right: auto;
    margin-left: auto;
  }

  @media (max-width: 840px) {

    h1 {
      font-size: 5.625em;
    }

    h2 {
      font-size: 3.750em;
    }

    section {
      max-width: 100vw;
    }

    section > * {
      width: 80%;
      margin:auto;
    }
  }

  @media (max-width: 460px){

    section {
      max-width: 95vw;
      margin: auto;
      padding: 0;
    }

  }

  @media screen and (max-width:460){

    section, section > * {
      max-width: 460px;
    }

  }

  .circle {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    text-align: center;
    border-radius: 50%;
    background: var(--secondary-background-color);
    color: var(--accent-color);
    font-size: 30px;
    line-height: 64px;
  }
  `;

export const PrintableOrderStyle = css`

  * { box-sizing: border-box; }

  :host{
    display: block;
    width: 95%;
    height: auto;
    margin: auto;
    margin-bottom: 12.5px;
  }

  main {
    background:white;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 10px;
    box-shadow: var(--shadow-elevation-4dp_-_box-shadow);
  }

  span {
    width: 150px;
    height: 100px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .codigo {
    position: absolute;
    top: 20px;
    right: 40px;
    color: red;
    font-size: 1.75em;
    font-weight: 900;
  }

  .information {
    width: 100%;
    display: flex;
    padding-top: 8px;
  }

  .information label{
    font-size: 14px;
    text-align: left !important;
    padding-top: 20px;
    display: block;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: bold;
  }

  .information paper-input, .information label{
    width: 30%;
    margin-left: auto;
    text-align:center;
  }

  .information paper-input:nth-child(n+2),.information label:nth-child(n+2){
    width: 30%;
  }

  div > p {
  margin: 0;
  padding: 0;
  font-size: 10px;
  text-align: center;
  }

  p > strong{
    padding: 0 6px 0 2px;
  }

  h4{
    position: absolute;
    top: 0;
    left: 25px;
    margin: 0;
    font-size: 16px;
    font-family:var(--app-font-family);
  }

  @media print{
    main { box-shadow: 0 0 0 0 transparent; }
  }`;

export const OptionStyle = css`
  :host {
    display:block;
    position:relative;
    width: 75%;
    border-radius: 5px;
    background: var(--light-secondary-color);
    /*background: var(--secondary-background-color); #005662
    background: var(--secondary-background-color);*/
    margin: 25px auto 12.5px auto;
    padding: 12.5px 0;
    box-shadow: var(--shadow-box-4dp-custom);
    transition: transform 250ms, box-shadow 500ms;
  }

  :host(:hover){
    box-shadow: var(--shadow-box-8dp-custom);
    transform: translateY(-5px);
  }

  :host(:hover[selected="true"]) {
    transform: none;
  }

  @media (max-width:840px){

    :host {
      margin: 12.5px auto;
      width: 97.5%;
    }
  }

  button {
    background-color: #029192;
    border-radius: 50px;
  }

  .submit-btn, .cancel-btn{
    background-color: var(--dark-primary-color);
    border: 1px solid var(--dark-primary-color);
    color: white;
    display: none;
    width: 180px;
    margin: auto;
    font-size: 1.5em;
    font-weight: bold;
    line-height: 1.25;
    vertical-align: top;
  }

  .cancel-btn {
    background: white;
    display: inline-block;
    color: var(--dark-primary-color);
    width:auto;
  }

  .cancel-btn span, .submit-btn span{
    fill: var(--dark-primary-color);
    padding: 0 4px;
    vertical-align: text-bottom;
    display: inline-block;
  }

  .submit-btn span { fill: var(--text-primary-color); }

  section {
    position: relative;
    z-index: 10;
    padding: 12.5px;
    margin-left: 25%;
    width: 60%;
  }

  section > * {
    width: 100%;
    text-align:left;
  }

  section > *:not(div){
    display:none;
  }

  section.active label{
    display:none;
  }

  section.active custom-accordion label{
    display:block;
  }

  section.active *:not(label){
    display: block;
  }

  section.active {
    border-top: 2.5px solid var(--dark-primary-color);
    height: auto;
    width: 75%;
    margin-left: 50%;
    margin-top: 25px;
    margin-bottom: 25px;
    transform: translateX(-50%);
    box-shadow: var(--shadow-elevation-3dp_-_box-shadow);
    background: var(--primary-background-color);
    border-radius: 5px;
    transition-property: transform, background;
    transition: all linear 250ms;
  }

  /*
  label.index:hover{
    transform: rotate3d(1,0,0,60deg);
  }*/

  section > div *, section > div {
    cursor: pointer;
    color: var(--secondary-text-color);
  }

  section > div.active {
    color: var(--accent-color);
  }

  label.index,.close{
    background: var(--secondary-text-color);
    color: white;
    border-radius: 50px;
    width: 40px;
    height: 40px;
    font-size: 1.5em;
    vertical-align: top;
    outline: none;
    border: none;
    display: inline-block;
    text-align: center;
    box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
    line-height: 2;
    position: relative;
    z-index: 10;
  }

  label.index:after{
    content : "";
    display: block;
    position: absolute;
    left: 19px;
    height: 48px;
    width: 2px;
    border-radius: 5px;
    background: inherit;
    z-index: 5;
  }

  .visited > label.index, .visited button.close {
    background: var(--accent-color);
  }

  .visited{
    color: var(--accent-color);
  }

  label.index.last:after{
    content: none;
  }

  label {
    display: inline-block;
  }

  label.index + label {
    font-size: 2.125em;
    font-family: 'Josefin Sans', sans-serif;
    padding: 0 16px;
    color: inherit;
    font-weight: 200;
  }


  button.close {
    margin-left:90%;
    fill: white;
    padding: 2px 8px;
    display:none;
  }

  span { width: 24px; height: 24px; }

  @media (max-width:840px){

    section.active{
      width: 90%;
    }

    section {
      padding: 5px;
      position: relative;
      z-index: 10;
      width: 92.5%;
      text-align:center;
      margin: 12.5px auto;
    }

    section > * {
      text-align:left;
      margin: auto;
    }

    button.close {
      margin-left: 87.5%;
    }

    label.index,.close{
      width: 45px;
      height: 45px;
      line-height: 2;
    }
  }`;

export const HostEditStyle = css`
  :host([edit-form]){
    width: 85vw;
  }
  :host([edit-form]) paper-button{
    display:none;
  }

  :host([edit-form]) paper-input, :host([edit-form]) .contactos{
    width: 45%;
    display: inline-block;
  }

  :host([edit-form]) form, :host([edit-form]) h1 {
    padding: 0;
    margin: 0;
  }
`

export const CustomCheckboxStyle = css`
  *{ box-sizing: border-box; }

  .cbox-container {
    display: inline-block;
    position: relative;
    padding: 2.5px 0 0 35px;
    margin: 10px;
    margin-top: 0;
    cursor: pointer;
    font-size: 1.143em;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: var(--secondary-text-color);
  }

  .cbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    border-radius: 2.5px;
    border: 2px solid var(--dark-primary-color);
    background-color: var(--light-secondary-color);
    transition: background 0.25s linear, border 0.25 linear;
  }

  .cbox-container:hover input ~ .checkmark {
    background-color: var(--light-secondary-color);
  }


  .cbox-container input:checked ~ .checkmark {
    background-color: var( --dark-primary-color);
    animation: ripple 0.3s linear normal;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .cbox-container input:checked ~ .checkmark:after {
    display: block;
  }

  .cbox-container .checkmark:after {
    left: 6.5px;
    top: 2.5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    transition: all 250ms ease;
  }`;

export const paperDarkTheme = css`
  .dark-theme paper-input, .dark-theme paper-dropdown-menu {
    margin-bottom: 14px;
    --primary-text-color: #f6f6f6;
    --paper-input-container-color: #fff;
    --paper-input-container-focus-color: #fff;
    --paper-input-container-invalid-color: red;
    --paper-input-container-label-floating: #f6f6f6;
    --paper-input-container-label-focus: #fff;
    --paper-input-container-label-floating : #fff;
    --paper-input-container-underline-focus: #fff;
    --paper-font-caption_-_font-family : var(--app-font-family);
    --primary-background-color: var(--app-secondary-color, black);
    --primary-text-color: #fff;
  }

  paper-button span svg {
    fill: white;
  }`;

export const CollapsibleStyle = css`

:host{
  --accordion-background-color: var(--dark-primary-color);
  display: block;
}

* { box-sizing: border-box; }

.accordion {
  background-color: transparent;
  color: var(--disabled-color);
  /*padding: 18px 0;*/
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 1.25em;
  transition: 0.5s;
  padding: 8px 0;
  display: block;
  border-radius: 5px 5px 0 0;
}

.active, .accordion:hover {
  background-color: var(--accordion-background-color);
  color: white;
  box-shadow: var(--shadow-elevation-6dp_-_box-shadow);
  position: relative;
  z-index: 100;
}

.active.accordion:hover {
  border-radius: 5px 5px 0 0;
}

.accordion:hover {
  border-radius: 5px;
}

.panel.chosen{
  transform: scaleY(0);
  margin: 0;
}

.panel.hide {
  max-height: 0;
}

.accordion:hover button, .active button{
  fill: #fff;
}

.accordion > * {
  margin-left: 5%;
}

:host([class="full active"]) .panel {
  padding: 8px;
  flex-direction: column;
  box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
}

.panel {
  padding: 0 50px;
  margin: 5px auto;
  background-color: white;
  max-height: max-content;
  transform: scaleY(1);
  transition: transform 500ms ease;
  box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
  background: var(--secondary-background-color);
  border-radius: 0 0 5px 5px;
}

.accordion{
  cursor: pointer;
}

.accordion:hover span,.active span {
  fill: white;
}

.panel > * {
  margin: auto;
}

.hidden{
  display: none;
}`;

export const chartStyles = css`

* { box-sizing: border-box; }

:host{
  width: 95%;
  height: auto;
  padding: 2.5px;
  color:black;
}

:host(.graph-only) .container{
  height: auto;
  padding: 0;
  margin: 0;
  box-shadow: none;
}

:host(.graph-only) .container > div {
  background: transparent;
  box-shadow: none;
}

:host(.graph-only) h1 { display: none; }

:host(.graph-only:hover) .container{
  box-shadow: none;
}

:host(:hover) .container{
  box-shadow: var(--shadow-elevation-4dp_-_box-shadow);
}

.container {
  margin: auto;
  box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
  width: 100%;
  height: 450px;
  padding: 0 25px;
  border-radius: 5px;
  display: none;
  /*background-color: var(--dark-primary-color);*/
}

h1 {
  text-align: center;
  margin-top: 0;
  font-weight: 400;
  color: var(--dark-primary-color);
  font-family: var(--app-font-family);
  margin: 0;
  padding: 8px;
  font-size: 2em;
}

.container > div {
  left: calc(50% + -300px);
  box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
  background: #021B2B;
}

@media (max-width:840px){

  .container > div {
    left: calc(50% + -175px);
  }

  .container{
    height: auto;
  }
}

@media (max-width:440px){

.container > div {
  left: calc(50% + -162.5px);
}

}`;

export const MainSharedStyle = css`

  #main-content::-webkit-scrollbar, .overflowable::-webkit-scrollbar {
    height: 6px;
    width: 6px;
    background-color: #fff;
  }

  #main-content::-webkit-scrollbar-thumb, .overflowable::-webkit-scrollbar-thumb {
    background-color: #0097A7;
  }

  #main-content::-webkit-scrollbar-track, .overflowable::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #fff;
  }`

export const OrderStyle = css`

  order-base-print {
    border-top: 2px solid var(--divider-color);
    margin-top: 50px;
    margin-bottom: 25px;
  }


  @media print{

    *:not(order-print-full, order-print-glasses){
      display: none;
    }

    :host{
      box-shadow: none !important;
      background: white;
    }
  }

  @media (max-width:840px){
    :host{
        max-width: 99vw;
    }
  }

  @media (max-width:440px){
    custom-progression-bar + .underline {
        display:none;
    }
  }

  .submit-container{
    text-align:center;
    margin-top: 12.5px;
  }`;

export const DividerStyle = css`
    .underline{
        --divider-color : var(--dark-theme-secondary-color, #c6c6c6);
        margin: 12.5px auto;
        height: 1px;
        width: 90%;
        background-color: var(--divider-color);
    }

    .underline-dark{
        margin: auto;
        height: 1px;
        width: 90%;
        background-color: var(--secondary-text-color);
    }

    @media (max-width: 540px){
      .underline.hide{
        display:none;
      }
    }
`;

export const HomeViewStyle = css`
    h2 { color: var(--default-primary-color); font-weight:200; }
    h1,h2 { padding: 0;margin: 0;}

    card-element {
        margin: 25px 10px 25px 10px;
        width: 310px;
        display: inline-block;
    }

    span {
        width: 130px;
        height: 130px;
        border-radius:100%;
        display: inline-block;
        background: #99dcffcf;
        padding: 1px;
    }

    span svg {
        width: 125px;
        height: 125px;
        fill: var(--dark-primary-color);
    }

    p {
        text-align:center;
        height: 50px;
        padding: 8px;
        font-size: 1.143em;
        color: var(--default-primary-color);
    }

    a.styled-button {
        width: 150px;
        border-radius: 7.5px;
        padding: 10px;
        margin: 0 0 10px 50px;
        transition: color 250ms;
    }
`;

export const FilterSharedStyles = css`
  :host{
    width: 100%;
    display: block;
  }

  .accordion{
    display: block;
    color: var(--dark-primary-color);
  }

  paper-dropdown-menu, paper-input{
    width: auto;
    vertical-align: middle;
  }

  form {
    box-shadow: var(--shadow-elevation-4dp_-_box-shadow);
    width: 100%;
    background: transparent;
    padding: 0;
    border-radius: 5px 5px 0 0;
  }

  iron-selector div {
    opacity: 0;
    visibility: hidden;
    max-height: 0;
    text-align:center;
  }

  .iron-selected {
    opacity: 1;
    visibility: visible;
    max-height: fit-content;
  }

  .full-grid {
    grid-column: 1 / 3;
  }

  .accordion:hover{
    background: white;
    color: var(--dark-primary-color);
    border-radius: 5px 5px 0 0;
  }

  .accordion:hover span{
    fill: var( --default-primary-color);
  }

  .panel {
    background: var(--secondary-background-color);
  }
`;

export const DatePickerStyle = css`

.date-range {
    display: none;
    position: absolute;
    width: 500px;
    height: 200px;
    background: white;
    padding: 25px;
    z-index: 150;
    left: 48px;
    top: 40px;
    box-shadow: var(--shadow-elevation-16dp_-_box-shadow);

    @media (max-width:840px){
        width: 400px;
    }
  }

  @media (max-width:840px){

    .date-range{
      width: 300px;
    }

    paper-dropdown-menu{
        width: 90%;
    }
  }

  button {
    position: absolute;
    top: -22px;
    left:-22px;
  }

  .range {
    position: relative;
  }

  .range{
    margin-left: 0;
    background: var(--dark-primary-color);
    color: white;
    min-width: 60px;
  }

  .rounded {
    background:white;
    fill: var(--dark-primary-color);
    padding: 0 10px 0 0;
  }

  .rounded span {
    padding-left: 9px;
    display: block;
  }

  .dr-container{
    position: relative;
    display: inline-block;
    padding: 0 16px;
  }


  .dr-container > paper-button span{
    fill: var(--text-primary-color);
  }
`
export const RepairGlassesStyle = css`
.aro-info {
  border: 2px solid #012257;
  border-radius: 5px;
  margin: 12.5px;
  padding: 8px 16px;
  max-height: 90%;
  height: 90%;
  display: grid;
  grid-template-rows: repeat(3,1fr);
}

.aro-info > div {
  padding: 8px 0;
}

.aro-info > div:not(.cbox-opt) {
  position: relative;
  font-size: 1.5em;
}

.aro-info > div:not(.cbox-opt).underline::after{
  content: "";
  position: absolute;
  left: 10%;
  bottom: 25%;
  width: 80%;
  height: 1px;
  background-color: #012257;
}`
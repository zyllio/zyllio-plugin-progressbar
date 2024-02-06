console.log('Plugin Progressbar started')

import { ProgressbarMetadata } from "./progressbar.metadata";

const CssContent = `
  :host {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 50px;
    padding: 10px 10px;
    box-sizing: border-box;
  }
  
  .content {
    height: 100%; 
    background-color: var(--theme-tertiary-color);
    border-radius: var(--border-radius);
  }

  .progress-bar {	
    height: 100%; 
    width: 100%; 
    background-color: var(--color2);     
    background-image: linear-gradient(
      45deg, var(--color1) 25%, 
      transparent 25%, transparent 50%, 
      var(--color1) 50%, var(--color1) 75%,
      transparent 75%, transparent);

    border-radius: var(--border-radius);
  }
`;

const HtmlContent = `
  <div class="progress-bar"></div>                       
`;

class ProgressBarComponent extends HTMLElement {

  shadow: ShadowRoot

  htmlElement: HTMLElement

  styleElement: HTMLElement

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' })

    this.htmlElement = document.createElement('div')
    this.htmlElement.className = 'content';
    this.styleElement = document.createElement('style')
  }

  connectedCallback() {

    this.shadow.appendChild(this.styleElement)
    this.shadow.appendChild(this.htmlElement)

    this.styleElement.innerHTML = CssContent
    this.htmlElement.innerHTML = HtmlContent

    this.refresh()
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback() {
    this.refresh()
  }

  async refresh() {

    const value = this.getAttribute('value')

    const element = this.shadow.querySelector('.progress-bar') as HTMLElement

    if (element && value) {
      element.style.width = value + '%'
    }
  }
}

zySdk.services.registry.registerComponent(ProgressbarMetadata, ProgressBarComponent)
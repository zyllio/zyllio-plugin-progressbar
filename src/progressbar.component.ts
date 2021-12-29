/// <reference types="@zyllio/zy-sdk" />

console.log('Plugin started')

import { ProgressbarMetadata } from "./progressbar.metadata";


const CssContent = `
  :host {
    overflow: hidden;
    background-color: #dedede;
    border-radius: var(--border-radius);
  }

  .content {
    height: 100%; 
  }

  :host-context(body[editor]) .content {
    pointer-events: none;
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

    this.shadow = this.attachShadow({ mode: 'open' });

    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'content';
    this.styleElement = document.createElement('style');
  }

  connectedCallback() {

    this.shadow.appendChild(this.styleElement);
    this.shadow.appendChild(this.htmlElement);

    this.styleElement.innerHTML = CssContent;
    this.htmlElement.innerHTML = HtmlContent;

    this.refresh();

    const propertyValue = zySdk.services.factory.getPropertyValue(this, 'value')

    zySdk.services.dictionary.onChange(propertyValue, () => {
      this.refresh()
    })
  }

  static get observedAttributes() {
    return ['data-value'];
  }

  attributeChangedCallback() {

    this.refresh()
  }

  refresh() {

    const propertyValue = zySdk.services.factory.getPropertyValue(this, 'value')

    const value = zySdk.services.dictionary.getValue(propertyValue)

    const element = this.shadow.querySelector('.progress-bar') as HTMLElement

    if (element && value) {
      element.style.width = value + '%'
    }
  }
}

zySdk.services.registry.registerComponent(ProgressbarMetadata, ProgressBarComponent)
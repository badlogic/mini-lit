import { Component, html, mount, signal } from "@mariozechner/mini-lit/dist/next/index.js";
import { LitElement, html as litHtml } from "lit";
import { customElement } from "lit/decorators.js";

class ReactiveAttributesTest extends Component {
   isDisabled = signal(false);
   isHidden = signal(false);
   dynamicClass = signal("text-blue-500");
   ariaLabel = signal("Initial label");
   dataValue = signal(42);
   customAttr = signal("test");

   render() {
      return html`
         <div class="space-y-4 p-8">
            <h2 class="text-xl font-bold">Reactive Attributes Test</h2>

            <div class="space-y-2">
               <button
                  disabled=${this.isDisabled}
                  @click=${() => console.log("Clicked!")}
                  class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Button (disabled: ${() => this.isDisabled.value})
               </button>

               <button
                  @click=${() => {
                     this.isDisabled.value = !this.isDisabled.value;
                  }}
                  class="ml-2 px-3 py-1 bg-gray-300 rounded"
               >
                  Toggle Disabled
               </button>
            </div>

            <div class="space-y-2">
               <div
                  hidden=${this.isHidden}
                  class="p-4 bg-yellow-100 border"
               >
                  This div can be hidden (hidden: ${() => this.isHidden.value})
               </div>

               <button
                  @click=${() => {
                     this.isHidden.value = !this.isHidden.value;
                  }}
                  class="px-3 py-1 bg-gray-300 rounded"
               >
                  Toggle Hidden
               </button>
            </div>

            <div class="space-y-2">
               <div class=${this.dynamicClass}>
                  Dynamic class: ${() => this.dynamicClass.value}
               </div>

               <button
                  @click=${() => {
                     this.dynamicClass.value =
                        this.dynamicClass.value === "text-blue-500" ? "text-red-500 font-bold" : "text-blue-500";
                  }}
                  class="px-3 py-1 bg-gray-300 rounded"
               >
                  Toggle Class
               </button>
            </div>

            <div class="space-y-2">
               <div
                  aria-label=${this.ariaLabel}
                  title=${this.ariaLabel}
                  class="p-4 border"
               >
                  ARIA label: ${() => this.ariaLabel.value}
               </div>

               <button
                  @click=${() => {
                     this.ariaLabel.value = "Updated label " + Date.now();
                  }}
                  class="px-3 py-1 bg-gray-300 rounded"
               >
                  Update ARIA Label
               </button>
            </div>

            <div class="space-y-2">
               <div
                  data-value=${this.dataValue}
                  data-custom=${this.customAttr}
                  class="p-4 border"
               >
                  data-value: ${() => this.dataValue.value}, data-custom: ${() => this.customAttr.value}
               </div>

               <button
                  @click=${() => {
                     this.dataValue.value++;
                     this.customAttr.value = "updated-" + this.dataValue.value;
                  }}
                  class="px-3 py-1 bg-gray-300 rounded"
               >
                  Update Data Attributes
               </button>
            </div>

            <div class="mt-4 p-4 bg-gray-100 text-sm">
               <strong>Open DevTools and inspect elements above.</strong><br/>
               Watch the attributes change in real-time when you click the buttons.
            </div>

            <div class="mt-8 p-4 border-4 border-red-500 bg-red-50">
               <h3 class="text-lg font-bold text-red-700 mb-4">🐛 Dynamic Content Order Bug</h3>

               <div class="space-y-4">
                  <div class="p-4 bg-white border">
                     <strong>Multiple dynamic text nodes:</strong>
                     <div class="mt-2">
                        <span class="text-gray-500">First: </span>
                        ${this.dataValue}
                        <span class="text-gray-500">, Second: </span>
                        ${this.customAttr}
                        <span class="text-gray-500">, Third: </span>
                        ${this.ariaLabel}
                     </div>
                  </div>

                  <div class="p-4 bg-white border">
                     <strong>Mixed static and dynamic elements:</strong>
                     <div class="mt-2 flex gap-2 items-center">
                        <span class="bg-blue-100 px-2">Static 1</span>
                        ${() => html`<span class="bg-green-100 px-2">Dynamic: ${this.dataValue.value}</span>`}
                        <span class="bg-blue-100 px-2">Static 2</span>
                        ${() => html`<span class="bg-yellow-100 px-2">Dynamic: ${this.customAttr.value}</span>`}
                        <span class="bg-blue-100 px-2">Static 3</span>
                     </div>
                  </div>

                  <div class="p-4 bg-white border">
                     <strong>Conditional rendering:</strong>
                     <div class="mt-2">
                        <span>Before: </span>
                        ${() => (this.isHidden.value ? html`<span class="text-red-500">HIDDEN</span>` : html`<span class="text-green-500">VISIBLE</span>`)}
                        <span>, After: </span>
                        ${() => (this.isDisabled.value ? html`<span class="text-gray-500">DISABLED</span>` : html`<span class="text-blue-500">ENABLED</span>`)}
                        <span> (End)</span>
                     </div>
                  </div>

                  <button
                     @click=${() => {
                        this.dataValue.value++;
                        this.customAttr.value = "updated-" + this.dataValue.value;
                        this.ariaLabel.value = "Label " + this.dataValue.value;
                        this.isHidden.value = !this.isHidden.value;
                        this.isDisabled.value = !this.isDisabled.value;
                     }}
                     class="px-4 py-2 bg-red-600 text-white rounded"
                  >
                     Update All Dynamic Content
                  </button>

                  <div class="text-sm text-red-700">
                     <strong>Expected behavior:</strong> Dynamic content should stay in its original position.<br/>
                     <strong>Actual behavior:</strong> When signals update, new content gets appended at the end!<br/>
                     <strong>Watch in DevTools:</strong> Elements jump to the end of their container when updated.
                  </div>
               </div>
            </div>
         </div>
      `;
   }
}

@customElement("page-reactive-attributes-test")
export class ReactiveAttributesTestPage extends LitElement {
   createRenderRoot() {
      return this;
   }

   firstUpdated() {
      const container = this.querySelector("#test-container");
      if (container) {
         mount(ReactiveAttributesTest, container as HTMLElement);
      }
   }

   render() {
      return litHtml`
         <div id="test-container"></div>
      `;
   }
}

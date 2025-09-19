import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Button } from "./Button.js";
import { Card, CardContent } from "./Card.js";

@customElement("preview-code")
export class PreviewCode extends LitElement {
   @property({ type: Object }) preview: TemplateResult | string = "";
   @property({ type: String }) code = "";
   @property({ type: String }) language = "typescript";
   @property({ type: String, attribute: "class-name" }) className = "";

   @state() private showCode = false;

   protected createRenderRoot() {
      return this; // Use light DOM for global styles
   }

   public toggleView = () => {
      this.showCode = !this.showCode;
   };

   render() {
      return html`
         <div class="${this.className}">
            <!-- Toggle buttons -->
            <div class="flex gap-2 mb-4">
               ${Button({
                  variant: this.showCode ? "ghost" : "default",
                  size: "sm",
                  onClick: () => {
                     this.showCode = false;
                  },
                  children: "Preview",
               })}
               ${Button({
                  variant: this.showCode ? "default" : "ghost",
                  size: "sm",
                  onClick: () => {
                     this.showCode = true;
                  },
                  children: "Code",
               })}
            </div>

            <!-- Content -->
            ${Card({
               children: CardContent({
                  children: this.showCode
                     ? html`<code-block language="${this.language}" code="${btoa(this.code)}"></code-block>`
                     : this.preview,
               }),
            })}
         </div>
      `;
   }
}

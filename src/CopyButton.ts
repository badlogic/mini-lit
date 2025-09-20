import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Check, Copy } from "lucide";
import { Button } from "./Button.js";
import { i18n } from "./i18n.js";
import { icon } from "./icons.js";

@customElement("copy-button")
export class CopyButton extends LitElement {
   @property() text = "";
   @property() override title = i18n("Copy");
   @property({ type: Boolean, attribute: "show-text" }) showText = false;

   @state() private copied = false;

   protected override createRenderRoot(): HTMLElement | DocumentFragment {
      return this; // light DOM
   }

   private async handleCopy() {
      try {
         await navigator.clipboard.writeText(this.text);
         this.copied = true;
         setTimeout(() => {
            this.copied = false;
         }, 2000);
      } catch (err) {
         console.error("Failed to copy:", err);
      }
   }

   override render() {
      return Button({
         variant: "ghost",
         size: "sm",
         onClick: () => this.handleCopy(),
         title: this.title,
         children: html`
            ${this.copied ? icon(Check, "sm") : icon(Copy, "sm")}
            ${this.copied && this.showText ? html`<span>${i18n("Copied!")}</span>` : ""}
         `,
      });
   }
}

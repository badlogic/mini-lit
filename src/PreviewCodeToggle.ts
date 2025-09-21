import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Code, Eye } from "lucide";
import { i18n } from "./i18n.js";
import { icon } from "./icons.js";

type Mode = "preview" | "code";

@customElement("preview-code-toggle")
export class PreviewCodeToggle extends LitElement {
   @property({ reflect: false }) mode: Mode = "preview";

   protected override createRenderRoot(): HTMLElement | DocumentFragment {
      return this; // light DOM for shared styles
   }

   private setMode(mode: Mode) {
      if (this.mode !== mode) {
         this.mode = mode;
         this.dispatchEvent(new CustomEvent<Mode>("mode-change", { detail: this.mode, bubbles: true }));
      }
   }

   override render(): TemplateResult {
      const isPreview = this.mode === "preview";
      return html`
         <div class="inline-flex items-center h-7 rounded-md overflow-hidden border border-border bg-muted/60">
            <button
               class="px-2 h-full flex items-center ${
                  isPreview ? "bg-card text-foreground" : "text-muted-foreground hover:text-accent-foreground"
               }"
               @click=${() => this.setMode("preview")}
               title="${i18n("Preview")}"
            >
               ${icon(Eye, "sm")}
            </button>
            <button
               class="px-2 h-full flex items-center ${
                  !isPreview ? "bg-card text-foreground" : "text-muted-foreground hover:text-accent-foreground"
               }"
               @click=${() => this.setMode("code")}
               title="${i18n("Code")}"
            >
               ${icon(Code, "sm")}
            </button>
         </div>
      `;
   }
}

declare global {
   interface HTMLElementTagNameMap {
      "preview-code-toggle": PreviewCodeToggle;
   }
}

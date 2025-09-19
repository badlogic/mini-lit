import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { i18n } from "./i18n.js";

@customElement("mode-toggle")
export class ModeToggle extends LitElement {
   @property({ type: Array }) modes: string[] = [i18n("Mode 1"), i18n("Mode 2")];
   @property({ type: Number }) selectedIndex = 0;

   protected override createRenderRoot(): HTMLElement | DocumentFragment {
      return this; // light DOM for shared styles
   }

   private setMode(index: number) {
      if (this.selectedIndex !== index && index >= 0 && index < this.modes.length) {
         this.selectedIndex = index;
         this.dispatchEvent(
            new CustomEvent<{ index: number; mode: string }>("mode-change", {
               detail: { index, mode: this.modes[index] },
               bubbles: true,
            }),
         );
      }
   }

   override render(): TemplateResult {
      if (this.modes.length < 2) return html``;

      return html`
         <div class="inline-flex items-center h-7 rounded-md overflow-hidden border border-border bg-muted/60">
            ${this.modes.map(
               (mode, index) => html`
                  <button
                     class="px-3 h-full flex items-center text-sm font-medium transition-colors
								${index === this.selectedIndex
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-accent-foreground"}"
                     @click=${() => this.setMode(index)}
                     title="${mode}"
                  >
                     ${mode}
                  </button>
               `,
            )}
         </div>
      `;
   }
}

declare global {
   interface HTMLElementTagNameMap {
      "mode-toggle": ModeToggle;
   }
}

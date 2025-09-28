import { icon } from "@mariozechner/mini-lit";
import { Button, buttonDefaultStyle, buttonDefinition } from "@mariozechner/mini-lit/dist/Button.cva.js";
import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import "@mariozechner/mini-lit/dist/Button.cva.js"; // Registers mini-button
import { Delete, Download, Rocket, Settings, ThumbsUp } from "lucide";
import { createComponentExamples, renderExample } from "../example-utils.js";
import { ComponentPage } from "./component-page.js";

@customElement("page-button-cva")
export class ButtonCvaPage extends ComponentPage<typeof buttonDefinition> {
   definition = buttonDefinition;
   componentTag = "mini-button";
   componentName = "Button (CVA)";

   getStyles() {
      return buttonDefaultStyle;
   }

   getVariantProps() {
      return {
         variant: {
            base: {
               size: "default" as const,
            },
            options: {
               default: { children: "Default" },
               destructive: { children: "Destructive" },
               outline: { children: "Outline" },
               secondary: { children: "Secondary" },
               ghost: { children: "Ghost" },
               link: { children: "Link" },
            },
         },
         size: {
            base: {
               variant: "default" as const,
            },
            options: {
               default: { children: "Default" },
               sm: { children: "Small" },
               lg: { children: "Large" },
               icon: { variant: "secondary" as const, children: icon(ThumbsUp, "sm") },
            },
         },
      };
   }

   renderCustomUsage(): TemplateResult {
      return html`
         <div class="grid gap-6 md:grid-cols-2">
            ${until(
               createComponentExamples(
                  // Functional example
                  () => html`
                  <div class="flex gap-2">
                     ${Button({
                        variant: "default",
                        children: "Functional Example",
                        onClick: () => alert("Functional button clicked!"),
                     })}
                     ${Button({
                        variant: "outline",
                        size: "sm",
                        children: "Small Outline",
                     })}
                  </div>
               `,
                  // Web component example
                  () => html`
                  <div class="flex gap-2">
                     <mini-button
                        variant="default"
                        @click=${() => alert("Web component clicked!")}
                     >
                        Web Component Example
                     </mini-button>
                     <mini-button variant="outline" size="sm">
                        Small Outline
                     </mini-button>
                  </div>
               `,
                  // Functional imports
                  `import { Button } from "@mariozechner/mini-lit";`,
                  // Web component imports
                  `import "@mariozechner/mini-lit/dist/Button.cva.js";`,
               ),
               html`<div>Loading...</div>`,
            )}

            ${until(
               renderExample(
                  "Icons, States & Mixed Usage",
                  () => html`
                     <div class="space-y-4">
                        <div>
                           <h4 class="text-sm font-medium text-muted-foreground mb-2">With Icons</h4>
                           <div class="flex gap-2">
                              ${Button({
                                 variant: "default",
                                 className: "gap-2",
                                 children: html`${icon(Rocket, "sm")} Launch`,
                              })}
                              <mini-button variant="destructive" class="gap-2">
                                 Delete ${icon(Delete, "sm")}
                              </mini-button>
                              ${Button({
                                 variant: "ghost",
                                 size: "icon",
                                 children: icon(Settings, "sm"),
                              })}
                              <mini-button variant="secondary" size="icon">
                                 ${icon(ThumbsUp, "sm")}
                              </mini-button>
                           </div>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium text-muted-foreground mb-2">States</h4>
                           <div class="flex gap-2">
                              ${Button({ disabled: true, children: "Disabled" })}
                              <mini-button loading>Loading</mini-button>
                              ${Button({
                                 variant: "outline",
                                 disabled: true,
                                 className: "gap-2",
                                 children: html`${icon(Download, "sm")} Disabled`,
                              })}
                              <mini-button variant="destructive" loading class="gap-2">
                                 ${icon(Delete, "sm")} Processing
                              </mini-button>
                           </div>
                           <p class="text-xs text-muted-foreground mt-2">
                              Mix functional and web components freely. Loading state auto-disables.
                           </p>
                        </div>
                     </div>
                  `,
                  `import { Button, icon } from "@mariozechner/mini-lit/dist/Button.cva.js";
import "@mariozechner/mini-lit/dist/Button.cva.js"; // Registers <mini-button>
import { Rocket, Delete, Download, Settings, ThumbsUp } from "lucide";`,
               ),
               html`<div>Loading...</div>`,
            )}
         </div>
      `;
   }
}

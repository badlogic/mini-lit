import { Checkbox, checkboxDefaultStyle, checkboxDefinition } from "@mariozechner/mini-lit/dist/Checkbox.cva.js";
import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import "@mariozechner/mini-lit/dist/Checkbox.cva.js"; // Registers mini-checkbox
import { createComponentExamples, renderExample } from "../example-utils.js";
import { ComponentPage } from "./component-page.js";

@customElement("page-checkbox-cva")
export class CheckboxCvaPage extends ComponentPage<typeof checkboxDefinition> {
   definition = checkboxDefinition;
   componentTag = "mini-checkbox";
   componentName = "Checkbox (CVA + Slots)";

   getStyles() {
      return checkboxDefaultStyle;
   }

   getVariantProps() {
      return {
         size: {
            base: {
               variant: "default" as const,
               label: "Check me",
               checked: true,
            },
            options: {
               sm: {},
               md: {},
               lg: {},
            },
         },
         variant: {
            base: {
               size: "md" as const,
               label: "Option",
               checked: true,
            },
            options: {
               default: {},
               primary: {},
               destructive: {},
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
                  <div class="space-y-3">
                     ${Checkbox({
                        variant: "default",
                        size: "md",
                        label: "Accept terms",
                        onChange: (checked) => console.log("Functional:", checked),
                     })}
                     ${Checkbox({
                        variant: "destructive",
                        size: "lg",
                        label: "Delete account",
                        checked: false,
                     })}
                  </div>
               `,
                  // Web component example
                  () => html`
                  <div class="space-y-3">
                     <mini-checkbox
                        variant="default"
                        size="md"
                        label="Accept terms"
                        @change=${(e: CustomEvent) => console.log("Web component:", e.detail)}
                     ></mini-checkbox>
                     <mini-checkbox
                        variant="destructive"
                        size="lg"
                        label="Delete account"
                     ></mini-checkbox>
                  </div>
               `,
                  // Functional imports
                  `import { Checkbox } from "@mariozechner/mini-lit";`,
                  // Web component imports
                  `import "@mariozechner/mini-lit/dist/Checkbox.cva.js";`,
               ),
               html`<div>Loading...</div>`,
            )}

            ${until(
               renderExample(
                  "Slot-based Customization",
                  () => html`
                     <div class="space-y-4">
                        <div>
                           <h4 class="text-sm font-medium text-muted-foreground mb-2">Customize Individual Elements</h4>
                           <div class="space-y-3">
                              ${Checkbox({
                                 label: "Custom container style",
                                 className: "p-4 bg-secondary rounded-lg",
                              })}
                              ${Checkbox({
                                 label: "Custom checkbox style",
                                 inputClassName: "rounded-full border-2 border-primary",
                              })}
                              ${Checkbox({
                                 label: "Custom label style",
                                 labelClassName: "text-primary font-bold italic",
                              })}
                              ${Checkbox({
                                 label: "All customized",
                                 variant: "destructive",
                                 size: "lg",
                                 className: "p-3 border-2 border-destructive rounded",
                                 inputClassName: "rounded-none",
                                 labelClassName: "text-destructive uppercase tracking-wide",
                              })}
                           </div>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium text-muted-foreground mb-2">Web Component Slot Classes</h4>
                           <div class="space-y-3">
                              <mini-checkbox
                                 label="Custom via attributes"
                                 class="p-4 bg-secondary rounded-lg"
                                 inputClassName="rounded-full border-2 border-primary"
                                 labelClassName="text-primary font-bold"
                              ></mini-checkbox>
                           </div>
                           <p class="text-xs text-muted-foreground mt-2">
                              The slots system allows styling any element within the component.
                           </p>
                        </div>
                     </div>
                  `,
                  `import { Checkbox } from "@mariozechner/mini-lit";
import "@mariozechner/mini-lit/dist/Checkbox.cva.js";

// Functional component with slot customization
Checkbox({
   label: "Custom styles",
   className: "p-4 bg-secondary",        // Container styles
   inputClassName: "rounded-full",       // Checkbox input styles
   labelClassName: "text-primary"        // Label text styles
});

// Web component with slot customization
<mini-checkbox
   label="Custom styles"
   class="p-4 bg-secondary"
   inputClassName="rounded-full"
   labelClassName="text-primary"
></mini-checkbox>`,
               ),
               html`<div>Loading...</div>`,
            )}

            ${until(
               renderExample(
                  "States & Forms",
                  () => html`
                     <div class="space-y-4">
                        <div>
                           <h4 class="text-sm font-medium text-muted-foreground mb-2">States</h4>
                           <div class="space-y-3">
                              ${Checkbox({ label: "Unchecked", checked: false })}
                              ${Checkbox({ label: "Checked", checked: true })}
                              ${Checkbox({ label: "Disabled", disabled: true })}
                              ${Checkbox({ label: "Disabled + Checked", disabled: true, checked: true })}
                           </div>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium text-muted-foreground mb-2">Form Integration</h4>
                           <form class="space-y-3">
                              ${Checkbox({
                                 name: "newsletter",
                                 value: "weekly",
                                 label: "Subscribe to newsletter",
                              })}
                              ${Checkbox({
                                 name: "terms",
                                 value: "accepted",
                                 label: "I agree to the terms",
                                 variant: "primary",
                              })}
                           </form>
                        </div>
                     </div>
                  `,
                  `// Form integration with name/value
Checkbox({
   name: "newsletter",
   value: "weekly",
   label: "Subscribe to newsletter"
});`,
               ),
               html`<div>Loading...</div>`,
            )}
         </div>
      `;
   }
}

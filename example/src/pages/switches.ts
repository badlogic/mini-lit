import { Card, CardContent, CardHeader, CardTitle } from "@mariozechner/mini-lit/dist/Card.js";
import { Label } from "@mariozechner/mini-lit/dist/Label.js";
import { Switch } from "@mariozechner/mini-lit/dist/Switch.js";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("page-switches")
export class SwitchesPage extends LitElement {
   @state() switchStates = {
      basic: false,
      withLabel: true,
      disabled: false,
      disabledOn: true,
   };

   createRenderRoot() {
      return this;
   }

   private handleSingleChange(field: string, checked: boolean) {
      this.switchStates = {
         ...this.switchStates,
         [field]: checked,
      };
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Switches</h1>
               <p class="text-muted-foreground">
                  Toggle controls for binary states with smooth animations and interactive feedback.
               </p>
            </div>

            <!-- Basic Switches -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Examples</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center justify-between">
                           <span class="text-sm">Basic switch</span>
                           ${Switch({
                              checked: this.switchStates.basic,
                              onChange: (checked) => this.handleSingleChange("basic", checked),
                           })}
                        </div>

                        <div class="flex items-center justify-between">
                           <span class="text-sm">Switch with label prop</span>
                           ${Switch({
                              checked: this.switchStates.withLabel,
                              label: "Toggle me",
                              onChange: (checked) => this.handleSingleChange("withLabel", checked),
                           })}
                        </div>

                        <div class="flex items-center justify-between">
                           <span class="text-sm">Disabled (off)</span>
                           ${Switch({
                              checked: this.switchStates.disabled,
                              disabled: true,
                              onChange: (checked) => this.handleSingleChange("disabled", checked),
                           })}
                        </div>

                        <div class="flex items-center justify-between">
                           <span class="text-sm">Disabled (on)</span>
                           ${Switch({
                              checked: this.switchStates.disabledOn,
                              disabled: true,
                              onChange: (checked) => this.handleSingleChange("disabledOn", checked),
                           })}
                        </div>
                     </div>
                  `}
                  .code=${`// Basic switch usage
${Switch({
   checked: false,
   onChange: (checked) => console.log(checked),
})}

// Switch with label
${Switch({
   checked: true,
   label: "Enable notifications",
   onChange: (checked) => console.log(checked),
})}

// Disabled switch
${Switch({
   checked: false,
   disabled: true,
   label: "Disabled option",
})}

// With custom layout
<div class="flex items-center justify-between">
  <span>Custom layout</span>
  \${Switch({
    checked: state.value,
    onChange: (checked) => setState(checked)
  })}
</div>`}
               ></preview-code>
            </section>

            <!-- With Labels -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">With External Labels</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center space-x-3">
                           ${Switch({
                              checked: this.switchStates.basic,
                              onChange: (checked) => this.handleSingleChange("basic", checked),
                              id: "external-label",
                           })}
                           ${Label({
                              htmlFor: "external-label",
                              children: "Use external label component",
                           })}
                        </div>

                        <div class="flex items-start space-x-3">
                           ${Switch({
                              checked: this.switchStates.withLabel,
                              onChange: (checked) => this.handleSingleChange("withLabel", checked),
                              id: "external-label-desc",
                           })}
                           <div>
                              ${Label({
                                 htmlFor: "external-label-desc",
                                 children: "Enable advanced features",
                              })}
                              <p class="text-xs text-muted-foreground mt-1">
                                 This will unlock additional functionality in your account
                              </p>
                           </div>
                        </div>
                     </div>
                  `}
                  .code=${`// Using with external Label component
<div class="flex items-center space-x-3">
  \${Switch({
    checked: state.enabled,
    onChange: (checked) => setState(checked),
    id: "feature-toggle"
  })}
  \${Label({
    htmlFor: "feature-toggle",
    children: "Enable feature"
  })}
</div>

// With description
<div class="flex items-start space-x-3">
  \${Switch({
    checked: state.enabled,
    onChange: handleChange,
    id: "feature-with-desc"
  })}
  <div>
    \${Label({
      htmlFor: "feature-with-desc",
      children: "Feature name"
    })}
    <p class="text-xs text-muted-foreground mt-1">
      Description text
    </p>
  </div>
</div>`}
               ></preview-code>
            </section>

            <!-- Usage Guide -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               ${Card({
                  children: html`
                     ${CardHeader({
                        children: CardTitle({ children: "Component Properties" }),
                     })}
                     ${CardContent({
                        children: html`
                           <div class="overflow-x-auto">
                              <table class="w-full text-sm">
                                 <thead>
                                    <tr class="border-b">
                                       <th class="text-left p-2 font-medium">Property</th>
                                       <th class="text-left p-2 font-medium">Type</th>
                                       <th class="text-left p-2 font-medium">Default</th>
                                       <th class="text-left p-2 font-medium">Description</th>
                                    </tr>
                                 </thead>
                                 <tbody class="text-sm">
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">checked</td>
                                       <td class="p-2">boolean</td>
                                       <td class="p-2">false</td>
                                       <td class="p-2">Controls the checked/toggled state</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">disabled</td>
                                       <td class="p-2">boolean</td>
                                       <td class="p-2">false</td>
                                       <td class="p-2">Disables user interaction</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">label</td>
                                       <td class="p-2">string | TemplateResult</td>
                                       <td class="p-2">""</td>
                                       <td class="p-2">Built-in label text or template</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">name</td>
                                       <td class="p-2">string</td>
                                       <td class="p-2">""</td>
                                       <td class="p-2">Form field name</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">value</td>
                                       <td class="p-2">string</td>
                                       <td class="p-2">""</td>
                                       <td class="p-2">Form field value</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">id</td>
                                       <td class="p-2">string</td>
                                       <td class="p-2">""</td>
                                       <td class="p-2">Element ID for labels</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">onChange</td>
                                       <td class="p-2">(checked: boolean) => void</td>
                                       <td class="p-2">undefined</td>
                                       <td class="p-2">Called when state changes</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">className</td>
                                       <td class="p-2">string</td>
                                       <td class="p-2">""</td>
                                       <td class="p-2">Additional CSS classes</td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>

                           <div class="mt-6">
                              <h4 class="font-medium mb-3">Best Practices</h4>
                              <ul class="text-sm space-y-2 text-muted-foreground">
                                 <li>• Use switches for binary on/off states, not multiple options</li>
                                 <li>• Provide clear labels that indicate what will happen when toggled</li>
                                 <li>• Consider using the built-in label prop for simple text labels</li>
                                 <li>• Use external Label components for more complex layouts with descriptions</li>
                                 <li>• Always handle the onChange event to update your state</li>
                                 <li>• Disable switches when the action is not currently available</li>
                              </ul>
                           </div>
                        `,
                     })}
                  `,
               })}
            </section>
         </div>
      `;
   }
}

import { Card, CardContent, CardHeader, CardTitle, Checkbox, Label } from "@mariozechner/mini-lit";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("page-checkboxes")
export class CheckboxesPage extends LitElement {
   @state() checkboxStates = {
      single: false,
      withLabel: false,
      disabled: false,
      disabledChecked: true,
      terms: false,
      newsletter: false,
      notifications: {
         email: true,
         push: false,
         sms: false,
      },
   };

   @state() indeterminateStates = {
      parent: false,
      children: {
         child1: false,
         child2: false,
         child3: false,
      },
   };

   createRenderRoot() {
      return this;
   }

   private handleSingleChange(field: string, checked: boolean) {
      this.checkboxStates = {
         ...this.checkboxStates,
         [field]: checked,
      };
   }

   private handleGroupChange(group: string, field: string, checked: boolean) {
      const currentGroup = (this.checkboxStates as any)[group] || {};
      this.checkboxStates = {
         ...this.checkboxStates,
         [group]: {
            ...currentGroup,
            [field]: checked,
         },
      } as any;
   }

   private handleIndeterminateParentChange(checked: boolean) {
      // When parent changes, update all children
      this.indeterminateStates = {
         parent: checked,
         children: {
            child1: checked,
            child2: checked,
            child3: checked,
         },
      };
   }

   private handleIndeterminateChildChange(field: string, checked: boolean) {
      const newChildren = {
         ...this.indeterminateStates.children,
         [field]: checked,
      };

      const checkedCount = Object.values(newChildren).filter(Boolean).length;
      const totalCount = Object.keys(newChildren).length;

      this.indeterminateStates = {
         parent: checkedCount === totalCount,
         children: newChildren,
      };
   }

   private getIndeterminateState() {
      const checkedCount = Object.values(this.indeterminateStates.children).filter(Boolean).length;
      const totalCount = Object.keys(this.indeterminateStates.children).length;

      if (checkedCount === 0) return { checked: false, indeterminate: false };
      if (checkedCount === totalCount) return { checked: true, indeterminate: false };
      return { checked: false, indeterminate: true };
   }

   render() {
      const parentState = this.getIndeterminateState();

      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Checkboxes</h1>
               <p class="text-muted-foreground">
                  Boolean selection components with support for labels, disabled states, and indeterminate state.
               </p>
            </div>

            <!-- Basic Checkboxes -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Examples</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center space-x-3">
                           ${Checkbox({
                              checked: this.checkboxStates.single,
                              onChange: (checked) => this.handleSingleChange("single", checked),
                           })}
                           <span class="text-sm">Checkbox without label</span>
                        </div>

                        ${Checkbox({
                           checked: this.checkboxStates.withLabel,
                           label: "Checkbox with label",
                           onChange: (checked) => this.handleSingleChange("withLabel", checked),
                        })}
                        ${Checkbox({
                           checked: this.checkboxStates.disabled,
                           label: "Disabled checkbox",
                           disabled: true,
                           onChange: (checked) => this.handleSingleChange("disabled", checked),
                        })}
                        ${Checkbox({
                           checked: this.checkboxStates.disabledChecked,
                           label: "Disabled checked",
                           disabled: true,
                           onChange: (checked) => this.handleSingleChange("disabledChecked", checked),
                        })}
                        ${Checkbox({
                           checked: false,
                           indeterminate: true,
                           label: "Indeterminate state",
                           disabled: true,
                        })}
                     </div>
                  `}
                  .code=${`// Basic checkbox usage
\${Checkbox({
  checked: false,
  onChange: (checked) => console.log(checked)
})}

// Checkbox with label
\${Checkbox({
  checked: true,
  label: "Accept terms",
  onChange: (checked) => console.log(checked)
})}

// Disabled checkbox
\${Checkbox({
  checked: false,
  label: "Disabled option",
  disabled: true
})}

// Indeterminate state
\${Checkbox({
  checked: false,
  indeterminate: true,
  label: "Mixed selection"
})}`}
               ></preview-code>
            </section>

            <!-- Form Example -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Form Integration</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                           ${Checkbox({
                              checked: this.checkboxStates.terms,
                              onChange: (checked) => this.handleSingleChange("terms", checked),
                              id: "terms",
                           })}
                           <div>
                              ${Label({ htmlFor: "terms", children: "I agree to the Terms of Service" })}
                              <p class="text-xs text-muted-foreground">
                                 By checking this box, you agree to our terms and conditions.
                              </p>
                           </div>
                        </div>

                        <div class="flex items-start space-x-3">
                           ${Checkbox({
                              checked: this.checkboxStates.newsletter,
                              onChange: (checked) => this.handleSingleChange("newsletter", checked),
                              id: "newsletter",
                           })}
                           <div>
                              ${Label({ htmlFor: "newsletter", children: "Subscribe to newsletter" })}
                              <p class="text-xs text-muted-foreground">
                                 Receive updates about new features and promotions.
                              </p>
                           </div>
                        </div>
                     </div>
                  `}
                  .code=${`// Using with labels and descriptions
<div class="flex items-start space-x-3">
  \${Checkbox({
    checked: state.terms,
    onChange: (checked) => setState({ terms: checked }),
    id: "terms"
  })}
  <div>
    \${Label({ htmlFor: "terms", children: "I agree to the Terms" })}
    <p class="text-xs text-muted-foreground">
      Additional description text
    </p>
  </div>
</div>`}
               ></preview-code>
            </section>

            <!-- Grouped Checkboxes -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Grouped Options</h2>

               <preview-code
                  .preview=${html`
                     <div>
                        <h4 class="text-sm font-medium mb-3">Notification Preferences</h4>
                        <div class="space-y-3 pl-4 border-l-2 border-muted">
                           ${Checkbox({
                              checked: this.checkboxStates.notifications.email,
                              label: "Email notifications",
                              onChange: (checked) => this.handleGroupChange("notifications", "email", checked),
                           })}
                           ${Checkbox({
                              checked: this.checkboxStates.notifications.push,
                              label: "Push notifications",
                              onChange: (checked) => this.handleGroupChange("notifications", "push", checked),
                           })}
                           ${Checkbox({
                              checked: this.checkboxStates.notifications.sms,
                              label: "SMS notifications",
                              onChange: (checked) => this.handleGroupChange("notifications", "sms", checked),
                           })}
                        </div>
                     </div>
                  `}
                  .code=${`// Grouped checkboxes with state management
const [notifications, setNotifications] = useState({
  email: true,
  push: false,
  sms: false
});

const handleChange = (field: string, checked: boolean) => {
  setNotifications(prev => ({
    ...prev,
    [field]: checked
  }));
};

// Render group
<div class="space-y-3">
  \${Checkbox({
    checked: notifications.email,
    label: "Email notifications",
    onChange: (checked) => handleChange("email", checked)
  })}
  \${Checkbox({
    checked: notifications.push,
    label: "Push notifications",
    onChange: (checked) => handleChange("push", checked)
  })}
</div>`}
               ></preview-code>
            </section>

            <!-- Indeterminate State -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Indeterminate State</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <p class="text-sm text-muted-foreground">
                           The parent checkbox shows an indeterminate state when some but not all children are selected.
                        </p>

                        <div class="space-y-3">
                           ${Checkbox({
                              checked: parentState.checked,
                              indeterminate: parentState.indeterminate,
                              label: "Select All",
                              onChange: (checked) => this.handleIndeterminateParentChange(checked),
                           })}

                           <div class="pl-6 space-y-2">
                              ${Checkbox({
                                 checked: this.indeterminateStates.children.child1,
                                 label: "Option 1",
                                 onChange: (checked) => this.handleIndeterminateChildChange("child1", checked),
                              })}
                              ${Checkbox({
                                 checked: this.indeterminateStates.children.child2,
                                 label: "Option 2",
                                 onChange: (checked) => this.handleIndeterminateChildChange("child2", checked),
                              })}
                              ${Checkbox({
                                 checked: this.indeterminateStates.children.child3,
                                 label: "Option 3",
                                 onChange: (checked) => this.handleIndeterminateChildChange("child3", checked),
                              })}
                           </div>
                        </div>
                     </div>
                  `}
                  .code=${`// Indeterminate state logic
const getParentState = () => {
  const checkedCount = Object.values(children).filter(Boolean).length;
  const totalCount = Object.keys(children).length;

  if (checkedCount === 0) return { checked: false, indeterminate: false };
  if (checkedCount === totalCount) return { checked: true, indeterminate: false };
  return { checked: false, indeterminate: true };
};

const parentState = getParentState();

\${Checkbox({
  checked: parentState.checked,
  indeterminate: parentState.indeterminate,
  label: "Select All",
  onChange: (checked) => handleParentChange(checked)
})}`}
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
                                       <td class="p-2">Controls the checked state</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">indeterminate</td>
                                       <td class="p-2">boolean</td>
                                       <td class="p-2">false</td>
                                       <td class="p-2">Shows indeterminate state (mixed selection)</td>
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
                                       <td class="p-2">Label text or template</td>
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
                                       <td class="p-2">Element ID (auto-generated if label provided)</td>
                                    </tr>
                                    <tr class="border-b">
                                       <td class="p-2 font-mono">onChange</td>
                                       <td class="p-2">(checked: boolean) => void</td>
                                       <td class="p-2">undefined</td>
                                       <td class="p-2">Called when checked state changes</td>
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
                        `,
                     })}
                  `,
               })}
            </section>
         </div>
      `;
   }
}

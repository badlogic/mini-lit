import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { Label, Input, Textarea, Checkbox, Switch, Separator, Badge, icon } from "@mariozechner/mini-lit";
import { Asterisk, Info, AlertCircle, CheckCircle, HelpCircle, User, Mail } from "lucide";

@customElement("page-labels")
export class LabelsPage extends LitElement {
   @state() checkboxState = false;
   @state() switchState = false;

   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Labels</h1>
               <p class="text-muted-foreground">
                  Accessible labels for form elements with various styles and features.
               </p>
            </div>

            <!-- Basic Labels -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Labels</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                           ${Label({ children: "Username", htmlFor: "username" })}
                           ${Input({
                              id: "username",
                              type: "text",
                              placeholder: "Enter username",
                           })}
                        </div>

                        <div class="space-y-2">
                           ${Label({ children: "Email", htmlFor: "email" })}
                           ${Input({
                              id: "email",
                              type: "email",
                              placeholder: "you@example.com",
                           })}
                        </div>

                        <div class="space-y-2">
                           ${Label({ children: "Message", htmlFor: "message" })}
                           ${Textarea({
                              id: "message",
                              placeholder: "Type your message here",
                              rows: 3,
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Label, Input, Textarea } from "@mariozechner/mini-lit";

// Basic label with input
<div class="space-y-2">
  \${Label({ children: "Username", htmlFor: "username" })}
  \${Input({
    id: "username",
    type: "text",
    placeholder: "Enter username"
  })}
</div>

// Label with textarea
<div class="space-y-2">
  \${Label({ children: "Message", htmlFor: "message" })}
  \${Textarea({
    id: "message",
    placeholder: "Type your message here",
    rows: 3
  })}
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Required Fields -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Required Field Indicators</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                           ${Label({
                              children: html`Name <span class="text-destructive">*</span>`,
                              htmlFor: "required-name",
                           })}
                           ${Input({
                              id: "required-name",
                              type: "text",
                              placeholder: "Required field",
                              required: true,
                           })}
                        </div>

                        <div class="space-y-2">
                           ${Label({
                              children: html`Email ${icon(Asterisk, "xs", "inline text-destructive ml-1")}`,
                              htmlFor: "required-email",
                           })}
                           ${Input({
                              id: "required-email",
                              type: "email",
                              placeholder: "Required field",
                              required: true,
                           })}
                        </div>

                        <div class="space-y-2">
                           ${Label({
                              children: html`Password
                              ${Badge({
                                 variant: "destructive",
                                 className: "ml-2 text-xs px-1.5 py-0.5",
                                 children: "Required",
                              })}`,
                              htmlFor: "required-password",
                           })}
                           ${Input({
                              id: "required-password",
                              type: "password",
                              placeholder: "Enter password",
                              required: true,
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// Using asterisk
\${Label({
  children: html\`Name <span class="text-destructive">*</span>\`,
  htmlFor: "required-name"
})}

// Using icon
\${Label({
  children: html\`Email \${icon(Asterisk, "xs", "inline text-destructive ml-1")}\`,
  htmlFor: "required-email"
})}

// Using badge
\${Label({
  children: html\`Password \${Badge({
    variant: "destructive",
    className: "ml-2",
    children: "Required"
  })}\`,
  htmlFor: "required-password"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Labels with Help Text -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Labels with Help Text</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                           ${Label({
                              children: html`Username ${icon(Info, "xs", "inline text-muted-foreground ml-1")}`,
                              htmlFor: "username-help",
                           })}
                           ${Input({
                              id: "username-help",
                              type: "text",
                              placeholder: "Choose a unique username",
                           })}
                           <p class="text-xs text-muted-foreground">
                              Must be 3-20 characters, letters and numbers only
                           </p>
                        </div>

                        <div class="space-y-2">
                           ${Label({
                              children: html`API Key ${icon(HelpCircle, "xs", "inline text-muted-foreground ml-1")}`,
                              htmlFor: "api-key",
                           })}
                           ${Input({
                              id: "api-key",
                              type: "text",
                              placeholder: "Enter your API key",
                           })}
                           <p class="text-xs text-muted-foreground">You can find your API key in the settings page</p>
                        </div>
                     </div>
                  `}
                  code=${`// Label with help icon and text
<div class="space-y-2">
  \${Label({
    children: html\`Username \${icon(Info, "xs", "inline text-muted-foreground ml-1")}\`,
    htmlFor: "username-help"
  })}
  \${Input({
    id: "username-help",
    type: "text",
    placeholder: "Choose a unique username"
  })}
  <p class="text-xs text-muted-foreground">
    Must be 3-20 characters, letters and numbers only
  </p>
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Validation States -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Validation State Labels</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                           ${Label({
                              children: html`${icon(CheckCircle, "xs", "inline text-green-500 mr-1")} Valid Email`,
                              htmlFor: "valid-email",
                           })}
                           ${Input({
                              id: "valid-email",
                              type: "email",
                              value: "user@example.com",
                              className: "border-green-500",
                           })}
                        </div>

                        <div class="space-y-2">
                           ${Label({
                              children: html`${icon(AlertCircle, "xs", "inline text-destructive mr-1")} Invalid Username`,
                              htmlFor: "invalid-username",
                           })}
                           ${Input({
                              id: "invalid-username",
                              type: "text",
                              value: "ab",
                              className: "border-destructive",
                           })}
                           <p class="text-xs text-destructive">Username must be at least 3 characters</p>
                        </div>
                     </div>
                  `}
                  code=${`// Success state
\${Label({
  children: html\`\${icon(CheckCircle, "xs", "inline text-green-500 mr-1")} Valid Email\`,
  htmlFor: "valid-email"
})}
\${Input({
  id: "valid-email",
  type: "email",
  value: "user@example.com",
  className: "border-green-500"
})}

// Error state
\${Label({
  children: html\`\${icon(AlertCircle, "xs", "inline text-destructive mr-1")} Invalid Username\`,
  htmlFor: "invalid-username"
})}
\${Input({
  id: "invalid-username",
  type: "text",
  value: "ab",
  className: "border-destructive"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Labels with Icons -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Labels with Icons</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                           ${Label({
                              children: html`${icon(User, "xs", "inline mr-1")} Full Name`,
                              htmlFor: "full-name",
                           })}
                           ${Input({
                              id: "full-name",
                              type: "text",
                              placeholder: "John Doe",
                           })}
                        </div>

                        <div class="space-y-2">
                           ${Label({
                              children: html`${icon(Mail, "xs", "inline mr-1")} Email Address`,
                              htmlFor: "email-icon",
                           })}
                           ${Input({
                              id: "email-icon",
                              type: "email",
                              placeholder: "john@example.com",
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// Labels with leading icons
\${Label({
  children: html\`\${icon(User, "xs", "inline mr-1")} Full Name\`,
  htmlFor: "full-name"
})}

\${Label({
  children: html\`\${icon(Mail, "xs", "inline mr-1")} Email Address\`,
  htmlFor: "email-icon"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Other Components -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">With Other Components</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <div class="flex items-center space-x-3">
                           ${Checkbox({
                              checked: this.checkboxState,
                              onChange: (checked) => {
                                 this.checkboxState = checked;
                              },
                              id: "terms-checkbox",
                           })}
                           ${Label({
                              htmlFor: "terms-checkbox",
                              children: "I agree to the terms and conditions",
                           })}
                        </div>

                        <div class="flex items-center justify-between">
                           ${Label({
                              htmlFor: "notifications-switch",
                              children: "Enable notifications",
                           })}
                           ${Switch({
                              checked: this.switchState,
                              onChange: (checked) => {
                                 this.switchState = checked;
                              },
                              id: "notifications-switch",
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// With checkbox
<div class="flex items-center space-x-3">
  \${Checkbox({
    checked: state.agreed,
    onChange: handleChange,
    id: "terms-checkbox"
  })}
  \${Label({
    htmlFor: "terms-checkbox",
    children: "I agree to the terms and conditions"
  })}
</div>

// With switch
<div class="flex items-center justify-between">
  \${Label({
    htmlFor: "notifications-switch",
    children: "Enable notifications"
  })}
  \${Switch({
    checked: state.notifications,
    onChange: handleChange,
    id: "notifications-switch"
  })}
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Label Properties</h3>
                     <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                           <thead>
                              <tr class="border-b border-border">
                                 <th class="text-left py-2 pr-4">Property</th>
                                 <th class="text-left py-2 pr-4">Type</th>
                                 <th class="text-left py-2 pr-4">Default</th>
                                 <th class="text-left py-2">Description</th>
                              </tr>
                           </thead>
                           <tbody class="font-mono">
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">children</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Label content</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">htmlFor</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Associates label with form element</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">className</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Additional CSS classes</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">Best Practices</h3>
                     <ul class="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Always associate labels with their form controls using the htmlFor attribute</li>
                        <li>Use clear, descriptive label text that explains what the user should enter</li>
                        <li>
                           Place required field indicators consistently (either all before or all after the label text)
                        </li>
                        <li>Use help text below the input field for additional context or validation requirements</li>
                        <li>Ensure labels remain visible even when the field has focus or contains a value</li>
                        <li>Use consistent spacing between labels and their associated form controls</li>
                     </ul>
                  </div>
               </div>
            </section>
         </div>
      `;
   }
}

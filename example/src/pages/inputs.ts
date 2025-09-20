import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { Button, Input, icon, Separator } from "@mariozechner/mini-lit";
import { AlertCircle, Check, DollarSign, Eye, EyeOff, Lock, Mail, Phone, Search, User } from "lucide";

@customElement("page-inputs")
export class InputsPage extends LitElement {
   @state() showPassword = false;
   @state() interactiveValue = "";

   createRenderRoot() {
      return this;
   }

   private togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Inputs</h1>
               <p class="text-muted-foreground">
                  Form input components for collecting user data with various types, sizes, and states.
               </p>
            </div>

            <!-- Basic Input Types -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Input Types</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Input({
                           type: "text",
                           placeholder: "Text input",
                           label: "Text",
                        })}
                        ${Input({
                           type: "email",
                           placeholder: "user@example.com",
                           label: "Email",
                        })}
                        ${Input({
                           type: "password",
                           placeholder: "Password",
                           label: "Password",
                        })}
                        ${Input({
                           type: "number",
                           placeholder: "123",
                           label: "Number",
                        })}
                        ${Input({
                           type: "tel",
                           placeholder: "+1 (555) 123-4567",
                           label: "Phone",
                        })}
                        ${Input({
                           type: "url",
                           placeholder: "https://example.com",
                           label: "URL",
                        })}
                        ${Input({
                           type: "search",
                           placeholder: "Search...",
                           label: "Search",
                        })}
                        ${Input({
                           type: "date",
                           label: "Date",
                        })}
                     </div>
                  `}
                  code=${`import { Input } from "@mariozechner/mini-lit";

// Text input
\${Input({
  type: "text",
  placeholder: "Text input",
  label: "Text"
})}

// Email input
\${Input({
  type: "email",
  placeholder: "user@example.com",
  label: "Email"
})}

// Password input
\${Input({
  type: "password",
  placeholder: "Password",
  label: "Password"
})}

// Number input
\${Input({
  type: "number",
  placeholder: "123",
  label: "Number"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Input Sizes -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Sizes</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Input({
                           size: "sm",
                           placeholder: "Small input",
                           label: "Small (sm)",
                        })}
                        ${Input({
                           size: "md",
                           placeholder: "Medium input",
                           label: "Medium (md)",
                        })}
                        ${Input({
                           size: "lg",
                           placeholder: "Large input",
                           label: "Large (lg)",
                        })}
                     </div>
                  `}
                  code=${`import { Input } from "@mariozechner/mini-lit";

// Small size
\${Input({
  size: "sm",
  placeholder: "Small input",
  label: "Small"
})}

// Medium size (default)
\${Input({
  size: "md",
  placeholder: "Medium input",
  label: "Medium"
})}

// Large size
\${Input({
  size: "lg",
  placeholder: "Large input",
  label: "Large"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Input States -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">States</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Input({
                           placeholder: "Normal input",
                           label: "Normal",
                        })}
                        ${Input({
                           placeholder: "Required field",
                           label: "Required",
                           required: true,
                        })}
                        ${Input({
                           value: "Read-only value",
                           label: "Read-only",
                           readonly: true,
                        })}
                        ${Input({
                           placeholder: "Disabled input",
                           label: "Disabled",
                           disabled: true,
                        })}
                        ${Input({
                           value: "invalid-email",
                           label: "With Error",
                           error: "Please enter a valid email address",
                        })}
                        ${Input({
                           value: "user@example.com",
                           label: "Valid Email",
                           type: "email",
                        })}
                     </div>
                  `}
                  code=${`import { Input } from "@mariozechner/mini-lit";

// Normal input
\${Input({
  placeholder: "Normal input",
  label: "Normal"
})}

// Required field
\${Input({
  placeholder: "Required field",
  label: "Required",
  required: true
})}

// Read-only
\${Input({
  value: "Read-only value",
  label: "Read-only",
  readonly: true
})}

// Disabled
\${Input({
  placeholder: "Disabled input",
  label: "Disabled",
  disabled: true
})}

// With error
\${Input({
  value: "invalid-email",
  label: "With Error",
  error: "Please enter a valid email address"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Icons -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">With Icons</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                           <label class="text-sm font-medium">Email</label>
                           <div class="relative">
                              ${icon(
                                 Mail,
                                 "sm",
                                 "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10",
                              )}
                              ${Input({
                                 type: "email",
                                 placeholder: "Email address",
                                 className: "pl-10",
                              })}
                           </div>
                        </div>

                        <div class="space-y-1.5">
                           <label class="text-sm font-medium">Password</label>
                           <div class="relative">
                              ${icon(
                                 Lock,
                                 "sm",
                                 "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10",
                              )}
                              ${Input({
                                 type: this.showPassword ? "text" : "password",
                                 placeholder: "Password",
                                 className: "pl-10 pr-10",
                              })}
                              ${Button({
                                 type: "button",
                                 variant: "ghost",
                                 size: "icon",
                                 className: "absolute right-0 top-0 h-full px-3",
                                 onClick: () => this.togglePasswordVisibility(),
                                 children: icon(this.showPassword ? EyeOff : Eye, "sm"),
                              })}
                           </div>
                        </div>

                        <div class="space-y-1.5">
                           <label class="text-sm font-medium">Username</label>
                           <div class="relative">
                              ${icon(
                                 User,
                                 "sm",
                                 "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10",
                              )}
                              ${Input({
                                 type: "text",
                                 placeholder: "Username",
                                 className: "pl-10",
                              })}
                           </div>
                        </div>

                        <div class="space-y-1.5">
                           <label class="text-sm font-medium">Search</label>
                           <div class="relative">
                              ${icon(
                                 Search,
                                 "sm",
                                 "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10",
                              )}
                              ${Input({
                                 type: "search",
                                 placeholder: "Search...",
                                 className: "pl-10",
                              })}
                           </div>
                        </div>

                        <div class="space-y-1.5">
                           <label class="text-sm font-medium">Phone</label>
                           <div class="relative">
                              ${icon(
                                 Phone,
                                 "sm",
                                 "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10",
                              )}
                              ${Input({
                                 type: "tel",
                                 placeholder: "Phone number",
                                 className: "pl-10",
                              })}
                           </div>
                        </div>

                        <div class="space-y-1.5">
                           <label class="text-sm font-medium">Amount</label>
                           <div class="relative">
                              ${icon(
                                 DollarSign,
                                 "sm",
                                 "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10",
                              )}
                              ${Input({
                                 type: "number",
                                 placeholder: "0.00",
                                 className: "pl-10",
                              })}
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`import { Input, Button, icon } from "@mariozechner/mini-lit";
import { Mail, Lock, User, Search, Eye, EyeOff } from "lucide";

// Email with icon
<div class="space-y-1.5">
  <label class="text-sm font-medium">Email</label>
  <div class="relative">
    \${icon(Mail, "sm", "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10")}
    \${Input({
      type: "email",
      placeholder: "Email address",
      className: "pl-10"
    })}
  </div>
</div>

// Password with toggle visibility
<div class="space-y-1.5">
  <label class="text-sm font-medium">Password</label>
  <div class="relative">
    \${icon(Lock, "sm", "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10")}
    \${Input({
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      className: "pl-10 pr-10"
    })}
    \${Button({
      type: "button",
      variant: "ghost",
      size: "icon",
      className: "absolute right-0 top-0 h-full px-3",
      onClick: () => togglePasswordVisibility(),
      children: icon(showPassword ? EyeOff : Eye, "sm")
    })}
  </div>
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Interactive Example -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Interactive Example</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Input({
                           value: this.interactiveValue,
                           placeholder: "Type something...",
                           label: "Interactive Input",
                           onInput: (e: any) => {
                              this.interactiveValue = e.target.value;
                           },
                        })}
                        <p class="text-sm text-muted-foreground">
                           Current value:
                           <code class="bg-muted px-1 py-0.5 rounded">${this.interactiveValue || "(empty)"}</code>
                        </p>
                     </div>
                  `}
                  code=${`import { Input } from "@mariozechner/mini-lit";

@state() inputValue = "";

\${Input({
  value: this.inputValue,
  placeholder: "Type something...",
  label: "Interactive Input",
  onInput: (e: any) => {
    this.inputValue = e.target.value;
  }
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Form Examples -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Form Examples</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <!-- Search Bar -->
                        <div class="space-y-2">
                           <h3 class="text-lg font-medium">Search Bar</h3>
                           <div class="flex gap-2">
                              <div class="relative flex-1">
                                 ${icon(
                                    Search,
                                    "sm",
                                    "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10",
                                 )}
                                 ${Input({
                                    type: "search",
                                    placeholder: "Search products, categories...",
                                    className: "pl-10",
                                 })}
                              </div>
                              ${Button({ children: "Search" })}
                           </div>
                        </div>

                        ${Separator()}

                        <!-- Login Form -->
                        <div class="space-y-2">
                           <h3 class="text-lg font-medium">Login Form</h3>
                           <div class="space-y-4 max-w-sm">
                              ${Input({
                                 type: "email",
                                 placeholder: "Email address",
                                 label: "Email",
                                 required: true,
                              })}
                              ${Input({
                                 type: "password",
                                 placeholder: "Password",
                                 label: "Password",
                                 required: true,
                              })}
                              <div class="flex gap-2">
                                 ${Button({ variant: "outline", children: "Cancel" })}
                                 ${Button({ children: "Sign In" })}
                              </div>
                           </div>
                        </div>

                        ${Separator()}

                        <!-- Validation Example -->
                        <div class="space-y-2">
                           <h3 class="text-lg font-medium">Validation States</h3>
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div class="space-y-1.5">
                                 <label class="text-sm font-medium text-destructive">Email with Error</label>
                                 <div class="relative">
                                    ${icon(
                                       AlertCircle,
                                       "sm",
                                       "absolute right-3 top-1/2 transform -translate-y-1/2 text-destructive z-10",
                                    )}
                                    ${Input({
                                       type: "email",
                                       value: "invalid-email",
                                       className: "pr-10",
                                       error: "Please enter a valid email address",
                                    })}
                                 </div>
                              </div>

                              <div class="space-y-1.5">
                                 <label class="text-sm font-medium text-green-600">Valid Email</label>
                                 <div class="relative">
                                    ${icon(
                                       Check,
                                       "sm",
                                       "absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 z-10",
                                    )}
                                    ${Input({
                                       type: "email",
                                       value: "user@example.com",
                                       className: "pr-10 border-green-300",
                                    })}
                                 </div>
                                 <p class="text-sm text-green-600">Email is valid</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`import { Input, Button, Separator, icon } from "@mariozechner/mini-lit";
import { Search, AlertCircle, Check } from "lucide";

// Search bar with button
<div class="flex gap-2">
  <div class="relative flex-1">
    \${icon(Search, "sm", "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10")}
    \${Input({
      type: "search",
      placeholder: "Search products, categories...",
      className: "pl-10"
    })}
  </div>
  \${Button({ children: "Search" })}
</div>

// Login form
<div class="space-y-4">
  \${Input({
    type: "email",
    placeholder: "Email address",
    label: "Email",
    required: true
  })}
  \${Input({
    type: "password",
    placeholder: "Password",
    label: "Password",
    required: true
  })}
  <div class="flex gap-2">
    \${Button({ variant: "outline", children: "Cancel" })}
    \${Button({ children: "Sign In" })}
  </div>
</div>

// Error validation
\${Input({
  type: "email",
  value: "invalid-email",
  error: "Please enter a valid email address"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Input Properties</h3>
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
                                 <td class="py-2 pr-4">id</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">HTML id attribute</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">type</td>
                                 <td class="py-2 pr-4 text-muted-foreground">
                                    "text" | "email" | "password" | "number" | "url" | "tel" | "search" | "date"
                                 </td>
                                 <td class="py-2 pr-4 text-muted-foreground">"text"</td>
                                 <td class="py-2 font-sans">Input type attribute</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">size</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"sm" | "md" | "lg"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"md"</td>
                                 <td class="py-2 font-sans">Size of the input</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">value</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Input value</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">placeholder</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Placeholder text</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">label</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Built-in label text</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">error</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Error message to display</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">disabled</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Disables the input when true</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">readonly</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Makes input read-only when true</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">required</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Marks field as required</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">name</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">HTML name attribute</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">autocomplete</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">HTML autocomplete attribute</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">min</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Minimum value (for number/date inputs)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">max</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Maximum value (for number/date inputs)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">step</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Step value (for number inputs)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">inputRef</td>
                                 <td class="py-2 pr-4 text-muted-foreground">Ref&lt;HTMLInputElement&gt;</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Ref to the input element</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">onInput</td>
                                 <td class="py-2 pr-4 text-muted-foreground">(e: Event) => void</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Input event handler</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">onChange</td>
                                 <td class="py-2 pr-4 text-muted-foreground">(e: Event) => void</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Change event handler</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">onKeyDown</td>
                                 <td class="py-2 pr-4 text-muted-foreground">(e: KeyboardEvent) => void</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Key down event handler</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">onKeyUp</td>
                                 <td class="py-2 pr-4 text-muted-foreground">(e: KeyboardEvent) => void</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Key up event handler</td>
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
               </div>
            </section>
         </div>
      `;
   }
}

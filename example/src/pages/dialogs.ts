import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, Input, icon, Label } from "@mariozechner/mini-lit";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AlertTriangle, CheckCircle, Info, Save, Settings, Trash2 } from "lucide";

@customElement("page-dialogs")
export class DialogsPage extends LitElement {
   @state() basicDialogOpen = false;
   @state() formDialogOpen = false;
   @state() confirmDialogOpen = false;
   @state() infoDialogOpen = false;
   @state() formData = { name: "", email: "", message: "" };

   createRenderRoot() {
      return this;
   }

   private handleFormSubmit() {
      console.log("Form submitted:", this.formData);
      this.formDialogOpen = false;
      this.formData = { name: "", email: "", message: "" };
   }

   private handleFormChange(field: string, value: string) {
      this.formData = { ...this.formData, [field]: value };
   }

   private handleDelete() {
      console.log("Delete confirmed");
      this.confirmDialogOpen = false;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Dialogs</h1>
               <p class="text-muted-foreground">Modal dialogs for user interactions, confirmations, and forms.</p>
            </div>

            <!-- Basic Dialog -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Dialog</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex items-center justify-center p-8">
                        ${Button({
                           onClick: () => {
                              this.basicDialogOpen = true;
                           },
                           children: "Open Dialog",
                        })}
                     </div>
                  `}
                  .code=${`import { Dialog, DialogHeader, DialogContent, DialogFooter, Button } from '@mariozechner/mini-lit';

// State
@state() dialogOpen = false;

// Template
<>
  \${Button({
    onClick: () => (this.dialogOpen = true),
    children: "Open Dialog"
  })}

  \${Dialog({
    isOpen: this.dialogOpen,
    onClose: () => (this.dialogOpen = false),
    children: html\`
      \${DialogContent({
        children: html\`
          \${DialogHeader({
            title: "Dialog Title",
            description: "Dialog description goes here."
          })}
          <p>Dialog content goes here.</p>
          \${DialogFooter({
            children: html\`
              \${Button({
                variant: "outline",
                onClick: () => (this.dialogOpen = false),
                children: "Cancel"
              })}
              \${Button({
                onClick: () => (this.dialogOpen = false),
                children: "Confirm"
              })}
            \`
          })}
        \`
      })}
    \`
  })}
</>`}
               ></preview-code>
            </section>

            <!-- Confirmation Dialog -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Confirmation Dialog</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex items-center justify-center p-8">
                        ${Button({
                           variant: "destructive",
                           onClick: () => {
                              this.confirmDialogOpen = true;
                           },
                           children: html`${icon(Trash2, "sm")} Delete Item`,
                        })}
                     </div>
                  `}
                  .code=${`// Destructive confirmation dialog
\${Dialog({
  isOpen: this.confirmOpen,
  onClose: () => (this.confirmOpen = false),
  width: "400px",
  children: html\`
    \${DialogContent({
      children: html\`
        \${DialogHeader({
          title: "Are you sure?",
          description: "This action cannot be undone. This will permanently delete the item."
        })}
        <div class="flex items-center gap-2 p-3 bg-destructive/10 rounded-md">
          \${icon(AlertTriangle, "sm", "text-destructive")}
          <span class="text-sm">This is a destructive action</span>
        </div>
        \${DialogFooter({
          children: html\`
            \${Button({
              variant: "outline",
              onClick: () => (this.confirmOpen = false),
              children: "Cancel"
            })}
            \${Button({
              variant: "destructive",
              onClick: handleDelete,
              children: "Delete"
            })}
          \`
        })}
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            <!-- Form Dialog -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Form Dialog</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex items-center justify-center p-8">
                        ${Button({
                           onClick: () => {
                              this.formDialogOpen = true;
                           },
                           children: html`${icon(Settings, "sm")} Open Form`,
                        })}
                     </div>
                  `}
                  .code=${`// Dialog with form inputs
\${Dialog({
  isOpen: this.formOpen,
  onClose: () => (this.formOpen = false),
  children: html\`
    \${DialogContent({
      children: html\`
        \${DialogHeader({
          title: "Edit Profile",
          description: "Make changes to your profile here. Click save when you're done."
        })}
        <div class="space-y-4">
          <div>
            \${Label({ htmlFor: "name", children: "Name" })}
            \${Input({
              id: "name",
              value: this.formData.name,
              onInput: (e) => this.handleFormChange("name", e.target.value),
              placeholder: "Enter your name"
            })}
          </div>
          <div>
            \${Label({ htmlFor: "email", children: "Email" })}
            \${Input({
              id: "email",
              type: "email",
              value: this.formData.email,
              onInput: (e) => this.handleFormChange("email", e.target.value),
              placeholder: "Enter your email"
            })}
          </div>
        </div>
        \${DialogFooter({
          children: html\`
            \${Button({
              variant: "outline",
              onClick: () => (this.formOpen = false),
              children: "Cancel"
            })}
            \${Button({
              onClick: handleSave,
              children: html\`\${icon(Save, "sm")} Save changes\`
            })}
          \`
        })}
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            <!-- Information Dialog -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Information Dialog</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex items-center justify-center p-8">
                        ${Button({
                           variant: "outline",
                           onClick: () => {
                              this.infoDialogOpen = true;
                           },
                           children: html`${icon(Info, "sm")} View Info`,
                        })}
                     </div>
                  `}
                  .code=${`// Informational dialog with icon
\${Dialog({
  isOpen: this.infoOpen,
  onClose: () => (this.infoOpen = false),
  width: "450px",
  children: html\`
    \${DialogContent({
      children: html\`
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            \${icon(CheckCircle, "lg", "text-green-600")}
          </div>
          <div class="space-y-2">
            \${DialogHeader({
              title: "Payment successful",
              description: "Your payment has been processed successfully."
            })}
            <div class="text-sm text-muted-foreground">
              <p>Transaction ID: #12345</p>
              <p>Amount: $99.00</p>
              <p>Date: \${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        \${DialogFooter({
          children: Button({
            onClick: () => (this.infoOpen = false),
            children: "Done"
          })
        })}
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Dialog Properties</h3>
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
                                 <td class="py-2 pr-4">isOpen</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Controls dialog visibility</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">onClose</td>
                                 <td class="py-2 pr-4 text-muted-foreground">() => void</td>
                                 <td class="py-2 pr-4 text-muted-foreground">undefined</td>
                                 <td class="py-2 font-sans">Callback when dialog should close</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">width</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">min(600px, 90vw)</td>
                                 <td class="py-2 font-sans">Dialog width</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">height</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">auto</td>
                                 <td class="py-2 font-sans">Dialog height</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">children</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Dialog content</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">Interaction</h3>
                     <ul class="text-sm text-muted-foreground space-y-1">
                        <li>• Click backdrop to close</li>
                        <li>• Press Escape key to close</li>
                        <li>• Click X button to close</li>
                        <li>• Focus trapped within dialog</li>
                        <li>• Centered on screen</li>
                     </ul>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">DialogHeader</h3>
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
                                 <td class="py-2 pr-4">title</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Dialog title text</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">description</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">undefined</td>
                                 <td class="py-2 font-sans">Optional description text</td>
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
                     <h3 class="text-lg font-semibold mb-2">DialogContent</h3>
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
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Content to display</td>
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
                     <h3 class="text-lg font-semibold mb-2">DialogFooter</h3>
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
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Footer content (typically buttons)</td>
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

         <!-- Actual Dialogs (rendered outside preview) -->
         ${Dialog({
            isOpen: this.basicDialogOpen,
            onClose: () => {
               this.basicDialogOpen = false;
            },
            children: html`
               ${DialogContent({
                  children: html`
                     ${DialogHeader({
                        title: "Basic Dialog",
                        description: "This is a simple dialog example.",
                     })}
                     <p>
                        This is the content area of the dialog. You can put any content here, including text, images,
                        forms, or other components.
                     </p>
                     <div
                        class="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-md"
                     >
                        ${icon(Info, "sm")}
                        <span class="text-sm">This is an informational message within the dialog.</span>
                     </div>
                     ${DialogFooter({
                        children: html`
                           ${Button({
                              variant: "outline",
                              onClick: () => {
                                 this.basicDialogOpen = false;
                              },
                              children: "Cancel",
                           })}
                           ${Button({
                              onClick: () => {
                                 this.basicDialogOpen = false;
                              },
                              children: "OK",
                           })}
                        `,
                     })}
                  `,
               })}
            `,
         })}
         ${Dialog({
            isOpen: this.confirmDialogOpen,
            onClose: () => {
               this.confirmDialogOpen = false;
            },
            width: "400px",
            children: html`
               ${DialogContent({
                  children: html`
                     ${DialogHeader({
                        title: "Are you absolutely sure?",
                        description:
                           "This action cannot be undone. This will permanently delete the item and remove all associated data.",
                     })}
                     <div class="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                        ${icon(AlertTriangle, "sm")}
                        <span class="text-sm font-medium">This is a destructive action</span>
                     </div>
                     ${DialogFooter({
                        children: html`
                           ${Button({
                              variant: "outline",
                              onClick: () => {
                                 this.confirmDialogOpen = false;
                              },
                              children: "Cancel",
                           })}
                           ${Button({
                              variant: "destructive",
                              onClick: () => this.handleDelete(),
                              children: "Delete",
                           })}
                        `,
                     })}
                  `,
               })}
            `,
         })}
         ${Dialog({
            isOpen: this.formDialogOpen,
            onClose: () => {
               this.formDialogOpen = false;
            },
            children: html`
               ${DialogContent({
                  children: html`
                     ${DialogHeader({
                        title: "Edit Profile",
                        description: "Make changes to your profile here. Click save when you're done.",
                     })}
                     <div class="space-y-4">
                        <div>
                           ${Label({ htmlFor: "name", children: "Name" })}
                           ${Input({
                              id: "name",
                              value: this.formData.name,
                              onInput: (e: any) => this.handleFormChange("name", e.target.value),
                              placeholder: "Enter your name",
                           })}
                        </div>
                        <div>
                           ${Label({ htmlFor: "email", children: "Email" })}
                           ${Input({
                              id: "email",
                              type: "email",
                              value: this.formData.email,
                              onInput: (e: any) => this.handleFormChange("email", e.target.value),
                              placeholder: "name@example.com",
                           })}
                        </div>
                        <div>
                           ${Label({ htmlFor: "message", children: "Message" })}
                           <textarea
                              id="message"
                              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              .value=${this.formData.message}
                              @input=${(e: any) => this.handleFormChange("message", e.target.value)}
                              placeholder="Type your message here"
                           ></textarea>
                        </div>
                     </div>
                     ${DialogFooter({
                        children: html`
                           ${Button({
                              variant: "outline",
                              onClick: () => {
                                 this.formDialogOpen = false;
                              },
                              children: "Cancel",
                           })}
                           ${Button({
                              onClick: () => this.handleFormSubmit(),
                              children: html`${icon(Save, "sm")} Save changes`,
                           })}
                        `,
                     })}
                  `,
               })}
            `,
         })}
         ${Dialog({
            isOpen: this.infoDialogOpen,
            onClose: () => {
               this.infoDialogOpen = false;
            },
            width: "450px",
            children: html`
               ${DialogContent({
                  children: html`
                     <div class="flex gap-4">
                        <div class="flex-shrink-0">${icon(CheckCircle, "lg", "text-green-600")}</div>
                        <div class="space-y-2">
                           ${DialogHeader({
                              title: "Payment successful",
                              description: "Your payment has been processed successfully.",
                           })}
                           <div class="text-sm text-muted-foreground space-y-1">
                              <p>Transaction ID: #12345</p>
                              <p>Amount: $99.00</p>
                              <p>Date: ${new Date().toLocaleDateString()}</p>
                           </div>
                        </div>
                     </div>
                     ${DialogFooter({
                        children: Button({
                           onClick: () => {
                              this.infoDialogOpen = false;
                           },
                           children: "Done",
                        }),
                     })}
                  `,
               })}
            `,
         })}
      `;
   }
}

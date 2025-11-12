import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { icon } from "@mariozechner/mini-lit/dist/icons.js";
import { Separator } from "@mariozechner/mini-lit/dist/Separator.js";
import { Textarea } from "@mariozechner/mini-lit/dist/Textarea.js";
import { AlertCircle, Copy, Edit3, FileText, MessageSquare, RefreshCw, Save } from "lucide";

@customElement("page-textareas")
export class TextareasPage extends LitElement {
   @state() basicText = "";
   @state() interactiveText = "";
   @state() charCountText = "";

   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Textareas</h1>
               <p class="text-muted-foreground">
                  Multi-line text input components for longer content with various features and states.
               </p>
            </div>

            <!-- Basic Textareas -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Textareas</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Textarea({
                           placeholder: "Enter your text here...",
                           label: "Basic Textarea",
                           rows: 4,
                        })}
                        ${Textarea({
                           placeholder:
                              "This is a placeholder text that explains what should be entered here. It can be quite long and will wrap to multiple lines.",
                           label: "With Long Placeholder",
                           rows: 3,
                        })}
                        ${Textarea({
                           value: "This textarea has pre-filled content that users can edit.",
                           label: "With Default Value",
                           rows: 3,
                        })}
                     </div>
                  `}
                  code=${`import { Textarea } from "@mariozechner/mini-lit";

// Basic textarea
\${Textarea({
  placeholder: "Enter your text here...",
  label: "Basic Textarea",
  rows: 4
})}

// With long placeholder
\${Textarea({
  placeholder: "This is a placeholder text...",
  label: "With Long Placeholder",
  rows: 3
})}

// With default value
\${Textarea({
  value: "Pre-filled content",
  label: "With Default Value",
  rows: 3
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Different Sizes -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Row Sizes</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Textarea({
                           placeholder: "Small textarea with 2 rows",
                           label: "Small (2 rows)",
                           rows: 2,
                        })}
                        ${Textarea({
                           placeholder: "Default textarea with 4 rows",
                           label: "Default (4 rows)",
                           rows: 4,
                        })}
                        ${Textarea({
                           placeholder: "Large textarea with 8 rows",
                           label: "Large (8 rows)",
                           rows: 8,
                        })}
                     </div>
                  `}
                  code=${`import { Textarea } from "@mariozechner/mini-lit";

// Small (2 rows)
\${Textarea({
  placeholder: "Small textarea",
  label: "Small",
  rows: 2
})}

// Default (4 rows)
\${Textarea({
  placeholder: "Default textarea",
  label: "Default",
  rows: 4
})}

// Large (8 rows)
\${Textarea({
  placeholder: "Large textarea",
  label: "Large",
  rows: 8
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Resize Options -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Resize Options</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Textarea({
                           placeholder: "Cannot be resized",
                           label: "No Resize",
                           resize: "none",
                           rows: 3,
                        })}
                        ${Textarea({
                           placeholder: "Can only resize vertically (default)",
                           label: "Vertical Resize",
                           resize: "vertical",
                           rows: 3,
                        })}
                        ${Textarea({
                           placeholder: "Can only resize horizontally",
                           label: "Horizontal Resize",
                           resize: "horizontal",
                           rows: 3,
                        })}
                        ${Textarea({
                           placeholder: "Can resize in both directions",
                           label: "Both Directions",
                           resize: "both",
                           rows: 3,
                        })}
                     </div>
                  `}
                  code=${`import { Textarea } from "@mariozechner/mini-lit";

// No resize
\${Textarea({
  placeholder: "Cannot be resized",
  label: "No Resize",
  resize: "none",
  rows: 3
})}

// Vertical resize (default)
\${Textarea({
  placeholder: "Vertical resize only",
  label: "Vertical Resize",
  resize: "vertical",
  rows: 3
})}

// Horizontal resize
\${Textarea({
  placeholder: "Horizontal resize only",
  label: "Horizontal Resize",
  resize: "horizontal",
  rows: 3
})}

// Both directions
\${Textarea({
  placeholder: "Resize both ways",
  label: "Both Directions",
  resize: "both",
  rows: 3
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- States -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">States</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Textarea({
                           placeholder: "Normal textarea",
                           label: "Normal",
                           rows: 3,
                        })}
                        ${Textarea({
                           placeholder: "Required field",
                           label: "Required",
                           required: true,
                           rows: 3,
                        })}
                        ${Textarea({
                           placeholder: "This field is disabled",
                           label: "Disabled",
                           disabled: true,
                           rows: 3,
                        })}
                        ${Textarea({
                           value: "Invalid input",
                           label: "With Error",
                           error: "Please provide more details (minimum 50 characters)",
                           rows: 3,
                        })}
                     </div>
                  `}
                  code=${`import { Textarea } from "@mariozechner/mini-lit";

// Normal state
\${Textarea({
  placeholder: "Normal textarea",
  label: "Normal",
  rows: 3
})}

// Required field
\${Textarea({
  placeholder: "Required field",
  label: "Required",
  required: true,
  rows: 3
})}

// Disabled state
\${Textarea({
  placeholder: "This field is disabled",
  label: "Disabled",
  disabled: true,
  rows: 3
})}

// With error
\${Textarea({
  value: "Invalid input",
  label: "With Error",
  error: "Please provide more details",
  rows: 3
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Character Counter -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">With Character Counter</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div>
                           ${Textarea({
                              value: this.charCountText,
                              placeholder: "Write your message here...",
                              label: "Message",
                              maxLength: 250,
                              rows: 4,
                              onInput: (e: any) => {
                                 this.charCountText = e.target.value;
                              },
                           })}
                           <div class="flex justify-between items-center mt-2">
                              <span class="text-sm text-muted-foreground">
                                 ${
                                    this.charCountText.length > 200
                                       ? html`<span class="text-warning"
                                         >${this.charCountText.length} / 250 characters</span
                                      >`
                                       : html`${this.charCountText.length} / 250 characters`
                                 }
                              </span>
                              ${
                                 this.charCountText.length > 0
                                    ? Button({
                                         variant: "outline",
                                         size: "sm",
                                         onClick: () => {
                                            this.charCountText = "";
                                         },
                                         children: html`${icon(RefreshCw, "xs")} Clear`,
                                      })
                                    : ""
                              }
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`import { Textarea, Button, icon } from "@mariozechner/mini-lit";
import { RefreshCw } from "lucide";

@state() charCountText = "";

<div>
  \${Textarea({
    value: this.charCountText,
    placeholder: "Write your message here...",
    label: "Message",
    maxLength: 250,
    rows: 4,
    onInput: (e: any) => {
      this.charCountText = e.target.value;
    }
  })}
  <div class="flex justify-between items-center mt-2">
    <span class="text-sm text-muted-foreground">
      \${this.charCountText.length} / 250 characters
    </span>
    \${Button({
      variant: "outline",
      size: "sm",
      onClick: () => { this.charCountText = ""; },
      children: html\`\${icon(RefreshCw, "xs")} Clear\`
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
                        ${Textarea({
                           value: this.interactiveText,
                           placeholder: "Type something to see it update below...",
                           label: "Live Preview",
                           rows: 4,
                           onInput: (e: any) => {
                              this.interactiveText = e.target.value;
                           },
                        })}
                        ${
                           this.interactiveText
                              ? html`
                                <div class="p-4 border border-border rounded-md bg-muted/30">
                                   <h4 class="text-sm font-medium mb-2">Preview:</h4>
                                   <p class="whitespace-pre-wrap text-sm">${this.interactiveText}</p>
                                </div>
                             `
                              : ""
                        }
                     </div>
                  `}
                  code=${`import { Textarea } from "@mariozechner/mini-lit";

@state() interactiveText = "";

\${Textarea({
  value: this.interactiveText,
  placeholder: "Type something...",
  label: "Live Preview",
  rows: 4,
  onInput: (e: any) => {
    this.interactiveText = e.target.value;
  }
})}

// Show preview when there's text
\${this.interactiveText ? html\`
  <div class="p-4 border rounded">
    <h4>Preview:</h4>
    <p>\${this.interactiveText}</p>
  </div>
\` : ''}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Form Examples -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Form Examples</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <!-- Comment Form -->
                        <div class="space-y-2">
                           <h3 class="text-lg font-medium flex items-center gap-2">
                              ${icon(MessageSquare, "sm")} Leave a Comment
                           </h3>
                           <div class="space-y-4 max-w-lg">
                              ${Textarea({
                                 placeholder: "Share your thoughts...",
                                 label: "Comment",
                                 required: true,
                                 rows: 4,
                              })}
                              <div class="flex gap-2">
                                 ${Button({ variant: "outline", children: "Cancel" })}
                                 ${Button({
                                    children: html`${icon(MessageSquare, "sm")} Post Comment`,
                                 })}
                              </div>
                           </div>
                        </div>

                        ${Separator()}

                        <!-- Feedback Form -->
                        <div class="space-y-2">
                           <h3 class="text-lg font-medium flex items-center gap-2">
                              ${icon(Edit3, "sm")} Feedback Form
                           </h3>
                           <div class="space-y-4 max-w-lg">
                              ${Textarea({
                                 placeholder: "Tell us what you think about our service...",
                                 label: "Your Feedback",
                                 rows: 5,
                              })}
                              <div class="flex items-center justify-between">
                                 <span class="text-sm text-muted-foreground">
                                    ${icon(AlertCircle, "xs", "inline mr-1")} All feedback is anonymous
                                 </span>
                                 ${Button({
                                    variant: "default",
                                    children: html`${icon(Save, "sm")} Submit Feedback`,
                                 })}
                              </div>
                           </div>
                        </div>

                        ${Separator()}

                        <!-- Description with Actions -->
                        <div class="space-y-2">
                           <h3 class="text-lg font-medium flex items-center gap-2">
                              ${icon(FileText, "sm")} Project Description
                           </h3>
                           <div class="space-y-4 max-w-lg">
                              ${Textarea({
                                 value: "This is a sample project description. You can edit this text to update the project details.",
                                 label: "Description",
                                 rows: 6,
                              })}
                              <div class="flex gap-2">
                                 ${Button({
                                    variant: "outline",
                                    size: "sm",
                                    children: html`${icon(Copy, "xs")} Copy`,
                                 })}
                                 ${Button({
                                    variant: "outline",
                                    size: "sm",
                                    children: html`${icon(RefreshCw, "xs")} Reset`,
                                 })}
                                 ${Button({
                                    size: "sm",
                                    children: html`${icon(Save, "xs")} Save Changes`,
                                 })}
                              </div>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`import { Textarea, Button, icon } from "@mariozechner/mini-lit";
import { MessageSquare, Save, Copy, RefreshCw } from "lucide";

// Comment form
<div class="space-y-4">
  \${Textarea({
    placeholder: "Share your thoughts...",
    label: "Comment",
    required: true,
    rows: 4
  })}
  <div class="flex gap-2">
    \${Button({ variant: "outline", children: "Cancel" })}
    \${Button({
      children: html\`\${icon(MessageSquare, "sm")} Post Comment\`
    })}
  </div>
</div>

// Feedback form
<div class="space-y-4">
  \${Textarea({
    placeholder: "Tell us what you think...",
    label: "Your Feedback",
    rows: 5
  })}
  \${Button({
    children: html\`\${icon(Save, "sm")} Submit Feedback\`
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
                     <h3 class="text-lg font-semibold mb-2">Textarea Properties</h3>
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
                                 <td class="py-2 pr-4">value</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Textarea value</td>
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
                                 <td class="py-2 font-sans">Disables the textarea when true</td>
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
                                 <td class="py-2 pr-4">rows</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">4</td>
                                 <td class="py-2 font-sans">Number of visible text rows</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">cols</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Number of visible text columns</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">maxLength</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Maximum character limit</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">resize</td>
                                 <td class="py-2 pr-4 text-muted-foreground">
                                    "none" | "both" | "horizontal" | "vertical"
                                 </td>
                                 <td class="py-2 pr-4 text-muted-foreground">"vertical"</td>
                                 <td class="py-2 font-sans">Resize behavior</td>
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

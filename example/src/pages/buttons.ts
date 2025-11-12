import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { icon } from "@mariozechner/mini-lit/dist/icons.js";
import { Separator } from "@mariozechner/mini-lit/dist/Separator.js";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ArrowRight, Copy, Download, Edit, Heart, Mail, Save, Settings, Share, Star, Trash2, Upload } from "lucide";
import "@mariozechner/mini-lit/dist/CodeBlock.js";

@customElement("page-buttons")
export class ButtonsPage extends LitElement {
   @state() loadingStates: { [key: string]: boolean } = {};
   @state() clickCount = 0;

   createRenderRoot() {
      return this;
   }

   private handleClick(buttonName: string) {
      // Simulate loading state
      this.loadingStates = { ...this.loadingStates, [buttonName]: true };
      setTimeout(() => {
         this.loadingStates = { ...this.loadingStates, [buttonName]: false };
      }, 2000);
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Buttons</h1>
               <p class="text-muted-foreground">
                  Interactive button components with multiple variants, sizes, and states.
               </p>
            </div>

            <!-- Basic Variants -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Variants</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex flex-wrap gap-4">
                        ${Button({
                           variant: "default",
                           children: "Default",
                        })}
                        ${Button({
                           variant: "destructive",
                           children: "Destructive",
                        })}
                        ${Button({
                           variant: "outline",
                           children: "Outline",
                        })}
                        ${Button({
                           variant: "secondary",
                           children: "Secondary",
                        })}
                        ${Button({
                           variant: "ghost",
                           children: "Ghost",
                        })}
                        ${Button({
                           variant: "link",
                           children: "Link",
                        })}
                     </div>
                  `}
                  code=${`import { Button } from "@mariozechner/mini-lit";

// Default variant
\${Button({
  variant: "default",
  children: "Default"
})}

// Destructive variant
\${Button({
  variant: "destructive",
  children: "Destructive"
})}

// Outline variant
\${Button({
  variant: "outline",
  children: "Outline"
})}

// Secondary variant
\${Button({
  variant: "secondary",
  children: "Secondary"
})}

// Ghost variant
\${Button({
  variant: "ghost",
  children: "Ghost"
})}

// Link variant
\${Button({
  variant: "link",
  children: "Link"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Sizes -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Sizes</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex flex-wrap gap-4 items-center">
                        ${Button({
                           size: "sm",
                           children: "Small",
                        })}
                        ${Button({
                           size: "md",
                           children: "Medium",
                        })}
                        ${Button({
                           size: "lg",
                           children: "Large",
                        })}
                        ${Button({
                           size: "icon",
                           children: icon(Settings, "sm"),
                        })}
                     </div>
                  `}
                  code=${`import { Button, icon } from "@mariozechner/mini-lit";
import { Settings } from "lucide";

// Small size
\${Button({
  size: "sm",
  children: "Small"
})}

// Medium size (default)
\${Button({
  size: "md",
  children: "Medium"
})}

// Large size
\${Button({
  size: "lg",
  children: "Large"
})}

// Icon size
\${Button({
  size: "icon",
  children: icon(Settings, "sm")
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Icons -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">With Icons</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex flex-wrap gap-4">
                           ${Button({
                              children: html`
                                 ${icon(Mail, "sm")}
                                 <span>Login with Email</span>
                              `,
                           })}
                           ${Button({
                              children: html`
                                 <span>Continue</span>
                                 ${icon(ArrowRight, "sm")}
                              `,
                           })}
                           ${Button({
                              variant: "outline",
                              children: html`
                                 ${icon(Download, "sm")}
                                 <span>Download</span>
                              `,
                           })}
                        </div>

                        <div class="flex flex-wrap gap-4">
                           ${Button({
                              variant: "secondary",
                              children: html`
                                 ${icon(Upload, "sm")}
                                 <span>Upload File</span>
                              `,
                           })}
                           ${Button({
                              variant: "destructive",
                              children: html`
                                 ${icon(Trash2, "sm")}
                                 <span>Delete</span>
                              `,
                           })}
                           ${Button({
                              variant: "ghost",
                              children: html`
                                 ${icon(Share, "sm")}
                                 <span>Share</span>
                              `,
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Button, icon } from "@mariozechner/mini-lit";
import { Mail, ArrowRight, Download, Upload, Trash2, Share } from "lucide";

// Icon on the left
\${Button({
  children: html\`
    \${icon(Mail, "sm")}
    <span>Login with Email</span>
  \`
})}

// Icon on the right
\${Button({
  children: html\`
    <span>Continue</span>
    \${icon(ArrowRight, "sm")}
  \`
})}

// With different variants
\${Button({
  variant: "destructive",
  children: html\`
    \${icon(Trash2, "sm")}
    <span>Delete</span>
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- States -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">States</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex flex-wrap gap-4">
                           ${Button({
                              disabled: true,
                              children: "Disabled",
                           })}
                           ${Button({
                              variant: "outline",
                              disabled: true,
                              children: "Disabled Outline",
                           })}
                           ${Button({
                              variant: "secondary",
                              disabled: true,
                              children: "Disabled Secondary",
                           })}
                        </div>

                        <div class="flex flex-wrap gap-4">
                           ${Button({
                              loading: true,
                              children: "Loading...",
                           })}
                           ${Button({
                              variant: "outline",
                              loading: true,
                              children: "Please wait...",
                           })}
                           ${Button({
                              variant: "secondary",
                              loading: true,
                              children: "Processing...",
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Button } from "@mariozechner/mini-lit";

// Disabled state
\${Button({
  disabled: true,
  children: "Disabled"
})}

// Loading state
\${Button({
  loading: true,
  children: "Loading..."
})}

// Loading with different variant
\${Button({
  variant: "outline",
  loading: true,
  children: "Please wait..."
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Interactive Examples -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Interactive Examples</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex flex-wrap gap-4">
                           ${Button({
                              onClick: () => {
                                 this.clickCount++;
                              },
                              children: `Clicked ${this.clickCount} times`,
                           })}
                           ${Button({
                              variant: "outline",
                              loading: this.loadingStates.save,
                              onClick: () => this.handleClick("save"),
                              children: html`
                                 ${icon(Save, "sm")}
                                 <span>${this.loadingStates.save ? "Saving..." : "Save Changes"}</span>
                              `,
                           })}
                           ${Button({
                              variant: "secondary",
                              loading: this.loadingStates.load,
                              onClick: () => this.handleClick("load"),
                              children: this.loadingStates.load ? "Loading..." : "Load More",
                           })}
                        </div>

                        <div class="flex flex-wrap gap-4">
                           ${Button({
                              variant: "destructive",
                              loading: this.loadingStates.delete,
                              onClick: () => this.handleClick("delete"),
                              children: html`
                                 ${icon(Trash2, "sm")}
                                 <span>${this.loadingStates.delete ? "Deleting..." : "Delete Item"}</span>
                              `,
                           })}
                           ${Button({
                              variant: "default",
                              loading: this.loadingStates.submit,
                              onClick: () => this.handleClick("submit"),
                              children: this.loadingStates.submit ? "Submitting..." : "Submit Form",
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Button, icon } from "@mariozechner/mini-lit";
import { Save, Trash2 } from "lucide";

// Counter button
\${Button({
  onClick: () => {
    this.clickCount++;
  },
  children: \`Clicked \${this.clickCount} times\`
})}

// Button with loading state
\${Button({
  variant: "outline",
  loading: this.isLoading,
  onClick: () => this.handleSave(),
  children: html\`
    \${icon(Save, "sm")}
    <span>\${this.isLoading ? 'Saving...' : 'Save Changes'}</span>
  \`
})}

// Delete with confirmation
\${Button({
  variant: "destructive",
  loading: this.isDeleting,
  onClick: () => this.handleDelete(),
  children: html\`
    \${icon(Trash2, "sm")}
    <span>\${this.isDeleting ? 'Deleting...' : 'Delete Item'}</span>
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Button Groups -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Button Groups</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex gap-2">
                           ${Button({
                              variant: "outline",
                              children: "Previous",
                           })}
                           ${Button({
                              variant: "outline",
                              children: "1",
                           })}
                           ${Button({
                              variant: "default",
                              children: "2",
                           })}
                           ${Button({
                              variant: "outline",
                              children: "3",
                           })}
                           ${Button({
                              variant: "outline",
                              children: "Next",
                           })}
                        </div>

                        <div class="flex gap-2">
                           ${Button({
                              variant: "secondary",
                              size: "sm",
                              children: html`
                                 ${icon(Copy, "xs")}
                                 <span>Copy</span>
                              `,
                           })}
                           ${Button({
                              variant: "secondary",
                              size: "sm",
                              children: html`
                                 ${icon(Edit, "xs")}
                                 <span>Edit</span>
                              `,
                           })}
                           ${Button({
                              variant: "secondary",
                              size: "sm",
                              children: html`
                                 ${icon(Share, "xs")}
                                 <span>Share</span>
                              `,
                           })}
                        </div>

                        <div class="flex gap-1">
                           ${Button({
                              variant: "ghost",
                              size: "icon",
                              children: icon(Heart, "sm"),
                           })}
                           ${Button({
                              variant: "ghost",
                              size: "icon",
                              children: icon(Star, "sm"),
                           })}
                           ${Button({
                              variant: "ghost",
                              size: "icon",
                              children: icon(Share, "sm"),
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { Button, icon } from "@mariozechner/mini-lit";
import { Copy, Edit, Share, Heart, Star } from "lucide";

// Pagination group
<div class="flex gap-2">
  \${Button({ variant: "outline", children: "Previous" })}
  \${Button({ variant: "outline", children: "1" })}
  \${Button({ variant: "default", children: "2" })}
  \${Button({ variant: "outline", children: "3" })}
  \${Button({ variant: "outline", children: "Next" })}
</div>

// Action group
<div class="flex gap-2">
  \${Button({
    variant: "secondary",
    size: "sm",
    children: html\`
      \${icon(Copy, "xs")}
      <span>Copy</span>
    \`
  })}
  \${Button({
    variant: "secondary",
    size: "sm",
    children: html\`
      \${icon(Edit, "xs")}
      <span>Edit</span>
    \`
  })}
</div>

// Icon group
<div class="flex gap-1">
  \${Button({ variant: "ghost", size: "icon", children: icon(Heart, "sm") })}
  \${Button({ variant: "ghost", size: "icon", children: icon(Star, "sm") })}
  \${Button({ variant: "ghost", size: "icon", children: icon(Share, "sm") })}
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Button Properties</h3>
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
                                 <td class="py-2 pr-4">variant</td>
                                 <td class="py-2 pr-4 text-muted-foreground">
                                    "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
                                 </td>
                                 <td class="py-2 pr-4 text-muted-foreground">"default"</td>
                                 <td class="py-2 font-sans">Visual style of the button</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">size</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"sm" | "md" | "lg" | "icon"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"md"</td>
                                 <td class="py-2 font-sans">Size of the button</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">disabled</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Disables the button when true</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">loading</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Shows loading spinner when true</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">onClick</td>
                                 <td class="py-2 pr-4 text-muted-foreground">() => void</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Click event handler</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">children</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Button content</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">type</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"button" | "submit" | "reset"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"button"</td>
                                 <td class="py-2 font-sans">HTML button type</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">title</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Tooltip text</td>
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

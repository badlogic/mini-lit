import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { Badge, Button, icon, Separator } from "@mariozechner/mini-lit";
import { AlertTriangle, Check, Crown, Shield, Star, Tag, Users, X, Zap } from "lucide";

@customElement("page-badges")
export class BadgesPage extends LitElement {
   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Badges</h1>
               <p class="text-muted-foreground">
                  Small status indicators and labels with multiple variants and customizable content.
               </p>
            </div>

            <!-- Basic Variants -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Badge Variants</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex flex-wrap gap-2">
                        ${Badge({ variant: "default", children: "Default" })}
                        ${Badge({ variant: "secondary", children: "Secondary" })}
                        ${Badge({ variant: "destructive", children: "Destructive" })}
                        ${Badge({ variant: "outline", children: "Outline" })}
                     </div>
                  `}
                  code=${`import { Badge } from "@mariozechner/mini-lit";

// Default variant
\${Badge({ children: "Default" })}

// Secondary variant
\${Badge({ variant: "secondary", children: "Secondary" })}

// Destructive variant
\${Badge({ variant: "destructive", children: "Destructive" })}

// Outline variant
\${Badge({ variant: "outline", children: "Outline" })}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Icons -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Badges with Icons</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex flex-wrap gap-3">
                           ${Badge({
                              children: html`${icon(Check, "xs", "inline mr-1")} Verified`,
                           })}
                           ${Badge({
                              variant: "secondary",
                              children: html`${icon(Star, "xs", "inline mr-1")} Featured`,
                           })}
                           ${Badge({
                              variant: "destructive",
                              children: html`${icon(X, "xs", "inline mr-1")} Error`,
                           })}
                           ${Badge({
                              variant: "outline",
                              children: html`${icon(AlertTriangle, "xs", "inline mr-1")} Warning`,
                           })}
                        </div>

                        <div class="flex flex-wrap gap-3">
                           ${Badge({
                              children: html`Premium ${icon(Crown, "xs", "inline ml-1")}`,
                           })}
                           ${Badge({
                              variant: "secondary",
                              children: html`Secure ${icon(Shield, "xs", "inline ml-1")}`,
                           })}
                           ${Badge({
                              variant: "outline",
                              children: html`Fast ${icon(Zap, "xs", "inline ml-1")}`,
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// With leading icon
\${Badge({
  children: html\`\${icon(Check, "xs", "inline mr-1")} Verified\`
})}

// With trailing icon
\${Badge({
  children: html\`Premium \${icon(Crown, "xs", "inline ml-1")}\`
})}

// Icon only (circular)
\${Badge({
  className: "w-6 h-6 rounded-full p-0 flex items-center justify-center",
  children: icon(Star, "xs")
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Status Indicators -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Status Indicators</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex flex-wrap gap-4">
                        <div class="flex items-center space-x-2">
                           <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                           ${Badge({ variant: "outline", className: "text-green-600", children: "Active" })}
                        </div>
                        <div class="flex items-center space-x-2">
                           <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                           ${Badge({ variant: "outline", className: "text-yellow-600", children: "Pending" })}
                        </div>
                        <div class="flex items-center space-x-2">
                           <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
                           ${Badge({ variant: "outline", className: "text-gray-600", children: "Inactive" })}
                        </div>
                        <div class="flex items-center space-x-2">
                           <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                           ${Badge({ variant: "outline", className: "text-red-600", children: "Error" })}
                        </div>
                     </div>
                  `}
                  code=${`// Status badge with indicator
<div class="flex items-center space-x-2">
  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
  \${Badge({
    variant: "outline",
    className: "text-green-600",
    children: "Active"
  })}
</div>

// Multiple statuses
<div class="flex items-center space-x-2">
  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
  \${Badge({
    variant: "outline",
    className: "text-yellow-600",
    children: "Pending"
  })}
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Notification Badges -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Notification Badges</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex flex-wrap gap-4">
                        <div class="relative inline-flex">
                           ${Button({
                              variant: "secondary",
                              children: "Messages",
                           })}
                           <div
                              class="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
                           >
                              3
                           </div>
                        </div>
                        <div class="relative inline-flex">
                           ${Button({
                              variant: "secondary",
                              children: "Notifications",
                           })}
                           <div
                              class="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center"
                           >
                              12
                           </div>
                        </div>
                        <div class="relative inline-flex">
                           ${Button({
                              variant: "secondary",
                              children: "Updates",
                           })}
                           <div
                              class="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center"
                           >
                              99+
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Notification badge on button
<div class="relative inline-flex">
  \${Button({ variant: "secondary", children: "Messages" })}
  <div class="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
    3
  </div>
</div>

// With larger count
<div class="relative inline-flex">
  \${Button({ variant: "secondary", children: "Updates" })}
  <div class="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center">
    99+
  </div>
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Categories and Tags -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Categories & Tags</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex flex-wrap gap-2">
                           ${Badge({
                              variant: "outline",
                              children: html`${icon(Tag, "xs", "inline mr-1")} Technology`,
                           })}
                           ${Badge({ variant: "outline", children: html`${icon(Tag, "xs", "inline mr-1")} Design` })}
                           ${Badge({ variant: "outline", children: html`${icon(Tag, "xs", "inline mr-1")} Business` })}
                           ${Badge({ variant: "outline", children: html`${icon(Tag, "xs", "inline mr-1")} Marketing` })}
                        </div>

                        <div class="flex items-center justify-between p-4 border border-border rounded-lg">
                           <div>
                              <h4 class="font-medium">User Profile</h4>
                              <p class="text-sm text-muted-foreground">Premium member since 2020</p>
                           </div>
                           <div class="flex gap-2">
                              ${Badge({ children: "PRO" })}
                              ${Badge({
                                 variant: "outline",
                                 children: html`${icon(Users, "xs", "inline mr-1")} Verified`,
                              })}
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Tags with icons
\${Badge({
  variant: "outline",
  children: html\`\${icon(Tag, "xs", "inline mr-1")} Technology\`
})}

// User badges
<div class="flex gap-2">
  \${Badge({ children: "PRO" })}
  \${Badge({
    variant: "outline",
    children: html\`\${icon(Users, "xs", "inline mr-1")} Verified\`
  })}
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Custom Styles -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Custom Styles</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex flex-wrap gap-3 items-center">
                           ${Badge({
                              className: "text-xs px-1.5 py-0.5",
                              children: "Extra Small",
                           })}
                           ${Badge({
                              children: "Default Size",
                           })}
                           ${Badge({
                              className: "text-sm px-3 py-1",
                              children: "Medium",
                           })}
                           ${Badge({
                              className: "text-base px-4 py-1.5",
                              children: "Large",
                           })}
                        </div>

                        <div class="flex flex-wrap gap-2">
                           ${Badge({
                              className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
                              children: "Indigo",
                           })}
                           ${Badge({
                              className: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
                              children: "Teal",
                           })}
                           ${Badge({
                              className: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
                              children: "Rose",
                           })}
                           ${Badge({
                              className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
                              children: "Amber",
                           })}
                        </div>

                        <div class="flex flex-wrap gap-3">
                           ${Badge({
                              className: "rounded-none",
                              children: "Square",
                           })}
                           ${Badge({
                              variant: "secondary",
                              className: "rounded-full px-3",
                              children: "Pill",
                           })}
                           ${Badge({
                              variant: "outline",
                              className: "rounded-lg",
                              children: "Rounded",
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// Size variations
\${Badge({
  className: "text-xs px-1.5 py-0.5",
  children: "Extra Small"
})}

// Custom colors
\${Badge({
  className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  children: "Indigo"
})}

// Custom shapes
\${Badge({
  className: "rounded-full px-3",
  children: "Pill"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Badge Properties</h3>
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
                                    "default" | "secondary" | "destructive" | "outline"
                                 </td>
                                 <td class="py-2 pr-4 text-muted-foreground">"default"</td>
                                 <td class="py-2 font-sans">Visual style variant</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">children</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string | number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Badge content</td>
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

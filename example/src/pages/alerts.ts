import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { Alert, AlertDescription, AlertTitle, icon, Separator } from "@mariozechner/mini-lit";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide";

@customElement("page-alerts")
export class AlertsPage extends LitElement {
   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Alerts</h1>
               <p class="text-muted-foreground">
                  Display important messages and notifications to users with various styles and layouts.
               </p>
            </div>

            <!-- Basic Alerts -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Alerts</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Alert({
                           children: html`
                              ${AlertTitle({ children: "Default Alert" })}
                              ${AlertDescription({ children: "This is a default alert with standard styling." })}
                           `,
                        })}
                        ${Alert({
                           variant: "destructive",
                           children: html`
                              ${AlertTitle({ children: "Error!" })}
                              ${AlertDescription({ children: "Something went wrong. Please try again later." })}
                           `,
                        })}
                     </div>
                  `}
                  code=${`import { Alert, AlertTitle, AlertDescription } from "@mariozechner/mini-lit";

// Default alert
\${Alert({
  children: html\`
    \${AlertTitle({ children: "Default Alert" })}
    \${AlertDescription({ children: "This is a default alert." })}
  \`
})}

// Destructive variant
\${Alert({
  variant: "destructive",
  children: html\`
    \${AlertTitle({ children: "Error!" })}
    \${AlertDescription({ children: "Something went wrong." })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Icons -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Alerts with Icons</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Alert({
                           children: html`
                              <div class="flex items-start gap-3">
                                 ${icon(Info, "sm", "flex-shrink-0 mt-0.5")}
                                 <div>
                                    ${AlertTitle({ children: "Information" })}
                                    ${AlertDescription({ children: "This is an informational alert message." })}
                                 </div>
                              </div>
                           `,
                        })}
                        ${Alert({
                           className: "border-green-500 bg-green-50 dark:bg-green-900/20",
                           children: html`
                              <div class="flex items-start gap-3">
                                 ${icon(CheckCircle, "sm", "flex-shrink-0 mt-0.5 text-green-600")}
                                 <div>
                                    ${AlertTitle({ children: "Success!" })}
                                    ${AlertDescription({ children: "Your changes have been saved successfully." })}
                                 </div>
                              </div>
                           `,
                        })}
                        ${Alert({
                           className: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
                           children: html`
                              <div class="flex items-start gap-3">
                                 ${icon(AlertTriangle, "sm", "flex-shrink-0 mt-0.5 text-yellow-600")}
                                 <div>
                                    ${AlertTitle({ children: "Warning" })}
                                    ${AlertDescription({ children: "Please review your input before proceeding." })}
                                 </div>
                              </div>
                           `,
                        })}
                        ${Alert({
                           variant: "destructive",
                           children: html`
                              <div class="flex items-start gap-3">
                                 ${icon(XCircle, "sm", "flex-shrink-0 mt-0.5")}
                                 <div>
                                    ${AlertTitle({ children: "Error" })}
                                    ${AlertDescription({ children: "Failed to process your request." })}
                                 </div>
                              </div>
                           `,
                        })}
                     </div>
                  `}
                  code=${`// Info alert with icon
\${Alert({
  children: html\`
    <div class="flex items-start gap-3">
      \${icon(Info, "sm", "flex-shrink-0 mt-0.5")}
      <div>
        \${AlertTitle({ children: "Information" })}
        \${AlertDescription({ children: "Alert message here." })}
      </div>
    </div>
  \`
})}

// Success alert with custom styling
\${Alert({
  className: "border-green-500 bg-green-50 dark:bg-green-900/20",
  children: html\`
    <div class="flex items-start gap-3">
      \${icon(CheckCircle, "sm", "flex-shrink-0 mt-0.5 text-green-600")}
      <div>
        \${AlertTitle({ children: "Success!" })}
        \${AlertDescription({ children: "Operation completed." })}
      </div>
    </div>
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Complex Content -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Complex Content</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Alert({
                           children: html`
                              ${AlertTitle({ children: "System Update Available" })}
                              ${AlertDescription({
                                 children: html`
                                    <p class="mb-2">Version 2.1.0 is now available with the following improvements:</p>
                                    <ul class="list-disc list-inside space-y-1">
                                       <li>Performance improvements</li>
                                       <li>Bug fixes and stability updates</li>
                                       <li>New features and enhancements</li>
                                    </ul>
                                 `,
                              })}
                           `,
                        })}
                        ${Alert({
                           className: "border-border",
                           children: html`
                              ${AlertTitle({ children: "Pro Tip" })}
                              ${AlertDescription({
                                 children: html`
                                    <p class="mb-2">You can customize alerts with:</p>
                                    <div class="flex gap-2 mt-2">
                                       <code class="text-xs px-2 py-1 bg-muted rounded">variant</code>
                                       <code class="text-xs px-2 py-1 bg-muted rounded">className</code>
                                       <code class="text-xs px-2 py-1 bg-muted rounded">children</code>
                                    </div>
                                 `,
                              })}
                           `,
                        })}
                     </div>
                  `}
                  code=${`// Alert with list content
\${Alert({
  children: html\`
    \${AlertTitle({ children: "System Update Available" })}
    \${AlertDescription({
      children: html\`
        <p class="mb-2">Version 2.1.0 includes:</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Performance improvements</li>
          <li>Bug fixes</li>
          <li>New features</li>
        </ul>
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Alert Properties</h3>
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
                                 <td class="py-2 pr-4 text-muted-foreground">"default" | "destructive"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"default"</td>
                                 <td class="py-2 font-sans">Visual style variant</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">children</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Alert content</td>
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
                     <h3 class="text-lg font-semibold mb-2">Related Components</h3>
                     <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                           <thead>
                              <tr class="border-b border-border">
                                 <th class="text-left py-2 pr-4">Component</th>
                                 <th class="text-left py-2">Purpose</th>
                              </tr>
                           </thead>
                           <tbody class="font-mono">
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">AlertTitle</td>
                                 <td class="py-2 font-sans">Alert heading text</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">AlertDescription</td>
                                 <td class="py-2 font-sans">Alert body content</td>
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

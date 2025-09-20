import { icon, Separator, SidebarItem, SidebarSection } from "@mariozechner/mini-lit";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { Bell, CreditCard, Home, Package, Settings, ShoppingCart, User } from "lucide";
import "@mariozechner/mini-lit/dist/PreviewCode.js";

@customElement("page-sidebar")
export class PageSidebar extends LitElement {
   protected createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Sidebar</h1>
               <p class="text-muted-foreground">
                  A responsive navigation sidebar with mobile toggle, sections, and customizable content.
               </p>
            </div>

            <!-- Basic Sidebar -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Sidebar</h2>

               <preview-code
                  .preview=${html`
                     <div class="bg-card border border-border rounded-lg overflow-hidden h-64">
                        <div class="flex h-full">
                           <div class="w-64 border-r border-border p-4 bg-muted/10 overflow-y-auto">
                              <div class="space-y-4">
                                 <div class="pb-4 border-b border-border">
                                    <h3 class="text-lg font-bold">My App</h3>
                                    <p class="text-sm text-muted-foreground">Dashboard</p>
                                 </div>
                                 <div class="space-y-1">
                                    ${SidebarItem({
                                       children: html`<span class="flex items-center gap-2"
                                          >${icon(Home, "sm")} Home</span
                                       >`,
                                       active: true,
                                    })}
                                    ${SidebarItem({
                                       children: html`<span class="flex items-center gap-2"
                                          >${icon(Package, "sm")} Products</span
                                       >`,
                                    })}
                                    ${SidebarItem({
                                       children: html`<span class="flex items-center gap-2"
                                          >${icon(ShoppingCart, "sm")} Orders</span
                                       >`,
                                    })}
                                    ${SidebarItem({
                                       children: html`<span class="flex items-center gap-2"
                                          >${icon(User, "sm")} Profile</span
                                       >`,
                                    })}
                                    ${SidebarItem({
                                       children: html`<span class="flex items-center gap-2"
                                          >${icon(Settings, "sm")} Settings</span
                                       >`,
                                    })}
                                 </div>
                              </div>
                           </div>
                           <div class="flex-1 p-6">
                              <div class="text-muted-foreground">Main content area</div>
                           </div>
                        </div>
                     </div>
                  `}
                  .code=${`import { SidebarItem } from '@mariozechner/mini-lit';
import { Home, Package, ShoppingCart, User, Settings } from 'lucide';
import { icon } from '@mariozechner/mini-lit';

<mini-sidebar
  .logo=\${sidebarLogo}
  .content=\${sidebarContent}
  breakpoint="md"
>
</mini-sidebar>

const sidebarLogo = html\`
  <h3 class="text-lg font-bold">My App</h3>
  <p class="text-sm text-muted-foreground">Dashboard</p>
\`;

const sidebarContent = html\`
  \${SidebarItem({
    children: html\`<span class="flex items-center gap-2">\${icon(Home, "sm")} Home</span>\`,
    active: true
  })}
  \${SidebarItem({
    children: html\`<span class="flex items-center gap-2">\${icon(Package, "sm")} Products</span>\`
  })}
  \${SidebarItem({
    children: html\`<span class="flex items-center gap-2">\${icon(ShoppingCart, "sm")} Orders</span>\`
  })}
  \${SidebarItem({
    children: html\`<span class="flex items-center gap-2">\${icon(User, "sm")} Profile</span>\`
  })}
  \${SidebarItem({
    children: html\`<span class="flex items-center gap-2">\${icon(Settings, "sm")} Settings</span>\`
  })}
\`;`}
               ></preview-code>
            </section>

            <!-- With Sections -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">With Sections</h2>

               <preview-code
                  .preview=${html`
                     <div class="bg-card border border-border rounded-lg overflow-hidden h-80">
                        <div class="flex h-full">
                           <div class="w-64 border-r border-border p-4 bg-muted/10 overflow-y-auto">
                              <div class="space-y-4">
                                 ${SidebarItem({
                                    children: html`<span class="flex items-center gap-2"
                                       >${icon(Home, "sm")} Home</span
                                    >`,
                                    active: true,
                                 })}
                                 ${SidebarSection({
                                    title: "Main",
                                    children: html`
                                       ${SidebarItem({
                                          children: html`<span class="flex items-center gap-2"
                                             >${icon(Package, "sm")} Products</span
                                          >`,
                                       })}
                                       ${SidebarItem({
                                          children: html`<span class="flex items-center gap-2"
                                             >${icon(ShoppingCart, "sm")} Orders</span
                                          >`,
                                       })}
                                       ${SidebarItem({
                                          children: html`<span class="flex items-center gap-2"
                                             >${icon(CreditCard, "sm")} Billing</span
                                          >`,
                                       })}
                                    `,
                                 })}
                                 ${SidebarSection({
                                    title: "Account",
                                    children: html`
                                       ${SidebarItem({
                                          children: html`<span class="flex items-center gap-2"
                                             >${icon(User, "sm")} Profile</span
                                          >`,
                                       })}
                                       ${SidebarItem({
                                          children: html`<span class="flex items-center gap-2"
                                             >${icon(Bell, "sm")} Notifications</span
                                          >`,
                                       })}
                                       ${SidebarItem({
                                          children: html`<span class="flex items-center gap-2"
                                             >${icon(Settings, "sm")} Settings</span
                                          >`,
                                       })}
                                    `,
                                 })}
                              </div>
                           </div>
                           <div class="flex-1 p-6">
                              <div class="text-muted-foreground">Main content area</div>
                           </div>
                        </div>
                     </div>
                  `}
                  .code=${`import { SidebarItem, SidebarSection } from '@mariozechner/mini-lit';

const sidebarContent = html\`
  \${SidebarItem({
    children: html\`<span class="flex items-center gap-2">\${icon(Home, "sm")} Home</span>\`,
    active: true
  })}

  \${SidebarSection({
    title: "Main",
    children: html\`
      \${SidebarItem({
        children: html\`<span class="flex items-center gap-2">\${icon(Package, "sm")} Products</span>\`
      })}
      \${SidebarItem({
        children: html\`<span class="flex items-center gap-2">\${icon(ShoppingCart, "sm")} Orders</span>\`
      })}
      \${SidebarItem({
        children: html\`<span class="flex items-center gap-2">\${icon(CreditCard, "sm")} Billing</span>\`
      })}
    \`
  })}

  \${SidebarSection({
    title: "Account",
    children: html\`
      \${SidebarItem({
        children: html\`<span class="flex items-center gap-2">\${icon(User, "sm")} Profile</span>\`
      })}
      \${SidebarItem({
        children: html\`<span class="flex items-center gap-2">\${icon(Bell, "sm")} Notifications</span>\`
      })}
      \${SidebarItem({
        children: html\`<span class="flex items-center gap-2">\${icon(Settings, "sm")} Settings</span>\`
      })}
    \`
  })}
\`;`}
               ></preview-code>
            </section>

            <!-- With Separators -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">With Separators</h2>

               <preview-code
                  .preview=${html`
                     <div class="bg-card border border-border rounded-lg overflow-hidden h-80">
                        <div class="flex h-full">
                           <div class="w-64 border-r border-border p-4 bg-muted/10 overflow-y-auto">
                              <div class="space-y-4">
                                 ${SidebarItem({
                                    children: html`<span class="flex items-center gap-2"
                                       >${icon(Home, "sm")} Dashboard</span
                                    >`,
                                    active: true,
                                 })}
                                 ${Separator({ className: "my-2" })}
                                 ${SidebarSection({
                                    title: "Navigation",
                                    children: html`
                                       ${SidebarItem({ children: "Analytics" })} ${SidebarItem({ children: "Reports" })}
                                       ${SidebarItem({ children: "Insights" })}
                                    `,
                                 })}
                                 ${Separator({ className: "my-2" })}
                                 ${SidebarSection({
                                    title: "Tools",
                                    children: html`
                                       ${SidebarItem({ children: "Import" })} ${SidebarItem({ children: "Export" })}
                                       ${SidebarItem({ children: "API" })}
                                    `,
                                 })}
                              </div>
                           </div>
                           <div class="flex-1 p-6">
                              <div class="text-muted-foreground">Main content area</div>
                           </div>
                        </div>
                     </div>
                  `}
                  .code=${`import { SidebarItem, SidebarSection, Separator } from '@mariozechner/mini-lit';

const sidebarContent = html\`
  \${SidebarItem({
    children: html\`<span class="flex items-center gap-2">\${icon(Home, "sm")} Dashboard</span>\`,
    active: true
  })}

  \${Separator({ className: "my-2" })}

  \${SidebarSection({
    title: "Navigation",
    children: html\`
      \${SidebarItem({ children: "Analytics" })}
      \${SidebarItem({ children: "Reports" })}
      \${SidebarItem({ children: "Insights" })}
    \`
  })}

  \${Separator({ className: "my-2" })}

  \${SidebarSection({
    title: "Tools",
    children: html\`
      \${SidebarItem({ children: "Import" })}
      \${SidebarItem({ children: "Export" })}
      \${SidebarItem({ children: "API" })}
    \`
  })}
\`;`}
               ></preview-code>
            </section>

            <!-- Simple Navigation -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Simple Navigation</h2>

               <preview-code
                  .preview=${html`
                     <div class="bg-card border border-border rounded-lg overflow-hidden h-48">
                        <div class="flex h-full">
                           <div class="w-64 border-r border-border p-4 bg-muted/10">
                              <div class="space-y-1">
                                 ${SidebarItem({ children: "Home", active: true })}
                                 ${SidebarItem({ children: "About" })} ${SidebarItem({ children: "Services" })}
                                 ${SidebarItem({ children: "Portfolio" })} ${SidebarItem({ children: "Contact" })}
                              </div>
                           </div>
                           <div class="flex-1 p-6">
                              <div class="text-muted-foreground">Main content area</div>
                           </div>
                        </div>
                     </div>
                  `}
                  .code=${`import { SidebarItem } from '@mariozechner/mini-lit';

const sidebarContent = html\`
  \${SidebarItem({ children: "Home", active: true })}
  \${SidebarItem({ children: "About" })}
  \${SidebarItem({ children: "Services" })}
  \${SidebarItem({ children: "Portfolio" })}
  \${SidebarItem({ children: "Contact" })}
\`;`}
               ></preview-code>
            </section>

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Sidebar Component</h3>
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
                                 <td class="py-2 pr-4">default-open</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Initial open state on mobile</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">breakpoint</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"sm" | "md" | "lg" | "xl"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"md"</td>
                                 <td class="py-2 font-sans">Responsive breakpoint</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">logo</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Header/logo content</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">content</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Main navigation content</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">footer</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Footer content</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">SidebarItem</h3>
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
                                 <td class="py-2 pr-4">href</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">undefined</td>
                                 <td class="py-2 font-sans">Link URL (renders as anchor)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">active</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Active/selected state</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">onClick</td>
                                 <td class="py-2 pr-4 text-muted-foreground">() => void</td>
                                 <td class="py-2 pr-4 text-muted-foreground">undefined</td>
                                 <td class="py-2 font-sans">Click handler</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">children</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Item content</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">SidebarSection</h3>
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
                                 <td class="py-2 pr-4 text-muted-foreground">undefined</td>
                                 <td class="py-2 font-sans">Section title</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">children</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult | string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Section items</td>
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

import { Badge } from "@mariozechner/mini-lit/dist/Badge.js";
import { Button } from "@mariozechner/mini-lit/dist/Button.js";
import { Card, CardContent, CardHeader, CardTitle } from "@mariozechner/mini-lit/dist/Card.js";
import { icon } from "@mariozechner/mini-lit/dist/icons.js";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import {
   Code,
   FileText,
   Layout,
   MessageSquare,
   MousePointer,
   Package,
   Palette,
   Settings,
   Sparkles,
   Type,
} from "lucide";

declare global {
   const __MINI_LIT_VERSION__: string;
}

@customElement("page-home")
export class HomePage extends LitElement {
   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-4xl mx-auto">
            <div class="mb-8 text-center">
               <div class="flex items-center justify-center gap-3 mb-4">
                  ${icon(Sparkles, "xl", "text-primary")}
                  <h1 class="text-6xl font-black tracking-tight">mini-lit</h1>
                  ${icon(Sparkles, "xl", "text-primary")}
               </div>
               <p class="text-lg text-muted-foreground mb-6">
                  Lightweight Lit components with shadcn-inspired theming, Tailwind CSS v4 styling, and Lucide icons.
               </p>
               <div class="flex gap-2 justify-center">
                  ${Badge({ variant: "default", children: `v${__MINI_LIT_VERSION__}` })}
                  ${Badge({ variant: "secondary", children: "MIT License" })}
               </div>
            </div>

            <!-- Quick Start -->
            <section class="mb-12">
               <h2 class="text-2xl font-semibold mb-4">Quick Start</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-medium mb-2">1. Installation</h3>
                     <code-block .code=${"npm install lit @mariozechner/mini-lit"} language="bash"></code-block>
                  </div>

                  <div>
                     <h3 class="text-lg font-medium mb-2">2. Setup Tailwind CSS v4</h3>

                     <div class="space-y-4">
                        <div class="space-y-4">
                           <h4 class="text-sm text-muted-foreground mb-2">Option A: Vite Plugin (Recommended)</h4>
                           <code-block
                              .code=${`npm install -D @tailwindcss/vite

// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()]
})`}
                              language="typescript"
                           ></code-block>
                        </div>
                        <div class="space-y-4">
                           <h4 class="text-sm text-muted-foreground mb-2">Option B: Tailwind CLI</h4>
                           <code-block
                              .code=${`npm install -D @tailwindcss/cli

// package.json scripts
"scripts": {
  "dev": "tailwindcss -i ./src/app.css -o ./dist/app.css --watch",
  "build": "tailwindcss -i ./src/app.css -o ./dist/app.css --minify"
}`}
                              language="json"
                           ></code-block>
                        </div>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-medium mb-2">3. Configure TypeScript (Important!)</h3>
                     <div class="p-4 mb-4 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p class="text-sm text-destructive font-medium mb-2">Critical for LitElement Reactivity</p>
                        <p class="text-sm mb-3">
                           When using LitElement components with decorators, you <strong>must</strong> set
                           <code class="px-1 py-0.5 bg-muted rounded">useDefineForClassFields: false</code>
                           in your tsconfig.json. Without this, reactive properties won't trigger updates properly.
                        </p>
                     </div>
                     <code-block
                        .code=${`// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,        // Required for decorators
    "useDefineForClassFields": false       // Critical for @state/@property reactivity!
  }
}`}
                        language="json"
                     ></code-block>
                  </div>

                  <div>
                     <h3 class="text-lg font-medium mb-2">4. Configure CSS</h3>
                     <code-block
                        .code=${`/* src/app.css */

/* Import theme (includes dark mode and utilities) */
@import "@mariozechner/mini-lit/styles/themes/default.css";

/* Tell Tailwind to scan mini-lit components */
@source "../node_modules/@mariozechner/mini-lit/dist";

/* Import Tailwind */
@import "tailwindcss";`}
                        language="css"
                     ></code-block>
                  </div>

                  <div>
                     <h3 class="text-lg font-medium mb-2">5. Use Components</h3>
                     <code-block
                        .code=${`import { html, render } from 'lit'
import { Button, Card, Badge, icon } from '@mariozechner/mini-lit'
import { Send } from 'lucide'
import './app.css'

const App = () => html\`
  <div class="p-8 bg-background text-foreground min-h-screen">
    <-- mini-lit components with internal state are full LitElement instances with custom tags-->
    <theme-toggle class="fixed top-4 right-4"></theme-toggle>

    <-- mini-lit components without internal state are functional components returning TemplateResult -->
    \${Card(html\`
      <h1 class="text-2xl font-bold mb-4">Hello mini-lit!</h1>

      \${Button({
        children: html\`
          \${icon(Send, "sm")}
          <span>Send Message</span>
        \`
      })}
    \`)}
  </div>
\`
render(App(), document.body)
`}
                        language="typescript"
                     ></code-block>
                  </div>
               </div>
            </section>

            <!-- Component Gallery -->
            <section class="mb-12">
               <h2 class="text-2xl font-semibold mb-6">Components</h2>

               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Actions -->
                  ${Card({
                     className: "cursor-pointer hover:shadow-md transition-shadow",
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-3">
                                 ${icon(MousePointer, "md")} ${CardTitle({ children: "Actions" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground mb-4">Interactive components for user actions</p>
                              <div class="space-y-2">
                                 <div class="text-sm">
                                    <a href="/buttons" class="text-primary hover:underline">Buttons</a>
                                    <span class="text-muted-foreground"> - All button variants and states</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/copybutton" class="text-primary hover:underline">Copy Button</a>
                                    <span class="text-muted-foreground"> - Copy text to clipboard</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/downloadbutton" class="text-primary hover:underline">Download Button</a>
                                    <span class="text-muted-foreground"> - Download files</span>
                                 </div>
                              </div>
                           `,
                        })}
                     `,
                  })}

                  <!-- Layout -->
                  ${Card({
                     className: "cursor-pointer hover:shadow-md transition-shadow",
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-3">
                                 ${icon(Layout, "md")} ${CardTitle({ children: "Layout" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground mb-4">
                                 Structural components for organizing content
                              </p>
                              <div class="space-y-2">
                                 <div class="text-sm">
                                    <a href="/cards" class="text-primary hover:underline">Cards</a>
                                    <span class="text-muted-foreground"> - Content containers</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/separators" class="text-primary hover:underline">Separators</a>
                                    <span class="text-muted-foreground"> - Visual dividers</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/splitpanel" class="text-primary hover:underline">Split Panel</a>
                                    <span class="text-muted-foreground"> - Resizable layouts</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/dialogs" class="text-primary hover:underline">Dialogs</a>
                                    <span class="text-muted-foreground"> - Modal dialogs</span>
                                 </div>
                              </div>
                           `,
                        })}
                     `,
                  })}

                  <!-- Forms -->
                  ${Card({
                     className: "cursor-pointer hover:shadow-md transition-shadow",
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-3">
                                 ${icon(Type, "md")} ${CardTitle({ children: "Forms" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground mb-4">Input components for data collection</p>
                              <div class="space-y-2">
                                 <div class="text-sm">
                                    <a href="/inputs" class="text-primary hover:underline">Inputs</a>
                                    <span class="text-muted-foreground"> - Text, email, password inputs</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/textareas" class="text-primary hover:underline">Textareas</a>
                                    <span class="text-muted-foreground"> - Multi-line text input</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/selects" class="text-primary hover:underline">Selects</a>
                                    <span class="text-muted-foreground"> - Dropdown selections</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/checkboxes" class="text-primary hover:underline">Checkboxes</a>
                                    <span class="text-muted-foreground"> - Boolean selections</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/switches" class="text-primary hover:underline">Switches</a>
                                    <span class="text-muted-foreground"> - Toggle controls</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/labels" class="text-primary hover:underline">Labels</a>
                                    <span class="text-muted-foreground"> - Form labels</span>
                                 </div>
                              </div>
                           `,
                        })}
                     `,
                  })}

                  <!-- Feedback -->
                  ${Card({
                     className: "cursor-pointer hover:shadow-md transition-shadow",
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-3">
                                 ${icon(MessageSquare, "md")} ${CardTitle({ children: "Feedback" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground mb-4">Components for user feedback and status</p>
                              <div class="space-y-2">
                                 <div class="text-sm">
                                    <a href="/badges" class="text-primary hover:underline">Badges</a>
                                    <span class="text-muted-foreground"> - Status indicators</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/alerts" class="text-primary hover:underline">Alerts</a>
                                    <span class="text-muted-foreground"> - Important messages</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/progress" class="text-primary hover:underline">Progress</a>
                                    <span class="text-muted-foreground"> - Progress indicators</span>
                                 </div>
                              </div>
                           `,
                        })}
                     `,
                  })}

                  <!-- Content -->
                  ${Card({
                     className: "cursor-pointer hover:shadow-md transition-shadow",
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-3">
                                 ${icon(FileText, "md")} ${CardTitle({ children: "Content" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground mb-4">Components for displaying rich content</p>
                              <div class="space-y-2">
                                 <div class="text-sm">
                                    <a href="/codeblock" class="text-primary hover:underline">Code Block</a>
                                    <span class="text-muted-foreground"> - Syntax highlighted code</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/markdown" class="text-primary hover:underline">Markdown</a>
                                    <span class="text-muted-foreground"> - Rendered markdown</span>
                                 </div>
                                 <div class="text-sm">
                                    <a href="/diff" class="text-primary hover:underline">Diff Viewer</a>
                                    <span class="text-muted-foreground"> - Code difference viewer</span>
                                 </div>
                              </div>
                           `,
                        })}
                     `,
                  })}

                  <!-- Utilities -->
                  ${Card({
                     className: "cursor-pointer hover:shadow-md transition-shadow",
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-3">
                                 ${icon(Settings, "md")} ${CardTitle({ children: "Utilities" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground mb-4">Utility components and helpers</p>
                              <div class="space-y-2">
                                 <div class="text-sm">
                                    <a href="/languageselector" class="text-primary hover:underline">i18n & Language</a>
                                    <span class="text-muted-foreground"> - Internationalization</span>
                                 </div>
                              </div>
                           `,
                        })}
                     `,
                  })}
               </div>
            </section>

            <!-- Features -->
            <section class="mb-12">
               <h2 class="text-2xl font-semibold mb-6">Features</h2>

               <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  ${Card({
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-2">
                                 ${icon(Package, "sm")} ${CardTitle({ children: "Two Types of Components" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground">
                                 <strong>Functional components</strong> for stateless UI elements (Button, Card, Badge)
                                 and <strong>Custom elements</strong> for components (theme-toggle, language-selector)
                                 with internal state.
                              </p>
                           `,
                        })}
                     `,
                  })}
                  ${Card({
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-2">
                                 ${icon(Palette, "sm")} ${CardTitle({ children: "shadcn/ui Themes" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground">
                                 Compatible with shadcn/ui design system. Built-in default and Claude themes. Dark mode
                                 support via <code class="text-xs bg-muted px-1 py-0.5 rounded">dark</code> class.
                              </p>
                           `,
                        })}
                     `,
                  })}
                  ${Card({
                     children: html`
                        ${CardHeader({
                           children: html`
                              <div class="flex items-center gap-2">
                                 ${icon(Code, "sm")} ${CardTitle({ children: "TypeScript First" })}
                              </div>
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <p class="text-sm text-muted-foreground">
                                 Full TypeScript support with type definitions. IDE autocomplete for all components and
                                 i18n.
                              </p>
                           `,
                        })}
                     `,
                  })}
               </div>
            </section>

            <!-- Links -->
            <section class="mb-12">
               <h2 class="text-2xl font-semibold mb-4">Resources</h2>

               <div class="flex flex-wrap gap-4">
                  ${Button({
                     variant: "outline",
                     children: html`
                        ${icon(Package, "sm")}
                        <span>npm Package</span>
                     `,
                     onClick: () => window.open("https://www.npmjs.com/package/@mariozechner/mini-lit", "_blank"),
                  })}
                  ${Button({
                     variant: "outline",
                     children: html`
                        ${icon(Code, "sm")}
                        <span>GitHub</span>
                     `,
                     onClick: () => window.open("https://github.com/badlogic/mini-lit", "_blank"),
                  })}
                  ${Button({
                     variant: "outline",
                     children: "shadcn/ui theme generator",
                     onClick: () => window.open("https://tweakcn.com/", "_blank"),
                  })}
                  ${Button({
                     variant: "outline",
                     children: "Lit Documentation",
                     onClick: () => window.open("https://lit.dev", "_blank"),
                  })}
               </div>
            </section>

            <div class="text-center">
               <p class="text-muted-foreground text-sm">
                  Built with
                  <a href="https://lit.dev" class="text-primary hover:underline" target="_blank">Lit</a> and
                  <a href="https://tailwindcss.com" class="text-primary hover:underline" target="_blank"
                     >Tailwind CSS v4</a
                  >
               </p>
               <p class="text-muted-foreground text-sm">
                  Made with duct tape and spit by
                  <a class="text-primary hover:underline" href="https://mariozechner.at" target="_blank"
                     >Mario Zechner</a
                  >
               </p>
            </div>
         </div>
      `;
   }
}

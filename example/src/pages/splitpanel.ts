import { icon } from "@mariozechner/mini-lit";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { Code, File, Folder, Layout, PanelLeft, PanelRight } from "lucide";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import "@mariozechner/mini-lit/dist/SplitPanel.js";

@customElement("page-splitpanel")
export class SplitPanelPage extends LitElement {
   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Split Panel</h1>
               <p class="text-muted-foreground">
                  Resizable split panel component for creating flexible layouts with draggable dividers.
               </p>
            </div>

            <!-- Basic Split Panel -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Horizontal Split</h2>

               <preview-code
                  .preview=${html`
                     <div class="h-64 border border-border rounded-lg overflow-hidden">
                        <split-panel
                           .initialSplit=${50}
                           .minSize=${20}
                           .leftPanel=${html`
                              <div class="h-full p-4 bg-blue-50 dark:bg-blue-950/20">
                                 <h4 class="font-medium mb-2 flex items-center gap-2">
                                    ${icon(PanelLeft, "sm")} Left Panel
                                 </h4>
                                 <p class="text-sm text-muted-foreground">
                                    This is the left panel content. Drag the divider to resize.
                                 </p>
                              </div>
                           `}
                           .rightPanel=${html`
                              <div class="h-full p-4 bg-green-50 dark:bg-green-950/20">
                                 <h4 class="font-medium mb-2 flex items-center gap-2">
                                    ${icon(PanelRight, "sm")} Right Panel
                                 </h4>
                                 <p class="text-sm text-muted-foreground">
                                    This is the right panel content. The panels are resizable.
                                 </p>
                              </div>
                           `}
                        ></split-panel>
                     </div>
                  `}
                  .code=${`import '@mariozechner/mini-lit/dist/SplitPanel.js';

<split-panel
  .initialSplit=\${50}
  .minSize=\${20}
  .leftPanel=\${html\`
    <div class="h-full p-4">
      <h4>Left Panel</h4>
      <p>Left panel content</p>
    </div>
  \`}
  .rightPanel=\${html\`
    <div class="h-full p-4">
      <h4>Right Panel</h4>
      <p>Right panel content</p>
    </div>
  \`}
></split-panel>`}
               ></preview-code>
            </section>

            <!-- Code Editor Layout -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Code Editor Layout</h2>

               <preview-code
                  .preview=${html`
                     <div class="h-80 border border-border rounded-lg overflow-hidden">
                        <split-panel
                           .initialSplit=${25}
                           .minSize=${15}
                           .leftPanel=${html`
                              <div class="h-full flex flex-col bg-muted/30">
                                 <div class="p-3 border-b border-border bg-background">
                                    <h4 class="font-medium text-sm flex items-center gap-2">
                                       ${icon(Folder, "sm")} File Explorer
                                    </h4>
                                 </div>
                                 <div class="flex-1 p-3 overflow-auto">
                                    <div class="space-y-1">
                                       <div
                                          class="flex items-center gap-2 p-1 hover:bg-muted/50 rounded cursor-pointer"
                                       >
                                          ${icon(Folder, "sm", "text-blue-600")}
                                          <span class="text-sm">src</span>
                                       </div>
                                       <div class="ml-4 space-y-1">
                                          <div
                                             class="flex items-center gap-2 p-1 hover:bg-muted/50 rounded cursor-pointer"
                                          >
                                             ${icon(File, "sm", "text-green-600")}
                                             <span class="text-sm">index.ts</span>
                                          </div>
                                          <div
                                             class="flex items-center gap-2 p-1 hover:bg-muted/50 rounded cursor-pointer bg-primary/10"
                                          >
                                             ${icon(File, "sm", "text-green-600")}
                                             <span class="text-sm">app.ts</span>
                                          </div>
                                       </div>
                                       <div
                                          class="flex items-center gap-2 p-1 hover:bg-muted/50 rounded cursor-pointer"
                                       >
                                          ${icon(File, "sm", "text-orange-600")}
                                          <span class="text-sm">package.json</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           `}
                           .rightPanel=${html`
                              <div class="h-full flex flex-col">
                                 <div class="flex items-center justify-between p-3 border-b border-border">
                                    <div class="flex items-center gap-2">
                                       ${icon(File, "sm", "text-green-600")}
                                       <span class="text-sm font-medium">app.ts</span>
                                    </div>
                                 </div>
                                 <div class="flex-1 p-4 bg-background">
                                    <pre class="text-sm font-mono">
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55</pre
                                    >
                                 </div>
                              </div>
                           `}
                        ></split-panel>
                     </div>
                  `}
                  .code=${`<split-panel
  .initialSplit=\${25}
  .minSize=\${15}
  .leftPanel=\${renderFileExplorer()}
  .rightPanel=\${renderCodeEditor()}
></split-panel>`}
               ></preview-code>
            </section>

            <!-- Different Split Ratios -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Split Ratios</h2>

               <div class="space-y-6">
                  <preview-code
                     .preview=${html`
                        <div class="h-32 border border-border rounded-lg overflow-hidden">
                           <split-panel
                              .initialSplit=${25}
                              .minSize=${10}
                              .leftPanel=${html`
                                 <div
                                    class="h-full p-3 bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center"
                                 >
                                    <span class="text-sm font-medium">25%</span>
                                 </div>
                              `}
                              .rightPanel=${html`
                                 <div
                                    class="h-full p-3 bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center"
                                 >
                                    <span class="text-sm font-medium">75%</span>
                                 </div>
                              `}
                           ></split-panel>
                        </div>
                     `}
                     .code=${`<split-panel
  .initialSplit=\${25}
  .minSize=\${10}
  .leftPanel=\${leftContent}
  .rightPanel=\${rightContent}
></split-panel>`}
                  ></preview-code>

                  <preview-code
                     .preview=${html`
                        <div class="h-32 border border-border rounded-lg overflow-hidden">
                           <split-panel
                              .initialSplit=${70}
                              .minSize=${20}
                              .leftPanel=${html`
                                 <div
                                    class="h-full p-3 bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center"
                                 >
                                    <span class="text-sm font-medium">Main Content (70%)</span>
                                 </div>
                              `}
                              .rightPanel=${html`
                                 <div
                                    class="h-full p-3 bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center"
                                 >
                                    <span class="text-sm font-medium">Sidebar (30%)</span>
                                 </div>
                              `}
                           ></split-panel>
                        </div>
                     `}
                     .code=${`<split-panel
  .initialSplit=\${70}
  .minSize=\${20}
  .leftPanel=\${mainContent}
  .rightPanel=\${sidebar}
></split-panel>`}
                  ></preview-code>
               </div>
            </section>

            <!-- Dashboard Layout -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Dashboard Layout</h2>

               <preview-code
                  .preview=${html`
                     <div class="h-80 border border-border rounded-lg overflow-hidden">
                        <split-panel
                           .initialSplit=${20}
                           .minSize=${15}
                           .leftPanel=${html`
                              <div class="h-full bg-muted/30 p-4">
                                 <h4 class="font-medium mb-3">Navigation</h4>
                                 <nav class="space-y-1">
                                    <a
                                       href="#"
                                       class="flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground"
                                    >
                                       ${icon(Layout, "sm")} Dashboard
                                    </a>
                                    <a
                                       href="#"
                                       class="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted"
                                    >
                                       ${icon(Code, "sm")} Projects
                                    </a>
                                 </nav>
                              </div>
                           `}
                           .rightPanel=${html`
                              <div class="h-full p-6 overflow-auto">
                                 <h3 class="text-lg font-semibold mb-4">Analytics Overview</h3>
                                 <div class="grid grid-cols-2 gap-4">
                                    <div class="p-4 border border-border rounded-lg">
                                       <div class="text-2xl font-bold text-blue-600">1,247</div>
                                       <div class="text-sm text-muted-foreground">Total Users</div>
                                    </div>
                                    <div class="p-4 border border-border rounded-lg">
                                       <div class="text-2xl font-bold text-green-600">$24,580</div>
                                       <div class="text-sm text-muted-foreground">Revenue</div>
                                    </div>
                                 </div>
                              </div>
                           `}
                        ></split-panel>
                     </div>
                  `}
                  .code=${`<split-panel
  .initialSplit=\${20}
  .minSize=\${15}
  .leftPanel=\${renderSidebar()}
  .rightPanel=\${renderDashboard()}
></split-panel>`}
               ></preview-code>
            </section>

            <!-- Vertical Split -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Vertical Split</h2>

               <preview-code
                  .preview=${html`
                     <div class="h-80 border border-border rounded-lg overflow-hidden">
                        <split-panel
                           .vertical=${true}
                           .initialSplit=${40}
                           .minSize=${100}
                           .topPanel=${html`
                              <div class="h-full p-4 bg-blue-50 dark:bg-blue-950/20">
                                 <h4 class="font-medium mb-2">Top Panel</h4>
                                 <p class="text-sm text-muted-foreground">
                                    This is the top panel in a vertical split layout.
                                 </p>
                              </div>
                           `}
                           .bottomPanel=${html`
                              <div class="h-full p-4 bg-green-50 dark:bg-green-950/20">
                                 <h4 class="font-medium mb-2">Bottom Panel</h4>
                                 <p class="text-sm text-muted-foreground">
                                    This is the bottom panel. Drag the horizontal divider to resize.
                                 </p>
                              </div>
                           `}
                        ></split-panel>
                     </div>
                  `}
                  .code=${`<split-panel
  .vertical=\${true}
  .initialSplit=\${40}
  .minSize=\${100}
  .topPanel=\${topContent}
  .bottomPanel=\${bottomContent}
></split-panel>`}
               ></preview-code>
            </section>

            <!-- Terminal Layout -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Terminal Layout</h2>

               <preview-code
                  .preview=${html`
                     <div class="h-80 border border-border rounded-lg overflow-hidden">
                        <split-panel
                           .vertical=${true}
                           .initialSplit=${70}
                           .minSize=${50}
                           .topPanel=${html`
                              <div class="h-full bg-gray-900 text-gray-100 p-4 font-mono text-sm">
                                 <div class="text-green-400">$ npm run dev</div>
                                 <div class="text-gray-400">
                                    <div>> vite dev</div>
                                    <div>VITE v4.5.0 ready in 523 ms</div>
                                    <div>➜ Local: http://localhost:5173/</div>
                                    <div>➜ Network: http://192.168.1.100:5173/</div>
                                 </div>
                              </div>
                           `}
                           .bottomPanel=${html`
                              <div class="h-full bg-gray-800 text-gray-100 p-3 font-mono text-sm">
                                 <div class="text-yellow-400">Problems</div>
                                 <div class="text-gray-400 text-xs mt-2">No problems detected</div>
                              </div>
                           `}
                        ></split-panel>
                     </div>
                  `}
                  .code=${`// Terminal with output/problems panels
<split-panel
  .vertical=\${true}
  .initialSplit=\${70}
  .minSize=\${50}
  .topPanel=\${terminalOutput}
  .bottomPanel=\${problemsPanel}
></split-panel>`}
               ></preview-code>
            </section>

            <!-- Nested Split Panels -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Nested Split Panels</h2>

               <preview-code
                  .preview=${html`
                     <div class="h-96 border border-border rounded-lg overflow-hidden">
                        <split-panel
                           .initialSplit=${25}
                           .minSize=${150}
                           .leftPanel=${html`
                              <div class="h-full bg-slate-50 dark:bg-slate-900/20 p-4">
                                 <h4 class="font-medium mb-3 flex items-center gap-2">${icon(Folder, "sm")} Sidebar</h4>
                                 <nav class="space-y-2 text-sm">
                                    <div class="p-2 bg-primary/10 rounded">Files</div>
                                    <div class="p-2 hover:bg-muted rounded">Search</div>
                                    <div class="p-2 hover:bg-muted rounded">Git</div>
                                    <div class="p-2 hover:bg-muted rounded">Extensions</div>
                                 </nav>
                              </div>
                           `}
                           .rightPanel=${html`
                              <split-panel
                                 .vertical=${true}
                                 .initialSplit=${70}
                                 .minSize=${100}
                                 .topPanel=${html`
                                    <split-panel
                                       .initialSplit=${50}
                                       .minSize=${100}
                                       .leftPanel=${html`
                                          <div class="h-full bg-blue-50 dark:bg-blue-950/20 p-4">
                                             <h4 class="font-medium mb-2 flex items-center gap-2">
                                                ${icon(Code, "sm")} Editor 1
                                             </h4>
                                             <pre class="text-xs font-mono">
function hello() {
  console.log("Hello");
}</pre
                                             >
                                          </div>
                                       `}
                                       .rightPanel=${html`
                                          <div class="h-full bg-green-50 dark:bg-green-950/20 p-4">
                                             <h4 class="font-medium mb-2 flex items-center gap-2">
                                                ${icon(Code, "sm")} Editor 2
                                             </h4>
                                             <pre class="text-xs font-mono">
const world = () => {
  return "World";
};</pre
                                             >
                                          </div>
                                       `}
                                    ></split-panel>
                                 `}
                                 .bottomPanel=${html`
                                    <div class="h-full bg-gray-900 text-gray-100 p-3">
                                       <h4 class="font-medium mb-2 text-sm">Terminal</h4>
                                       <div class="font-mono text-xs">
                                          <div class="text-green-400">$ npm run dev</div>
                                          <div class="text-gray-400">Server running on port 3000...</div>
                                       </div>
                                    </div>
                                 `}
                              ></split-panel>
                           `}
                        ></split-panel>
                     </div>
                  `}
                  .code=${`// IDE-like layout with nested panels
<split-panel
  .initialSplit=\${25}
  .leftPanel=\${renderSidebar()}
  .rightPanel=\${html\`
    <split-panel
      .vertical=\${true}
      .initialSplit=\${70}
      .topPanel=\${html\`
        <split-panel
          .initialSplit=\${50}
          .leftPanel=\${renderEditor1()}
          .rightPanel=\${renderEditor2()}
        ></split-panel>
      \`}
      .bottomPanel=\${renderTerminal()}
    ></split-panel>
  \`}
></split-panel>`}
               ></preview-code>
            </section>

            <!-- Collapsible Panels -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Collapsible Panel</h2>

               <preview-code
                  .preview=${html`
                     <div class="h-48 border border-border rounded-lg overflow-hidden">
                        <split-panel
                           .initialSplit=${30}
                           .minSize=${0}
                           .leftPanel=${html`
                              <div class="h-full p-4 bg-rose-50 dark:bg-rose-950/20">
                                 <h5 class="font-medium text-sm mb-2">Collapsible Panel</h5>
                                 <p class="text-xs text-muted-foreground">
                                    This panel can be collapsed to zero width by dragging all the way.
                                 </p>
                              </div>
                           `}
                           .rightPanel=${html`
                              <div class="h-full p-4 bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center">
                                 <span class="text-sm">Main content area</span>
                              </div>
                           `}
                        ></split-panel>
                     </div>
                  `}
                  .code=${`<split-panel
  .initialSplit=\${30}
  .minSize=\${0}  // Allow collapse to zero
  .leftPanel=\${collapsiblePanel}
  .rightPanel=\${mainContent}
></split-panel>`}
               ></preview-code>
            </section>

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">SplitPanel Properties</h3>
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
                                 <td class="py-2 pr-4">vertical</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Enable vertical split mode</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">leftPanel</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Content for left panel (horizontal mode)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">rightPanel</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Content for right panel (horizontal mode)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">topPanel</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Content for top panel (vertical mode)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">bottomPanel</td>
                                 <td class="py-2 pr-4 text-muted-foreground">TemplateResult</td>
                                 <td class="py-2 pr-4 text-muted-foreground">-</td>
                                 <td class="py-2 font-sans">Content for bottom panel (vertical mode)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">initialSplit</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">50</td>
                                 <td class="py-2 font-sans">Initial split percentage (0-100)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">minSize</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">200</td>
                                 <td class="py-2 font-sans">Minimum panel size in pixels</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">hideRight</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Hide the right/bottom panel</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">hideBottom</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Hide the bottom panel (vertical mode)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">mobileBreakpoint</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">1024</td>
                                 <td class="py-2 font-sans">Pixel width for mobile mode</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">Interaction</h3>
                     <ul class="text-sm text-muted-foreground space-y-1">
                        <li>• Drag the divider to resize panels</li>
                        <li>• Touch support for mobile devices</li>
                        <li>• Respects minimum size constraints (in pixels)</li>
                        <li>• Smooth resize with visual feedback</li>
                     </ul>
                  </div>
               </div>
            </section>
         </div>
      `;
   }
}

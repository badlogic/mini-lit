import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { Diff, Separator } from "@mariozechner/mini-lit";

@customElement("page-diff")
export class DiffPage extends LitElement {
   @state() customOldText = `function greetUser(name) {
  console.log("Hello " + name);
  return name;
}`;

   @state() customNewText = `function greetUser(name, greeting = "Hello") {
  console.log(\`\${greeting}, \${name}!\`);
  return \`\${greeting}, \${name}!\`;
}`;

   createRenderRoot() {
      return this;
   }

   render() {
      const basicOld = `const message = "Hello World";
console.log(message);`;

      const basicNew = `const message = "Hello World!";
console.log(message);
console.log("Program completed");`;

      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Diff Viewer</h1>
               <p class="text-muted-foreground">
                  Display code differences with syntax highlighting and line-by-line comparisons.
               </p>
            </div>

            <!-- Basic Diff -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Diff</h2>

               <preview-code
                  .preview=${html`
                     ${Diff({
                        oldText: basicOld,
                        newText: basicNew,
                     })}
                  `}
                  code=${`import { Diff } from "@mariozechner/mini-lit";

const oldCode = \`const message = "Hello World";
console.log(message);\`;

const newCode = \`const message = "Hello World!";
console.log(message);
console.log("Program completed");\`;

\${Diff({
  oldText: oldCode,
  newText: newCode
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Title -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Diff with Title</h2>

               <preview-code
                  .preview=${html`
                     ${Diff({
                        oldText: this.customOldText,
                        newText: this.customNewText,
                        title: "greetUser.js",
                     })}
                  `}
                  code=${`// Diff with file title
\${Diff({
  oldText: oldFunction,
  newText: newFunction,
  title: "greetUser.js"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Interactive Example -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Interactive Diff</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label class="text-sm font-medium mb-2 block">Old Version:</label>
                              <textarea
                                 class="w-full h-32 p-3 border border-border rounded-md bg-background text-foreground font-mono text-xs"
                                 .value=${this.customOldText}
                                 @input=${(e: Event) => {
                                    this.customOldText = (e.target as HTMLTextAreaElement).value;
                                 }}
                              ></textarea>
                           </div>
                           <div>
                              <label class="text-sm font-medium mb-2 block">New Version:</label>
                              <textarea
                                 class="w-full h-32 p-3 border border-border rounded-md bg-background text-foreground font-mono text-xs"
                                 .value=${this.customNewText}
                                 @input=${(e: Event) => {
                                    this.customNewText = (e.target as HTMLTextAreaElement).value;
                                 }}
                              ></textarea>
                           </div>
                        </div>

                        <div>
                           <label class="text-sm font-medium mb-2 block">Diff Output:</label>
                           ${Diff({
                              oldText: this.customOldText,
                              newText: this.customNewText,
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// Interactive diff viewer
@state() oldText = "original code";
@state() newText = "modified code";

// Template
<div class="grid grid-cols-2 gap-4">
  <textarea
    .value=\${this.oldText}
    @input=\${(e) => this.oldText = e.target.value}
  ></textarea>
  <textarea
    .value=\${this.newText}
    @input=\${(e) => this.newText = e.target.value}
  ></textarea>
</div>

\${Diff({
  oldText: this.oldText,
  newText: this.newText
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Diff Properties</h3>
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
                                 <td class="py-2 pr-4">oldText</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Original text content</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">newText</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Modified text content</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">title</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">undefined</td>
                                 <td class="py-2 font-sans">Optional title header</td>
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
                     <h3 class="text-lg font-semibold mb-2">Diff Indicators</h3>
                     <ul class="space-y-2 text-sm">
                        <li class="flex items-center gap-2">
                           <span
                              class="inline-block w-4 h-4 bg-emerald-500/15 border border-emerald-500 rounded"
                           ></span>
                           <span>Added lines - New content (prefixed with +)</span>
                        </li>
                        <li class="flex items-center gap-2">
                           <span class="inline-block w-4 h-4 bg-red-500/15 border border-red-500 rounded"></span>
                           <span>Removed lines - Deleted content (prefixed with -)</span>
                        </li>
                        <li class="flex items-center gap-2">
                           <span class="inline-block w-4 h-4 bg-background border border-border rounded"></span>
                           <span>Unchanged lines - Same in both versions</span>
                        </li>
                     </ul>
                  </div>
               </div>
            </section>
         </div>
      `;
   }
}

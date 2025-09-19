import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Separator, Input, Textarea, Label, Badge, icon } from "@mariozechner/mini-lit";
import { Code, Mail, Key, FileText, Share, Download, Link, Hash, Terminal, Copy } from "lucide";

// Register the copy-button custom element
import "@mariozechner/mini-lit/dist/CopyButton.js";

@customElement("page-copybutton")
export class CopyButtonPage extends LitElement {
   @state() customText = "Hello, this is custom text to copy!";
   @state() apiKey = "sk-1234567890abcdef";
   @state() shareUrl = "https://example.com/share/abc123";
   @state() codeSnippet = `npm install @mariozechner/mini-lit`;
   @state() longText =
      `This is a longer piece of text that demonstrates copying larger content blocks. It includes multiple sentences and can span several lines. Perfect for testing the copy functionality with more substantial content.`;

   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Copy Button</h1>
               <p class="text-muted-foreground">
                  Copy text to clipboard with visual feedback. The copy button is a web component that manages its own
                  state to show copied confirmation.
               </p>
            </div>

            <!-- Basic Examples -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center gap-4">
                           <span class="text-sm">Hello, World!</span>
                           <copy-button text="Hello, World!"></copy-button>
                        </div>

                        <div class="flex items-center gap-4 p-3 bg-muted/50 rounded-md font-mono text-sm">
                           <code class="flex-1">npm install @mariozechner/mini-lit</code>
                           <copy-button text="npm install @mariozechner/mini-lit"></copy-button>
                        </div>

                        <div class="flex items-center gap-4">
                           <a href="#" class="text-primary underline text-sm">https://example.com</a>
                           <copy-button text="https://example.com"></copy-button>
                        </div>
                     </div>
                  `}
                  code=${`import "@mariozechner/mini-lit/dist/CopyButton.js";

// Simple text copy
<copy-button text="Hello, World!"></copy-button>

// Code snippet copy
<div class="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
  <code>npm install @mariozechner/mini-lit</code>
  <copy-button text="npm install @mariozechner/mini-lit"></copy-button>
</div>

// URL copy
<copy-button text="https://example.com"></copy-button>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Show Text -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">With Confirmation Text</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center gap-4">
                           <span class="text-sm">Copy me with confirmation text</span>
                           <copy-button text="Copy me with confirmation text" show-text="true"></copy-button>
                        </div>

                        <div class="flex items-center gap-4">
                           <span class="text-sm">Custom tooltip text</span>
                           <copy-button
                              text="Custom tooltip text"
                              title="Copy to clipboard"
                              show-text="true"
                           ></copy-button>
                        </div>

                        <div class="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                           <code class="text-sm">const API_KEY = "secret";</code>
                           <copy-button text='const API_KEY = "secret";' show-text="true"></copy-button>
                        </div>
                     </div>
                  `}
                  code=${`// With "Copied!" text
<copy-button
  text="Copy me with confirmation text"
  show-text="true"
></copy-button>

// Custom title
<copy-button
  text="Custom tooltip text"
  title="Copy to clipboard"
  show-text="true"
></copy-button>

// Code with confirmation
<copy-button
  text='const API_KEY = "secret";'
  show-text="true"
></copy-button>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Different Content Types -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Content Types</h2>

               <preview-code
                  .preview=${html`
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Email Address -->
                        <div class="p-4 border border-border rounded-lg">
                           <div class="flex items-center gap-2 mb-2">
                              ${icon(Mail, "sm")}
                              <span class="font-medium">Email Address</span>
                           </div>
                           <div class="flex items-center gap-3">
                              <span class="text-sm">contact@example.com</span>
                              <copy-button text="contact@example.com"></copy-button>
                           </div>
                        </div>

                        <!-- API Key -->
                        <div class="p-4 border border-border rounded-lg">
                           <div class="flex items-center gap-2 mb-2">
                              ${icon(Key, "sm")}
                              <span class="font-medium">API Key</span>
                           </div>
                           <div class="flex items-center gap-3">
                              <code class="text-sm bg-muted px-2 py-1 rounded">sk-1234...abcd</code>
                              <copy-button text="${this.apiKey}"></copy-button>
                           </div>
                        </div>

                        <!-- Share Link -->
                        <div class="p-4 border border-border rounded-lg">
                           <div class="flex items-center gap-2 mb-2">
                              ${icon(Share, "sm")}
                              <span class="font-medium">Share Link</span>
                           </div>
                           <div class="flex items-center gap-3">
                              <span class="text-sm text-primary truncate max-w-[200px]">${this.shareUrl}</span>
                              <copy-button text="${this.shareUrl}"></copy-button>
                           </div>
                        </div>

                        <!-- Multi-line Text -->
                        <div class="p-4 border border-border rounded-lg">
                           <div class="flex items-center gap-2 mb-2">
                              ${icon(FileText, "sm")}
                              <span class="font-medium">Multi-line Text</span>
                           </div>
                           <div class="space-y-3">
                              <p class="text-sm text-muted-foreground">${this.longText.substring(0, 50)}...</p>
                              <copy-button text="${this.longText}" show-text="true"></copy-button>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Email Address
<div class="flex items-center gap-3">
  <span>contact@example.com</span>
  <copy-button text="contact@example.com"></copy-button>
</div>

// API Key
<div class="flex items-center gap-3">
  <code class="bg-muted px-2 py-1 rounded">sk-1234...abcd</code>
  <copy-button text="\${apiKey}"></copy-button>
</div>

// Share Link
<div class="flex items-center gap-3">
  <span class="text-primary">\${shareUrl}</span>
  <copy-button text="\${shareUrl}"></copy-button>
</div>

// Multi-line Text
<copy-button text="\${longText}" show-text="true"></copy-button>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Code Blocks -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Code Blocks</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <!-- JavaScript Code Block -->
                        <div>
                           <h4 class="text-sm font-medium mb-3 flex items-center gap-2">
                              ${icon(Code, "sm")} JavaScript Example
                           </h4>
                           <div class="relative">
                              <pre
                                 class="bg-muted/50 p-4 rounded-md text-sm overflow-x-auto"
                              ><code>${`import { CopyButton } from '@mariozechner/mini-lit';

// Usage example
<copy-button
  text="Text to copy"
  show-text="true"
  title="Copy to clipboard"
></copy-button>`}</code></pre>
                              <div class="absolute top-2 right-2">
                                 <copy-button
                                    text="import { CopyButton } from '@mariozechner/mini-lit';

// Usage example
<copy-button
  text='Text to copy'
  show-text='true'
  title='Copy to clipboard'
></copy-button>"
                                 ></copy-button>
                              </div>
                           </div>
                        </div>

                        <!-- JSON Configuration -->
                        <div>
                           <h4 class="text-sm font-medium mb-3">JSON Configuration</h4>
                           <div class="relative">
                              <pre class="bg-muted/50 p-4 rounded-md text-sm overflow-x-auto"><code>${JSON.stringify(
                                 {
                                    name: "@mariozechner/mini-lit",
                                    version: "1.0.0",
                                    dependencies: {
                                       lit: "^3.0.0",
                                       lucide: "latest",
                                    },
                                 },
                                 null,
                                 2,
                              )}</code></pre>
                              <div class="absolute top-2 right-2">
                                 <copy-button
                                    text="${JSON.stringify(
                                       {
                                          name: "@mariozechner/mini-lit",
                                          version: "1.0.0",
                                          dependencies: {
                                             lit: "^3.0.0",
                                             lucide: "latest",
                                          },
                                       },
                                       null,
                                       2,
                                    )}"
                                 ></copy-button>
                              </div>
                           </div>
                        </div>

                        <!-- Shell Commands -->
                        <div>
                           <h4 class="text-sm font-medium mb-3 flex items-center gap-2">
                              ${icon(Terminal, "sm")} Shell Commands
                           </h4>
                           <div class="relative">
                              <pre
                                 class="bg-muted/50 p-4 rounded-md text-sm overflow-x-auto"
                              ><code>${`# Install dependencies
npm install @mariozechner/mini-lit

# Build the project
npm run build

# Start development server
npm run dev`}</code></pre>
                              <div class="absolute top-2 right-2">
                                 <copy-button
                                    text="# Install dependencies
npm install @mariozechner/mini-lit

# Build the project
npm run build

# Start development server
npm run dev"
                                 ></copy-button>
                              </div>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Code block with copy button
<div class="relative">
  <pre class="bg-muted/50 p-4 rounded-md">
    <code>\${codeContent}</code>
  </pre>
  <div class="absolute top-2 right-2">
    <copy-button text="\${codeContent}"></copy-button>
  </div>
</div>

// JSON with copy
<div class="relative">
  <pre class="bg-muted/50 p-4 rounded-md">
    <code>\${JSON.stringify(data, null, 2)}</code>
  </pre>
  <div class="absolute top-2 right-2">
    <copy-button text="\${JSON.stringify(data, null, 2)}"></copy-button>
  </div>
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Integration Examples -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Integration Examples</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <!-- With Input Field -->
                        <div>
                           ${Label("Share URL")}
                           <div class="flex gap-2 mt-2">
                              ${Input({
                                 value: this.shareUrl,
                                 readonly: true,
                                 className: "flex-1",
                              })}
                              <copy-button text="${this.shareUrl}"></copy-button>
                           </div>
                        </div>

                        <!-- With Badge -->
                        <div>
                           ${Label("Promo Code")}
                           <div class="flex items-center gap-3 mt-2">
                              ${Badge("PRO-2024", "secondary")}
                              <copy-button text="PRO-2024" show-text="true"></copy-button>
                           </div>
                        </div>

                        <!-- In Table -->
                        <div>
                           ${Label("Order IDs")}
                           <table class="w-full mt-2">
                              <thead>
                                 <tr class="border-b">
                                    <th class="text-left p-2 text-sm">ID</th>
                                    <th class="text-left p-2 text-sm">Status</th>
                                    <th class="text-left p-2 text-sm">Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr class="border-b">
                                    <td class="p-2 text-sm font-mono">abc-123</td>
                                    <td class="p-2 text-sm">${Badge("Active", "secondary")}</td>
                                    <td class="p-2">
                                       <copy-button text="abc-123"></copy-button>
                                    </td>
                                 </tr>
                                 <tr class="border-b">
                                    <td class="p-2 text-sm font-mono">def-456</td>
                                    <td class="p-2 text-sm">${Badge("Pending", "outline")}</td>
                                    <td class="p-2">
                                       <copy-button text="def-456"></copy-button>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td class="p-2 text-sm font-mono">ghi-789</td>
                                    <td class="p-2 text-sm">${Badge("Complete", "default")}</td>
                                    <td class="p-2">
                                       <copy-button text="ghi-789"></copy-button>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
                     </div>
                  `}
                  code=${`// With Input Field
<div class="flex gap-2">
  \${Input({
    value: shareUrl,
    readonly: true,
    className: "flex-1"
  })}
  <copy-button text="\${shareUrl}"></copy-button>
</div>

// With Badge
<div class="flex items-center gap-3">
  \${Badge("PRO-2024", "secondary")}
  <copy-button text="PRO-2024" show-text="true"></copy-button>
</div>

// In Table
<table>
  <tbody>
    <tr>
      <td class="font-mono">abc-123</td>
      <td>\${Badge("Active", "secondary")}</td>
      <td>
        <copy-button text="abc-123"></copy-button>
      </td>
    </tr>
  </tbody>
</table>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Interactive Example -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Interactive Example</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Label("Enter text to copy:")}
                        ${Textarea({
                           value: this.customText,
                           onInput: (e: any) => {
                              this.customText = e.target.value;
                           },
                           placeholder: "Type something to copy...",
                           rows: 3,
                        })}

                        <div class="flex items-center gap-3">
                           <span class="text-sm text-muted-foreground">Click to copy your text:</span>
                           <copy-button text="${this.customText}" show-text="true"></copy-button>
                        </div>

                        <div class="p-4 bg-muted/50 rounded-md">
                           <p class="text-sm font-medium mb-2">Preview:</p>
                           <p class="text-sm">${this.customText}</p>
                        </div>
                     </div>
                  `}
                  code=${`// Interactive copy with textarea
@state() customText = "Hello, world!";

render() {
  return html\`
    \${Textarea({
      value: this.customText,
      onInput: (e) => {
        this.customText = e.target.value;
      },
      placeholder: "Type something to copy..."
    })}

    <copy-button
      text="\${this.customText}"
      show-text="true"
    ></copy-button>
  \`;
}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">CopyButton Properties</h3>
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
                                 <td class="py-2 pr-4">text</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Text to copy to clipboard</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">show-text</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Show "Copied!" text when clicked</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">title</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"Copy"</td>
                                 <td class="py-2 font-sans">Tooltip text</td>
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

import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import "@mariozechner/mini-lit/dist/MarkdownBlock.js";
import { Separator } from "@mariozechner/mini-lit";

@customElement("page-markdown")
export class MarkdownPage extends LitElement {
   @state() liveMarkdown = `# Welcome to Markdown

This is a **basic** markdown example that demonstrates *various* formatting options.

## Features

- **Bold text** using double asterisks
- *Italic text* using single asterisks
- \`Inline code\` using backticks
- [Links](https://example.com) using brackets

### Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

> Blockquotes for emphasis or citations

---

That's the basics of markdown!`;

   createRenderRoot() {
      return this;
   }

   render() {
      const basicMarkdown = `# Heading 1
## Heading 2
### Heading 3

Regular paragraph text with **bold**, *italic*, and ***bold italic*** formatting.

- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested item

[Link text](https://example.com)

> This is a blockquote
> with multiple lines

\`Inline code\`

---

Horizontal rule above`;

      const codeMarkdown = `## Code Examples

Inline code: \`const name = "World";\`

### JavaScript
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
\`\`\`

### Python
\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))
\`\`\``;

      const tableMarkdown = `## Tables

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
| Cell 7   | Cell 8   | Cell 9   |

### Aligned Table

| Left | Center | Right |
|:-----|:------:|------:|
| A    |   B    |     C |
| D    |   E    |     F |`;

      const mathMarkdown = `## Math Equations

Inline math: $E = mc^2$ and $\\sqrt{x^2 + y^2}$

Block equations:

$$
\\begin{aligned}
\\nabla \\cdot \\vec{E} &= \\frac{\\rho}{\\epsilon_0} \\\\
\\nabla \\cdot \\vec{B} &= 0 \\\\
\\nabla \\times \\vec{E} &= -\\frac{\\partial \\vec{B}}{\\partial t} \\\\
\\nabla \\times \\vec{B} &= \\mu_0 \\vec{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\vec{E}}{\\partial t}
\\end{aligned}
$$

Quadratic formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Matrix:
$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$`;

      const imageMarkdown = `## Images

![Alt text](https://via.placeholder.com/400x200?text=Sample+Image)

### Image with link
[![Clickable image](https://via.placeholder.com/300x150?text=Click+Me)](https://example.com)`;

      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Markdown</h1>
               <p class="text-muted-foreground">Render markdown content with full formatting support.</p>
            </div>

            <!-- Basic Markdown -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Markdown</h2>

               <preview-code
                  .preview=${html` <markdown-block .content=${basicMarkdown}></markdown-block> `}
                  code=${`import '@mariozechner/mini-lit/dist/MarkdownBlock.js';

const markdown = \`# Heading 1
## Heading 2
### Heading 3

Regular text with **bold**, *italic*, and ***bold italic***.

- Unordered list
- Another item

1. Ordered list
2. Another item

[Link text](https://example.com)

> Blockquote

\\\`Inline code\\\`
\`;

<markdown-block
  .content=\${markdown}
></markdown-block>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Code Blocks -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Code Blocks</h2>

               <preview-code
                  .preview=${html` <markdown-block .content=${codeMarkdown}></markdown-block> `}
                  code=${`const codeMarkdown = \`## Code Examples

Inline code: \\\`const name = "World";\\\`

### JavaScript
\\\`\\\`\\\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\\\`\\\`\\\`

### Python
\\\`\\\`\\\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"
\\\`\\\`\\\`
\`;

<markdown-block
  .content=\${codeMarkdown}
></markdown-block>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Tables -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Tables</h2>

               <preview-code
                  .preview=${html` <markdown-block .content=${tableMarkdown}></markdown-block> `}
                  code=${`const tableMarkdown = \`## Tables

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### Aligned Table

| Left | Center | Right |
|:-----|:------:|------:|
| A    |   B    |     C |
| D    |   E    |     F |
\`;

<markdown-block
  .content=\${tableMarkdown}
></markdown-block>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Math Equations -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Math Equations (KaTeX)</h2>

               <preview-code
                  .preview=${html` <markdown-block .content=${mathMarkdown}></markdown-block> `}
                  code=${`const mathMarkdown = \`## Math Equations

Inline math: $E = mc^2$ and $\\\\sqrt{x^2 + y^2}$

Block equations:

$$
\\\\begin{aligned}
\\\\nabla \\\\cdot \\\\vec{E} &= \\\\frac{\\\\rho}{\\\\epsilon_0} \\\\\\\\
\\\\nabla \\\\cdot \\\\vec{B} &= 0 \\\\\\\\
\\\\nabla \\\\times \\\\vec{E} &= -\\\\frac{\\\\partial \\\\vec{B}}{\\\\partial t} \\\\\\\\
\\\\nabla \\\\times \\\\vec{B} &= \\\\mu_0 \\\\vec{J} + \\\\mu_0 \\\\epsilon_0 \\\\frac{\\\\partial \\\\vec{E}}{\\\\partial t}
\\\\end{aligned}
$$

Quadratic formula:
$$x = \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a}$$
\`;

<markdown-block
  .content=\${mathMarkdown}
></markdown-block>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Live Editor -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Live Editor</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div>
                           <label class="text-sm font-medium mb-2 block">Edit Markdown:</label>
                           <textarea
                              class="w-full h-48 p-3 border border-border rounded-md bg-background text-foreground font-mono text-sm"
                              .value=${this.liveMarkdown}
                              @input=${(e: Event) => {
                                 this.liveMarkdown = (e.target as HTMLTextAreaElement).value;
                              }}
                           ></textarea>
                        </div>

                        <div>
                           <label class="text-sm font-medium mb-2 block">Preview:</label>
                           <div class="border border-border rounded-md p-4 bg-background">
                              <markdown-block .content=${this.liveMarkdown}></markdown-block>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Live markdown editor
@state() markdown = "# Hello World";

// Template
<textarea
  .value=\${this.markdown}
  @input=\${(e) => this.markdown = e.target.value}
></textarea>

<div class="preview">
  <markdown-block
    .content=\${this.markdown}
  ></markdown-block>
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">MarkdownBlock Properties</h3>
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
                                 <td class="py-2 pr-4">content</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Markdown content to render</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">escapeHtml</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">true</td>
                                 <td class="py-2 font-sans">Escape HTML in markdown</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">isThinking</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Show loading animation</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">Supported Features</h3>
                     <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Headings (H1-H6)</li>
                        <li>Bold, italic, and strikethrough text</li>
                        <li>Ordered and unordered lists</li>
                        <li>Code blocks with syntax highlighting</li>
                        <li>Tables with alignment</li>
                        <li>Links and images</li>
                        <li>Blockquotes</li>
                        <li>Horizontal rules</li>
                        <li>Task lists</li>
                        <li>Math equations (KaTeX)</li>
                        <li>HTML escaping (optional)</li>
                     </ul>
                  </div>
               </div>
            </section>
         </div>
      `;
   }
}

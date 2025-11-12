import { Select, type SelectOption } from "@mariozechner/mini-lit/dist/Select.js";
import { Separator } from "@mariozechner/mini-lit/dist/Separator.js";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("page-codeblock")
export class CodeBlockPage extends LitElement {
   @state() selectedLanguage = "javascript";

   private languageOptions: SelectOption[] = [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "html", label: "HTML" },
      { value: "css", label: "CSS" },
      { value: "json", label: "JSON" },
      { value: "bash", label: "Bash" },
      { value: "sql", label: "SQL" },
   ];

   private codeExamples: Record<string, string> = {
      javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55`,

      typescript: `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

class UserService {
  async getUser(id: string): Promise<User> {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  }
}`,

      python: `def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))`,

      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>This is a sample HTML document.</p>
  </main>
</body>
</html>`,

      css: `.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}`,

      json: `{
  "name": "mini-lit-example",
  "version": "1.0.0",
  "description": "Example application",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lit": "^3.0.0",
    "@mariozechner/mini-lit": "^0.1.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}`,

      bash: `#!/bin/bash

# Build and deploy script
echo "Building application..."
npm run build

if [ $? -eq 0 ]; then
  echo "Build successful!"

  # Deploy to server
  echo "Deploying to production..."
  rsync -avz dist/ user@server:/var/www/html/

  echo "Deployment complete!"
else
  echo "Build failed!"
  exit 1
fi`,

      sql: `-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Insert sample data
INSERT INTO users (username, email)
VALUES
  ('john_doe', 'john@example.com'),
  ('jane_smith', 'jane@example.com');

-- Query active users
SELECT username, email, created_at
FROM users
WHERE created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;`,
   };

   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Code Block</h1>
               <p class="text-muted-foreground">Display syntax-highlighted code with support for multiple languages.</p>
            </div>

            <!-- Interactive Example -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Interactive Code Block</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center gap-4">
                           <label class="text-sm font-medium">Language:</label>
                           ${Select({
                              options: this.languageOptions,
                              value: this.selectedLanguage,
                              onChange: (value) => {
                                 this.selectedLanguage = value;
                              },
                              className: "w-48",
                           })}
                        </div>

                        <code-block
                           .code=${this.codeExamples[this.selectedLanguage]}
                           .language=${this.selectedLanguage}
                        ></code-block>
                     </div>
                  `}
                  code=${`import '@mariozechner/mini-lit/dist/CodeBlock.js';

// Basic usage
<code-block
  .code=\${\`function hello() {
    console.log("Hello, world!");
  }\`}
  language="javascript"
></code-block>

// With language selector
<code-block
  .code=\${codeExamples[selectedLanguage]}
  .language=\${selectedLanguage}
></code-block>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Different Languages -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Language Support</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div>
                           <h3 class="text-sm font-medium mb-2">TypeScript</h3>
                           <code-block
                              .code=${`const greeting: string = "Hello";
const count: number = 42;
const isValid: boolean = true;`}
                              language="typescript"
                           ></code-block>
                        </div>

                        <div>
                           <h3 class="text-sm font-medium mb-2">Python</h3>
                           <code-block
                              .code=${`def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))`}
                              language="python"
                           ></code-block>
                        </div>

                        <div>
                           <h3 class="text-sm font-medium mb-2">JSON</h3>
                           <code-block
                              .code=${`{
  "name": "Example",
  "version": "1.0.0",
  "active": true
}`}
                              language="json"
                           ></code-block>
                        </div>
                     </div>
                  `}
                  code=${`// TypeScript
<code-block
  .code=\${"const greeting: string = 'Hello';"}
  language="typescript"
></code-block>

// Python
<code-block
  .code=\${"def greet(name: str) -> str:\\n    return f'Hello, {name}!'"}
  language="python"
></code-block>

// JSON
<code-block
  .code=\${'{"name": "Example", "version": "1.0.0"}'}
  language="json"
></code-block>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Inline Code -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Inline Code</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <p>
                           You can use the
                           <code class="px-1 py-0.5 bg-muted text-sm rounded">code-block</code> component to display
                           code snippets. For inline code, use the standard HTML
                           <code class="px-1 py-0.5 bg-muted text-sm rounded">&lt;code&gt;</code> element with
                           appropriate styling.
                        </p>

                        <p>
                           Common keyboard shortcuts like
                           <kbd class="px-2 py-1 bg-muted border border-border rounded text-xs">Cmd</kbd> +
                           <kbd class="px-2 py-1 bg-muted border border-border rounded text-xs">C</kbd> for copy or
                           <kbd class="px-2 py-1 bg-muted border border-border rounded text-xs">Ctrl</kbd> +
                           <kbd class="px-2 py-1 bg-muted border border-border rounded text-xs">V</kbd> for paste.
                        </p>
                     </div>
                  `}
                  code=${`// Inline code styling
<code class="px-1 py-0.5 bg-muted text-sm rounded">
  code-block
</code>

// Keyboard shortcuts
<kbd class="px-2 py-1 bg-muted border border-border rounded text-xs">
  Cmd
</kbd>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">CodeBlock Properties</h3>
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
                                 <td class="py-2 pr-4">code</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Code content to display</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">language</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Programming language for syntax highlighting</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">Built-in Languages</h3>
                     <p class="text-sm text-muted-foreground mb-2">The following languages are included by default:</p>
                     <div class="flex flex-wrap gap-2 mb-4">
                        ${this.languageOptions.map(
                           (opt) => html`<code class="px-2 py-1 bg-muted text-xs rounded">${opt.label}</code>`,
                        )}
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">Adding More Languages</h3>
                     <p class="text-sm text-muted-foreground mb-4">
                        To add support for additional languages, modify
                        <code class="px-1 py-0.5 bg-muted text-xs rounded">src/CodeBlock.ts</code>:
                     </p>
                     <code-block
                        .code=${`// 1. Import the language module from highlight.js
import java from "highlight.js/lib/languages/java";
import rust from "highlight.js/lib/languages/rust";
import go from "highlight.js/lib/languages/go";

// 2. Register the language with highlight.js
hljs.registerLanguage("java", java);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("go", go);

// Now you can use these languages:
<code-block .code=\${javaCode} language="java"></code-block>
<code-block .code=\${rustCode} language="rust"></code-block>
<code-block .code=\${goCode} language="go"></code-block>`}
                        language="typescript"
                     ></code-block>
                     <p class="text-sm text-muted-foreground mt-4">
                        Available languages:
                        <a
                           href="https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md"
                           class="text-primary hover:underline"
                           target="_blank"
                           rel="noopener"
                           >See full list →</a
                        >
                     </p>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">Custom Themes</h3>
                     <p class="text-sm text-muted-foreground mb-4">
                        The default theme uses GitHub-inspired colors. To use a different highlight.js theme, override
                        the CSS variables in
                        <code class="px-1 py-0.5 bg-muted text-xs rounded"
                           >src/styles/utils/syntax-highlighting.css</code
                        >:
                     </p>
                     <code-block
                        .code=${`/* Example: Using Monokai theme colors */
:root {
  --syntax-keyword: #f92672;     /* Pink keywords */
  --syntax-entity: #a6e22e;      /* Green functions */
  --syntax-constant: #ae81ff;    /* Purple numbers */
  --syntax-string: #e6db74;      /* Yellow strings */
  --syntax-variable: #fd971f;    /* Orange variables */
  --syntax-comment: #75715e;     /* Gray comments */
  --syntax-tag: #f92672;         /* Pink tags */
}

/* Or import a complete theme CSS file */
@import "highlight.js/styles/monokai.css";

/* Popular themes:
   - github-dark / github-light
   - monokai
   - dracula
   - nord
   - vs2015 (Visual Studio Dark)
   - atom-one-dark / atom-one-light
   See all: https://highlightjs.org/examples
*/`}
                        language="css"
                     ></code-block>
                  </div>
               </div>
            </section>
         </div>
      `;
   }
}

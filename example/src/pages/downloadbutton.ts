import { Button, DownloadButton, Input, icon, Label, Separator, Textarea } from "@mariozechner/mini-lit";
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Binary, Code, Download, FileText, Image } from "lucide";

@customElement("page-downloadbutton")
export class DownloadButtonPage extends LitElement {
   @state() dynamicContent = "This is dynamic content that changes based on user input.";
   @state() dynamicFilename = "my-file.txt";

   // Sample base64 image (1x1 red pixel PNG)
   private sampleBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

   // Sample binary data
   private sampleBinary = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello" in bytes

   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Download Button</h1>
               <p class="text-muted-foreground">
                  Create downloadable files from text, base64, or binary content. The download button automatically
                  handles different content types and generates files on-the-fly.
               </p>
            </div>

            <!-- Basic Examples -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center gap-4">
                           <span class="text-sm">Simple text file</span>
                           ${DownloadButton({
                              content: "Hello, World!",
                              filename: "hello.txt",
                           })}
                        </div>

                        <div class="flex items-center gap-4">
                           <span class="text-sm">JSON data</span>
                           ${DownloadButton({
                              content: '{"name": "example", "version": "1.0.0"}',
                              filename: "data.json",
                              mimeType: "application/json",
                           })}
                        </div>

                        <div class="flex items-center gap-4">
                           <span class="text-sm">CSV data</span>
                           ${DownloadButton({
                              content: "Name,Age,City\nJohn,30,New York\nJane,25,Los Angeles",
                              filename: "data.csv",
                              mimeType: "text/csv",
                           })}
                        </div>
                     </div>
                  `}
                  code=${`import { DownloadButton } from "@mariozechner/mini-lit";

// Simple text file
\${DownloadButton({
  content: "Hello, World!",
  filename: "hello.txt"
})}

// JSON file
\${DownloadButton({
  content: '{"name": "example", "version": "1.0.0"}',
  filename: "data.json",
  mimeType: "application/json"
})}

// CSV file
\${DownloadButton({
  content: "Name,Age,City\\nJohn,30,New York",
  filename: "data.csv",
  mimeType: "text/csv"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- String Content -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">String Content</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="p-4 border border-border rounded-lg">
                           <h4 class="font-medium mb-3 flex items-center gap-2">${icon(FileText, "sm")} Plain Text</h4>
                           <div class="space-y-3">
                              <pre class="bg-muted/50 p-3 rounded text-sm">
This is a plain text document.
It can contain multiple lines.
Special characters like "quotes" and 'apostrophes' work fine.</pre
                              >
                              ${DownloadButton({
                                 content:
                                    "This is a plain text document.\nIt can contain multiple lines.\nSpecial characters like \"quotes\" and 'apostrophes' work fine.",
                                 filename: "document.txt",
                                 showText: true,
                              })}
                           </div>
                        </div>

                        <div class="p-4 border border-border rounded-lg">
                           <h4 class="font-medium mb-3 flex items-center gap-2">${icon(Code, "sm")} HTML Content</h4>
                           <div class="space-y-3">
                              <pre class="bg-muted/50 p-3 rounded text-sm overflow-x-auto"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;title&gt;Test&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;h1&gt;Hello&lt;/h1&gt;&lt;/body&gt;
&lt;/html&gt;</code></pre>
                              ${DownloadButton({
                                 content:
                                    "<!DOCTYPE html>\n<html>\n<head><title>Test</title></head>\n<body><h1>Hello</h1></body>\n</html>",
                                 filename: "page.html",
                                 mimeType: "text/html",
                                 showText: true,
                              })}
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Plain text content
\${DownloadButton({
  content: "This is a plain text document.\\nWith multiple lines.",
  filename: "document.txt",
  showText: true
})}

// HTML content
\${DownloadButton({
  content: "<!DOCTYPE html>\\n<html>...</html>",
  filename: "page.html",
  mimeType: "text/html",
  showText: true
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Base64 Content -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Base64 Content</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="p-4 border border-border rounded-lg">
                           <h4 class="font-medium mb-3 flex items-center gap-2">
                              ${icon(Image, "sm")} Base64 Image (Auto-detected)
                           </h4>
                           <div class="space-y-3">
                              <p class="text-sm text-muted-foreground">
                                 Base64 strings are automatically detected when they match the pattern
                              </p>
                              <div class="flex items-center gap-3">
                                 <code class="text-xs bg-muted px-2 py-1 rounded">iVBORw0KGgo...</code>
                                 ${DownloadButton({
                                    content: this.sampleBase64,
                                    filename: "pixel.png",
                                    mimeType: "image/png",
                                    showText: true,
                                 })}
                              </div>
                           </div>
                        </div>

                        <div class="p-4 border border-border rounded-lg">
                           <h4 class="font-medium mb-3 flex items-center gap-2">
                              ${icon(Binary, "sm")} Explicit Base64 Flag
                           </h4>
                           <div class="space-y-3">
                              <p class="text-sm text-muted-foreground">
                                 Use is-base64="true" to explicitly mark content as base64
                              </p>
                              <div class="flex items-center gap-3">
                                 <code class="text-xs bg-muted px-2 py-1 rounded">SGVsbG8gV29ybGQh</code>
                                 ${DownloadButton({
                                    content: "SGVsbG8gV29ybGQh",
                                    filename: "data.bin",
                                    isBase64: true,
                                    showText: true,
                                 })}
                              </div>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Base64 image (auto-detected)
\${DownloadButton({
  content: base64ImageData,
  filename: "image.png",
  mimeType: "image/png",
  showText: true
})}

// Explicit base64 flag
\${DownloadButton({
  content: "SGVsbG8gV29ybGQh",
  filename: "data.bin",
  isBase64: true,
  showText: true
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Binary Content -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Binary Content (Uint8Array)</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="p-4 border border-border rounded-lg">
                           <h4 class="font-medium mb-3 flex items-center gap-2">
                              ${icon(Binary, "sm")} Uint8Array Data
                           </h4>
                           <div class="space-y-3">
                              <p class="text-sm text-muted-foreground">
                                 Pass binary data directly as Uint8Array via property binding
                              </p>
                              <div class="flex items-center gap-3">
                                 <code class="text-xs bg-muted px-2 py-1 rounded">
                                    Uint8Array([72, 101, 108, 108, 111]) = "Hello"
                                 </code>
                                 ${DownloadButton({
                                    content: this.sampleBinary,
                                    filename: "binary-hello.bin",
                                    mimeType: "application/octet-stream",
                                    showText: true,
                                 })}
                              </div>
                           </div>
                        </div>

                        <div class="p-4 border border-border rounded-lg">
                           <h4 class="font-medium mb-3">Generate Binary File</h4>
                           <div class="space-y-3">
                              <p class="text-sm text-muted-foreground">Create binary files programmatically</p>
                              ${Button({
                                 variant: "outline",
                                 children: html`
                                    ${icon(Download, "sm")}
                                    <span>Generate & Download</span>
                                 `,
                                 onClick: () => {
                                    // Generate some binary data
                                    const data = new Uint8Array(256);
                                    for (let i = 0; i < 256; i++) {
                                       data[i] = i;
                                    }

                                    const blob = new Blob([data], { type: "application/octet-stream" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = "generated.bin";
                                    a.click();
                                    URL.revokeObjectURL(url);
                                 },
                              })}
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Binary data - just pass it to DownloadButton!
const binaryData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in bytes

\${DownloadButton({
  content: binaryData,
  filename: "binary-data.bin",
  mimeType: "application/octet-stream"
})}

// Generate binary data programmatically
const data = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  data[i] = i;
}

// Use it directly - DownloadButton handles all the blob/URL stuff
\${DownloadButton({
  content: data,
  filename: "generated.bin",
  mimeType: "application/octet-stream"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Button Appearance -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Button Appearance</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center gap-4">
                           <span class="text-sm">Icon only (default)</span>
                           ${DownloadButton({
                              content: "Sample content",
                              filename: "sample.txt",
                           })}
                        </div>

                        <div class="flex items-center gap-4">
                           <span class="text-sm">With "Download" text</span>
                           ${DownloadButton({
                              content: "Sample content",
                              filename: "sample.txt",
                              showText: true,
                           })}
                        </div>

                        <div class="flex items-center gap-4">
                           <span class="text-sm">Custom tooltip</span>
                           ${DownloadButton({
                              content: "Sample content",
                              filename: "sample.txt",
                              title: "Click to save file",
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// Icon only (default)
\${DownloadButton({
  content: "Sample content",
  filename: "sample.txt"
})}

// With "Download" text
\${DownloadButton({
  content: "Sample content",
  filename: "sample.txt",
  showText: true
})}

// Custom tooltip
\${DownloadButton({
  content: "Sample content",
  filename: "sample.txt",
  title: "Click to save file"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Interactive Example -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Interactive Example</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Label("Filename:")}
                        ${Input({
                           value: this.dynamicFilename,
                           onInput: (e: any) => {
                              this.dynamicFilename = e.target.value;
                           },
                           placeholder: "Enter filename...",
                        })}
                        ${Label("File content:")}
                        ${Textarea({
                           value: this.dynamicContent,
                           onInput: (e: any) => {
                              this.dynamicContent = e.target.value;
                           },
                           placeholder: "Enter content for your file...",
                           rows: 4,
                        })}

                        <div class="flex items-center gap-4">
                           ${Button({
                              variant: "default",
                              children: html`
                                 ${icon(Download, "sm")}
                                 <span>Download Custom File</span>
                              `,
                              onClick: () => {
                                 const blob = new Blob([this.dynamicContent], { type: "text/plain" });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement("a");
                                 a.href = url;
                                 a.download = this.dynamicFilename;
                                 a.click();
                                 URL.revokeObjectURL(url);
                              },
                           })}
                           <span class="text-sm text-muted-foreground"> Creates: ${this.dynamicFilename} </span>
                        </div>
                     </div>
                  `}
                  code=${`// Interactive download with dynamic content
@state() dynamicContent = "File content";
@state() dynamicFilename = "my-file.txt";

// Just use DownloadButton with dynamic content!
\${DownloadButton({
  content: this.dynamicContent,
  filename: this.dynamicFilename,
  mimeType: "text/plain"
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">DownloadButton Properties</h3>
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
                                 <td class="py-2 pr-4 text-muted-foreground">string | Uint8Array</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Content to download (text, base64, or binary)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">filename</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">required</td>
                                 <td class="py-2 font-sans">Name of the downloaded file</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">mimeType</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"text/plain"</td>
                                 <td class="py-2 font-sans">MIME type of the content</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">title</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"Download"</td>
                                 <td class="py-2 font-sans">Tooltip text</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">showText</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Show "Download" text with icon</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">size</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"sm" | "md" | "lg" | "icon"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"sm"</td>
                                 <td class="py-2 font-sans">Button size</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">variant</td>
                                 <td class="py-2 pr-4 text-muted-foreground">ButtonVariant</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"ghost"</td>
                                 <td class="py-2 font-sans">Button visual style</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">iconSize</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"xs" | "sm" | "md" | "lg" | "xl"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"sm"</td>
                                 <td class="py-2 font-sans">Download icon size</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">isBase64</td>
                                 <td class="py-2 pr-4 text-muted-foreground">boolean</td>
                                 <td class="py-2 pr-4 text-muted-foreground">false</td>
                                 <td class="py-2 font-sans">Explicitly mark content as base64</td>
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

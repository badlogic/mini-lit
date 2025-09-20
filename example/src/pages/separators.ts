import { Badge, Button, icon, Separator } from "@mariozechner/mini-lit";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { Bookmark, Calendar, Clock, Globe, Heart, Mail, MapPin, Phone, Share } from "lucide";

@customElement("page-separators")
export class SeparatorsPage extends LitElement {
   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Separators</h1>
               <p class="text-muted-foreground">
                  Visual dividers to separate content sections with horizontal and vertical orientations.
               </p>
            </div>

            <!-- Basic Separators -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Separators</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <div>
                           <h4 class="text-sm font-medium mb-3">Horizontal Separator</h4>
                           <div class="space-y-4">
                              <p>Content before separator</p>
                              ${Separator()}
                              <p>Content after separator</p>
                           </div>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium mb-3">Vertical Separator</h4>
                           <div class="flex items-center gap-4 h-16">
                              <span>Left content</span>
                              ${Separator({ orientation: "vertical" })}
                              <span>Middle content</span>
                              ${Separator({ orientation: "vertical" })}
                              <span>Right content</span>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Horizontal separator (default)
\${Separator()}

// Vertical separator
\${Separator({ orientation: "vertical" })}

// With custom classes
\${Separator({ className: "my-4" })}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Navigation Separators -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Navigation Separators</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <div>
                           <h4 class="text-sm font-medium mb-3">Horizontal Navigation</h4>
                           <nav class="space-y-2">
                              <a href="#" class="text-primary hover:underline">Home</a>
                              ${Separator({ className: "my-2" })}
                              <a href="#" class="text-primary hover:underline">About</a>
                              ${Separator({ className: "my-2" })}
                              <a href="#" class="text-primary hover:underline">Services</a>
                              ${Separator({ className: "my-2" })}
                              <a href="#" class="text-primary hover:underline">Contact</a>
                           </nav>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium mb-3">Vertical Navigation</h4>
                           <nav class="flex items-center gap-4">
                              <a href="#" class="text-primary hover:underline">Home</a>
                              ${Separator({ orientation: "vertical", className: "h-4" })}
                              <a href="#" class="text-primary hover:underline">About</a>
                              ${Separator({ orientation: "vertical", className: "h-4" })}
                              <a href="#" class="text-primary hover:underline">Services</a>
                              ${Separator({ orientation: "vertical", className: "h-4" })}
                              <a href="#" class="text-primary hover:underline">Contact</a>
                           </nav>
                        </div>
                     </div>
                  `}
                  code=${`// Vertical navigation with separators
<nav class="flex items-center gap-4">
  <a href="#">Home</a>
  \${Separator({ orientation: "vertical", className: "h-4" })}
  <a href="#">About</a>
  \${Separator({ orientation: "vertical", className: "h-4" })}
  <a href="#">Services</a>
</nav>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Content Sections -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Content Section Dividers</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <!-- Article Header -->
                        <div>
                           <h3 class="text-xl font-semibold mb-2">Article Title</h3>
                           <div class="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <span class="flex items-center gap-1"> ${icon(Calendar, "sm")} March 15, 2024 </span>
                              <span class="flex items-center gap-1"> ${icon(Clock, "sm")} 5 min read </span>
                           </div>
                        </div>

                        ${Separator()}

                        <!-- Article Content -->
                        <div>
                           <p class="mb-4">
                              This is the first paragraph of the article. Separators help create clear visual breaks
                              between different sections of content.
                           </p>
                           <p>
                              This is the second paragraph, separated from the metadata above by a horizontal separator.
                           </p>
                        </div>

                        ${Separator()}

                        <!-- Tags and Actions -->
                        <div class="space-y-4">
                           <div>
                              <h4 class="text-sm font-medium mb-2">Tags</h4>
                              <div class="flex flex-wrap gap-2">
                                 ${Badge({ variant: "secondary", children: "React" })}
                                 ${Badge({ variant: "secondary", children: "TypeScript" })}
                                 ${Badge({ variant: "secondary", children: "Components" })}
                              </div>
                           </div>

                           <div>
                              <h4 class="text-sm font-medium mb-2">Actions</h4>
                              <div class="flex gap-2">
                                 ${Button({
                                    variant: "outline",
                                    size: "sm",
                                    children: html`${icon(Heart, "sm")} Like`,
                                 })}
                                 ${Button({
                                    variant: "outline",
                                    size: "sm",
                                    children: html`${icon(Share, "sm")} Share`,
                                 })}
                                 ${Button({
                                    variant: "outline",
                                    size: "sm",
                                    children: html`${icon(Bookmark, "sm")} Save`,
                                 })}
                              </div>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Article layout with separators
<div class="space-y-6">
  <header>
    <h3 class="text-xl font-semibold">Article Title</h3>
    <div class="text-sm text-muted-foreground">March 15, 2024</div>
  </header>

  \${Separator()}

  <article>
    <p>Article content...</p>
  </article>

  \${Separator()}

  <footer>
    <div class="flex gap-2">
      \${Button({ variant: "outline", size: "sm", children: "Like" })}
      \${Button({ variant: "outline", size: "sm", children: "Share" })}
    </div>
  </footer>
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Sidebar Layout -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Sidebar Layout with Separators</h2>

               <preview-code
                  .preview=${html`
                     <div class="flex gap-6 min-h-[300px]">
                        <!-- Sidebar -->
                        <div class="w-48 space-y-4">
                           <div>
                              <h4 class="font-medium mb-2">Navigation</h4>
                              <nav class="space-y-1">
                                 <a href="#" class="block px-2 py-1 text-sm hover:bg-muted rounded">Dashboard</a>
                                 <a href="#" class="block px-2 py-1 text-sm hover:bg-muted rounded">Projects</a>
                                 <a href="#" class="block px-2 py-1 text-sm hover:bg-muted rounded">Tasks</a>
                              </nav>
                           </div>

                           ${Separator({ className: "my-4" })}

                           <div>
                              <h4 class="font-medium mb-2">Recent</h4>
                              <div class="space-y-1">
                                 <div class="text-sm text-muted-foreground px-2 py-1">Project Alpha</div>
                                 <div class="text-sm text-muted-foreground px-2 py-1">Website Redesign</div>
                                 <div class="text-sm text-muted-foreground px-2 py-1">Mobile App</div>
                              </div>
                           </div>

                           ${Separator({ className: "my-4" })}

                           <div>
                              <h4 class="font-medium mb-2">Settings</h4>
                              <div class="space-y-1">
                                 <a href="#" class="block px-2 py-1 text-sm hover:bg-muted rounded">Profile</a>
                                 <a href="#" class="block px-2 py-1 text-sm hover:bg-muted rounded">Preferences</a>
                              </div>
                           </div>
                        </div>

                        <!-- Vertical Separator -->
                        ${Separator({ orientation: "vertical", className: "h-auto" })}

                        <!-- Main Content -->
                        <div class="flex-1 space-y-4">
                           <h3 class="text-lg font-semibold">Main Content Area</h3>
                           <p class="text-muted-foreground">
                              This is the main content area, separated from the sidebar by a vertical separator. This
                              creates a clear visual distinction between navigation and content.
                           </p>
                           <div class="grid grid-cols-2 gap-4">
                              <div class="p-4 border border-border rounded-lg">
                                 <h4 class="font-medium mb-2">Content Block 1</h4>
                                 <p class="text-sm text-muted-foreground">Some content here.</p>
                              </div>
                              <div class="p-4 border border-border rounded-lg">
                                 <h4 class="font-medium mb-2">Content Block 2</h4>
                                 <p class="text-sm text-muted-foreground">More content here.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Sidebar layout with vertical separator
<div class="flex gap-6">
  <!-- Sidebar -->
  <aside class="w-48 space-y-4">
    <nav>
      <a href="#">Dashboard</a>
      <a href="#">Projects</a>
    </nav>

    \${Separator({ className: "my-4" })}

    <div>
      <h4>Recent</h4>
      <!-- Recent items -->
    </div>
  </aside>

  <!-- Vertical Separator -->
  \${Separator({ orientation: "vertical", className: "h-auto" })}

  <!-- Main Content -->
  <main class="flex-1">
    <h1>Main Content</h1>
    <!-- Content -->
  </main>
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Contact Card -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Contact Information with Separators</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center gap-3">
                           ${icon(Phone, "sm", "text-muted-foreground")}
                           <span>+1 (555) 123-4567</span>
                        </div>

                        ${Separator()}

                        <div class="flex items-center gap-3">
                           ${icon(Mail, "sm", "text-muted-foreground")}
                           <span>contact@example.com</span>
                        </div>

                        ${Separator()}

                        <div class="flex items-center gap-3">
                           ${icon(Globe, "sm", "text-muted-foreground")}
                           <span>www.example.com</span>
                        </div>

                        ${Separator()}

                        <div class="flex items-center gap-3">
                           ${icon(MapPin, "sm", "text-muted-foreground")}
                           <span>123 Main St, City, State 12345</span>
                        </div>
                     </div>
                  `}
                  code=${`// Contact list with separators
<div class="space-y-4">
  <div class="flex items-center gap-3">
    \${icon(Phone, "sm")}
    <span>+1 (555) 123-4567</span>
  </div>

  \${Separator()}

  <div class="flex items-center gap-3">
    \${icon(Mail, "sm")}
    <span>contact@example.com</span>
  </div>

  \${Separator()}

  <!-- More contact items -->
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Toolbar Example -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Toolbar with Separators</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div>
                           <h4 class="text-sm font-medium mb-3">Text Editor Toolbar</h4>
                           <div class="flex items-center gap-2 p-2 border border-border rounded-md">
                              ${Button({ variant: "ghost", size: "sm", children: "Bold" })}
                              ${Button({ variant: "ghost", size: "sm", children: "Italic" })}
                              ${Button({ variant: "ghost", size: "sm", children: "Underline" })}
                              ${Separator({ orientation: "vertical", className: "h-6 mx-2" })}
                              ${Button({ variant: "ghost", size: "sm", children: "Left" })}
                              ${Button({ variant: "ghost", size: "sm", children: "Center" })}
                              ${Button({ variant: "ghost", size: "sm", children: "Right" })}
                              ${Separator({ orientation: "vertical", className: "h-6 mx-2" })}
                              ${Button({ variant: "ghost", size: "sm", children: "Link" })}
                              ${Button({ variant: "ghost", size: "sm", children: "Image" })}
                           </div>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium mb-3">Action Bar</h4>
                           <div class="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                              <div class="flex items-center gap-2">
                                 ${Button({ variant: "outline", size: "sm", children: "New" })}
                                 ${Button({ variant: "outline", size: "sm", children: "Open" })}
                                 ${Button({ variant: "outline", size: "sm", children: "Save" })}
                              </div>

                              ${Separator({ orientation: "vertical", className: "h-6" })}

                              <div class="flex items-center gap-2">
                                 ${Button({ variant: "outline", size: "sm", children: "Undo" })}
                                 ${Button({ variant: "outline", size: "sm", children: "Redo" })}
                              </div>

                              ${Separator({ orientation: "vertical", className: "h-6" })}

                              <div class="flex items-center gap-2">
                                 ${Button({ variant: "outline", size: "sm", children: "Help" })}
                                 ${Button({ variant: "outline", size: "sm", children: "Settings" })}
                              </div>
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Toolbar with vertical separators
<div class="flex items-center gap-2 p-2 border border-border rounded-md">
  \${Button({ variant: "ghost", size: "sm", children: "Bold" })}
  \${Button({ variant: "ghost", size: "sm", children: "Italic" })}

  \${Separator({ orientation: "vertical", className: "h-6 mx-2" })}

  \${Button({ variant: "ghost", size: "sm", children: "Left" })}
  \${Button({ variant: "ghost", size: "sm", children: "Center" })}

  \${Separator({ orientation: "vertical", className: "h-6 mx-2" })}

  \${Button({ variant: "ghost", size: "sm", children: "Link" })}
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Custom Styled Separators -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Custom Styled Separators</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <div>
                           <h4 class="text-sm font-medium mb-3">Thick Separator</h4>
                           <p>Content above</p>
                           ${Separator({ className: "border-t-2" })}
                           <p>Content below</p>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium mb-3">Colored Separator</h4>
                           <p>Content above</p>
                           ${Separator({ className: "border-primary" })}
                           <p>Content below</p>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium mb-3">Dashed Separator</h4>
                           <p>Content above</p>
                           ${Separator({ className: "border-dashed" })}
                           <p>Content below</p>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium mb-3">Dotted Separator</h4>
                           <p>Content above</p>
                           ${Separator({ className: "border-dotted border-t-2" })}
                           <p>Content below</p>
                        </div>

                        <div>
                           <h4 class="text-sm font-medium mb-3">Gradient Separator</h4>
                           <p>Content above</p>
                           <div class="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                           <p>Content below</p>
                        </div>
                     </div>
                  `}
                  code=${`// Thick separator
\${Separator({ className: "border-t-2" })}

// Colored separator
\${Separator({ className: "border-primary" })}

// Dashed separator
\${Separator({ className: "border-dashed" })}

// Dotted separator
\${Separator({ className: "border-dotted border-t-2" })}

// Gradient separator (custom HTML)
<div class="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Separator Properties</h3>
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
                                 <td class="py-2 pr-4">orientation</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"horizontal" | "vertical"</td>
                                 <td class="py-2 pr-4 text-muted-foreground">"horizontal"</td>
                                 <td class="py-2 font-sans">Orientation of the separator</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">className</td>
                                 <td class="py-2 pr-4 text-muted-foreground">string</td>
                                 <td class="py-2 pr-4 text-muted-foreground">""</td>
                                 <td class="py-2 font-sans">Additional CSS classes for customization</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div>
                     <h3 class="text-lg font-semibold mb-2">Styling Notes</h3>
                     <ul class="text-sm text-muted-foreground space-y-1">
                        <li>• For vertical separators, ensure the parent container has a defined height</li>
                        <li>• Use className to add spacing (my-4, mx-2) or modify appearance</li>
                        <li>• Custom styles can be applied with Tailwind border utilities</li>
                        <li>• The separator uses the border-border color token by default</li>
                     </ul>
                  </div>
               </div>
            </section>
         </div>
      `;
   }
}

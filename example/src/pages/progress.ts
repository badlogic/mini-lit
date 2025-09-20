import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import { Badge, Button, Progress, Separator } from "@mariozechner/mini-lit";

@customElement("page-progress")
export class ProgressPage extends LitElement {
   @state() animatedProgress = 0;
   @state() isAnimating = false;

   private animationInterval?: number;

   createRenderRoot() {
      return this;
   }

   disconnectedCallback() {
      super.disconnectedCallback();
      if (this.animationInterval) {
         clearInterval(this.animationInterval);
      }
   }

   private startAnimation() {
      if (this.isAnimating) {
         this.stopAnimation();
         return;
      }

      this.isAnimating = true;
      this.animatedProgress = 0;

      this.animationInterval = window.setInterval(() => {
         if (this.animatedProgress >= 100) {
            this.animatedProgress = 0;
         } else {
            this.animatedProgress += 2;
         }
      }, 50);
   }

   private stopAnimation() {
      this.isAnimating = false;
      if (this.animationInterval) {
         clearInterval(this.animationInterval);
         this.animationInterval = undefined;
      }
      this.animatedProgress = 0;
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">Progress</h1>
               <p class="text-muted-foreground">
                  Display progress indicators for tasks, loading states, and operations.
               </p>
            </div>

            <!-- Basic Progress -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic Progress</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Progress({ value: 0 })} ${Progress({ value: 25 })} ${Progress({ value: 50 })}
                        ${Progress({ value: 75 })} ${Progress({ value: 100 })}
                     </div>
                  `}
                  code=${`import { Progress } from "@mariozechner/mini-lit";

// Different progress values
\${Progress({ value: 0 })}
\${Progress({ value: 25 })}
\${Progress({ value: 50 })}
\${Progress({ value: 75 })}
\${Progress({ value: 100 })}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Sizes -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Different Sizes</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div>
                           <p class="text-sm text-muted-foreground mb-2">Defult (h-2)</p>
                           ${Progress({ value: 60 })}
                        </div>
                        <div>
                           <p class="text-sm text-muted-foreground mb-2">Medium (h-4)</p>
                           ${Progress({ value: 60, className: "!h-4" })}
                        </div>
                        <div>
                           <p class="text-sm text-muted-foreground mb-2">Large (h-6)</p>
                           ${Progress({ value: 60, className: "h-6" })}
                        </div>
                     </div>
                  `}
                  code=${`// Small progress bar
\${Progress({ value: 60, className: "h-2" })}

// Default size
\${Progress({ value: 60 })}

// Large progress bar
\${Progress({ value: 60, className: "h-6" })}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Animated Progress -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Animated Progress</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        ${Progress({ value: this.animatedProgress })}

                        <div class="flex items-center justify-between">
                           <span class="text-sm text-muted-foreground"> Progress: ${this.animatedProgress}% </span>
                           ${Button({
                              variant: this.isAnimating ? "destructive" : "default",
                              size: "sm",
                              onClick: () => this.startAnimation(),
                              children: this.isAnimating ? "Stop" : "Start",
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// Animated progress with state management
@state() progress = 0;

// In your template
\${Progress({ value: this.progress })}

// Animation logic
setInterval(() => {
  if (this.progress >= 100) {
    this.progress = 0;
  } else {
    this.progress += 2;
  }
}, 50);`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- With Labels -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Progress with Labels</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-6">
                        <div class="space-y-2">
                           <div class="flex justify-between text-sm">
                              <span>Uploading file...</span>
                              <span class="text-muted-foreground">45%</span>
                           </div>
                           ${Progress({ value: 45 })}
                           <p class="text-xs text-muted-foreground">2.3 MB of 5.1 MB</p>
                        </div>

                        <div class="space-y-2">
                           <div class="flex justify-between text-sm">
                              <span>Processing</span>
                              ${Badge({
                                 variant: "secondary",
                                 children: "In Progress",
                              })}
                           </div>
                           ${Progress({ value: 72 })}
                           <p class="text-xs text-muted-foreground">Step 3 of 4: Analyzing data...</p>
                        </div>

                        <div class="space-y-2">
                           <div class="flex justify-between text-sm">
                              <span class="font-medium">Installation Complete</span>
                              <span class="text-green-600">100%</span>
                           </div>
                           ${Progress({ value: 100, className: "h-2" })}
                        </div>
                     </div>
                  `}
                  code=${`// Progress with percentage label
<div class="space-y-2">
  <div class="flex justify-between text-sm">
    <span>Uploading file...</span>
    <span class="text-muted-foreground">45%</span>
  </div>
  \${Progress({ value: 45 })}
  <p class="text-xs text-muted-foreground">2.3 MB of 5.1 MB</p>
</div>

// With status badge
<div class="space-y-2">
  <div class="flex justify-between text-sm">
    <span>Processing</span>
    \${Badge({ variant: "secondary", children: "In Progress" })}
  </div>
  \${Progress({ value: 72 })}
</div>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Indeterminate -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Indeterminate State</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <p class="text-sm text-muted-foreground">
                           Set value to undefined or use animation classes for indeterminate progress.
                        </p>
                        <div class="space-y-4">
                           <div class="space-y-2">
                              <span class="text-sm">Loading...</span>
                              ${Progress({ value: 30, className: "animate-pulse" })}
                           </div>
                           <div class="space-y-2">
                              <span class="text-sm">Processing...</span>
                              <div class="relative">
                                 ${Progress({ value: 100, className: "opacity-30" })}
                                 <div class="absolute inset-0 overflow-hidden rounded-full">
                                    <div
                                       class="h-full w-1/3 bg-primary animate-[slide_2s_linear_infinite] rounded-full"
                                    ></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <style>
                           @keyframes slide {
                              0% {
                                 transform: translateX(-100%);
                              }
                              100% {
                                 transform: translateX(400%);
                              }
                           }
                        </style>
                     </div>
                  `}
                  code=${`// Pulsing progress
\${Progress({ value: 30, className: "animate-pulse" })}

// Sliding indeterminate animation
<div class="relative">
  \${Progress({ value: 100, className: "opacity-30" })}
  <div class="absolute inset-0 overflow-hidden rounded-full">
    <div class="h-full w-1/3 bg-primary animate-[slide_2s_linear_infinite] rounded-full"></div>
  </div>
</div>

// CSS animation
@keyframes slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Usage Guide -->
            <section>
               <h2 class="text-2xl font-semibold mb-4">Usage Guide</h2>

               <div class="space-y-6">
                  <div>
                     <h3 class="text-lg font-semibold mb-2">Progress Properties</h3>
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
                                 <td class="py-2 pr-4">value</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">0</td>
                                 <td class="py-2 font-sans">Progress value (0-100)</td>
                              </tr>
                              <tr class="border-b border-border">
                                 <td class="py-2 pr-4">max</td>
                                 <td class="py-2 pr-4 text-muted-foreground">number</td>
                                 <td class="py-2 pr-4 text-muted-foreground">100</td>
                                 <td class="py-2 font-sans">Maximum value</td>
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
               </div>
            </section>
         </div>
      `;
   }
}

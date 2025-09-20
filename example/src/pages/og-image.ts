import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import {
   Button,
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   Badge,
   Input,
   Switch,
   Progress,
   Alert,
   AlertDescription,
   Select,
   Label,
   icon,
} from "@mariozechner/mini-lit";
import { Sparkles, Palette, Package, Code, Zap, Heart, Star, GitBranch } from "lucide";

@customElement("page-og-image")
export class OgImagePage extends LitElement {
   createRenderRoot() {
      return this;
   }

   render() {
      return html`
         <div class="w-[1200px] h-[630px] p-[60px] bg-background text-foreground">
            <div class="h-full flex flex-col justify-between">
               <!-- Header -->
               <div class="text-center mb-8">
                  <div class="flex items-center justify-center gap-3 mb-4">
                     ${icon(Sparkles, "xl", "text-primary")}
                     <h1 class="text-6xl font-black tracking-tight">mini-lit</h1>
                     ${icon(Sparkles, "xl", "text-primary")}
                  </div>
                  <p class="text-xl text-muted-foreground">Lightweight Lit components with shadcn-inspired theming</p>
                  <div class="flex gap-2 justify-center mt-4">
                     ${Badge({ children: "v0.1.2", variant: "default" })}
                     ${Badge({ children: "TypeScript", variant: "secondary" })}
                     ${Badge({ children: "Tailwind CSS v4", variant: "secondary" })}
                     ${Badge({ children: "MIT License", variant: "outline" })}
                  </div>
               </div>

               <!-- Components Grid -->
               <div class="grid grid-cols-3 gap-6 flex-1">
                  <!-- Card 1: Buttons & Actions -->
                  ${Card({
                     className: "h-full",
                     children: html`
                        ${CardHeader({
                           children: html`
                              ${CardTitle({
                                 children: html`
                                    <div class="flex items-center gap-2">
                                       ${icon(Zap, "sm")}
                                       <span>Actions</span>
                                    </div>
                                 `,
                              })}
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <div class="space-y-3">
                                 <div class="flex gap-2">
                                    ${Button({ children: "Primary", variant: "default", size: "sm" })}
                                    ${Button({ children: "Secondary", variant: "secondary", size: "sm" })}
                                 </div>
                                 <div class="flex gap-2">
                                    ${Button({ children: "Outline", variant: "outline", size: "sm" })}
                                    ${Button({ children: "Ghost", variant: "ghost", size: "sm" })}
                                 </div>
                                 ${Progress({ value: 60, className: "mt-3" })}
                              </div>
                           `,
                        })}
                     `,
                  })}

                  <!-- Card 2: Forms -->
                  ${Card({
                     className: "h-full",
                     children: html`
                        ${CardHeader({
                           children: html`
                              ${CardTitle({
                                 children: html`
                                    <div class="flex items-center gap-2">
                                       ${icon(Package, "sm")}
                                       <span>Forms</span>
                                    </div>
                                 `,
                              })}
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <div class="space-y-3">
                                 ${Input({
                                    placeholder: "Enter your email",
                                    type: "email",
                                    className: "h-8 text-sm",
                                 })}
                                 ${Select({
                                    placeholder: "Select option",
                                    options: [
                                       { value: "react", label: "React" },
                                       { value: "vue", label: "Vue" },
                                       { value: "lit", label: "Lit" },
                                    ],
                                    className: "h-8 text-sm",
                                    onChange: () => {},
                                 })}
                                 <div class="flex items-center justify-between">
                                    ${Label({ children: "Dark Mode", className: "text-sm" })}
                                    ${Switch({ checked: true })}
                                 </div>
                              </div>
                           `,
                        })}
                     `,
                  })}

                  <!-- Card 3: Feedback -->
                  ${Card({
                     className: "h-full",
                     children: html`
                        ${CardHeader({
                           children: html`
                              ${CardTitle({
                                 children: html`
                                    <div class="flex items-center gap-2">
                                       ${icon(Star, "sm")}
                                       <span>Feedback</span>
                                    </div>
                                 `,
                              })}
                           `,
                        })}
                        ${CardContent({
                           children: html`
                              <div class="space-y-3">
                                 ${Alert({
                                    children: html` ${AlertDescription({ children: "Components ready!" })} `,
                                 })}
                                 <div class="flex gap-2 flex-wrap">
                                    ${Badge({ children: html`${icon(Heart, "xs")} Active` })}
                                    ${Badge({ children: html`${icon(GitBranch, "xs")} v0.1.2`, variant: "secondary" })}
                                 </div>
                              </div>
                           `,
                        })}
                     `,
                  })}
               </div>

               <!-- Footer -->
               <div class="text-center mt-6 space-y-2">
                  <div class="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                     <div class="flex items-center gap-2">
                        ${icon(Palette, "sm")}
                        <span>shadcn/ui themes</span>
                     </div>
                     <div class="flex items-center gap-2">
                        ${icon(Code, "sm")}
                        <span>TypeScript First</span>
                     </div>
                     <div class="flex items-center gap-2">
                        ${icon(Zap, "sm")}
                        <span>Web Components</span>
                     </div>
                  </div>
                  <p class="text-xs text-muted-foreground">github.com/badlogic/mini-lit</p>
               </div>
            </div>
         </div>
      `;
   }
}

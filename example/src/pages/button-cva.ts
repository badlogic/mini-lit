import { Button, icon, iconDOM } from "@mariozechner/mini-lit";
import { ButtonProps, buttonDefaultStyle, buttonDefinition } from "@mariozechner/mini-lit/dist/Button.cva.js";
import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/Button.cva.js"; // Registers mini-button
import { ThumbsUp } from "lucide";
import { ComponentPage } from "./component-page.js";

@customElement("page-button-cva")
export class ButtonCvaPage extends ComponentPage<typeof buttonDefinition> {
   definition = buttonDefinition;
   componentTag = "mini-button";
   componentName = "Button (CVA)";

   getStyles() {
      return buttonDefaultStyle;
   }

   getVariantProps() {
      return {
         variant: {
            base: {
               size: "default" as const,
            },
            options: {
               default: { children: "Default" },
               destructive: { children: "Destructive" },
               outline: { children: "Outline" },
               secondary: { children: "Secondary" },
               ghost: { children: "Ghost" },
               link: { children: "Link" },
            },
         },
         size: {
            base: {
               variant: "default" as const,
            },
            options: {
               default: { children: "Default" },
               sm: { children: "Small" },
               lg: { children: "Large" },
               icon: { variant: "secondary" as const, children: icon(ThumbsUp, "sm") },
            },
         },
      };
   }

   renderCustomUsage(): TemplateResult {
      return html`
         <div class="grid gap-6 md:grid-cols-2">
            <!-- Functional Component -->
            <div class="p-6">
               <h3 class="font-semibold mb-4 text-foreground">Functional Component</h3>
               <code-block
                  code="import { Button } from &quot;@mariozechner/mini-lit&quot;;

Button({
  variant: &quot;default&quot;,
  size: &quot;md&quot;,
  onClick: handleClick,
  children: &quot;Click Me&quot;
})"
                  language="typescript"
               ></code-block>
               <div class="flex gap-2">
                  ${Button({
                     variant: "default",
                     children: "Functional Example",
                     onClick: () => alert("Functional button clicked!"),
                  })}
                  ${Button({
                     variant: "outline",
                     size: "sm",
                     children: "Small Outline",
                  })}
               </div>
            </div>

            <!-- Web Component -->
            <div class="p-6">
               <h3 class="font-semibold mb-4 text-foreground">Web Component</h3>
               <code-block
                  code="import &quot;@mariozechner/mini-lit/dist/Button.cva.js&quot;;

&lt;mini-button
  variant=&quot;default&quot;
  size=&quot;md&quot;
  @click=\${handleClick}
&gt;
  Click Me
&lt;/mini-button&gt;"
                  language="html"
               ></code-block>
               <div class="flex gap-2">
                  <mini-button
                     variant="default"
                     @click=${() => alert("Web component clicked!")}
                  >
                     Web Component Example
                  </mini-button>
                  <mini-button variant="outline" size="sm">
                     Small Outline
                  </mini-button>
               </div>
            </div>

            <!-- Icon Examples -->
            <div class="p-6">
               <h3 class="font-semibold mb-4 text-foreground">With Icons</h3>
               <div class="space-y-3">
                  <div class="flex gap-2">
                     <mini-button variant="default">
                        <span>🚀</span> Launch
                     </mini-button>
                     <mini-button variant="destructive">
                        <span>🗑️</span> Delete
                     </mini-button>
                  </div>
                  <div class="flex gap-2">
                     <mini-button variant="outline" size="sm">
                        <span>⬇️</span> Download
                     </mini-button>
                     <mini-button variant="ghost" size="icon">
                        ⚙️
                     </mini-button>
                  </div>
               </div>
            </div>

            <!-- State Examples -->
            <div class="p-6">
               <h3 class="font-semibold mb-4 text-foreground">States</h3>
               <div class="space-y-3">
                  <div class="flex gap-2">
                     <mini-button disabled>Disabled</mini-button>
                     <mini-button loading>Loading</mini-button>
                     <mini-button loading disabled>Both</mini-button>
                  </div>
                  <p class="text-sm text-muted-foreground mt-3">
                     Loading state automatically disables interaction
                  </p>
               </div>
            </div>
         </div>
      `;
   }
}

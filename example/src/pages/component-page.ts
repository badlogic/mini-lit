import type { ComponentDefinition, ExtractProps, VariantDef } from "@mariozechner/mini-lit/dist/component.js";
import { html, LitElement, render, type TemplateResult } from "lit";
import "@mariozechner/mini-lit/dist/CodeBlock.js"; // Register code-block
import { Card } from "@mariozechner/mini-lit";

// Type for getVariantProps return value - maps each variant to base props and option-specific props
type ExtractVariantOptions<T extends ComponentDefinition> = T["variants"] extends infer V
   ? V extends { [K in keyof V]: VariantDef<any> }
      ? {
           [K in keyof V]: {
              base?: Partial<ExtractProps<T>>;
              options: V[K] extends { options: readonly (infer O)[] }
                 ? { [Option in O as Option extends string ? Option : never]: Partial<ExtractProps<T>> }
                 : never;
           };
        }
      : never
   : never;

export abstract class ComponentPage<T extends ComponentDefinition> extends LitElement {
   abstract definition: T;
   abstract componentTag: string; // e.g., "mini-button"
   abstract componentName: string; // e.g., "Button"

   // Required: Provide props for each variant combination
   // Returns a typed object with base props and options for each variant
   abstract getVariantProps(): ExtractVariantOptions<T>;

   // Optional custom usage examples
   renderCustomUsage?(): TemplateResult;

   // Optional custom styles object for display
   getStyles?(): any;

   createRenderRoot() {
      return this; // Light DOM for Tailwind
   }

   render() {
      return html`
         <div class="p-8 max-w-7xl mx-auto">
            <h1 class="text-3xl font-bold mb-8">${this.componentName} Component</h1>

            <!-- Look Book - All Variations -->
            <section class="mb-12">
               <h2 class="text-xl font-semibold mb-4">Look Book</h2>
               <div class="bg-card text-card-foreground rounded-xl border border-border shadow-xs p-6">
                  ${this.renderLookBook()}
               </div>
            </section>

            <!-- Interactive Playground -->
            <section class="mb-12">
               <h2 class="text-xl font-semibold mb-4">Playground</h2>
               ${this.renderPlayground()}
            </section>

            <!-- Custom Usage Examples (if provided) -->
            ${
               this.renderCustomUsage
                  ? html`
               <section class="mb-12">
                  <h2 class="text-xl font-semibold mb-4">Usage Examples</h2>
                  ${this.renderCustomUsage()}
               </section>
            `
                  : ""
            }

            <!-- Component Definition Table -->
            <section class="mb-12">
               <h2 class="text-xl font-semibold mb-4">Component Definition</h2>
               <div class="bg-card text-card-foreground rounded-xl border border-border shadow-xs overflow-hidden">
                  ${this.renderDefinitionTable()}
               </div>
            </section>

            <!-- Default Styles Section -->
            ${this.renderDefaultStyles()}
         </div>
      `;
   }

   renderDefinitionTable() {
      const variants = this.definition.variants || {};
      const props = this.definition.props || {};

      return html`
         <div class="overflow-x-auto">
            <table class="w-full border-collapse">
               <thead>
                  <tr class="border-b-2 border-border">
                     <th class="text-left p-3 font-semibold text-foreground">Property</th>
                     <th class="text-left p-3 font-semibold text-foreground">Type</th>
                     <th class="text-left p-3 font-semibold text-foreground">Default</th>
                     <th class="text-left p-3 font-semibold text-foreground">Options</th>
                     <th class="text-left p-3 font-semibold text-foreground">Description</th>
                  </tr>
               </thead>
               <tbody>
                  <!-- Variants Section -->
                  ${
                     Object.keys(variants).length > 0
                        ? html`
                     <tr class="border-b border-border bg-primary/5">
                        <td colspan="5" class="p-3 font-semibold text-primary">
                           Variants
                        </td>
                     </tr>
                  `
                        : ""
                  }
                  ${Object.entries(variants).map(
                     ([key, variant]: [string, any]) => html`
                     <tr class="border-b border-border hover:bg-muted/50">
                        <td class="p-3 font-mono text-sm text-foreground">${key}</td>
                        <td class="p-3 text-sm text-muted-foreground">variant</td>
                        <td class="p-3 font-mono text-sm text-primary">
                           "${variant.default}"
                        </td>
                        <td class="p-3">
                           <div class="flex flex-wrap gap-1">
                              ${variant.options.map(
                                 (opt: string) => html`
                                 <span class="px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground">
                                    ${opt}
                                 </span>
                              `,
                              )}
                           </div>
                        </td>
                        <td class="p-3 text-sm text-muted-foreground">
                           ${variant.description || "—"}
                        </td>
                     </tr>
                  `,
                  )}

                  <!-- Props Section -->
                  ${
                     Object.keys(props).length > 0
                        ? html`
                     <tr class="border-b border-border bg-primary/5">
                        <td colspan="5" class="p-3 font-semibold text-primary">
                           Properties
                        </td>
                     </tr>
                  `
                        : ""
                  }
                  ${Object.entries(props).map(
                     ([key, prop]: [string, any]) => html`
                     <tr class="border-b border-border hover:bg-muted/50">
                        <td class="p-3 font-mono text-sm text-foreground">${key}</td>
                        <td class="p-3">
                           <span class="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                              ${prop.type}
                           </span>
                        </td>
                        <td class="p-3 font-mono text-sm text-primary">
                           ${this.formatDefault(prop.default)}
                        </td>
                        <td class="p-3">
                           ${
                              prop.type === "enum" && prop.options
                                 ? html`
                              <div class="flex flex-wrap gap-1">
                                 ${prop.options.map(
                                    (opt: string) => html`
                                    <span class="px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground">
                                       ${opt}
                                    </span>
                                 `,
                                 )}
                              </div>
                           `
                                 : "—"
                           }
                        </td>
                        <td class="p-3 text-sm text-muted-foreground">
                           ${prop.description || "—"}
                        </td>
                     </tr>
                  `,
                  )}
               </tbody>
            </table>
         </div>
      `;
   }

   renderDefaultStyles() {
      const styles = this.getStyles?.() || {};

      if (!styles.base && !styles.variants && !styles.compoundVariants) {
         return "";
      }

      return html`
         <section class="mb-12">
            <h2 class="text-xl font-semibold mb-4">Default Styles</h2>
            <div class="bg-card text-card-foreground rounded-xl border border-border shadow-xs p-6 max-w-4xl">
               ${
                  styles.base
                     ? html`
                  <div class="mb-6">
                     <h3 class="text-sm font-medium text-muted-foreground mb-2">Base</h3>
                     <div class="overflow-x-auto">
                        <code-block
                           .code=${styles.base}
                        ></code-block>
                     </div>
                  </div>
               `
                     : ""
               }

               ${
                  styles.variants
                     ? Object.entries(styles.variants).map(([variantKey, variantStyles]: [string, any]) => {
                          const variantCode = Object.entries(variantStyles)
                             .map(([option, className]) => `${option}: ${className}`)
                             .join("\n");

                          return html`
                     <div class="mb-6">
                        <h3 class="text-sm font-medium text-muted-foreground mb-2">${variantKey}</h3>
                        <div class="overflow-x-auto">
                           <code-block
                              .code=${variantCode}
                           ></code-block>
                        </div>
                     </div>
                  `;
                       })
                     : ""
               }

               ${
                  styles.compoundVariants
                     ? html`
                  <div class="mb-6">
                     <h3 class="text-sm font-medium text-muted-foreground mb-2">Compound Variants</h3>
                     <div class="overflow-x-auto">
                        <code-block
                           .code=${styles.compoundVariants
                              .map((cv: any) => {
                                 const conditions = Object.entries(cv)
                                    .filter(([key]) => key !== "className")
                                    .map(([key, value]) => `${key}: "${value}"`)
                                    .join(", ");
                                 return `[${conditions}]: ${cv.className}`;
                              })
                              .join("\n")}
                        ></code-block>
                     </div>
                  </div>
               `
                     : ""
               }
            </div>
         </section>
      `;
   }

   renderLookBook() {
      const variants = this.definition.variants || {};
      const variantProps = this.getVariantProps();

      // Get all variant options
      const variantEntries = Object.entries(variants);
      if (variantEntries.length === 0) {
         return html`<p class="text-muted-foreground">No variants defined</p>`;
      }

      return html`
         <div class="space-y-8">
            <!-- Show each variant's options -->
            ${variantEntries.map(
               ([variantKey, variant]: [string, any]) => html`
               <div>
                  <h3 class="text-sm font-medium text-muted-foreground mb-4">
                     ${variantKey} variations
                  </h3>
                  <div class="flex flex-wrap gap-3">
                     ${variant.options.map((option: string) => {
                        // Get the props for this variant
                        const variantPropsGroup = (variantProps as any)[variantKey];
                        if (option === "icon") {
                           console.log("Icon variant props group", variantPropsGroup);
                        }
                        if (!variantPropsGroup) {
                           console.warn(`Missing variant props for ${variantKey}`);
                           return null;
                        }

                        // Get defaults for all variants
                        const defaults: any = {};
                        Object.entries(this.definition.variants || {}).forEach(([key, v]: [string, any]) => {
                           defaults[key] = v.default;
                        });

                        // Build final props: defaults -> base variant props -> specific option props -> set current variant option
                        const props = {
                           ...defaults,
                           ...(variantPropsGroup.base || {}),
                           ...(variantPropsGroup.options?.[option] || {}),
                           [variantKey]: option,
                        };

                        return this.renderComponentInstance(props as ExtractProps<T>, option);
                     })}
                  </div>
               </div>
            `,
            )}


         </div>
      `;
   }

   // Render a component instance with the provided props
   renderComponentInstance(props: ExtractProps<T>, label: string) {
      // Create element dynamically to avoid template literal tag issues
      const element = document.createElement(this.componentTag) as any;

      // Set properties directly on the element
      Object.entries<any>(props).forEach(([key, value]) => {
         if (key === "children") {
            // Handle children specially
            if (typeof value === "string") {
               element.textContent = value;
            } else if (value && typeof value === "object" && "_$litType$" in value) {
               // For TemplateResult, render it into a container and append the result
               const container = document.createElement("div");
               render(value as TemplateResult, container);
               // Move all child nodes from container to element
               while (container.firstChild) {
                  element.appendChild(container.firstChild);
               }
            } else if (value && typeof value === "object" && (value as any).nodeType) {
               element.appendChild(value as Node);
            } else if (Array.isArray(value)) {
               (value as any[]).forEach((child: any) => {
                  if (typeof child === "string") {
                     element.appendChild(document.createTextNode(child));
                  } else if (child && typeof child === "object" && child.nodeType) {
                     element.appendChild(child);
                  }
               });
            }
         } else if (value !== undefined) {
            // Set as property instead of attribute for proper type handling
            element[key] = value;
         }
      });

      return html`
         <div class="flex flex-col items-center justify-center min-h-[60px]">
            ${element}
            <div class="text-xs text-muted-foreground mt-2">${label}</div>
         </div>
      `;
   }

   renderPlayground() {
      const variants = this.definition.variants || {};
      const props = this.definition.props || {};
      const playgroundId = `playground-${this.componentTag}`;

      return html`
         ${Card({
            className: "p-0",
            children: html`
               <!-- Preview -->
               <div class="flex items-center justify-center min-h-[120px] p-8">
                  <div id="${playgroundId}-result">
                     <!-- Will be populated by updatePlayground -->
                  </div>
               </div>

               <!-- Divider -->
               <div class="border-t border-border"></div>

               <!-- Controls -->
               <div class="p-6">
                  <div class="max-w-sm space-y-4">

                     <!-- Variant Controls -->
                     ${Object.entries(variants).map(
                        ([key, variant]: [string, any]) => html`
                        <div class="py-3 first:pt-0 last:pb-0">
                           <label class="block text-sm font-medium mb-2 text-muted-foreground">${key}</label>
                           <select
                              data-variant="${key}"
                              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              @change=${() => this.updatePlayground()}
                           >
                              ${variant.options.map(
                                 (opt: string) => html`
                                 <option value="${opt}" ?selected=${opt === variant.default}>
                                    ${opt}
                                 </option>
                              `,
                              )}
                           </select>
                        </div>
                     `,
                     )}

                     <!-- Property Controls -->
                     ${Object.entries(props).map(([key, prop]: [string, any]) => {
                        if (prop.type === "boolean") {
                           return html`
                              <div class="py-3 first:pt-0 last:pb-0">
                                 <div class="flex items-center space-x-2">
                                    <input
                                       type="checkbox"
                                       id="prop-${key}"
                                       data-prop="${key}"
                                       @change=${() => this.updatePlayground()}
                                       class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <label for="prop-${key}" class="text-sm font-medium">
                                       ${key}
                                    </label>
                                 </div>
                              </div>
                           `;
                        } else if (prop.type === "string" && key !== "children") {
                           return html`
                              <div class="py-3 first:pt-0 last:pb-0">
                                 <label class="block text-sm font-medium mb-2 text-muted-foreground">${key}</label>
                                 <input
                                    type="text"
                                    data-prop="${key}"
                                    class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    @input=${() => this.updatePlayground()}
                                    .value=${prop.default || ""}
                                 />
                              </div>
                           `;
                        }
                        return "";
                     })}
                  </div>
               </div>

               <!-- Divider -->
               <div class="border-t border-border"></div>

               <!-- Generated Code -->
               <div class="p-6">
                  <div id="${playgroundId}-code">
                     <!-- Will be populated by updatePlayground -->
                  </div>
               </div>
            `,
         })}
      `;
   }

   firstUpdated() {
      this.updatePlayground();
   }

   updatePlayground() {
      const playgroundId = `playground-${this.componentTag}`;
      const resultDiv = this.querySelector(`#${playgroundId}-result`);
      const codeDiv = this.querySelector(`#${playgroundId}-code`);

      if (!resultDiv || !codeDiv) return;

      // Gather all settings
      const settings: any = {};

      // Get variant selections
      this.querySelectorAll("[data-variant]").forEach((select: any) => {
         settings[select.dataset.variant] = select.value;
      });

      // Get prop values
      this.querySelectorAll("[data-prop]").forEach((input: any) => {
         const key = input.dataset.prop;
         if (input.type === "checkbox") {
            if (input.checked) settings[key] = true;
         } else if (input.value) {
            settings[key] = input.value;
         }
      });

      // Build attribute string
      const attrs = Object.entries(settings)
         .map(([key, value]) => {
            if (value === true) return key;
            if (value === false || value === "") return "";
            return `${key}="${value}"`;
         })
         .filter(Boolean)
         .join(" ");

      // Update result - create element dynamically
      const tag = this.componentTag;
      const element = document.createElement(tag);

      // Set attributes from settings
      Object.entries(settings).forEach(([key, value]) => {
         if (value === true) {
            element.setAttribute(key, "");
         } else if (value !== false && value !== "") {
            element.setAttribute(key, String(value));
         }
      });

      element.textContent = "Example Content";

      // Clear and append to result
      resultDiv.innerHTML = "";
      resultDiv.appendChild(element);

      // Update code display with both functional and web component examples
      const functionalCode = `import { ${this.componentName} } from "@mariozechner/mini-lit";

${this.componentName}({${Object.entries(settings)
         .map(([key, value]) => {
            if (typeof value === "boolean" && value === true) {
               return `\n  ${key}: true`;
            } else if (typeof value === "string") {
               return `\n  ${key}: "${value}"`;
            }
            return "";
         })
         .filter(Boolean)
         .join(",")}${Object.keys(settings).length > 0 ? ",\n  " : "\n  "}children: "Example Content"
});`;

      const webComponentCode = `import "@mariozechner/mini-lit/dist/${this.componentName}.cva.js";

<${tag}${attrs ? " " + attrs : ""}>
  Example Content
</${tag}>`;

      // Use the code-block web component directly
      codeDiv.innerHTML = `
         <div class="space-y-4">
            <div>
               <div class="text-xs font-medium text-muted-foreground mb-2">Functional Component</div>
               <code-block
                  code="${functionalCode.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}"
                  language="typescript"
               ></code-block>
            </div>
            <div>
               <div class="text-xs font-medium text-muted-foreground mb-2">Web Component</div>
               <code-block
                  code="${webComponentCode.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}"
                  language="html"
               ></code-block>
            </div>
         </div>
      `;
   }

   formatDefault(value: any): string {
      if (value === undefined) return "undefined";
      if (value === null) return "null";
      if (typeof value === "string") return `"${value}"`;
      if (typeof value === "boolean") return String(value);
      if (typeof value === "function") return "function";
      return String(value);
   }
}

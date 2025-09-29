import { type IDom, parse } from "html-parse-string";
import { isDirective } from "./directives/directive.js";
import { getSignalAdapter, isSignal } from "./signals.js";

let DEBUG = true;

export function setDebug(value: boolean) {
   DEBUG = value;
}

// Types
type ComponentRegistry = Map<string, any>;
type CompiledTemplate = {
   fn: (...args: any[]) => any;
   template: HTMLTemplateElement;
};
type TrackedEntry = {
   node: Node;
   cleanup?: () => void;
};

// Runtime object
const runtime = {
   insert(parent: Element, accessor: any, marker?: Node | null) {
      const signals = getSignalAdapter();

      // Check if it's a signal or function
      // Support both our Signal wrapper and raw signals from adapter
      if (typeof accessor === "function" || isSignal(accessor) || signals.isRawSignal(accessor)) {
         // This could be reactive - wrap in an effect
         let currentNodes: TrackedEntry[] = [];

         const updateContent = () => {
            // Remove old nodes
            for (const entry of currentNodes) {
               entry.cleanup?.();
               entry.node.parentNode?.removeChild(entry.node);
            }
            currentNodes = [];

            // Get new value
            const value = typeof accessor === "function" ? accessor() : signals.getValue(accessor);

            // Insert new content
            const insertNode = (content: any) => {
               if (content == null || content === "") return;

               const appendNode = (node: Node, cleanup?: () => void) => {
                  if (marker) {
                     parent.insertBefore(node, marker);
                  } else {
                     parent.appendChild(node);
                  }
                  currentNodes.push({ node, cleanup });
               };

               if (Array.isArray(content)) {
                  content.forEach(insertNode);
                  return;
               }

               if (isDirective(content)) {
                  appendNode(content.node, content.unmount);
                  content.mount();
                  return;
               }

               if (content instanceof Node) {
                  appendNode(content);
                  return;
               }

               appendNode(document.createTextNode(String(content)));
            };

            insertNode(value);
         };

         // Use effect to make it reactive
         signals.createEffect(updateContent);
      } else if (isDirective(accessor)) {
         const { node, mount } = accessor;
         if (marker) {
            parent.insertBefore(node, marker);
         } else {
            parent.appendChild(node);
         }
         mount();
      } else if (accessor == null || accessor === "") {
         // Skip null/undefined/empty
         return;
      } else if (Array.isArray(accessor)) {
         // Array of values
         for (const item of accessor) {
            this.insert(parent, item, marker);
         }
      } else if (accessor instanceof Node) {
         // DOM node
         if (marker) {
            parent.insertBefore(accessor, marker);
         } else {
            parent.appendChild(accessor);
         }
      } else {
         // Text content
         const text = document.createTextNode(String(accessor));
         if (marker) {
            parent.insertBefore(text, marker);
         } else {
            parent.appendChild(text);
         }
      }
   },

   createComponent(Comp: any, props: any) {
      if (!Comp) {
         if (DEBUG) console.error("Component not found:", Comp);
         return document.createTextNode("[Component not found]");
      }

      // Handle children - wrap in accessor function if needed
      if (props.children !== undefined && typeof props.children !== "function") {
         const children = props.children;
         props.children = () => children;
      }

      // Create component instance
      const instance = new Comp(props);

      // For debugging
      if (DEBUG) console.log("Creating component:", Comp.name, "with props:", props);

      const container = document.createElement("div");
      instance.mount(container);

      // Return the child nodes directly
      const nodes = Array.from(container.childNodes);
      return nodes.length === 1 ? nodes[0] : nodes;
   },

   addEventListener(node: Element, name: string, handler: any) {
      if (DEBUG) console.log("Adding event listener:", name, "to", node, "handler:", handler);
      node.addEventListener(name, handler);
   },

   setAttribute(node: Element, name: string, value: any) {
      const signals = getSignalAdapter();

      // Check if value is reactive
      if (typeof value === "function" || isSignal(value) || signals.isRawSignal(value)) {
         // Create effect for reactive attributes
         signals.createEffect(() => {
            const actualValue =
               typeof value === "function" ? value() : isSignal(value) ? value.value : signals.getValue(value);

            if (actualValue == null || actualValue === false) {
               node.removeAttribute(name);
            } else if (actualValue === true) {
               // Boolean attribute - set empty string
               node.setAttribute(name, "");
            } else {
               node.setAttribute(name, String(actualValue));
            }
         });
      } else {
         // Static value
         if (value == null || value === false) {
            node.removeAttribute(name);
         } else if (value === true) {
            node.setAttribute(name, "");
         } else {
            node.setAttribute(name, String(value));
         }
      }
   },

   setProperty(node: any, name: string, value: any) {
      const signals = getSignalAdapter();

      // Check if value is reactive (signal or function)
      if (typeof value === "function" || isSignal(value) || signals.isRawSignal(value)) {
         // Create an effect to keep the property in sync
         signals.createEffect(() => {
            const actualValue =
               typeof value === "function" ? value() : isSignal(value) ? value.value : signals.getValue(value);
            node[name] = actualValue;
         });
      } else {
         // Static value, set once
         node[name] = value;
      }
   },

   setRef(node: Element, callback: any) {
      if (typeof callback === "function") {
         callback(node);
      } else if (callback && typeof callback === "object" && "current" in callback) {
         // Support ref objects like React/Preact
         callback.current = node;
      }
   },
};

// Cache for compiled templates
const templateCache = new Map<TemplateStringsArray, CompiledTemplate>();
const componentRegistry: ComponentRegistry = new Map();

// Register components globally
export function registerComponent(name: string, component: any) {
   componentRegistry.set(name, component);
}

export function registerComponents(components: Record<string, any>) {
   Object.entries(components).forEach(([name, comp]) => {
      componentRegistry.set(name, comp);
   });
}

// Helper to check if tag is a component (starts with uppercase)
function isComponent(tagName: string): boolean {
   return /^[A-Z]/.test(tagName);
}

// Generate unique IDs
let idCounter = 1;
function uid() {
   return `_$${idCounter++}`;
}

// Compile AST to JavaScript code
function compileNode(
   node: IDom,
   options: {
      decl: string[];
      exprs: string[];
      counter: number;
      path?: string;
      parent?: string;
      multi?: boolean;
      first?: boolean;
   },
): string {
   if (node.type === "text") {
      if (node.content?.includes("###")) {
         // Dynamic text - use r.insert
         const parts = node.content.split("###");
         const dynamicCount = parts.length - 1;

         // Handle multiple interpolations with markers to maintain position
         if (dynamicCount > 1 && options.parent) {
            for (let i = 0; i < parts.length; i++) {
               // Add static text
               if (parts[i]) {
                  const text = parts[i]
                     .replace(/"/g, '\\"')
                     .replace(/\n/g, "\\n")
                     .replace(/\r/g, "\\r")
                     .replace(/\t/g, "\\t");
                  options.exprs.push(`${options.parent}.appendChild(document.createTextNode("${text}"))`);
               }

               // Add marker and dynamic value (except after last part)
               if (i < parts.length - 1) {
                  const markerId = uid();
                  options.decl.push(`const ${markerId} = document.createComment("")`);
                  options.exprs.push(`${options.parent}.appendChild(${markerId})`);
                  options.exprs.push(`r.insert(${options.parent}, values[${options.counter++}], ${markerId})`);
               }
            }
            return "";
         }

         // Single interpolation or no parent - use existing logic
         const exprs: string[] = [];

         for (let i = 0; i < parts.length; i++) {
            if (parts[i]) {
               exprs.push(
                  `"${parts[i]
                     .replace(/"/g, '\\"')
                     .replace(/\n/g, "\\n")
                     .replace(/\r/g, "\\r")
                     .replace(/\t/g, "\\t")}"`,
               );
            }
            if (i < parts.length - 1) {
               exprs.push(`values[${options.counter++}]`);
            }
         }

         // If we have a parent, insert into it
         if (options.parent) {
            const marker = options.multi && options.path ? options.path : "null";
            if (exprs.length === 1) {
               options.exprs.push(`r.insert(${options.parent}, ${exprs[0]}, ${marker})`);
            } else {
               options.exprs.push(`r.insert(${options.parent}, [${exprs.join(", ")}], ${marker})`);
            }
            return "";
         }
         // Return expression for inline use
         return exprs.length === 1 ? exprs[0] : `[${exprs.join(", ")}]`;
      }
      // Static text
      if (options.parent) {
         const text = node.content
            ?.replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");
         // Skip whitespace-only text nodes between elements
         if (!/^\s*$/.test(node.content || "")) {
            options.exprs.push(`${options.parent}.appendChild(document.createTextNode("${text}"))`);
         }
         return "";
      }
      return `"${node.content
         ?.replace(/"/g, '\\"')
         .replace(/\n/g, "\\n")
         .replace(/\r/g, "\\r")
         .replace(/\t/g, "\\t")}"`;
   }

   if (node.type === "comment") {
      if (node.content === "#") {
         // Dynamic content placeholder
         const value = `values[${options.counter++}]`;
         if (options.parent) {
            const marker = options.multi && options.path ? options.path : "null";
            options.exprs.push(`r.insert(${options.parent}, ${value}, ${marker})`);
            return "";
         }
         return value;
      }
      // Regular comment
      return `document.createComment("${node.content?.replace(/"/g, '\\"')}")`;
   }

   if (node.type === "tag") {
      const tagName = node.name!;

      // Check if it's a component
      if (isComponent(tagName)) {
         const props: string[] = [];

         // Process attributes as props
         if (node.attrs) {
            for (const attr of node.attrs) {
               if (attr.value === "###") {
                  props.push(`"${attr.name}": values[${options.counter++}]`);
               } else if (attr.value.includes("###")) {
                  // Interpolated attribute
                  const parts = attr.value.split("###");
                  const exprs: string[] = [];
                  for (let i = 0; i < parts.length; i++) {
                     if (parts[i]) {
                        exprs.push(
                           `"${parts[i]
                              .replace(/"/g, '\\"')
                              .replace(/\n/g, "\\n")
                              .replace(/\r/g, "\\r")
                              .replace(/\t/g, "\\t")}"`,
                        );
                     }
                     if (i < parts.length - 1) {
                        exprs.push(`values[${options.counter++}]`);
                     }
                  }
                  const expr = exprs.length === 1 ? exprs[0] : exprs.join(" + ");
                  props.push(`"${attr.name}": ${expr}`);
               } else {
                  props.push(
                     `"${attr.name}": "${attr.value
                        .replace(/"/g, '\\"')
                        .replace(/\n/g, "\\n")
                        .replace(/\r/g, "\\r")
                        .replace(/\t/g, "\\t")}"`,
                  );
               }
            }
         }

         // Process children
         if (node.children && node.children.length > 0) {
            const childExprs: string[] = [];
            const childOpts = { ...options, parent: undefined };

            for (const child of node.children) {
               const childCode = compileNode(child, childOpts);
               if (childCode) childExprs.push(childCode);
            }

            if (childExprs.length > 0) {
               // Wrap children in a function like Solid does
               props.push(`"children": () => [${childExprs.join(", ")}]`);
            }
            options.counter = childOpts.counter;
         }

         // Return component call
         const component = `components.get("${tagName}")`;
         const propsObj = props.length > 0 ? `{${props.join(", ")}}` : `{}`;
         return `r.createComponent(${component}, ${propsObj})`;
      }

      // Regular HTML element
      const elemId = uid();
      options.decl.push(`const ${elemId} = document.createElement("${tagName}")`);

      // Process attributes
      if (node.attrs) {
         for (const attr of node.attrs) {
            const name = attr.name;
            const value = attr.value;

            if (name.startsWith("@")) {
               // Event listener
               const eventName = name.slice(1);
               if (value === "###") {
                  options.exprs.push(`r.addEventListener(${elemId}, "${eventName}", values[${options.counter++}])`);
               }
            } else if (name.startsWith(".")) {
               // Property binding
               const propName = name.slice(1);
               if (value === "###") {
                  options.exprs.push(`r.setProperty(${elemId}, "${propName}", values[${options.counter++}])`);
               }
            } else if (name === "ref") {
               // Ref callback
               if (value === "###") {
                  options.exprs.push(`r.setRef(${elemId}, values[${options.counter++}])`);
               }
            } else if (value === "###") {
               // Dynamic attribute
               options.exprs.push(`r.setAttribute(${elemId}, "${name}", values[${options.counter++}])`);
            } else if (value.includes("###")) {
               // Interpolated attribute
               const parts = value.split("###");
               const exprs: string[] = [];
               for (let i = 0; i < parts.length; i++) {
                  if (parts[i]) {
                     exprs.push(
                        `"${parts[i]
                           .replace(/"/g, '\\"')
                           .replace(/\n/g, "\\n")
                           .replace(/\r/g, "\\r")
                           .replace(/\t/g, "\\t")}"`,
                     );
                  }
                  if (i < parts.length - 1) {
                     exprs.push(`values[${options.counter++}]`);
                  }
               }
               const expr = exprs.length === 1 ? exprs[0] : exprs.join(" + ");
               options.exprs.push(`r.setAttribute(${elemId}, "${name}", ${expr})`);
            } else {
               // Static attribute
               options.exprs.push(
                  `r.setAttribute(${elemId}, "${name}", "${value
                     .replace(/"/g, '\\"')
                     .replace(/\n/g, "\\n")
                     .replace(/\r/g, "\\r")
                     .replace(/\t/g, "\\t")}")`,
               );
            }
         }
      }

      // Process children
      if (node.children && node.children.length > 0) {
         // Check if we have multiple dynamic children
         let hasDynamic = false;
         for (const child of node.children) {
            if (
               (child.type === "comment" && child.content === "#") ||
               (child.type === "text" && child.content?.includes("###"))
            ) {
               hasDynamic = true;
               break;
            }
         }

         const childOpts = {
            ...options,
            parent: elemId,
            multi: hasDynamic && node.children.length > 1,
            first: true,
            path: undefined as string | undefined,
         };

         for (const child of node.children) {
            if (
               childOpts.multi &&
               (child.type === "comment" || (child.type === "text" && child.content?.includes("###")))
            ) {
               // For multi mode with dynamic content, create markers
               const marker = uid();
               options.decl.push(`const ${marker} = document.createTextNode("")`);
               options.exprs.push(`${elemId}.appendChild(${marker})`);
               childOpts.path = marker;
            }

            const childCode = compileNode(child, childOpts);
            if (childCode) {
               // If child returns a value (element or component), append it
               if (child.type === "tag") {
                  if (isComponent(child.name!)) {
                     options.exprs.push(`r.insert(${elemId}, ${childCode})`);
                  } else {
                     // Regular element - append it
                     options.exprs.push(`${elemId}.appendChild(${childCode})`);
                  }
               }
               // Text and comments are handled by r.insert in compileNode
            }

            childOpts.first = false;
         }
         options.counter = childOpts.counter;
      }

      return elemId;
   }

   return "";
}

// Compile template strings to function
function compileTemplate(statics: TemplateStringsArray): CompiledTemplate {
   // Join with markers
   let html = "";
   for (let i = 0; i < statics.length - 1; i++) {
      html += statics[i] + "###";
   }
   html += statics[statics.length - 1];

   // Normalize whitespace
   html = html.replace(/>\s+</g, "><").trim();

   // Parse to AST
   const ast = parse(html);

   // Compile AST to JavaScript
   const options = {
      decl: [] as string[],
      exprs: [] as string[],
      counter: 0,
      first: true,
      multi: false,
   };

   const roots: string[] = [];
   for (const node of ast) {
      const code = compileNode(node, options);
      if (code) roots.push(code);
   }

   // Generate function code
   const code = `
    ${options.decl.join(";\n")};
    ${options.exprs.join(";\n")};
    ${roots.length === 1 ? `return ${roots[0]}` : `return [${roots.join(", ")}]`};
  `;

   // Log the generated code for debugging
   if (DEBUG) console.log("Generated code for template:", code);

   // Create function
   const fn = new Function("values", "components", "r", code) as (...args: any[]) => any;

   // Create template element for caching
   const template = document.createElement("template");

   return { fn, template };
}

// Main html template tag
export function html(statics: TemplateStringsArray, ...values: any[]): any {
   // Get or compile template
   let compiled = templateCache.get(statics);
   if (!compiled) {
      compiled = compileTemplate(statics);
      templateCache.set(statics, compiled);
   }

   // Execute compiled function
   const result = compiled.fn(values, componentRegistry, runtime);
   if (DEBUG) console.log("html() returned:", result);
   return result;
}

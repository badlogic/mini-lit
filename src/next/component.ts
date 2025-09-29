/**
 * Base props that all components have
 */
export interface ComponentProps {
   children?: Node | Node[] | string | number | null;
   [key: string]: any;
}

/**
 * Base component class
 */
export abstract class Component<P = ComponentProps> {
   props: P;
   private container?: HTMLElement;
   private dispose?: () => void;

   constructor(props: P) {
      this.props = props;
      this.processSlots();
   }

   protected processSlots(): void {
      const props = this.props as any;

      // Materialize children if it's a function (from compiler)
      if (typeof props.children === "function") {
         props.children = props.children();
      }

      // Process declared slots
      const slots = (this.constructor as any).slots || [];
      if (slots.length > 0 && props.children) {
         const children = Array.isArray(props.children) ? props.children : [props.children];
         const unslotted: any[] = [];

         // Extract slotted children
         for (const child of children) {
            if (child && child.nodeType === 1) {
               const slotName = (child as Element).getAttribute?.("slot");
               if (slotName && slots.includes(slotName)) {
                  props[slotName] = child;
                  (child as Element).removeAttribute("slot");
               } else {
                  unslotted.push(child);
               }
            } else {
               unslotted.push(child);
            }
         }

         // Update children to only unslotted elements
         props.children = unslotted.length === 1 ? unslotted[0] : unslotted;
      }
   }

   abstract render(): RenderResult;

   mount(container: HTMLElement) {
      this.container = container;
      this.update();
      return this;
   }

   update() {
      if (!this.container) return;

      // Clear existing content
      while (this.container.firstChild) {
         this.container.removeChild(this.container.firstChild);
      }

      // Render new content
      const rendered = this.render();
      if (!rendered) return;

      if (Array.isArray(rendered)) {
         for (const node of rendered) {
            if (node instanceof Node) {
               this.container.appendChild(node);
            } else {
               this.container.appendChild(document.createTextNode(String(node)));
            }
         }
      } else if (rendered instanceof Node) {
         this.container.appendChild(rendered);
      } else {
         this.container.appendChild(document.createTextNode(String(rendered)));
      }
   }

   unmount() {
      if (this.dispose) {
         this.dispose();
      }
   }
}

/**
 * Component options including slot declarations
 */
export interface ComponentOptions {
   slots?: string[];
}

/**
 * Valid return types from a component's render function
 */
export type RenderResult = Node | Node[] | string | number | null;

/**
 * Create a functional component
 */
export function createComponent<P extends ComponentProps = ComponentProps>(
   renderFn: (props: P) => RenderResult,
   options: ComponentOptions = {},
): new (
   props: P,
) => Component<P> {
   return class extends Component<P> {
      static slots = options.slots || [];

      render() {
         // Materialize children if it's a function (from compiler)
         const props = { ...this.props } as any;

         if (typeof props.children === "function") {
            props.children = props.children();
         }

         // Process slots if declared
         if ((this.constructor as any).slots.length > 0) {
            const slots = (this.constructor as any).slots;
            const children = Array.isArray(props.children) ? props.children : [props.children];
            const unslotted: any[] = [];

            // Extract slotted children
            for (const child of children) {
               if (child && child.nodeType === 1) {
                  // Element node
                  const slotName = (child as Element).getAttribute?.("slot");
                  if (slotName && slots.includes(slotName)) {
                     // Move to named slot prop
                     props[slotName] = child;
                     (child as Element).removeAttribute("slot");
                  } else {
                     unslotted.push(child);
                  }
               } else {
                  unslotted.push(child);
               }
            }

            // Update children to only unslotted elements
            props.children = unslotted.length === 1 ? unslotted[0] : unslotted;
         }

         return renderFn(props as P);
      }
   };
}

/**
 * Mount a component to a container
 */
export function mount(ComponentClass: new (props: any) => Component, container: HTMLElement, props = {}) {
   const instance = new ComponentClass(props);
   return instance.mount(container);
}

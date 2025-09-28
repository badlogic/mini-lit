import { LitElement, type TemplateResult } from "lit";
import { type ClassValue, tv } from "tailwind-variants";

// ============================================================================
// Component Definition Types
// ============================================================================

// Variant definition - simpler, no type field needed
export type VariantDef<T extends readonly string[]> = {
   options: T;
   default: T[number];
   description?: string;
};

// Prop types for better control generation - properly typed
export type PropDef<T> =
   | {
        type: "string";
        default: string | undefined;
        description?: string;
     }
   | {
        type: "number";
        default: number | undefined;
        description?: string;
     }
   | {
        type: "boolean";
        default: boolean | undefined;
        description?: string;
     }
   | {
        type: "object";
        default: T;
        description?: string;
     }
   | {
        type: "array";
        default: T[] | undefined;
        description?: string;
     }
   | {
        type: "function";
        default: T | undefined;
        description?: string;
     }
   | {
        type: "enum";
        default: T;
        options: readonly T[]; // Required for enum
        description?: string;
     }
   | {
        type: "classname";
        default: string | undefined;
        description?: string;
     }
   | {
        type: "children";
        default: ComponentChild | undefined;
        description?: string;
     };

type PropDictionary = Record<string, PropDef<unknown>>;

export type ComponentChild = TemplateResult | string | number | Node | Node[];

type Simplify<T> = { [K in keyof T]: T[K] } & {};

type BasePropDefinitions = {
   className: Extract<PropDef<unknown>, { type: "classname" }>;
   children: Extract<PropDef<unknown>, { type: "children" }>;
};

const basePropDefinitions: BasePropDefinitions = {
   children: {
      type: "children",
      default: undefined as ComponentChild | undefined,
      description: "Component content",
   },
   className: {
      type: "classname",
      default: undefined,
      description: "Additional CSS classes to apply",
   },
};

type WithBaseProps<P extends PropDictionary | undefined> = (P extends PropDictionary
   ? { [K in keyof P]: P[K] }
   : Record<string, never>) &
   BasePropDefinitions;

type PropValue<P> = P extends { type: "boolean" }
   ? boolean | undefined
   : P extends { type: "string" }
     ? string | undefined
     : P extends { type: "number" }
       ? number | undefined
       : P extends { type: "classname" }
         ? string | undefined
         : P extends { type: "children" }
           ? ComponentChild | undefined
           : P extends { type: "enum"; options: readonly (infer O)[] }
             ? O
             : P extends { default: infer D }
               ? D
               : never;

function mergeBaseProps<P extends PropDictionary | undefined>(props: P): WithBaseProps<P> {
   const userProps = (props ?? {}) as PropDictionary;

   const className =
      userProps.className && userProps.className.type === "classname"
         ? userProps.className
         : basePropDefinitions.className;

   const children =
      userProps.children && userProps.children.type === "children" ? userProps.children : basePropDefinitions.children;

   return {
      ...userProps,
      className,
      children,
   } as WithBaseProps<P>;
}

// Component definition with separated variants and props
export type ComponentDefinition = {
   tag: string;
   slots?: readonly string[]; // Define slots here as the source of truth
   variants?: {
      [key: string]: VariantDef<readonly string[]>;
   };
   props?: PropDictionary;
};

// Auto-generate slot className prop types
type SlotClassNameProps<T extends ComponentDefinition> = T["slots"] extends readonly string[]
   ? {
        [K in T["slots"][number] as K extends "base" ? never : `${K}ClassName`]: {
           type: "classname";
           default: undefined;
           description: string;
        };
     }
   : Record<never, never>;

// ============================================================================
// Type Extraction Utilities
// ============================================================================

// Extract variant types from the variants field
export type ExtractVariants<T extends ComponentDefinition> = T["variants"] extends infer V
   ? V extends { [K in keyof V]: VariantDef<readonly string[]> }
      ? {
           [K in keyof V]?: V[K] extends { options: readonly (infer O)[] } ? O : never;
        }
      : Record<string, never>
   : Record<string, never>;

// Extract prop types from the props field
type NormalizedPropDefinitions<T extends ComponentDefinition> = WithBaseProps<T["props"]> & SlotClassNameProps<T>;

export type ExtractRegularProps<T extends ComponentDefinition> = {
   [K in keyof NormalizedPropDefinitions<T>]?: PropValue<NormalizedPropDefinitions<T>[K]>;
};

// Base props that all components have
export type BaseComponentProps = {
   className?: string;
   children?: ComponentChild;
};

// Extract all props (variants + regular props)
export type ExtractProps<T extends ComponentDefinition> = ExtractVariants<T> & ExtractRegularProps<T>;

// HTMLElement properties that actually exist and would conflict
// We only exclude real properties, not all possible HTML attributes
type ConflictingHTMLElementProps =
   | "accessKey"
   | "className"
   | "contentEditable"
   | "dir"
   | "draggable"
   | "hidden"
   | "id"
   | "lang"
   | "slot"
   | "spellCheck"
   | "style"
   | "tabIndex"
   | "title"
   | "translate";

type ClassPropKeys<T extends ComponentDefinition> = Exclude<
   keyof NormalizedPropDefinitions<T>,
   "children" | ConflictingHTMLElementProps
>;

type DefinitionPropValues<T extends ComponentDefinition> = {
   [K in keyof NormalizedPropDefinitions<T>]: PropValue<NormalizedPropDefinitions<T>[K]>;
};

type RequiredDefinitionProps<T extends ComponentDefinition> = Pick<DefinitionPropValues<T>, ClassPropKeys<T>>;

// Extract props for class implementation: variants remain optional, definition props required
export type ExtractPropsForClass<T extends ComponentDefinition> = ExtractVariants<T> & RequiredDefinitionProps<T>;

// ============================================================================
// Style Types for Tailwind Variants
// ============================================================================

// Map variant definitions to TV variant structure
type MapVariantToTV<V extends VariantDef<readonly string[]>> = V extends { options: readonly (infer O)[] }
   ? Record<O extends string ? O : never, string>
   : never;

type MapVariantsToTV<T extends ComponentDefinition> = T["variants"] extends infer V
   ? V extends { [K in keyof V]: VariantDef<readonly string[]> }
      ? { [K in keyof V]: MapVariantToTV<V[K]> }
      : Record<string, never>
   : Record<string, never>;

// Simple styles for single-element components (no slots)
export type SimpleStyles<T extends ComponentDefinition> = {
   base?: string;
   variants?: MapVariantsToTV<T>;
   defaultVariants?: ExtractVariants<T>;
   compoundVariants?: Array<Partial<ExtractVariants<T>> & { class?: string; className?: string }>;
};

// Slot styles for multi-element components
export type SlotStyles<T extends ComponentDefinition, Slots extends Record<string, string>> = {
   slots: Slots;
   variants?: {
      [K in keyof MapVariantsToTV<T>]: {
         [V in keyof MapVariantsToTV<T>[K]]: Partial<Slots> | string;
      };
   };
   defaultVariants?: ExtractVariants<T>;
   compoundVariants?: Array<Partial<ExtractVariants<T>> & { class?: Partial<Slots> | string; className?: never }>;
};

// Union type for any styles
export type ComponentStyles<T extends ComponentDefinition> = SimpleStyles<T> | SlotStyles<T, Record<string, string>>;

// Legacy ExtractStyles type for backward compatibility
export type ExtractStyles<T extends ComponentDefinition> = SimpleStyles<T>;

// ============================================================================
// Helper Functions
// ============================================================================

// Extract default variant values from definition
export function getDefaultVariants<T extends ComponentDefinition>(def: T): ExtractVariants<T> {
   const defaults: Record<string, unknown> = {};
   if (def.variants) {
      for (const [key, value] of Object.entries(def.variants)) {
         defaults[key] = value.default;
      }
   }
   return defaults as ExtractVariants<T>;
}

// Extract all default values from definition (for spreading as default props)
export function getDefaultProps<T extends ComponentDefinition>(def: T): ExtractProps<T> {
   const defaults: Record<string, unknown> = {};

   // Add variant defaults
   if (def.variants) {
      for (const [key, value] of Object.entries(def.variants)) {
         defaults[key] = value.default;
      }
   }

   // Add prop defaults
   const propDefinitions = mergeBaseProps(def.props);
   for (const [key, value] of Object.entries(propDefinitions)) {
      defaults[key] = value.default;
   }

   return defaults as ExtractProps<T>;
}

// ============================================================================
// Component Factory
// ============================================================================

import { fc } from "./mini.js";

// TV slot return type helper
type TVSlotResult<S> = S extends { slots: infer Slots }
   ? { [K in keyof Slots]: (props?: { class?: ClassValue; className?: ClassValue }) => string }
   : never;

// Extract variant props from our styles structure
export type VariantPropsFromStyles<S> = S extends SimpleStyles<ComponentDefinition>
   ? { [K in keyof NonNullable<S["variants"]>]?: keyof NonNullable<S["variants"]>[K] } & {
        className?: string;
        class?: string;
     }
   : never;

// Conditional render function type based on whether slots exist
export type RenderFunction<Props, Styles> = Styles extends { slots: Record<string, string> }
   ? (props: Props, slots: TVSlotResult<Styles>) => TemplateResult
   : (props: Props, className: (overrides?: ClassValue) => string) => TemplateResult;

// ============================================================================
// New Component Definition API
// ============================================================================

// Define a component - just returns what you give it but with proper typing, including auto-generated props
type ComponentWithBaseProps<T extends ComponentDefinition> = Omit<T, "props"> & {
   props: NormalizedPropDefinitions<T>;
};

export function defineComponent<T extends ComponentDefinition>(definition: T): ComponentWithBaseProps<T> {
   const props = { ...(definition.props || {}) };

   // If slots are defined, auto-generate className props for them
   if (definition.slots) {
      for (const slotName of definition.slots) {
         if (slotName !== "base") {
            const propName = `${slotName}ClassName`;
            if (!props[propName]) {
               props[propName] = {
                  type: "classname",
                  default: undefined,
                  description: `Additional CSS classes for the ${slotName} element`,
               };
            }
         }
      }
   }

   const propsWithBase = mergeBaseProps(props) as NormalizedPropDefinitions<T>;

   return {
      ...definition,
      props: propsWithBase,
   } as ComponentWithBaseProps<T>;
}

// Overloaded styleComponent for type safety
export function styleComponent<T extends ComponentDefinition>(definition: T, styles: SimpleStyles<T>): SimpleStyles<T>;

export function styleComponent<T extends ComponentDefinition, S extends Record<string, string>>(
   definition: T,
   styles: SlotStyles<T, S>,
): SlotStyles<T, S>;

export function styleComponent<T extends ComponentDefinition>(
   _definition: T,
   styles: ComponentStyles<T>,
): ComponentStyles<T> {
   // Just return the styles - defineComponent already handles prop generation
   return styles;
}

// Helper function that just returns the render function but helps with type inference
export function renderComponent<T extends ComponentDefinition, S extends ComponentStyles<T>>(
   _definition: T,
   _styles: S,
   render: RenderFunction<ExtractProps<T>, S>,
): RenderFunction<ExtractProps<T>, S> {
   return render;
}

// Helper to extract variant props from component props
function extractVariantProps<T extends ComponentDefinition>(props: ExtractProps<T>, definition: T): ExtractVariants<T> {
   const variantProps = {} as ExtractVariants<T>;
   if (definition.variants) {
      for (const key of Object.keys(definition.variants)) {
         if (key in props) {
            (variantProps as Record<string, unknown>)[key] = (props as Record<string, unknown>)[key];
         }
      }
   }
   return variantProps;
}

// Type guard to check if styles have slots
function hasSlots<T extends ComponentDefinition>(
   styles: ComponentStyles<T>,
): styles is SlotStyles<T, Record<string, string>> {
   return "slots" in styles;
}

// Create the actual component from definition, styles, and render
export function createComponent<T extends ComponentDefinition, S extends ComponentStyles<T>>(
   definition: T,
   styles: S,
   render: RenderFunction<ExtractProps<T>, S>,
) {
   const tvConfig = {
      ...styles,
      defaultVariants: styles.defaultVariants || getDefaultVariants(definition),
   };

   const tvInstance = tv(tvConfig as Parameters<typeof tv>[0]);

   const component = fc<ExtractProps<T>>((props) => {
      // Apply default values
      const propsWithDefaults = {
         ...getDefaultProps(definition),
         ...props,
      };

      if (hasSlots(styles)) {
         // Multi-element component: pass slots object
         const variantProps = extractVariantProps(propsWithDefaults, definition);
         const slots = tvInstance({ ...variantProps }) as Record<string, (props?: { class?: ClassValue }) => string>;

         // Create slot functions that accept className overrides
         const slotFunctions: Record<string, (overrides?: { class?: ClassValue; className?: ClassValue }) => string> =
            {};
         for (const [slotName, slotFn] of Object.entries(slots)) {
            slotFunctions[slotName] = (overrides?: { class?: ClassValue; className?: ClassValue }) => {
               // Get the slot-specific className prop if it exists
               const slotClassNameProp =
                  slotName === "base"
                     ? propsWithDefaults.className
                     : (propsWithDefaults as Record<string, unknown>)[`${slotName}ClassName`];

               // Combine variant classes with user overrides
               const classOverride = overrides?.class || overrides?.className || (slotClassNameProp as ClassValue);
               return slotFn({ class: classOverride });
            };
         }

         const typedRender = render as (props: ExtractProps<T>, slots: TVSlotResult<S>) => TemplateResult;
         return typedRender(propsWithDefaults, slotFunctions as TVSlotResult<S>);
      } else {
         // Single-element component: pass className function
         const className = (overrides?: ClassValue) => {
            const variantProps = extractVariantProps(propsWithDefaults, definition);
            const userClassName = overrides || propsWithDefaults.className;
            return String(tvInstance({ ...variantProps, class: userClassName }));
         };

         const typedRender = render as (
            props: ExtractProps<T>,
            className: (overrides?: ClassValue) => string,
         ) => TemplateResult;
         return typedRender(propsWithDefaults, className);
      }
   });

   // Attach definition for introspection
   (component as { __def?: T }).__def = definition;

   return component;
}

// ============================================================================
// Lit Component Base Class
// ============================================================================

/**
 * Base class for Lit components using the definition system
 */
export abstract class ComponentLitBase<
   T extends ComponentDefinition,
   S extends ComponentStyles<T> = ComponentStyles<T>,
> extends LitElement {
   protected abstract definition: T;
   protected abstract styles: S;
   protected abstract renderFn: RenderFunction<ExtractProps<T>, S>;

   private _tvInstance?: (
      props?: Record<string, unknown>,
   ) => string | Record<string, (props?: { class?: ClassValue }) => string>;
   private _children?: ComponentChild; // Captured DOM children as nodes or TemplateResult

   createRenderRoot() {
      return this; // Light DOM
   }

   protected get tvInstance() {
      if (!this._tvInstance) {
         const tvConfig = {
            ...this.styles,
            defaultVariants: (this.styles as ComponentStyles<T>).defaultVariants || getDefaultVariants(this.definition),
         };
         this._tvInstance = tv(tvConfig as Parameters<typeof tv>[0]) as (
            props?: Record<string, unknown>,
         ) => string | Record<string, (props?: { class?: ClassValue }) => string>;
      }
      return this._tvInstance;
   }

   connectedCallback() {
      super.connectedCallback();

      // Apply defaults
      const defaults = getDefaultProps(this.definition);
      Object.entries(defaults).forEach(([key, value]) => {
         if ((this as any)[key] === undefined) {
            (this as any)[key] = value;
         }
      });
   }

   render() {
      // Capture children on first render if not already captured
      if (!this._children && this.childNodes.length > 0) {
         // Store the actual DOM nodes - Lit can handle them directly
         this._children = Array.from(this.childNodes);
      }

      const props = {} as ExtractProps<T>;

      // Collect all props
      if (this.definition?.variants) {
         for (const key of Object.keys(this.definition.variants)) {
            (props as Record<string, unknown>)[key] = (this as any)[key];
         }
      }

      if (this.definition?.props) {
         for (const key of Object.keys(this.definition.props)) {
            if (key === "children") {
               (props as Record<string, unknown>)[key] = this._children || Array.from(this.childNodes);
            } else {
               (props as Record<string, unknown>)[key] = (this as any)[key];
            }
         }
      }

      props.className = this.className as ExtractProps<T>["className"];

      if (hasSlots(this.styles)) {
         // Multi-element component: create slots object
         const variantProps = extractVariantProps(props, this.definition);
         const slotsResult = this.tvInstance!({ ...variantProps });
         const slots = (typeof slotsResult === "function" ? {} : slotsResult) as Record<
            string,
            (props?: { class?: ClassValue }) => string
         >;

         // Create slot functions that accept className overrides
         const slotFunctions: Record<string, (overrides?: { class?: ClassValue; className?: ClassValue }) => string> =
            {};
         for (const [slotName, slotFn] of Object.entries(slots)) {
            slotFunctions[slotName] = (overrides?: { class?: ClassValue; className?: ClassValue }) => {
               // Get the slot-specific className prop if it exists
               const slotClassNameProp =
                  slotName === "base" ? props.className : (props as Record<string, unknown>)[`${slotName}ClassName`];

               // Combine variant classes with user overrides
               const classOverride = overrides?.class || overrides?.className || (slotClassNameProp as ClassValue);
               return slotFn({ class: classOverride });
            };
         }

         const typedRender = this.renderFn as (props: ExtractProps<T>, slots: TVSlotResult<S>) => TemplateResult;
         return typedRender(props, slotFunctions as TVSlotResult<S>);
      } else {
         // Single-element component: create className function
         const className = (overrides?: ClassValue) => {
            const variantProps = extractVariantProps(props, this.definition);
            const userClassName = overrides || props.className;
            return String(this.tvInstance!({ ...variantProps, class: userClassName }));
         };

         const typedRender = this.renderFn as (
            props: ExtractProps<T>,
            className: (overrides?: ClassValue) => string,
         ) => TemplateResult;
         return typedRender(props, className);
      }
   }
}

export type { Ref, TemplateResult } from "./mini.js";
export { createRef, html, nothing, ref } from "./mini.js";

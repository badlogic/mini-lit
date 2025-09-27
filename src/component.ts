import { LitElement, type TemplateResult } from "lit";

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

type PropDictionary = Record<string, PropDef<any>>;

export type ComponentChild = TemplateResult | string | number | Node | Node[];

type BasePropDefinitions = {
   className: Extract<PropDef<any>, { type: "classname" }>;
   children: Extract<PropDef<any>, { type: "children" }>;
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

type WithBaseProps<P extends PropDictionary | undefined> = (P extends PropDictionary ? { [K in keyof P]: P[K] } : {}) &
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
   variants?: {
      [key: string]: VariantDef<readonly string[]>;
   };
   props?: PropDictionary;
};

// ============================================================================
// Type Extraction Utilities
// ============================================================================

// Extract variant types from the variants field
export type ExtractVariants<T extends ComponentDefinition> = T["variants"] extends infer V
   ? V extends { [K in keyof V]: VariantDef<any> }
      ? {
           [K in keyof V]?: V[K] extends { options: readonly (infer O)[] } ? O : never;
        }
      : {}
   : {};

// Extract prop types from the props field
type NormalizedPropDefinitions<T extends ComponentDefinition> = WithBaseProps<T["props"]>;

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

type ClassPropKeys<T extends ComponentDefinition> = Exclude<
   keyof NormalizedPropDefinitions<T>,
   "children" | "className"
>;

type DefinitionPropValues<T extends ComponentDefinition> = {
   [K in keyof NormalizedPropDefinitions<T>]: PropValue<NormalizedPropDefinitions<T>[K]>;
};

type RequiredDefinitionProps<T extends ComponentDefinition> = Pick<DefinitionPropValues<T>, ClassPropKeys<T>>;

// Extract props for class implementation: variants remain optional, definition props required
export type ExtractPropsForClass<T extends ComponentDefinition> = ExtractVariants<T> & RequiredDefinitionProps<T>;

// ============================================================================
// Style Types for CVA
// ============================================================================

// Generic type for extracting the config schema structure from our styles
type StylesToConfigSchema<S> = S extends { variants: infer V } ? V : never;

// CVA's ClassProp structure (not exported, so we replicate it)
type ClassProp =
   | { class: string; className?: never }
   | { class?: never; className: string }
   | { class?: never; className?: never };

// Type for compound variants matching CVA's expected structure
export type CompoundVariant<Styles> = {
   [K in keyof StylesToConfigSchema<Styles>]?: StylesToConfigSchema<Styles>[K] extends Record<string, any>
      ? keyof StylesToConfigSchema<Styles>[K] | undefined
      : never;
} & ClassProp;

// Extract just the style mapping for variants plus base styles and compound variants
export type ExtractStyles<T extends ComponentDefinition> = {
   base?: string;
   variants: T["variants"] extends infer V
      ? V extends { [K in keyof V]: VariantDef<any> }
         ? {
              [K in keyof V]: V[K] extends { options: readonly (infer O)[] }
                 ? Record<O extends string ? O : never, string>
                 : never;
           }
         : {}
      : {};
   compoundVariants?: CompoundVariant<ExtractStyles<T>>[];
};

// ============================================================================
// Helper Functions
// ============================================================================

// Extract default variant values from definition
export function getDefaultVariants<T extends ComponentDefinition>(def: T): ExtractVariants<T> {
   const defaults: any = {};
   if (def.variants) {
      for (const [key, value] of Object.entries(def.variants)) {
         defaults[key] = value.default;
      }
   }
   return defaults;
}

// Extract all default values from definition (for spreading as default props)
export function getDefaultProps<T extends ComponentDefinition>(def: T): ExtractProps<T> {
   const defaults: any = {};

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

   return defaults;
}

// ============================================================================
// Component Factory
// ============================================================================

import { cva } from "class-variance-authority";
import { fc } from "./mini.js";

// Extract variant props from our styles structure
export type VariantPropsFromStyles<S extends ExtractStyles<any>> = {
   [K in keyof S["variants"]]?: keyof S["variants"][K];
} & {
   className?: string;
   class?: string;
};

// Type for the render function - properly typed variant props
export type RenderFunction<Props, Styles extends ExtractStyles<any>> = (
   props: Props,
   variants: (props?: VariantPropsFromStyles<Styles>) => string,
) => TemplateResult;

// ============================================================================
// New Component Definition API
// ============================================================================

// Define a component - just returns what you give it but with proper typing
type ComponentWithBaseProps<T extends ComponentDefinition> = Omit<T, "props"> & {
   props: NormalizedPropDefinitions<T>;
};

export function defineComponent<T extends ComponentDefinition>(definition: T): ComponentWithBaseProps<T> {
   const propsWithBase = mergeBaseProps(definition.props) as NormalizedPropDefinitions<T>;

   return {
      ...definition,
      props: propsWithBase,
   } as ComponentWithBaseProps<T>;
}

// Define styles for a component - first param is for typing only
export function styleComponent<T extends ComponentDefinition>(
   _definition: T,
   styles: ExtractStyles<T>,
): ExtractStyles<T> {
   return styles;
}

// Define render function for a component - first param is for typing only
export function renderComponent<T extends ComponentDefinition>(
   _definition: T,
   render: RenderFunction<ExtractProps<T>, ExtractStyles<T>>,
): RenderFunction<ExtractProps<T>, ExtractStyles<T>> {
   return render;
}

// Create the actual component from definition, styles, and render
export function createComponent<T extends ComponentDefinition>(
   definition: T,
   styles: ExtractStyles<T>,
   render: RenderFunction<ExtractProps<T>, ExtractStyles<T>>,
) {
   const variants = cva(styles.base || "", {
      variants: styles.variants,
      defaultVariants: getDefaultVariants(definition),
      compoundVariants: styles.compoundVariants,
   } as any);

   const component = fc<ExtractProps<T>>((props) => {
      // Apply default values
      const propsWithDefaults = {
         ...getDefaultProps(definition),
         ...props,
      };

      // Wrap variants to match our typed signature
      const typedVariants = (variantProps?: VariantPropsFromStyles<ExtractStyles<T>>) => {
         return variants(variantProps as any);
      };

      return render(propsWithDefaults, typedVariants);
   });

   // Attach definition for introspection
   (component as any).__def = definition;

   return component;
}

// ============================================================================
// Lit Component Base Class
// ============================================================================

/**
 * Base class for Lit components using the definition system
 */
export abstract class ComponentLitBase<T extends ComponentDefinition> extends LitElement {
   [key: string]: any;

   protected abstract definition: T;
   protected abstract styles: ExtractStyles<T>;
   protected abstract renderFn: RenderFunction<ExtractProps<T>, ExtractStyles<T>>;

   private _variants?: ReturnType<typeof cva>;
   private _children?: ComponentChild; // Captured DOM children as nodes or TemplateResult

   createRenderRoot() {
      return this; // Light DOM
   }

   protected get variants() {
      if (!this._variants) {
         this._variants = cva(this.styles.base || "", {
            variants: this.styles.variants as any,
            defaultVariants: getDefaultVariants(this.definition) as any,
            compoundVariants: this.styles.compoundVariants as any,
         });
      }
      return this._variants;
   }

   connectedCallback() {
      super.connectedCallback();

      // Apply defaults
      const defaults = getDefaultProps(this.definition);
      Object.entries(defaults).forEach(([key, value]) => {
         if (this[key] === undefined) {
            this[key] = value;
         }
      });
   }

   render() {
      // Capture children on first render if not already captured
      if (!this._children && this.childNodes.length > 0) {
         // Store the actual DOM nodes - Lit can handle them directly
         this._children = Array.from(this.childNodes);
      }
      if (this._children) {
         console.log("Has children", this._children);
      }

      const props = {} as ExtractProps<T>;

      // Collect all props
      if (this.definition?.variants) {
         for (const key of Object.keys(this.definition.variants)) {
            (props as any)[key] = this[key];
         }
      }

      if (this.definition?.props) {
         for (const key of Object.keys(this.definition.props)) {
            if (key === "children") {
               (props as any)[key] = this._children || Array.from(this.childNodes);
            } else {
               (props as any)[key] = this[key];
            }
         }
      }

      props.className = this.className as ExtractProps<T>["className"];

      const variantsFn = (variantProps?: VariantPropsFromStyles<ExtractStyles<T>>) => {
         return this.variants(variantProps as any);
      };

      return this.renderFn(props, variantsFn);
   }
}

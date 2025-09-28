import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
   ComponentLitBase,
   createComponent,
   defineComponent,
   type ExtractProps,
   type ExtractPropsForClass,
   type ExtractStyles,
   renderComponent,
   styleComponent,
} from "./component.js";
import { createRef, ref } from "./mini.js";

// Step 1: Define the component structure
export const checkboxDefinition = defineComponent({
   tag: "mini-checkbox",
   variants: {
      size: {
         options: ["sm", "md", "lg"] as const,
         default: "md",
         description: "Size of the checkbox",
      },
      variant: {
         options: ["default", "primary", "destructive"] as const,
         default: "default",
         description: "Visual style of the checkbox",
      },
   },
   props: {
      checked: {
         type: "boolean",
         default: false,
         description: "Whether the checkbox is checked",
      },
      indeterminate: {
         type: "boolean",
         default: false,
         description: "Whether the checkbox is in indeterminate state",
      },
      disabled: {
         type: "boolean",
         default: false,
         description: "Whether the checkbox is disabled",
      },
      label: {
         type: "string",
         default: undefined as string | undefined,
         description: "Label text for the checkbox",
      },
      name: {
         type: "string",
         default: undefined as string | undefined,
         description: "Name attribute for form submission",
      },
      value: {
         type: "string",
         default: undefined as string | undefined,
         description: "Value attribute for form submission",
      },
      id: {
         type: "string",
         default: undefined as string | undefined,
         description: "ID attribute for the checkbox",
      },
      onChange: {
         type: "function",
         default: undefined as ((checked: boolean) => void) | undefined,
         description: "Change event handler",
      },
   },
});

// Step 2: Define styles with CVA variants
export const checkboxDefaultStyle = styleComponent(checkboxDefinition, {
   base: "flex items-start",
   variants: {
      size: {
         sm: "space-x-1.5",
         md: "space-x-2",
         lg: "space-x-3",
      },
      variant: {
         default: "",
         primary: "",
         destructive: "",
      },
   },
});

// Step 3: Define render function
export const renderCheckbox = renderComponent(checkboxDefinition, (props, variants) => {
   const { size, variant, checked, indeterminate, disabled, label, name, value, id, onChange, className } = props;

   const inputRef = createRef<HTMLInputElement>();
   // Generate a unique ID if label is provided but ID is not
   const checkboxId = id || (label ? `checkbox-${Math.random().toString(36).substr(2, 9)}` : "");

   const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      onChange?.(target.checked);
   };

   // Size-based classes for the checkbox input
   const sizeClasses: Record<"sm" | "md" | "lg", string> = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
   };

   // Variant-based classes for the checkbox
   const variantClasses: Record<"default" | "primary" | "destructive", string> = {
      default: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      primary: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      destructive:
         "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
   };

   const inputClasses =
      `peer ${sizeClasses[size || "md"]} shrink-0 rounded-sm border ${variantClasses[variant || "default"]} ring-offset-background ` +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
      "disabled:cursor-not-allowed disabled:opacity-50";

   // Label size classes
   const labelSizeClasses: Record<"sm" | "md" | "lg", string> = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
   };

   const labelClasses =
      `${labelSizeClasses[size || "md"]} font-medium leading-none text-foreground ` +
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none";

   // Set indeterminate state after render
   if (inputRef.value && indeterminate !== undefined) {
      inputRef.value.indeterminate = indeterminate;
   }

   return html`
      <div class=${variants({ size, variant, className })}>
         <input
            ${ref(inputRef)}
            type="checkbox"
            id="${checkboxId}"
            class="${inputClasses}"
            .checked=${checked || false}
            ?disabled=${disabled}
            name="${name || ""}"
            value="${value || ""}"
            data-state="${checked ? "checked" : "unchecked"}"
            @change=${handleChange}
         />
         ${
            label
               ? html`
               <label for="${checkboxId}" class="${labelClasses}">
                  ${label}
               </label>
            `
               : ""
         }
      </div>
   `;
});

// Step 4: Create checkbox factory
export function createCheckbox(styles: typeof checkboxDefaultStyle) {
   return createComponent(checkboxDefinition, styles, renderCheckbox);
}

// Default functional checkbox export
export const Checkbox = createCheckbox(checkboxDefaultStyle);
export type CheckboxProps = ExtractProps<typeof checkboxDefinition>;
export type CheckboxPropsForClass = ExtractPropsForClass<typeof checkboxDefinition>;
export type CheckboxStyles = ExtractStyles<typeof checkboxDefinition>;

// Concrete class-based checkbox export
@customElement(checkboxDefinition.tag)
export class MiniCheckbox extends ComponentLitBase<typeof checkboxDefinition> implements CheckboxPropsForClass {
   // Declare the variant props
   @property({ type: String })
   size?: CheckboxProps["size"];

   @property({ type: String })
   variant?: CheckboxProps["variant"];

   // Declare the component props with decorators
   @property({ type: Boolean })
   checked: CheckboxProps["checked"] = checkboxDefinition.props.checked.default;

   @property({ type: Boolean })
   indeterminate: CheckboxProps["indeterminate"] = checkboxDefinition.props.indeterminate.default;

   @property({ type: Boolean })
   disabled: CheckboxProps["disabled"] = checkboxDefinition.props.disabled.default;

   @property({ type: String })
   label: CheckboxProps["label"] = checkboxDefinition.props.label.default;

   @property({ type: String })
   name: CheckboxProps["name"] = checkboxDefinition.props.name.default;

   @property({ type: String })
   value: CheckboxProps["value"] = checkboxDefinition.props.value.default;

   @property({ attribute: false })
   onChange: CheckboxProps["onChange"] = checkboxDefinition.props.onChange.default;

   // Provide definition, styles, and render function
   protected definition = checkboxDefinition;
   protected styles = checkboxDefaultStyle;
   protected renderFn = renderCheckbox;
}

// Type declarations for lit-plugin autocomplete
declare global {
   interface HTMLElementTagNameMap {
      "mini-checkbox": MiniCheckbox;
   }
}

import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Check } from "lucide";
import {
   ComponentLitBase,
   createComponent,
   defineComponent,
   type ExtractProps,
   type ExtractPropsForClass,
   renderComponent,
   styleComponent,
} from "./component.js";
import { icon } from "./icons.js";
import { createRef, ref } from "./mini.js";

// Step 1: Define the component structure
export const checkboxDefinition = defineComponent({
   tag: "mini-checkbox",
   slots: ["base", "input", "label", "icon"] as const,
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

// Step 2: Define styles with slots for multi-element component
export const checkboxDefaultStyle = styleComponent(checkboxDefinition, {
   slots: {
      base: "flex items-start",
      input: "peer shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      label: "font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none",
      icon: "flex items-center justify-center text-current",
   },
   variants: {
      size: {
         sm: {
            base: "gap-1.5",
            input: "h-3 w-3",
            label: "text-xs",
         },
         md: {
            base: "gap-2",
            input: "h-4 w-4",
            label: "text-sm",
         },
         lg: {
            base: "gap-3",
            input: "h-5 w-5",
            label: "text-base",
         },
      },
      variant: {
         default: {
            input: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
         },
         primary: {
            input: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
         },
         destructive: {
            input: "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
         },
      },
   },
});

// Step 3: Define render function - now receives slots object for multi-element component
export const renderCheckbox = renderComponent(checkboxDefinition, checkboxDefaultStyle, (props, slots) => {
   const { size, checked, indeterminate, disabled, label, name, value, id, onChange } = props;

   const inputRef = createRef<HTMLInputElement>();
   // Generate a unique ID if label is provided but ID is not
   const checkboxId = id || (label ? `checkbox-${Math.random().toString(36).substr(2, 9)}` : "");

   const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      onChange?.(target.checked);
   };

   // Set indeterminate state after render
   if (inputRef.value && indeterminate !== undefined) {
      inputRef.value.indeterminate = indeterminate;
   }

   // Icon size based on checkbox size
   const iconSize = size === "sm" ? "xs" : size === "lg" ? "sm" : "xs";

   return html`
      <div class=${slots.base()}>
         <div class="relative inline-flex">
            <input
               ${ref(inputRef)}
               type="checkbox"
               id="${checkboxId}"
               class="${slots.input()}"
               .checked=${checked || false}
               ?disabled=${disabled}
               name="${name || ""}"
               value="${value || ""}"
               data-state="${checked ? "checked" : "unchecked"}"
               @change=${handleChange}
            />
            ${
               checked
                  ? html`
                  <span class="${slots.icon()} absolute inset-0 pointer-events-none">
                     ${icon(Check, iconSize)}
                  </span>
               `
                  : ""
            }
         </div>
         ${
            label
               ? html`
               <label for="${checkboxId}" class="${slots.label()}">
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
export type CheckboxStyles = typeof checkboxDefaultStyle;

// Concrete class-based checkbox export
@customElement(checkboxDefinition.tag)
export class MiniCheckbox
   extends ComponentLitBase<typeof checkboxDefinition, typeof checkboxDefaultStyle>
   implements CheckboxPropsForClass
{
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

   @property({ type: String })
   inputClassName: CheckboxProps["inputClassName"] = checkboxDefinition.props.inputClassName.default;

   @property({ type: String })
   labelClassName: CheckboxProps["labelClassName"] = checkboxDefinition.props.labelClassName.default;

   @property({ type: String })
   iconClassName: CheckboxProps["iconClassName"] = checkboxDefinition.props.iconClassName.default;

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

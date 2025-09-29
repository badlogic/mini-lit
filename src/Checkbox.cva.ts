import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Check, Minus } from "lucide";
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

// Step 2: Define styles - single element component now
export const checkboxDefaultStyle = styleComponent(checkboxDefinition, {
   base: "peer shrink-0 appearance-none rounded border border-input bg-background shadow-xs ring-offset-background transition-all outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground hover:border-muted-foreground/50",
   variants: {
      size: {
         sm: "h-3.5 w-3.5",
         md: "h-4 w-4",
         lg: "h-5 w-5",
      },
      variant: {
         default: "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
         primary: "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
         destructive:
            "data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=checked]:text-destructive-foreground",
      },
   },
});

// Step 3: Define render function - now receives className function for single-element component
export const renderCheckbox = renderComponent(checkboxDefinition, checkboxDefaultStyle, (props, className) => {
   const { size, checked, indeterminate, disabled, name, value, id, onChange } = props;

   const handleChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      onChange?.(input.checked);
   };

   // Icon size based on checkbox size
   const iconSize = size === "sm" ? "xs" : size === "lg" ? "sm" : "xs";

   return html`
      <div class="relative inline-flex">
         <input
            type="checkbox"
            id=${ifDefined(id ?? undefined)}
            name=${ifDefined(name ?? undefined)}
            value=${ifDefined(value ?? undefined)}
            .checked=${checked || false}
            ?disabled=${disabled}
            @change=${handleChange}
            data-state="${checked ? "checked" : "unchecked"}"
            class="${className()}"
         />
         ${
            checked || indeterminate
               ? html`
               <span class="absolute inset-0 flex items-center justify-center text-current pointer-events-none">
                  ${indeterminate ? icon(Minus, iconSize) : icon(Check, iconSize)}
               </span>
            `
               : null
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
   name: CheckboxProps["name"] = checkboxDefinition.props.name.default;

   @property({ type: String })
   value: CheckboxProps["value"] = checkboxDefinition.props.value.default;

   @property({ type: String })
   id: string = checkboxDefinition.props.id.default ?? "";

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

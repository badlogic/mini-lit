import { i18n } from "./i18n.js";
import { type BaseComponentProps, fc, html, type TemplateResult } from "./mini.js";

interface LabelProps extends BaseComponentProps {
   htmlFor?: string;
   required?: boolean;
}

const _Label = fc<LabelProps>(({ htmlFor = "", required = false, className = "", children }) => {
   const baseClasses =
      "inline-block text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2";

   return html`
      <label for="${htmlFor}" class="${baseClasses} ${className}">
         ${children} ${required ? html`<span class="text-destructive ml-1">${i18n("*")}</span>` : ""}
      </label>
   `;
});

// Function overloads
export function Label(props: LabelProps): TemplateResult;
export function Label(
   children: TemplateResult | string,
   htmlFor?: string,
   required?: boolean,
   className?: string,
): TemplateResult;
export function Label(
   propsOrChildren: LabelProps | TemplateResult | string,
   htmlFor = "",
   required = false,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _Label(propsOrChildren as LabelProps);
   }
   return _Label({ children: propsOrChildren as TemplateResult | string, htmlFor, required, className });
}

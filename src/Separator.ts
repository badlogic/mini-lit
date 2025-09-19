import { type ComponentPropsWithoutChildren, fc, html, type TemplateResult } from "./mini.js";

export type SeparatorOrientation = "horizontal" | "vertical";

interface SeparatorProps extends ComponentPropsWithoutChildren {
   orientation?: SeparatorOrientation;
   decorative?: boolean;
}

const _Separator = fc<SeparatorProps>(({ orientation = "horizontal", decorative = true, className = "" }) => {
   const orientationClasses = orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]";

   const baseClasses = "shrink-0 bg-border";

   return html`
      <div
         role="${decorative ? "none" : "separator"}"
         aria-orientation="${decorative ? undefined : orientation}"
         class="${baseClasses} ${orientationClasses} ${className}"
      ></div>
   `;
});

// Function overloads
export function Separator(props: SeparatorProps): TemplateResult;
export function Separator(orientation?: SeparatorOrientation, className?: string): TemplateResult;
export function Separator(
   propsOrOrientation: SeparatorProps | SeparatorOrientation = "horizontal",
   className = "",
): TemplateResult {
   if (typeof propsOrOrientation === "object" && propsOrOrientation !== null) {
      return _Separator(propsOrOrientation as SeparatorProps);
   }
   return _Separator({ orientation: propsOrOrientation as SeparatorOrientation, className });
}

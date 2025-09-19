import { type ComponentPropsWithoutChildren, fc, html, type TemplateResult } from "./mini.js";

interface ProgressProps extends ComponentPropsWithoutChildren {
   value?: number;
   max?: number;
   indicatorClassName?: string;
}

const _Progress = fc<ProgressProps>(({ value = 0, max = 100, indicatorClassName = "", className = "" }) => {
   const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

   const baseClasses = "relative h-2 w-full overflow-hidden rounded-full bg-secondary";
   const indicatorClasses = "h-full w-full flex-1 bg-primary transition-all";

   return html`
      <div
         role="progressbar"
         aria-valuemin="0"
         aria-valuemax="${max}"
         aria-valuenow="${value}"
         class="${baseClasses} ${className}"
      >
         <div
            class="${indicatorClasses} ${indicatorClassName}"
            style="transform: translateX(-${100 - percentage}%)"
         ></div>
      </div>
   `;
});

// Function overloads
export function Progress(props: ProgressProps): TemplateResult;
export function Progress(value?: number, max?: number, className?: string): TemplateResult;
export function Progress(propsOrValue: ProgressProps | number = 0, max = 100, className = ""): TemplateResult {
   if (typeof propsOrValue === "object" && propsOrValue !== null) {
      return _Progress(propsOrValue as ProgressProps);
   }
   return _Progress({ value: propsOrValue as number, max, className });
}

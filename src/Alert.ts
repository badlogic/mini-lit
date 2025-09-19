import { type BaseComponentProps, fc, html, type TemplateResult } from "./mini.js";

export type AlertVariant = "default" | "destructive";

export interface AlertProps extends BaseComponentProps {
   variant?: AlertVariant;
}

// Internal FC components with named args
const _Alert = fc<AlertProps>(({ variant = "default", className = "", children }) => {
   const variantClasses = {
      default: "bg-background text-foreground border-border",
      destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
   };

   const baseClasses =
      "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";

   return html` <div class="${baseClasses} ${variantClasses[variant]} ${className}" role="alert">${children}</div> `;
});

const _AlertTitle = fc<BaseComponentProps>(({ className = "", children }) => {
   return html` <h5 class="mb-1 font-medium leading-none tracking-tight ${className}">${children}</h5> `;
});

const _AlertDescription = fc<BaseComponentProps>(({ className = "", children }) => {
   return html` <div class="text-sm [&_p]:leading-relaxed ${className}">${children}</div> `;
});

// Function overloads
export function Alert(props: AlertProps): TemplateResult;
export function Alert(children: TemplateResult | string, variant?: AlertVariant, className?: string): TemplateResult;
export function Alert(
   propsOrChildren: AlertProps | TemplateResult | string,
   variant: AlertVariant = "default",
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _Alert(propsOrChildren as AlertProps);
   }
   return _Alert({ children: propsOrChildren as TemplateResult | string, variant, className });
}

export function AlertTitle(props: BaseComponentProps): TemplateResult;
export function AlertTitle(children: TemplateResult | string, className?: string): TemplateResult;
export function AlertTitle(
   propsOrChildren: BaseComponentProps | TemplateResult | string,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _AlertTitle(propsOrChildren as BaseComponentProps);
   }
   return _AlertTitle({ children: propsOrChildren as TemplateResult | string, className });
}

export function AlertDescription(props: BaseComponentProps): TemplateResult;
export function AlertDescription(children: TemplateResult | string, className?: string): TemplateResult;
export function AlertDescription(
   propsOrChildren: BaseComponentProps | TemplateResult | string,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _AlertDescription(propsOrChildren as BaseComponentProps);
   }
   return _AlertDescription({ children: propsOrChildren as TemplateResult | string, className });
}

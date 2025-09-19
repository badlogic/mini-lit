import { type BaseComponentProps, fc, html, type TemplateResult } from "./mini.js";

export interface CardProps extends BaseComponentProps {
   hoverable?: boolean;
}

// Internal FC components with named args
const _Card = fc<CardProps>(({ hoverable = false, className = "", children }) => {
   const baseClasses = "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border shadow-xs";
   const hoverClasses = hoverable ? "hover:shadow-md transition-shadow" : "";

   return html` <div class="${baseClasses} ${hoverClasses} py-6 ${className}">${children}</div> `;
});

const _CardHeader = fc<BaseComponentProps>(({ className = "", children }) => {
   return html`
      <div
         class="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[ui-card-action]:grid-cols-[1fr_auto] ${className}"
      >
         ${children}
      </div>
   `;
});

const _CardAction = fc<BaseComponentProps>(({ className = "", children }) => {
   return html`
      <div class="col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}">${children}</div>
   `;
});

const _CardTitle = fc<BaseComponentProps>(({ className = "", children }) => {
   return html` <h3 class="leading-none font-semibold ${className}">${children}</h3> `;
});

const _CardDescription = fc<BaseComponentProps>(({ className = "", children }) => {
   return html` <div class="text-muted-foreground text-sm ${className}">${children}</div> `;
});

const _CardContent = fc<BaseComponentProps>(({ className = "", children }) => {
   return html` <div class="px-6 ${className}">${children}</div> `;
});

const _CardFooter = fc<BaseComponentProps>(({ className = "", children }) => {
   return html` <div class="flex items-center px-6 ${className}">${children}</div> `;
});

// Function overloads
export function Card(props: CardProps): TemplateResult;
export function Card(children: TemplateResult | string, hoverable?: boolean, className?: string): TemplateResult;
export function Card(
   propsOrChildren: CardProps | TemplateResult | string,
   hoverable = false,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _Card(propsOrChildren as CardProps);
   }
   return _Card({ children: propsOrChildren as TemplateResult | string, hoverable, className });
}

export function CardHeader(props: BaseComponentProps): TemplateResult;
export function CardHeader(children: TemplateResult | string, className?: string): TemplateResult;
export function CardHeader(
   propsOrChildren: BaseComponentProps | TemplateResult | string,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _CardHeader(propsOrChildren as BaseComponentProps);
   }
   return _CardHeader({ children: propsOrChildren as TemplateResult | string, className });
}

export function CardAction(props: BaseComponentProps): TemplateResult;
export function CardAction(children: TemplateResult | string, className?: string): TemplateResult;
export function CardAction(
   propsOrChildren: BaseComponentProps | TemplateResult | string,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _CardAction(propsOrChildren as BaseComponentProps);
   }
   return _CardAction({ children: propsOrChildren as TemplateResult | string, className });
}

export function CardTitle(props: BaseComponentProps): TemplateResult;
export function CardTitle(children: TemplateResult | string, className?: string): TemplateResult;
export function CardTitle(
   propsOrChildren: BaseComponentProps | TemplateResult | string,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _CardTitle(propsOrChildren as BaseComponentProps);
   }
   return _CardTitle({ children: propsOrChildren as TemplateResult | string, className });
}

export function CardDescription(props: BaseComponentProps): TemplateResult;
export function CardDescription(children: TemplateResult | string, className?: string): TemplateResult;
export function CardDescription(
   propsOrChildren: BaseComponentProps | TemplateResult | string,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _CardDescription(propsOrChildren as BaseComponentProps);
   }
   return _CardDescription({ children: propsOrChildren as TemplateResult | string, className });
}

export function CardContent(props: BaseComponentProps): TemplateResult;
export function CardContent(children: TemplateResult | string, className?: string): TemplateResult;
export function CardContent(
   propsOrChildren: BaseComponentProps | TemplateResult | string,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _CardContent(propsOrChildren as BaseComponentProps);
   }
   return _CardContent({ children: propsOrChildren as TemplateResult | string, className });
}

export function CardFooter(props: BaseComponentProps): TemplateResult;
export function CardFooter(children: TemplateResult | string, className?: string): TemplateResult;
export function CardFooter(
   propsOrChildren: BaseComponentProps | TemplateResult | string,
   className = "",
): TemplateResult {
   if (typeof propsOrChildren === "object" && propsOrChildren !== null && "children" in propsOrChildren) {
      return _CardFooter(propsOrChildren as BaseComponentProps);
   }
   return _CardFooter({ children: propsOrChildren as TemplateResult | string, className });
}

import { html, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { createElement, type IconNode } from "lucide";

// Icon size classes
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<IconSize, string> = {
   xs: "w-3 h-3",
   sm: "w-4 h-4",
   md: "w-5 h-5",
   lg: "w-6 h-6",
   xl: "w-8 h-8",
};

// Helper to create icon with size class
export function icon(lucideIcon: IconNode, size: IconSize = "md", className?: string): TemplateResult {
   return html`${unsafeHTML(iconDOM(lucideIcon, size, className).outerHTML)}`;
}

export function iconDOM(lucideIcon: IconNode, size: IconSize = "md", className?: string): SVGElement {
   const element = createElement(lucideIcon, {
      class: sizeClasses[size] + (className ? " " + className : ""),
   });
   return element;
}

// Export the type for users who need it
export type { IconNode } from "lucide";

import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Menu, X } from "lucide";
import { Button } from "./Button.js";
import { icon } from "./icons.js";
import { type BaseComponentProps, fc } from "./mini.js";

@customElement("mini-sidebar")
export class Sidebar extends LitElement {
   @property({ type: Boolean, attribute: "default-open" }) defaultOpen = false;
   @property({ type: String }) breakpoint: "sm" | "md" | "lg" | "xl" = "md";
   @property({ type: String, attribute: "class-name" }) className = "";
   @property({ type: Object }) logo: TemplateResult | string = "";
   @property({ type: Object }) footer: TemplateResult | string = "";
   @property({ type: Object }) content: TemplateResult | string = "";

   @state() private isOpen = false;

   protected createRenderRoot() {
      return this; // Use light DOM for global styles
   }

   connectedCallback() {
      super.connectedCallback();
      this.isOpen = this.defaultOpen;
   }

   private toggleSidebar = () => {
      this.isOpen = !this.isOpen;
   };

   render() {
      // Responsive classes based on breakpoint
      const hideOnDesktop = {
         sm: "sm:hidden",
         md: "md:hidden",
         lg: "lg:hidden",
         xl: "xl:hidden",
      }[this.breakpoint];

      const showDesktopSidebar = {
         sm: "sm:translate-x-0",
         md: "md:translate-x-0",
         lg: "lg:translate-x-0",
         xl: "xl:translate-x-0",
      }[this.breakpoint];

      // On mobile, use isOpen state. On desktop, always show.
      const mobileTransform = this.isOpen ? "translate-x-0" : "-translate-x-full";

      return html`
         <!-- Mobile menu button (only visible on mobile when sidebar is closed) -->
         <div
            class="${hideOnDesktop} fixed top-4 left-4 z-50 ${this.isOpen
               ? "opacity-0 pointer-events-none"
               : "opacity-100"}"
         >
            ${Button({
               variant: "outline",
               size: "icon",
               onClick: this.toggleSidebar,
               children: icon(Menu, "sm"),
            })}
         </div>

         <!-- Overlay for mobile -->
         <div
            class="fixed inset-0 bg-black/50 z-40 ${hideOnDesktop} ${this.isOpen ? "" : "hidden"}"
            @click=${this.toggleSidebar}
         ></div>

         <!-- Sidebar -->
         <aside
            class="fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border transition-transform duration-300
               ${mobileTransform}
               ${showDesktopSidebar}
               ${this.className}"
         >
            <div class="flex flex-col h-full">
               <!-- Close button for mobile -->
               <div class="${hideOnDesktop} absolute top-4 right-4">
                  ${Button({
                     variant: "ghost",
                     size: "icon",
                     onClick: this.toggleSidebar,
                     children: icon(X, "sm"),
                  })}
               </div>

               <!-- Logo/Header -->
               ${this.logo ? html` <div class="p-4">${this.logo}</div> ` : ""}

               <!-- Scrollable content -->
               <div class="flex-1 overflow-y-auto p-4 space-y-4">${this.content}</div>

               <!-- Footer -->
               ${this.footer ? html` <div class="p-4">${this.footer}</div> ` : ""}
            </div>
         </aside>
      `;
   }
}

export interface SidebarItemProps extends BaseComponentProps {
   href?: string;
   active?: boolean;
   onClick?: () => void;
   children: TemplateResult | string;
}

export const SidebarItem = fc<SidebarItemProps>(({ href, active = false, onClick, children, className = "" }) => {
   const baseClasses = "block px-2 py-1 text-sm rounded transition-colors";
   const activeClasses = active ? "bg-muted text-foreground font-medium" : "hover:bg-muted text-foreground";

   if (href) {
      return html`
         <a href="${href}" class="${baseClasses} ${activeClasses} ${className}" @click=${onClick}> ${children} </a>
      `;
   }

   return html`
      <button class="${baseClasses} ${activeClasses} ${className} w-full text-left" @click=${onClick}>
         ${children}
      </button>
   `;
});

export interface SidebarSectionProps extends BaseComponentProps {
   title?: string;
}

export const SidebarSection = fc<SidebarSectionProps>(({ title, children, className = "" }) => {
   if (!title) {
      // No title means top-level items, no wrapper needed
      return html` <div class="space-y-1 ${className}">${children}</div> `;
   }

   return html`
      <div class="space-y-2 ${className}">
         <h4 class="font-medium text-sm px-2">${title}</h4>
         <nav class="space-y-1 pl-4">${children}</nav>
      </div>
   `;
});

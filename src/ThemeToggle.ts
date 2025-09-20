import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Monitor, Moon, Sun } from "lucide";
import { Button } from "./Button.js";
import { icon } from "./icons.js";

type Theme = "light" | "dark" | "system";

// Apply theme to document
function applyTheme() {
   const theme = (localStorage.getItem("theme") as Theme) || "system";
   const effectiveTheme =
      theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
   document.documentElement.classList.toggle("dark", effectiveTheme === "dark");
}

// Initialize theme on load
if (typeof window !== "undefined") {
   applyTheme();
   // Listen for system theme changes
   window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      const theme = localStorage.getItem("theme") as Theme;
      if (!theme || theme === "system") {
         applyTheme();
      }
   });
}

@customElement("theme-toggle")
export class ThemeToggle extends LitElement {
   @property({ type: Boolean }) includeSystem = false;

   @state() private theme: Theme =
      ((typeof window !== "undefined" ? localStorage.getItem("theme") : null) as Theme) || "system";

   private setTheme(theme: Theme) {
      this.theme = theme;
      if (theme === "system") {
         localStorage.removeItem("theme");
      } else {
         localStorage.setItem("theme", theme);
      }
      applyTheme();
   }

   private cycleTheme() {
      const themes: Theme[] = this.includeSystem ? ["light", "dark", "system"] : ["light", "dark"];
      // If current theme is system but we're not including it, default to light
      let currentTheme = this.theme;
      if (!this.includeSystem && currentTheme === "system") {
         currentTheme = "light";
      }
      const currentIndex = themes.indexOf(currentTheme);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themes.length;
      this.setTheme(themes[nextIndex]);
   }

   private getIcon() {
      switch (this.theme) {
         case "light":
            return icon(Sun, "md");
         case "dark":
            return icon(Moon, "md");
         case "system":
            return icon(Monitor, "md");
      }
   }

   // Remove shadow DOM for consistent styling
   override createRenderRoot() {
      return this;
   }

   override render() {
      return html`
         ${Button({
            variant: "ghost",
            size: "icon",
            onClick: () => this.cycleTheme(),
            children: this.getIcon(),
         })}
      `;
   }
}

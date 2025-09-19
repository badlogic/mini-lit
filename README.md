# mini-lit

Lightweight Lit components with shadcn-inspired theming and Tailwind CSS v4 integration.

## Installation

```bash
npm install @mariozechner/mini-lit
```

## Usage with Vite

1. Install dependencies:

```bash
npm install @mariozechner/mini-lit
npm install -D @tailwindcss/vite
```

2. Configure `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
   plugins: [tailwindcss()],
});
```

3. Create `src/app.css`:

```css
/* Import theme (includes dark mode and utilities) */
@import "@mariozechner/mini-lit/styles/themes/default.css";

/* Tell Tailwind to scan mini-lit components */
@source "../node_modules/@mariozechner/mini-lit/dist";

/* Import Tailwind */
@import "tailwindcss";
```

4. Use components:

```typescript
import { html, render } from "lit";
import { Button, Card, Badge, icon } from "@mariozechner/mini-lit";
import { Send } from "lucide";
import "./app.css";

// Import custom elements
import "@mariozechner/mini-lit/dist/ThemeToggle.js";

const App = () => html`
   <div class="p-8 bg-background text-foreground min-h-screen">
      <theme-toggle class="fixed top-4 right-4"></theme-toggle>

      ${Card(html`
         <h1 class="text-2xl font-bold mb-4">Hello mini-lit!</h1>

         ${Button({
            children: html`
               ${icon(Send, "sm")}
               <span>Send Message</span>
            `,
         })}
      `)}
   </div>
`;

render(App(), document.body);
```

## Components

### Function Components

- `Alert`, `AlertTitle`, `AlertDescription`
- `Badge`
- `Button`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Checkbox`
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`
- `Input`
- `Label`
- `Progress`
- `Select`
- `Separator`
- `Switch`
- `Textarea`

### Custom Elements (Web Components)

- `<theme-toggle>`
- `<language-selector>`
- `<code-block>`
- `<markdown-block>`
- `<copy-button>`
- `<download-button>`

### Utilities

- `icon(lucideIcon, size)` - Render Lucide icons
- `createState(initialState)` - Reactive state management
- `i18n(key)` - Internationalization

## Themes

mini-lit uses shadcn/ui compatible themes with Tailwind CSS v4. The themes follow the shadcn design system with CSS custom properties for colors, borders, and shadows.

Two built-in themes:

- `default` - Clean, modern theme
- `claude` - Claude-inspired theme

Switch themes by importing a different CSS file:

```css
@import "@mariozechner/mini-lit/styles/themes/claude.css";
```

For custom themes and theme generators, see:

- [shadcn/ui themes](https://ui.shadcn.com/themes)
- [Tweakcn theme generator](https://tweakcn.com/)

## Dark Mode

Toggle dark mode via the `dark` class:

```javascript
document.documentElement.classList.toggle("dark");
```

Or use the built-in theme toggle component.

## i18n

```typescript
import { setTranslations, setLanguage } from "@mariozechner/mini-lit";

setTranslations("en", {
   Welcome: "Welcome",
   "Hello {name}": "Hello {name}",
});

setLanguage("en");
```

## Examples

See `/example` directory for a complete working example.

## License

MIT

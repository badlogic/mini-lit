import {
   Component,
   type ComponentProps,
   computed,
   createComponent,
   ensureSignal,
   html,
   mount,
   registerComponents,
   repeat,
   type Signal,
   signal,
} from "@mariozechner/mini-lit/dist/next/index.js";
import { LitElement, html as litHtml } from "lit";
import { customElement } from "lit/decorators.js";

// ============================================================================
// Define Components
// ============================================================================

// Define prop types
interface ButtonProps extends ComponentProps {
   onClick?: () => void;
   variant?: "primary" | "secondary" | "danger";
}

// Button component
const Button = createComponent<ButtonProps>((props) => {
   const variant = props.variant || "primary";
   const classes = {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      danger: "bg-red-500 hover:bg-red-600 text-white",
   };

   console.log("Button rendering with onClick:", props.onClick);
   return html`
    <button
      @click=${props.onClick}
      class="px-4 py-2 rounded font-medium transition-colors ${classes[variant]}"
    >
      ${props.children}
    </button>
  `;
});

interface CardProps extends ComponentProps {
   title?: string;
   header?: Node | Node[] | string | number;
   footer?: Node | Node[] | string | number;
}

// Card component with explicit slot declarations
const Card = createComponent<CardProps>(
   (props) => html`
  <div class="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    ${
       props.header || props.title
          ? html`
      <div class="bg-gray-50 px-4 py-3 border-b">
        ${props.header || html`<h3 class="font-semibold">${props.title}</h3>`}
      </div>
    `
          : ""
    }
    <div class="p-4">
      ${props.children}
    </div>
    ${
       props.footer
          ? html`
      <div class="bg-gray-50 px-4 py-3 border-t">
        ${props.footer}
      </div>
    `
          : ""
    }
  </div>
`,
   { slots: ["header", "footer"] },
);

interface InputProps {
   value?: string | Signal<string>;
   onChange?: (value: string) => void;
   placeholder?: string;
}

// Input component
const Input = createComponent<InputProps>(
   (props) => html`
  <input
    type="text"
    .value=${props.value}
    @input=${(e: Event) => props.onChange?.((e.target as HTMLInputElement).value)}
    placeholder=${props.placeholder || ""}
    class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
`,
);

interface BadgeProps extends ComponentProps {
   count?: number;
   icon?: Node | Node[];
}

// Same component using createComponent - much simpler!
const Badge = createComponent<BadgeProps>(
   (props) => {
      // Use parent's signal if provided, otherwise create our own
      const count = ensureSignal(props.count, 0);

      const handleClick = () => {
         count.value++;
      };

      return html`
      <span
         @click=${handleClick}
         class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
      >
         ${props.icon ? html`<span>${props.icon}</span>` : ""}
         ${props.children}
         <span class="ml-1 px-1 bg-blue-200 rounded">
            ${count}
         </span>
      </span>
   `;
   },
   { slots: ["icon"] },
);

// Register components
registerComponents({
   Button,
   Card,
   Input,
   Badge, // Stateful component registered the same way!
});

// ============================================================================
// Clean Todo App
// ============================================================================

class TodoApp extends Component {
   todos = signal([
      { id: 1, text: "Build reactive framework", done: true },
      { id: 2, text: "Add fine-grained updates", done: true },
      { id: 3, text: "Celebrate!", done: false },
   ]);
   inputValue = signal("");

   addTodo = () => {
      if (this.inputValue.value.trim()) {
         this.todos.value = [...this.todos.value, { id: Date.now(), text: this.inputValue.value, done: false }];
         this.inputValue.value = "";
      }
   };

   toggleTodo = (id: number) => {
      this.todos.value = this.todos.value.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
   };

   todosLeft = computed(() => this.todos.value.filter((t) => !t.done).length);

   render() {
      return html`
      <Card title="Todo App">
        <div class="space-y-4">
          <div class="flex gap-2">
            <input
              type="text"
              .value=${this.inputValue}
              @input=${(e: Event) => {
                 this.inputValue.value = (e.target as HTMLInputElement).value;
              }}
              @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this.addTodo()}
              placeholder="What needs to be done?"
              class="flex-1 px-3 py-2 border rounded"
            />
            <Button onClick=${this.addTodo}>Add</Button>
          </div>

          <ul class="space-y-2">
            ${repeat(
               () => this.todos.value,
               (todo) => todo.id,
               (todo) => html`
                 <li class="flex items-center gap-2">
                   <input
                     type="checkbox"
                     .checked=${todo.done}
                     @change=${() => this.toggleTodo(todo.id)}
                   />
                   <span class="${todo.done ? "line-through text-gray-400" : ""}">
                     ${todo.text}
                   </span>
                 </li>
               `,
            )}
          </ul>

          <div class="text-sm text-gray-600">
            ${this.todosLeft} ${() => (this.todosLeft.value === 1 ? "item" : "items")} left
          </div>
        </div>
      </Card>
    `;
   }
}

// ============================================================================
// Ref Example - Focus Management
// ============================================================================

class RefExample extends Component {
   inputRef: HTMLInputElement | null = null;
   textValue = signal("");

   focusAndSelect = () => {
      this.inputRef?.focus();
      this.inputRef?.select();
   };

   render() {
      return html`
      <Card title="Refs - Direct DOM Access">
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            Use refs to access DOM elements directly for focus, scroll, etc.
          </p>

          <div class="flex gap-2">
            <input
              ref=${(el: HTMLInputElement) => {
                 this.inputRef = el;
              }}
              type="text"
              .value=${this.textValue}
              @input=${(e: Event) => {
                 this.textValue.value = (e.target as HTMLInputElement).value;
              }}
              placeholder="Type something..."
              class="flex-1 px-3 py-2 border rounded"
            />
            <Button onClick=${this.focusAndSelect}>Focus & Select</Button>
          </div>

          <div class="text-xs text-gray-500">
            Current value: "${this.textValue}"
          </div>
        </div>
      </Card>
    `;
   }
}

// ============================================================================
// Stateful Component Example
// ============================================================================

class StatefulBadge extends Component {
   count = signal(0);

   constructor(props: any) {
      super(props);
      if (props.initialCount !== undefined) {
         this.count.value = props.initialCount;
      }
   }

   render() {
      return html`
      <Card title="Stateful Component">
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            Components can have internal state using signals
          </p>

          <Badge count=${5}>
            <span slot="icon">📝</span>
            Static Count: 5
          </Badge>

          <div
            @click=${() => this.count.value++}
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded cursor-pointer hover:bg-blue-200"
          >
            <span>🚀</span>
            <span>Dynamic Count: ${this.count}</span>
          </div>

          <Button onClick=${() => {
             this.count.value = 0;
          }} variant="secondary">
            Reset
          </Button>
        </div>
      </Card>
    `;
   }
}

// ============================================================================
// Slots Example
// ============================================================================

class SlotsExample extends Component {
   render() {
      return html`
      <Card title="Slots Example">
        <p class="mb-4">Components can have named slots for content distribution:</p>

        <Card>
          <div slot="header" class="font-bold text-blue-600">
            Custom Header via Slot
          </div>

          <p>This is the main content (children)</p>
          <p class="text-sm text-gray-600">No slot attribute = goes to children</p>

          <div slot="footer" class="text-xs italic">
            Custom Footer via Slot
          </div>
        </Card>
      </Card>
    `;
   }
}

// ============================================================================
// Demo Page
// ============================================================================

@customElement("page-html-template-demo")
export class HtmlTemplateDemoPage extends LitElement {
   createRenderRoot() {
      return this;
   }

   firstUpdated() {
      // Mount all examples
      const mounts = [
         { selector: "#todo-app", component: TodoApp },
         { selector: "#ref-example", component: RefExample },
         { selector: "#stateful-example", component: StatefulBadge },
         { selector: "#slots-example", component: SlotsExample },
      ];

      for (const { selector, component } of mounts) {
         const container = this.querySelector(selector);
         if (container) mount(component, container as HTMLElement);
      }
   }

   render() {
      return litHtml`
      <div class="p-8 max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">Component-Aware HTML Templates</h1>
          <p class="text-gray-600">
            Clean component syntax in template literals - no JSX, no build step!
            Components are detected by uppercase first letter and transformed at runtime.
          </p>
        </div>

        <div class="mb-8 p-4 bg-green-50 rounded-lg">
          <h2 class="font-semibold mb-2">✨ The Dream Syntax:</h2>
          <pre class="text-sm bg-white p-3 rounded border"><code>html\`
  &lt;Card title="My Card"&gt;
    &lt;Button onClick=\${handler} variant="primary"&gt;
      Click me
    &lt;/Button&gt;
  &lt;/Card&gt;
\`</code></pre>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <div id="todo-app"></div>
          <div id="ref-example"></div>
          <div id="stateful-example"></div>
          <div id="slots-example"></div>
        </div>

        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 class="font-semibold mb-2">How It Works:</h2>
          <ul class="text-sm space-y-1">
            <li>• Uses <code>html-parse-string</code> (same as Solid.js) to parse templates</li>
            <li>• Detects components by uppercase first letter</li>
            <li>• Compiles template to optimized JavaScript on first use</li>
            <li>• Caches compiled result for reuse</li>
            <li>• No build step required!</li>
          </ul>
        </div>
      </div>
    `;
   }
}

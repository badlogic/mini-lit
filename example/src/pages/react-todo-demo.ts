import { Component, computed, html, mount, repeat, signal } from "@mariozechner/mini-lit/dist/next/index.js";
import { LitElement, html as litHtml } from "lit";
import { customElement } from "lit/decorators.js";
import React from "react";
import { createRoot } from "react-dom/client";
import { ReactTodoApp } from "../components/ReactTodoApp.js";

// Mini-Lit Todo App Component
class MiniLitTodoApp extends Component {
   todos = signal([
      { id: 1, text: "Build reactive framework", done: true },
      { id: 2, text: "Add fine-grained updates", done: true },
      { id: 3, text: "Celebrate!", done: false },
   ]);
   inputValue = signal("");

   addTodo = () => {
      if (this.inputValue.value.trim()) {
         this.todos.value = [
            ...this.todos.value,
            {
               id: Date.now(),
               text: this.inputValue.value,
               done: false,
            },
         ];
         this.inputValue.value = "";
      }
   };

   toggleTodo = (id: number) => {
      this.todos.value = this.todos.value.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
   };

   todosLeft = computed(() => this.todos.value.filter((t) => !t.done).length);

   render() {
      console.log("Mini-Lit TodoApp initial render only!");

      return html`
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
             <button
               @click=${this.addTodo}
               class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
             >
               Add
             </button>
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
       `;
   }
}

@customElement("page-react-todo-demo")
export class ReactTodoDemoPage extends LitElement {
   createRenderRoot() {
      return this;
   }

   firstUpdated() {
      // Mount Mini-Lit Todo App
      const minilitRoot = this.querySelector("#minilit-root");
      if (minilitRoot) {
         mount(MiniLitTodoApp, minilitRoot as HTMLElement);
      }

      // Mount React Todo App
      const reactRoot = this.querySelector("#react-root");
      if (reactRoot) {
         const root = createRoot(reactRoot);
         root.render(React.createElement(ReactTodoApp));
      }
   }

   render() {
      return litHtml`
      <div class="p-8 max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">React vs Mini-Lit DOM Updates Comparison</h1>
          <p class="text-gray-600 mb-4">
            Open DevTools Elements panel and watch which DOM nodes flash when interacting with the todos.
            React re-renders the entire component, our framework only updates what changed.
          </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 class="text-xl font-semibold mb-4">React Todo App</h2>
            <div id="react-root" class="border rounded-lg p-4"></div>
            <div class="mt-2 text-sm text-gray-600">
              ⚠️ Watch how typing causes entire list to flash (re-render)
            </div>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Mini-Lit Todo App</h2>
            <div id="minilit-root" class="border rounded-lg p-4"></div>
            <div class="mt-2 text-sm text-gray-600">
              ✅ Only the specific changed elements update
            </div>
          </div>
        </div>

        <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 class="font-semibold mb-2">How to observe the difference:</h3>
          <ol class="list-decimal list-inside space-y-1 text-sm">
            <li>Open Chrome DevTools → Elements tab</li>
            <li>Click the three dots menu → More tools → Rendering</li>
            <li>Enable "Paint flashing" to see what gets repainted</li>
            <li>Type in the input fields and watch the difference</li>
            <li>Toggle todos and see React re-render the entire list</li>
          </ol>
        </div>
      </div>
    `;
   }
}

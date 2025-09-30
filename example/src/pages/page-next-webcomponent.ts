import { component, defaultProps, effect, enableMiniLitDebug, html, ref, signal } from "../next-webcomponent.js";

enableMiniLitDebug(true);

const toneTokens = [
   "--primary",
   "--accent-foreground",
   "--destructive",
   "--chart-1",
   "--chart-2",
   "--chart-3",
   "--chart-4",
   "--chart-5",
] as const;
type ToneToken = (typeof toneTokens)[number];

// =======================================================================================
// LEVEL 1: Basic Static Component
// =======================================================================================
const SimpleCard = component("simple-card", () => {
   return html`
      <div class="p-4 rounded-lg border bg-card text-card-foreground">
         <h3 class="text-lg font-semibold">Level 1: Static Component</h3>
         <p class="text-sm text-muted-foreground mt-2">
            A simple static component with no interactivity or state.
         </p>
      </div>
   `;
});

// =======================================================================================
// LEVEL 2: Component with Props
// =======================================================================================
interface GreetingProps {
   name?: string;
   tone?: ToneToken;
}

const GreetingCard = component<GreetingProps>("greeting-card", (props) => {
   const resolved = defaultProps(props, {
      name: "World",
      tone: "--primary" as ToneToken,
   });

   return html`
      <div class="p-4 rounded-lg border-2 bg-card" style=${() => `border-color: var(${resolved.tone()});`}>
         <h3 class="text-lg font-semibold">Level 2: Props & Defaults</h3>
         <p class="text-xl mt-2" style=${() => `color: var(${resolved.tone()});`}>
            Hello, ${() => resolved.name()}!
         </p>
      </div>
   `;
});

// =======================================================================================
// LEVEL 3: Basic Reactivity
// =======================================================================================
const ClickCounter = component("click-counter", () => {
   const count = signal(0);

   return html`
      <div class="p-4 rounded-lg border bg-card">
         <h3 class="text-lg font-semibold">Level 3: Basic Reactivity</h3>
         <p class="text-2xl font-mono my-3">${() => count.value}</p>
         <button
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            @click=${() => {
               count.value++;
            }}
         >
            Click me
         </button>
      </div>
   `;
});

// =======================================================================================
// LEVEL 4: Computed Values & Effects
// =======================================================================================
const DoubleCounter = component("double-counter", () => {
   const count = signal(0);
   const doubled = signal(0);

   effect(() => {
      doubled.value = count.value * 2;
   });

   return html`
      <div class="p-4 rounded-lg border bg-card space-y-3">
         <h3 class="text-lg font-semibold">Level 4: Computed Values</h3>
         <div class="flex gap-4 items-center">
            <div>
               <p class="text-sm text-muted-foreground">Count</p>
               <p class="text-2xl font-mono">${() => count.value}</p>
            </div>
            <div class="text-2xl">→</div>
            <div>
               <p class="text-sm text-muted-foreground">Doubled</p>
               <p class="text-2xl font-mono text-accent-foreground">${() => doubled.value}</p>
            </div>
         </div>
         <button
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            @click=${() => {
               count.value++;
            }}
         >
            Increment
         </button>
      </div>
   `;
});

// =======================================================================================
// LEVEL 5: Lifecycle Hooks
// =======================================================================================
const LifecycleDemo = component("lifecycle-demo", (_props, { onMount }) => {
   const status = signal("Initializing...");
   const mountTime = signal<Date | null>(null);

   onMount(() => {
      status.value = "Mounted";
      mountTime.value = new Date();
      console.log("[Level 5] Component mounted");

      return () => {
         console.log("[Level 5] Component cleanup");
      };
   });

   return html`
      <div class="p-4 rounded-lg border bg-card">
         <h3 class="text-lg font-semibold">Level 5: Lifecycle Hooks</h3>
         <p class="mt-2">Status: <span class="font-mono">${() => status.value}</span></p>
         ${() =>
            mountTime.value
               ? html`
            <p class="text-sm text-muted-foreground">
               Mounted at: ${mountTime.value.toLocaleTimeString()}
            </p>
         `
               : null}
      </div>
   `;
});

// =======================================================================================
// LEVEL 6: DOM Refs & Direct Manipulation
// =======================================================================================
const InputFocus = component("input-focus", (_props, { onMount }) => {
   const inputRef = ref<HTMLInputElement>();
   const focusCount = signal(0);

   onMount(() => {
      inputRef.current?.focus();
   });

   return html`
      <div class="p-4 rounded-lg border bg-card space-y-3">
         <h3 class="text-lg font-semibold">Level 6: DOM Refs</h3>
         <input
            ref=${inputRef}
            class="w-full px-3 py-2 rounded-lg border bg-background"
            placeholder="I'll be focused on mount..."
            @focus=${() => {
               focusCount.value++;
            }}
         />
         <p class="text-sm text-muted-foreground">
            Focus count: ${() => focusCount.value}
         </p>
         <button
            class="px-3 py-1 bg-accent text-accent-foreground rounded-lg"
            @click=${() => inputRef.current?.focus()}
         >
            Focus Input
         </button>
      </div>
   `;
});

// =======================================================================================
// LEVEL 7: Parent-Child Communication
// =======================================================================================
interface SmartCounterProps {
   label?: string;
   tone?: ToneToken;
   value?: () => number;
   initialValue?: number;
   onChange?: (value: number) => void;
   onReset?: () => void;
}

const SmartCounter = component<SmartCounterProps>("smart-counter", (props) => {
   const resolved = defaultProps(props, {
      label: "Counter",
      tone: "--primary" as ToneToken,
      value: () => 0,
      initialValue: 0,
   });

   const isControlled = typeof resolved.onChange === "function";
   const localValue = signal(resolved.initialValue());

   const valueAccessor = () => resolved.value();
   const initialAccessor = () => resolved.initialValue();

   const getValue = (): number => {
      return isControlled ? valueAccessor() : localValue.value;
   };

   const updateValue = (newValue: number) => {
      if (isControlled) {
         resolved.onChange?.(newValue);
      } else {
         localValue.value = newValue;
      }
   };

   return html`
      <div class="p-3 rounded-lg border-2" style=${() => `border-color: var(${resolved.tone()});`}>
         <p class="text-sm font-semibold">${() => resolved.label()}</p>
         <p class="text-2xl font-mono my-2">${() => getValue()}</p>
         <div class="flex gap-2">
            <button
               class="px-2 py-1 text-sm bg-primary text-primary-foreground rounded"
               @click=${() => updateValue(getValue() + 1)}
            >
               +
            </button>
            <button
               class="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded"
               @click=${() => updateValue(getValue() - 1)}
            >
               -
            </button>
            <button
              class="px-2 py-1 text-sm bg-muted text-muted-foreground rounded"
              @click=${() => {
                 updateValue(initialAccessor());
                 resolved.onReset?.();
              }}
            >
               Reset
            </button>
         </div>
      </div>
   `;
});

const CounterParent = component("counter-parent", () => {
   const counterAValue = signal(0);
   const counterBValue = signal(10);
   const resetCount = signal(0);
   const total = () => counterAValue.value + counterBValue.value;

   return html`
      <div class="p-4 rounded-lg border bg-card space-y-3">
         <h3 class="text-lg font-semibold">Level 7: Parent-Child Communication</h3>
         <div class="p-3 bg-muted rounded-lg">
            <p class="text-sm">Total: <span class="font-bold">${() => total()}</span></p>
            <p class="text-sm">Resets: <span class="font-bold">${() => resetCount.value}</span></p>
         </div>
         <div class="grid grid-cols-2 gap-3">
            ${SmartCounter({
               label: "Counter A",
               tone: "--chart-1" as ToneToken,
               value: () => counterAValue.value,
               initialValue: 0,
               onChange: (value) => {
                  counterAValue.value = value;
               },
               onReset: () => {
                  counterAValue.value = 0;
                  resetCount.value++;
               },
            })}
            ${SmartCounter({
               label: "Counter B",
               tone: "--chart-2" as ToneToken,
               value: () => counterBValue.value,
               initialValue: 10,
               onChange: (value) => {
                  counterBValue.value = value;
               },
               onReset: () => {
                  counterBValue.value = 10;
                  resetCount.value++;
               },
            })}
         </div>
      </div>
   `;
});

// =======================================================================================
// LEVEL 8: Timers & Cleanup
// =======================================================================================
interface TimerProps {
   interval?: number;
   format?: "seconds" | "time";
}

const AdvancedTimer = component<TimerProps>("advanced-timer", (props, { onMount }) => {
   const resolved = defaultProps(props, {
      interval: 1000,
      format: "seconds" as const,
   });

   const elapsed = signal(0);
   const isRunning = signal(false);
   let intervalId: number | null = null;

   const start = () => {
      if (!isRunning.value) {
         isRunning.value = true;
         intervalId = window.setInterval(() => {
            elapsed.value++;
         }, resolved.interval());
      }
   };

   const stop = () => {
      if (intervalId !== null) {
         window.clearInterval(intervalId);
         intervalId = null;
         isRunning.value = false;
      }
   };

   const reset = () => {
      stop();
      elapsed.value = 0;
   };

   onMount(() => {
      return () => {
         if (intervalId !== null) {
            window.clearInterval(intervalId);
         }
      };
   });

   const formatTime = () => {
      if (resolved.format() === "time") {
         const mins = Math.floor(elapsed.value / 60);
         const secs = elapsed.value % 60;
         return `${mins}:${secs.toString().padStart(2, "0")}`;
      }
      return `${elapsed.value}s`;
   };

   return html`
      <div class="p-4 rounded-lg border bg-card space-y-3">
         <h3 class="text-lg font-semibold">Level 8: Timers & Cleanup</h3>
         <div class="text-3xl font-mono text-center py-2">
            ${formatTime}
         </div>
         <div class="flex gap-2 justify-center">
            <button
               class="px-3 py-1 bg-primary text-primary-foreground rounded-lg"
               @click=${start}
               ?disabled=${() => isRunning.value}
            >
               Start
            </button>
            <button
               class="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg"
               @click=${stop}
               ?disabled=${() => !isRunning.value}
            >
               Stop
            </button>
            <button
               class="px-3 py-1 bg-muted text-muted-foreground rounded-lg"
               @click=${reset}
            >
               Reset
            </button>
         </div>
         <p class="text-xs text-center text-muted-foreground">
            Status: ${() => (isRunning.value ? "Running" : "Stopped")}
         </p>
      </div>
   `;
});

// =======================================================================================
// LEVEL 9: Dynamic Lists & Conditional Rendering
// =======================================================================================
interface Todo {
   id: number;
   text: string;
   done: boolean;
}

const TodoList = component("todo-list", () => {
   const todos = signal<Todo[]>([]);
   const inputRef = ref<HTMLInputElement>();
   const filter = signal<"all" | "active" | "completed">("all");
   let nextId = 1;

   const addTodo = () => {
      if (inputRef.current?.value) {
         todos.value = [
            ...todos.value,
            {
               id: nextId++,
               text: inputRef.current.value,
               done: false,
            },
         ];
         inputRef.current.value = "";
      }
   };

   const toggleTodo = (id: number) => {
      todos.value = todos.value.map((todo) => {
         return todo.id === id ? { ...todo, done: !todo.done } : todo;
      });
   };

   const deleteTodo = (id: number) => {
      todos.value = todos.value.filter((todo) => todo.id !== id);
   };

   const filteredTodos = () => {
      switch (filter.value) {
         case "active":
            return todos.value.filter((t) => !t.done);
         case "completed":
            return todos.value.filter((t) => t.done);
         default:
            return todos.value;
      }
   };

   const stats = () => {
      const total = todos.value.length;
      const completed = todos.value.filter((t) => t.done).length;
      return { total, completed, active: total - completed };
   };

   return html`
      <div class="p-4 rounded-lg border bg-card space-y-4">
         <h3 class="text-lg font-semibold">Level 9: Dynamic Lists</h3>

         <div class="flex gap-2">
            <input
               ref=${inputRef}
               class="flex-1 px-3 py-2 rounded-lg border bg-background"
               placeholder="Add a todo..."
               @keypress=${(e: KeyboardEvent) => {
                  if (e.key === "Enter") addTodo();
               }}
            />
            <button
               class="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
               @click=${addTodo}
            >
               Add
            </button>
         </div>

         <div class="flex gap-2 text-sm">
            <button
               class="px-3 py-1 rounded ${() => (filter.value === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}"
               @click=${() => {
                  filter.value = "all";
               }}
            >
               All (${() => stats().total})
            </button>
            <button
               class="px-3 py-1 rounded ${() => (filter.value === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}"
               @click=${() => {
                  filter.value = "active";
               }}
            >
               Active (${() => stats().active})
            </button>
            <button
               class="px-3 py-1 rounded ${() => (filter.value === "completed" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}"
               @click=${() => {
                  filter.value = "completed";
               }}
            >
               Completed (${() => stats().completed})
            </button>
         </div>

         <div class="space-y-2 min-h-[100px]">
            ${() =>
               filteredTodos().length === 0
                  ? html`<p class="text-center text-muted-foreground py-4">No todos yet</p>`
                  : filteredTodos().map(
                       (todo) => html`
                  <div class="flex items-center gap-2 p-2 rounded bg-muted">
                     <input
                        type="checkbox"
                        ?checked=${todo.done}
                        @change=${() => toggleTodo(todo.id)}
                     />
                     <span class="${todo.done ? "line-through text-muted-foreground" : ""} flex-1">
                        ${todo.text}
                     </span>
                     <button
                        class="px-2 py-1 text-sm bg-destructive text-destructive-foreground rounded"
                        @click=${() => deleteTodo(todo.id)}
                     >
                        Delete
                     </button>
                  </div>
               `,
                    )}
         </div>
      </div>
   `;
});

// =======================================================================================
// LEVEL 10: Complex State Management & Multiple Effects
// =======================================================================================
interface DataPoint {
   x: number;
   y: number;
   label: string;
}

const DataVisualizer = component("data-visualizer", (_props, { onMount }) => {
   const dataPoints = signal<DataPoint[]>([]);
   const selectedPoint = signal<DataPoint | null>(null);
   const autoGenerate = signal(false);
   const updateInterval = signal(2000);
   const maxPoints = signal(10);

   let generatorInterval: number | null = null;
   let pointCounter = 0;

   const addPoint = () => {
      const max = maxPoints.value;
      const current = dataPoints.value;

      const newPoint: DataPoint = {
         x: pointCounter++,
         y: Math.floor(Math.random() * 100),
         label: `Point ${pointCounter}`,
      };

      if (current.length >= max) {
         dataPoints.value = [...current.slice(1), newPoint];
      } else {
         dataPoints.value = [...current, newPoint];
      }
   };

   const handleToggle = (e: Event) => {
      const checked = (e.target as HTMLInputElement).checked;
      autoGenerate.value = checked;

      if (checked) {
         // Start auto-generation
         if (generatorInterval !== null) {
            window.clearInterval(generatorInterval);
         }
         addPoint(); // Add first point immediately
         generatorInterval = window.setInterval(addPoint, updateInterval.value);
      } else {
         // Stop auto-generation
         if (generatorInterval !== null) {
            window.clearInterval(generatorInterval);
            generatorInterval = null;
         }
      }
   };

   // Cleanup on unmount
   onMount(() => {
      return () => {
         if (generatorInterval !== null) {
            window.clearInterval(generatorInterval);
         }
      };
   });

   // Computed statistics
   const stats = () => {
      if (dataPoints.value.length === 0) {
         return { avg: 0, max: 0, min: 0 };
      }
      const values = dataPoints.value.map((p) => p.y);
      return {
         avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
         max: Math.max(...values),
         min: Math.min(...values),
      };
   };

   const barHeight = (value: number) => {
      return `${(value / 100) * 150}px`;
   };

   return html`
      <div class="p-4 rounded-lg border bg-card space-y-4">
         <h3 class="text-lg font-semibold">Level 10: Complex State & Visualization</h3>

         <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
               <label class="flex items-center gap-2">
                  <input
                     type="checkbox"
                     ?checked=${() => autoGenerate.value}
                     @change=${handleToggle}
                  />
                  <span class="text-sm">Auto-generate data</span>
               </label>

               <label class="text-sm">
                  <span class="block mb-1">Interval (ms): ${() => updateInterval.value}</span>
                  <input
                     type="range"
                     min="500"
                     max="5000"
                     step="500"
                     value=${() => updateInterval.value}
                     @input=${(e: Event) => {
                        updateInterval.value = parseInt((e.target as HTMLInputElement).value, 10);
                     }}
                     class="w-full"
                     ?disabled=${() => autoGenerate.value}
                  />
               </label>

               <label class="text-sm">
                  <span class="block mb-1">Max points: ${() => maxPoints.value}</span>
                  <input
                     type="range"
                     min="5"
                     max="20"
                     value=${() => maxPoints.value}
                     @input=${(e: Event) => {
                        maxPoints.value = parseInt((e.target as HTMLInputElement).value, 10);
                     }}
                     class="w-full"
                  />
               </label>

               <button
                  class="px-3 py-1 bg-primary text-primary-foreground rounded text-sm w-full"
                  @click=${addPoint}
                  ?disabled=${() => autoGenerate.value}
               >
                  Add Point Manually
               </button>

               <button
                  class="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm w-full"
                  @click=${() => {
                     dataPoints.value = [];
                     selectedPoint.value = null;
                     pointCounter = 0;
                  }}
               >
                  Clear All
               </button>
            </div>

            <div class="bg-muted rounded p-3">
               <h4 class="text-sm font-semibold mb-2">Statistics</h4>
               <div class="space-y-1 text-sm">
                  <p>Points: ${() => dataPoints.value.length}</p>
                  <p>Average: ${() => stats().avg}</p>
                  <p>Max: ${() => stats().max}</p>
                  <p>Min: ${() => stats().min}</p>
                  ${() =>
                     selectedPoint.value
                        ? html`
                     <div class="mt-2 pt-2 border-t">
                        <p class="font-semibold">Selected:</p>
                        <p>${selectedPoint.value.label}</p>
                        <p>Value: ${selectedPoint.value.y}</p>
                     </div>
                  `
                        : null}
               </div>
            </div>
         </div>

         <div class="border rounded p-4 bg-background">
            <div class="flex items-end gap-2 h-[150px]">
               ${() =>
                  dataPoints.value.length === 0
                     ? html`<p class="text-muted-foreground m-auto">No data points</p>`
                     : dataPoints.value.map(
                          (point) => html`
                     <div
                        class="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                        @click=${() => {
                           selectedPoint.value = point;
                        }}
                     >
                        <div
                           class="w-full transition-all duration-300 rounded-t ${() => (selectedPoint.value === point ? "bg-accent" : "bg-primary")}"
                           style="height: ${barHeight(point.y)}"
                        ></div>
                        <span class="text-xs">${point.y}</span>
                     </div>
                  `,
                       )}
            </div>
         </div>
      </div>
   `;
});

// =======================================================================================
// Application Layout
// =======================================================================================
const app = html`
   <main class="min-h-screen w-full p-8 bg-background text-foreground font-sans">
      <header class="space-y-2 mb-12">
         <h1 class="text-4xl font-bold tracking-tight">Mini-Lit Web Components</h1>
         <p class="text-muted-foreground">Progressive examples showcasing framework capabilities</p>
      </header>

      <div class="space-y-8">
         <!-- Basic Examples -->
         <section>
            <h2 class="text-2xl font-semibold mb-4">Fundamentals</h2>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               ${SimpleCard()}
               ${GreetingCard({ name: "Developer", tone: "--accent-foreground" as ToneToken })}
               ${ClickCounter()}
            </div>
         </section>

         <!-- Intermediate Examples -->
         <section>
            <h2 class="text-2xl font-semibold mb-4">Reactivity & Effects</h2>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               ${DoubleCounter()}
               ${LifecycleDemo()}
               ${InputFocus()}
            </div>
         </section>

         <!-- Advanced Examples -->
         <section>
            <h2 class="text-2xl font-semibold mb-4">Component Composition</h2>
            <div class="grid gap-4">
               ${CounterParent()}
               ${AdvancedTimer({ interval: 1000, format: "time" })}
            </div>
         </section>

         <!-- Complex Examples -->
         <section>
            <h2 class="text-2xl font-semibold mb-4">Complex State Management</h2>
            <div class="grid gap-4">
               ${TodoList()}
               ${DataVisualizer()}
            </div>
         </section>
      </div>
   </main>
`;

document.body.appendChild(app);

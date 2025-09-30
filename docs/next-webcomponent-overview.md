# mini-lit Web Component Runtime Overview

A compact runtime that renders tagged `html` templates with fine-grained reactivity powered by Preact Signals. Components are exposed as real custom elements via a `component(tag, render)` helper; each instance owns its effects, event listeners, and lifecycle callbacks. Templates rendered outside components still work, but the caller must hold on to the fragment cleanup if they want to unmount everything later.

## How It Works
- Interpolations that receive functions (accessors) are wrapped in `effect`, so updates stay local to that DOM region.
- Each rendered fragment tracks its cleanups (event listeners, nested component disposers) and exposes them via `.cleanup`.
- `defaultProps` converts plain values into accessors and guards against raw `signal` instances so props remain predictable.
- Event bindings (`@event`) and property bindings (`.prop`) support both native elements and custom elements generated through `component()`.

## Backlog
- [ ] **Fast-path reactive text updates** – Avoid removing and re-inserting text nodes during simple signal updates to reduce flashing.
- [ ] **Handler defaults in `defaultProps`** – Allow default event handlers to be supplied and returned as non-undefined callables.
- [ ] **Keyed list helper** – Provide a helper that reuses DOM nodes instead of recreating entire lists on each change.
- [ ] **Root cleanup helper (optional)** – Add a `renderRoot` helper that wraps templates in an owner and returns a disposer for top-level unmounting.

## Runtime Source (`example/src/next-webcomponent.ts`)
```ts
import { type Signal as PreactSignal, effect as preactEffect, signal as preactSignal } from "@preact/signals-core";
// @ts-expect-error - the package ships untyped JS
import { parse } from "html-parse-string/dist/index.js";

/**
 * =========================================================================================
 * Minimal reactive runtime
 * =========================================================================================
 */
type Cleanup = () => void;

interface ComponentRuntime {
   element: HTMLElement;
   cleanups: Set<Cleanup>;
   mountCallbacks: Array<(() => void) | Cleanup>;
}

const runtimeStack: ComponentRuntime[] = [];

function currentRuntime(): ComponentRuntime | null {
   return runtimeStack[runtimeStack.length - 1] ?? null;
}

function runInRuntime<T>(runtime: ComponentRuntime, fn: () => T): T {
   runtimeStack.push(runtime);
   try {
      return fn();
   } finally {
      runtimeStack.pop();
   }
}

function registerCleanup(fn: Cleanup): boolean {
   const runtime = currentRuntime();
   if (runtime) {
      runtime.cleanups.add(fn);
      return true;
   }
   return false;
}

export type Signal<T> = PreactSignal<T>;

export function signal<T>(initial: T): Signal<T> {
   return preactSignal<T>(initial);
}

export function effect(fn: () => void): Cleanup {
   const disposer = preactEffect(fn);
   registerCleanup(disposer);
   return disposer;
}

export interface ComponentHooks {
   element: HTMLElement;
   onMount(callback: (() => void) | Cleanup): void;
   onCleanup(callback: Cleanup): void;
}

export function onMount(callback: (() => void) | Cleanup) {
   const runtime = currentRuntime();
   if (!runtime) {
      throw new Error("onMount can only be used inside a component");
   }
   runtime.mountCallbacks.push(callback);
}

export function onCleanup(callback: Cleanup) {
   registerCleanup(callback);
}

/**
 * =========================================================================================
 * Accessor utilities
 * =========================================================================================
 */

type Accessor<T> = () => T;

type PropInput<T> = T | Accessor<T>;

type AccessorProps<P> = {
   [K in keyof P]: AccessorProp<P[K]>;
};

type AccessorProp<T> = [T] extends [undefined]
   ? Accessor<T>
   : Exclude<T, undefined> extends (...args: any[]) => any
     ? Exclude<T, undefined> | Extract<T, undefined>
     : Accessor<Exclude<T, undefined>> | Extract<T, undefined>;

type ComponentPropsInput<P> = { [K in keyof P]?: PropInput<P[K]> };

function isSignal(value: unknown): value is Signal<unknown> {
   return typeof value === "object" && value !== null && "value" in (value as Record<string, unknown>);
}

function toAccessor<T>(value: PropInput<T>, key: string): Accessor<T> {
   if (typeof value === "function") {
      return value as Accessor<T>;
   }
   if (isSignal(value)) {
      console.warn(
         `mini-lit: Prop "${String(key)}" received a signal instance. Wrap it in () => signal.value instead.`,
      );
      throw new Error(`Prop "${key}" received a signal. Wrap it in () => signal.value instead.`);
   }
   return () => value as T;
}

function normalizeProps<P extends Record<string, any>>(inputs: ComponentPropsInput<P>): AccessorProps<P> {
   const normalized: Record<string, any> = {};
   for (const key of Object.keys(inputs) as Array<keyof P>) {
      const raw = inputs[key];
      const keyStr = String(key);

      if (raw === undefined) {
         continue;
      }

      if (typeof raw === "function" && keyStr.startsWith("on")) {
         normalized[keyStr] = raw;
      } else {
         normalized[keyStr] = toAccessor(raw, keyStr);
      }
   }
   return normalized as AccessorProps<P>;
}

type DefaultInput<T> = T | (() => T);

function toAccessorFromDefault<T>(value: DefaultInput<T>): Accessor<T> {
   if (typeof value === "function") {
      return value as Accessor<T>;
   }
   return () => value as T;
}

type ResolvedDefaults<P, D> = AccessorProps<P> & {
   [K in keyof D]-?: K extends keyof P
      ? P[K] extends (...args: any[]) => any
         ? P[K]
         : Accessor<Exclude<P[K], undefined>>
      : never;
};

export function defaultProps<P extends Record<string, any>, D extends Partial<{ [K in keyof P]: DefaultInput<P[K]> }>>(
   props: AccessorProps<P>,
   defaults: D,
): ResolvedDefaults<P, D> {
   const target = props as Record<string, any>;

   for (const key of Object.keys(defaults) as Array<keyof P>) {
      const keyStr = String(key);
      if (target[keyStr] !== undefined) {
         continue;
      }

      const value = defaults[key];
      if (value === undefined) {
         continue;
      }

      if (typeof value === "function" && keyStr.startsWith("on")) {
         target[keyStr] = value;
      } else {
         target[keyStr] = toAccessorFromDefault(value as DefaultInput<any>);
      }
   }

   return props as ResolvedDefaults<P, D>;
}

/**
 * =========================================================================================
 * Template rendering
 * =========================================================================================
 */

const HOLE_MARKER = "$__HOLE__$";

interface HtmlNode {
   type: "tag" | "text" | string;
   voidElement: boolean;
   name?: string;
   content?: string;
   attrs?: Array<{ name: string; value: string }>;
   children?: HtmlNode[];
}

const FRAGMENT_CLEANUP = Symbol("fragment-cleanup");

type FragmentWithCleanup = DocumentFragment & { [FRAGMENT_CLEANUP]?: Cleanup };

function setFragmentCleanup(fragment: DocumentFragment, cleanups: Cleanup[]) {
   const dispose = () => {
      for (const cleanup of [...cleanups].reverse()) {
         try {
            cleanup();
         } catch (error) {
            console.error("Error during fragment cleanup", error);
         }
      }
      cleanups.length = 0;
   };

   (fragment as FragmentWithCleanup)[FRAGMENT_CLEANUP] = dispose;
}

function getFragmentCleanup(fragment: DocumentFragment): Cleanup | undefined {
   return (fragment as FragmentWithCleanup)[FRAGMENT_CLEANUP];
}

interface MaterializedValue {
   nodes: Node[];
   cleanups: Cleanup[];
}

function materialize(value: any): MaterializedValue {
   if (value == null || value === false || value === "") {
      return { nodes: [], cleanups: [] };
   }

   if (value instanceof DocumentFragment) {
      const cleanup = getFragmentCleanup(value);
      return {
         nodes: Array.from(value.childNodes),
         cleanups: cleanup ? [cleanup] : [],
      };
   }

   if (value instanceof Node) {
      return { nodes: [value], cleanups: [] };
   }

   if (Array.isArray(value)) {
      const nodes: Node[] = [];
      const cleanups: Cleanup[] = [];
      for (const item of value) {
         const result = materialize(item);
         nodes.push(...result.nodes);
         cleanups.push(...result.cleanups);
      }
      return { nodes, cleanups };
   }

   return {
      nodes: [document.createTextNode(String(value))],
      cleanups: [],
   };
}

function clearBetweenMarkers(start: Comment, end: Comment, cleanups: Cleanup[]) {
   let node = start.nextSibling;
   while (node && node !== end) {
      const next = node.nextSibling;
      node.parentNode?.removeChild(node);
      node = next;
   }
   for (const cleanup of [...cleanups].reverse()) {
      try {
         cleanup();
      } catch (error) {
         console.error("Error during reactive cleanup", error);
      }
   }
   cleanups.length = 0;
}

function interpret(nodes: HtmlNode[], values: any[], cleanups: Cleanup[]): DocumentFragment {
   const fragment = document.createDocumentFragment();
   let holeIndex = 0;

   const runtime = currentRuntime();

   function handleAttribute(element: Element, attr: { name: string; value: string }) {
      const { name, value } = attr;

      if (value === HOLE_MARKER) {
         const holeValue = values[holeIndex++];

         if (name === "ref") {
            if (holeValue && typeof holeValue === "object") {
               (holeValue as { current: any }).current = element;
            }
            return;
         }

         if (name.startsWith("@")) {
            const eventName = name.slice(1);
            if (typeof holeValue !== "function") {
               throw new Error(`Event handler for @${eventName} must be a function`);
            }
            element.addEventListener(eventName, holeValue as EventListener);
            cleanups.push(() => {
               element.removeEventListener(eventName, holeValue as EventListener);
            });
            return;
         }

         if (name.startsWith(".")) {
            const prop = name.slice(1);
            const assign = (value: unknown) => {
               if (typeof (element as any).updateProps === "function") {
                  (element as any).updateProps({ [prop]: value });
               } else {
                  (element as any)[prop] = value;
               }
            };

            if (typeof holeValue === "function") {
               const dispose = effect(() => {
                  assign((holeValue as Accessor<any>)());
               });
               if (!runtime) {
                  cleanups.push(dispose);
               }
            } else {
               assign(holeValue);
            }
            return;
         }

         if (name.startsWith("?")) {
            const attrName = name.slice(1);
            const setBooleanAttribute = (value: unknown) => {
               if (value) {
                  element.setAttribute(attrName, "");
               } else {
                  element.removeAttribute(attrName);
               }
            };

            if (typeof holeValue === "function") {
               const dispose = effect(() => {
                  setBooleanAttribute((holeValue as Accessor<any>)());
               });
               if (!runtime) {
                  cleanups.push(dispose);
               }
            } else {
               setBooleanAttribute(holeValue);
            }
            return;
         }

         if (typeof holeValue === "function") {
            const dispose = effect(() => {
               const next = (holeValue as Accessor<any>)();
               if (next == null) {
                  element.removeAttribute(name);
               } else {
                  element.setAttribute(name, String(next));
               }
            });
            if (!runtime) {
               cleanups.push(dispose);
            }
         } else if (holeValue == null) {
            element.removeAttribute(name);
         } else {
            element.setAttribute(name, String(holeValue));
         }
         return;
      }

      if (value.includes(HOLE_MARKER)) {
         const parts = value.split(HOLE_MARKER);
         const indices: number[] = [];
         for (let i = 0; i < parts.length - 1; i++) {
            indices.push(holeIndex++);
         }
         const hasReactive = indices.some((i) => typeof values[i] === "function");

         if (hasReactive) {
            const dispose = effect(() => {
               let computed = "";
               for (let i = 0; i < parts.length; i++) {
                  computed += parts[i];
                  if (i < parts.length - 1) {
                     const val = values[indices[i]];
                     computed += String(typeof val === "function" ? (val as Accessor<any>)() : val);
                  }
               }
               element.setAttribute(name, computed);
            });
            if (!runtime) {
               cleanups.push(dispose);
            }
         } else {
            let computed = "";
            for (let i = 0; i < parts.length; i++) {
               computed += parts[i];
               if (i < parts.length - 1) {
                  computed += String(values[indices[i]]);
               }
            }
            element.setAttribute(name, computed);
         }
         return;
      }

      element.setAttribute(name, value);
   }

   function appendChildNodes(parent: Node, childNodes: HtmlNode[]) {
      for (const child of childNodes) {
         appendNode(parent, child);
      }
   }

   function appendNode(parent: Node, node: HtmlNode) {
      if (node.type === "text") {
         if (!node.content) return;
         if (!node.content.includes(HOLE_MARKER)) {
            parent.appendChild(document.createTextNode(node.content));
            return;
         }

         const parts = node.content.split(HOLE_MARKER);
         for (let i = 0; i < parts.length; i++) {
            if (parts[i]) {
               parent.appendChild(document.createTextNode(parts[i]));
            }
            if (i < parts.length - 1) {
               const value = values[holeIndex++];
               if (typeof value === "function") {
                  const start = document.createComment("reactive-start");
                  const end = document.createComment("reactive-end");
                  parent.appendChild(start);
                  parent.appendChild(end);

                  const nestedCleanups: Cleanup[] = [];

                  const dispose = effect(() => {
                     const result = materialize((value as Accessor<any>)());
                     clearBetweenMarkers(start, end, nestedCleanups);
                     for (const node of result.nodes) {
                        end.parentNode?.insertBefore(node, end);
                     }
                     nestedCleanups.push(...result.cleanups);
                  });

                  cleanups.push(() => {
                     dispose();
                     clearBetweenMarkers(start, end, nestedCleanups);
                     start.remove();
                     end.remove();
                  });
               } else {
                  const result = materialize(value);
                  for (const node of result.nodes) {
                     parent.appendChild(node);
                  }
                  cleanups.push(...result.cleanups);
               }
            }
         }
         return;
      }

      if (node.type === "tag") {
         const element = document.createElement(node.name!);

         if (node.attrs) {
            for (const attr of node.attrs) {
               handleAttribute(element, attr);
            }
         }

         if (node.children && node.children.length > 0) {
            appendChildNodes(element, node.children);
         }

         parent.appendChild(element);
         return;
      }

      // Fallback: ignore unsupported nodes (comments/directives)
   }

   for (const node of nodes) {
      appendNode(fragment, node);
   }

   if (runtime) {
      registerCleanup(() => {
         const dispose = getFragmentCleanup(fragment);
         dispose?.();
      });
   }

   return fragment;
}

export function html(strings: TemplateStringsArray, ...values: any[]): DocumentFragment {
   let htmlString = "";
   for (const part of strings) {
      htmlString += part + HOLE_MARKER;
   }
   htmlString = htmlString.slice(0, -HOLE_MARKER.length);

   const ast = parse(htmlString) as HtmlNode[];
   const cleanups: Cleanup[] = [];
   const fragment = interpret(ast, values, cleanups);
   setFragmentCleanup(fragment, cleanups);
   return fragment;
}

/**
 * =========================================================================================
 * Component registration
 * =========================================================================================
 */

type ComponentFactory<P extends Record<string, any>> = (props?: ComponentPropsInput<P>) => DocumentFragment;

interface InternalComponentElement<P extends Record<string, any>> extends HTMLElement {
   updateProps(props: ComponentPropsInput<P>): void;
}

export function component<P extends Record<string, any>>(
   tagName: `${Lowercase<string>}-${Lowercase<string>}`,
   render: (props: AccessorProps<P>, hooks: ComponentHooks) => DocumentFragment,
): ComponentFactory<P> {
   if (!tagName.includes("-")) {
      throw new Error(`Custom element tag "${tagName}" must include a hyphen.`);
   }

   if (!customElements.get(tagName)) {
      class NextComponentElement extends HTMLElement implements InternalComponentElement<P> {
         private props: ComponentPropsInput<P> = {};
         private runtime: ComponentRuntime | null = null;
         private rendered = false;

         updateProps(next: ComponentPropsInput<P>) {
            this.props = { ...this.props, ...next };
            if (this.rendered) {
               this.renderComponent();
            }
         }

         connectedCallback() {
            this.renderComponent();
         }

         disconnectedCallback() {
            this.teardown();
         }

         private renderComponent() {
            this.teardown();

            const runtime: ComponentRuntime = {
               element: this,
               cleanups: new Set(),
               mountCallbacks: [],
            };

            this.runtime = runtime;

            const normalized = normalizeProps<P>(this.props ?? ({} as ComponentPropsInput<P>));
            const hooks: ComponentHooks = {
               element: this,
               onMount: (cb) => {
                  runtime.mountCallbacks.push(cb);
               },
               onCleanup: (cb) => {
                  runtime.cleanups.add(cb);
               },
            };

            const fragment = runInRuntime(runtime, () => render(normalized, hooks));

            this.replaceChildren();
            this.appendChild(fragment);
            this.rendered = true;

            if (runtime.mountCallbacks.length > 0) {
               queueMicrotask(() => {
                  for (const callback of runtime.mountCallbacks) {
                     const maybeCleanup = callback();
                     if (typeof maybeCleanup === "function") {
                        runtime.cleanups.add(maybeCleanup);
                     }
                  }
                  runtime.mountCallbacks.length = 0;
               });
            }
         }

         private teardown() {
            if (!this.runtime) return;
            for (const cleanup of [...this.runtime.cleanups].reverse()) {
               try {
                  cleanup();
               } catch (error) {
                  console.error("Error during component cleanup", error);
               }
            }
            this.runtime.cleanups.clear();
            this.runtime.mountCallbacks.length = 0;
            this.replaceChildren();
            this.runtime = null;
            this.rendered = false;
         }
      }

      customElements.define(tagName, NextComponentElement);
   }

   const factory: ComponentFactory<P> = (props: ComponentPropsInput<P> = {}) => {
      const fragment = document.createDocumentFragment();
      const element = document.createElement(tagName) as InternalComponentElement<P>;
      element.updateProps(props);
      fragment.appendChild(element);
      return fragment;
   };

   return factory;
}

/**
 * =========================================================================================
 * Rendering helpers
 * =========================================================================================
 */

export interface Ref<T> {
   current: T | null;
}

export function ref<T = HTMLElement>(): Ref<T> {
   return { current: null };
}
```

## Demo Page (`example/src/pages/page-next-webcomponent.ts`)
```ts
import { component, defaultProps, effect, html, onCleanup, onMount, ref, signal } from "../next-webcomponent.js";

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
               <p class="text-2xl font-mono text-accent">${() => doubled.value}</p>
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
interface CounterProps {
   label?: string;
   tone?: ToneToken;
   initialValue?: number;
   onChange?: (value: number) => void;
   onReset?: () => void;
}

const SmartCounter = component<CounterProps>("smart-counter", (props) => {
   const resolved = defaultProps(props, {
      label: "Counter",
      tone: "--primary" as ToneToken,
      initialValue: 0,
   });

   const count = signal(resolved.initialValue());

   const updateCount = (newValue: number) => {
      count.value = newValue;
      resolved.onChange?.(newValue);
   };

   return html`
      <div class="p-3 rounded-lg border-2" style=${() => `border-color: var(${resolved.tone()});`}>
         <p class="text-sm font-semibold">${() => resolved.label()}</p>
         <p class="text-2xl font-mono my-2">${() => count.value}</p>
         <div class="flex gap-2">
            <button
               class="px-2 py-1 text-sm bg-primary text-primary-foreground rounded"
               @click=${() => updateCount(count.value + 1)}
            >
               +
            </button>
            <button
               class="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded"
               @click=${() => updateCount(count.value - 1)}
            >
               -
            </button>
            <button
               class="px-2 py-1 text-sm bg-muted text-muted-foreground rounded"
               @click=${() => {
                  updateCount(resolved.initialValue());
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
   const total = signal(0);
   const resetCount = signal(0);

   return html`
      <div class="p-4 rounded-lg border bg-card space-y-3">
         <h3 class="text-lg font-semibold">Level 7: Parent-Child Communication</h3>
         <div class="p-3 bg-muted rounded-lg">
            <p class="text-sm">Total: <span class="font-bold">${() => total.value}</span></p>
            <p class="text-sm">Resets: <span class="font-bold">${() => resetCount.value}</span></p>
         </div>
         <div class="grid grid-cols-2 gap-3">
            ${SmartCounter({
               label: "Counter A",
               tone: "--chart-1" as ToneToken,
               onChange: (value) => {
                  total.value = value;
               },
               onReset: () => {
                  resetCount.value++;
               },
            })}
            ${SmartCounter({
               label: "Counter B",
               tone: "--chart-2" as ToneToken,
               initialValue: 10,
               onChange: (value) => {
                  total.value = value;
               },
               onReset: () => {
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
                        updateInterval.value = parseInt((e.target as HTMLInputElement).value);
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
                        maxPoints.value = parseInt((e.target as HTMLInputElement).value);
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
            <div class="space-y-4">
               ${CounterParent()}
               ${AdvancedTimer({ interval: 1000, format: "time" })}
            </div>
         </section>

         <!-- Complex Examples -->
         <section>
            <h2 class="text-2xl font-semibold mb-4">Complex State Management</h2>
            <div class="space-y-4">
               ${TodoList()}
               ${DataVisualizer()}
            </div>
         </section>
      </div>
   </main>
`;

document.body.appendChild(app);
```

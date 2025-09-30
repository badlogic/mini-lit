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
      logDebug(() => [
         `Prop "${String(key)}" received a signal instance. Wrap it in () => signal.value instead.`,
         value,
      ]);
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
const astCache = new WeakMap<TemplateStringsArray, HtmlNode[]>();
let debugLoggingEnabled = false;
const templateIds = new WeakMap<TemplateStringsArray, number>();
let templateIdCounter = 0;
interface TemplateMetrics {
   id: number;
   source: string;
   parseDuration: number;
   runs: number;
   totalInterpretDuration: number;
}

const templateMetrics = new Map<number, TemplateMetrics>();

export function getMiniLitMetrics() {
   return Array.from(templateMetrics.values()).map((metric) => {
      return {
         id: metric.id,
         parseDuration: metric.parseDuration,
         runs: metric.runs,
         totalInterpretDuration: metric.totalInterpretDuration,
         averageInterpretDuration: metric.runs > 0 ? metric.totalInterpretDuration / metric.runs : 0,
      };
   });
}

export function enableMiniLitDebug(value = true) {
   debugLoggingEnabled = value;
   if (!debugLoggingEnabled) {
      templateMetrics.clear();
   }
}

export function printMiniLitMetrics() {
   const metrics = getMiniLitMetrics();
   if (!metrics.length) {
      console.info("[mini-lit] no metrics recorded");
      return;
   }
   console.table(
      metrics.map((m) => ({
         id: m.id,
         parseDuration: m.parseDuration.toFixed ? Number(m.parseDuration.toFixed(2)) : m.parseDuration,
         runs: m.runs,
         totalInterpretDuration: m.totalInterpretDuration.toFixed
            ? Number(m.totalInterpretDuration.toFixed(2))
            : m.totalInterpretDuration,
         averageInterpretDuration: m.averageInterpretDuration.toFixed
            ? Number(m.averageInterpretDuration.toFixed(2))
            : m.averageInterpretDuration,
      })),
   );
}

if (typeof window !== "undefined") {
   (window as any).miniLit = (window as any).miniLit || {};
   (window as any).miniLit.printMetrics = printMiniLitMetrics;
   (window as any).miniLit.enableDebug = enableMiniLitDebug;
}

function getTemplateId(strings: TemplateStringsArray): number {
   let id = templateIds.get(strings);
   if (id === undefined) {
      id = ++templateIdCounter;
      templateIds.set(strings, id);
   }
   return id;
}

function now(): number {
   if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
   }
   return Date.now();
}

type LogFactory = () => [string, ...any[]];

function logDebug(factory: LogFactory) {
   if (!debugLoggingEnabled) {
      return;
   }
   const [message, ...args] = factory();
   console.info(`[mini-lit] ${message}`, ...args);
}

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
                  let textNodeRef: Text | null = null;
                  let renderMode: "text" | "nodes" | null = null;

                  const dispose = effect(() => {
                     const accessor = value as Accessor<any>;
                     const nextValue = accessor();
                     const isTextLike =
                        nextValue == null ||
                        typeof nextValue === "string" ||
                        typeof nextValue === "number" ||
                        typeof nextValue === "boolean" ||
                        typeof nextValue === "bigint";

                     if (isTextLike) {
                        const textContent = nextValue == null ? "" : String(nextValue);

                        if (renderMode !== "text") {
                           clearBetweenMarkers(start, end, nestedCleanups);
                           const node = document.createTextNode(textContent);
                           end.parentNode?.insertBefore(node, end);
                           textNodeRef = node;
                           renderMode = "text";
                        } else if (textNodeRef) {
                           textNodeRef.data = textContent;
                        }

                        return;
                     }

                     if (renderMode === "text" && textNodeRef) {
                        textNodeRef.remove();
                        textNodeRef = null;
                     }
                     renderMode = "nodes";

                     const result = materialize(nextValue);
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
   const templateId = getTemplateId(strings);
   let ast = astCache.get(strings);

   if (!ast) {
      let htmlString = "";
      for (const part of strings) {
         htmlString += part + HOLE_MARKER;
      }
      htmlString = htmlString.slice(0, -HOLE_MARKER.length);

      const parseStart = now();
      ast = parse(htmlString) as HtmlNode[];
      const parseDuration = now() - parseStart;

      astCache.set(strings, ast);
      if (debugLoggingEnabled) {
         templateMetrics.set(templateId, {
            id: templateId,
            source: htmlString,
            parseDuration,
            runs: 0,
            totalInterpretDuration: 0,
         });
      }
   }

   const interpretStart = now();
   const cleanups: Cleanup[] = [];
   const fragment = interpret(ast, values, cleanups);
   const interpretDuration = now() - interpretStart;

   if (debugLoggingEnabled) {
      const metrics = templateMetrics.get(templateId);
      if (metrics) {
         metrics.runs += 1;
         metrics.totalInterpretDuration += interpretDuration;
      }
   }

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

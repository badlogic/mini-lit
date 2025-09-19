import { html, nothing, type TemplateResult } from "lit";
import { createRef, type Ref, ref } from "lit/directives/ref.js";

export type ComponentRenderFn<P = any> = (props: P) => TemplateResult;
export type Component<P = any> = (props?: P) => TemplateResult;

export function fc<P = any>(renderFn: ComponentRenderFn<P>): Component<P> {
   return (props?: P) => renderFn(props || ({} as P));
}

export interface ReactiveState<T extends object> {
   __subscribe: (listener: () => void) => () => void;
}

export function createState<T extends object>(initialState: T): T & ReactiveState<T> {
   const listeners = new Set<() => void>();

   const state = new Proxy(initialState, {
      set(target, prop, value) {
         (target as any)[prop] = value;
         for (const listener of listeners) {
            listener();
         }
         return true;
      },
      get(target, prop) {
         if (prop === "__subscribe") {
            return (listener: () => void) => {
               listeners.add(listener);
               return () => listeners.delete(listener);
            };
         }
         return (target as any)[prop];
      },
   }) as T & ReactiveState<T>;

   return state;
}

export interface BaseComponentProps {
   className?: string;
   children?: TemplateResult | string | number | typeof nothing;
}

export interface ComponentPropsWithoutChildren {
   className?: string;
}

export { createRef, html, nothing, ref };
export type { Ref, TemplateResult };

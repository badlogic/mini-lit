import { effect, Signal as PreactSignal, signal as preactSignal } from "@preact/signals-core";

/**
 * Generic Signal wrapper that works with any adapter
 */
export class Signal<T> {
   readonly _$miniSignal$: true = true;

   constructor(private _signal: any) {}

   get value(): T {
      return getSignalAdapter().getValue(this._signal);
   }

   set value(val: T) {
      getSignalAdapter().setValue(this._signal, val);
   }

   // Get the underlying signal for the adapter
   get raw() {
      return this._signal;
   }
}

/**
 * Type guard to check if a value is our Signal wrapper
 */
export function isSignal(value: any): value is Signal<any> {
   return value && value._$miniSignal$ === true;
}

/**
 * Interface for signal library adapters
 */
export interface SignalAdapter {
   isRawSignal(value: any): boolean; // Check if it's a raw signal from the underlying library
   getValue(signal: any): any;
   setValue(signal: any, value: any): void;
   createSignal<T>(value: T): any;
   subscribe(signal: any, callback: () => void): () => void;
   createEffect(fn: () => void): () => void;
}

/**
 * Default adapter for Preact signals
 */
export const preactSignalsAdapter: SignalAdapter = {
   isRawSignal: (v) => v instanceof PreactSignal,
   getValue: (s) => s.value,
   setValue: (s, v) => {
      s.value = v;
   },
   createSignal: (v) => preactSignal(v),
   subscribe: (s, cb) => s.subscribe(cb),
   createEffect: (fn) => effect(fn),
};

// Global signal adapter (default to Preact)
let signalAdapter: SignalAdapter = preactSignalsAdapter;

/**
 * Set a custom signal adapter
 */
export function setSignalAdapter(adapter: SignalAdapter) {
   signalAdapter = adapter;
}

/**
 * Get the current signal adapter
 */
export function getSignalAdapter(): SignalAdapter {
   return signalAdapter;
}

/**
 * Create a signal using the current adapter
 */
export function createSignal<T>(value: T): Signal<T> {
   const adapter = getSignalAdapter();
   const rawSignal = adapter.createSignal(value);
   return new Signal<T>(rawSignal);
}

/**
 * Helper to ensure we always have a signal
 * If the value is already a signal, return it
 * Otherwise wrap it in a signal
 */
export function ensureSignal<T>(value: T | Signal<T> | undefined, defaultValue: T): Signal<T> {
   const adapter = getSignalAdapter();

   // Check if it's already our Signal wrapper
   if (isSignal(value)) {
      return value;
   }

   // Check if it's a raw signal from the adapter
   if (value !== undefined && adapter.isRawSignal(value)) {
      return new Signal<T>(value);
   }

   // Create a new signal with the value or default
   return createSignal(value !== undefined ? value : defaultValue);
}

// Re-export Preact convenience functions with our wrapper
export function signal<T>(value: T): Signal<T> {
   return createSignal(value);
}

export { computed, effect } from "@preact/signals-core";

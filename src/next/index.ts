/**
 * Mini-lit next generation - Component-aware HTML templates without build steps
 */

// Export everything from component module
export {
   Component,
   ComponentOptions,
   ComponentProps,
   createComponent,
   mount,
   RenderResult,
} from "./component.js";
export type { Directive } from "./directives/directive.js";
// Export directives
export { directive, isDirective } from "./directives/directive.js";
export { repeat } from "./directives/repeat.js";
// Export everything from signals module
export {
   computed,
   effect,
   ensureSignal,
   getSignalAdapter,
   isSignal,
   preactSignalsAdapter,
   Signal,
   SignalAdapter,
   setSignalAdapter,
   signal,
} from "./signals.js";
// Export everything from template module
export {
   html,
   registerComponent,
   registerComponents,
} from "./template.js";

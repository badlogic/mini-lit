/**
 * Directive interface for mini-lit
 * Directives return objects with this shape to get special handling
 */
export interface Directive {
   _$miniDirective$: true;
   node: Node; // The marker/placeholder node to insert
   mount: () => void; // Called after node is in DOM
   unmount?: () => void; // Optional cleanup
}

/**
 * Type guard to check if a value is a directive
 */
export function isDirective(value: any): value is Directive {
   return value && value._$miniDirective$ === true;
}

/**
 * Helper to create a directive
 */
export function directive(node: Node, mount: () => void, unmount?: () => void): Directive {
   return {
      _$miniDirective$: true,
      node,
      mount,
      unmount,
   };
}

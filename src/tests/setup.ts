import { Window } from "happy-dom";

// Setup DOM globals for testing
export function setupDOM() {
   const window = new Window();
   const document = window.document;

   // Set globals with proper type assertions
   (global as any).document = document;
   (global as any).window = window;
   (global as any).Node = window.Node;
   (global as any).Element = window.Element;
   (global as any).HTMLElement = window.HTMLElement;
   (global as any).HTMLInputElement = window.HTMLInputElement;
   (global as any).Text = window.Text;
   (global as any).Comment = window.Comment;
   (global as any).DocumentFragment = window.DocumentFragment;
   (global as any).CustomEvent = window.CustomEvent;

   return { window, document };
}

export function cleanupDOM(window: any) {
   window.close();
   // Use optional chaining and type assertions for cleanup
   const g = global as any;
   delete g.document;
   delete g.window;
   delete g.Node;
   delete g.Element;
   delete g.HTMLElement;
   delete g.HTMLInputElement;
   delete g.Text;
   delete g.Comment;
   delete g.DocumentFragment;
   delete g.CustomEvent;
}

// Helper to wait for effects to settle
export function nextTick() {
   return new Promise((resolve) => setTimeout(resolve, 0));
}

// Helper to track memory leaks
export class MemoryTracker {
   private refs = new Set<WeakRef<any>>();

   track(obj: any) {
      this.refs.add(new WeakRef(obj));
   }

   getAliveCount() {
      let alive = 0;
      for (const ref of this.refs) {
         if (ref.deref() !== undefined) alive++;
      }
      return alive;
   }

   clear() {
      this.refs.clear();
   }
}

// Helper to capture console errors
export class ErrorCapture {
   private errors: any[] = [];
   private originalError: any;

   start() {
      this.originalError = console.error;
      console.error = (...args: any[]) => {
         this.errors.push(args);
      };
   }

   stop() {
      console.error = this.originalError;
   }

   get() {
      return this.errors;
   }

   clear() {
      this.errors = [];
   }
}

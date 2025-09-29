import { Window } from "happy-dom";

// Setup DOM globals for testing
export function setupDOM() {
   const window = new Window();
   const document = window.document;

   // Set globals
   global.document = document as any;
   global.window = window as any;
   global.Node = window.Node;
   global.Element = window.Element;
   global.HTMLElement = window.HTMLElement;
   global.HTMLInputElement = window.HTMLInputElement;
   global.Text = window.Text;
   global.Comment = window.Comment;
   global.DocumentFragment = window.DocumentFragment;
   global.CustomEvent = window.CustomEvent;

   return { window, document };
}

export function cleanupDOM(window: any) {
   window.close();
   delete global.document;
   delete global.window;
   delete global.Node;
   delete global.Element;
   delete global.HTMLElement;
   delete global.HTMLInputElement;
   delete global.Text;
   delete global.Comment;
   delete global.DocumentFragment;
   delete global.CustomEvent;
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

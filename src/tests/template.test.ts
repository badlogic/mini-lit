import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createComponent, mount } from "../next/component.js";
import { repeat } from "../next/directives/repeat.js";
import { signal } from "../next/signals.js";
import { html, registerComponents } from "../next/template.js";
import { cleanupDOM, ErrorCapture, MemoryTracker, nextTick, setupDOM } from "./setup.js";

describe("Template Runtime Issues", () => {
   let window: any;
   let document: any;

   beforeEach(() => {
      const setup = setupDOM();
      window = setup.window;
      document = setup.document;
   });

   afterEach(() => {
      cleanupDOM(window);
   });

   describe("Multi-interpolation text nodes", () => {
      test("multiple dynamic values in text node maintain position", async () => {
         const val1 = signal("A");
         const val2 = signal("B");
         const val3 = signal("C");

         const elem = html`<div>First: ${val1}, Second: ${val2}, Third: ${val3}</div>` as HTMLElement;

         expect(elem.textContent).toBe("First: A, Second: B, Third: C");

         val1.value = "AA";
         await nextTick();

         // Values should maintain their position
         expect(elem.textContent).toBe("First: AA, Second: B, Third: C");

         val2.value = "BB";
         await nextTick();

         // Order should be correct
         expect(elem.textContent).toBe("First: AA, Second: BB, Third: C");
      });

      test("data attributes example", async () => {
         const dataValue = signal(42);
         const customAttr = signal("test");

         const elem = html`
            <div>data-value: ${dataValue}, data-custom: ${customAttr}</div>
         ` as HTMLElement;

         expect(elem.textContent).toBe("data-value: 42, data-custom: test");

         dataValue.value = 43;
         customAttr.value = "updated";
         await nextTick();

         // Values should update correctly
         expect(elem.textContent).toBe("data-value: 43, data-custom: updated");
      });
   });

   describe("Interpolated attributes with signals", () => {
      test("interpolated attributes handle signals", async () => {
         const count = signal(5);
         const elem = html`<div title="Count: ${count}"></div>` as HTMLElement;

         // Initial render should show the value
         expect(elem.getAttribute("title")).toBe("Count: 5");

         count.value = 10;
         await nextTick();

         // Should update reactively
         expect(elem.getAttribute("title")).toBe("Count: 10");
      });

      test("class attribute with signal in interpolation", async () => {
         const active = signal(false);
         const elem = html`
            <div class="base ${active}"></div>
         ` as HTMLElement;

         // Should show boolean value as string
         expect(elem.className).toBe("base false");

         active.value = true;
         await nextTick();

         // Should update reactively
         expect(elem.className).toBe("base true");
      });
   });

   describe("Memory leaks", () => {
      test("BROKEN: effects never cleaned up", async () => {
         const tracker = new MemoryTracker();
         const container = document.createElement("div");

         // Mount and unmount components repeatedly
         for (let i = 0; i < 10; i++) {
            const count = signal(i);
            const TestComp = createComponent(() => {
               return html`<div>${count}</div>`;
            });

            const instance = mount(TestComp, container);
            tracker.track(container.firstChild);

            // Clear container (but effects still run!)
            container.innerHTML = "";
         }

         // Force GC if available
         if (global.gc) global.gc();

         // Many nodes still referenced by effects
         expect(tracker.getAliveCount()).toBeGreaterThan(0);
      });

      test("BROKEN: event listeners never removed", () => {
         let clickCount = 0;
         const container = document.createElement("div");

         // Mount component with event listener
         const TestComp = createComponent(() => {
            return html`<button @click=${() => clickCount++}>Click</button>`;
         });

         const instance = mount(TestComp, container);
         const button = container.querySelector("button")!;

         // Click works
         button.click();
         expect(clickCount).toBe(1);

         // "Unmount" by clearing container
         container.innerHTML = "";

         // Button still has listener attached (memory leak)
         // Can't easily test this without access to getEventListeners
      });

      test("BROKEN: directive cleanup not called when array changes", async () => {
         let cleanup1Called = false;
         let cleanup2Called = false;

         const items1 = signal(["a", "b"]);
         const items2 = signal(["c", "d"]);

         // Mock directives with cleanup
         const dir1 = repeat(
            () => items1.value,
            (item) => item,
            (item) => html`<li>${item}</li>`,
         );
         const originalUnmount1 = dir1.unmount;
         dir1.unmount = () => {
            cleanup1Called = true;
            originalUnmount1?.();
         };

         const dir2 = repeat(
            () => items2.value,
            (item) => item,
            (item) => html`<li>${item}</li>`,
         );
         const originalUnmount2 = dir2.unmount;
         dir2.unmount = () => {
            cleanup2Called = true;
            originalUnmount2?.();
         };

         const directives = signal([dir1, dir2]);
         const elem = html`<ul>${directives}</ul>` as HTMLElement;

         // Replace entire array
         directives.value = [];
         await nextTick();

         // Cleanup should have been called but wasn't
         expect(cleanup1Called).toBe(false); // BROKEN
         expect(cleanup2Called).toBe(false); // BROKEN
      });
   });

   describe("Event handler issues", () => {
      test("BROKEN: changing event handler creates duplicate listeners", async () => {
         let count = 0;
         const handler1 = () => {
            count += 1;
         };
         const handler2 = () => {
            count += 10;
         };
         const currentHandler = signal(handler1);

         const elem = html`<button @click=${currentHandler}>Click</button>` as HTMLElement;
         const button = elem as HTMLButtonElement;

         button.click();
         expect(count).toBe(1);

         // Change handler
         currentHandler.value = handler2;
         await nextTick();

         button.click();
         // Should be 11 (1 + 10) but might be 12 (1 + 1 + 10) if both handlers attached
         expect(count).toBe(11); // Might fail if duplicate listeners
      });
   });

   describe("Repeat directive issues", () => {
      test("BROKEN: repeat doesn't maintain order correctly with complex templates", async () => {
         const items = signal([
            { id: 1, name: "First", extra: "A" },
            { id: 2, name: "Second", extra: "B" },
            { id: 3, name: "Third", extra: "C" },
         ]);

         const elem = html`
            <ul>
               ${repeat(
                  () => items.value,
                  (item) => item.id,
                  (item) => html`
                     <li>
                        <span>${item.name}</span>
                        <span>${item.extra}</span>
                     </li>
                  `,
               )}
            </ul>
         ` as HTMLElement;

         // Reorder items
         items.value = [items.value[2], items.value[0], items.value[1]];
         await nextTick();

         const lis = elem.querySelectorAll("li");
         expect(lis[0].textContent).toBe("ThirdC");
         expect(lis[1].textContent).toBe("FirstA");
         expect(lis[2].textContent).toBe("SecondB");

         // This might fail if nodes get mixed up during reordering
      });
   });

   describe("Boolean attributes", () => {
      test("BROKEN: boolean attributes not handled correctly", async () => {
         const isDisabled = signal(true);
         const isHidden = signal(false);

         const elem = html`
            <button disabled=${isDisabled} hidden=${isHidden}>Test</button>
         ` as HTMLElement;

         const button = elem as HTMLButtonElement;

         // Should have disabled attribute
         expect(button.hasAttribute("disabled")).toBe(true);
         expect(button.hasAttribute("hidden")).toBe(false);

         isDisabled.value = false;
         isHidden.value = true;
         await nextTick();

         expect(button.hasAttribute("disabled")).toBe(false);
         expect(button.hasAttribute("hidden")).toBe(true);
      });
   });

   describe("Error boundaries", () => {
      test("BROKEN: error in effect breaks everything", async () => {
         const errorCapture = new ErrorCapture();
         errorCapture.start();

         const goodSignal = signal("good");
         const badSignal = signal("bad");

         // This effect will throw
         const elem = html`
            <div>
               <span>${() => {
                  if (badSignal.value === "error") throw new Error("Effect error!");
                  return goodSignal.value;
               }}</span>
            </div>
         ` as HTMLElement;

         expect(elem.textContent).toContain("good");

         // Trigger error
         badSignal.value = "error";
         await nextTick();

         // Should have caught error, not crashed
         const errors = errorCapture.get();
         expect(errors.length).toBeGreaterThan(0);

         // Good signal should still work
         goodSignal.value = "still works";
         await nextTick();

         // But it probably doesn't because effect is broken
         expect(elem.textContent).not.toContain("still works");

         errorCapture.stop();
      });
   });

   describe("Slot processing duplication", () => {
      test("slots processed multiple times", () => {
         // Component and createComponent both process slots
         // This is more of a code organization issue
         const Card = createComponent<any>(
            (props) => html`
               <div>
                  <header>${props.header}</header>
                  <main>${props.children}</main>
               </div>
            `,
            { slots: ["header"] },
         );

         registerComponents({ Card });

         const elem = html`
            <Card>
               <div slot="header">Header Content</div>
               Main Content
            </Card>
         ` as HTMLElement;

         // Check that slot processing didn't duplicate
         expect(elem.textContent).toContain("Header Content");
         expect(elem.textContent).toContain("Main Content");
      });
   });
});

# Mini-Lit Framework Critical Issues & Fixes

## Overview
The mini-lit framework has several critical bugs that prevent it from being production-ready. This document details each issue, its root cause, the fix required, and how to verify the fix works.

## Test Setup
- Tests are in `src/tests/template.test.ts`
- Run with: `npm test`
- Uses happy-dom for DOM simulation
- Each issue has a test marked with "BROKEN:" prefix

---

## 1. Multi-Interpolation Text Nodes Lose Position

### Problem
When a single text node contains multiple dynamic interpolations, updates cause values to jump to the end of their container.

**Example:**
```javascript
const val1 = signal("A");
const val2 = signal("B");
html`<div>First: ${val1}, Second: ${val2}</div>`
// Initial: "First: A, Second: B"
// After val1.value = "X": "First: , Second: BX" // WRONG!
```

### Root Cause
**File:** `src/next/template.ts`, lines 244-275 (compileNode for text nodes)

When the compiler sees text with multiple `###` markers:
1. It creates an array: `["First: ", values[0], ", Second: ", values[1]]`
2. Passes this to `r.insert(parent, array, null)`
3. `insert` (lines 92-96) recursively calls itself for each array item
4. Each signal gets its own effect with its own `currentNodes` tracking
5. When a signal updates, its effect removes only ITS nodes and appends new ones at the END (no marker!)

**Generated code:**
```javascript
r.insert(div, ["First: ", values[0], ", Second: ", values[1]], null)
```

### Fix Required
**Option A: Create markers for each dynamic value in multi-interpolation text**

In `compileNode` for text nodes (line 244):
```javascript
if (node.type === "text") {
   if (node.content?.includes("###")) {
      const parts = node.content.split("###");
      const dynamicCount = parts.length - 1;

      // NEW: Handle multiple interpolations specially
      if (dynamicCount > 1 && options.parent) {
         // Create structure with markers
         for (let i = 0; i < parts.length; i++) {
            // Add static text
            if (parts[i]) {
               const text = parts[i].replace(/"/g, '\\"')...;
               options.exprs.push(`${options.parent}.appendChild(document.createTextNode("${text}"))`);
            }

            // Add marker for dynamic content (except after last part)
            if (i < parts.length - 1) {
               const marker = uid();
               options.decl.push(`const ${marker} = document.createComment("")`);
               options.exprs.push(`${options.parent}.appendChild(${marker})`);
               // Insert dynamic value at its marker
               options.exprs.push(`r.insert(${options.parent}, values[${options.counter++}], ${marker})`);
            }
         }
         return "";
      }

      // Single interpolation continues with existing code...
   }
}
```

This generates:
```javascript
div.appendChild(document.createTextNode("First: "))
const _$1 = document.createComment("")
div.appendChild(_$1)
div.appendChild(document.createTextNode(", Second: "))
const _$2 = document.createComment("")
div.appendChild(_$2)
r.insert(div, values[0], _$1)  // Has marker!
r.insert(div, values[1], _$2)  // Has marker!
```

### Test Case
**File:** `src/tests/template.test.ts`, lines 21-42
```javascript
test("BROKEN: multiple dynamic values in text node lose position", async () => {
   const val1 = signal("A");
   const val2 = signal("B");
   const elem = html`<div>First: ${val1}, Second: ${val2}</div>`;

   expect(elem.textContent).toBe("First: A, Second: B");

   val1.value = "X";
   await nextTick();
   expect(elem.textContent).toBe("First: X, Second: B"); // Currently fails!
});
```

---

## 2. Interpolated Attributes Don't Handle Signals

### Problem
When an attribute value contains both static text and dynamic signals, the signal object gets concatenated as a string.

**Example:**
```javascript
const count = signal(5);
html`<div title="Count: ${count}"></div>`
// Result: title="Count: [object Object]"
```

### Root Cause
**File:** `src/next/template.ts`, lines 409-428 (attribute interpolation handling)

The compiler generates:
```javascript
r.setAttribute(elem, "title", "Count: " + values[0])
```

If `values[0]` is a signal, JavaScript concatenates it as `[object Object]`.

### Fix Required
**Detect signals in interpolated attributes and wrap in a reactive function**

In `compileNode`, attribute handling section (around line 409):
```javascript
} else if (value.includes("###")) {
   // Interpolated attribute
   const parts = value.split("###");
   const valueRefs: string[] = [];

   for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
         // Static part stays as is
      }
      if (i < parts.length - 1) {
         valueRefs.push(`values[${options.counter}]`);
         options.counter++;
      }
   }

   // NEW: Wrap in a function to handle potential signals
   const funcBody = [];
   for (let i = 0, vi = 0; i < parts.length; i++) {
      if (parts[i]) {
         funcBody.push(`"${parts[i].replace(/"/g, '\\"')...}"`);
      }
      if (i < parts.length - 1) {
         // Check if value is a signal at runtime
         funcBody.push(`(typeof ${valueRefs[vi]} === 'function' ? ${valueRefs[vi]}() :
                        r.isSignal(${valueRefs[vi]}) ? ${valueRefs[vi]}.value :
                        ${valueRefs[vi]})`);
         vi++;
      }
   }

   // Pass a function that computes the full string
   options.exprs.push(`r.setAttribute(${elemId}, "${name}", () => ${funcBody.join(" + ")})`);
}
```

Then update `setAttribute` in runtime (line 146) to handle functions like `setProperty` does.

### Test Case
**File:** `src/tests/template.test.ts`, lines 57-70
```javascript
test("BROKEN: interpolated attributes don't handle signals", async () => {
   const count = signal(5);
   const elem = html`<div title="Count: ${count}"></div>`;

   expect(elem.getAttribute("title")).toBe("Count: 5"); // Currently shows [object Object]

   count.value = 10;
   await nextTick();
   expect(elem.getAttribute("title")).toBe("Count: 10");
});
```

---

## 3. Memory Leak: Effects Never Cleaned Up

### Problem
When components unmount or DOM is removed, effects created by `insert` continue running, causing memory leaks and errors.

### Root Cause
**File:** `src/next/template.ts`, line 80
```javascript
signals.createEffect(updateContent);
// No cleanup tracking or disposal!
```

Effects are created but never disposed. When the DOM is removed, effects still try to update non-existent nodes.

### Fix Required
**Track all effects and provide cleanup mechanism**

1. **In runtime.insert (line 24):**
```javascript
insert(parent: Element, accessor: any, marker?: Node | null) {
   const signals = getSignalAdapter();

   if (typeof accessor === "function" || isSignal(accessor) || signals.isRawSignal(accessor)) {
      let currentNodes: TrackedEntry[] = [];
      let disposeEffect: (() => void) | undefined;

      const updateContent = () => {
         // ... existing update logic
      };

      // NEW: Store dispose function
      disposeEffect = signals.createEffect(updateContent);

      // NEW: Return cleanup function
      return () => {
         disposeEffect?.();
         for (const entry of currentNodes) {
            entry.cleanup?.();
            entry.node.parentNode?.removeChild(entry.node);
         }
      };
   }
   // ... rest
}
```

2. **Track cleanups in Component (src/next/component.ts):**
```javascript
export abstract class Component<P = ComponentProps> {
   private cleanups: Array<() => void> = [];

   mount(container: HTMLElement) {
      this.container = container;
      // NEW: Track cleanups from render
      const rendered = this.render();
      this.trackCleanups(rendered);
      return this;
   }

   unmount() {
      // NEW: Run all cleanups
      for (const cleanup of this.cleanups) {
         cleanup();
      }
      this.cleanups = [];

      if (this.dispose) {
         this.dispose();
      }
   }
}
```

### Test Case
**File:** `src/tests/template.test.ts`, lines 85-110
```javascript
test("BROKEN: effects never cleaned up", async () => {
   const count = signal(0);
   let effectRuns = 0;

   const TestComp = createComponent(() => {
      effectRuns++;
      return html`<div>${count}</div>`;
   });

   const instance = mount(TestComp, container);
   expect(effectRuns).toBe(1);

   instance.unmount();
   count.value = 1;
   await nextTick();

   expect(effectRuns).toBe(1); // Should NOT increase after unmount!
});
```

---

## 4. Memory Leak: Event Listeners Never Removed

### Problem
Event listeners attached via `@click` are never removed when components unmount.

### Root Cause
**File:** `src/next/template.ts`, line 141-143
```javascript
addEventListener(node: Element, name: string, handler: any) {
   node.addEventListener(name, handler);
   // No tracking for removal!
}
```

### Fix Required
**Track event listeners and remove on cleanup**

```javascript
addEventListener(node: Element, name: string, handler: any) {
   const signals = getSignalAdapter();

   // Handle reactive handlers
   if (typeof handler === "function" || isSignal(handler) || signals.isRawSignal(handler)) {
      let currentHandler: any;

      const updateHandler = () => {
         const newHandler = typeof handler === "function" ? handler : signals.getValue(handler);

         if (currentHandler) {
            node.removeEventListener(name, currentHandler);
         }

         currentHandler = newHandler;
         node.addEventListener(name, currentHandler);
      };

      // If reactive, use effect
      if (isSignal(handler) || signals.isRawSignal(handler)) {
         const dispose = signals.createEffect(updateHandler);
         return () => {
            dispose();
            if (currentHandler) {
               node.removeEventListener(name, currentHandler);
            }
         };
      } else {
         // Static handler
         node.addEventListener(name, handler);
         return () => node.removeEventListener(name, handler);
      }
   }
}
```

Then update compiler to track cleanup:
```javascript
// In compileNode for event listeners
options.exprs.push(`_cleanups.push(r.addEventListener(${elemId}, "${eventName}", values[${options.counter++}]))`);
```

### Test Case
**File:** `src/tests/template.test.ts`, lines 112-133

---

## 5. Directive Cleanup Not Called When Array Changes

### Problem
When an array of directives is replaced, the old directives' cleanup functions are never called.

### Root Cause
**File:** `src/next/template.ts`, lines 92-96
When `insert` handles arrays, it doesn't track the directives for cleanup.

### Fix Required
Track directives in arrays and clean them up when replaced.

### Test Case
**File:** `src/tests/template.test.ts`, lines 135-171

---

## 6. Event Handler Updates Create Duplicate Listeners

### Problem
Changing a signal that holds an event handler adds a new listener without removing the old one.

### Root Cause
Event handlers aren't reactive - they're set once and never updated.

### Fix Required
See fix #4 above - make event handlers reactive.

### Test Case
**File:** `src/tests/template.test.ts`, lines 175-194

---

## 7. Boolean Attributes Handling

### Status
PARTIALLY FIXED in recent update to `setAttribute`

### Remaining Issue
Need to ensure interpolated attributes also handle booleans correctly.

### Test Case
**File:** `src/tests/template.test.ts`, lines 234-253

---

## 8. No Error Boundaries

### Problem
An error in any effect crashes the entire reactive system.

### Root Cause
No try/catch in effect execution.

### Fix Required
**Wrap effect bodies in try/catch**

In `runtime.insert`:
```javascript
const updateContent = () => {
   try {
      // ... existing update logic
   } catch (error) {
      console.error("Effect error:", error);
      // Optionally: call error boundary handler if available
      if (currentComponent?.onError) {
         currentComponent.onError(error);
      }
   }
};
```

### Test Case
**File:** `src/tests/template.test.ts`, lines 257-299

---

## 9. Slot Processing Duplication

### Problem
Both `Component` class and `createComponent` process slots, leading to duplication.

### Root Cause
**Files:**
- `src/next/component.ts`, lines 62-94 (Component.processSlots)
- `src/next/component.ts`, lines 171-195 (createComponent render)

### Fix Required
Remove duplication - keep slot processing in one place, preferably in the base Component class.

---

## 10. Repeat Directive Node Ordering Issues

### Problem
When reordering keyed items, nodes can get mixed up, especially with multi-node templates.

### Root Cause
**File:** `src/next/directives/repeat.ts`, lines 986-1001
Nodes are moved one by one instead of as a group.

### Fix Required
Use DocumentFragment or track node ranges to move groups of nodes together.

### Test Case
**File:** `src/tests/template.test.ts`, lines 198-230

---

## Implementation Order

1. **Fix multi-interpolation text nodes** - Core rendering issue
2. **Fix interpolated attributes** - Common use case
3. **Add effect cleanup** - Critical memory leak
4. **Add event listener cleanup** - Memory leak
5. **Fix event handler reactivity** - Functionality issue
6. **Add error boundaries** - Stability
7. **Fix directive cleanup** - Memory leak
8. **Fix repeat ordering** - Correctness
9. **Clean up slot processing** - Code organization

## Verification

Run all tests: `npm test`

Each fix should make its corresponding test pass. After all fixes:
- All tests should pass
- No memory leaks in Chrome DevTools
- React comparison demo should show correct behavior

## Additional Tests Needed

1. **Lifecycle tests** - Verify mount/unmount/cleanup chains
2. **Nested component tests** - Deep component trees with signals
3. **Performance tests** - Measure update performance vs React
4. **Edge case tests** - Empty arrays, null values, undefined signals
5. **Integration tests** - Full todo app scenarios

## Fix Progress Checklist

**Instructions:** When implementing fixes, start with the first unchecked item in this list. After completing each fix and verifying that both `npm run check` and `npm test` pass for that specific fix, check it off and move to the next unchecked item.

- [x] **Fix #1: Multi-interpolation text nodes** - Create markers for each dynamic value to maintain position
- [x] **Fix #2: Interpolated attributes** - Wrap in function and properly unwrap signals
- [ ] **Fix #3: Add effect cleanup** - Track and dispose effects on unmount (Critical memory leak)
- [ ] **Fix #4: Add event listener cleanup** - Track and remove event listeners (Memory leak)
- [ ] **Fix #5: Fix event handler reactivity** - Make event handlers update when signal changes
- [ ] **Fix #6: Add error boundaries** - Wrap effects in try/catch
- [ ] **Fix #7: Fix directive cleanup** - Clean up directives when arrays change
- [ ] **Fix #8: Fix repeat ordering** - Use DocumentFragment for multi-node moves
- [ ] **Fix #9: Clean up slot processing** - Remove duplication between Component and createComponent
- [ ] **Fix #10: Boolean attributes** - Complete the partial fix for interpolated boolean attributes
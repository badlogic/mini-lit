# next-webcomponent Runtime Plan

## Snapshot
- ~500 LOC runtime that turns tagged `html` templates into live DOM with fine-grained reactivity via Preact signals.
- Components are real custom elements created through `component(tag, render)`; each instance owns its lifecycle and cleanups.
- Reactive interpolations (`${() => ...}`) re-run inside `effect` scopes; fragments carry tear-down hooks even when mounted outside a component.
- Latest guard: passing a raw `signal` directly into props now logs a warning and throws so consumers must supply accessors.

## Backlog
Pending items we agreed to explore next. Check items off as we implement them.

- [ ] **Fast-path reactive text updates**  
  *Motivation:* A simple counter like `${() => count.value}` causes DevTools to highlight the parent node on every tick because we remove and recreate the text node.  
  *Implementation sketch:* During `materialize`, detect when an interpolation resolves to a single text node. Cache that node and, on subsequent runs, mutate `node.data` instead of clearing the region. Fall back to the existing path for fragments/arrays.  
  *Manual test:* In `page-next-webcomponent.ts`, spam the counter button and confirm the `<p>` no longer flashes in DevTools and retains selection/caret state.

- [ ] **Event-handler defaults in `defaultProps`**  
  *Motivation:* Components often want safe fallbacks (`onReset`, `onChange`). Today `defaultProps` ignores handler defaults, forcing manual `resolved.onReset ?? (() => {})` logic.  
  *Implementation sketch:* When `defaultProps` sees an `on*` key in the defaults map, wrap literal functions into accessors internally, but expose them back as callables (`() => void`). This keeps handler types intact while guaranteeing non-undefined defaults.  
  *Manual test:* Remove `onReset` from the second counter demo and rely on a default no-op; clicking “Reset” should not throw and the log should confirm the default executed.

- [ ] **Keyed list helper for collections**  
  *Motivation:* Patterns like `${() => todos.map(todo => html`<li>${todo.name}</li>`)} }` recreate every `<li>` on each update, dropping focus and scrolling state.  
  *Implementation sketch:* Add a `list(itemsAccessor, keyFn, renderFn)` helper that performs a keyed diff (insert/move/remove) while reusing existing nodes. Hook it into `interpret` by returning a function so it still slots into reactive interpolations.  
  *Manual test:* Build a todo demo where you toggle one item’s completion. Focus a checkbox or input inside another item and ensure it stays focused after the update.

- [ ] **Root-level cleanup helper** *(nice to have)*  
  *Motivation:* Pages rendered with plain `html``…`` lack a parent owner, making global teardown manual.  
  *Implementation sketch:* Export `renderRoot(target, templateFn)` that calls `createOwner`, appends the fragment, and returns a disposer. This keeps the interpreter untouched but gives consumers a single unmount hook.  
  *Manual test:* Call the new helper from `example/src/main.ts` (or a scratch file), then invoke the returned disposer from the console and ensure all timers/listeners stop.

## Completed
- [x] **Signal guard in prop normalization** – Passing a raw `signal` now warns and throws with guidance to wrap it in an accessor.

Feel free to extend this checklist as new ideas surface.

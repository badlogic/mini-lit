# Tailwind Variants Integration for Mini-Lit

## Current Status: MOSTLY IMPLEMENTED

### What's Working
1. ✅ **Tailwind Variants installed and integrated** - Replaced CVA with TV
2. ✅ **Single-element components** - Button works perfectly with className function
3. ✅ **Multi-element components with slots** - Checkbox uses slots system
4. ✅ **Auto-generation of slot className props** - Props like `inputClassName`, `labelClassName` are auto-generated
5. ✅ **Type inference for render functions** - `renderComponent` correctly infers whether component uses slots or not
6. ✅ **Runtime slot className application** - The slot functions properly apply user-provided className overrides

### What's Broken
1. ❌ **Class component type safety** - `ExtractPropsForClass` creates type conflicts with index signatures
2. ❌ **Type complexity** - The type system has become too complex with the auto-generated props

## The Problem

### Original Problem (SOLVED)
Our CVA-based component system had a fundamental limitation: **one component = one style string**. This is now solved with Tailwind Variants slots.

### Current Problem
The type system is struggling with the auto-generated slot className props. When we define a component with slots:

```typescript
export const checkboxDefinition = defineComponent({
   tag: "mini-checkbox",
   slots: ["base", "input", "label", "icon"] as const,
   // ...
});
```

The `defineComponent` function auto-generates props like `inputClassName`, `labelClassName`, etc. at runtime. We've made TypeScript aware of these through type manipulation:

```typescript
type SlotClassNameProps<T extends ComponentDefinition> = T["slots"] extends readonly string[]
   ? {
        [K in T["slots"][number] as K extends "base" ? never : `${K}ClassName`]: {
           type: "classname";
           default: undefined;
           description: string;
        };
     }
   : Record<string, never>;
```

But when we try to enforce that class components implement all required props via `implements ExtractPropsForClass<...>`, TypeScript complains about missing index signatures.

## Current Architecture

### Component Definition Flow
```
defineComponent() → styleComponent() → renderComponent() → createComponent()
     ↓                    ↓                   ↓                    ↓
 Definition +         TV styles        Render function      Final component
 Auto-generated      (with/without    (gets className
 slot props            slots)          or slots object)
```

### Key Files and Their Roles

1. **`src/component.ts`** - Core component system
   - `ComponentDefinition` type now includes `slots?: readonly string[]`
   - `defineComponent()` - Auto-generates slot className props when slots are defined
   - `styleComponent()` - Overloaded for SimpleStyles and SlotStyles
   - `renderComponent()` - Takes definition, styles, and render function to infer correct signature
   - `createComponent()` - Uses type guard `hasSlots()` to determine runtime behavior

2. **`src/Button.cva.ts`** - Single-element component example
   - No slots defined
   - Receives `className` function in render
   - Works perfectly

3. **`src/Checkbox.cva.ts`** - Multi-element component with slots
   - Defines `slots: ["base", "input", "label", "icon"]`
   - Receives `slots` object in render with functions for each slot
   - Auto-generated props work at runtime but cause type issues

### How Slots Work

1. **Definition declares slots**:
```typescript
const checkboxDefinition = defineComponent({
   slots: ["base", "input", "label", "icon"] as const,
   // ...
});
```

2. **Styles define slot classes**:
```typescript
const checkboxStyles = styleComponent(checkboxDefinition, {
   slots: {
      base: "flex items-start",
      input: "peer shrink-0 rounded-sm ...",
      label: "font-medium leading-none ...",
      icon: "flex items-center ..."
   },
   variants: {
      size: {
         sm: { base: "gap-1.5", input: "h-3 w-3", ... },
         // ...
      }
   }
});
```

3. **Render function receives slots object**:
```typescript
const renderCheckbox = renderComponent(checkboxDefinition, checkboxStyles, (props, slots) => {
   return html`
      <div class=${slots.base()}>
         <input class=${slots.input()} />
         <label class=${slots.label()}>${props.label}</label>
      </div>
   `;
});
```

4. **Users can customize each slot**:
```typescript
Checkbox({
   className: "p-4",              // Applies to base
   inputClassName: "rounded-full", // Applies to input
   labelClassName: "text-red-600"  // Applies to label
})
```

### The Type Issue

The problem is in `ExtractPropsForClass`:

```typescript
type RequiredDefinitionProps<T extends ComponentDefinition> = Pick<DefinitionPropValues<T>, ClassPropKeys<T>>;

export type ExtractPropsForClass<T extends ComponentDefinition> = ExtractVariants<T> & RequiredDefinitionProps<T>;
```

When a class implements `ExtractPropsForClass`, TypeScript expects an index signature because of how `Pick` works with mapped types that include auto-generated props. The error:

```
Type 'MiniButton' incorrectly implements interface 'ButtonPropsForClass'.
  Index signature for type 'string' is missing in type 'MiniButton'.
```

## Possible Solutions

1. **Simplify ExtractPropsForClass** - Make it less strict but lose some type safety
2. **Explicit prop declaration** - Don't auto-generate, require manual declaration (loses DRY)
3. **Different type enforcement mechanism** - Find another way to ensure classes have all props
4. **Separate the auto-generated props** - Handle them differently in the type system

## What Needs to Be Done

1. Fix the `ExtractPropsForClass` type to work with auto-generated slot className props
2. Ensure class components can implement the interface without index signature conflicts
3. Maintain full type safety - the class should be forced to implement all required props
4. Keep the developer experience clean - auto-generation should work transparently

## Key Insight

The auto-generation of slot className props is working perfectly at runtime. The issue is purely at the TypeScript type level. We need a way to make TypeScript understand that these props exist without creating index signature requirements that break class implementations.

## Dependencies

- `tailwind-variants`: ^3.1.1
- `tailwind-merge`: ^3.3.1 (required by tailwind-variants)
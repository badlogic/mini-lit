# Tailwind Variants Integration for Mini-Lit

## The Problem

### Current Limitations
Our current CVA-based component system has a fundamental limitation: **one component = one style string**. This works for simple components like Button, but fails for compound components like Checkbox that have multiple styleable elements.

**Example of the problem:**
```typescript
// In Checkbox.cva.ts, we have hardcoded styles in the render function:
const inputClasses = `peer ${sizeClasses[size || "md"]} shrink-0 rounded-sm border ${variantClasses[variant || "default"]}...`;
const labelClasses = `${labelSizeClasses[size || "md"]} font-medium leading-none...`;

// Users can only customize the container via className:
Checkbox({ className: "p-4" }) // Only affects container, not input or label!
```

### Files to Read for Context

1. **`src/component.ts`** - Core component system
   - `defineComponent()` - Creates component definitions with variants/props
   - `styleComponent()` - Creates CVA-based styles
   - `renderComponent()` - Creates render functions that receive (props, variants)
   - `createComponent()` - Combines definition, styles, and render into a component

2. **`src/Button.cva.ts`** - Example of working single-element component
   - Shows the pattern: definition → styles → render → create

3. **`src/Checkbox.cva.ts`** - Example of the problem
   - Lines 105-133: Hardcoded styles in render function
   - Can't customize input or label styles

4. **`src/mini.ts`** - The `fc` function for creating functional components

### Current Architecture Flow
```
defineComponent() → styleComponent() → renderComponent() → createComponent()
     ↓                    ↓                   ↓                    ↓
 Definition          CVA styles        Render function      Final component
                    (single string)    (props, variants)
```

The `variants` parameter in render is a single function that returns one class string.

## The Solution: Tailwind Variants for Everything

### Why Tailwind Variants?
- **Handles both single and multi-element components** - Works with or without slots
- **Full CVA replacement** - More features, same mental model
- **Type-safe** - Full TypeScript support with compile-time checking
- **Proven pattern** - Used by NextUI, many other libraries

### Key Insight: TV Already Handles Both Cases!

```typescript
// TV without slots → returns a string
const buttonStyles = tv({ base: "...", variants: {...} });
buttonStyles({ size: "sm" }) // → "base-classes size-sm-classes"

// TV with slots → returns slots object
const checkboxStyles = tv({ slots: {...}, variants: {...} });
checkboxStyles({ size: "sm" }) // → { base: () => "...", input: () => "...", label: () => "..." }
```

### Proposed Architecture Changes

#### 1. Two style types with overloaded `styleComponent()`
```typescript
// For single-element components (Button)
type SimpleStyles<T extends ComponentDefinition> = {
  base?: string;
  variants: MappedVariants<T>;  // Derived from T's variant definitions
  defaultVariants?: DefaultVariants<T>;
  compoundVariants?: CompoundVariants<T>[];
};

// For multi-element components (Checkbox)
type SlotStyles<T extends ComponentDefinition, Slots extends Record<string, string>> = {
  slots: Slots;
  variants: MappedSlotVariants<T, Slots>;  // Variants can affect any slot
  defaultVariants?: DefaultVariants<T>;
  compoundVariants?: CompoundSlotVariants<T, Slots>[];
};

// Overloaded styleComponent for compile-time type checking
export function styleComponent<T extends ComponentDefinition>(
  definition: T,
  styles: SimpleStyles<T>
): SimpleStyles<T>;

export function styleComponent<T extends ComponentDefinition, S extends Record<string, string>>(
  definition: T,
  styles: SlotStyles<T, S>
): SlotStyles<T, S>;

export function styleComponent(definition: any, styles: any) {
  // Just return styles - the type checking happens at compile time!
  return styles;
}
```

#### 2. Conditional render function signature based on style type
```typescript
// The render function signature changes based on whether slots exist
type RenderFunction<Props, Styles> =
  Styles extends { slots: any }
    ? (props: Props, slots: TVSlotResult<Styles>) => TemplateResult
    : (props: Props, className: (overrides?: ClassValue) => string) => TemplateResult;

// For Button (no slots): receives a className function
(props, className) => html`<button class=${className()}>${props.children}</button>`

// For Checkbox (slots): receives slots object
(props, slots) => html`
  <div class=${slots.base()}>
    <input class=${slots.input()} />
    <label class=${slots.label()}>${props.label}</label>
  </div>
`
```

#### 3. Smart `createComponent()` that preserves type safety
```typescript
export function createComponent<T extends ComponentDefinition, S>(
  definition: T,
  styles: S,  // S carries the information about slots or no slots
  render: RenderFunction<ExtractProps<T>, S>
) {
  const tvInstance = tv(styles as any);

  return fc<ExtractProps<T>>((props) => {
    if ('slots' in styles) {
      // Multi-element: pass slots object
      const slots = tvInstance(extractVariantProps(props));
      return render(props, slots);
    } else {
      // Single element: pass className function
      const className = (overrides?: ClassValue) =>
        tvInstance({ ...extractVariantProps(props), class: overrides });
      return render(props, className);
    }
  });
}
```

#### 4. Auto-generate slot className props
When a component uses slots, automatically add props:
- `className` → base slot
- `[slotName]ClassName` → that slot

```typescript
// If slots: { base, input, label } detected
// Auto-add to props:
{
  className: { type: "string", slot: "base" },
  inputClassName: { type: "string", slot: "input" },
  labelClassName: { type: "string", slot: "label" }
}
```

### Complete Implementation Examples

#### Button.cva.ts - Single Element Component
```typescript
import { tv } from "tailwind-variants";  // Using TV for everything now!

// Step 1: Define component
export const buttonDefinition = defineComponent({
  tag: "mini-button",
  variants: {
    variant: {
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"] as const,
      default: "default",
    },
    size: {
      options: ["default", "sm", "lg", "icon"] as const,
      default: "default",
    },
  },
  props: {
    disabled: { type: "boolean", default: false },
    loading: { type: "boolean", default: false },
    onClick: { type: "function", default: undefined },
  },
});

// Step 2: Define styles (no slots = simple component)
export const buttonStyles = styleComponent(buttonDefinition, {
  base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
});

// Step 3: Render function receives className function (not slots!)
export const renderButton = renderComponent(buttonDefinition, (props, className) => {
  const { disabled, loading, onClick, children, className: userClassName } = props;

  return html`
    <button
      class=${className(userClassName)}  // Pass user's className as override
      ?disabled=${disabled || loading}
      @click=${onClick}
    >
      ${loading ? html`<span class="animate-spin">${loadingIcon}</span>` : ""}
      ${children}
    </button>
  `;
});

// Step 4: Create component
export const Button = createComponent(buttonDefinition, buttonStyles, renderButton);

// Usage:
Button({
  variant: "destructive",
  size: "lg",
  className: "shadow-lg", // Adds to the button's classes
  children: "Delete All"
})
```

#### Checkbox.cva.ts - Multi-Element Component with Slots
```typescript
// Step 1: Define component
export const checkboxDefinition = defineComponent({
  tag: "mini-checkbox",
  variants: {
    size: { options: ["sm", "md", "lg"], default: "md" },
    variant: { options: ["default", "primary", "destructive"], default: "default" }
  },
  props: {
    checked: { type: "boolean", default: false },
    label: { type: "string", default: undefined },
    disabled: { type: "boolean", default: false },
    onChange: { type: "function", default: undefined },
    // These would be auto-generated when slots are detected:
    inputClassName: { type: "string", default: undefined },
    labelClassName: { type: "string", default: undefined },
  }
});

// Step 2: Define styles with slots
export const checkboxStyles = styleComponent(checkboxDefinition, {
  slots: {
    base: "flex items-start",
    input: "peer shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    label: "font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
  },
  variants: {
    size: {
      sm: {
        base: "gap-1.5",
        input: "h-3 w-3",
        label: "text-xs"
      },
      md: {
        base: "gap-2",
        input: "h-4 w-4",
        label: "text-sm"
      },
      lg: {
        base: "gap-3",
        input: "h-5 w-5",
        label: "text-base"
      }
    },
    variant: {
      default: {
        input: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      },
      primary: {
        input: "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      },
      destructive: {
        input: "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground"
      }
    }
  }
});

// Step 3: Render function receives slots object (not className!)
export const renderCheckbox = renderComponent(checkboxDefinition, (props, slots) => {
  const { checked, disabled, label, onChange, className, inputClassName, labelClassName } = props;

  const handleChange = (e: Event) => {
    onChange?.((e.target as HTMLInputElement).checked);
  };

  return html`
    <div class=${slots.base({ class: className })}>
      <input
        type="checkbox"
        class=${slots.input({ class: inputClassName })}
        .checked=${checked || false}
        ?disabled=${disabled}
        data-state=${checked ? "checked" : "unchecked"}
        @change=${handleChange}
      />
      ${label ? html`
        <label class=${slots.label({ class: labelClassName })}>
          ${label}
        </label>
      ` : ''}
    </div>
  `;
});

// Step 4: Create component
export const Checkbox = createComponent(checkboxDefinition, checkboxStyles, renderCheckbox);

// Usage:
Checkbox({
  variant: "destructive",
  size: "lg",
  label: "Delete account",
  className: "p-4",              // Adds to container
  inputClassName: "rounded-full", // Makes checkbox circular
  labelClassName: "text-red-600 font-bold" // Red bold label
})
```

### Type Safety Guarantees

The solution provides complete type safety:

1. **styleComponent overloads** ensure styles match the definition's variants
2. **Conditional render type** means Button gets a className function, Checkbox gets slots
3. **Automatic prop generation** for slot-specific className props
4. **Full IntelliSense** for all variant options and slot names

### Migration Strategy

1. **Install tailwind-variants**: `npm install tailwind-variants`
2. **Update component.ts**:
   - Replace CVA with TV
   - Add overloaded styleComponent signatures
   - Update createComponent to handle both single and slot styles
   - Add conditional RenderFunction type
3. **Migrate components**:
   - Button: Already works, just switch from CVA to TV (no slots needed)
   - Checkbox: Add slots structure, update render to use slots
   - Future components: Use slots when multiple elements need styling

### Key Benefits

- **Full customization** - Users can style any element within a component
- **Type safety** - Everything checked at compile time, no runtime surprises
- **Clean API** - Simple components stay simple, complex ones get slots
- **Progressive enhancement** - Add slots only when needed
- **Familiar patterns** - Matches React/Vue component libraries
- **One dependency** - TV replaces CVA, not an additional library

### No Backwards Compatibility Needed!

Since we're switching fully to tailwind-variants:
- All components use TV (simpler mental model)
- Single-element components just don't have slots
- Consistent API across all components
- No need to maintain two systems
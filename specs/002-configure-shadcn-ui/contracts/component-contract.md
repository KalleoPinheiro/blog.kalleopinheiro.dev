# Component Contract: UI Library Components

**Version**: 1.0  
**Effective Date**: 2026-04-20

## Purpose

This contract defines the interface, structure, and behavior expectations for all components in the `src/components/ui/` directory. Every component added to this directory must conform to this contract.

## Component File Structure

```typescript
// src/components/ui/button.tsx

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Define component variants using CVA (Class Variance Authority)
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
        // ... more variants
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        // ... more sizes
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Define props interface combining HTML attributes + component variants
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// Component implementation with forwardRef for ref support
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = "Button"

// Export component and variant types for external use
export { Button, buttonVariants, type ButtonProps }
```

## Contractual Requirements

### 1. **Export Signature**

Every component file must export:
- ✓ `Component` (named export): The React component itself
- ✓ `ComponentProps` (named export): TypeScript interface for component props
- ✓ `componentVariants` (named export): CVA variants object (if applicable)

**Rationale**: Enables type-safe prop usage and variant composition by consuming code.

**Example**:
```typescript
export { Button, buttonVariants, type ButtonProps }
```

### 2. **Component Signature**

Components must:
- ✓ Accept standard HTML element attributes for the underlying DOM node
- ✓ Support `className` prop for style composition
- ✓ Support `ref` forwarding via `React.forwardRef`
- ✓ Have `displayName` set for debugging in React DevTools

**Rationale**: Ensures components integrate seamlessly with Next.js styling patterns and standard React conventions.

**Example**:
```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...)
Button.displayName = "Button"
```

### 3. **Styling Method**

Components must use:
- ✓ Tailwind CSS classes for styling
- ✓ CVA (Class Variance Authority) for variant management
- ✓ `cn()` utility (from `@/lib/utils`) to merge class names
- ✗ No inline styles or CSS-in-JS
- ✗ No styled-components or emotion

**Rationale**: Maintains consistency with project's Tailwind CSS setup; enables static analysis and tree-shaking.

**Example**:
```typescript
const buttonVariants = cva("base-classes", {
  variants: { variant: { ... }, size: { ... } }
})
const className = cn(buttonVariants({ variant, size }), className)
```

### 4. **Accessibility (a11y)**

Components must:
- ✓ Use semantic HTML elements
- ✓ Include ARIA attributes where needed (role, aria-label, aria-pressed, etc.)
- ✓ Support keyboard navigation (if interactive)
- ✓ Have sufficient color contrast (WCAG AA minimum)
- ✓ Be screen-reader friendly

**Rationale**: Ensures application is usable by all users; meets legal/compliance standards (WCAG 2.1 Level AA).

**Example**:
```typescript
<button aria-pressed={isPressed} {...props} />
```

### 5. **Type Safety**

Components must:
- ✓ Fully typed with TypeScript (no `any` types)
- ✓ Export clear, documented prop interfaces
- ✓ Support React.ReactNode and React.ReactElement in prop types as needed
- ✗ No loose prop typing

**Rationale**: Enables IDE autocomplete; prevents runtime prop errors; documents expected usage.

### 6. **Documentation**

Component files may include JSDoc comments:
- ✓ Component description (brief, 1-2 lines)
- ✓ Usage example (optional, for complex components)
- ✗ Over-documentation (let code be self-explanatory)

**Example**:
```typescript
/**
 * A flexible button component supporting multiple variants and sizes.
 * @example
 * <Button variant="outline" size="sm">Click me</Button>
 */
```

### 7. **Dependencies**

Components must:
- ✓ Only import from Radix UI, React, and project utilities
- ✓ Not import other UI components (to avoid circular dependencies)
- ✓ Import utilities from `@/lib/utils` (cn, etc.)
- ✗ Not create component-to-component dependencies

**Rationale**: Prevents circular imports; keeps components composable and reusable independently.

### 8. **Variant Structure (CVA)**

If component has variants:
- ✓ Use CVA (Class Variance Authority) for variant definitions
- ✓ Define all variant combinations explicitly
- ✓ Set sensible default variants
- ✓ Use compound variants for complex combinations

**Rationale**: Provides type-safe, composable variant system; prevents invalid prop combinations.

**Example**:
```typescript
const buttonVariants = cva("...", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" }
})
```

## Verification Checklist

Before a component is considered valid:

- [ ] File is in `src/components/ui/`
- [ ] File exports Component, ComponentProps, and (if applicable) componentVariants
- [ ] Component uses `React.forwardRef` and has `displayName`
- [ ] All styles use Tailwind CSS + CVA + cn()
- [ ] No inline styles or CSS-in-JS
- [ ] TypeScript types are complete (no `any`)
- [ ] Component includes ARIA attributes where needed
- [ ] Props interface extends HTML element attributes
- [ ] JSDoc comment present (brief)
- [ ] No imports from other UI components
- [ ] Exports are named exports (not default export)

## Breaking This Contract

Violations of this contract must be:
1. Identified in code review
2. Documented with specific violations
3. Resolved before merge

Examples of violations:
- ✗ Exporting component as default instead of named export
- ✗ Using styled-components instead of Tailwind
- ✗ Omitting TypeScript types
- ✗ Circular component imports
- ✗ No ref forwarding for components that accept HTML attributes

## Contract Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-20 | Initial contract for shadcn/ui integration |

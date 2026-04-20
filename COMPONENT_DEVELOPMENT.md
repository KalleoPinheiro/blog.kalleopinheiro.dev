# Component Development Guide

This guide provides best practices and workflows for developing and integrating new components in the blog project using shadcn/ui and Radix UI.

## Table of Contents

- [Getting Started](#getting-started)
- [Component Structure](#component-structure)
- [Creating a New Component](#creating-a-new-component)
- [Testing Components](#testing-components)
- [Documentation](#documentation)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (package manager)
- TypeScript 5.x
- Understanding of React and Tailwind CSS

### Project Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **UI Framework**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Component Variants**: CVA (Class Variance Authority)
- **Testing**: Vitest + @testing-library/react
- **Icons**: Lucide React

## Component Structure

All components are located in `src/components/ui/` and follow this structure:

```
src/components/ui/
├── button.tsx          # Component implementation
├── input.tsx
├── card.tsx
├── __tests__/
│   ├── button.test.tsx # Component tests
│   └── card.test.tsx
└── showcase/           # Demo components
    ├── ButtonShowcase.tsx
    ├── CardShowcase.tsx
    └── ...
```

### Component File Template

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  // Base styles
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        outline: "border border-input bg-background",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-base",
        lg: "h-10 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface ComponentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Component.displayName = "Component"

export { Component, componentVariants }
```

## Creating a New Component

### Step 1: Choose a Component

Visit [shadcn/ui components](https://ui.shadcn.com) to browse available components.

Common components:
- `Dialog` - Modal dialogs
- `Dropdown Menu` - Dropdown menus
- `Form` - Form handling with React Hook Form
- `Tooltip` - Tooltip overlays
- `Badge` - Status indicators
- `Progress` - Progress bars
- `Tabs` - Tabbed content
- `Accordion` - Collapsible content

### Step 2: Get Component Source

Using MCP (Recommended):
```bash
# Ask Claude to fetch component source via MCP
# Claude will provide complete component code
```

Using shadcn/ui CLI:
```bash
pnpm dlx shadcn-ui@latest add [component-name]
```

### Step 3: Create Component File

Save component to `src/components/ui/[name].tsx`:

```bash
cp /path/to/component/source.tsx src/components/ui/[name].tsx
```

### Step 4: Verify Imports

Ensure all imports are correct:

```typescript
// ✅ Good
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

// ❌ Avoid
import { cn } from "../lib/utils"
import AlertCircle from "lucide-react"
```

### Step 5: Create Test File

Create `src/components/ui/__tests__/[name].test.tsx`:

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { Component } from "../[name]"

describe("[Component] Component", () => {
  it("should render", () => {
    render(<Component />)
    expect(screen.getByRole("region")).toBeInTheDocument()
  })
})
```

### Step 6: Create Showcase

Create demo in `src/components/showcase/[Component]Showcase.tsx`:

```typescript
"use client"

import { Component } from "@/components/ui/[name]"

export default function ComponentShowcase() {
  return (
    <div className="w-full space-y-8 p-4">
      <h2 className="text-2xl font-bold">Component Name</h2>
      <Component />
    </div>
  )
}
```

### Step 7: Update Components Page

Add to `src/app/components/page.tsx`:

```typescript
import [Component]Showcase from "@/components/showcase/[Component]Showcase"

export default function ComponentsPage() {
  return (
    <>
      <ButtonShowcase />
      <CardShowcase />
      <[Component]Showcase /> {/* Add here */}
    </>
  )
}
```

## Testing Components

### Unit Tests

Test component rendering and props:

```typescript
describe("Button Component", () => {
  it("should apply variant styles", () => {
    const { container } = render(<Button variant="secondary" />)
    expect(container.querySelector("button")).toHaveClass("bg-secondary")
  })

  it("should handle click events", () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByRole("button").click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Run Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Specific file
pnpm test button.test.tsx
```

## Documentation

### Component Documentation

Include in each component:

```typescript
/**
 * A reusable button component with multiple variants.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 * ```
 */
export const Button = React.forwardRef(...)
```

### Variants Documentation

Document all available variants:

```markdown
## Variants

- `default` - Primary action button
- `secondary` - Secondary action button
- `outline` - Outlined button
- `destructive` - Danger/delete action
- `ghost` - Subtle button
- `link` - Link-like button

## Sizes

- `xs` - Extra small (h-7)
- `sm` - Small (h-8)
- `default` - Medium (h-9)
- `lg` - Large (h-10)
```

## Best Practices

### 1. Use Ref Forwarding

```typescript
const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ ...props }, ref) => <div ref={ref} {...props} />
)
Component.displayName = "Component"
```

### 2. Export Variants Function

```typescript
export { Component, componentVariants }
```

This allows composition and styling customization.

### 3. Proper Typing

```typescript
interface ComponentProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof componentVariants> {}
```

### 4. Accessibility (a11y)

- Use semantic HTML (`<button>`, `<input>`, `<label>`)
- Include proper ARIA attributes
- Support keyboard navigation
- Test with screen readers

Example:
```typescript
<button
  type="button"
  aria-label="Close menu"
  aria-expanded={isOpen}
>
  Close
</button>
```

### 5. Responsive Design

Use Tailwind responsive prefixes:

```typescript
className="text-sm md:text-base lg:text-lg"
```

### 6. Dark Mode Support

Use Tailwind's `dark:` variant:

```typescript
className="bg-white dark:bg-slate-950"
```

### 7. Slot Pattern

Use `data-slot` for internal structure:

```typescript
<div data-slot="card">
  <div data-slot="card-header" />
  <div data-slot="card-content" />
  <div data-slot="card-footer" />
</div>
```

## Troubleshooting

### Issue: Import Errors

**Problem**: `Cannot find module '@/components/ui/button'`

**Solution**: Ensure path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: TypeScript Errors

**Problem**: `Type 'Props' does not extend 'HTMLAttributes<HTMLDivElement>'`

**Solution**: Properly extend React component props:

```typescript
interface Props extends React.ComponentProps<"div"> {}
```

### Issue: Test Failures

**Problem**: `Cannot find module '@testing-library/jest-dom/vitest'`

**Solution**: Install the dependency:

```bash
pnpm add -D @testing-library/jest-dom
```

### Issue: Tailwind Classes Not Applied

**Problem**: Custom class names don't apply styles

**Solution**: Use `cn()` utility for proper class merging:

```typescript
import { cn } from "@/lib/utils"

className={cn("base-styles", customClassName)}
```

## Quick Checklist

Before publishing a component:

- [ ] Component renders without errors
- [ ] All TypeScript types are correct
- [ ] Unit tests pass
- [ ] Component is accessible (WCAG 2.1 AA)
- [ ] Documentation is complete
- [ ] Showcase example is created
- [ ] Responsive design works
- [ ] Dark mode is supported
- [ ] No console warnings
- [ ] Performance is optimized

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com/)
- [CVA (Class Variance Authority)](https://cva.style/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Testing Library](https://testing-library.com/)

## Support

For issues or questions:
1. Check `COMPONENT_SETUP_ERRORS.md` for common errors
2. Review existing component implementations in `src/components/ui/`
3. Check the test files for usage examples
4. Refer to the official documentation links above

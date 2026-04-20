# Component Template Scaffold

Use this template when creating new shadcn/ui components. Copy and customize for your specific component.

## File Structure

```
src/components/ui/
├── my-component.tsx          # Implementation
├── __tests__/
│   └── my-component.test.tsx # Tests
```

## Implementation Template

**File**: `src/components/ui/my-component.tsx`

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const myComponentVariants = cva(
  // Base styles applied to all variants
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-sm",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface MyComponentProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof myComponentVariants> {}

const MyComponent = React.forwardRef<HTMLButtonElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(myComponentVariants({ variant, size, className }))}
      {...props}
    />
  )
)
MyComponent.displayName = "MyComponent"

export { MyComponent, myComponentVariants }
```

## Test Template

**File**: `src/components/ui/__tests__/my-component.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { MyComponent, myComponentVariants } from "../my-component"

describe("MyComponent", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<MyComponent>Click me</MyComponent>)
      const component = screen.getByRole("button", { name: /click me/i })
      expect(component).toBeInTheDocument()
    })

    it("should render with text content", () => {
      render(<MyComponent>Test Button</MyComponent>)
      expect(screen.getByText("Test Button")).toBeInTheDocument()
    })

    it("should support disabled state", () => {
      render(<MyComponent disabled>Disabled</MyComponent>)
      const component = screen.getByRole("button")
      expect(component).toBeDisabled()
    })
  })

  describe("Variants", () => {
    it("should apply default variant styles", () => {
      const { container } = render(<MyComponent variant="default">Default</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("bg-primary")
    })

    it("should apply secondary variant styles", () => {
      const { container } = render(<MyComponent variant="secondary">Secondary</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("bg-secondary")
    })

    it("should apply outline variant styles", () => {
      const { container } = render(<MyComponent variant="outline">Outline</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("border")
    })

    it("should apply ghost variant styles", () => {
      const { container } = render(<MyComponent variant="ghost">Ghost</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("hover:bg-accent")
    })

    it("should apply link variant styles", () => {
      const { container } = render(<MyComponent variant="link">Link</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("text-primary")
    })
  })

  describe("Sizes", () => {
    it("should apply default size", () => {
      const { container } = render(<MyComponent size="default">Default Size</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("h-9")
    })

    it("should apply small size", () => {
      const { container } = render(<MyComponent size="sm">Small</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("h-8")
    })

    it("should apply large size", () => {
      const { container } = render(<MyComponent size="lg">Large</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("h-10")
    })

    it("should apply icon size", () => {
      const { container } = render(<MyComponent size="icon">Icon</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.className).toContain("h-9 w-9")
    })
  })

  describe("CVA Integration", () => {
    it("should export myComponentVariants function", () => {
      expect(myComponentVariants).toBeDefined()
      expect(typeof myComponentVariants).toBe("function")
    })

    it("myComponentVariants should generate correct classes", () => {
      const classes = myComponentVariants({ variant: "default", size: "default" })
      expect(classes).toContain("bg-primary")
      expect(classes).toContain("h-9")
    })
  })

  describe("Accessibility", () => {
    it("should support aria attributes", () => {
      render(<MyComponent aria-label="Custom action">Action</MyComponent>)
      const component = screen.getByLabelText("Custom action")
      expect(component).toBeInTheDocument()
    })

    it("should be keyboard accessible", () => {
      const { container } = render(<MyComponent>Keyboard</MyComponent>)
      const element = container.querySelector("button")
      expect(element?.tagName).toBe("BUTTON")
    })
  })

  describe("Props", () => {
    it("should pass through custom className", () => {
      render(<MyComponent className="custom-class">Custom</MyComponent>)
      const component = screen.getByRole("button")
      expect(component).toHaveClass("custom-class")
    })

    it("should handle click events", () => {
      const handleClick = vi.fn()
      render(<MyComponent onClick={handleClick}>Click</MyComponent>)
      screen.getByRole("button").click()
      expect(handleClick).toHaveBeenCalled()
    })

    it("should pass through HTML attributes", () => {
      render(
        <MyComponent data-testid="my-component" title="Tooltip">
          Test
        </MyComponent>
      )
      const component = screen.getByTestId("my-component")
      expect(component).toHaveAttribute("title", "Tooltip")
    })
  })
})
```

## Showcase Template

**File**: `src/components/showcase/MyComponentShowcase.tsx`

```typescript
"use client"

import { MyComponent } from "@/components/ui/my-component"

export default function MyComponentShowcase() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">MyComponent</h2>
        <p className="text-muted-foreground mb-8">
          Brief description of what the component does and its use cases.
        </p>
      </div>

      {/* Default Variant */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Variant</h3>
        <div className="space-x-2">
          <MyComponent variant="default">Default</MyComponent>
          <MyComponent variant="default" disabled>
            Disabled
          </MyComponent>
        </div>
      </div>

      {/* All Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Variants</h3>
        <div className="space-y-2">
          <MyComponent variant="default">Default</MyComponent>
          <MyComponent variant="secondary">Secondary</MyComponent>
          <MyComponent variant="outline">Outline</MyComponent>
          <MyComponent variant="ghost">Ghost</MyComponent>
          <MyComponent variant="link">Link</MyComponent>
        </div>
      </div>

      {/* All Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Sizes</h3>
        <div className="space-x-2 space-y-2">
          <MyComponent size="sm">Small</MyComponent>
          <MyComponent size="default">Default</MyComponent>
          <MyComponent size="lg">Large</MyComponent>
          <MyComponent size="icon">🎯</MyComponent>
        </div>
      </div>

      {/* Combined Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Combined Examples</h3>
        <div className="space-y-2">
          <MyComponent variant="secondary" size="sm">
            Small Secondary
          </MyComponent>
          <MyComponent variant="outline" size="lg">
            Large Outline
          </MyComponent>
          <MyComponent variant="ghost" disabled>
            Disabled Ghost
          </MyComponent>
        </div>
      </div>
    </div>
  )
}
```

## Integration Steps

1. **Copy the templates** to your component files
2. **Replace placeholders**:
   - `MyComponent` → your component name
   - `my-component` → your component file name
   - Update descriptions and examples
3. **Install dependencies** if needed:
   ```bash
   pnpm add class-variance-authority clsx tailwind-merge
   ```
4. **Run tests**:
   ```bash
   pnpm test my-component.test.tsx
   ```
5. **Add to showcase page** (`src/app/components/page.tsx`):
   ```typescript
   import MyComponentShowcase from "@/components/showcase/MyComponentShowcase"
   ```

## Customization Points

### Variant Options

Customize based on your design system:

```typescript
variants: {
  variant: {
    // Add your variants
    custom: "your-tailwind-classes",
  },
  size: {
    // Add your sizes
    custom: "your-size-classes",
  },
}
```

### Base Styles

Adjust the base classes for your component type:

```typescript
// For interactive elements
"inline-flex items-center justify-center transition-colors focus-visible:ring-2"

// For containers
"rounded-lg border bg-background p-4"

// For text elements
"text-sm font-medium leading-none"
```

### Accessibility

Add appropriate ARIA attributes:

```typescript
<button
  aria-label="Description"
  aria-pressed={isActive}
  aria-expanded={isOpen}
/>
```

## Tips & Tricks

1. **Ref Forwarding**: Always use `React.forwardRef` for DOM components
2. **Display Name**: Set `displayName` for debugging
3. **Variants Export**: Export the CVA function for external styling
4. **Composition**: Use slots pattern for complex components
5. **Testing**: Test all combinations of variant × size
6. **Documentation**: Add JSDoc comments above exports

## Need Help?

- See `COMPONENT_DEVELOPMENT.md` for detailed guide
- Check existing components in `src/components/ui/` for examples
- Review test patterns in `src/components/ui/__tests__/`
- Check `COMPONENT_SETUP_ERRORS.md` for common issues

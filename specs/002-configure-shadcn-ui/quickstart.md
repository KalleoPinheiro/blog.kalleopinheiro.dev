# Quick Start: Using shadcn/ui Components

**For**: Developers adding components to the blog project  
**Updated**: 2026-04-20

## Overview

The project now uses **shadcn/ui** as the official UI component library. All components are stored in `src/components/ui/` and are imported via the `@` alias.

## Adding a New Component

### Step 1: Check Available Components

Visit the shadcn/ui component library or use the MCP in Claude:

```bash
# In Claude, use the MCP to list available components
/mcp shadcn-ui list_components

# Or view online at https://ui.shadcn.com/docs/components/
```

### Step 2: Add Component to Project

Option A: Using the shadcn/ui CLI (recommended)
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
```

Option B: Using Claude's shadcn/ui MCP
- Ask Claude to get the component source code using the MCP
- Save it to `src/components/ui/[component-name].tsx`
- Verify it follows the component contract (see `/contracts/component-contract.md`)

### Step 3: Use the Component

```typescript
// src/app/page.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div>
      <Button variant="outline">Click me</Button>
      <Input placeholder="Enter text..." />
    </div>
  )
}
```

## Component Variants & Props

Each component supports variants (visual style, size, etc.). TypeScript provides full prop autocompletion:

```typescript
// Button variants: default, destructive, outline, secondary, ghost, link
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button className="custom-class">Custom</Button>

// Input types: text, email, password, number, etc.
<Input type="email" placeholder="your@email.com" />

// Dialog with state management
const [open, setOpen] = useState(false)
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>Content</DialogContent>
</Dialog>
```

## File Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components (DO NOT EDIT)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── [YourComponent].tsx   # Your custom components (OK TO EDIT)
└── lib/
    └── utils.ts             # Utility functions (cn, etc.)
```

**Rules**:
- ✓ Add components from shadcn/ui to `src/components/ui/`
- ✓ Create application-specific components in `src/components/`
- ✓ Import UI components with `@/components/ui/[name]`
- ✓ Import utilities with `@/lib/utils`
- ✗ Do not modify existing shadcn/ui components manually

## Customization

### Variant for New Style

If you need a button variant not in the library:

Option 1: Create a wrapper component
```typescript
// src/components/primary-button.tsx
import { Button } from "@/components/ui/button"

export function PrimaryButton(props) {
  return <Button variant="default" className="w-full" {...props} />
}
```

Option 2: Use className prop
```typescript
<Button className="w-full bg-blue-600 hover:bg-blue-700">
  My Button
</Button>
```

### Theming

Components use CSS variables for theming. Modify colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      // ... other colors
    }
  }
}
```

Then update CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: 210 40% 50%;        /* Hue Saturation Lightness */
  --primary-foreground: 210 40% 98%;
}
```

## Testing Components

### Unit Tests

```typescript
// src/components/ui/button.test.tsx
import { render, screen } from "@testing-library/react"
import { Button } from "./button"

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("supports variants", () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    expect(container.querySelector("button")).toHaveClass("border")
  })
})
```

### Visual Regression Tests

Use Storybook or visual testing tools to verify component appearance across variants.

## Troubleshooting

### "Cannot find module '@/components/ui/button'"

**Cause**: TypeScript path aliases not configured properly

**Solution**:
1. Check `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`
2. Restart IDE/editor
3. Clear `.next` build cache: `rm -rf .next`
4. Rebuild: `npm run build`

### "Tailwind classes not applying to component"

**Cause**: Tailwind config doesn't scan component files

**Solution**:
1. Check `tailwind.config.ts` includes `"./src/**/*.{js,ts,jsx,tsx}"`
2. Verify component uses Tailwind class names (not CSS in JS)
3. Run build and check for Tailwind warnings

### "Component doesn't look right"

**Cause**: CSS variables or Tailwind theme not set up

**Solution**:
1. Verify `src/app/globals.css` includes Tailwind directives
2. Verify CSS variables are defined for theme colors
3. Check browser DevTools for missing styles

## Common Patterns

### Form with Input + Button

```typescript
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchForm() {
  const [search, setSearch] = useState("")

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button onClick={() => console.log(search)}>Search</Button>
    </div>
  )
}
```

### Dialog Form

```typescript
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function EditDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        {/* Form content here */}
      </DialogContent>
    </Dialog>
  )
}
```

## Resources

- **shadcn/ui Docs**: https://ui.shadcn.com
- **Component Contract**: `/contracts/component-contract.md`
- **Data Model**: `/data-model.md`
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com (underlying components)

## Getting Help

1. **New component needed?** Use the MCP or CLI to add it
2. **Styling not working?** Check Tailwind config and globals.css
3. **Component variants?** Check component source in `src/components/ui/`
4. **Type errors?** Verify component props in TypeScript definitions

---

**Last Updated**: 2026-04-20  
**Next Review**: After first 5 components added

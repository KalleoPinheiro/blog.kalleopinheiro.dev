# Component Verification Checklist

Use this checklist to verify that new components meet project standards before integration.

## Pre-Implementation

- [ ] Component is available in shadcn/ui registry
- [ ] Component aligns with project design system
- [ ] Radix UI is used for accessibility foundation
- [ ] CVA is available for variant management
- [ ] No conflicting dependencies exist

## Implementation Verification

### Code Quality

- [ ] Component uses `React.forwardRef` for ref support
- [ ] Component has `displayName` property set
- [ ] All TypeScript types are properly defined
- [ ] No `any` types used (except unavoidable cases)
- [ ] Component props extend React component props correctly
- [ ] No circular imports or dependencies
- [ ] Code follows project style guidelines

**Check with**:
```bash
pnpm type-check
pnpm lint
```

### Component Structure

- [ ] Component file is in `src/components/ui/[name].tsx`
- [ ] CVA function is defined with variants
- [ ] Default variants are specified
- [ ] Variants include: variant, size (if applicable)
- [ ] Base styles are semantically correct
- [ ] Tailwind classes use proper prefixes

**Example**:
```typescript
const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { /* ... */ },
      size: { /* ... */ },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

### Accessibility (WCAG 2.1 AA)

- [ ] Semantic HTML elements used (`<button>`, `<input>`, etc.)
- [ ] ARIA attributes where needed (`aria-label`, `aria-expanded`, etc.)
- [ ] Keyboard navigation supported
- [ ] Focus states visible (`:focus-visible`)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Text is not the only medium for information
- [ ] Form labels associated with inputs

**Test with**:
- Screen reader (NVDA, JAWS, or built-in)
- Keyboard only navigation
- Color contrast checker

### Responsive Design

- [ ] Mobile-first approach used
- [ ] Responsive Tailwind utilities: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- [ ] Tested on multiple screen sizes
- [ ] Touch targets are at least 44×44px
- [ ] Responsive images and icons

**Test at**: 320px, 640px, 768px, 1024px, 1280px

### Dark Mode

- [ ] Uses Tailwind `dark:` variant
- [ ] Background colors have dark mode pairs
- [ ] Text colors have dark mode pairs
- [ ] Borders have dark mode pairs
- [ ] Icons have dark mode pairs

**Example**:
```typescript
"bg-white dark:bg-slate-950"
"text-black dark:text-white"
```

## Testing Verification

### Unit Tests

- [ ] Test file created: `src/components/ui/__tests__/[name].test.tsx`
- [ ] Tests run without errors: `pnpm test [name].test.tsx`
- [ ] Test coverage includes:
  - [ ] Rendering test (component mounts)
  - [ ] Props tests (all variants and sizes)
  - [ ] Accessibility tests (ARIA attributes)
  - [ ] Event handler tests (click, change, etc.)
  - [ ] Edge cases (disabled, empty, etc.)

**Minimum test cases**: 10-15 per component

```bash
pnpm test [name].test.tsx
```

### Test Structure

```typescript
describe("[Component] Component", () => {
  describe("Rendering", () => {
    it("should render without errors")
  })
  describe("Variants", () => {
    it("should apply variant styles")
  })
  describe("Accessibility", () => {
    it("should have proper ARIA attributes")
  })
})
```

### Coverage

- [ ] All variant combinations tested
- [ ] All size combinations tested
- [ ] Props combinations tested
- [ ] Edge cases covered

## Documentation Verification

### JSDoc Comments

- [ ] Component has JSDoc with description
- [ ] Props interface documented
- [ ] Variant options documented
- [ ] Size options documented
- [ ] Usage example provided

**Example**:
```typescript
/**
 * A flexible button component with multiple variants and sizes.
 *
 * @param variant - Visual style variant
 * @param size - Component size
 * @param disabled - Disable the button
 *
 * @example
 * ```tsx
 * <MyComponent variant="primary" size="lg">
 *   Click me
 * </MyComponent>
 * ```
 */
```

### Showcase Component

- [ ] Showcase file created: `src/components/showcase/[Component]Showcase.tsx`
- [ ] Showcase is a Client Component (`"use client"`)
- [ ] All variants demonstrated
- [ ] All sizes demonstrated
- [ ] Edge cases shown (disabled, loading, etc.)
- [ ] Real-world usage examples provided
- [ ] Responsive layout in showcase

### COMPONENT_DEVELOPMENT.md

- [ ] Component added to "How to Add More Components" section
- [ ] Link to component in documentation
- [ ] Usage instructions provided

## Integration Verification

### Page Integration

- [ ] Component imported in `src/app/components/page.tsx`
- [ ] Showcase component rendered on components page
- [ ] Page loads without errors
- [ ] Component displays correctly in browser

```typescript
// In src/app/components/page.tsx
import MyComponentShowcase from "@/components/showcase/MyComponentShowcase"
```

### Visual Verification

- [ ] Component renders correctly
- [ ] All variants display properly
- [ ] All sizes display properly
- [ ] Responsive behavior works
- [ ] Dark mode rendering correct
- [ ] Focus states visible
- [ ] Hover states responsive
- [ ] Disabled state clear

### Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Performance Verification

- [ ] No unnecessary re-renders
- [ ] No memory leaks
- [ ] Component is tree-shakeable
- [ ] No large dependencies bundled
- [ ] Styles are minified

**Check with**: DevTools Performance tab

## Build Verification

```bash
# Run all checks
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

- [ ] TypeScript compilation succeeds: `pnpm type-check` ✓
- [ ] Linting passes: `pnpm lint` ✓
- [ ] All tests pass: `pnpm test` ✓
- [ ] Build succeeds: `pnpm build` ✓
- [ ] No console warnings or errors

## Export Verification

- [ ] Component exported from file: `export { Component }`
- [ ] Variants exported: `export { componentVariants }`
- [ ] Types exported: `export type { ComponentProps }`
- [ ] Can be imported: `import { Component } from "@/components/ui/[name]"`

## Naming Verification

- [ ] Component name follows PascalCase: `MyComponent`
- [ ] File name follows kebab-case: `my-component.tsx`
- [ ] Variant function follows camelCase: `myComponentVariants`
- [ ] Props interface is named: `MyComponentProps`

## Git & Commit Verification

- [ ] Changes committed with descriptive message
- [ ] Commit references the component: `feat: add my-component`
- [ ] No untracked files left behind
- [ ] Branch is up-to-date with main

```bash
git add .
git commit -m "feat: add my-component with tests and showcase"
```

## Final Checklist

Before marking component as "Complete":

- [ ] All code quality checks pass
- [ ] All tests pass (minimum 10 test cases)
- [ ] Documentation is complete
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Responsive design tested
- [ ] Dark mode verified
- [ ] Build succeeds without warnings
- [ ] Showcase page displays correctly
- [ ] Git commit created
- [ ] No console errors or warnings
- [ ] Component is production-ready

## Sign-off

**Component Name**: ___________________

**Developer**: ___________________

**Date**: ___________________

**Status**: 
- [ ] ✅ APPROVED - Ready for production
- [ ] ⚠️ NEEDS WORK - See comments
- [ ] ❌ REJECTED - Significant issues

**Comments**:
```
___________________________________________
___________________________________________
___________________________________________
```

## Common Issues

See `COMPONENT_SETUP_ERRORS.md` for troubleshooting common issues:
- Import resolution errors
- TypeScript type errors
- Test setup issues
- Styling problems
- Accessibility concerns

## Resources

- [shadcn/ui Components](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Testing Library](https://testing-library.com/)
- [CVA Documentation](https://cva.style/)

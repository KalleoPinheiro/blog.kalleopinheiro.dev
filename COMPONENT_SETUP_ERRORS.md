# Component Setup: Troubleshooting Guide

**Last Updated**: 2026-04-20

This guide helps resolve common shadcn/ui configuration and component issues.

## Configuration Issues

### ❌ Error: "Cannot find module '@/components/ui/button'"

**Cause**: Path alias `@` is not configured correctly

**Solution**:
1. Check `tsconfig.json` has:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```
2. Restart your IDE/editor
3. Clear build cache: `rm -rf .next`
4. Rebuild: `npm run build`

---

### ❌ Error: "Missing CSS variable: --primary"

**Cause**: CSS variables not defined in globals.css

**Solution**:
1. Open `src/styles/globals.css`
2. Verify CSS variables are defined in `:root` or `.dark`:
   ```css
   :root {
     --primary: 210 40% 50%;
     --primary-foreground: 210 40% 98%;
     /* ... other variables */
   }
   ```
3. If missing, add all shadcn/ui color variables
4. Restart dev server

---

### ❌ Error: "Tailwind classes not applying"

**Cause**: Tailwind config doesn't scan component files

**Solution**:
1. Check `tailwind.config.ts` includes:
   ```typescript
   {
     content: [
       "./src/pages/**/*.{js,ts,jsx,tsx}",
       "./src/components/**/*.{js,ts,jsx,tsx}",
       "./src/app/**/*.{js,ts,jsx,tsx}",
     ]
   }
   ```
2. Verify color theme in `theme.extend.colors`
3. Clear Tailwind cache: `rm -rf .next`
4. Rebuild: `npm run build`

---

### ❌ Error: "components.json not found"

**Cause**: Missing shadcn/ui configuration file

**Solution**:
1. Create `components.json` in project root:
   ```json
   {
     "style": "default",
     "rsc": true,
     "tsx": true,
     "aliasPrefix": "@",
     "componentDirectory": "src/components/ui"
   }
   ```
2. Verify the `componentDirectory` path exists: `src/components/ui/`

---

## Component Issues

### ❌ Error: "Radix UI slot not found"

**Cause**: `@radix-ui/react-slot` dependency missing

**Solution**:
1. Check `package.json` has:
   ```json
   {
     "dependencies": {
       "@radix-ui/react-slot": "^1.0.0"
     }
   }
   ```
2. If missing, install: `npm install @radix-ui/react-slot`
3. Rebuild: `npm run build`

---

### ❌ Error: "CVA (class-variance-authority) not imported"

**Cause**: `class-variance-authority` or `clsx` missing

**Solution**:
1. Verify `package.json` has:
   ```json
   {
     "dependencies": {
       "class-variance-authority": "^0.7.0",
       "clsx": "^2.0.0",
       "tailwind-merge": "^2.0.0"
     }
   }
   ```
2. If missing, install: `npm install class-variance-authority clsx tailwind-merge`

---

## TypeScript Issues

### ❌ Error: "Type 'ButtonProps' not found"

**Cause**: Component not properly exporting TypeScript types

**Solution**:
1. Verify button.tsx has proper exports:
   ```typescript
   export { Button, buttonVariants }
   ```
2. Ensure types are available in the component file
3. Run type check: `npm run type-check`

---

### ❌ Error: "Variant type mismatch"

**Cause**: Using undefined variant combination

**Solution**:
1. Check component variants in source file
2. Example valid Button variants:
   ```typescript
   <Button variant="default" size="default" />
   <Button variant="outline" size="sm" />
   <Button variant="ghost" size="lg" />
   ```
3. Check CVA variant definitions in component file

---

## Component Development Checklist

Before committing a new component, verify:

- [ ] Component file exists in `src/components/ui/[name].tsx`
- [ ] Component exports: named export (not default)
- [ ] Component exports TypeScript types (e.g., `ButtonProps`)
- [ ] Component uses `cn()` utility from `@/lib/utils`
- [ ] Component uses CVA for variants (if applicable)
- [ ] Component supports ref forwarding (`React.forwardRef`)
- [ ] Component has `displayName` set for debugging
- [ ] Imports resolve correctly with TypeScript compiler: `npm run type-check`
- [ ] Component renders without Tailwind class warnings
- [ ] Component follows accessibility best practices (ARIA, keyboard navigation)

---

## Validation Script

Run the configuration validation:
```bash
node src/scripts/validate-config.js
```

This checks:
- ✓ components.json exists and is valid
- ✓ UI components directory exists
- ✓ Tailwind config is present
- ✓ Path aliases configured in tsconfig
- ✓ Utility functions available
- ✓ Global styles with CSS variables
- ✓ Required dependencies installed

---

## Getting Help

1. **Run validation script**: `node src/scripts/validate-config.js`
2. **Check TypeScript**: `npm run type-check`
3. **Review component contract**: `specs/002-configure-shadcn-ui/contracts/component-contract.md`
4. **Check quickstart**: `specs/002-configure-shadcn-ui/quickstart.md`

---

**Created**: 2026-04-20  
**Related Documentation**:
- Component Contract: `specs/002-configure-shadcn-ui/contracts/component-contract.md`
- Quick Start: `specs/002-configure-shadcn-ui/quickstart.md`
- Implementation Plan: `specs/002-configure-shadcn-ui/plan.md`

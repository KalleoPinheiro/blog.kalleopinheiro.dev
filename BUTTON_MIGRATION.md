# Button Component Migration Report

**Date**: 2026-04-20  
**Task**: T015 - Migrate existing button components

## Existing Button Components Found

**Location**: `src/components/Button/`

**Components**:
- `PrimaryButton.tsx` — Primary action button
- `SecondaryButton.tsx` — Secondary action button
- `DangerButton.tsx` — Destructive action button
- `OutlineButton.tsx` — Outlined variant
- `GhostButton.tsx` — Ghost/transparent variant
- `LinkButton.tsx` — Link-style button
- `ButtonShowcase.tsx` — Component showcase/demo
- `index.ts` — Barrel export file

## Migration Plan

These manual button components will be replaced with the standard shadcn/ui Button component, which supports all these variants through CVA (Class Variance Authority).

**Mapping**:
- `PrimaryButton` → `<Button variant="default" />`
- `SecondaryButton` → `<Button variant="secondary" />`
- `DangerButton` → `<Button variant="destructive" />`
- `OutlineButton` → `<Button variant="outline" />`
- `GhostButton` → `<Button variant="ghost" />`
- `LinkButton` → `<Button variant="link" />`

## New Button Location

`src/components/ui/button.tsx` — shadcn/ui standard button (supports all variants)

## Import Changes Required

```typescript
// Before (old pattern)
import { PrimaryButton, SecondaryButton } from "@/components/Button"

// After (new pattern)
import { Button } from "@/components/ui/button"

// Usage examples
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

## Next Steps

1. Find all imports of old button components across codebase
2. Update imports to use `@/components/ui/button`
3. Replace component usage with `<Button variant="..." />`
4. Delete old `src/components/Button/` directory once all imports updated
5. Verify application still renders correctly

---

**Status**: Ready for migration  
**Related**: Phase 3, User Story 2 - Migrate Existing Component to Follow Standards

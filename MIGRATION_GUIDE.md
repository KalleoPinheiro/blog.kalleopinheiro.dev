# Project Structure Migration Guide

## Overview

Recent refactoring reorganized the project structure to improve scalability and maintainability. This document summarizes the changes and provides guidance for developers.

## Key Changes

### 1. Utilities Migration: `src/lib/` → `src/utils/`

**Rationale**: The `lib` folder typically implies lower-level library code. Our utilities and configuration files are higher-level abstractions specific to the application.

**Files Moved**:
```
src/lib/env.ts              → src/utils/env.ts
src/lib/metadata.ts         → src/utils/metadata.ts
src/lib/site-config.ts      → src/utils/site-config.ts
src/lib/utils.ts            → src/utils/utils.ts
```

**New Utilities in `src/utils/`**:
```
src/utils/robots.ts         # Dynamic robots.txt generation (moved from src/app/)
src/utils/sitemap.ts        # Dynamic sitemap.xml generation (moved from src/app/)
```

**Import Updates Required**:
```typescript
// ❌ Old
import { env } from "@/lib/env";
import { buildRootMetadata } from "@/lib/metadata";

// ✅ New
import { env } from "@/utils/env";
import { buildRootMetadata } from "@/utils/metadata";
```

### 2. Test Structure: `test/` → `tests/unit/` + `tests/e2e/`

**Rationale**: 
- Singular "test" to "tests" improves discoverability
- Explicit "unit" and "e2e" separation clarifies test types
- Mirrored structure with `src/` simplifies test organization

**Directory Changes**:
```
test/setup.ts               → tests/setup.ts
test/unit-tests/            → tests/unit/
test/e2e/                   → tests/e2e/
```

**All Test Files Migrated**:
- 14 test files (45 tests) moved from `src/**/*.test.ts(x)` to `tests/unit/**/*.test.ts(x)`
- Test paths now mirror source structure exactly

**Configuration Updates** (`vitest.config.ts`):
```typescript
// ❌ Old
setupFiles: ["./test/setup.ts"],
include: ["src/**/*.test.{ts,tsx}"],

// ✅ New
setupFiles: ["./tests/setup.ts"],
include: ["tests/unit/**/*.test.{ts,tsx}"],
```

### 3. API Routes Structure Cleanup

**Rationale**: SEO generators (robots, sitemap) are utilities, not route handlers. This improves organization and makes imports clearer.

**Files Moved**:
```
src/app/robots.ts           → src/utils/robots.ts (route handler removed)
src/app/sitemap.ts          → src/utils/sitemap.ts (route handler removed)
src/app/api/rss.xml/route.ts   → src/app/api/rss.xml/route.ts (now under api)
```

## Updated File Imports

### In Source Code

```typescript
// Configuration
import { env } from "@/utils/env";
import { siteConfig } from "@/utils/site-config";
import { buildRootMetadata, buildPageMetadata } from "@/utils/metadata";

// Generators (called from route handlers)
import { robots } from "@/utils/robots";
import { sitemap } from "@/utils/sitemap";

// Components & Utils
import { SiteHeader } from "@/components/layouts/site-header";
import Button from "@/components/ui/button";
```

### In Test Files

```typescript
// All tests use absolute paths with @/ alias
import { env } from "@/utils/env";
import Button from "@/components/ui/button";
import RootLayout from "@/app/layout";

// Mocks also use absolute paths
vi.mock("@/utils/env", () => ({
  env: { NODE_ENV: "test", ... }
}));
```

## Vitest Configuration Changes

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.ts"],           // Test setup location
    include: ["tests/unit/**/*.test.{ts,tsx}"], // Test discovery pattern
    coverage: {
      provider: "v8",
      include: ["src/utils/**/*.ts", "src/app/api/**/*.ts"],  // Coverage targets
    },
  },
});
```

## Project Structure (Final)

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/           # Public route group
│   │   └── page.tsx
│   ├── api/                # API routes
│   │   ├── health/route.ts
│   │   ├── docs/route.ts
│   │   └── rss.xml/route.ts
│   ├── layout.tsx
│   └── not-found.tsx
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── layouts/            # Layout components
│   ├── common/             # Placeholder
│   └── providers/          # Placeholder
├── utils/                  # ✨ NEW: Configuration & utilities
│   ├── env.ts
│   ├── metadata.ts
│   ├── site-config.ts
│   ├── robots.ts
│   ├── sitemap.ts
│   └── utils.ts
├── features/               # Placeholder
├── hooks/                  # Placeholder
├── services/               # Placeholder
├── types/                  # Placeholder
└── styles/
    └── globals.css

tests/                       # ✨ NEW: Mirrored test structure
├── unit/                   # Unit tests (45 tests)
│   ├── app/
│   ├── components/
│   └── lib/                # Tests for utils (legacy naming)
├── e2e/                    # Placeholder
└── setup.ts
```

## Breaking Changes Summary

| Old Path | New Path | Notes |
|----------|----------|-------|
| `src/lib/env.ts` | `src/utils/env.ts` | Update all imports |
| `src/lib/metadata.ts` | `src/utils/metadata.ts` | Update all imports |
| `src/lib/site-config.ts` | `src/utils/site-config.ts` | Update all imports |
| `src/lib/utils.ts` | `src/utils/utils.ts` | Update all imports |
| `src/app/robots.ts` | `src/utils/robots.ts` | Now called from route handler |
| `src/app/sitemap.ts` | `src/utils/sitemap.ts` | Now called from route handler |
| `test/` | `tests/` | Update CI/CD, IDE configs |
| `test/unit-tests/` | `tests/unit/` | Update path references |
| `test/setup.ts` | `tests/setup.ts` | Update vitest.config.ts |

## Checklist for Developers

- [ ] Update all imports of `@/lib/*` to `@/utils/*`
- [ ] Update IDE/editor workspace config if using path aliases
- [ ] Run `pnpm test` to verify test discovery
- [ ] Run `pnpm build` to confirm no breaking changes
- [ ] Check CI/CD pipeline references to test paths
- [ ] Update project documentation linking to test files

## Verification

To verify the migration completed successfully:

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Tests (45 tests should pass)
pnpm test

# Build
pnpm build

# All commands together
pnpm install && pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

## References

- [TEST_STRUCTURE.md](TEST_STRUCTURE.md) — Comprehensive test documentation
- [CLAUDE.md](CLAUDE.md) — Project structure overview
- [.specs/features/foundation/spec.md](.specs/features/foundation/spec.md) — Foundation requirements

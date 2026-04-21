@AGENTS.md

## Project Structure

### Source Code (`src/`)
Organized by type with route groups for future scalability:
- `src/app/` — Next.js App Router pages and API routes
  - `(public)/` — Public-facing pages
  - `api/` — API endpoints (health, docs, rss)
  - Metadata routes (layout, robots, sitemap, not-found)
- `src/components/` — React components
  - `ui/` — shadcn/ui primitives
  - `layouts/` — Layout components (SiteHeader, SiteFooter)
  - `common/` — Shared components (placeholder)
  - `providers/` — React providers (placeholder)
- `src/lib/` — Utilities and configuration
  - `env.ts` — Environment variables (Zod schema)
  - `metadata.ts` — Next.js metadata builders
  - `site-config.ts` — Site configuration
  - `utils.ts` — Helper functions
- `src/features/` — Domain-driven features (placeholder)
- `src/hooks/` — Custom React hooks (placeholder)
- `src/services/` — API clients and external integrations (placeholder)
- `src/types/` — Global TypeScript types (placeholder)
- `src/styles/` — Global CSS

### Test Code (`test/`)
**Mirrored structure** of `src/` for organized test discovery:
- `test/unit-tests/` — Unit tests mirroring `src/` structure (Vitest + RTL)
  - Each source file has a `.test.ts(x)` equivalent
  - Run with: `pnpm test`
  - Coverage threshold: 80% for `src/lib/` and `src/app/api/`
- `test/e2e/` — End-to-end tests (placeholder, ready for Playwright/Cypress)

**See also:** [TEST_STRUCTURE.md](TEST_STRUCTURE.md) for comprehensive guide.

## Testing Standards

- **Framework**: Vitest + React Testing Library
- **Pattern**: AAA (Arrange, Act, Assert) with `sut` variable
- **Typing**: No `any` in tests (enforced by lint)
- **Imports**: Absolute paths with `@/` alias
- **Co-location philosophy**: Tests are separate (`test/`) but mirrors source structure

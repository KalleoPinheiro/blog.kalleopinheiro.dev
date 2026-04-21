@AGENTS.md

## Project Structure

### Source Code (`src/`)
Organized by type with route groups for future scalability:
- `src/app/` — Next.js App Router pages and API routes
  - `(public)/` — Public-facing pages
  - `api/` — API endpoints (health, docs, rss)
  - Layout and metadata routes (layout.tsx, not-found.tsx)
- `src/components/` — React components
  - `ui/` — shadcn/ui primitives
  - `layouts/` — Layout components (SiteHeader, SiteFooter)
  - `common/` — Shared components (placeholder)
  - `providers/` — React providers (placeholder)
- `src/utils/` — Utilities, configuration, and generators
  - `env.ts` — Environment variables (Zod schema)
  - `metadata.ts` — Next.js metadata builders
  - `site-config.ts` — Site configuration
  - `robots.ts` — Dynamic robots.txt generator
  - `sitemap.ts` — Dynamic sitemap.xml generator
  - `utils.ts` — General helper functions
- `src/features/` — Domain-driven features (placeholder)
- `src/hooks/` — Custom React hooks (placeholder)
- `src/services/` — API clients and external integrations (placeholder)
- `src/types/` — Global TypeScript types (placeholder)
- `src/styles/` — Global CSS

### Test Code (`tests/`)
**Mirrored structure** of `src/` for organized test discovery:
- `tests/unit/` — Unit tests mirroring `src/` structure (Vitest + RTL)
  - Each source file has a `.test.ts(x)` equivalent
  - Run with: `pnpm test`
  - Coverage threshold: 80% for `src/utils/` and `src/app/api/`
- `tests/e2e/` — End-to-end tests (placeholder, ready for Playwright/Cypress)

**See also:** [TEST_STRUCTURE.md](TEST_STRUCTURE.md) for comprehensive guide.

## Testing Standards

- **Framework**: Vitest + React Testing Library
- **Pattern**: AAA (Arrange, Act, Assert) with `sut` variable
- **Typing**: No `any` in tests (enforced by lint)
- **Imports**: Absolute paths with `@/` alias
- **Organization**: Tests are separate (`tests/`) but mirrors source structure

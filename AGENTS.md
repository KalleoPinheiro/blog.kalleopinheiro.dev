<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start Next.js dev server with Turbopack |
| `pnpm build` | Production build (Next.js optimized) |
| `pnpm start` | Serve production build locally |
| `pnpm typecheck` | TypeScript strict check (noEmit) |
| `pnpm lint` | Biome lint check |
| `pnpm format` | Biome format (writes changes) |
| `pnpm test` | Run all unit tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Generate coverage report (v8) |
| `pnpm check` | Full CI gate: typecheck + lint + test (must pass) |

**Development workflow:** Run `pnpm check` before committing. Run `pnpm dev` for local development with hot reload.

## Architecture

### Framework & Compiler
- **Next.js 16** (App Router, Server Components first)
- **React Compiler** enabled (`reactCompiler: true`)
- **TypeScript strict mode** with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`

### Code Organization

**Source (`src/`)**
- `app/` — Next.js App Router with `(public)` route group, API routes, and dynamic generators (robots.txt, sitemap.xml, RSS feed)
- `components/` — React components: `ui/` (shadcn/ui primitives), `layouts/`, `common/`, `providers/`
- `utils/` — Config and generators: env.ts (Zod schema), metadata builders, site-config, utility helpers
- `features/`, `hooks/`, `services/`, `types/` — Reserved for future domain-driven expansion

**Tests (`tests/`)**
- `tests/unit/` — Mirrors source structure, each file has `.test.ts(x)` equivalent
- Vitest + React Testing Library with `jsdom` environment
- Setup file: `tests/setup.ts`
- Coverage gates: `src/utils/` and `src/app/api/` at 80% threshold

### Key Dependencies
- **Styling:** Tailwind CSS v4 + shadcn/ui for components
- **Validation:** Zod for environment variables and schemas
- **Linting/Formatting:** Biome (replaces ESLint + Prettier)
- **API Docs:** Swagger UI (controllable via `ENABLE_API_DOCS` env var)

### Security
- **CSP headers** with `unsafe-eval` only in development (React Compiler debugging)
- **HSTS**, **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**, referrer policy
- **Strict module resolution** and no untrusted imports

### API Endpoints
- `GET /api/health` — Liveness check (status, uptime, version, timestamp)
- `GET /api/docs` — Swagger UI (when `ENABLE_API_DOCS=true`)
- `GET /sitemap.xml`, `GET /robots.txt`, `GET /rss.xml` — Dynamic SEO generators

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

## Code Quality Standards

### TypeScript — No `any` Type

- **Rule**: Avoid `any` in all code (source and tests) — the linter enforces this as `noExplicitAny: error`
- **When possible**: Use explicit types, generics, or narrowing instead of `any`
- **When unavoidable**: Document why `any` is necessary (e.g., third-party untyped library, dynamic object structure)
- **Examples**:
  - ✅ Use `unknown` + type guard instead of `any`
  - ✅ Use `Record<string, T>` for typed objects
  - ✅ Use generics `<T>` for functions operating on multiple types
  - ❌ Never use `as any` to bypass type errors — fix the root cause

### Cyclomatic Complexity — Keep Functions Simple

- **Rule**: Avoid high cyclomatic complexity — break complex logic into smaller, focused functions
- **Target**: Aim for functions with ≤3 branches (if/else, loops, ternaries)
- **Benefits**: Improves readability, testability, and maintainability
- **Practices**:
  - Extract conditional logic into helper functions with clear names
  - Use early returns to flatten nesting
  - Prefer declarative patterns (map/filter/reduce) over imperative loops
  - Keep functions to one responsibility (Single Responsibility Principle)
- **Examples**:
  - ✅ `const isValidEmail = (email: string) => email.includes('@')` — simple, testable
  - ❌ Large functions with nested if/else chains — hard to test and reason about

## Git & Branching Strategy

This project follows **GitHub Flow** with rebase-based branch management:

### Core Principles
- **`main`** is the single source of truth (always deployable)
- **`develop`** is the integration branch for testing and validation
- **Feature branches** branch from `develop`, merge to `develop` for testing, then to `main` when complete
- All branches use **rebase** for a clean, linear history

### Branch Workflow

1. **Create feature branch from `main`**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature
   ```

2. **Work locally with clean commits**
   - Follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint)
   - One commit per task (use interactive rebase to squash/organize)
   - Keep feature branches focused and short-lived

3. **Update branch before merging (rebase, don't merge)**
   ```bash
   git fetch origin
   git rebase origin/main
   ```
   - If conflicts exist, resolve them and `git rebase --continue`
   - Force-push to your feature branch only: `git push --force-with-lease origin feature/your-feature`

4. **Merge to `develop` for testing**
   - Create PR: `develop` ← `feature/your-feature`
   - Run all tests and validations (CI/CD)
   - Rebase merge to keep history linear: `git rebase develop feature/your-feature`
   - Do not delete the `feature` branch, as it will be merged into the `main` branch at a later stage.

5. **Merge to `main` when validated**
   - Create PR: `main` ← `feature/your-feature`
   - Only merge after testing validates in develop
   - Rebase merge to main: `git rebase main feature/your-feature`
   - Create a Tag release and release them

### Command Reference

| Task | Command |
|------|---------|
| Create feature branch | `git checkout -b feature/description` |
| Keep branch up-to-date | `git fetch origin && git rebase origin/develop` |
| Squash commits before PR | `git rebase -i develop` |
| Force-push after rebase | `git push --force-with-lease origin feature/your-feature` |
| Rebase merge feature → develop | `git rebase develop feature/your-feature && git checkout develop && git merge feature/your-feature` |
| Clean merged branches | `git branch -d feature/your-feature && git push origin --delete feature/your-feature` |

### Guidelines

- **Never force-push to `main` or `develop`** — only to feature branches
- **One commit per logical task** — use rebase to clean up your history
- **Rebase before every PR** — ensures linear history and resolves conflicts early
- **Delete feature branches after merge** — keeps the repository clean
- **Use descriptive branch names**: `feature/`, `fix/`, `docs/`, `chore/` prefixes (align with Conventional Commits)


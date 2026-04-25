# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js 16 — Breaking Changes

**This is NOT the Next.js you know.** This project runs Next.js 16 with significant breaking changes from prior versions. APIs, conventions, and file structure differ from your training data. Before writing any code that touches routing, data-fetching, or server/client boundaries:

1. **Read the docs:** Check `node_modules/next/dist/docs/` for current API signatures
2. **Check deprecation notices:** Many pre-16 patterns are now errors or warnings
3. **Assume Server Components by default:** Client-side code requires explicit `"use client"` boundary
4. **Verify with typecheck:** Run `pnpm typecheck` after changes; strict TypeScript will catch API mismatches

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js dev server with Turbopack |
| `pnpm build` | Production build (Next.js optimized) |
| `pnpm start` | Serve production build locally |
| `pnpm db:seed` | Populate database with deterministic faker data (pt-BR locale) |
| `pnpm db:reset` | Drop all data and re-seed database |
| `pnpm typecheck` | TypeScript strict check (noEmit) |
| `pnpm lint` | Biome lint check |
| `pnpm format` | Biome format (writes changes) |
| `pnpm test` | Run all unit tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Generate coverage report (v8) with 80% threshold |
| `pnpm check` | Full CI gate: typecheck + lint + test (must pass) |

**Development workflow:** Run `pnpm check` before committing. Run `pnpm dev` for local development with hot reload.

**Pre-commit validation (MANDATORY):**

All checks MUST pass locally before any commit:

```bash
pnpm check        # Single command: typecheck + lint + test (recommended)
```

Or individually:

```bash
pnpm typecheck    # TypeScript strict check
pnpm lint         # Biome lint check
pnpm format       # Biome format (fix formatting issues)
pnpm test         # Run all unit tests
```

**Critical:** Do NOT commit if any check fails. These same checks run in CI (`validate.yml`). Failing CI blocks PR merge to `develop`.

**Pre-commit checklist:**

- [ ] `pnpm check` passes locally
- [ ] `pnpm format` produces no changes (already formatted)
- [ ] All tests pass (`pnpm test`)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No lint errors (`pnpm lint`)

## Development Methodology

This project uses **Spec-Driven Development (SDD)** — specifications drive design and implementation. Use the `/tlc-spec-driven` skill for feature planning and task decomposition.

**SDD workflow:**

1. **Specify** — Write clear requirements in spec files (`.specs/`)
2. **Design** — Plan architecture based on specs
3. **Tasks** — Break specs into atomic, verifiable tasks
4. **Execute** — Implement with specs as acceptance criteria

See `.specs/project/` for existing project specifications and requirements.

## Development Principles

Standing rules applied to every code change. Violations are flagged, not silently accepted.

- **TDD first.** Write a failing test before the implementation. Red → green → refactor.
- **AAA structure.** Every test is laid out as Arrange / Act / Assert, with the tested target bound to a variable named `sut` (System Under Test) so the target is unambiguous.
- **Test behavior, not internals.** Drive tests from the public API and user-visible outcomes.
- **No `any` in TypeScript.** Use precise types; reach for `unknown` + narrowing or generics when uncertain. If `any` feels necessary, the design is wrong — stop and rethink.
- **KISS.** Prefer the smallest working solution. No premature abstraction, speculative flexibility, or cleverness.
- **DRY (with judgment).** Extract when duplication has *semantic* overlap, not just surface similarity. Three similar lines beats a premature abstraction.
- **YAGNI.** Don't build what isn't needed yet. If a requirement isn't explicit and present, don't design, implement, or abstract for it — add it when the need is real.
- **Security first.** No secrets in client bundles; validate inputs at boundaries; secure headers on by default.

## Architecture

### Framework & Compiler

- **Next.js 16.2.4** (App Router, Server Components first)
- **React 19.2.4** with **React Compiler** enabled (`reactCompiler: true`)
- **TypeScript strict mode** with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- **Database**: PostgreSQL with Prisma ORM (client initializes with build-time fallback to handle missing DB_URL during builds)

### Code Organization

**Source (`src/`)**

- `app/` — Next.js App Router with `(public)` route group, API routes, and dynamic generators (robots.txt, sitemap.xml, RSS feed)
  - `admin/` — CMS admin interface (authors, pages, posts, media, comments)
  - `api/` — REST endpoints: health check, CMS operations
- `components/` — React components: `ui/` (shadcn/ui components, Radix primitives), `layouts/`
- `cms/` — CMS infrastructure
  - `schemas/` — Zod validation schemas for Author, Post, Page, Media, Comment
  - `hooks/` — CMS operation hooks registry
  - `utils/` — Data normalization and transformation utilities
- `lib/` — Utilities: Prisma client initialization with build-time fallback
- `utils/` — Config and generators: env.ts (Zod schema), metadata builders, utility helpers
- `features/`, `hooks/`, `services/`, `types/` — Reserved for future domain-driven expansion

**Tests (`tests/`)**

- `tests/unit/` — Mirrors source structure, each file has `.test.ts(x)` equivalent
- `tests/e2e/` — End-to-end tests
- Vitest + React Testing Library with `jsdom` environment
- Setup file: `tests/setup.ts`

### Key Dependencies

- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix primitives, components copied into `src/components/ui/`)
- **Validation:** Zod for environment variables and schemas
- **Linting/Formatting:** Biome (replaces ESLint + Prettier)
- **API Docs:** Swagger UI (controllable via `ENABLE_API_DOCS` env var)
- **Database:** PostgreSQL with Prisma ORM + data normalization layer (`src/cms/`)

### Security

- **CSP headers**: `default-src 'self'`, `script-src` and `style-src` with `unsafe-inline` always + `unsafe-eval` in development for React Compiler
- **HSTS** (max-age 63072000), **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**, **Referrer-Policy: strict-origin-when-cross-origin**
- **Strict module resolution** and no untrusted imports

### API Endpoints

- `GET /api/health` — Liveness check (status, uptime, version, timestamp)
- `GET /api/docs` — Swagger UI (when `ENABLE_API_DOCS=true`)
- `GET /sitemap.xml`, `GET /robots.txt`, `GET /rss.xml` — Dynamic SEO generators
- `POST/GET/PUT/DELETE /api/cms/*` — CMS content management routes

## Testing Standards

- **Framework**: Vitest + React Testing Library (`jsdom` environment)
- **Pattern**: AAA (Arrange, Act, Assert) with `sut` variable
- **Typing**: No `any` in tests (enforced by lint)
- **Imports**: Absolute paths with `@/` alias
- **Organization**:
  - Unit tests in `tests/unit/` mirror source structure
  - E2E tests in `tests/e2e/`
  - Coverage gates: `src/lib/**/*.ts` and `src/app/api/**/*.ts` (v8 provider, reporters: text/json/html)

## Code Quality Standards

### TypeScript — No `any` Type

- **Rule**: Avoid `any` in all code (source and tests) — the linter enforces this as `noExplicitAny: error`
- **When possible**: Use explicit types, generics, or narrowing instead of `any`
- **When unavoidable**: Document why `any` is necessary (e.g., third-party untyped library, dynamic object structure)

### Cyclomatic Complexity — Keep Functions Simple

- **Rule**: Avoid high cyclomatic complexity — break complex logic into smaller, focused functions
- **Target**: Aim for functions with ≤3 branches (if/else, loops, ternaries)
- **Benefits**: Improves readability, testability, and maintainability

## Git & Branching Strategy

This project follows **GitHub Flow** with rebase-based branch management:

### Core Principles

- **`main`** is the single source of truth (always deployable)
- **`develop`** is the integration branch for testing and validation
- **Feature branches** branch from `main`, merge to `develop` for testing, then to `main` when complete
- All branches use **rebase** for a clean, linear history

### Branch Workflow

1. **Create feature branch from `main`**

   ```bash
   git checkout main
   git fetch --all --prune
   git reset --hard origin/main
   git checkout -b feature/your-feature
   ```

2. **Work locally with clean commits** — Follow Conventional Commits (enforced by commitlint). One commit per task.

3. **Run all local checks before push**

   ```bash
   pnpm check        # Runs: typecheck + lint + test (MUST pass)
   pnpm format       # Verify formatting is correct
   ```

4. **Push feature branch**

   ```bash
   git push origin feature/your-feature
   ```

   **Automated:** GitHub Actions re-runs validation on push (`validate.yml` — typecheck, lint, format, tests, Snyk SAST).

5. **Create PR to `develop`** — After validation passes, create PR to `develop` for integration testing.

6. **GitHub Actions handles promotion to `main`** — When PR merges to `develop`, `promote-to-main` workflow automatically creates PR from feature branch to `main`. After that PR merges, feature branch can be deleted.

### Command Reference

| Task | Command |
| --- | --- |
| Create feature branch | `git checkout main && git pull origin main && git checkout -b feature/description` |
| Push feature branch | `git push origin feature/your-feature` |
| Keep branch up-to-date | `git fetch origin && git rebase origin/main` |
| Squash commits before PR | `git rebase -i main` |
| Force-push after rebase | `git push --force-with-lease origin feature/your-feature` |
| Delete merged branch | `git branch -d feature/your-feature && git push origin --delete feature/your-feature` |

### Guidelines

- **Never force-push to `main` or `develop`** — only to feature branches
- **One commit per logical task** — use rebase to clean up your history
- **Rebase before every PR** — ensures linear history and resolves conflicts early
- **Use descriptive branch names**: `feature/`, `fix/`, `docs/`, `chore/` prefixes (align with Conventional Commits)

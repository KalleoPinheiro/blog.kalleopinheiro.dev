# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command           | Purpose |
| --- | --- |
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

- **Next.js 16** (App Router, Server Components first)
- **React Compiler** enabled (`reactCompiler: true`)
- **TypeScript strict mode** with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`

### Code Organization

**Source (`src/`)**

- `app/` — Next.js App Router with `(public)` route group, API routes, and dynamic generators (robots.txt, sitemap.xml, RSS feed)
  - `admin/` — CMS admin interface (authors, pages, posts, media, comments)
  - `api/` — REST endpoints: health check, CMS operations
- `components/` — React components: `ui/` (shadcn/ui primitives), `layouts/`, `common/`, `providers/`
- `utils/` — Config and generators: env.ts (Zod schema), metadata builders, site-config, utility helpers
- `cms/` — CMS infrastructure: Prisma client, data normalization, hooks registry
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
- **CMS:** Prisma ORM with data normalization layer

### Security

- **CSP headers** with `unsafe-eval` only in development (React Compiler debugging)
- **HSTS**, **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**, referrer policy
- **Strict module resolution** and no untrusted imports

### API Endpoints

- `GET /api/health` — Liveness check (status, uptime, version, timestamp)
- `GET /api/docs` — Swagger UI (when `ENABLE_API_DOCS=true`)
- `GET /sitemap.xml`, `GET /robots.txt`, `GET /rss.xml` — Dynamic SEO generators
- `POST/GET/PUT/DELETE /api/cms/*` — CMS content management routes

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

3. **Update branch before merging (rebase, don't merge)**

   ```bash
   git fetch origin
   git rebase origin/main
   git push --force-with-lease origin feature/your-feature
   ```

4. **Merge to `develop` for testing** — **Automated:** GitHub Actions validates on push (`validate` workflow runs tests, lint, typecheck).

5. **Merge to `main` when validated** — **Create PR to `develop`** — After validation passes, create PR to `develop` for integration testing.

**GitHub Actions handles promotion to `main`** — When PR merges to `develop`, `promote-to-main` workflow automatically creates PR from feature branch to `main`. After that PR merges, feature branch can be deleted.

### Command Reference

| Task | Command |
| --- | --- |
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

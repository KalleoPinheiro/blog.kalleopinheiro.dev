# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js 16 — Breaking Changes

**This is NOT the Next.js you know.** This project runs Next.js 16 with significant breaking changes from prior versions. Before writing any code that touches routing, data-fetching, or server/client boundaries:

1. **Read the docs:** Check `node_modules/next/dist/docs/` for current API signatures
2. **Assume Server Components by default:** Client-side code requires explicit `"use client"` boundary
3. **Verify with typecheck:** Run `pnpm typecheck` after changes; strict TypeScript will catch API mismatches

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm check` | Full CI gate: typecheck + lint + test (must pass before every commit) |
| `pnpm typecheck` | TypeScript strict check (noEmit) |
| `pnpm lint` | Biome lint check |
| `pnpm format` | Biome format (writes changes) |
| `pnpm test` | Run all unit tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Coverage report (v8, 80% threshold) |
| `pnpm db:generate` | Regenerate Prisma client to `src/generated/prisma/` |
| `pnpm db:seed` | Populate database with deterministic faker data (pt-BR locale) |
| `pnpm db:reset` | Drop all data and re-seed |

**Run a single test file:**
```bash
pnpm vitest run tests/unit/path/to/file.test.ts
```

**Critical:** `pnpm check` must pass before every commit. These same checks run in CI (`validate.yml`) and block PR merges to `main`.

## Development Methodology

This project uses **Spec-Driven Development (SDD)**. Specifications in `.specs/` drive design and implementation.

**SDD workflow:** Specify (`.specs/`) → Design → Tasks → Execute with specs as acceptance criteria.

## Development Principles

Standing rules applied to every code change. Violations are flagged, not silently accepted.

- **TDD first.** Write a failing test before the implementation. Red → green → refactor.
- **AAA structure.** Every test: Arrange / Act / Assert, with the tested target bound to `sut` (System Under Test).
- **Test behavior, not internals.** Drive tests from the public API and user-visible outcomes.
- **No `any` in TypeScript.** Enforced by `noExplicitAny: error` in Biome. Use `unknown` + narrowing or generics instead.
- **KISS / YAGNI.** Smallest working solution. No premature abstraction. No speculative flexibility.
- **DRY with judgment.** Extract on semantic overlap, not surface similarity.
- **Security first.** No secrets in client bundles; validate inputs at boundaries.
- **Cyclomatic complexity ≤3 branches per function.**

## Architecture

### Framework & Compiler

- **Next.js 16.2.4** (App Router, Server Components first)
- **React 19.2.4** with **React Compiler** (`reactCompiler: true` in `next.config.ts`)
- **TypeScript strict mode** with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`

### Database — Prisma 7 + PrismaPg Adapter

- **Prisma 7.8.0** uses the `prisma-client` generator (not `prisma-client-js`), generating the client to `src/generated/prisma/` (gitignored).
- **Driver adapter:** `PrismaPg` from `@prisma/adapter-pg` + `pg` driver. The client in `src/lib/db.ts` instantiates `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`.
- **Imports:** `import { PrismaClient } from "@/generated/prisma/client"` — never from `@prisma/client` directly.
- **`prisma.config.ts`** reads `.env.local` manually (Prisma CLI does not use Next.js env loading) and omits the datasource block when `DATABASE_URL` is absent, so `pnpm db:generate` works without a running database.
- **After schema changes:** run `pnpm db:generate` to regenerate types, then `pnpm exec prisma migrate dev`.

### Code Organization

**`src/`**

- `app/` — App Router: `(public)/` route group (blog, posts), `admin/` (CMS UI), `api/` (REST endpoints)
- `cms/` — CMS infrastructure: `schemas/` (Zod validation for all models), `hooks/` (operation hooks registry), `utils/` (normalization)
- `components/` — `ui/` (shadcn/ui + Radix primitives copied in), `layouts/`, `admin/`
- `generated/prisma/` — Prisma client output (gitignored, regenerated via `pnpm db:generate`)
- `lib/` — `db.ts` (Prisma singleton with PrismaPg adapter)
- `utils/` — `env.ts` (Zod env schema), metadata builders, site config

**`tests/unit/`** mirrors `src/` structure. `tests/e2e/` for end-to-end. Setup file: `tests/setup.ts`.

### CMS Data Flow

1. HTTP request → `src/app/api/cms/{resource}/route.ts`
2. Route handler validates body via `src/cms/schemas/{model}.ts` (Zod)
3. Calls Prisma via `src/lib/db.ts`
4. Response normalized via `src/cms/utils/normalize.ts`

### Key Invariants

- **Mocking Prisma in tests:** `vi.mock('@/lib/db')` — mock the module, not the adapter.
- **Environment validation:** `src/utils/env.ts` runs at startup via Zod; `DATABASE_URL` is required and validated as a URL.
- **CSP headers:** `default-src 'self'`; `unsafe-eval` added only in development (React Compiler requirement). Configured in `next.config.ts`.
- **Coverage gate:** 80% lines/functions/branches/statements on `src/lib/**` and `src/app/api/**` (enforced in `vitest.config.ts`).
- **API docs:** Swagger UI at `/api/docs`, only active when `ENABLE_API_DOCS=true`.

### API Endpoints

- `GET /api/health` — Liveness check
- `GET /api/docs` — Swagger UI (gated by `ENABLE_API_DOCS`)
- `GET /sitemap.xml`, `/robots.txt`, `/rss.xml` — Dynamic SEO generators
- `POST/GET/PUT/DELETE /api/cms/*` — CMS CRUD routes

## Git & Branching (GitHub Flow)

- **`main`** — always deployable, production ready
- Feature branches from `main` → PR to `main` (review → merge → deploy)
- Conventional Commits (`type(scope): subject`), one commit per task
- Never force-push to `main`

**Workflow:**
```bash
git checkout main && git pull origin main
git checkout -b feature/your-feature
# Make changes, commit
git push origin feature/your-feature
# Open PR on GitHub → review → merge
```

**Pre-push hook:** Feature branches auto-rebase on `main` before push (prevents conflicts). Non-feature branches skip the hook.

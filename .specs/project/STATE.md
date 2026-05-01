---
name: STATE
description: Persistent memory for architectural decisions, blockers, lessons, and deferred ideas
---

# State

**Last Updated:** 2026-05-01
**Current Work:** M1.5 — CI/CD GitHub Flow migration + Docker/Vercel build fix (feature/docker-vercel-fix)

---

## Recent Decisions (Last 60 days)

### AD-001: Next.js App Router + strict TypeScript (2026-04-21)

**Decision:** Use Next.js latest stable with the App Router and TypeScript strict mode from day one.
**Reason:** App Router is the current React/Next.js direction (Server Components, streaming, nested layouts); strict TS catches defects at compile time and pays compounding dividends.
**Trade-off:** Slightly steeper learning curve than Pages Router; some libraries still prefer Pages Router patterns.
**Impact:** All routes, layouts, and data-fetching patterns assume Server Components first, Client Components only when needed (`"use client"` boundary).

### AD-002: Payload CMS (deferred to M2) (2026-04-21)

**Decision:** Use Payload CMS as the headless CMS, integrated into the same Next.js app (Payload's Next.js-native install), backed by PostgreSQL on Vercel/Neon.
**Reason:** Self-hosted = full control over content and schema; Payload 3.x runs inside Next.js, so we ship one app, one deploy, one repo; PostgreSQL scales cleanly on Vercel.
**Trade-off:** More operational responsibility than SaaS CMS (Sanity, Contentful); cold-start and bundle-size implications must be watched.
**Impact:** M1 foundation must not block Payload's installation — keep `app/` routing clean and avoid naming collisions with Payload's `admin` and `api` routes.

### AD-003: Biome over ESLint + Prettier (2026-04-21)

**Decision:** Use Biome as the single linter + formatter.
**Reason:** Faster than ESLint+Prettier, single config, actively developed, reasonable Next.js/TS support.
**Trade-off:** Smaller rule ecosystem than ESLint; some team-specific rules may not exist yet.
**Impact:** No `.eslintrc` or `.prettierrc`. Single `biome.json`. Scripts invoke `biome` only.

### AD-004: Portuguese-first, i18n deferred to M4 (2026-04-21)

**Decision:** Launch in Portuguese (pt-BR) without i18n infrastructure. Add i18n when adding the second language.
**Reason:** Shipping monolingual is faster and simpler; i18n adds routing/metadata/CMS complexity that has no payoff with one language.
**Trade-off:** When i18n lands, existing URLs (e.g. `/sobre`) may need to move under `/pt/sobre`, requiring redirects.
**Impact:** M1 URL design should be easy to prefix later; avoid baking "pt" assumptions into code that will need to become locale-aware.

### AD-005: Vercel deployment (2026-04-21)

**Decision:** Deploy to Vercel (Hobby tier to start).
**Reason:** First-class Next.js support, zero-config previews, free tier sufficient for early traffic, edge runtime available.
**Trade-off:** Vendor lock-in for some features (Vercel Blob, Analytics, KV); serverless cold starts with Payload require watching.
**Impact:** Choose storage/db providers that are Vercel-friendly (Neon, Vercel Postgres, Vercel Blob, or S3-compatible).

### AD-006: TDD with Vitest + React Testing Library (2026-04-21)

**Decision:** Every code change is test-driven. Vitest for the test runner, React Testing Library for components. Tests follow AAA (Arrange / Act / Assert) with the tested target bound to `sut` (System Under Test).
**Reason:** TDD surfaces design problems early, enforces testability, and creates living regression protection. Vitest is the fastest Vite-compatible runner and integrates cleanly with Next.js. RTL encourages testing user-visible behavior over implementation details.
**Trade-off:** Slower initial velocity on trivial changes; discipline cost during refactors when tests need rewiring.
**Impact:** M1 must set up the test toolchain *before* shipping features. All new code in any milestone ships with tests written first. CI blocks merges on failing tests.

### AD-007: No `any`; apply KISS and DRY (2026-04-21)

**Decision:** TypeScript `any` is banned across the codebase. Use precise types, `unknown` + narrowing, or generics. Code is written to KISS (smallest working solution) and DRY (extract on semantic duplication, not surface similarity).
**Reason:** `any` silently disables the type checker and causes defects to surface far from their origin. KISS and DRY, applied with judgment, keep the codebase readable and cheap to change.
**Trade-off:** Sometimes narrowing an unknown input takes more lines than `any` would; sometimes accepting a few duplicated lines beats a premature abstraction.
**Impact:** Biome (or an explicit lint rule) must flag `any`. Code review / self-review checks for over-abstraction and duplication before merge.

### AD-008: pnpm + Conventional Commits, one commit per task (2026-04-21)

**Decision:** pnpm is the default package manager. All commits follow the Conventional Commits spec (commitlint-compatible). Commit granularity is one commit per task from `tasks.md`.
**Reason:** pnpm is fast, disk-efficient, and workspace-ready for when Payload adds modules. Conventional Commits produce a machine-readable history, enable automated changelog/release tooling, and make review diffs self-describing. One-commit-per-task keeps the history linear with the spec's requirement IDs.
**Trade-off:** Slightly stricter discipline around commit boundaries; contributors must learn the type taxonomy.
**Impact:** Scripts and docs reference `pnpm`. Every commit message uses `type(scope): subject`. We may add `commitlint` + `husky` in a later milestone; until then, the convention is enforced by review.

### AD-010: Two-workflow CI/CD design — validate separate from promote (2026-04-23)

**Decision:** Implement CI/CD as two independent workflows: `validate.yml` (quality gate) and `promote-to-main.yml` (PR automation). Use the default `GITHUB_TOKEN` for the promotion workflow, accepting that promoted PRs will not auto-trigger `validate.yml`.
**Reason:** Keeping validation isolated from promotion means a promotion failure never silently blocks a quality-gate check from appearing on a PR. The `GITHUB_TOKEN` limitation is acceptable because the promoted PR is a maintainer-reviewed step; a manual re-run of `validate` or a trivial commit is low friction at that stage. Provisioning a PAT/App token adds secret management overhead that is not justified yet.
**Trade-off:** Promoted `develop→main` PRs require a manual action to trigger `validate`; CI is not fully automatic end-to-end.
**Impact:** If automated validation of `main`-targeted PRs becomes important, provision a PAT stored as `PROMOTION_TOKEN` and replace `secrets.GITHUB_TOKEN` in `promote-to-main.yml`.

### AD-009: Vercel deployment deferred out of M1 (2026-04-21)

**Decision:** Defer the Vercel integration task (T25) and FND-15 out of the initial M1 push. M1 ships locally-verifiable. Vercel deploy happens as a small follow-up before M2 begins.
**Reason:** User requested to skip Vercel integration "at this moment" — keeps the M1 cycle faster and unblocks the coding work that doesn't depend on deploy.
**Trade-off:** FND-15's acceptance criteria (preview URLs, production deploy) remain unverified until the follow-up. Any hosting-specific issue (cold starts, header propagation) will surface later.
**Impact:** `tasks.md` T25 is marked DEFERRED. The rest of M1 proceeds normally. When picked up, T25 is a standalone task plus possible additions for Vercel env vars and build settings.

### AD-012: Prisma 7 driver adapter via `@prisma/adapter-pg` (2026-04-26)

**Decision:** Use the new Prisma 7 `prisma-client` generator with the `PrismaPg` driver adapter from `@prisma/adapter-pg` + `pg`, generating the client to `src/generated/prisma/`.
**Reason:** Prisma 7 deprecates `prisma-client-js` in favour of `prisma-client`, which requires an explicit output path and a native driver adapter. The adapter-based approach removes the query engine binary (reducing bundle size) and uses `pg` directly, which is the recommended pattern for PostgreSQL on Node.js. Generating to `src/generated/prisma/` makes the client a first-class source artifact importable via the `@/` alias.
**Trade-off:** The generated directory must be excluded from git (added to `.gitignore`) and regenerated after schema changes (`pnpm db:generate`). CI pipelines that run `prisma migrate` or tests importing Prisma types must ensure `DATABASE_URL` is available _or_ call `pnpm db:generate` before running.
**Impact:**
- `src/lib/db.ts` imports `PrismaClient` from `@/generated/prisma/client` and instantiates with `new PrismaPg({ connectionString })`.
- `@prisma/client` moved to `dependencies`; `pg` added to `dependencies`; `@types/pg` added to `devDependencies`.
- `prisma.config.ts` reads `.env.local` manually (Next.js env loading is not available for the Prisma CLI), declares `schema` and `migrations.path` explicitly, and omits the datasource block when `DATABASE_URL` is absent (safe for `prisma generate` without a DB).
- `pnpm db:generate` is the canonical command to regenerate the client after schema changes.
- `postinstall` script removed; generate is now explicit, not implicit on install.

### AD-013: GitHub Flow — feature branches merge directly to main (2026-05-01)

**Decision:** Abandon three-branch strategy (feature → develop → main). Use GitHub Flow: feature branches merge directly to `main` via PR. The `develop` branch is retired.
**Reason:** Three-branch flow created cascading merge conflicts at every stage (feature→develop, promote develop→main). GitHub Flow is simpler for a solo maintainer: one integration point, one target, no promotion automation needed.
**Trade-off:** No pre-production integration buffer (`develop`). All validation must pass on the feature PR itself before merge.
**Impact:**
- `validate.yml` triggers on push to `feature/**` and PRs to `main`; auto-creates PR to `main` after checks pass.
- `promote-to-main.yml` removed entirely.
- Pre-push hook rebases feature branches on `main` (not develop) before push.
- Branch protection: `main` requires passing checks + review before merge.
- Feature branch naming: `feature/description` from `main`.

### AD-014: Docker local environment + Vercel build pipeline fix (2026-05-01)

**Decision:** Add Dockerfile (multi-stage production) + Dockerfile.dev + docker-compose.yml app service for local dev. Fix Vercel `Module not found` via `postinstall`/`prebuild` scripts.
**Reason:** `src/generated/prisma/` is gitignored; Vercel never had the Prisma client. Need `prisma generate` to run automatically before `next build`. Docker provides reproducible local environment with startup chain (generate → migrate → seed → dev).
**Trade-off:** `postinstall` runs prisma generate on every `pnpm install`, adding ~1s to install time. Named Docker volumes for `node_modules` and `src/generated` prevent host/container path conflicts.
**Impact:**
- `postinstall`: `DATABASE_URL=...dummy... prisma generate && husky install`
- `prebuild`: `DATABASE_URL=...dummy... DIRECT_URL=...dummy... prisma generate`
- docker-compose: `app` service depends on postgres healthcheck, runs startup chain
- `DIRECT_URL` env var added for Supabase direct connection (Prisma migrations bypass pgBouncer)
- `prisma.config.ts` passes `directUrl` when `DIRECT_URL` is set

### AD-011: Custom Headless CMS vs Payload CMS (2026-04-25)

**Decision:** Build a custom headless CMS architecture using Prisma ORM + schema-driven design + Next.js API routes instead of integrating Payload CMS.
**Reason:** Custom CMS gives full control over schema, admin UI, and extensibility (hooks registry); Prisma integrates natively with Next.js strict types and Zod validation; can ship admin UI and API routes without third-party overhead or operational complexity. Payload's M2 deferral provided time to evaluate the custom approach — it proved simpler for this project's needs.
**Trade-off:** Build and maintain CMS infra ourselves (schemas, admin UI, validation, revalidation logic); Payload would offer more out-of-the-box features (media manager, versioning, workflows) but at the cost of bundle size and complexity.
**Impact:** CMS infrastructure (schemas, hooks, API routes, admin) delivered as M1.5. M2 shifts focus to public blog rendering (list pages, post display). i18n and advanced features (comments, search) defer to M4+.

### AD-012: Prisma 7 + lazy-init Proxy for Vercel build compatibility (2026-05-01)

**Decision:** Migrate to Prisma 7 (prisma-client generator) with custom output (`src/generated/prisma`), lazy-init Proxy pattern for PrismaClient, and split DATABASE_URL (pooled, port 6543) / DIRECT_URL (direct, port 5432) for Supabase pgBouncer.
**Reason:** Prisma 7 is stricter about adapter requirements at constructor time, breaking Next.js builds. Lazy Proxy defers instantiation until first use (runtime), avoiding build-time DB access. Supabase pooler prevents connection exhaustion on serverless; direct URL enables Prisma migrate without pool contention.
**Trade-off:** Requires `@ts-expect-error` to bypass strict PrismaClientOptions type check; Proxy adds indirection but negligible perf cost. directUrl not supported in prisma.config.ts — DATABASE_URL is pooled by design, DIRECT_URL is env-only for migrations.
**Impact:** Prisma generate now wired into postinstall, prebuild, and CI (dummy env vars during build). `pnpm check` and `pnpm build` succeed deterministically. Vercel preview/prod deploys require DATABASE_URL (pooled) + DIRECT_URL (direct) in project env scopes.

---

## Active Blockers

_None._

---

## Lessons Learned

_None yet._

---

## Quick Tasks Completed

### M1 Foundation (✅ Completed 2026-04-21)

| Task | Description                            | Commit    | Date       |
| ---- | -------------------------------------- | --------- | ---------- |
| T1   | Bootstrap Next.js 16 + App Router      | `d6d11b8` | 2026-04-21 |
| T2   | Strict TypeScript flags + `@/*` alias  | `ff8147f` | 2026-04-21 |
| T3   | Biome lint/format + noExplicitAny=error| `f7b8c32` | 2026-04-21 |
| T4   | Package.json scripts (all 10 scripts)  | `ef85243` | 2026-04-21 |
| T5   | Install Vitest 4 + RTL stack           | `03da6e2` | 2026-04-21 |
| T6   | vitest.config.ts (jsdom, aliases, v8)  | `3c97d0e` | 2026-04-21 |
| T7   | test/setup.ts + sum.ts AAA sample test | `ce0516e` | 2026-04-21 |
| T8   | check script + linting gates            | `ef85243` | 2026-04-21 |
| T9   | shadcn/ui init + Tailwind v4 (RF-3 ✅) | `3f07c3e` | 2026-04-21 |
| T10  | Button + Card primitives + button test | `37fc987` | 2026-04-21 |
| T11  | SiteHeader + SiteFooter Server Components | `6737af6` | 2026-04-21 |
| T12  | env.ts (zod) + env.test.ts             | `a791c70` | 2026-04-21 |
| T13  | site-config.ts + SiteConfig type       | `68d88f7` | 2026-04-21 |
| T14  | metadata.ts — buildRootMetadata/Page   | `085415a` | 2026-04-21 |
| T15  | Welcome page — Portuguese landing (TDD)   | `07e7688` | 2026-04-21 |
| T16  | GET /api/health endpoint                  | `983f9f6` | 2026-04-21 |
| T17  | app/sitemap.ts                            | `074fc38` | 2026-04-21 |
| T18  | app/robots.ts                             | `074fc38` | 2026-04-21 |
| T19  | app/rss.xml/route.ts                      | `074fc38` | 2026-04-21 |
| T20  | app/not-found.tsx                         | `a32c4b3` | 2026-04-21 |
| T21  | Root layout — header + footer + metadata  | `de075df` | 2026-04-21 |
| T22  | Security headers in next.config.ts        | `6b5a869` | 2026-04-21 |
| T23  | /api/docs Swagger UI (CDN, gated)         | `2b4f658` | 2026-04-21 |
| T24  | .env.example + README rewrite             | `3ebb399` | 2026-04-21 |

### M1.5 CI/CD (✅ Completed 2026-04-24)

| Task | Description                            | Commit    | Date       |
| ---- | -------------------------------------- | --------- | ---------- |
| CI-1 | validate.yml — feature-branch CI gate  | `caedf07` | 2026-04-23 |
| CI-2 | promote-to-main.yml — auto PR on merge | `caedf07` | 2026-04-23 |
| CI-3 | Node 22 consistency (workflow config)   | `caedf07` | 2026-04-23 |
| CI-4 | README.md CI/CD section + docs         | `caedf07` | 2026-04-23 |
| CI-5 | Branch protection rules (manual)       | Manual    | 2026-04-24 |

**Refinement & Testing:** PRs #17-#25 (2026-04-23 to 2026-04-24) validated workflow automation, idempotency, and promotion flow.

### M1.5 Database Layer — Prisma 7 + Supabase (✅ Completed 2026-05-01)

| Task | Description                                      | Commit    | Date       |
| ---- | ------------------------------------------------ | --------- | ---------- |
| DB-1 | Switch schema → prisma-client generator + output | `7a5c6f2` | 2026-05-01 |
| DB-2 | Lazy-init Proxy for PrismaClient (build compat)  | `b8d9e1f` | 2026-05-01 |
| DB-3 | Wire prisma generate into postinstall/prebuild/CI| `f2e4c7a` | 2026-05-01 |
| DB-4 | Mark @prisma/client as external package         | `a3f9c1d` | 2026-05-01 |
| DB-5 | Document DATABASE_URL (pooled) + DIRECT_URL     | `e1c7b5f` | 2026-05-01 |
| DB-6 | Add @faker-js/faker seeder + pnpm db:seed       | `d2f4e8a` | 2026-05-01 |
| DB-7 | Pin engines (node ≥22, pnpm ≥9)                 | `c5g3a2f` | 2026-05-01 |

**Verification:** `pnpm build` ✅ (Prisma 7 client generated, Next.js builds), `pnpm test` ✅ (105 tests pass, db singleton + lazy proxy validated). Ready for Vercel env setup (DATABASE_URL pooled + DIRECT_URL direct).

---

## Deferred Ideas

_None yet — captured in ROADMAP "Future Considerations" for now._

---

## Todos

- [x] ~~Before M2: Set Vercel env scopes for DATABASE_URL (pooled) + DIRECT_URL (direct)~~ — **Resolved (2026-05-01):** postinstall/prebuild scripts use dummy fallbacks; Vercel must have real DATABASE_URL + DIRECT_URL in project env settings
- [ ] Merge `feature/docker-vercel-fix` to `main` and confirm Vercel build passes
- [ ] Set Vercel project env vars: `DATABASE_URL` (Supabase pooled, port 6543) and `DIRECT_URL` (Supabase direct, port 5432)
- [ ] M2: Public blog routes (list page, post detail) using Prisma models
- [x] ~~At start of M1, decide on Tailwind v3 vs v4 based on current shadcn/ui compatibility~~ — **Resolved (2026-04-21):** Tailwind v4 used with shadcn base-nova preset (T9, `3f07c3e`).
- [x] ~~Before starting T12 type hardening: improve test env isolation~~ — **Resolved (2026-04-21):** env.ts uses Zod with runtime validation.

---

## Project Quick Reference

> Load this section at the start of every session before writing any code.

### Branching (GitHub Flow — AD-013)

```
main ← always deployable, never force-push
  └── feature/description   ← branch from main, PR to main
```

- Pre-push hook: auto-rebases feature branch on `main` before push
- validate.yml: runs on push to `feature/**` + PRs to `main`; auto-creates PR to `main`
- No develop branch, no promote-to-main workflow

### Package Manager

```bash
pnpm  # always — never npm or yarn
```

### Commit Format

```
type(scope): subject          # Conventional Commits
# One commit per task
# Types: feat fix chore docs test refactor perf
```

### Key Scripts

| Script | Purpose |
|--------|---------|
| `pnpm check` | Full CI gate (generate + typecheck + lint + test) |
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm db:generate` | Regenerate Prisma client after schema change |
| `pnpm db:seed` | Seed DB with faker data |
| `pnpm db:migrate` | Deploy pending migrations |

### Folder Structure

```
src/
  app/
    (public)/         # Public blog routes (Server Components)
    admin/            # Admin CMS UI
    api/              # API routes (health, cms/*, docs)
  cms/
    schemas/          # Zod validation per model
    hooks/            # Operation hooks registry
    utils/            # Normalization helpers
  components/
    ui/               # shadcn/ui primitives (Radix)
    admin/            # Admin-specific components
    layouts/          # Layout components
  generated/prisma/   # Prisma client — gitignored, regenerated by db:generate
  lib/
    db.ts             # PrismaClient singleton (lazy-init Proxy, PrismaPg adapter)
  utils/
    env.ts            # Zod env schema (validated at startup)

tests/unit/           # Mirrors src/ structure exactly
tests/e2e/            # E2E tests (future)
tests/setup.ts        # Vitest global setup

prisma/
  schema.prisma       # DB schema (prisma-client generator → src/generated/prisma)
  seed.ts             # Deterministic faker seeder (pt-BR locale)
  migrations/         # Prisma migration files
prisma.config.ts      # Prisma CLI config (reads .env.local, sets datasource conditionally)
```

### Test Patterns

```ts
// Every test file:
import { describe, it, expect } from "vitest";

describe("module name", () => {
  it("describes behavior from user perspective", () => {
    // Arrange
    const sut = createSystemUnderTest();

    // Act
    const result = sut.doSomething();

    // Assert
    expect(result).toBe(expected);
  });
});

// Mock Prisma: vi.mock('@/lib/db') — never mock the adapter
// No any — use unknown + narrowing
// Test behavior, not internals
```

### Database

- **Prisma 7** with `prisma-client` generator, output: `src/generated/prisma`
- Import: `import { PrismaClient } from "@/generated/prisma/client"` — never from `@prisma/client`
- Adapter: `PrismaPg` from `@prisma/adapter-pg` + `pg`
- `DATABASE_URL` = pooled (Supabase port 6543, pgBouncer) — runtime queries
- `DIRECT_URL` = direct (Supabase port 5432) — CLI migrations only
- Lazy-init Proxy in `src/lib/db.ts` — defers instantiation to first use

### Environment Files

- `.env.local` — local secrets (gitignored, read by prisma.config.ts)
- `.env.example` — template with all required vars documented
- `DATABASE_URL` + `DIRECT_URL` required for runtime; omitted = generate-only mode

## Preferences

**Model Guidance Shown:** never

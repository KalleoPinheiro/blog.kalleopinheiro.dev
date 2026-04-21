---
name: STATE
description: Persistent memory for architectural decisions, blockers, lessons, and deferred ideas
---

# State

**Last Updated:** 2026-04-21
**Current Work:** M1 — Foundation — T11 complete; Phase 5 in progress (T15 welcome page next)

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

### AD-009: Vercel deployment deferred out of M1 (2026-04-21)

**Decision:** Defer the Vercel integration task (T25) and FND-15 out of the initial M1 push. M1 ships locally-verifiable. Vercel deploy happens as a small follow-up before M2 begins.
**Reason:** User requested to skip Vercel integration "at this moment" — keeps the M1 cycle faster and unblocks the coding work that doesn't depend on deploy.
**Trade-off:** FND-15's acceptance criteria (preview URLs, production deploy) remain unverified until the follow-up. Any hosting-specific issue (cold starts, header propagation) will surface later.
**Impact:** `tasks.md` T25 is marked DEFERRED. The rest of M1 proceeds normally. When picked up, T25 is a standalone task plus possible additions for Vercel env vars and build settings.

---

## Active Blockers

_None._

---

## Lessons Learned

_None yet._

---

## Quick Tasks Completed

| Task | Description                            | Commit    | Date       |
| ---- | -------------------------------------- | --------- | ---------- |
| T1   | Bootstrap Next.js 16 + App Router      | `d6d11b8` | 2026-04-21 |
| T2   | Strict TypeScript flags + `@/*` alias  | `ff8147f` | 2026-04-21 |
| T3   | Biome lint/format + noExplicitAny=error| `f7b8c32` | 2026-04-21 |
| T4   | Package.json scripts (all 10 scripts)  | `ef85243` | 2026-04-21 |
| T5   | Install Vitest 4 + RTL stack           | `03da6e2` | 2026-04-21 |
| T6   | vitest.config.ts (jsdom, aliases, v8)  | `3c97d0e` | 2026-04-21 |
| T7   | test/setup.ts + sum.ts AAA sample test | `ce0516e` | 2026-04-21 |
| T9   | shadcn/ui init + Tailwind v4 (RF-3 ✅) | `3f07c3e` | 2026-04-21 |
| T10  | Button + Card primitives + button test | `37fc987` | 2026-04-21 |
| T12  | env.ts (zod) + env.test.ts             | `a791c70` | 2026-04-21 |
| T13  | site-config.ts + SiteConfig type       | `68d88f7` | 2026-04-21 |
| T14  | metadata.ts — buildRootMetadata/Page   | `085415a` | 2026-04-21 |
| T11  | SiteHeader + SiteFooter Server Components | `6737af6` | 2026-04-21 |

**Note:** T8 (check script) is ✅ partially done — script works, README pending T24. T12 env.test.ts is committed in `a791c70` but was untracked at session start; verify with `git status`.

---

## Deferred Ideas

_None yet — captured in ROADMAP "Future Considerations" for now._

---

## Todos

- [ ] At start of M2, verify Payload 3.x current-recommended Next.js install flow via Context7 before committing to architecture
- [x] ~~At start of M1, decide on Tailwind v3 vs v4 based on current shadcn/ui compatibility~~ — **Resolved (2026-04-21):** Tailwind v4 used with shadcn base-nova preset (T9, `3f07c3e`). v4 is fully supported.
- [ ] Before starting T12 type hardening: improve test env isolation so `.url()` and `z.enum` validators on `envSchema` can be added without breaking Vitest stubs

---

## Preferences

**Model Guidance Shown:** never

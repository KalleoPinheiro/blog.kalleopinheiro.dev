---
name: Foundation Tasks
description: Atomic TDD-driven tasks for the M1 foundation, with dependencies and parallel execution map
---

# Foundation (M1) Tasks

**Spec**: `.specs/features/foundation/spec.md`
**Design**: `.specs/features/foundation/design.md`
**Status**: Draft

> All tasks are **TDD-first**: the "Done when" checklist starts with a failing test unless the task is pure config/tooling. Every test follows AAA with `sut` naming (AD-006). No `any` allowed (AD-007).

---

## Execution Plan

### Phase 1 — Scaffolding (sequential)

```
T1 → T2 → T3 → T4
```

### Phase 2 — Testing harness (sequential, depends on Phase 1)

```
T5 → T6 → T7 → T8
```

### Phase 3 — UI foundation (sequential, depends on Phase 1)

```
T9 → T10 → T11
```

### Phase 4 — Library layer (parallel, depends on Phase 2 + 3)

```
        ┌→ T12 [P] (env)
Phase 2 ┤
Phase 3 ┤→ T13 [P] (site-config)
        │
        └→ T14 [P] (metadata helpers)
```

### Phase 5 — Routes & endpoints (parallel, depends on Phase 4)

```
T12..T14 ──┬→ T15 [P] welcome page
           ├→ T16 [P] healthcheck
           ├→ T17 [P] sitemap
           ├→ T18 [P] robots
           ├→ T19 [P] rss.xml
           └→ T20 [P] not-found
```

### Phase 6 — Cross-cutting config (sequential, depends on Phase 5)

```
T21 (root layout metadata) → T22 (security headers) → T23 (Swagger)
```

### Phase 7 — Deployment docs (sequential, depends on Phase 6)

```
T24 (env.example + README)
T25 (Vercel deploy) — DEFERRED, see STATE.md AD-009
```

---

## Task Breakdown

### T1: Bootstrap Next.js app

**What**: Run `create-next-app` with TypeScript + App Router + Tailwind, no ESLint, src-dir. Verify Next.js current stable major first via Context7 (**RF-1**).
**Where**: repo root
**Depends on**: none
**Reuses**: nothing (greenfield)
**Requirement**: FND-01

**Tools**:
- MCP: `Context7` (resolve `next`, verify latest major + create-next-app flags)
- Skill: none

**Done when**:
- [ ] `pnpm dev` starts on `http://localhost:3000` and renders the CNA default page
- [ ] `package.json` declares `"type": "module"` (or sticks with the generated default) and pins the Next major
- [ ] `.gitignore` covers `.next`, `node_modules`, `.env*.local`, `coverage/`

---

### T2: Configure strict TypeScript

**What**: Tighten `tsconfig.json` with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`. Add `@/*` path alias.
**Where**: `tsconfig.json`
**Depends on**: T1
**Reuses**: default CNA `tsconfig.json` as baseline
**Requirement**: FND-02

**Done when**:
- [ ] `pnpm typecheck` exits 0 on the default app
- [ ] Flags listed above are set to `true`
- [ ] `@/*` resolves to `./src/*`

**Verify**: `pnpm typecheck`

---

### T3: Install & configure Biome

**What**: Add Biome, write `biome.json` with recommended ruleset + `suspicious/noExplicitAny` = `error`. Replace any default ESLint config.
**Where**: `biome.json`, `package.json`
**Depends on**: T2
**Reuses**: Biome default recommended config
**Requirement**: FND-03

**Tools**:
- MCP: `Context7` (verify Biome Next.js preset, **RF-4**)

**Done when**:
- [ ] `pnpm lint` runs Biome and passes on the scaffolded repo
- [ ] `pnpm format` runs `biome format --write`
- [ ] Introducing `const x: any = 1` fails `pnpm lint`

**Verify**: `pnpm lint && echo "const x: any = 1" >> src/_sanity.ts && pnpm lint` (second run must fail; then delete `_sanity.ts`)

---

### T4: Package.json scripts

**What**: Define `dev`, `build`, `start`, `lint`, `format`, `typecheck`, `test`, `test:watch`, `test:coverage`, `check` (runs typecheck+lint+test).
**Where**: `package.json`
**Depends on**: T3
**Reuses**: n/a
**Requirement**: FND-01

**Done when**:
- [ ] All scripts above exist and work
- [ ] `pnpm check` passes (tests will be added in Phase 2)

---

### T5: Install Vitest + RTL stack

**What**: Add `vitest`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@vitest/coverage-v8`. Verify current recommended setup via Context7 (**RF-2**).
**Where**: `package.json`
**Depends on**: T4
**Reuses**: none
**Requirement**: FND-04

**Tools**:
- MCP: `Context7`
- Skill: none

**Done when**:
- [ ] All packages installed as devDependencies
- [ ] `pnpm list vitest` shows a recent major

---

### T6: Create `vitest.config.ts`

**What**: Configure Vitest with `environment: "jsdom"`, `globals: true`, path aliases, coverage thresholds (v8 provider, 80% lines for `src/lib` and `src/app/api`).
**Where**: `vitest.config.ts`
**Depends on**: T5
**Reuses**: n/a
**Requirement**: FND-04

**Done when**:
- [ ] Config compiles and Vitest picks it up
- [ ] `@/*` alias resolves in tests
- [ ] `pnpm test` runs and finds zero tests (exit 0 or 1 with "no tests found" — we'll add one next)

---

### T7: Write Vitest setup file + first AAA test

**What**: Create `test/setup.ts` extending RTL matchers. Write one demo test `src/lib/sample.test.ts` that verifies a trivial `sum` function using AAA + `sut`. This also doubles as the convention showcase.
**Where**: `test/setup.ts`, `src/lib/sample.ts` (trivial), `src/lib/sample.test.ts`
**Depends on**: T6
**Reuses**: n/a
**Requirement**: FND-04

**Done when**:
- [ ] `pnpm test` runs and passes 1 test
- [ ] The sample test shows AAA sections and `sut` naming
- [ ] `toBeInTheDocument` is available without per-file import

**Verify**: `pnpm test`

---

### T8: Wire CI-friendly check script

**What**: Confirm `pnpm check` runs `typecheck && lint && test` and exits non-zero on any failure. Document in README.
**Where**: `package.json`, `README.md`
**Depends on**: T7
**Reuses**: T4 scripts
**Requirement**: FND-01

**Done when**:
- [ ] `pnpm check` green on clean repo
- [ ] README mentions it as the single gate

---

### T9: Initialize shadcn/ui

**What**: Run shadcn init. Verify Tailwind v3 vs v4 path via Context7 (**RF-3**); if v4 not cleanly supported by shadcn, stick with v3 and note decision in STATE.md.
**Where**: `components.json`, `src/lib/utils.ts`, `src/app/globals.css`
**Depends on**: T4
**Reuses**: Tailwind config from CNA
**Requirement**: FND-05

**Tools**:
- MCP: `Context7` (resolve `shadcn` and `tailwindcss`)

**Done when**:
- [ ] `components.json` committed
- [ ] `src/lib/utils.ts` exports `cn()`
- [ ] Globals import Tailwind directives / v4 entrypoint

---

### T10: Add base shadcn primitives (Button)

**What**: Generate `Button` and one container primitive (e.g. `Card`) via `pnpm dlx shadcn add button card`.
**Where**: `src/components/ui/`
**Depends on**: T9
**Reuses**: shadcn CLI
**Requirement**: FND-05

**Done when**:
- [ ] `Button` importable from `@/components/ui/button`
- [ ] Importing and rendering `<Button>Hello</Button>` in a test shows the expected class names

**TDD note**: Before running shadcn, write a minimal test that asserts `<Button variant="default">X</Button>` renders with text "X" and a button role. Let it fail → generate component → green.

---

### T11: Layout shell components

**What**: Create `site-header.tsx` and `site-footer.tsx` (Server Components, no interactivity). Each returns minimal semantic markup with site name / copyright from `siteConfig` (wired in T13).
**Where**: `src/components/layout/`
**Depends on**: T10, T13
**Reuses**: shadcn primitives, `siteConfig`
**Requirement**: FND-05, FND-06

**Done when**:
- [ ] Both files exist with tests verifying the site name appears and roles are correct
- [ ] Neither component imports `"use client"`

---

### T12: `src/lib/env.ts` (TDD) [P]

**What**: Write failing tests for the zod schema (valid input → parses; missing required → throws; wrong type → throws), then implement `env.ts`.
**Where**: `src/lib/env.ts`, `src/lib/env.test.ts`
**Depends on**: T8
**Reuses**: `zod`
**Requirement**: FND-13

**Done when**:
- [ ] 3 tests pass (happy path, missing var, malformed var)
- [ ] `env` is exported as a frozen, typed object
- [ ] No `any` anywhere in the file

---

### T13: `src/lib/site-config.ts` [P]

**What**: Export a typed `siteConfig` with name, url (from env), defaultLocale `"pt-BR"`, feed metadata (title, description, language), social placeholders.
**Where**: `src/lib/site-config.ts`, `src/lib/site-config.test.ts`
**Depends on**: T12
**Reuses**: `env`
**Requirement**: FND-11, FND-08, FND-09, FND-10

**Done when**:
- [ ] Test asserts `siteConfig.url` derives from `env.NEXT_PUBLIC_SITE_URL`
- [ ] Type `SiteConfig` exported

---

### T14: `src/lib/metadata.ts` (TDD) [P]

**What**: Implement `buildRootMetadata()` and `buildPageMetadata()`. TDD: tests assert title template, canonical, OG defaults, Twitter card presence.
**Where**: `src/lib/metadata.ts`, `src/lib/metadata.test.ts`
**Depends on**: T13
**Reuses**: `siteConfig`, Next.js `Metadata` type
**Requirement**: FND-11

**Done when**:
- [ ] Tests cover: root defaults, per-page override, canonical URL building
- [ ] Helper returns `Metadata` (no `any`, no `as unknown as`)

---

### T15: Welcome page `app/page.tsx` (TDD) [P]

**What**: RTL test asserts: one `<h1>` with site name, Portuguese tagline text, "coming soon" message, `getByRole("main")` landmark. Then implement page as Server Component using shadcn primitives.
**Where**: `src/app/page.tsx`, `src/app/page.test.tsx`
**Depends on**: T11, T13
**Reuses**: `siteConfig`, shadcn `Button`/`Card`
**Requirement**: FND-06

**Done when**:
- [ ] All assertions above pass
- [ ] Page is a Server Component (no `"use client"`)

---

### T16: `/api/health` (TDD) [P]

**What**: Test imports `GET` from route, invokes it, asserts status 200, content-type JSON, body shape `{ status, uptime, version, timestamp }`, `Cache-Control: no-store`. Then implement.
**Where**: `src/app/api/health/route.ts`, `src/app/api/health/route.test.ts`
**Depends on**: T12
**Reuses**: `env.APP_VERSION`
**Requirement**: FND-07

**Done when**:
- [ ] 4 assertions pass
- [ ] Response body validated against typed `HealthPayload`

---

### T17: `app/sitemap.ts` (TDD) [P]

**What**: Test asserts the exported function returns `MetadataRoute.Sitemap` (array), with entry for `/` using `siteConfig.url`. Implementation returns a single entry now; extension point for M3.
**Where**: `src/app/sitemap.ts`, `src/app/sitemap.test.ts`
**Depends on**: T13
**Reuses**: `siteConfig`
**Requirement**: FND-08

**Done when**:
- [ ] Test passes
- [ ] Visiting `/sitemap.xml` in dev returns valid XML

---

### T18: `app/robots.ts` (TDD) [P]

**What**: Test asserts rules allow all, sitemap URL matches `siteConfig.url`. Implement.
**Where**: `src/app/robots.ts`, `src/app/robots.test.ts`
**Depends on**: T13
**Reuses**: `siteConfig`
**Requirement**: FND-09

**Done when**:
- [ ] Test passes
- [ ] Visiting `/robots.txt` in dev returns expected text

---

### T19: `app/rss.xml/route.ts` (TDD) [P]

**What**: Test asserts GET returns 200, content-type `application/rss+xml`, body contains `<rss version="2.0">` and channel metadata from `siteConfig`. Implement as hand-built XML string (KISS).
**Where**: `src/app/rss.xml/route.ts`, `src/app/rss.xml/route.test.ts`
**Depends on**: T13
**Reuses**: `siteConfig`
**Requirement**: FND-10

**Done when**:
- [ ] Test passes
- [ ] Output validates at W3C Feed Validator (manual check recorded in PR)

---

### T20: `app/not-found.tsx` [P]

**What**: Minimal 404 page with root metadata inheritance.
**Where**: `src/app/not-found.tsx`, `src/app/not-found.test.tsx`
**Depends on**: T11
**Reuses**: `siteConfig`
**Requirement**: FND-06 (edge case)

**Done when**:
- [ ] RTL test asserts `role="main"` and "404" text
- [ ] Test passes

---

### T21: Root layout + metadata template

**What**: `src/app/layout.tsx` wires `<html lang="pt-BR">`, imports globals, renders header + `{children}` + footer, exports `metadata = buildRootMetadata()`.
**Where**: `src/app/layout.tsx`, `src/app/layout.test.tsx`
**Depends on**: T11, T14, T15..T20
**Reuses**: layout components, metadata helper
**Requirement**: FND-11

**Done when**:
- [ ] RTL test renders layout with dummy children and asserts header/footer presence
- [ ] `metadata` export uses the helper

---

### T22: Security headers in `next.config.ts` (FND-12)

**What**: Configure `headers()` for HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, CSP (strict; allow `'self'` + inline style nonce if strictly required by Next).
**Where**: `next.config.ts`
**Depends on**: T21
**Reuses**: none
**Requirement**: FND-12

**Done when**:
- [ ] `curl -I http://localhost:3000/` (during `pnpm dev`) shows all five headers
- [ ] Welcome page still renders without CSP violations in console

---

### T23: Swagger/OpenAPI (FND-14)

**What**: Verify current App-Router-compatible Swagger lib via Context7 (**RF-5**). Install. Add `/api/docs` route that serves Swagger UI gated by `env.ENABLE_API_DOCS`. Document `/api/health` with JSDoc/OpenAPI annotations.
**Where**: `src/app/api/docs/route.ts` (+ UI page), route annotations
**Depends on**: T22
**Reuses**: `env`, existing API routes
**Requirement**: FND-14

**Tools**:
- MCP: `Context7`

**Done when**:
- [ ] Hitting `/api/docs` in dev shows Swagger UI with `/api/health`
- [ ] In production without flag, `/api/docs` returns 404
- [ ] OpenAPI JSON validates against OpenAPI 3.1

---

### T24: `.env.example` + README deploy notes

**What**: `.env.example` lists all server + public vars with comments. README documents local setup, scripts, and Vercel deployment preconditions.
**Where**: `.env.example`, `README.md`
**Depends on**: T23
**Reuses**: `env.ts`
**Requirement**: FND-15

**Done when**:
- [ ] All vars from `envSchema` present in `.env.example`
- [ ] README includes a "Run locally" and "Deploy" section

---

### T25: Vercel deploy — **DEFERRED**

**Status**: DEFERRED per user request 2026-04-21 (see STATE.md AD-009). Picked up as a follow-up before M2.

**What**: Link repo to Vercel project, configure env vars, verify a preview deploy.
**Where**: Vercel dashboard + local `.vercel/` link
**Depends on**: T24
**Reuses**: n/a
**Requirement**: FND-15

**Tools**:
- MCP: `Vercel` (list projects, deploy, fetch build logs if needed)

**Done when** (when resumed):
- [ ] Preview URL available and `/api/health` returns 200 on it
- [ ] `/sitemap.xml`, `/robots.txt`, `/rss.xml` return valid responses on the preview
- [ ] Production env vars set; `main` deploy succeeds

---

## Parallel Execution Map

```
Phase 1 (seq):  T1 → T2 → T3 → T4
Phase 2 (seq):  T5 → T6 → T7 → T8
Phase 3 (seq):  T9 → T10 → T11   (T11 also waits on T13)
Phase 4 (par):  T12 [P] ─┬─ T13 [P] ─── T14 [P]
                         │
                         └─ (T13 unblocks T11)
Phase 5 (par):  T15..T20 all [P] after T14 + T11
Phase 6 (seq):  T21 → T22 → T23
Phase 7 (seq):  T24 → T25
```

---

## Granularity Check

| Task scope                                    | Granularity |
| --------------------------------------------- | ----------- |
| T1 Bootstrap                                  | ✅ Single command + verify |
| T2 tsconfig                                   | ✅ One file |
| T3 Biome                                      | ✅ One file + install |
| T5/T6/T7 Vitest setup split across 3 tasks    | ✅ Separate concerns (install, config, setup) |
| T12/T13/T14 lib modules                       | ✅ One module each |
| T15..T20 routes                               | ✅ One route each |
| T25 Vercel deploy                             | ✅ Single deliverable |

No task covers more than one module/endpoint/file concern. ✅

---

## Tools Needed (summary — confirm before execution)

**MCPs:**
- `Context7` — for research flags RF-1..RF-5 (Next.js, Vitest, shadcn/Tailwind, Biome, Swagger)
- `Vercel` — for T25 deployment and log inspection

**Skills:**
- `mermaid-studio` (if installed) — any additional diagrams during M1
- `codenavi` (if installed) — not needed for greenfield M1

**Please confirm:**
1. Are both `mermaid-studio` and `codenavi` installed in your Claude environment? (Affects how I handle diagrams + future code exploration.)
2. Is Vercel linked via MCP in the way you expect, or should you `vercel login` and `vercel link` manually at T25?
3. Package manager preference: **pnpm** (assumed) — confirm or switch to npm/yarn/bun.
4. Do you want me to commit task-by-task (one commit per T*), or batch by phase?

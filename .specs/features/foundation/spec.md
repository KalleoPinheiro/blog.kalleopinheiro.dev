---
name: Foundation Specification
description: M1 — deployable Next.js foundation with strict tooling, TDD, SEO primitives, security baseline, and Vercel deployment
---

# Foundation (M1) Specification

## Problem Statement

We need a deployable Next.js app with disciplined tooling, test infrastructure, SEO primitives, and baseline security — but no content yet. This foundation must enable TDD from day one, enforce the project's code principles (no `any`, KISS, DRY), and avoid decisions that would block M2 (Payload CMS), M3 (content rendering), or M4 (i18n).

## Goals

- [ ] Deployable to Vercel with a green `/api/health` check within one click from `main`.
- [ ] TDD workflow usable on day one — every M1 requirement ships with a Vitest/RTL test authored before its implementation.
- [ ] Lighthouse **SEO = 100** and **Performance ≥ 95** on the welcome page (mobile, throttled).
- [ ] Zero `any` in the committed codebase (enforced by lint + CI).
- [ ] `pnpm typecheck && pnpm lint && pnpm test` passes locally and in CI.

## Out of Scope

| Feature                                  | Reason                                               |
| ---------------------------------------- | ---------------------------------------------------- |
| Payload CMS install / collections        | Deferred to M2                                       |
| Blog post listing, detail, tags          | Deferred to M3                                       |
| i18n routing, locale switcher            | Deferred to M4                                       |
| Authentication / user accounts           | Not needed until Payload admin (M2)                  |
| Comments, newsletter, analytics, search  | Future milestones                                    |
| Custom design system beyond shadcn       | KISS — use shadcn defaults in M1                     |
| Dark mode toggle                         | Not required for foundation; easy to add later       |
| OG image auto-generation                 | Post-dependent; add with M3 content rendering        |

---

## User Stories

### P1: Deployable scaffold ⭐ MVP

**User Story**: As the maintainer, I want a strict-TypeScript Next.js project with App Router, Biome, Tailwind, and shadcn/ui wired up, so that every subsequent milestone builds on a disciplined foundation.

**Why P1**: Nothing else can ship without this.

**Acceptance Criteria**:

1. WHEN I run `pnpm dev` THEN the Next.js app SHALL start without errors on `http://localhost:3000`.
2. WHEN I run `pnpm typecheck` THEN TypeScript SHALL complete with zero errors under `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`.
3. WHEN I run `pnpm lint` THEN Biome SHALL complete with zero errors and `any` usage SHALL be reported as an error.
4. WHEN I run `pnpm format` THEN Biome SHALL reformat all files idempotently.
5. WHEN a shadcn primitive (`Button`) is imported THEN it SHALL render with Tailwind styling applied.

**Independent Test**: Clone repo → `pnpm install` → `pnpm dev` renders the app; all scripts exit 0.

---

### P1: TDD-ready test harness ⭐ MVP

**User Story**: As the maintainer, I want Vitest + React Testing Library configured with AAA/SUT conventions, so that every feature ships test-first from day one.

**Why P1**: TDD is the project's stated discipline; skipping this forces retrofit later.

**Acceptance Criteria**:

1. WHEN I run `pnpm test` THEN Vitest SHALL execute all `*.test.ts(x)` files and exit with the appropriate status code.
2. WHEN I write a component test using RTL THEN the test SHALL run in a JSDOM environment with `@testing-library/jest-dom` matchers available globally.
3. WHEN a new feature file is created THEN a colocated `*.test.ts(x)` file SHALL exist before the implementation is merged.
4. WHEN a test is written THEN it SHALL follow the **AAA** structure with the tested target bound to a variable named `sut`.
5. WHEN `pnpm test:coverage` runs THEN a coverage report SHALL be generated and fail if coverage on touched files drops below an agreed threshold (target: 80% lines on `src/lib/`).

**Independent Test**: A single demo `src/lib/sample.test.ts` using AAA + `sut` runs green.

---

### P1: Welcome page ⭐ MVP

**User Story**: As a visitor, I want to land on a clean, fast, accessible homepage that tells me what this site is, so that I understand where I've arrived.

**Why P1**: The site needs a publicly viewable surface to validate deployment and SEO.

**Acceptance Criteria**:

1. WHEN I visit `/` THEN the page SHALL render the site name, a one-line Portuguese tagline, and a short "coming soon" message.
2. WHEN the page loads THEN LCP SHALL be < 1.5s on a throttled 4G Lighthouse run.
3. WHEN I inspect the page THEN there SHALL be exactly one `<h1>`, with all interactive elements keyboard-reachable.
4. WHEN I view the page source THEN it SHALL include valid Open Graph and Twitter card meta tags.

**Independent Test**: Visit `/` in production preview, run Lighthouse → SEO 100, Performance ≥ 95, Accessibility ≥ 95.

---

### P1: Healthcheck endpoint ⭐ MVP

**User Story**: As an operator, I want `GET /api/health` to report liveness data, so that Vercel monitors and uptime pings can verify the app is alive.

**Why P1**: Validates deploy + API routing end-to-end; required before any later milestone.

**Acceptance Criteria**:

1. WHEN `GET /api/health` is called THEN the response SHALL be `200 OK` with JSON `{ status: "ok", uptime: number, version: string, timestamp: string }`.
2. WHEN the endpoint is called THEN it SHALL NOT require authentication.
3. WHEN the endpoint is called THEN it SHALL set `Cache-Control: no-store`.
4. WHEN a test exercises the handler THEN it SHALL validate the shape of the response body against a typed schema.

**Independent Test**: `curl https://<preview>/api/health` returns well-formed JSON with status 200.

---

### P1: SEO baseline ⭐ MVP

**User Story**: As a site owner, I want sitemap, robots, RSS, and canonical metadata configured from day one, so that the site is discoverable as soon as content lands.

**Why P1**: Retrofitting SEO is painful; App Router conventions make day-one setup cheap.

**Acceptance Criteria**:

1. WHEN a crawler requests `/sitemap.xml` THEN it SHALL return a valid sitemap (empty URL list is acceptable; must validate against sitemap XSD).
2. WHEN a crawler requests `/robots.txt` THEN it SHALL return a policy allowing `*` and referencing `/sitemap.xml`.
3. WHEN a feed reader requests `/rss.xml` THEN it SHALL return a valid RSS 2.0 feed with channel metadata (no items is acceptable).
4. WHEN any page renders THEN it SHALL inherit a title template, canonical URL, default description, and OG/Twitter defaults from root metadata.

**Independent Test**: Sitemap validates at a public validator; RSS validates at W3C Feed Validator; Lighthouse SEO = 100.

---

### P1: Security baseline ⭐ MVP

**User Story**: As a site owner, I want secure HTTP headers and typed environment variables, so that common misconfigurations are impossible by default.

**Why P1**: Security retrofits miss things; baseline belongs in the foundation.

**Acceptance Criteria**:

1. WHEN any response is served THEN it SHALL include `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy`.
2. WHEN the app starts with a missing or malformed environment variable THEN it SHALL fail fast with a typed error (via zod schema) before serving requests.
3. WHEN the client bundle is inspected THEN it SHALL contain zero server-only environment variables.

**Independent Test**: `curl -I https://<preview>/` shows all security headers; deleting a required env var prevents startup.

---

### P2: API documentation (Swagger / OpenAPI)

**User Story**: As a developer, I want the API routes documented via OpenAPI, so that I have a single source of truth for route contracts.

**Why P2**: Valuable but non-blocking — M1 only ships one endpoint (`/api/health`). The setup is worth locking in now while API surface is small.

**Acceptance Criteria**:

1. WHEN I visit `/api/docs` (dev environment, or gated in production) THEN I SHALL see rendered Swagger UI listing all API routes.
2. WHEN a new API route is added with JSDoc/OpenAPI annotations THEN it SHALL appear automatically in the Swagger UI.
3. WHEN the OpenAPI JSON is fetched THEN it SHALL validate against the OpenAPI 3.1 spec.

**Independent Test**: Load `/api/docs` → healthcheck is listed with accurate request/response schema.

---

### P2: Vercel deployment

**User Story**: As the maintainer, I want the app deployed to Vercel with preview-per-branch, so that every change is verifiable in a production-like environment.

**Why P2**: Local ticks the other criteria; deployment proves the end-to-end path.

**Acceptance Criteria**:

1. WHEN a PR is opened THEN Vercel SHALL create a preview deployment and surface its URL in the PR.
2. WHEN `main` is updated THEN Vercel SHALL deploy to production.
3. WHEN a required env var is missing in Vercel THEN the deployment SHALL fail with a clear error (no silent fallback).

**Independent Test**: Open a PR → preview URL healthcheck returns 200.

---

## Edge Cases

- WHEN an unknown route is requested THEN the system SHALL render a minimal `not-found.tsx` page with root metadata inherited.
- WHEN `/api/health` is called repeatedly THEN each response SHALL reflect a fresh timestamp (no caching).
- WHEN `NODE_ENV` is `production` and `/api/docs` is hit without auth gating THEN the system SHALL either require a basic credential or return 404 (decision deferred to design).
- WHEN a test file contains `any` THEN lint SHALL fail the test as well as the source — no looser rules in tests.
- WHEN the RSS feed has zero items THEN it SHALL still serve a valid (empty-items) RSS 2.0 document.

---

## Requirement Traceability

| Requirement ID | Story                              | Tasks        | Status                                          |
| -------------- | ---------------------------------- | ------------ | ----------------------------------------------- |
| FND-01         | P1: Deployable scaffold            | T1, T4, T8   | ✅ Done (T1, T4 done; T8 script done, README pending T24) |
| FND-02         | P1: Deployable scaffold (strict TS)| T2           | ✅ Done                                          |
| FND-03         | P1: Deployable scaffold (Biome)    | T3           | ✅ Done                                          |
| FND-04         | P1: TDD-ready test harness         | T5, T6, T7   | ✅ Done                                          |
| FND-05         | P1: Deployable scaffold (UI)       | T9, T10, T11 | ✅ Done                                              |
| FND-06         | P1: Welcome page                   | T15, T20     | ⏳ Pending — scaffold page exists; TDD rewrite pending T13 |
| FND-07         | P1: Healthcheck endpoint           | T16          | ⏳ Pending                                       |
| FND-08         | P1: SEO baseline (sitemap)         | T17          | ⏳ Pending                                       |
| FND-09         | P1: SEO baseline (robots)          | T18          | ⏳ Pending                                       |
| FND-10         | P1: SEO baseline (RSS)             | T19          | ⏳ Pending                                       |
| FND-11         | P1: SEO baseline (root metadata)   | T13, T14, T21| ⚠️ Partial — T13 ✅ T14 ✅; T21 pending             |
| FND-12         | P1: Security baseline (headers)    | T22          | ⏳ Pending                                       |
| FND-13         | P1: Security baseline (env schema) | T12          | ⚠️ Partial — `env.ts` committed; `env.test.ts` untracked |
| FND-14         | P2: API documentation (Swagger)    | T23          | ⏳ Pending                                       |
| FND-15         | P2: Vercel deployment              | T24, T25     | 🔁 T25 Deferred; T24 (.env.example + README) pending |

**Coverage:** 15 total, all mapped to tasks. 4 done/partial, 11 pending/deferred.

---

## Success Criteria

- [ ] `pnpm install && pnpm typecheck && pnpm lint && pnpm test && pnpm build` passes on a clean clone.
- [ ] Welcome page scores Lighthouse SEO = 100, Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95 (mobile).
- [ ] `/api/health` returns valid JSON with `status: "ok"` on Vercel preview.
- [ ] `/sitemap.xml`, `/robots.txt`, `/rss.xml` all return valid documents on Vercel preview.
- [ ] Every FND-* requirement has at least one Vitest test authored before its implementation.
- [ ] `git grep -n ": any"` returns zero matches in `src/`.

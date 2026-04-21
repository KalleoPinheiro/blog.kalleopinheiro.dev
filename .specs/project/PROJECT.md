---
name: PROJECT
description: Vision, goals, stack, and scope for the personal technical blog
---

# Personal Technical Blog

**Vision:** A performant, SEO-ready personal blog where I publish technical content about software engineering — news, tips, deep dives — starting in Portuguese and expanding to other languages.
**For:** Software developers and IT professionals who want practical, current technical content.
**Solves:** Provides a clean, fast, search-engine-friendly publication channel with full control over content and experience (no third-party platform lock-in).

## Goals

- **Performance:** Lighthouse Performance ≥95 on mobile; LCP <1.5s on 4G; static-first rendering wherever possible.
- **SEO from day one:** Canonical metadata, sitemap.xml, robots.txt, RSS feed, and structured data configured in the foundation.
- **Developer experience:** Strict type safety, one-command typecheck + lint (<5s on touched files), consistent formatting via Biome.
- **Security baseline:** No secrets in client bundles, secure HTTP headers (CSP, HSTS, X-Content-Type-Options), dependency vulnerability scanning.
- **Scalable architecture:** Serverless-first, stateless rendering, edge-cacheable pages, content model decoupled from presentation via headless CMS.
- **Evolutionary:** Ship a minimal foundation first; grow feature-by-feature without rearchitecting.

## Tech Stack

**Core:**

- Framework: **Next.js** (latest stable, App Router)
- Language: **TypeScript** (strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Runtime: Node.js (LTS) on Vercel serverless
- CMS: **Payload CMS** (self-hosted, Next.js-native integration) — introduced in M2
- Database: PostgreSQL (Vercel Postgres / Neon) — introduced with Payload in M2

**UI:**

- **Tailwind CSS** for styling
- **shadcn/ui** for component primitives

**Tooling:**

- **Biome** for linting + formatting (single tool, fast)
- **Swagger / OpenAPI** for API route documentation
- **Next.js API Routes** for backend endpoints

**Testing:**

- **Vitest** — unit and integration test runner
- **React Testing Library** — component behavior testing
- **TDD workflow** — tests authored before implementation (red → green → refactor)

**Deployment:** **Vercel** (preview deployments per PR, production on main)

## Development Principles

Standing rules applied to every code change. Violations are flagged, not silently accepted.

- **TDD first.** Write a failing test before the implementation. Red → green → refactor.
- **AAA structure.** Every test is laid out as Arrange / Act / Assert, with the tested target bound to a variable named `sut` (System Under Test) so the target is unambiguous.
- **Test behavior, not internals.** Drive tests from the public API and user-visible outcomes.
- **No `any` in TypeScript.** Use precise types; reach for `unknown` + narrowing or generics when uncertain. If `any` feels necessary, the design is wrong — stop and rethink.
- **KISS.** Prefer the smallest working solution. No premature abstraction, speculative flexibility, or cleverness.
- **DRY (with judgment).** Extract when duplication has *semantic* overlap, not just surface similarity. Three similar lines beats a premature abstraction.
- **Security first.** No secrets in client bundles; validate inputs at boundaries; secure headers on by default.

## Scope

**v1 (Foundation — M1) includes:**

- Next.js App Router project with strict TypeScript
- Biome configured for lint + format
- Tailwind + shadcn/ui initialized
- `/api/health` healthcheck endpoint
- Minimal welcome page (landing)
- SEO baseline: root metadata, `sitemap.xml`, `robots.txt`, RSS feed endpoint
- Swagger/OpenAPI setup for API route documentation
- Base security headers via `next.config`
- Project conventions and structure documented

**Explicitly out of scope for v1:**

- Payload CMS integration (M2)
- Any actual blog post rendering (M3)
- i18n / multi-language (M4)
- Authentication, comments, newsletter, search, analytics (Future)
- Custom design system beyond shadcn defaults
- A/B testing, feature flags

## Constraints

- **Content language:** Portuguese (pt-BR) first; i18n added in a later milestone — but URL/routing design in M1 must not block it.
- **Hosting:** Vercel — all architectural choices must be compatible with Vercel's serverless runtime and edge.
- **Cost:** Prefer free tiers (Vercel Hobby, Neon free DB) during early milestones; design so paid scaling is linear, not a rewrite.
- **Solo maintainer:** Keep tooling lean; avoid setups that require constant attention.

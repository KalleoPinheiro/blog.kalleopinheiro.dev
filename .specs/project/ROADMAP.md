---
name: ROADMAP
description: Milestones and features for the personal technical blog, evolving step-by-step from foundation to full CMS-driven site
---

# Roadmap

**Current Milestone:** M1 — Foundation
**Status:** In Progress — Phases 1–3 complete (scaffolding, testing, UI primitives); Phase 4 in progress (env done, site-config next)

---

## M1 — Foundation

**Goal:** A deployable Next.js app with strict tooling, a healthcheck, a welcome page, and SEO primitives wired up. No content yet — just the ground floor.
**Target:** Shippable to Vercel with a green healthcheck and passing Lighthouse SEO audit.

### Features

**Project scaffolding** — ✅ DONE (T1–T4)

- Next.js 16.2.4 with App Router + strict TypeScript (`d6d11b8`, `ff8147f`)
- Path aliases (`@/*` → `src/*`) and strict tsconfig flags (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Biome configured for lint + format with `noExplicitAny=error` (`f7b8c32`)

**Tooling setup** — ✅ DONE (T3–T4)

- Biome 2.2.0 — lint + format (replaces ESLint/Prettier)
- `package.json` scripts: all 10 defined (`dev`, `build`, `start`, `lint`, `format`, `typecheck`, `test`, `test:watch`, `test:coverage`, `check`)

**Testing foundation (TDD)** — ✅ DONE (T5–T7)

- Vitest 4.1.5 + jsdom + RTL + `@testing-library/jest-dom` installed (`03da6e2`)
- `vitest.config.ts` with coverage thresholds (v8, 80% lines on `src/lib/`, `src/app/api/`) (`3c97d0e`)
- `test/setup.ts` + `src/lib/sum.ts` sample test following AAA + `sut` convention (`ce0516e`)

**UI foundation** — ⚠️ PARTIAL (T9–T10 done; T11 pending)

- Tailwind v4 + shadcn/ui initialized with base-nova preset (`3f07c3e`)
- `Button` + `Card` primitives generated and tested (`37fc987`)
- Layout shell (`site-header.tsx`, `site-footer.tsx`) — **pending T13**

**Environment validation** — ⚠️ PARTIAL (T12 code done; env.test.ts needs commit check)

- `src/lib/env.ts` with zod schema, typed `Env` type, `createEnv()` factory (`a791c70`)

**Welcome page** — ⏳ PENDING (T15 — after T11, T13)

- CNA scaffold page exists; must be replaced TDD-first after site-config and layout shell are ready

**Healthcheck API** — ⏳ PENDING (T16)

- `GET /api/health` — not started

**API documentation** — ⏳ PENDING (T23)

- Swagger / OpenAPI setup — not started

**SEO baseline** — ⏳ PENDING (T13–T14, T17–T19, T21)

- `site-config.ts`, `metadata.ts`, `sitemap.ts`, `robots.ts`, `rss.xml/route.ts` — all pending

**Security & performance baseline** — ⏳ PENDING (T22)

- Security headers via `next.config.ts` — not started; env validation (FND-13) is done

**Deployment** — 🔁 DEFERRED (T25 per AD-009; T24 pending T23)

- T25 (Vercel link + preview) deferred; T24 (`.env.example` + README rewrite) pending

---

## M2 — Headless CMS Integration

**Goal:** Payload CMS running inside the Next.js app, backed by PostgreSQL, with content collections for posts, authors, and taxonomies. Admin UI accessible and secured.

### Features

**Payload CMS install** — PLANNED
**Database provisioning (Neon / Vercel Postgres)** — PLANNED
**Collections: Posts, Authors, Tags, Categories, Media** — PLANNED
**Admin access control** — PLANNED
**Media storage (Vercel Blob or S3)** — PLANNED
**Local dev seed data** — PLANNED

---

## M3 — Content Rendering

**Goal:** Readers can discover and read posts. Blog index, post detail, tag/category pages, and syntax-highlighted code blocks.

### Features

**Post list / blog index** — PLANNED
**Post detail page** — PLANNED
**Rich-text / MDX rendering with syntax highlighting** — PLANNED
**Tag and category archive pages** — PLANNED
**Reading time, table of contents, share links** — PLANNED
**Populated RSS feed + sitemap** — PLANNED

---

## M4 — Internationalization

**Goal:** Bilingual site (pt-BR default, en-US added). Content authored per locale, URL routing respects locale, SEO hreflang tags in place.

### Features

**i18n routing (`/pt`, `/en`)** — PLANNED
**Locale-aware metadata and hreflang tags** — PLANNED
**Payload collections with localized fields** — PLANNED
**Language switcher UI** — PLANNED
**Localized sitemap and RSS** — PLANNED

---

## Future Considerations

- Full-text search (Algolia, Meilisearch, or Postgres-backed)
- Analytics (Vercel Analytics or self-hosted Plausible)
- Newsletter (Resend + subscribe form)
- Comments (Giscus via GitHub Discussions)
- Dark mode toggle with system preference
- Related-posts recommendations
- OG image auto-generation per post
- Author pages
- Series / multi-part articles
- Draft preview URLs for unpublished posts
- Web vitals dashboard and performance regression CI

---
name: ROADMAP
description: Milestones and features for the personal technical blog, evolving step-by-step from foundation to full CMS-driven site
---

# Roadmap

**Current Milestone:** M1 — Foundation
**Status:** ✅ COMPLETE — all tasks done; T25 (Vercel deploy) deferred per AD-009 as a pre-M2 step

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

**UI foundation** — ✅ DONE (T9–T11)

- Tailwind v4 + shadcn/ui with base-nova preset (`3f07c3e`)
- `Button` + `Card` primitives (`37fc987`)
- `SiteHeader` + `SiteFooter` Server Components (`6737af6`)

**Library layer** — ✅ DONE (T12–T14)

- `env.ts` — zod-validated env singleton (`a791c70`)
- `site-config.ts` — brand constants, feed metadata, social handles (`68d88f7`)
- `metadata.ts` — `buildRootMetadata()` + `buildPageMetadata()` (`085415a`)

**Welcome page** — ✅ DONE (T15, T20)

- `app/page.tsx` — Portuguese landing: site name h1, description, "Em breve" (`07e7688`)
- `app/not-found.tsx` — minimal 404 with main landmark (`a32c4b3`)

**Healthcheck API** — ✅ DONE (T16)

- `GET /api/health` returns `{ status, uptime, version, timestamp }`, `Cache-Control: no-store` (`983f9f6`)

**API documentation** — ✅ DONE (T23)

- `/api/docs` — Swagger UI via CDN + embedded OpenAPI 3.1; 404 unless `ENABLE_API_DOCS=true` (`2b4f658`)

**SEO baseline** — ✅ DONE (T17–T19, T21)

- `sitemap.ts`, `robots.ts`, `rss.xml/route.ts` — all serving valid responses (`074fc38`)
- `layout.tsx` — `lang="pt-BR"`, header + children + footer, root metadata export (`de075df`)

**Security & performance baseline** — ✅ DONE (T22)

- Security headers via `next.config.ts` — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy (`6b5a869`)

**Deployment** — ⚠️ PARTIAL (T24 done; T25 deferred per AD-009)

- `.env.example` + README rewritten (`3ebb399`)
- T25 (Vercel link + preview deploy) — pick up before M2 begins

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

---
name: ROADMAP
description: Milestones and features for the personal technical blog, evolving step-by-step from foundation to full CMS-driven site
---

# Roadmap

**Current Milestone:** M1 — Foundation
**Status:** Planning

---

## M1 — Foundation

**Goal:** A deployable Next.js app with strict tooling, a healthcheck, a welcome page, and SEO primitives wired up. No content yet — just the ground floor.
**Target:** Shippable to Vercel with a green healthcheck and passing Lighthouse SEO audit.

### Features

**Project scaffolding** — PLANNED

- Next.js (latest stable) with App Router + strict TypeScript
- Path aliases and base `tsconfig` tuned for strictness
- Folder convention documented in `.specs/codebase/STRUCTURE.md`

**Tooling setup** — PLANNED

- Biome configured for lint + format (replaces ESLint/Prettier)
- `package.json` scripts: `dev`, `build`, `start`, `lint`, `format`, `typecheck`, `test`, `test:watch`, `test:coverage`
- Git hooks (optional, lean): pre-commit format + typecheck on staged files

**Testing foundation (TDD)** — PLANNED

- Vitest configured for unit + integration tests (JSDOM env for component tests)
- React Testing Library + `@testing-library/jest-dom` matchers
- Sample tests following AAA pattern with `sut` naming convention
- Coverage thresholds set (and enforced in CI for touched files)
- Test file colocation convention documented (`foo.ts` → `foo.test.ts`)
- Every M1 feature below is delivered TDD-first (failing test → implementation → refactor)

**UI foundation** — PLANNED

- Tailwind CSS configured (with Tailwind v4 if stable)
- shadcn/ui initialized with base tokens
- Minimal layout shell (header, main, footer placeholders)

**Welcome page** — PLANNED

- `/` route with a minimal, accessible landing
- Brand/site name, one-line intro, "coming soon" or equivalent
- Uses shadcn primitives for visual consistency

**Healthcheck API** — PLANNED

- `GET /api/health` returns `{ status, uptime, version, timestamp }`
- Documented in OpenAPI spec
- No auth; suitable for Vercel monitors / uptime pings

**API documentation** — PLANNED

- Swagger / OpenAPI setup for API route documentation
- Single source of truth for route contracts
- Served at `/api/docs` (dev-only or gated in production)

**SEO baseline** — PLANNED

- Root `metadata` export (title template, description, OG defaults)
- `sitemap.xml` (dynamic, ready to grow with content)
- `robots.txt`
- RSS feed endpoint (empty collection initially, ready for posts)
- Favicon + social share image placeholders

**Security & performance baseline** — PLANNED

- Security headers via `next.config` (CSP, HSTS, X-Frame-Options, Referrer-Policy)
- Image component defaults
- Environment variable handling pattern (typed via `zod`)

**Deployment** — PLANNED

- Vercel project linked
- Preview deployments per branch
- Production on `main`

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

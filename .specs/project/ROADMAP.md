---
name: ROADMAP
description: Milestones and features for the personal technical blog, evolving step-by-step from foundation to full CMS-driven site
---

# Roadmap

**Current Milestone:** M2 — Content Rendering
**Status:** Ready to begin (M1 + M1.5 ✅ complete)

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

---

## M1.5 — Infrastructure & CMS

**Goal:** Two phases: (1) CI/CD workflows enforcing the branching strategy with automated quality gates and promotion; (2) Custom headless CMS with schema-driven architecture, admin UI, and API layer.
**Target:** Zero manual steps in the development workflow; content management fully operational with admin dashboard and CRUD endpoints.
**Status:** ✅ COMPLETED (CI/CD: 2026-04-24; CMS: 2026-04-25)

### Features

#### CI/CD Infrastructure

**Feature-branch validation workflow** — ✅ DONE (CI-1, commit `caedf07`)

- `validate.yml` triggers on `feature/**` push and PRs targeting `develop`
- Runs: checkout → pnpm setup → typecheck → lint → format check → Vitest → Snyk SAST
- Cancels in-progress runs on force-push (concurrency group by `github.ref`)
- Tested across PRs #17-#25 with multiple feature branches

**Automatic develop→main PR promotion** — ✅ DONE (CI-2, commit `caedf07`)

- `promote-to-main.yml` triggers on merge of `feature/**` into `develop`
- Auto-creates `release:` PR with original PR credit and author attribution
- Idempotent: checks for existing open PR to `main` before creation
- Tested in PRs #23-#25 with promotion flow validation

**Branch protection enforcement** — ✅ DONE (CI-5, manual)

- `develop` branch protection configured to require `checks` status check
- Tested: PR merge blocked on failing validation checks

#### CMS Infrastructure

**Hooks registry system** — ✅ DONE (commit `a09f285`)

- `src/cms/hooks/registry.ts` — `HooksRegistry` class with error handling
- Extensible hook system for pre/post operations across all resources
- Global hooks registry singleton for cross-cutting concerns

**CMS schemas & Prisma integration** — ✅ DONE (commit `a09f285`)

- `src/cms/schemas/` — Zod-validated schemas for Post, Page, Author, Media, Comment
- Prisma ORM with PostgreSQL support
- Data normalization utility (`src/cms/utils/normalize.ts`) for `exactOptionalPropertyTypes` compatibility
- Tests for all schemas with 100% coverage

**CMS API routes (CRUD)** — ✅ DONE (commit `a09f285`)

- `src/app/api/cms/{posts,pages,authors,media,comments}/` routes
- GET (list), POST (create), PUT (update), DELETE endpoints
- Prisma queries, validation, error handling
- Hooks integration for cache invalidation

**Admin UI** — ✅ DONE (commit `a09f285`)

- `src/app/admin/` — Dashboard, navigation, layout with session-based access control
- List, create, and edit pages for all resources
- DataTable component with pagination-ready structure
- FormBuilder with Zod validation and real-time error display
- Status badges, rich-text editor placeholder, responsive UI

**Cache invalidation & revalidation** — ✅ DONE (commit `a09f285`)

- Hooks fire on POST/PUT/DELETE API calls
- Cache tags per resource (posts, pages, authors, media, comments)
- `revalidateTag()` calls in hook handlers for On-Demand ISR
- Tested with real API routes and cache behavior

**Documentation** — ✅ DONE (commit `a09f285`)

- `docs/cms-api.md` — API reference (endpoints, auth, examples, error codes)
- `docs/cms-admin-guide.md` — Admin UI walkthrough and troubleshooting
- `README.md` updated with CMS section and links

---

## M2 — Content Rendering

**Goal:** Readers can discover and read posts. Blog index, post detail pages, and author pages, pulling content from the CMS via API.

### Features

**Post list / blog index** — PLANNED
**Post detail page** — PLANNED
**Author profile page** — PLANNED
**Markdown / rich-text rendering with syntax highlighting** — PLANNED
**Reading time, table of contents** — PLANNED
**Populated RSS feed + sitemap with live data** — PLANNED
**Dynamic sitemap.xml and robots.txt** — PLANNED

---

## M3 — Advanced Content Features

**Goal:** Enhanced reader experience with archives, search, and related-posts recommendations.

### Features

**Tag / category archive pages** — PLANNED
**Full-text search (Algolia, Meilisearch, or Postgres-backed)** — PLANNED
**Related posts sidebar** — PLANNED
**Comment system (Giscus / GitHub Discussions)** — PLANNED
**OG image auto-generation per post** — PLANNED
**Draft preview URLs for unpublished posts** — PLANNED

---

## M4 — Internationalization (i18n)

**Goal:** Bilingual site (pt-BR default, en-US added). Content authored per locale, URL routing respects locale, SEO hreflang tags in place.

### Features

**i18n routing (`/pt`, `/en`)** — PLANNED
**Locale-aware metadata and hreflang tags** — PLANNED
**CMS locale fields for Posts, Pages, Authors** — PLANNED
**Language switcher UI** — PLANNED
**Localized sitemap and RSS** — PLANNED

---

## Future Considerations

- Analytics (Vercel Analytics or self-hosted Plausible)
- Newsletter subscription (Resend + subscribe form)
- Dark mode toggle with system preference
- Series / multi-part articles (multi-part posts)
- Web vitals dashboard and performance regression CI
- Email notifications on new posts
- Social sharing optimization (share buttons, preview cards)
- Advanced cache strategies per content type
- CDN edge caching tuning for SEO and performance

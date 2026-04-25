# M1.6 Refinement — Specification

## Overview

Harden the headless CMS foundation with seed data, validation coverage, public reading surface, and admin shell.

## User Stories

### As a developer
- I want deterministic seed data so I can test CMS flows locally without manual setup.
- I want validation tests on Post CRUD so I can trust the API layer handles edge cases.
- I want a public blog list and detail pages so I can verify the CMS content surfaces correctly to readers.

### As a site maintainer
- I want an admin shell with data tables so I can visualize and navigate content without touching the database directly.

## Acceptance Criteria

### Data & Seed
- [ ] Seed script populates 3 authors, 12 posts (mix draft/published), 4 pages, 8 media, 24 comments.
- [ ] Seed runs idempotently on `pnpm db:seed`.
- [ ] All payloads validate through Zod schemas before insert.
- [ ] Faker locale is `pt-BR` for realistic Brazilian data.

### CRUD Validation
- [ ] Post create/update/delete routes covered by tests (200/201/204/400/404/500 paths).
- [ ] Cascade delete of comments verified when post deleted.
- [ ] Coverage on `src/app/api/**` ≥ 80% all metrics.
- [ ] All tests use AAA + `sut` pattern with Vitest + mocked Prisma.

### Public Reading
- [ ] `/blog` lists published posts only, paginated, sorted by publish date desc.
- [ ] `/posts/[slug]` serves post detail with article OG + JSON-LD `Article` schema.
- [ ] Unknown slug returns 404 via `notFound()`.
- [ ] Both pages use RSC + Suspense, no client JS overhead.

### Admin Shell
- [ ] `/admin` sidebar navigation to resource pages (posts, authors, pages, media, comments).
- [ ] Admin pages render data tables fed by Prisma `select` queries.
- [ ] No mutation UI in this milestone (CRUD stays via API).

## Out of Scope

- Theme toggle (defer to design milestone).
- Admin authentication / middleware (defer to security milestone).
- MDX / rich-text rendering (defer to content-editing milestone).
- Playwright E2E (defer to QA milestone).

## Dependencies

- `@faker-js/faker` — deterministic fake data generation.
- `tsx` — TypeScript runner for seed script.
- shadcn/ui primitives: `input`, `textarea`, `label`, `dialog`, `table`, `badge`, `separator`, `skeleton`, `sonner`.

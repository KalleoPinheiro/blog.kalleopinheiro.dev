# M1.6 Refinement — Task Breakdown

## Spec Phase

1. ✓ `docs(specs): add m1.6 refinement spec` — Create `.specs/features/m1.6-refinement/spec.md`
2. ✓ `docs(specs): add m1.6 design` — Create `.specs/features/m1.6-refinement/design.md`
3. ✓ `docs(specs): add m1.6 tasks` — Create `.specs/features/m1.6-refinement/tasks.md`

## Env & Data

4. `chore(env): validate DATABASE_URL` — Extend `src/utils/env.ts` + `.env.example`
5. `chore(deps): add faker + tsx` — Install + add scripts `db:seed`, `db:reset`
6. `feat(db): add deterministic seed script` — Create `prisma/seed.ts`

## CRUD Tests (TDD)

7. `test(cms): post schema edge cases` — `tests/unit/cms/schemas/post.test.ts`
8. `test(api): posts collection route` — `tests/unit/app/api/cms/posts/route.test.ts`
9. `test(api): post item route` — `tests/unit/app/api/cms/posts/[id]/route.test.ts`
10. `test(api): authors + comments handlers` — Lighter suites for authors/comments
11. `chore(test): enforce coverage thresholds` — Update `vitest.config.ts` to 80%

## UI Primitives

12. `feat(ui): add shadcn primitives` — Run `pnpm dlx shadcn@latest add ...`

## Public Reading

13. `feat(public): blog list page` — Create `src/app/(public)/blog/page.tsx` + components
14. `feat(public): post detail page` — Create `src/app/(public)/posts/[slug]/page.tsx` + metadata
15. `test(public): blog list + detail` — Test RSC pages with mocked Prisma

## Admin Shell

16. `feat(admin): sidebar shell layout` — Refactor `src/app/admin/layout.tsx` + sidebar component
17. `feat(admin): generic resource table` — Create `resource-table.tsx` + wire admin pages

## Docs

18. `docs: update CLAUDE.md + STATE.md` — Add seed workflow, mark milestone complete

## Verification

```bash
pnpm install
pnpm prisma migrate dev
pnpm db:seed
pnpm check
pnpm dev  # smoke /blog, /posts/[slug], /admin/*
```

**Exit Criteria**: All tasks green, `pnpm check` passes, seed runs idempotently, /blog + /posts/[slug] render, admin tables appear, coverage ≥ 80%.

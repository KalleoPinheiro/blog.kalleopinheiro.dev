# M1.6 Refinement — Design

## Data Layer

### Seed Script (`prisma/seed.ts`)

- **Determinism**: `faker.seed(42)` for reproducible fake data.
- **Locale**: `pt-BR` for realistic names/text.
- **Order**: Media → Authors (with avatar FK) → Posts (with author FK, mix draft/published, tags array) → Pages → Comments (with post FK, cascade delete).
- **Idempotency**: `deleteMany` cascading from Comment → Post → Page → Author → Media when `NODE_ENV !== 'production'`.
- **Validation**: All payloads validated through matching `CreateXSchema` before insert.
- **Trigger**: `pnpm db:seed` via `tsx prisma/seed.ts`; `pnpm db:reset` for full reset.

### Environment

- **DATABASE_URL**: Added to `src/utils/env.ts` as `z.string().url()`, validated at startup.
- **Prisma generator**: `provider = "prisma-client"` (Prisma 7) with `output = "../src/generated/prisma"`. Client is gitignored and must be regenerated via `pnpm db:generate` after schema changes.
- **Driver adapter**: `PrismaPg` from `@prisma/adapter-pg` + `pg` driver. `src/lib/db.ts` instantiates `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`. Imports come from `@/generated/prisma/client`.
- **`prisma.config.ts`**: Reads `.env.local` manually (Prisma CLI does not use Next.js env loading), declares `schema` and `migrations.path` explicitly, omits the `datasource` block when `DATABASE_URL` is absent so `prisma generate` works without a running database.
- **`pnpm db:generate`**: Canonical command to regenerate the client. No `postinstall` auto-generate.

## API Layer (Unchanged)

Existing CRUD routes at `src/app/api/cms/{resource}/{route.ts,[id]/route.ts}` remain. Tests now validate all paths (200/201/204/400/404/500).

## Public Reading (RSC)

### `/blog` List Page

- **Route**: `src/app/(public)/blog/page.tsx` — RSC server component.
- **Query**: Prisma `findMany` filtered by `status: 'published'`, sorted by `publishedAt desc`, paginated (skip/take).
- **Select**: `{ id, slug, title, excerpt, publishedAt, author: { select: { name } } }` (Prisma query optimization).
- **Components**: `post-card`, `post-list`, `pagination` using shadcn `Card`, `Badge`, `Button`.
- **Streaming**: `<Suspense>` with `Skeleton` fallback.
- **Metadata**: `buildPageMetadata` (title "Blog", description, canonical).

### `/posts/[slug]` Detail Page

- **Route**: `src/app/(public)/posts/[slug]/page.tsx` — RSC with dynamic `[slug]` segment.
- **Query**: Prisma `findUnique({ where: { slug } })`.
- **Error Handling**: Call `notFound()` if post not found or status not `'published'`.
- **Components**: New `prose.tsx` wrapper for content typography.
- **Metadata**: Dynamic `generateMetadata` returning article OG (`type: 'article'`, `image`, `publishedTime`, `modifiedTime`) + JSON-LD `<script type="application/ld+json">` with `Article` schema (author, datePublished, image, etc.).

## Admin Shell (RSC + Suspense)

### Layout

- **Route**: `src/app/admin/layout.tsx` refactored to include sidebar.
- **Components**: New `src/components/admin/{sidebar.tsx,shell.tsx}` (RSC) with nav to resource pages.
- **Styling**: Reuse `Separator`, `Button` from shadcn.

### Resource Pages

- **Pattern**: Existing `src/app/admin/{posts,authors,pages,media,comments}/page.tsx` wired to new `resource-table.tsx` generic component.
- **Fetching**: RSC server component calls Prisma with `select` (minimal fields), passes array to table.
- **Columns**: Typed descriptor (field, header, render fn) passed to `resource-table`.
- **No Mutations**: Create/update/delete remains API-only in this milestone.

## Testing Strategy

### Unit Tests

- **Schemas**: Zod validation edge cases (constraints, enums, optional fields).
- **Routes**: Mocked Prisma (`vi.mock('@/lib/db')`), AAA + `sut`, all HTTP paths (200/201/204/400/404/500).
- **RSC Pages**: RSC components tested via `await Component({...})`, mocked Prisma, rendered output assertions.

### Coverage

- **Gate**: 80% lines/functions/branches/statements on `src/lib/**` + `src/app/api/**`.
- **Thresholds**: Enforced in `vitest.config.ts`, fails CI if breached.

## No Breaking Changes

- Existing CRUD endpoints unchanged.
- Existing shadcn `Button` + `Card` remain compatible.
- New shadcn primitives (`input`, `textarea`, etc.) are isolated additions.
- Seed is dev/test-only; no production data affected.

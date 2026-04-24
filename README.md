# Personal Blog

A performant, SEO-ready personal blog built with Next.js 16 App Router, TypeScript strict mode, Tailwind CSS v4, and shadcn/ui. Content in Portuguese (pt-BR) first.

## Run locally

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env template and fill in required values
cp .env.example .env.local
# Set NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 3. Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Biome lint check |
| `pnpm format` | Biome format (writes) |
| `pnpm typecheck` | TypeScript type check |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm check` | Full gate: typecheck + lint + test |

`pnpm check` is the single CI gate — it must pass before merging.

## Environment variables

See [`.env.example`](.env.example) for all variables with descriptions.

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | — | Full public URL (no trailing slash) |
| `NODE_ENV` | — | `development` | Runtime environment |
| `APP_VERSION` | — | `dev` | Injected by CI; shown in `/api/health` |
| `ENABLE_API_DOCS` | — | `false` | Set `true` to expose Swagger UI at `/api/docs` |

## API

| Endpoint | Description |
|---|---|
| `GET /api/health` | Liveness check — returns `{ status, uptime, version, timestamp }` |
| `GET /api/docs` | Swagger UI (enabled via `ENABLE_API_DOCS=true`) |
| `GET /sitemap.xml` | XML sitemap |
| `GET /robots.txt` | Robots policy |
| `GET /rss.xml` | RSS 2.0 feed |

## Tech stack

- **Framework:** Next.js 16 (App Router, Server Components first)
- **Language:** TypeScript strict mode
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Linting/Formatting:** Biome
- **Testing:** Vitest + React Testing Library (TDD, AAA + `sut` convention)
- **Deployment:** Vercel (preview per PR, production on `main`)

## Deploy to Vercel

1. Import the repository in the [Vercel dashboard](https://vercel.com/new)
2. Set environment variables (`NEXT_PUBLIC_SITE_URL` is required; others are optional)
3. Deploy — preview URLs are created automatically per branch

Production deploys on push to `main`.

## CI/CD

### GitHub Actions Workflows

This project uses two workflows to maintain code quality and enforce the branching strategy:

- **`validate`** — Runs on every push to `feature/**` branches and PRs to `develop`. Executes typecheck, linting, format check, unit tests, and Snyk SAST. Blocks PR merge if any step fails.
- **`promote-to-main`** — Runs when a PR merges into `develop`. Automatically creates a PR from the feature branch to `main` for release promotion (if one does not already exist).

### Required Secrets

Add the following secret to your repository settings:

- **`SNYK_TOKEN`** — Snyk API token for SAST scanning. Obtain from [Snyk Dashboard](https://app.snyk.io/account/settings/api).

### Branch Protection

To enforce the CI gate, configure `develop` branch protection in **Settings → Branches → Add rule**:

- **Branch name pattern:** `develop`
- **Require status checks to pass before merging:** Check
  - Required status check: `validate`
- **Require branches to be up to date before merging:** Check

### Notes

- Feature branches are preserved after merging into `develop` so they can be used in the promotion PR.
- The `promote-to-main` workflow uses `GITHUB_TOKEN`, which cannot trigger further workflow runs (GitHub security boundary). If the promotion PR requires additional validation, run `validate` manually via **Actions → validate → Run workflow** or push a commit to the feature branch.

# Development Quickstart Guide

**Target**: Get a developer up to speed and running the blog locally in 15 minutes.

## Prerequisites

Ensure you have installed:

- **Node.js**: 24+ LTS
- **pnpm**: 9.0+ (`npm install -g pnpm`)
- **Git**: Latest version
- **Docker**: (optional, for PostgreSQL)

## 1. Clone & Install

```bash
# Clone the repository
git clone <repo-url> blog
cd blog

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local
```

## 2. Database Setup (Development)

Option A: SQLite (simplest, recommended for first-time setup)

```bash
# Database is auto-created at PrismaDB_DEV=true in development
# No additional setup needed
```

Option B: PostgreSQL (Docker)

```bash
# Start PostgreSQL in Docker
docker run --name blog-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=blog \
  -p 5432:5432 \
  -d postgres:16

# Update .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/blog"
```

**Initialize Database**:

```bash
# Run migrations
pnpm exec prisma migrate dev --name init

# (Optional) Seed development data
pnpm exec prisma db seed
```

## 3. Environment Configuration

Edit `.env.local`:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"  # SQLite for dev

# Authentication (NextAuth.js v5)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl rand -base64 32>"

# GitHub OAuth (optional for v1, demo auth)
# GITHUB_ID=<github-oauth-id>
# GITHUB_SECRET=<github-oauth-secret>

# Search
SEARCH_ENABLED=true
SEARCH_INDEX_PATH="./prisma/search-index"

# Markdown
MARKDOWN_PARSER="remark"
MARKDOWN_PLUGINS="emoji,gfm"

# Feature Flags
FEATURES_COMMENTS_ENABLED=true
FEATURES_SEARCH_ENABLED=true
```

Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

## 4. Run Development Server

```bash
# Start the dev server (with file watching, hot reload)
pnpm dev

# Server runs on http://localhost:3000
```

Output should show:

```sh
> next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## 5. Verify Setup

### Check the application

1. **Homepage**: <http://localhost:3000>
   - Should display empty article list (no articles yet)
   - Navigation, header, footer visible
   - Search bar functional

2. **Create Article** (if authenticated):
   - Login: <http://localhost:3000/auth/login>
   - New Article: <http://localhost:3000/articles/new>
   - Fill form and publish

3. **Search**: Try searching for published articles

### Run tests

```bash
# Unit & integration tests (with watch mode)
pnpm test

# Test coverage report
pnpm test:coverage

# E2E tests (if Playwright installed)
pnpm test:e2e
```

Expected output:

```sh
PASS  src/services/articles/__tests__/ArticleService.test.ts
PASS  src/components/articles/__tests__/ArticleList.test.tsx
...
Test Files  12 passed (12)
Tests       156 passed (156)
```

## 6. Code Quality

### Linting & Formatting (Biome.js)

```bash
# Check code style
pnpm lint

# Auto-fix formatting issues
pnpm format

# Combined check
pnpm check
```

### Commit Hooks (Pre-commit)

Husky + lint-staged automatically:

1. Lint staged files on `git commit`
2. Format with Biome.js
3. Run tests for changed files
4. Enforce commit message format (commitlint)

**Commit Message Format**:

```text
<type>: <description>

<optional body explaining the why>

Allowed types: feat, fix, test, refactor, docs, style, chore
```

Example:

```text
feat: add article publishing with metadata

Add support for creating articles with title, content, category, and tags.
Implements ArticleService with validation via Zod. Tests written first (TDD).
```

## 7. Database Management

### View Database (Prisma Studio)

```bash
# Open interactive database viewer in browser
pnpm prisma studio
```

Accessible at: <http://localhost:5555>

### Create Migration

After updating `schema.prisma`:

```bash
pnpm prisma migrate dev --name <migration-name>

# Example
pnpm prisma migrate dev --name add_article_views
```

### Reset Database

```bash
# WARNING: Deletes all data
pnpm prisma migrate reset

# Confirms, re-runs migrations, and seeds
```

## 8. Project Structure Overview

```sh
src/
├── app/               # Next.js pages and API routes
├── components/        # Reusable UI components
├── services/          # Business logic layer
├── lib/               # Utilities and shared code
│   ├── db/           # Database client and migrations
│   ├── auth/         # Authentication utilities
│   └── markdown/     # Markdown parsing
└── styles/           # Global styles
```

**Key Concepts**:

- **Pages** (in `app/`) contain only presentation logic
- **Services** (in `services/`) contain business logic
- **Components** are isolated and tested with React Testing Library
- **Tests** live next to source code in `__tests__` directories
- **Types** defined in `lib/shared/types.ts`

## 9. Common Development Tasks

### Create a New Feature

1. **Write tests first** (TDD):

   ```typescript
   // src/services/articles/__tests__/ArticleService.test.ts
   describe('ArticleService', () => {
     it('should publish an article with metadata', () => {
       // Arrange
       const article = { title: 'Test', content: 'Content', status: 'DRAFT' };
       // Act
       const result = service.publish(article);
       // Assert
       expect(result.status).toBe('PUBLISHED');
     });
   });
   ```

2. **Implement service logic**:

   ```typescript
   // src/services/articles/ArticleService.ts
   export class ArticleService {
     async publish(article: Article) {
       // Business logic here
     }
   }
   ```

3. **Create API route**:

   ```typescript
   // src/app/api/articles/route.ts
   export async function POST(req: Request) {
     const article = await req.json();
     return service.publish(article);
   }
   ```

4. **Build React component**:

   ```typescript
   // src/components/articles/ArticleForm.tsx
   export function ArticleForm() {
     // Component logic
   }
   ```

5. **Test component**:

   ```typescript
   // src/components/articles/__tests__/ArticleForm.test.tsx
   it('should validate required fields', () => {
     // RTL test
   });
   ```

### Run a Single Test File

```bash
pnpm test -- ArticleService.test.ts
```

### Debug Tests

```bash
# Run tests with browser-based debugger
pnpm test --inspect-brk

# Or use VSCode debugger configuration (included in .vscode/launch.json)
```

### Update Dependencies

```bash
# Check outdated packages
pnpm outdated

# Update all packages
pnpm update

# Update specific package
pnpm update react@latest
```

## 10. Troubleshooting

### Issue: "Port 3000 already in use"

```bash
# Use different port
PORT=3001 pnpm dev

# Or kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Issue: Database connection failed

```bash
# Check DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# Verify PostgreSQL is running (if using Docker)
docker ps | grep postgres

# Reset database
pnpm prisma migrate reset
```

### Issue: Tests failing after dependency update

```bash
# Clear cache and reinstall
pnpm store prune
pnpm install

# Run tests again
pnpm test
```

### Issue: Types not recognized in IDE

```bash
# Regenerate Prisma types
pnpm prisma generate

# Restart TypeScript server in IDE (Cmd+Shift+P → "Restart TS Server")
```

## 11. Continuous Integration (CI)

GitHub Actions automatically runs on every push:

```yaml
# .github/workflows/test.yml
- Run linting (pnpm lint)
- Run tests (pnpm test)
- Check code coverage (min 80%)
- Build (pnpm build)
```

View CI status in GitHub PR checks.

## 12. Deployment (Future)

When ready to deploy:

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or deploy to Vercel (one-click from GitHub)
# https://vercel.com/import
```

Environment variables on production must include:

- `DATABASE_URL` (production PostgreSQL)
- `NEXTAUTH_SECRET` (secure random string)
- `NEXTAUTH_URL` (production domain)

---

## Next Steps

1. **Explore the codebase**: Start with `src/components/` and `src/services/`
2. **Write a test**: Pick a failing test and implement the feature (TDD)
3. **Create a feature branch**: `git checkout -b feat/my-feature`
4. **Commit your changes**: `git commit -m "feat: describe your change"`
5. **Push and create a PR**: `git push origin feat/my-feature`

## Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro)
- [Zod Validation Guide](https://zod.dev)
- [Tailwind CSS Utility-First CSS](https://tailwindcss.com)

## Getting Help

- **Code Questions**: Check the `docs/` folder
- **Architecture Questions**: Reference `spec.md` and `plan.md`
- **Test Examples**: Look at existing tests in `__tests__/` folders
- **TypeScript Issues**: Check `tsconfig.json` and run `pnpm tsc --noEmit`

---

Happy coding! 🚀

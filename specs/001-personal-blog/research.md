# Phase 0: Research & Technology Decisions

**Date**: 2026-04-20  
**Scope**: Validate technical choices and resolve implementation uncertainties  
**Status**: Complete

## Technology Stack Overview

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 16.2.4 | Latest version with App Router; native TypeScript support; seamless API routes; built-in image optimization |
| **Language** | TypeScript 5.x | Strong typing enforces SOLID principles; excellent IDE support; catches errors at compile-time |
| **UI Library** | shadcn/ui + Tailwind CSS | Component library reduces duplication; Tailwind ensures design consistency; responsive by default |
| **Validation** | Zod | Type-safe schema validation; generates TypeScript types from schemas; composable validators |
| **Testing** | Vitest + React Testing Library | Vitest is fast and Vite-native; RTL encourages testing behavior, not implementation |
| **Package Manager** | pnpm | Faster installations; strict dependency isolation; workspace-friendly for future monorepo |
| **Linting** | Biome.js | Single-tool replacement for ESLint + Prettier; faster; zero-config philosophy aligns with simplicity |
| **Database** | PostgreSQL (prod), SQLite (dev) | PostgreSQL production-ready; SQLite for local development speed |
| **Auth** | NextAuth.js v5 | Serverless-friendly; built for Next.js; supports multiple providers; session-based approach |
| **Markdown** | remark + rehype | Industry standard; composable plugins; secure HTML generation |

## Key Design Decisions

### 1. Clean Architecture + Feature-Based Organization

**Decision**: Hybrid approach combining Clean Architecture principles with feature folder organization.

**Rationale**:

- Clean Architecture ensures clear separation of concerns (presentation, business logic, data access)
- Feature folders group related components, services, and types together for easy maintenance
- Reduced cognitive load when working on a feature—all related code in one location
- Scalable for future features; adding a new feature doesn't require touching multiple distant folders

**Implementation Pattern**:

```sh
src/
├── components/<feature>/  # UI layer (presentation only)
├── services/<feature>/    # Business logic layer (orchestration, validation)
├── lib/                   # Shared utilities and types (cross-feature concerns)
└── app/api/              # API layer (request handling, response formatting)
```

### 2. Article Storage & Search Strategy

**Decision**: PostgreSQL with native full-text search capability; no separate search index initially.

**Rationale**:

- PostgreSQL's `tsvector` and `tsquery` provide good enough search for 500 articles
- Eliminates operational complexity of maintaining separate search infrastructure (Elasticsearch, MeiliSearch)
- Scales to ~10k articles before requiring dedicated search index
- SQL queries are testable and debuggable; no opaque indexing logic
- Migration path exists: easily add Elasticsearch or MeiliSearch later if needed

**Future Migration**: If search relevance requirements become more stringent, transition to dedicated search service without changing the service layer interface (Repository pattern handles this).

### 3. Markdown Content Storage

**Decision**: Store markdown source in database; render to HTML on-demand; cache rendered HTML.

**Rationale**:

- Author edits and updates markdown directly (familiar authoring experience)
- HTML stored in database as cache; regenerated only when markdown changes
- Supports future features (revisions, diffs, version history) naturally
- Security: remark + rehype sanitize HTML output; prevents XSS attacks
- Performance: cached HTML read from DB; O(1) display logic

### 4. Authentication & Authorization

**Decision**: NextAuth.js v5 with session-based authentication for v1 (single author).

**Rationale**:

- NextAuth.js handles session management, CSRF protection, and secure cookie handling
- Session-based approach is sufficient for single-author blog v1
- Future path: add role-based access control (RBAC) for multi-author support without rearchitecting auth layer
- Supports future OAuth providers (GitHub, Google) for multi-author scenarios

**Security Measures**:

- HTTPS-only cookies in production
- CSRF tokens on state-changing operations
- Input validation via Zod at all API boundaries
- No hardcoded secrets; use environment variables
- Rate limiting on comment submissions to prevent spam

### 5. Comment Moderation Strategy

**Decision**: Manual moderation v1; comments published immediately but author can delete/edit.

**Rationale**:

- Minimal operational overhead for single-author blog
- Author has full control and visibility into feedback
- Spam filtering deferred until comment volume warrants it
- Future: pluggable moderation service (e.g., Akismet)

### 6. Performance & Caching Strategy

**Decision**: Hybrid static generation (ISR) and dynamic rendering.

**Rationale**:

- Homepage and article list: ISR with 60-second revalidation (fresh but fast)
- Individual articles: ISR with 1-hour revalidation (balance between freshness and performance)
- Search results: dynamic (user-specific query parameters)
- Comments: dynamic (always show latest feedback)
- Cache strategy enforced via Next.js revalidate options; no manual cache headers

**Content Delivery**: Vercel's Edge Network for global CDN; static assets served from CDN.

### 7. Development Workflow & Code Quality

**Decision**: Strict TDD with 80% code coverage minimum; Biome.js for linting and formatting.

**Rationale**:

- TDD ensures testable code and reduces bugs in production
- 80% coverage target balances completeness with development velocity
- Biome.js enforces consistent style; single tool reduces configuration burden
- commitlint enforces commit message standards; improves git history readability

**Enforcement**:

- Pre-commit hooks validate linting (via Biome.js)
- PR checks verify test coverage and passing tests
- CI/CD blocks merge if tests fail or coverage drops below 80%

## Technology Choices Matrix

| Concern | Evaluated | Selected | Why Not Selected |
|---------|-----------|----------|------------------|
| **Router** | Next.js App Router, Pages Router | App Router | Server Components align with SOLID; reduced client-side JavaScript |
| **Form Handling** | React Hook Form, Formik, Native | React Hook Form + Zod | Lightweight; excellent TypeScript integration; minimal bundle impact |
| **Styling** | Tailwind CSS, CSS-in-JS, SCSS | Tailwind CSS | Consistency; responsive by default; zero runtime overhead |
| **Component Lib** | shadcn/ui, Chakra, MUI | shadcn/ui | Composable; Tailwind-based; low overhead; easy to customize |
| **ORM** | Prisma, Drizzle, TypeORM, SQL.js | Prisma | Type-safe; excellent DX; migrations built-in; generates TS types |
| **Search** | PostgreSQL FTS, Elasticsearch, Meilisearch | PostgreSQL FTS | Simple; no infra overhead; scales to 10k articles; clear migration path |
| **Auth** | NextAuth.js, Clerk, Auth0 | NextAuth.js | Open-source; built for Next.js; full control; minimal cost |
| **Comments** | Built-in custom solution, third-party (Disqus) | Custom solution | Full data ownership; better control over moderation; easier testing |
| **Markdown** | remark + rehype, markdown-it, showdown | remark + rehype | Industry standard; composable; security-first design; excellent plugin ecosystem |

## Development Environment Setup

- **Node.js**: 20+ LTS
- **pnpm**: 9.0+
- **IDE**: VS Code with TypeScript extension
- **Pre-commit**: Husky + lint-staged (linting runs on staged files)
- **CI/CD**: GitHub Actions (testing, coverage, linting)

## Deployment Plan

- **v1 Target**: Vercel (zero-config Next.js deployment)
- **Database**: Vercel PostgreSQL or self-managed PostgreSQL
- **Environment Management**: `.env.local` for development, Vercel environment variables for prod
- **Monitoring**: Vercel Analytics + custom error tracking (Sentry)

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| PostgreSQL FTS insufficient for complex queries | Clear migration path to Elasticsearch; code abstraction via Repository pattern |
| Comment spam without filtering | Rate limiting per IP; manual moderation; future Akismet integration |
| Performance degradation as content grows | ISR strategy caches content; database indexing on searchable fields; CDN caching static assets |
| Security vulnerabilities in dependencies | Dependabot enabled; regular audits via `npm audit`; security.txt endpoint |
| Large article rendering performance | Code splitting for markdown parser; lazy-loading comments; pagination support |

## Decisions Deferred to Task Implementation

1. **Rich Text Editor vs Markdown**: Markdown chosen for initial implementation; rich text editor (Slate, Tiptap) can be added without architectural changes
2. **Email Notifications**: Deferred to v1.1; infrastructure (email service integration) remains abstracted
3. **Multi-Author Support**: v1 assumes single author; RBAC framework designed to support future expansion
4. **Social Sharing**: Embed Open Graph meta tags now; share buttons deferred to v1.1
5. **Analytics**: Vercel Analytics sufficient for v1; custom event tracking deferred

## Conclusion

Technology choices align with the Blog Constitution's emphasis on code quality (SOLID, DRY, KISS), comprehensive testing (TDD with AAA discipline), and performance/security by design. The architecture scales to 500+ articles and future multi-author support without significant rearchitecting.

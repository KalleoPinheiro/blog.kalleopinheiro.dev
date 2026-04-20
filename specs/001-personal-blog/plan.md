# Implementation Plan: Personal Blog Platform

**Branch**: `001-personal-blog` | **Date**: 2026-04-20 | **Spec**: [Feature Specification](./spec.md)

## Summary

Build a personal blog-style web application using Next.js 16.2.4 that enables deliberate learning through teaching. The blog will support publishing and organizing technical articles, searching content by keywords and metadata, and gathering community feedback. Core features include article creation/editing, category/tag organization, full-text search with filtering, and comment functionality. The platform emphasizes code quality through Clean Architecture, SOLID principles, comprehensive testing via TDD, and strong TypeScript typing.

## Technical Context

**Language/Version**: TypeScript 5.x with Node.js 20+ (Next.js 16.2.4)  
**Primary Dependencies**: Next.js 16.2.4 (App Router), React 19, Zod, shadcn/ui, Tailwind CSS  
**Storage**: PostgreSQL for persistent data; consider SQLite for development  
**Testing**: Vitest for unit tests, React Testing Library for component tests, e2e testing framework Playwright  
**Target Platform**: Web application (desktop + responsive mobile)  
**Project Type**: Full-stack web application  
**Performance Goals**: Homepage < 1.5s load time, search < 1s, API endpoints < 500ms p95  
**Constraints**: Public read access, authenticated write access; single author v1  
**Scale/Scope**: 500 articles year 1; support up to 10,000 concurrent readers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Assessment

✅ **I. DRY & KISS - Code Simplicity**

- Clean Architecture with feature folders prevents duplication
- Shared utilities directory for cross-cutting concerns
- No premature abstraction with hybrid Clean Architecture + feature-based approach

✅ **II. SOLID - Architecture Quality**

- Segregation of concerns: pages handle presentation only, services handle business logic
- Dependency injection via Next.js dependency patterns
- Interface-based contracts for API routes and services

✅ **III. Test-Driven Development (TDD)**

- Vitest + React Testing Library mandated for all features
- Tests written before implementation (enforced in task generation)
- Red-Green-Refactor cycle documented in development workflow

✅ **IV. Testing Discipline (AAA & SUT)**

- React Testing Library enforces AAA pattern
- Component tests focus on SUT behavior, not implementation
- Unit tests for pure functions and utilities

✅ **V. User Experience Consistency**

- shadcn/ui component library ensures consistent patterns
- Tailwind CSS enforces visual consistency
- Error messages, form validation via Zod

✅ **VI. Security & Performance by Design**

- Input validation via Zod at API boundaries
- Environment-based secrets management
- Response caching strategy: static/ISR for articles, dynamic for authenticated endpoints
- Performance budget: page components < 100KB, API responses < 50KB

**Gate Status**: ✅ PASS - All principles aligned with technical choices

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-blog/
├── plan.md              # This file
├── research.md          # Phase 0 - Technology decisions
├── data-model.md        # Phase 1 - Entity definitions
├── quickstart.md        # Phase 1 - Development setup
├── contracts/
│   ├── articles-api.md      # Article CRUD endpoints
│   ├── search-api.md        # Search and filter contract
│   └── comments-api.md      # Comment endpoints
└── checklists/
    └── requirements.md
```

### Source Code Structure (repository root)

```text
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage (article list)
│   ├── (articles)/
│   │   ├── [slug]/
│   │   │   └── page.tsx         # Article detail page
│   │   ├── new/
│   │   │   └── page.tsx         # Create article page
│   │   └── edit/[slug]/
│   │       └── page.tsx         # Edit article page
│   ├── (search)/
│   │   └── page.tsx             # Search results page
│   ├── api/
│   │   ├── articles/
│   │   │   ├── route.ts         # List/Create articles
│   │   │   └── [slug]/
│   │   │       ├── route.ts     # Get/Update/Delete article
│   │   │       └── comments/
│   │   │           └── route.ts # Article comments
│   │   ├── search/
│   │   │   └── route.ts         # Search articles
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts
│   │       └── logout/
│   │           └── route.ts
│   └── error.tsx                # Error boundary
├── components/
│   ├── articles/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleForm.tsx
│   │   ├── ArticleList.tsx
│   │   └── __tests__/
│   │       ├── ArticleCard.test.tsx
│   │       ├── ArticleForm.test.tsx
│   │       └── ArticleList.test.tsx
│   ├── search/
│   │   ├── SearchBox.tsx
│   │   ├── SearchFilters.tsx
│   │   └── __tests__/
│   │       └── SearchBox.test.tsx
│   ├── comments/
│   │   ├── CommentForm.tsx
│   │   ├── CommentList.tsx
│   │   └── __tests__/
│   │       └── CommentForm.test.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── __tests__/
│   │       └── Navigation.test.tsx
│   └── ui/              # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── [other components]
├── services/
│   ├── articles/
│   │   ├── ArticleService.ts        # Business logic for articles
│   │   ├── ArticleRepository.ts     # Data access layer
│   │   ├── ArticleValidator.ts      # Zod schemas
│   │   └── __tests__/
│   │       ├── ArticleService.test.ts
│   │       └── ArticleRepository.test.ts
│   ├── search/
│   │   ├── SearchService.ts         # Search logic
│   │   ├── SearchValidator.ts       # Search schema validation
│   │   └── __tests__/
│   │       └── SearchService.test.ts
│   ├── comments/
│   │   ├── CommentService.ts
│   │   ├── CommentRepository.ts
│   │   └── __tests__/
│   │       └── CommentService.test.ts
│   └── auth/
│       ├── AuthService.ts
│       └── __tests__/
│           └── AuthService.test.ts
├── lib/
│   ├── shared/
│   │   ├── types.ts              # Shared type definitions
│   │   ├── constants.ts          # Application constants
│   │   ├── utils.ts              # Shared utilities
│   │   └── validators.ts         # Common Zod schemas
│   ├── db/
│   │   ├── client.ts             # Database connection
│   │   ├── migrations/           # Database migrations
│   │   └── seed.ts               # Database seeding
│   ├── auth/
│   │   ├── nextAuth.ts           # NextAuth configuration
│   │   └── middleware.ts         # Auth middleware
│   └── markdown/
│       ├── parser.ts             # Markdown parsing utilities
│       └── __tests__/
│           └── parser.test.ts
├── styles/
│   └── globals.css              # Tailwind and global styles
└── middleware.ts                # Next.js middleware for auth

tests/
├── integration/
│   ├── articles.integration.test.ts
│   ├── search.integration.test.ts
│   └── comments.integration.test.ts
├── e2e/
│   ├── article-creation.e2e.test.ts
│   ├── search-flow.e2e.test.ts
│   └── user-workflows.e2e.test.ts
└── fixtures/
    ├── articles.fixture.ts
    ├── users.fixture.ts
    └── comments.fixture.ts

config/
├── biome.json              # Biome.js configuration
├── vitest.config.ts        # Vitest configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── .commitlintrc.json      # commitlint configuration
└── .env.example            # Environment variables template

package.json
pnpm-lock.yaml
tsconfig.json
```

**Structure Decision**: Hybrid Clean Architecture + Feature-based organization. Features (articles, search, comments) own their domain logic, services, and components. Shared utilities and types live in `lib/` to enforce DRY. API routes in `app/api/` follow REST conventions. Testing colocated with components using `__tests__` convention.

## Complexity Tracking

No justifiable violations of constitution principles. Clean Architecture and SOLID adherence are architectural foundations, not trade-offs.

---

## Phase 0: Research & Technology Decisions

Status: Ready to execute

Key research areas:

- Database choice (PostgreSQL vs SQLite for dev/prod)
- Markdown parsing strategy (remark/rehype stack)
- Authentication approach (NextAuth vs custom JWT)
- Search implementation (database full-text vs dedicated index)
- Comment moderation approach
- Deployment platform (Vercel, self-hosted, containerized)

*See `research.md` for detailed findings*

## Phase 1: Design & Contracts

Status: Ready to execute

Deliverables:

1. `data-model.md` - Entity definitions, relationships, validation rules
2. `/contracts/` - API endpoint specifications (REST)
3. `quickstart.md` - Development environment setup

See individual files for specifications

---

## Next Steps

1. Complete Phase 0 research via `/speckit.research` or manual research tasks
2. Execute Phase 1 design to generate data model and API contracts
3. Run `/speckit.tasks` to generate implementation tasks for each user story
4. Begin TDD implementation starting with test files

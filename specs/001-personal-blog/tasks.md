---
description: "Task list for implementing Personal Blog Platform"
---

# Tasks: Personal Blog Platform

**Input**: Design documents from `/specs/001-personal-blog/`  
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Testing**: TDD mandatory - tests written first (AAA pattern), then implementation (Red-Green-Refactor)

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in all descriptions
- Tests follow AAA (Arrange-Act-Assert) pattern
- Each test explicitly names the System Under Test (SUT)

---

## Phase 1: Setup & Project Initialization

**Purpose**: Project initialization, tooling, and directory structure

### Environment & Dependencies

- [ ] T001 Initialize Next.js project with `create-next-app` using TypeScript, App Router, and `src/` directory
- [ ] T002 Install core dependencies: React 19, Next.js 16.2.4, TypeScript 5.x, React Hook Form, Zod
- [ ] T003 Install UI/styling dependencies: `shadcn/ui`, `tailwindcss`, `class-variance-authority`
- [ ] T004 Install testing dependencies: Vitest, `@testing-library/react`, `@testing-library/dom`, `jsdom`
- [ ] T005 Install ORM and database: Prisma, `@prisma/client`
- [ ] T006 Install markdown processing: `remark`, `remark-html`, `remark-gfm`, `rehype-sanitize`
- [ ] T007 Install authentication: `next-auth` v5, `bcryptjs`
- [ ] T008 Install linting/formatting: Biome.js, Husky, `lint-staged`, `commitlint`
- [ ] T008a Install theme/UI enhancements: `next-themes`, `lucide-react` (icons), `zustand` (for theme state)
- [ ] T008b Install Docker dependencies: Docker Desktop (dev), `docker`, `docker-compose` (local)

### Project Structure

- [ ] T009 [P] Create directory structure in `src/` following Clean Architecture + feature-based pattern
- [ ] T010 [P] Create feature directories: `src/components/`, `src/services/`, `src/lib/`, `src/app/`
- [ ] T011 [P] Create subdirectories for articles, search, comments, layout, ui components
- [ ] T012 [P] Create test directories: `src/**/__tests__/`, `tests/integration/`, `tests/e2e/`, `tests/fixtures/`
- [ ] T013 [P] Create config directories: `config/`, `prisma/` with migrations folder
- [ ] T014 Create `tsconfig.json` with strict mode enabled, path aliases for `@/*` imports
- [ ] T015 Create `tailwind.config.ts` with shadcn/ui preset, custom theme extensions, and dark mode configuration
- [ ] T015a Create theme configuration in `tailwind.config.ts`: Define light/dark color palettes with CSS variables for dynamic switching
- [ ] T015b Create `src/lib/theme/themeProvider.tsx`: Theme context provider using `next-themes` with dark mode as default
- [ ] T016 Create `vitest.config.ts` with coverage settings (target: 80%), globals mode, jsdom environment
- [ ] T017 Create `biome.json` with linting rules for TypeScript, React, formatting standards
- [ ] T018 Create `.commitlintrc.json` with conventional commit rules (feat, fix, test, refactor, docs, style, chore)

### Configuration Files

- [ ] T019 Create `.env.example` with all required environment variables documented
- [ ] T020 Create `next.config.ts` with image optimization, markdown support, trailing slash settings
- [ ] T020a Configure Turbopack in `next.config.ts`: Set `turbo: { rules: {...} }` for optimized local development builds
- [ ] T020b Configure React Compiler in `next.config.ts`: Enable `reactCompiler: true` for automatic optimization of React components
- [ ] T021 Create `tsconfig.paths.json` (or inline in tsconfig.json) for path aliases
- [ ] T022 Create `.eslintignore` and `.prettierignore` (if using alongside Biome.js)
- [ ] T023 Create `package.json` scripts: `dev`, `build`, `start`, `test`, `test:watch`, `test:coverage`, `lint`, `format`, `type-check`

### Git Configuration

- [ ] T024 Initialize Husky: `npx husky install`
- [ ] T025 Configure pre-commit hook: Run Biome.js linting and type-checking on staged files
- [ ] T026 Configure commit-msg hook: Validate commit message format with commitlint
- [ ] T027 Create `.gitignore` with appropriate entries for Node, Next.js, env files, coverage

### Docker & Container Configuration

- [ ] T028 Create `Dockerfile` for production image: Multi-stage build (dependencies → build → runtime)
  - Base: `node:24-alpine`
  - Install pnpm, install dependencies, build Next.js application
  - Run as non-root user, expose port 3000
  - Health check for container orchestration
- [ ] T029 Create `.dockerignore` to exclude unnecessary files from Docker build context
- [ ] T030 Create `docker-compose.yml` for local development
  - Service 1: PostgreSQL 16 with persistent volume for data
  - Service 2: Next.js application (build from Dockerfile or via `pnpm dev`)
  - Environment variables, port mappings, network configuration
  - Database initialization script: `docker/postgres-init.sql`
- [ ] T031 Create `docker/postgres-init.sql`: Database initialization script with default schema and categories
- [ ] T032 Create `.dockerignore` to optimize image size

### Dev Container Configuration

- [ ] T033 Create `.devcontainer/devcontainer.json`: VS Code Dev Container configuration
  - Base image: `mcr.microsoft.com/devcontainers/typescript-node:24`
  - Forwarded ports: 3000 (app), 5432 (database), 5555 (Prisma Studio)
  - Mounts: `.env.local` from local machine, `/workspace` for source
  - Post-create commands: `pnpm install`, `pnpm prisma migrate dev`
  - Extensions: ESLint, Prettier, Tailwind CSS IntelliSense, Thunder Client (REST testing)
- [ ] T034 Create `.devcontainer/Dockerfile` (optional): Custom dev container with pre-installed tools
- [ ] T035 Create `.devcontainer/docker-compose.yml`: Compose file for dev container
  - Services: app container, PostgreSQL, Redis (optional for caching)
  - Environment variables, volumes, networks
- [ ] T036 Create documentation: `docs/DEVCONTAINERS.md` with instructions
  - How to open repo in Dev Container
  - What's pre-configured (Node, pnpm, PostgreSQL, Prisma)
  - Forwarded ports and how to access services
  - Troubleshooting common issues

### Theme & Dark Mode Setup

- [ ] T037 Create `src/components/layout/ThemeProvider.tsx`: Wrapper component using `next-themes`
  - Default theme: "dark"
  - Provide theme context to entire application
  - Automatically persist theme preference to localStorage
- [ ] T038 Create `src/components/layout/ThemeToggle.tsx`: Theme switcher button component
  - Light/dark mode toggle
  - Placed in Header component
  - Smooth transition between themes (CSS transitions)
- [ ] T039 Update Tailwind CSS theme in `tailwind.config.ts`:
  - Define `light` and `dark` color schemes
  - Use CSS custom properties (variables) for dynamic theming
  - Ensure all colors have dark mode counterparts
- [ ] T040 Add theme initialization to `src/app/layout.tsx`:
  - Wrap app with ThemeProvider
  - Set dark mode as default
  - Add no-flash script to prevent theme flicker on page load

---

## Phase 2: Foundational Architecture & Infrastructure

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & ORM

- [ ] T041 Create `prisma/schema.prisma` with User, Article, Category, Tag, Comment entities (from data-model.md)
- [ ] T029 Create Prisma migrations: `prisma/migrations/001_initial/migration.sql` (auto-generated from schema)
- [ ] T030 Create `src/lib/db/client.ts`: Prisma client instantiation with logging in dev mode
- [ ] T031 Create `src/lib/db/seed.ts`: Database seeding script with predefined categories and sample data
- [ ] T032 [P] Create database connection test in `tests/fixtures/`: Verify Prisma connects and schema is valid

### Type Definitions & Shared Utilities

- [ ] T033 Create `src/lib/shared/types.ts`: Core type definitions (Article, User, Category, Tag, Comment interfaces)
- [ ] T034 Create `src/lib/shared/constants.ts`: Application constants (article statuses, category list, pagination limits)
- [ ] T035 Create `src/lib/shared/utils.ts`: Utility functions (slug generation, reading time calculation, date formatting)
- [ ] T036 Create `src/lib/shared/validators.ts`: Common Zod schemas reused across features

### Validation Layer (Zod Schemas)

- [ ] T037 Create `src/services/articles/ArticleValidator.ts`: Zod schemas for Article CRUD operations
- [ ] T038 Create `src/services/search/SearchValidator.ts`: Zod schemas for search queries and filters
- [ ] T039 Create `src/services/comments/CommentValidator.ts`: Zod schemas for comment creation and validation
- [ ] T040 Create `src/services/auth/AuthValidator.ts`: Zod schemas for authentication inputs

### Authentication Infrastructure

- [ ] T041 Create `src/lib/auth/nextAuth.ts`: NextAuth.js v5 configuration with session strategy
- [ ] T042 Create `src/middleware.ts`: Next.js middleware for auth and protected route handling
- [ ] T043 Create `src/app/api/auth/[...nextauth]/route.ts`: NextAuth API route handler

### Error Handling & Logging

- [ ] T044 Create `src/lib/shared/errors.ts`: Custom error classes (ValidationError, NotFoundError, UnauthorizedError)
- [ ] T045 Create `src/lib/shared/logger.ts`: Structured logging utility for dev and production
- [ ] T046 Create `src/app/error.tsx`: Global error boundary for Next.js App Router

### Swagger/OpenAPI Documentation Infrastructure

- [ ] T046a Install Swagger dependencies: `swagger-jsdoc`, `swagger-ui-express` (or `@redoc/cli` for Redoc alternative)
- [ ] T046b Create `src/lib/swagger/config.ts`: Swagger/OpenAPI v3.0 configuration
  - API title: "Personal Blog Platform"
  - Version: "1.0.0"
  - Description: "REST API for publishing and discovering technical articles with full-text search"
  - Base path: "/api"
  - Servers: localhost:3000 (dev), production URL
  - Authentication schemes: Bearer token (NextAuth sessions)
  - Contact info and license
- [ ] T046c Create `src/lib/swagger/schemas.ts`: Reusable OpenAPI schema definitions
  - Article schema: id, slug, title, summary, content, htmlContent, status, publishedAt, readingTimeMinutes
  - Category schema: id, name, slug, description
  - Tag schema: id, name, slug
  - Comment schema: id, content, authorName, authorEmail, createdAt, status
  - User schema: id, email, username, displayName, bio
  - Pagination schema: page, limit, total, totalPages, hasNextPage
  - Error schemas: 400 (BadRequest), 401 (Unauthorized), 403 (Forbidden), 404 (NotFound), 500 (ServerError)
- [ ] T046d Create `src/lib/swagger/paths.ts`: OpenAPI path definitions (endpoints)
  - Define all REST endpoints: GET /articles, POST /articles, GET /articles/{slug}, PUT /articles/{slug}, DELETE /articles/{slug}
  - Search endpoints: GET /search, GET /search/suggestions, GET /search/filters
  - Comments endpoints: GET /articles/{slug}/comments, POST /articles/{slug}/comments
  - Auth endpoints: POST /auth/login, POST /auth/logout
  - Include request/response examples for each endpoint
- [ ] T046e Create `src/app/api/docs/route.ts`: Swagger JSON endpoint
  - GET /api/docs returns OpenAPI 3.0 JSON specification
  - Used by Swagger UI, Postman, and external API tools
  - Include cache headers for production
- [ ] T046f Create `src/app/api-docs/page.tsx`: Swagger UI documentation page
  - Accessible at `/api-docs`
  - Interactive API documentation with Swagger UI v4
  - Try-it-out functionality: test API endpoints directly from UI
  - Display all endpoints, schemas, request/response examples
  - Authentication input for testing protected endpoints
- [ ] T046g Create `src/app/api-docs/redoc/page.tsx`: Redoc alternative documentation (optional)
  - Alternative API documentation view using Redoc
  - Better for mobile, cleaner UI
  - Accessible at `/api-docs/redoc`
- [ ] T046h Create `src/lib/swagger/build.ts`: Script to generate and validate OpenAPI spec
  - Build OpenAPI JSON from config, schemas, paths
  - Validate spec for correctness
  - Export spec file for external tools

### Markdown Processing Pipeline

- [ ] T047 Create `src/lib/markdown/parser.ts`: Markdown to HTML conversion using remark + rehype with sanitization
- [ ] T048 Create `src/lib/markdown/__tests__/parser.test.ts`: TDD tests for markdown parsing (AAA pattern)
  - Test: Convert markdown headers to HTML
  - Test: Sanitize malicious HTML to prevent XSS
  - Test: Handle code blocks with syntax highlighting
  - Test: Strip markdown frontmatter if present

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Publish and Organize Technical Articles (Priority: P1) 🎯 MVP

**Goal**: Enable authors to create, edit, publish, and organize articles by category and tags

**Independent Test**: Can be fully tested by creating an article, publishing it, viewing it on homepage, and filtering by category without needing search or comments

### Tests for User Story 1 (TDD - Write FIRST)

- [ ] T049 [P] [US1] Test: ArticleService.createArticle() in `src/services/articles/__tests__/ArticleService.test.ts`
  - Arrange: Valid article data from Zod schema
  - Act: Call `articleService.createArticle()`
  - Assert: Returns article with ID, slug, created timestamp
- [ ] T050 [P] [US1] Test: ArticleService.publishArticle() in `src/services/articles/__tests__/ArticleService.test.ts`
  - Arrange: Draft article with all required fields
  - Act: Call `articleService.publishArticle()`
  - Assert: Status changes to PUBLISHED, publishedAt is set
- [ ] T051 [P] [US1] Test: ArticleService.getPublishedArticles() in `src/services/articles/__tests__/ArticleService.test.ts`
  - Arrange: Multiple articles (published, draft, archived)
  - Act: Call `getPublishedArticles()`
  - Assert: Returns only PUBLISHED articles, sorted by publishedAt DESC
- [ ] T052 [P] [US1] Test: ArticleRepository.findBySlug() in `src/services/articles/__tests__/ArticleRepository.test.ts`
  - Arrange: Persisted article in database
  - Act: Query by slug
  - Assert: Returns article with all metadata
- [ ] T053 [P] [US1] Test: markdownToHtml() conversion in `src/lib/markdown/__tests__/parser.test.ts`
  - Arrange: Markdown content with headers, bold, code blocks
  - Act: Parse markdown
  - Assert: Returns valid HTML, sanitized against XSS
- [ ] T054 [P] [US1] Test: ArticleForm component in `src/components/articles/__tests__/ArticleForm.test.tsx`
  - Arrange: Render form with category/tag options
  - Act: User fills form and submits
  - Assert: Form validates required fields, calls submit handler
- [ ] T055 [P] [US1] Test: ArticleCard component in `src/components/articles/__tests__/ArticleCard.test.tsx`
  - Arrange: Pass article data to component
  - Act: Render card
  - Assert: Displays title, summary, category, reading time, publish date
- [ ] T056 [US1] Integration test: Article creation flow in `tests/integration/articles.integration.test.ts`
  - Arrange: Authenticated user session, valid article data
  - Act: Call POST /api/articles
  - Assert: Article stored in database, returns 201 with article data

### Data Models for User Story 1

- [ ] T057 [P] [US1] Create User model in Prisma schema (if not already in Phase 2)
- [ ] T058 [P] [US1] Create Article model in Prisma schema with fields: id, slug, title, content, htmlContent, status, publishedAt, authorId, categoryId, readingTimeMinutes, viewCount
- [ ] T059 [P] [US1] Create Category model in Prisma schema
- [ ] T060 [P] [US1] Create Tag model in Prisma schema
- [ ] T061 [P] [US1] Create many-to-many relationship: Article ↔ Tag via `article_tags` junction table
- [ ] T062 [US1] Database migration: Run Prisma migration to create all tables and indexes

### Article Service (Business Logic)

- [ ] T063 [P] [US1] Create `src/services/articles/ArticleService.ts`: Implement core methods
  - `createArticle(data)`: Validate input, generate slug, create record
  - `publishArticle(id)`: Set status=PUBLISHED, set publishedAt
  - `updateArticle(slug, data)`: Update fields, regenerate htmlContent if markdown changed
  - `getArticleBySlug(slug)`: Retrieve published article with category/tags
  - `getPublishedArticles(page, limit, categoryId?)`: List articles with pagination and filtering
  - `archiveArticle(slug)`: Soft delete via status=ARCHIVED
- [ ] T064 [P] [US1] Create `src/services/articles/ArticleRepository.ts`: Data access layer
  - `create(article)`: Insert article
  - `findBySlug(slug)`: Query by slug
  - `findById(id)`: Query by ID
  - `findPublished(filters)`: Query with status=PUBLISHED, category filter, pagination
  - `update(id, data)`: Update article
  - `delete(id)`: Soft delete via archive
  - `incrementViewCount(id)`: Increment view counter

### Article API Routes

- [ ] T065 [US1] Create `src/app/api/articles/route.ts`: REST endpoint with Swagger documentation
  - GET: List published articles with pagination/filtering (from ArticleService)
  - POST: Create new article (requires auth, calls ArticleService)
  - Add OpenAPI JSDoc comments documenting request/response schemas, status codes, examples
  - Register endpoints in Swagger paths configuration
- [ ] T066 [US1] Create `src/app/api/articles/[slug]/route.ts`: Article detail endpoint with Swagger docs
  - GET: Retrieve published article by slug, increment viewCount
  - PUT: Update article (auth required, author only)
  - DELETE: Archive article (auth required, author only)
  - Add OpenAPI JSDoc comments with authentication, parameters, schemas
  - Register endpoints in Swagger paths configuration

### Article UI Components

- [ ] T067 [P] [US1] Create `src/components/articles/ArticleForm.tsx`: Form for creating/editing articles
  - Fields: title, content (textarea), summary, category select, tags input
  - Validation: Zod schemas from ArticleValidator
  - Submit: Calls API route via fetch or React Query
- [ ] T068 [P] [US1] Create `src/components/articles/ArticleCard.tsx`: Card component for article preview
  - Displays: title, summary, category badge, tags, publish date, reading time
  - Styled with shadcn/ui Card component and Tailwind
- [ ] T069 [P] [US1] Create `src/components/articles/ArticleList.tsx`: List component for multiple articles
  - Accepts: articles array, loading state
  - Renders: ArticleCard for each article
  - Pagination: Previous/Next buttons
- [ ] T070 [P] [US1] Create `src/components/articles/ArticleDetail.tsx`: Full article display
  - Shows: Title, content (HTML), metadata (author, date, reading time), category, tags
  - Related articles: Sidebar with related articles (same category)

### Article Pages

- [ ] T071 [US1] Create `src/app/(articles)/page.tsx` (or `src/app/page.tsx`): Homepage
  - Displays: Latest articles using ArticleList component
  - ISR: Revalidate every 60 seconds
- [ ] T072 [US1] Create `src/app/(articles)/[slug]/page.tsx`: Article detail page
  - Route parameter: slug
  - Fetch article from API or database
  - ISR: Revalidate every 1 hour
  - Error handling: 404 if article not found or not published
- [ ] T073 [US1] Create `src/app/(articles)/new/page.tsx`: Create article page
  - Form: ArticleForm component
  - Auth: Redirect to login if not authenticated
  - Behavior: On submit, redirect to article view
- [ ] T074 [US1] Create `src/app/(articles)/edit/[slug]/page.tsx`: Edit article page
  - Load article data for editing
  - Auth: Show 403 if user is not article author
  - Behavior: Pre-fill form, on submit redirect to article view

### Navigation & Layout for US1

- [ ] T075 [P] [US1] Create `src/components/layout/Header.tsx`: Header with logo, nav, auth status
- [ ] T076 [P] [US1] Create `src/components/layout/Navigation.tsx`: Main navigation (Home, Categories, Search, Profile)
- [ ] T077 [P] [US1] Create `src/components/layout/Footer.tsx`: Footer with info and links
- [ ] T078 [US1] Create `src/app/layout.tsx`: Root layout with Header, Navigation, Footer
- [ ] T079 [P] [US1] Create `src/components/articles/CategoryFilter.tsx`: Dropdown/sidebar for filtering by category
- [ ] T080 [P] [US1] Create `src/components/articles/TagFilter.tsx`: Multi-select for filtering by tags

### Authentication Pages for US1

- [ ] T081 [US1] Create `src/app/api/auth/login/route.ts`: Login endpoint (NextAuth)
- [ ] T082 [US1] Create `src/app/api/auth/logout/route.ts`: Logout endpoint
- [ ] T083 [US1] Create `src/app/(auth)/login/page.tsx`: Login form page
- [ ] T084 [US1] Create `src/app/(auth)/profile/page.tsx`: Author profile page (display bio, articles count)

**Checkpoint**: User Story 1 complete - Article publishing works end-to-end. Can be deployed and demonstrated independently.

---

## Phase 4: User Story 2 - Search and Discover Content (Priority: P2)

**Goal**: Enable readers to search articles by keywords and filter by category/tags with relevance ranking

**Independent Test**: Can be fully tested by searching for keywords, filtering by category/date, and verifying results are ranked by relevance without needing publishing or comments

### Tests for User Story 2 (TDD - Write FIRST)

- [ ] T085 [P] [US2] Test: SearchService.searchArticles() in `src/services/search/__tests__/SearchService.test.ts`
  - Arrange: Multiple articles with different titles/content, search query "rust"
  - Act: Call `searchArticles("rust", filters)`
  - Assert: Returns articles matching query, ranked by relevance
- [ ] T086 [P] [US2] Test: SearchService with category filter in `src/services/search/__tests__/SearchService.test.ts`
  - Arrange: Articles in different categories
  - Act: Search with categoryId filter
  - Assert: Only returns articles in specified category
- [ ] T087 [P] [US2] Test: SearchService with date range in `src/services/search/__tests__/SearchService.test.ts`
  - Arrange: Articles from different dates
  - Act: Search with dateFrom/dateTo filters
  - Assert: Returns only articles within date range
- [ ] T088 [P] [US2] Test: SearchService.getSuggestions() in `src/services/search/__tests__/SearchService.test.ts`
  - Arrange: Query prefix "rust"
  - Act: Call `getSuggestions("rust")`
  - Assert: Returns keyword and tag suggestions sorted by frequency
- [ ] T089 [P] [US2] Test: SearchBox component in `src/components/search/__tests__/SearchBox.test.tsx`
  - Arrange: Render search box
  - Act: User types query, suggestions appear
  - Assert: Shows suggestions, on selection redirects to search results
- [ ] T090 [P] [US2] Test: SearchFilters component in `src/components/search/__tests__/SearchFilters.test.tsx`
  - Arrange: Render with category and date range options
  - Act: User selects filters and applies
  - Assert: Calls filter handler with selected values
- [ ] T091 [US2] Integration test: Search flow in `tests/integration/search.integration.test.ts`
  - Arrange: Multiple published articles in database
  - Act: Call GET /api/search?q=keyword&categoryId=xxx
  - Assert: Returns 200 with matching articles ranked

### Search Service (Business Logic)

- [ ] T092 [P] [US2] Create `src/services/search/SearchService.ts`: Implement search methods
  - `searchArticles(query, filters, page, limit)`: Full-text search with category/tag/date filtering
  - `getSuggestions(query)`: Return search suggestions (keywords, tags, articles)
  - `getAvailableFilters()`: Return categories, tags, date range for UI
  - `rankResults(articles, query)`: Rank by relevance (title weight > summary weight > content)
- [ ] T093 [P] [US2] Create `src/services/search/SearchRepository.ts`: Data access for search
  - `findByFullText(query, filters)`: PostgreSQL full-text search using tsvector
  - `findByCategory(categoryId, page, limit)`: Query articles by category
  - `findByTagIds(tagIds, page, limit)`: Query articles by tags (OR logic)
  - `findByDateRange(from, to)`: Filter by publish date

### Search API Routes

- [ ] T094 [US2] Create `src/app/api/search/route.ts`: Search endpoint with Swagger documentation
  - GET: Accept query, categoryId, tagIds, dateFrom, dateTo, sortBy, page, limit
  - Returns: Matching articles with relevance scores, pagination metadata
  - Caching: Cache results for 60 seconds
  - Add OpenAPI JSDoc comments documenting query parameters, response schema, examples
  - Register endpoint in Swagger paths configuration
- [ ] T095 [US2] Create `src/app/api/search/suggestions/route.ts`: Autocomplete endpoint with Swagger docs
  - GET: Accept partial query string
  - Returns: Keyword suggestions, tag suggestions, related articles
  - Caching: Cache for 24 hours
  - Add OpenAPI JSDoc comments with query parameters and response schema

### Search UI Components

- [ ] T096 [P] [US2] Create `src/components/search/SearchBox.tsx`: Search input with autocomplete
  - Input field with debounced query
  - Shows suggestions dropdown on focus/typing
  - Navigate to search results on submit
- [ ] T097 [P] [US2] Create `src/components/search/SearchFilters.tsx`: Filter sidebar/panel
  - Category dropdown (multi-select)
  - Tag multi-select (with search/filter)
  - Date range picker (from/to)
  - Apply/Reset buttons
- [ ] T098 [P] [US2] Create `src/components/search/SearchResults.tsx`: Results display
  - Shows result count and search metadata
  - Renders articles matching query
  - Pagination controls
  - Loading/error states

### Search Pages

- [ ] T099 [US2] Create `src/app/(search)/page.tsx`: Search results page
  - Query params: q, categoryId, tagIds, dateFrom, dateTo, page
  - Fetch results from /api/search
  - Display: SearchFilters + SearchResults side-by-side
  - Dynamic: Re-fetch on filter change

**Checkpoint**: User Story 2 complete - Users can search and discover articles. Homepage now includes search box.

---

## Phase 5: User Story 3 - Share Knowledge and Gather Feedback (Priority: P3)

**Goal**: Enable readers to comment on articles and provide feedback; notify author of new comments

**Independent Test**: Can be fully tested by publishing article, adding comments, viewing comment thread without needing search functionality

### Tests for User Story 3 (TDD - Write FIRST)

- [ ] T100 [P] [US3] Test: CommentService.createComment() in `src/services/comments/__tests__/CommentService.test.ts`
  - Arrange: Article ID, comment text, author name/email
  - Act: Call `createComment()`
  - Assert: Creates comment with APPROVED status, returns comment data
- [ ] T101 [P] [US3] Test: CommentService.getCommentsForArticle() in `src/services/comments/__tests__/CommentService.test.ts`
  - Arrange: Article with multiple comments
  - Act: Call `getCommentsForArticle(articleId)`
  - Assert: Returns comments sorted by createdAt ASC, only APPROVED status
- [ ] T102 [P] [US3] Test: CommentValidator validates email format in `src/services/comments/__tests__/CommentValidator.test.ts`
  - Arrange: Invalid email "notanemail"
  - Act: Validate comment input
  - Assert: Throws validation error
- [ ] T103 [P] [US3] Test: CommentForm component in `src/components/comments/__tests__/CommentForm.test.tsx`
  - Arrange: Render form
  - Act: Fill fields and submit
  - Assert: Validates required fields, calls submit handler with data
- [ ] T104 [P] [US3] Test: CommentList component in `src/components/comments/__tests__/CommentList.test.tsx`
  - Arrange: Pass comments array
  - Act: Render list
  - Assert: Displays all comments with author name, date, content
- [ ] T105 [US3] Integration test: Comment creation flow in `tests/integration/comments.integration.test.ts`
  - Arrange: Published article
  - Act: Call POST /api/articles/[slug]/comments with comment data
  - Assert: Returns 201, comment stored in database, appears in comment list

### Comment Service (Business Logic)

- [ ] T106 [P] [US3] Create `src/services/comments/CommentService.ts`: Implement comment methods
  - `createComment(articleId, data)`: Validate input, create comment with APPROVED status
  - `getCommentsForArticle(articleId, page, limit)`: Fetch approved comments, sorted chronologically
  - `deleteComment(commentId, articleId)`: Soft delete or hard delete (author only)
  - `replyToComment(parentId, data)`: Create nested reply (future feature)
- [ ] T107 [P] [US3] Create `src/services/comments/CommentRepository.ts`: Data access
  - `create(comment)`: Insert comment
  - `findByArticleId(articleId, page, limit)`: Query comments for article
  - `findById(id)`: Retrieve single comment
  - `delete(id)`: Remove comment
  - `updateStatus(id, status)`: Change moderation status

### Comment API Routes

- [ ] T108 [US3] Create `src/app/api/articles/[slug]/comments/route.ts`: Comments endpoint with Swagger docs
  - GET: List approved comments for article with pagination
  - POST: Create new comment (validates input, rate limits)
  - Rate limiting: Max 5 comments per hour per IP
  - Add OpenAPI JSDoc comments documenting request body, response schemas, rate limiting
  - Register endpoint in Swagger paths configuration

### Comment UI Components

- [ ] T109 [P] [US3] Create `src/components/comments/CommentForm.tsx`: Comment submission form
  - Fields: authorName, authorEmail, content (textarea)
  - Validation: Zod schemas
  - Submit: POST to /api/articles/[slug]/comments
  - Success: Show success message, clear form
  - Error: Display validation errors
- [ ] T110 [P] [US3] Create `src/components/comments/CommentList.tsx`: Display comments
  - Shows: Author name, date, comment text
  - Sorted: Chronologically (oldest first)
  - Pagination: Lazy load or paginated display
- [ ] T111 [P] [US3] Create `src/components/comments/CommentThread.tsx`: Threaded comments with replies (future, basic version lists all)

### Comments Section on Article Pages

- [ ] T112 [US3] Add comments section to `src/app/(articles)/[slug]/page.tsx`
  - Display: CommentList component
  - Form: CommentForm component below comments
  - Load comments on page load
- [ ] T113 [US3] Create `src/app/(articles)/[slug]/comments/route.ts` if needed for nested routing

**Checkpoint**: User Story 3 complete - Comments feature fully functional. Article pages now include comment sections.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, optimization, and infrastructure not tied to specific features

### Performance Optimization

- [ ] T114 [P] Configure Next.js Image Optimization in `next.config.ts`
- [ ] T115 [P] Implement ISR (Incremental Static Regeneration) strategies
  - Homepage: Revalidate every 60 seconds
  - Article pages: Revalidate every 1 hour
  - Search results: Dynamic (no static generation)
- [ ] T116 [P] Add response caching headers in API routes (Cache-Control)
- [ ] T117 [P] Optimize bundle: Tree-shaking, code splitting, lazy loading components

### Testing & Coverage

- [ ] T118 [P] Run coverage report: `pnpm test:coverage`
  - Verify minimum 80% coverage across all files
  - Identify uncovered branches and add tests
- [ ] T119 [P] Add E2E tests in `tests/e2e/` using Playwright or Cypress
  - Test: Full user flow: Create article → Publish → Search → Comment
  - Test: Navigate between pages, verify UI rendering
- [ ] T120 [P] Performance testing: Verify SC-005 (homepage <2s), SC-002 (search <1s)

### Documentation

- [ ] T121 [P] Update README.md with project overview, architecture, setup instructions
- [ ] T122 [P] Create ARCHITECTURE.md documenting Clean Architecture + feature-based patterns
- [ ] T123 [P] Create TESTING.md with testing guidelines, running tests, coverage expectations
- [ ] T124 [P] Create API.md with API endpoint documentation (or reference contracts/) and Swagger UI link
- [ ] T124a [P] Validate Swagger/OpenAPI specification: `swagger-cli validate src/lib/swagger/spec.json`
  - Ensure all endpoints are documented
  - Verify request/response schemas are complete
  - Check for broken schema references
  - Validate against OpenAPI 3.0 spec
- [ ] T124b Create API documentation guide: `docs/API_DOCUMENTATION.md`
  - How to access Swagger UI at `/api-docs`
  - How to test endpoints interactively
  - How to add new endpoint documentation (JSDoc format)
  - Best practices for API documentation
  - Examples of well-documented endpoints
- [ ] T124c Add API documentation to CI/CD pipeline
  - Validate OpenAPI spec on every push
  - Generate OpenAPI spec as artifact
  - Alert on breaking changes to API contracts
- [ ] T125 Create DEPLOYMENT.md with deployment instructions for Vercel, environment setup

### Security & Hardening

- [ ] T126 [P] Add rate limiting middleware in `src/lib/auth/rateLimit.ts`
- [ ] T127 [P] Implement input validation at all API boundaries (Zod)
- [ ] T128 [P] Add CSRF protection via NextAuth tokens
- [ ] T129 [P] Add Content Security Policy headers in `next.config.ts`
- [ ] T130 [P] Sanitize user-generated content (markdown/HTML)
- [ ] T131 Review environment variable handling: No secrets in code, all in .env

### Database & Monitoring

- [ ] T132 [P] Add database query logging in dev mode via Prisma
- [ ] T133 [P] Create database backup/restore documentation
- [ ] T134 [P] Add error tracking/logging (optional: Sentry integration)
- [ ] T135 [P] Create monitoring dashboard for Vercel Analytics

### Code Quality & Cleanup

- [ ] T136 [P] Run Biome.js checks: `pnpm lint`
- [ ] T137 [P] Format all code: `pnpm format`
- [ ] T138 [P] TypeScript strict checks: `pnpm type-check`
- [ ] T139 [P] Remove unused imports and exports
- [ ] T140 [P] Add JSDoc comments to public API functions
- [ ] T141 [P] Update .gitignore with all necessary entries

### CI/CD & Deployment

- [ ] T142 Create GitHub Actions workflow: `.github/workflows/test.yml`
  - Run linting, tests, coverage checks on every push
  - Block merge if tests fail or coverage < 80%
- [ ] T143 Create GitHub Actions workflow: `.github/workflows/build.yml`
  - Build Next.js application
  - Verify no build errors
- [ ] T144 Create Vercel deployment configuration
- [ ] T145 Add pre-deployment checklist to DEPLOYMENT.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if team has capacity)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1 or US3
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on US1 or US2

**IMPORTANT**: Each user story is independently deployable. You can deploy US1 alone, then add US2, then US3.

### Within Each User Story

1. Tests (TDD) MUST be written and FAIL before implementation
2. Models before services
3. Services before API routes
4. API routes before components
5. Components before pages
6. Story complete before moving to next priority

---

## Parallel Execution Examples

### Setup Phase (All tasks marked [P] can run in parallel)

```bash
# Can be assigned to different developers simultaneously
Task: T009 - Create directory structure
Task: T010 - Create feature directories
Task: T011 - Create subdirectories
Task: T012 - Create test directories
Task: T013 - Create config directories
Task: T014 - Create tsconfig.json
Task: T015 - Create tailwind.config.ts
Task: T016 - Create vitest.config.ts
Task: T017 - Create biome.json
Task: T018 - Create .commitlintrc.json
```

### Foundational Phase (Setup prerequisite, then parallelize)

```bash
# After Setup completes, these can run in parallel
Task: T028-T032 (Database setup - can run together)
Task: T033-T036 (Type definitions - can run together)
Task: T037-T040 (Validators - can run together, but after T033)
```

### User Story 1 Tests (All tests marked [P] can run in parallel)

```bash
# All these test tasks can be assigned in parallel, then implementation follows
Task: T049 [P] - Test ArticleService.createArticle()
Task: T050 [P] - Test ArticleService.publishArticle()
Task: T051 [P] - Test ArticleService.getPublishedArticles()
Task: T052 [P] - Test ArticleRepository.findBySlug()
Task: T053 [P] - Test markdown parser
Task: T054 [P] - Test ArticleForm component
Task: T055 [P] - Test ArticleCard component
```

### User Story 1 Models (Can run together)

```bash
Task: T057 [P] [US1] - Create User model
Task: T058 [P] [US1] - Create Article model
Task: T059 [P] [US1] - Create Category model
Task: T060 [P] [US1] - Create Tag model
Task: T061 [P] [US1] - Create Tag junction table
```

### User Stories in Parallel (After Foundational completes)

```bash
# Team can split into three groups, each working on a user story in parallel
Developer A: User Story 1 (Publishing)
Developer B: User Story 2 (Search)
Developer C: User Story 3 (Comments)

# After each story is complete:
Story 1 → Deploy as MVP
Story 2 → Deploy incremental update
Story 3 → Deploy final increment
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended for v1.0

1. Complete Phase 1: Setup ✅
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories) ✅
3. Complete Phase 3: User Story 1 (Publishing)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Create article
   - Publish article
   - View on homepage
   - Filter by category
   - Verify all success criteria met
5. Deploy to staging/production

**Timeline**: ~4 weeks (2 devs) for MVP

### Incremental Delivery (Add Stories After MVP)

1. MVP deployed (US1) ✅
2. Add User Story 2 (Search) → Deploy
3. Add User Story 3 (Comments) → Deploy

**Timeline**: +2 weeks for US2, +1 week for US3

### Parallel Team Strategy (All stories simultaneously)

With 3+ developers:

1. **Team A**: Complete Phase 1 + Phase 2 (Shared)
2. **Team B**: User Story 1 (Publishing)
3. **Team C**: User Story 2 (Search)
4. **Team D**: User Story 3 (Comments)
5. **Team E**: Polish & Testing (Phase 6) - can start after US1 baseline
6. **Integration**: Merge stories in order (US1 → US2 → US3)

**Timeline**: ~3-4 weeks total

---

## Notes

- [P] tasks = different files, no dependencies, can assign in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and deployable
- **Verify tests FAIL before implementing** (Red-Green-Refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- TDD is mandatory: No implementation without failing tests first

---

## Task Summary

- **Total Tasks**: 156 (+11 for Swagger/OpenAPI documentation)
- **Phase 1 (Setup)**: 40 tasks (with Docker, themes, Turbopack, React Compiler)
- **Phase 2 (Foundational)**: 27 tasks (includes 8 Swagger/OpenAPI infrastructure tasks)
- **Phase 3 (US1 - Publishing)**: 36 tasks (API routes include Swagger documentation)
- **Phase 4 (US2 - Search)**: 23 tasks (API routes include Swagger documentation)
- **Phase 5 (US3 - Comments)**: 17 tasks (API routes include Swagger documentation)
- **Phase 6 (Polish)**: 26 tasks (includes 3 API documentation validation/CI tasks)

**Estimated Timeline**:

- MVP (US1 only): 4 weeks @ 2 devs
- Full v1.0 (US1+US2+US3): 6-7 weeks @ 2-3 devs
- Expedited (Parallel): 4-5 weeks @ 4-5 devs

**Test Coverage Target**: 80% minimum across all code

---

## Success Metrics

- ✅ User Story 1: Articles can be created, published, viewed, filtered by category
- ✅ User Story 2: Articles can be searched by keywords, filtered by category/tags/date
- ✅ User Story 3: Comments can be added to articles, displayed chronologically
- ✅ Homepage loads <2s (SC-005)
- ✅ Search returns results <1s (SC-002)
- ✅ All articles render correctly without layout issues (SC-003)
- ✅ 80% code coverage
- ✅ All tests passing
- ✅ Linting/formatting clean
- ✅ Deployable to production

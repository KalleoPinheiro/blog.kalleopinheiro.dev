# Phase 1: Data Model & Entities

**Date**: 2026-04-20  
**Status**: Complete  
**Database**: PostgreSQL with Prisma ORM

## Entity Relationships Diagram

```sh
User (Author)
├── Articles (one-to-many)
│   ├── Tags (many-to-many)
│   ├── Category (many-to-one)
│   └── Comments (one-to-many)
│       └── User/Commenter (many-to-one)
└── Comments (one-to-many)
```

## Core Entities

### User (Author)

Represents the blog author or authenticated user.

**Fields**:

- `id` (UUID, primary key)
- `email` (String, unique, indexed)
- `username` (String, unique)
- `displayName` (String)
- `bio` (String, optional)
- `avatarUrl` (String, optional)
- `createdAt` (DateTime, indexed)
- `updatedAt` (DateTime)
- `emailVerified` (DateTime, optional)

**Relationships**:

- One-to-many with Articles (an author writes many articles)
- One-to-many with Comments (an author creates many comments)

**Validation Rules**:

- `email`: Valid email format (RFC 5322)
- `username`: 3-32 characters, alphanumeric + underscore, unique
- `displayName`: 1-100 characters, non-empty
- `bio`: 0-500 characters

**Indexes**:

- `email` (unique, for authentication lookup)
- `username` (unique, for profile URLs)
- `createdAt` (for activity feeds)

**Notes**:

- v1 assumes single author (one User with elevated permissions)
- Future: multi-author support via RBAC without schema changes

---

### Article (Post)

Represents a published, draft, or archived article.

**Fields**:

- `id` (UUID, primary key)
- `slug` (String, unique, indexed)
- `title` (String, indexed, full-text search)
- `summary` (String, 0-300 chars)
- `content` (Text, markdown format)
- `htmlContent` (Text, cached HTML from markdown, nullable)
- `authorId` (UUID, foreign key to User)
- `categoryId` (UUID, foreign key to Category, nullable)
- `status` (Enum: DRAFT, PUBLISHED, ARCHIVED)
- `publishedAt` (DateTime, indexed, nullable)
- `createdAt` (DateTime, indexed)
- `updatedAt` (DateTime)
- `readingTimeMinutes` (Int, computed field)
- `viewCount` (Int, default: 0)

**Relationships**:

- Many-to-one with User (articles belong to one author)
- Many-to-one with Category (articles belong to one category)
- One-to-many with Comment (articles have many comments)
- Many-to-many with Tag (articles have many tags)

**Validation Rules**:

- `title`: 1-200 characters, non-empty
- `slug`: lowercase, alphanumeric + hyphens, unique, auto-generated from title if not provided
- `summary`: 0-300 characters
- `content`: minimum 100 characters, markdown format
- `status`: PUBLISHED articles must have publishedAt set
- `readingTimeMinutes`: calculated from word count (avg 200 words/minute)

**Indexes**:

- `slug` (unique, for URL lookups)
- `authorId` (for author articles listing)
- `categoryId` (for category filtering)
- `publishedAt` (for homepage chronological ordering)
- `createdAt` (for recent articles)
- `status` (for visibility filtering)
- Full-text search index on `title` + `summary` + `content`

**Computed Fields**:

- `readingTimeMinutes`: Math.ceil(wordCount / 200), where wordCount from markdown
- `isPublished`: status === 'PUBLISHED' && publishedAt <= now()

**State Transitions**:

```text
DRAFT → PUBLISHED (requires publishedAt set)
PUBLISHED → ARCHIVED (soft delete preserves URL)
DRAFT → ARCHIVED
No other transitions allowed
```

**Notes**:

- Soft deletion via ARCHIVED status preserves URLs and content history
- `htmlContent` cached from markdown; regenerated only when `content` changes
- `slug` immutable after publication to preserve URLs
- Reading time estimate enhances UX (SC-001 requirement)

---

### Category

Represents a topic grouping for articles.

**Fields**:

- `id` (UUID, primary key)
- `name` (String, unique, indexed)
- `slug` (String, unique, indexed)
- `description` (String, 0-500 chars, optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `articleCount` (Int, computed, default: 0)

**Relationships**:

- One-to-many with Article (a category has many articles)

**Validation Rules**:

- `name`: 1-50 characters, unique
- `slug`: lowercase, alphanumeric + hyphens, unique
- `description`: 0-500 characters

**Indexes**:

- `slug` (unique, for URL lookups)
- `name` (for category selection dropdowns)

**Computed Fields**:

- `articleCount`: COUNT(articles WHERE status='PUBLISHED' AND categoryId=id)

**Predefined Categories** (seeds):

- Systems Architecture
- Artificial Intelligence & Machine Learning
- Web Development
- Backend Engineering
- DevOps & Infrastructure
- Software Design Patterns
- Data Science

---

### Tag

Represents flexible cross-cutting labels for articles.

**Fields**:

- `id` (UUID, primary key)
- `name` (String, unique, indexed)
- `slug` (String, unique, indexed)
- `createdAt` (DateTime)
- `articleCount` (Int, computed, default: 0)

**Relationships**:

- Many-to-many with Article (articles have many tags, tags belong to many articles)

**Validation Rules**:

- `name`: 1-30 characters, unique
- `slug`: lowercase, alphanumeric + hyphens, unique

**Indexes**:

- `slug` (unique, for tag URLs)
- `name` (for tag suggestions and filtering)

**Computed Fields**:

- `articleCount`: COUNT(articles_tags WHERE tagId=id AND article.status='PUBLISHED')

**Dynamic Tags**: Tags are auto-generated from article metadata or user input; no predefined list.

---

### Comment

Represents reader feedback on an article.

**Fields**:

- `id` (UUID, primary key)
- `articleId` (UUID, foreign key to Article, indexed)
- `authorId` (UUID, foreign key to User)
- `authorEmail` (String, indexed, for non-authenticated comments)
- `authorName` (String, for non-authenticated comments)
- `content` (Text, 1-5000 chars)
- `status` (Enum: PENDING, APPROVED, REJECTED, default: APPROVED)
- `createdAt` (DateTime, indexed)
- `updatedAt` (DateTime)
- `parentCommentId` (UUID, foreign key to Comment, nullable, for nested replies)

**Relationships**:

- Many-to-one with Article (comments belong to an article)
- Many-to-one with User (comments authored by users, nullable for guests)
- Self-referential one-to-many (comments can have replies)

**Validation Rules**:

- `content`: 1-5000 characters, non-empty
- `authorName`: 1-100 characters, required if authorId is null
- `authorEmail`: valid email format, required if authorId is null
- `status`: PENDING/APPROVED/REJECTED (v1: auto-approve comments)

**Indexes**:

- `articleId` (for comments listing per article)
- `createdAt` (for chronological ordering)
- `status` (for moderation filtering)
- `authorId` (for user comment history)

**Notes**:

- v1 assumes no authentication for comments (anonymous guests)
- Future: integrate with User for authenticated comments without schema changes
- Manual moderation v1; `status` field supports future automated filtering
- Nested replies supported via `parentCommentId` (future feature)

---

## Validation Schemas (Zod)

### User Schema

```typescript
const UserCreateSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
});

const UserUpdateSchema = UserCreateSchema.partial();
```

### Article Schema

```typescript
const ArticleCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  summary: z.string().max(300).optional(),
  content: z.string().min(100),
  categoryId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

const ArticleUpdateSchema = ArticleCreateSchema.partial().omit({ createdAt: true });

const ArticlePublishSchema = z.object({
  publishedAt: z.date().default(() => new Date()),
});
```

### Search Query Schema

```typescript
const ArticleSearchSchema = z.object({
  query: z.string().min(1).max(200).optional(),
  categoryId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  status: z.enum(['PUBLISHED']).default('PUBLISHED'),
  sortBy: z.enum(['relevance', 'recent', 'popular']).default('relevance'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});
```

### Comment Schema

```typescript
const CommentCreateSchema = z.object({
  content: z.string().min(1).max(5000),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email(),
  parentCommentId: z.string().uuid().optional(),
});
```

---

## Database Constraints & Integrity Rules

**Foreign Key Constraints**:

- Article.authorId → User.id (CASCADE DELETE not allowed; author deletion archives articles)
- Article.categoryId → Category.id (SET NULL allowed; articles can have no category)
- Comment.articleId → Article.id (CASCADE DELETE; comments removed when article deleted)
- Comment.authorId → User.id (SET NULL allowed; comments remain when user deleted)

**Unique Constraints**:

- User.email
- User.username
- Article.slug
- Category.name
- Category.slug
- Tag.name
- Tag.slug

**Not Null Constraints**:

- Article.title, content, authorId, status
- Comment.content, createdAt, articleId
- Category.name, slug
- Tag.name, slug
- User.email, username, displayName

---

## Performance Considerations

**Indexes for Common Queries**:

1. Article list by published date: `(status, publishedAt DESC)`
2. Article detail by slug: `(slug)` unique index
3. Search articles: Full-text index on `(title, summary, content)`
4. Comments per article: `(articleId, createdAt DESC)`
5. User authentication: `(email)` unique index

**Denormalization Strategy**:

- `Article.readingTimeMinutes`: Computed from word count; updated on content change
- `Article.htmlContent`: Cached HTML; regenerated on content change
- `Article.viewCount`: Incremented on page view (optional for v1)
- `Category.articleCount`: Computed on query; cached if performance issues arise
- `Tag.articleCount`: Computed on query; cached if performance issues arise

**Query Optimization**:

- Use database full-text search for article search (avoids N+1 queries)
- Eager-load related entities: articles with categories/tags
- Paginate large result sets (comments, search results)
- Cache ISR homepage and article pages (Next.js handles this)

---

## Migration Strategy

Initial Prisma migration creates all tables and indexes. Future migrations:

1. Add multi-author support (User roles, article co-authorship)
2. Add user comments (User integration with comments)
3. Add article versions (audit trail for edits)
4. Add article reactions (likes, helpful votes)

All future changes maintain backward compatibility via schema extensions.

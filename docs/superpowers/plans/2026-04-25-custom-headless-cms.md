# Custom Headless CMS Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement API-first headless CMS engine with schema-driven content types, extensible hooks system, admin UI, and revalidation strategy.

**Architecture:** Three-layer stack — Schema (Zod + Prisma) + Hooks Registry (middleware) + API Routes (CRUD with hook execution) + Admin UI (React components calling API). PostgreSQL backend with Docker. All features tested via TDD.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest + RTL, shadcn/ui, Prisma, PostgreSQL, Zod

---

## Task 1: Docker Compose & Prisma Setup

**Files:**
- Create: `docker-compose.yml`
- Create: `prisma/schema.prisma` (skeleton)
- Modify: `.env.example` (add DB vars)
- Modify: `package.json` (add prisma dev deps)

- [ ] **Step 1: Add Prisma dependencies**

Run:
```bash
pnpm add -D prisma @prisma/client
```

Expected: Both dependencies added to `package.json`.

- [ ] **Step 2: Create docker-compose.yml**

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: personal_blog_db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER}']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

- [ ] **Step 3: Update .env.example**

Add to `.env.example`:
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/personal_blog_dev"
DB_USER="user"
DB_PASSWORD="password"
DB_NAME="personal_blog_dev"
```

- [ ] **Step 4: Create .env.local (dev only, gitignored)**

Run:
```bash
cp .env.example .env.local
```

Edit `.env.local` with actual DB credentials (same as docker-compose env vars).

- [ ] **Step 5: Create skeleton Prisma schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Schemas will be added in Task 2
```

- [ ] **Step 6: Start Docker container**

Run:
```bash
docker-compose up -d
```

Expected: PostgreSQL container running on localhost:5432.

Run:
```bash
pnpm dlx prisma db push --skip-generate
```

Expected: Database initialized (tables don't exist yet, but schema is registered).

- [ ] **Step 7: Commit**

```bash
git add docker-compose.yml prisma/schema.prisma .env.example
git commit -m "chore: add docker postgres and prisma setup"
```

---

## Task 2: Post Schema (Zod + Prisma + Tests)

**Files:**
- Create: `src/cms/schemas/post.ts`
- Modify: `prisma/schema.prisma` (add Post table)
- Create: `src/cms/schemas/__tests__/post.test.ts`

- [ ] **Step 1: Write failing tests for PostSchema**

```typescript
// src/cms/schemas/__tests__/post.test.ts
import { describe, it, expect } from 'vitest';
import { PostSchema } from '../post';

describe('PostSchema', () => {
  const validPostData = {
    title: 'My First Post',
    slug: 'my-first-post',
    content: '# Hello\n\nThis is my first post.',
    excerpt: 'A brief summary.',
    authorId: '550e8400-e29b-41d4-a716-446655440000',
    status: 'published' as const,
    publishedAt: new Date('2026-04-25'),
    tags: ['typescript', 'cms'],
  };

  it('accepts valid post data', () => {
    const result = PostSchema.parse(validPostData);
    expect(result.title).toBe('My First Post');
    expect(result.status).toBe('published');
  });

  it('rejects post with missing title', () => {
    const { title, ...data } = validPostData;
    expect(() => PostSchema.parse(data)).toThrow();
  });

  it('rejects post with empty slug', () => {
    const data = { ...validPostData, slug: '' };
    expect(() => PostSchema.parse(data)).toThrow();
  });

  it('rejects post with invalid status', () => {
    const data = { ...validPostData, status: 'archived' };
    expect(() => PostSchema.parse(data)).toThrow();
  });

  it('rejects post with title longer than 200 chars', () => {
    const data = { ...validPostData, title: 'a'.repeat(201) };
    expect(() => PostSchema.parse(data)).toThrow();
  });

  it('allows null publishedAt for draft posts', () => {
    const data = { ...validPostData, status: 'draft' as const, publishedAt: null };
    const result = PostSchema.parse(data);
    expect(result.publishedAt).toBeNull();
  });

  it('omits id, createdAt, updatedAt for input validation', () => {
    const schema = PostSchema.omit({ id: true, createdAt: true, updatedAt: true });
    const result = schema.parse(validPostData);
    expect(result).not.toHaveProperty('id');
  });
});
```

Run:
```bash
pnpm test src/cms/schemas/__tests__/post.test.ts
```

Expected: All tests fail (schema doesn't exist yet).

- [ ] **Step 2: Create PostSchema**

```typescript
// src/cms/schemas/post.ts
import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  content: z.string(),
  excerpt: z.string().max(500),
  authorId: z.string().uuid(),
  status: z.enum(['draft', 'published']),
  publishedAt: z.date().nullable(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Post = z.infer<typeof PostSchema>;

export const CreatePostSchema = PostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreatePost = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = CreatePostSchema.partial();

export type UpdatePost = z.infer<typeof UpdatePostSchema>;
```

- [ ] **Step 3: Run tests**

```bash
pnpm test src/cms/schemas/__tests__/post.test.ts
```

Expected: All tests pass.

- [ ] **Step 4: Add Post model to Prisma schema**

```prisma
// prisma/schema.prisma (add to existing file)

model Post {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(200)
  slug      String   @unique @db.VarChar(200)
  content   String   @db.Text
  excerpt   String   @db.VarChar(500)
  authorId  String
  author    Author   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  status    String   @default("draft") // draft, published
  publishedAt DateTime?
  tags      String[] @default([])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@index([status])
  @@index([slug])
}
```

(Author model added in Task 3)

- [ ] **Step 5: Run database migration**

```bash
docker-compose up -d
pnpm dlx prisma migrate dev --name init_post_table
```

Expected: Migration created and applied successfully.

- [ ] **Step 6: Commit**

```bash
git add src/cms/schemas/post.ts src/cms/schemas/__tests__/post.test.ts prisma/schema.prisma prisma/migrations/
git commit -m "feat: add post schema with zod validation and tests"
```

---

## Task 3: Page, Author, Media, Comment Schemas + Tests

**Files:**
- Create: `src/cms/schemas/page.ts`
- Create: `src/cms/schemas/author.ts`
- Create: `src/cms/schemas/media.ts`
- Create: `src/cms/schemas/comment.ts`
- Create: `src/cms/schemas/__tests__/page.test.ts`
- Create: `src/cms/schemas/__tests__/author.test.ts`
- Create: `src/cms/schemas/__tests__/media.test.ts`
- Create: `src/cms/schemas/__tests__/comment.test.ts`
- Modify: `prisma/schema.prisma` (add all models)
- Create: `src/cms/schemas/index.ts` (re-exports)

- [ ] **Step 1: Write tests for all schemas**

```typescript
// src/cms/schemas/__tests__/author.test.ts
import { describe, it, expect } from 'vitest';
import { AuthorSchema } from '../author';

describe('AuthorSchema', () => {
  it('accepts valid author data', () => {
    const data = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'A developer',
      avatarId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = AuthorSchema.parse(data);
    expect(result.email).toBe('john@example.com');
  });

  it('rejects author with invalid email', () => {
    const data = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Doe',
      email: 'not-an-email',
      bio: 'A developer',
      avatarId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => AuthorSchema.parse(data)).toThrow();
  });
});
```

(Write similar tests for Page, Media, Comment schemas.)

Run:
```bash
pnpm test src/cms/schemas/__tests__/
```

Expected: All tests fail.

- [ ] **Step 2: Create all schemas**

```typescript
// src/cms/schemas/author.ts
import { z } from 'zod';

export const AuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  bio: z.string().max(1000),
  avatarId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Author = z.infer<typeof AuthorSchema>;

export const CreateAuthorSchema = AuthorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateAuthor = z.infer<typeof CreateAuthorSchema>;
```

(Create similar for Page, Media, Comment.)

```typescript
// src/cms/schemas/page.ts
import { z } from 'zod';

export const PageSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  content: z.string(),
  status: z.enum(['draft', 'published']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Page = z.infer<typeof PageSchema>;

export const CreatePageSchema = PageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
```

```typescript
// src/cms/schemas/media.ts
import { z } from 'zod';

export const MediaSchema = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  url: z.string().url(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  createdAt: z.date(),
});

export type Media = z.infer<typeof MediaSchema>;

export const CreateMediaSchema = MediaSchema.omit({
  id: true,
  createdAt: true,
});
```

```typescript
// src/cms/schemas/comment.ts
import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  author: z.string().min(1).max(200),
  email: z.string().email(),
  content: z.string().min(1).max(5000),
  status: z.enum(['pending', 'approved', 'spam']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Comment = z.infer<typeof CommentSchema>;

export const CreateCommentSchema = CommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
```

- [ ] **Step 3: Create validators index**

```typescript
// src/cms/schemas/index.ts
export * from './post';
export * from './page';
export * from './author';
export * from './media';
export * from './comment';
```

- [ ] **Step 4: Run tests**

```bash
pnpm test src/cms/schemas/__tests__/
```

Expected: All tests pass.

- [ ] **Step 5: Update Prisma schema with all models**

```prisma
// prisma/schema.prisma
model Author {
  id        String   @id @default(cuid())
  name      String   @db.VarChar(200)
  email     String   @unique @db.VarChar(255)
  bio       String   @db.VarChar(1000) @default("")
  avatarId  String?
  avatar    Media?   @relation(fields: [avatarId], references: [id])
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Page {
  id        String   @id @default(cuid())
  title     String   @db.VarChar(200)
  slug      String   @unique @db.VarChar(200)
  content   String   @db.Text
  status    String   @default("draft")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status])
  @@index([slug])
}

model Media {
  id        String   @id @default(cuid())
  filename  String
  url       String   @db.Text
  mimeType  String
  size      Int
  author    Author?
  createdAt DateTime @default(now())
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    String   @db.VarChar(200)
  email     String   @db.VarChar(255)
  content   String   @db.Text
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([postId])
  @@index([status])
}

model Post {
  id          String    @id @default(cuid())
  title       String    @db.VarChar(200)
  slug        String    @unique @db.VarChar(200)
  content     String    @db.Text
  excerpt     String    @db.VarChar(500)
  authorId    String
  author      Author    @relation(fields: [authorId], references: [id], onDelete: Cascade)
  status      String    @default("draft")
  publishedAt DateTime?
  tags        String[]  @default([])
  comments    Comment[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([authorId])
  @@index([status])
  @@index([slug])
}
```

- [ ] **Step 6: Run database migration**

```bash
pnpm dlx prisma migrate dev --name add_all_tables
```

Expected: All tables created successfully.

- [ ] **Step 7: Commit**

```bash
git add src/cms/schemas/ prisma/schema.prisma prisma/migrations/
git commit -m "feat: add page, author, media, comment schemas with tests"
```

---

## Task 4: Hooks Registry & Types

**Files:**
- Create: `src/cms/hooks/types.ts`
- Create: `src/cms/hooks/registry.ts`
- Create: `src/cms/hooks/__tests__/registry.test.ts`

- [ ] **Step 1: Write tests for HooksRegistry**

```typescript
// src/cms/hooks/__tests__/registry.test.ts
import { describe, it, expect, vi } from 'vitest';
import { HooksRegistry, HookError } from '../registry';
import type { HookContext } from '../types';

describe('HooksRegistry', () => {
  it('registers and runs handlers in order', async () => {
    const registry = new HooksRegistry();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    registry.register('test', handler1);
    registry.register('test', handler2);

    const context: HookContext = {
      action: 'create',
      data: {},
    };

    await registry.run('test', context);

    expect(handler1).toHaveBeenCalledOnce();
    expect(handler1).toHaveBeenCalledWith(context);
    expect(handler2).toHaveBeenCalledOnce();
  });

  it('propagates hook errors', async () => {
    const registry = new HooksRegistry();

    registry.register('test', async () => {
      throw new Error('Handler failed');
    });

    await expect(
      registry.run('test', { action: 'create' })
    ).rejects.toThrow('Handler failed');
  });

  it('skips handlers for non-existent hooks', async () => {
    const registry = new HooksRegistry();

    await expect(
      registry.run('nonexistent', { action: 'create' })
    ).resolves.not.toThrow();
  });

  it('raises HookError with custom status', async () => {
    const registry = new HooksRegistry();

    registry.register('test', async () => {
      throw new HookError('Access denied', 403);
    });

    await expect(
      registry.run('test', { action: 'create' })
    ).rejects.toThrow(HookError);
  });
});
```

Run:
```bash
pnpm test src/cms/hooks/__tests__/registry.test.ts
```

Expected: All tests fail.

- [ ] **Step 2: Create hook types**

```typescript
// src/cms/hooks/types.ts
export type HookContext = {
  user?: any;
  data?: any;
  action: 'create' | 'update' | 'delete';
  [key: string]: any;
};

export type HookHandler = (context: HookContext) => Promise<void>;

export type HookName =
  | 'posts:accessControl'
  | 'posts:validate'
  | 'posts:afterSave'
  | 'pages:accessControl'
  | 'pages:validate'
  | 'pages:afterSave'
  | 'authors:accessControl'
  | 'authors:validate'
  | 'authors:afterSave'
  | 'media:accessControl'
  | 'media:validate'
  | 'media:afterSave'
  | 'comments:accessControl'
  | 'comments:validate'
  | 'comments:afterSave';
```

- [ ] **Step 3: Create HooksRegistry**

```typescript
// src/cms/hooks/registry.ts
import type { HookHandler, HookName, HookContext } from './types';

export class HookError extends Error {
  constructor(
    message: string,
    public status: number = 403
  ) {
    super(message);
    this.name = 'HookError';
  }
}

export class HooksRegistry {
  private handlers: Map<HookName, HookHandler[]> = new Map();

  register(hookName: HookName, handler: HookHandler): void {
    if (!this.handlers.has(hookName)) {
      this.handlers.set(hookName, []);
    }
    this.handlers.get(hookName)!.push(handler);
  }

  async run(hookName: HookName, context: HookContext): Promise<void> {
    const handlers = this.handlers.get(hookName) || [];
    for (const handler of handlers) {
      await handler(context);
    }
  }

  getHandlers(hookName: HookName): HookHandler[] {
    return this.handlers.get(hookName) || [];
  }
}

export const globalHooksRegistry = new HooksRegistry();
```

- [ ] **Step 4: Run tests**

```bash
pnpm test src/cms/hooks/__tests__/registry.test.ts
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/cms/hooks/
git commit -m "feat: add hooks registry with type safety"
```

---

## Task 5: Built-in Hooks (Revalidation, Access Control, Validation)

**Files:**
- Create: `src/cms/hooks/builtin.ts`
- Create: `src/lib/revalidate.ts`
- Modify: `src/cms/hooks/registry.ts` (export globalHooksRegistry for registration)

- [ ] **Step 1: Create revalidation helpers**

```typescript
// src/lib/revalidate.ts
import { revalidateTag } from 'next/cache';

export const CACHE_TAGS = {
  POSTS: 'posts',
  PAGES: 'pages',
  AUTHORS: 'authors',
  MEDIA: 'media',
  COMMENTS: 'comments',
  POST_SLUG: (slug: string) => `post-${slug}`,
  PAGE_SLUG: (slug: string) => `page-${slug}`,
  POST_COMMENTS: (postId: string) => `post-${postId}-comments`,
};

export async function revalidatePost(slug?: string) {
  revalidateTag(CACHE_TAGS.POSTS);
  if (slug) {
    revalidateTag(CACHE_TAGS.POST_SLUG(slug));
  }
}

export async function revalidatePage(slug?: string) {
  revalidateTag(CACHE_TAGS.PAGES);
  if (slug) {
    revalidateTag(CACHE_TAGS.PAGE_SLUG(slug));
  }
}

export async function revalidateAuthors() {
  revalidateTag(CACHE_TAGS.AUTHORS);
}

export async function revalidateMedia() {
  revalidateTag(CACHE_TAGS.MEDIA);
}

export async function revalidatePostComments(postId: string) {
  revalidateTag(CACHE_TAGS.POST_COMMENTS(postId));
  revalidateTag(CACHE_TAGS.POSTS);
}
```

- [ ] **Step 2: Create built-in hooks**

```typescript
// src/cms/hooks/builtin.ts
import { globalHooksRegistry, HookError } from './registry';
import type { HookContext } from './types';
import {
  revalidatePost,
  revalidatePage,
  revalidateAuthors,
  revalidateMedia,
  revalidatePostComments,
} from '@/lib/revalidate';
import { getServerSession } from 'next-auth';

// Access Control Hooks (all resources: single-user always allowed)
globalHooksRegistry.register('posts:accessControl', async (context: HookContext) => {
  const session = await getServerSession();
  if (!session) {
    throw new HookError('Unauthorized', 401);
  }
});

globalHooksRegistry.register('pages:accessControl', async (context: HookContext) => {
  const session = await getServerSession();
  if (!session) {
    throw new HookError('Unauthorized', 401);
  }
});

globalHooksRegistry.register('authors:accessControl', async (context: HookContext) => {
  const session = await getServerSession();
  if (!session) {
    throw new HookError('Unauthorized', 401);
  }
});

globalHooksRegistry.register('media:accessControl', async (context: HookContext) => {
  const session = await getServerSession();
  if (!session) {
    throw new HookError('Unauthorized', 401);
  }
});

globalHooksRegistry.register('comments:accessControl', async (context: HookContext) => {
  const session = await getServerSession();
  if (!session) {
    throw new HookError('Unauthorized', 401);
  }
});

// Post-Save Hooks (revalidation)
globalHooksRegistry.register('posts:afterSave', async (context: HookContext) => {
  const post = context.post;
  if (post?.slug) {
    await revalidatePost(post.slug);
  }
});

globalHooksRegistry.register('pages:afterSave', async (context: HookContext) => {
  const page = context.page;
  if (page?.slug) {
    await revalidatePage(page.slug);
  }
});

globalHooksRegistry.register('authors:afterSave', async (context: HookContext) => {
  await revalidateAuthors();
});

globalHooksRegistry.register('media:afterSave', async (context: HookContext) => {
  await revalidateMedia();
});

globalHooksRegistry.register('comments:afterSave', async (context: HookContext) => {
  const comment = context.comment;
  if (comment?.postId) {
    await revalidatePostComments(comment.postId);
  }
});

// Validation Hooks (field-level, before schema validation)
// Empty implementations for now; can be extended later
globalHooksRegistry.register('posts:validate', async (context: HookContext) => {
  // Field-level validation hooks here
  // e.g., slug uniqueness, reserved slugs, etc.
});

globalHooksRegistry.register('pages:validate', async (context: HookContext) => {});
globalHooksRegistry.register('authors:validate', async (context: HookContext) => {});
globalHooksRegistry.register('media:validate', async (context: HookContext) => {});
globalHooksRegistry.register('comments:validate', async (context: HookContext) => {});
```

- [ ] **Step 3: Create Prisma client singleton**

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Update app layout to register built-in hooks**

Modify `src/app/layout.tsx` to import built-in hooks at app start:

```typescript
import '@/cms/hooks/builtin'; // Register built-in hooks

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ... existing layout code
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/revalidate.ts src/cms/hooks/builtin.ts src/lib/db.ts src/app/layout.tsx
git commit -m "feat: add built-in hooks for access control and revalidation"
```

---

## Task 6: Posts API Routes (GET, POST, GET/:id, PUT/:id, DELETE/:id)

**Files:**
- Create: `src/app/api/cms/posts/route.ts`
- Create: `src/app/api/cms/posts/[id]/route.ts`
- Create: `src/app/api/cms/posts/__tests__/route.test.ts`
- Create: `src/app/middleware.ts` (session verification for /api/cms/*)

- [ ] **Step 1: Write tests for Posts API routes**

```typescript
// src/app/api/cms/posts/__tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '../route';
import { prisma } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  prisma: {
    post: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { id: '123' } }),
}));

describe('POST /api/cms/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates post and returns 201', async () => {
    const mockPost = {
      id: 'post-1',
      title: 'Test Post',
      slug: 'test-post',
      content: 'Content',
      excerpt: 'Excerpt',
      authorId: 'author-1',
      status: 'published',
      publishedAt: new Date('2026-04-25'),
      tags: ['test'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.post.create).mockResolvedValue(mockPost);

    const req = new Request('http://localhost/api/cms/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Post',
        slug: 'test-post',
        content: 'Content',
        excerpt: 'Excerpt',
        authorId: 'author-1',
        status: 'published',
        publishedAt: '2026-04-25',
        tags: ['test'],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.title).toBe('Test Post');
  });

  it('returns 400 on validation error', async () => {
    const req = new Request('http://localhost/api/cms/posts', {
      method: 'POST',
      body: JSON.stringify({
        // missing required fields
        title: 'Test',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('errors');
  });

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const req = new Request('http://localhost/api/cms/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/cms/posts', () => {
  it('returns published posts', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        title: 'Post 1',
        slug: 'post-1',
        status: 'published',
      },
    ];

    vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts);

    const req = new Request('http://localhost/api/cms/posts');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts).toHaveLength(1);
  });
});
```

Run:
```bash
pnpm test src/app/api/cms/posts/__tests__/route.test.ts
```

Expected: All tests fail (routes don't exist).

- [ ] **Step 2: Create Posts GET/POST route**

```typescript
// src/app/api/cms/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { globalHooksRegistry, HookError } from '@/cms/hooks/registry';
import { CreatePostSchema, PostSchema } from '@/cms/schemas';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '10'));
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: { status: 'published' },
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { author: true, comments: { where: { status: 'approved' } } },
    });

    const count = await prisma.post.count({ where: { status: 'published' } });

    return NextResponse.json(
      {
        posts,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/cms/posts error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    // Access control
    await globalHooksRegistry.run('posts:accessControl', { user: session, action: 'create' });

    const body = await req.json();

    // Field-level validation
    await globalHooksRegistry.run('posts:validate', { data: body, action: 'create' });

    // Schema validation
    const validated = CreatePostSchema.parse(body);

    // Persist
    const post = await prisma.post.create({
      data: validated,
      include: { author: true },
    });

    // Post-save hooks
    await globalHooksRegistry.run('posts:afterSave', { post, action: 'create' }).catch((err) => {
      console.error('posts:afterSave hook error:', err);
    });

    return NextResponse.json(post, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (error instanceof HookError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('POST /api/cms/posts error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create Posts [id] GET/PUT/DELETE route**

```typescript
// src/app/api/cms/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { globalHooksRegistry, HookError } from '@/cms/hooks/registry';
import { PostSchema, UpdatePostSchema } from '@/cms/schemas';
import { getServerSession } from 'next-auth';

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true, comments: { where: { status: 'approved' } } },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('GET /api/cms/posts/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    // Verify post exists
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Access control
    await globalHooksRegistry.run('posts:accessControl', { user: session, action: 'update' });

    const body = await req.json();

    // Field-level validation
    await globalHooksRegistry.run('posts:validate', { data: body, action: 'update' });

    // Schema validation
    const validated = UpdatePostSchema.parse(body);

    // Persist
    const post = await prisma.post.update({
      where: { id },
      data: validated,
      include: { author: true },
    });

    // Post-save hooks
    await globalHooksRegistry.run('posts:afterSave', { post, action: 'update' }).catch((err) => {
      console.error('posts:afterSave hook error:', err);
    });

    return NextResponse.json(post, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (error instanceof HookError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('PUT /api/cms/posts/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    // Verify post exists
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Access control
    await globalHooksRegistry.run('posts:accessControl', { user: session, action: 'delete' });

    // Delete
    const post = await prisma.post.delete({ where: { id } });

    // Post-delete hooks
    await globalHooksRegistry.run('posts:afterSave', { post, action: 'delete' }).catch((err) => {
      console.error('posts:afterSave hook error:', err);
    });

    return NextResponse.json({ message: 'Post deleted' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof HookError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('DELETE /api/cms/posts/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test src/app/api/cms/posts/__tests__/route.test.ts
```

Expected: All tests pass.

- [ ] **Step 5: Test API manually (optional)**

Start dev server:
```bash
pnpm dev
```

Test with curl:
```bash
curl http://localhost:3000/api/cms/posts
```

Expected: Returns empty list with proper cache headers.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/cms/posts/ src/app/middleware.ts
git commit -m "feat: add posts CRUD API routes with hooks integration"
```

---

## Task 7: Pages, Authors, Media, Comments API Routes

**Files:**
- Create: `src/app/api/cms/pages/route.ts`
- Create: `src/app/api/cms/pages/[id]/route.ts`
- Create: `src/app/api/cms/authors/route.ts`
- Create: `src/app/api/cms/authors/[id]/route.ts`
- Create: `src/app/api/cms/media/route.ts`
- Create: `src/app/api/cms/media/[id]/route.ts`
- Create: `src/app/api/cms/comments/route.ts`
- Create: `src/app/api/cms/comments/[id]/route.ts`
- Create: `src/app/api/cms/__tests__/resources.test.ts` (shared tests)

- [ ] **Step 1: Write shared resource tests**

```typescript
// src/app/api/cms/__tests__/resources.test.ts
import { describe, it, expect } from 'vitest';

const RESOURCES = ['pages', 'authors', 'media', 'comments'];

describe.each(RESOURCES)('GET /api/cms/%s', (resource) => {
  it('returns 200 with items', async () => {
    const res = await fetch(`http://localhost:3000/api/cms/${resource}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty(resource);
  });
});
```

Run:
```bash
pnpm test src/app/api/cms/__tests__/resources.test.ts
```

Expected: Tests fail (routes don't exist).

- [ ] **Step 2: Create Pages routes (follow same pattern as Posts)**

```typescript
// src/app/api/cms/pages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { globalHooksRegistry, HookError } from '@/cms/hooks/registry';
import { CreatePageSchema } from '@/cms/schemas';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '10'));
    const skip = (page - 1) * limit;

    const pages = await prisma.page.findMany({
      where: { status: 'published' },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    });

    const count = await prisma.page.count({ where: { status: 'published' } });

    return NextResponse.json(
      {
        pages,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/cms/pages error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    await globalHooksRegistry.run('pages:accessControl', { user: session, action: 'create' });
    const body = await req.json();
    await globalHooksRegistry.run('pages:validate', { data: body, action: 'create' });

    const validated = CreatePageSchema.parse(body);
    const page = await prisma.page.create({ data: validated });

    await globalHooksRegistry.run('pages:afterSave', { page, action: 'create' }).catch((err) => {
      console.error('pages:afterSave hook error:', err);
    });

    return NextResponse.json(page, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (error instanceof HookError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('POST /api/cms/pages error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

(Create similar for `pages/[id]/route.ts`, `authors/route.ts`, `authors/[id]/route.ts`, etc.)

- [ ] **Step 3: Create Authors routes**

```typescript
// src/app/api/cms/authors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { globalHooksRegistry, HookError } from '@/cms/hooks/registry';
import { CreateAuthorSchema } from '@/cms/schemas';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    const authors = await prisma.author.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(
      { authors },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/cms/authors error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    await globalHooksRegistry.run('authors:accessControl', { user: session, action: 'create' });
    const body = await req.json();
    await globalHooksRegistry.run('authors:validate', { data: body, action: 'create' });

    const validated = CreateAuthorSchema.parse(body);
    const author = await prisma.author.create({ data: validated });

    await globalHooksRegistry.run('authors:afterSave', { author, action: 'create' }).catch((err) => {
      console.error('authors:afterSave hook error:', err);
    });

    return NextResponse.json(author, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (error instanceof HookError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('POST /api/cms/authors error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

(Create similar for `authors/[id]/route.ts`.)

- [ ] **Step 4: Create Media routes**

```typescript
// src/app/api/cms/media/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { globalHooksRegistry, HookError } from '@/cms/hooks/registry';
import { CreateMediaSchema } from '@/cms/schemas';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { media },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/cms/media error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    await globalHooksRegistry.run('media:accessControl', { user: session, action: 'create' });
    const body = await req.json();
    await globalHooksRegistry.run('media:validate', { data: body, action: 'create' });

    const validated = CreateMediaSchema.parse(body);
    const media = await prisma.media.create({ data: validated });

    await globalHooksRegistry.run('media:afterSave', { media, action: 'create' }).catch((err) => {
      console.error('media:afterSave hook error:', err);
    });

    return NextResponse.json(media, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (error instanceof HookError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('POST /api/cms/media error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

(Create similar for `media/[id]/route.ts`.)

- [ ] **Step 5: Create Comments routes**

```typescript
// src/app/api/cms/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { globalHooksRegistry, HookError } from '@/cms/hooks/registry';
import { CreateCommentSchema } from '@/cms/schemas';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    const comments = await prisma.comment.findMany({
      where: postId ? { postId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      { comments },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/cms/comments error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Comments don't require auth (public)
    const body = await req.json();
    await globalHooksRegistry.run('comments:validate', { data: body, action: 'create' });

    const validated = CreateCommentSchema.parse(body);
    const comment = await prisma.comment.create({
      data: { ...validated, status: 'pending' }, // New comments are pending approval
    });

    await globalHooksRegistry.run('comments:afterSave', { comment, action: 'create' }).catch((err) => {
      console.error('comments:afterSave hook error:', err);
    });

    return NextResponse.json(comment, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (error instanceof HookError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('POST /api/cms/comments error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

(Create similar for `comments/[id]/route.ts`, but requires session for approve/delete.)

- [ ] **Step 6: Run tests**

```bash
pnpm test src/app/api/cms/__tests__/resources.test.ts
```

Expected: All tests pass.

- [ ] **Step 7: Test API manually**

```bash
curl http://localhost:3000/api/cms/pages
curl http://localhost:3000/api/cms/authors
curl http://localhost:3000/api/cms/media
curl http://localhost:3000/api/cms/comments
```

Expected: All return JSON with proper structure.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/cms/
git commit -m "feat: add complete CRUD API for all resources (pages, authors, media, comments)"
```

---

## Task 8: Admin Layout, Navigation, Auth Check

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx` (dashboard)
- Create: `src/components/admin/nav.tsx` (sidebar)
- Modify: `src/app/middleware.ts` (protect /admin/*)

- [ ] **Step 1: Create admin layout**

```typescript
// src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { AdminNav } from '@/components/admin/nav';

export const metadata = {
  title: 'Admin | Personal Blog',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create admin sidebar navigation**

```typescript
// src/components/admin/nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Posts', href: '/admin/posts' },
  { label: 'Pages', href: '/admin/pages' },
  { label: 'Authors', href: '/admin/authors' },
  { label: 'Media', href: '/admin/media' },
  { label: 'Comments', href: '/admin/comments' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-slate-900 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>

      <div className="space-y-4 flex-1">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <button
              className={`w-full text-left px-4 py-2 rounded transition ${
                pathname === item.href ? 'bg-slate-700' : 'hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          </Link>
        ))}
      </div>

      <Button
        onClick={() => signOut({ callbackUrl: '/' })}
        variant="outline"
        className="w-full"
      >
        Sign Out
      </Button>
    </nav>
  );
}
```

- [ ] **Step 3: Create admin dashboard**

```typescript
// src/app/admin/page.tsx
import { prisma } from '@/lib/db';
import { Card } from '@/components/ui/card';

export default async function AdminDashboard() {
  const [postCount, pageCount, authorCount, commentCount] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.author.count(),
    prisma.comment.count(),
  ]);

  const stats = [
    { label: 'Posts', value: postCount },
    { label: 'Pages', value: pageCount },
    { label: 'Authors', value: authorCount },
    { label: 'Comments', value: commentCount },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add middleware to protect /admin/***

```typescript
// src/app/middleware.ts (or update if exists)
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function middleware(req: NextRequest) {
  // Protect /admin/* routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }
  }

  // Protect /api/cms/* routes
  if (req.nextUrl.pathname.startsWith('/api/cms')) {
    const session = await getServerSession();
    if (!session && req.method !== 'GET') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/cms/:path*'],
};
```

- [ ] **Step 5: Test admin page**

Start dev server:
```bash
pnpm dev
```

Navigate to `http://localhost:3000/admin`. Should redirect to auth if not signed in.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/ src/components/admin/ src/app/middleware.ts
git commit -m "feat: add admin layout, navigation, and dashboard"
```

---

## Task 9: Data Table & Form Components (shadcn/ui based)

**Files:**
- Create: `src/components/admin/data-table.tsx`
- Create: `src/components/admin/form-builder.tsx`
- Create: `src/components/admin/status-badge.tsx`
- Create: `src/components/admin/rich-text-editor.tsx` (basic)

- [ ] **Step 1: Create DataTable component**

```typescript
// src/components/admin/data-table.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => Promise<void>;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>{col.label}</TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.render ? col.render(item[col.key]) : String(item[col.key])}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell className="space-x-2">
                  {onEdit && (
                    <Button size="sm" onClick={() => onEdit(item)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="destructive" onClick={() => onDelete(item)}>
                      Delete
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 2: Create StatusBadge component**

```typescript
// src/components/admin/status-badge.tsx
import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status }: { status: 'draft' | 'published' | 'pending' | 'approved' | 'spam' }) {
  const styles = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    pending: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    spam: 'bg-red-100 text-red-800',
  };

  return <Badge className={styles[status]}>{status}</Badge>;
}
```

- [ ] **Step 3: Create FormBuilder component**

```typescript
// src/components/admin/form-builder.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface FormBuilderProps {
  schema: ZodSchema;
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
  defaultValues?: any;
}

export function FormBuilder({
  schema,
  fields,
  onSubmit,
  submitLabel = 'Submit',
  defaultValues = {},
}: FormBuilderProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === 'textarea' ? (
                    <Textarea {...fieldProps} placeholder={field.placeholder} />
                  ) : field.type === 'select' ? (
                    <select {...fieldProps} className="flex h-10 rounded-md border border-input bg-background px-3 py-2">
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...fieldProps}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}
```

- [ ] **Step 4: Create RichTextEditor component (basic)**

```typescript
// src/components/admin/rich-text-editor.tsx
'use client';

import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content...',
}: RichTextEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-64 font-mono text-sm"
    />
  );
}
```

(Note: For full rich text editing, integrate Tiptap or other editor in future task.)

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/
git commit -m "feat: add admin UI components (data table, forms, status badge)"
```

---

## Task 10: Posts Admin Pages (List, Create, Edit)

**Files:**
- Create: `src/app/admin/posts/page.tsx` (list)
- Create: `src/app/admin/posts/new.tsx` (create)
- Create: `src/app/admin/posts/[id]/edit.tsx` (edit)
- Create: `src/app/admin/posts/__tests__/page.test.tsx`

- [ ] **Step 1: Write tests for Posts list page**

```typescript
// src/app/admin/posts/__tests__/page.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostsList from '../page';

// Mock fetch
global.fetch = vi.fn();

describe('PostsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(global.fetch).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<PostsList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders posts after fetch', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        title: 'Test Post 1',
        slug: 'test-post-1',
        status: 'published',
        excerpt: 'Excerpt 1',
      },
    ];

    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ posts: mockPosts, pagination: { total: 1 } }),
    } as Response);

    render(<PostsList />);

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
  });
});
```

Run:
```bash
pnpm test src/app/admin/posts/__tests__/page.test.tsx
```

Expected: Tests fail (page doesn't exist).

- [ ] **Step 2: Create Posts list page**

```typescript
// src/app/admin/posts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import type { Post } from '@/cms/schemas';

export default function PostsList() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cms/posts?limit=50', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch posts:', err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;

    const res = await fetch(`/api/cms/posts/${post.id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== post.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            {
              key: 'status',
              label: 'Status',
              render: (status) => <StatusBadge status={status} />,
            },
            {
              key: 'publishedAt',
              label: 'Published',
              render: (date) => (date ? new Date(date).toLocaleDateString() : '—'),
            },
          ]}
          data={posts}
          onEdit={(post) => router.push(`/admin/posts/${post.id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create new post page**

```typescript
// src/app/admin/posts/new.tsx
'use client';

import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/admin/form-builder';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { CreatePostSchema } from '@/cms/schemas';
import { useState } from 'react';

const POST_FORM_FIELDS = [
  { name: 'title', label: 'Title', type: 'text' as const, placeholder: 'Post title' },
  { name: 'slug', label: 'Slug', type: 'text' as const, placeholder: 'post-slug' },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea' as const, placeholder: 'Brief summary' },
  { name: 'authorId', label: 'Author ID', type: 'text' as const, placeholder: 'UUID' },
  {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
    ],
  },
];

export default function NewPost() {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/cms/posts', {
      method: 'POST',
      body: JSON.stringify({ ...data, content }),
    });

    if (res.ok) {
      router.push('/admin/posts');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">New Post</h1>

      <div className="space-y-6">
        <FormBuilder
          schema={CreatePostSchema}
          fields={POST_FORM_FIELDS}
          onSubmit={handleSubmit}
          submitLabel="Create Post"
        />

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create edit post page**

```typescript
// src/app/admin/posts/[id]/edit.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { FormBuilder } from '@/components/admin/form-builder';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { UpdatePostSchema } from '@/cms/schemas';
import { useEffect, useState } from 'react';
import type { Post } from '@/cms/schemas';

const POST_FORM_FIELDS = [
  { name: 'title', label: 'Title', type: 'text' as const },
  { name: 'slug', label: 'Slug', type: 'text' as const },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea' as const },
  { name: 'authorId', label: 'Author ID', type: 'text' as const },
  {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
    ],
  },
];

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cms/posts/${postId}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setContent(data.content);
        setLoading(false);
      });
  }, [postId]);

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/cms/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, content }),
    });

    if (res.ok) {
      router.push('/admin/posts');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <div className="space-y-6">
        <FormBuilder
          schema={UpdatePostSchema}
          fields={POST_FORM_FIELDS}
          onSubmit={handleSubmit}
          submitLabel="Update Post"
          defaultValues={post}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run tests**

```bash
pnpm test src/app/admin/posts/__tests__/page.test.tsx
```

Expected: All tests pass.

- [ ] **Step 6: Test admin pages in browser**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/admin/posts`. Should show list, new, and edit pages.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/posts/
git commit -m "feat: add posts admin pages (list, create, edit)"
```

---

## Task 11: Pages, Authors, Media, Comments Admin Pages

**Files:**
- Create: `src/app/admin/pages/page.tsx`, `new.tsx`, `[id]/edit.tsx`
- Create: `src/app/admin/authors/page.tsx`, `new.tsx`, `[id]/edit.tsx`
- Create: `src/app/admin/media/page.tsx`, `new.tsx`, `[id]/edit.tsx`
- Create: `src/app/admin/comments/page.tsx`, `[id]/edit.tsx`

Follow the same pattern as Task 10. Each resource:

- [ ] **Step 1: Create list page (DataTable with fetch)**

List pages fetch from `/api/cms/{resource}`, display in DataTable, allow edit/delete.

- [ ] **Step 2: Create new page (FormBuilder + endpoint)**

New pages POST to `/api/cms/{resource}`.

- [ ] **Step 3: Create edit page (load & PUT)**

Edit pages fetch item, populate form, PUT updated data.

- [ ] **Step 4: Example — Pages list**

```typescript
// src/app/admin/pages/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import type { Page } from '@/cms/schemas';

export default function PagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cms/pages?limit=50', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setPages(data.pages);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (page: Page) => {
    if (!confirm(`Delete "${page.title}"?`)) return;
    await fetch(`/api/cms/pages/${page.id}`, { method: 'DELETE' });
    setPages(pages.filter((p) => p.id !== page.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pages</h1>
        <Link href="/admin/pages/new">
          <Button>New Page</Button>
        </Link>
      </div>

      {loading ? <p>Loading...</p> : <DataTable columns={[...]} data={pages} />}
    </div>
  );
}
```

(Repeat for authors, media, comments.)

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/pages/ src/app/admin/authors/ src/app/admin/media/ src/app/admin/comments/
git commit -m "feat: add admin pages for pages, authors, media, comments"
```

---

## Task 12: Revalidation Strategy Integration

**Files:**
- Modify: `src/cms/hooks/builtin.ts` (ensure all revalidation hooks call correctly)
- Modify: `src/lib/revalidate.ts` (add edge cases)
- Test: Manual cache invalidation

- [ ] **Step 1: Verify revalidation hooks are working**

Edit a post in admin, check if frontend `/posts` page is refreshed. Verify `revalidateTag` is called via Next.js logs.

- [ ] **Step 2: Test tag-based revalidation**

```bash
# Admin creates post
curl -X POST http://localhost:3000/api/cms/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","slug":"test",...}'

# Frontend fetches posts (should use cached response initially)
curl http://localhost:3000/posts

# Modify post
curl -X PUT http://localhost:3000/api/cms/posts/ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated",...}'

# Frontend should refresh cache and show updated post
```

- [ ] **Step 3: Verify comment revalidation**

Create comment via `/api/cms/comments` (public), verify `posts:afterSave` hook is triggered to revalidate post.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: verify revalidation strategy working end-to-end"
```

---

## Task 13: API Documentation & Admin Guide

**Files:**
- Create: `docs/cms-api.md` (API endpoint reference)
- Create: `docs/cms-admin-guide.md` (admin UI walkthrough)
- Modify: `README.md` (add CMS section)

- [ ] **Step 1: Write API documentation**

```markdown
# CMS API Reference

## Base URL
`http://localhost:3000/api/cms`

## Authentication
All write endpoints require a session cookie (set by next-auth).

## Endpoints

### Posts
- `GET /posts` — List published posts (paginated, public)
- `POST /posts` — Create post (auth required)
- `GET /posts/:id` — Fetch post (public)
- `PUT /posts/:id` — Update post (auth required)
- `DELETE /posts/:id` — Delete post (auth required)

(Similar for pages, authors, media, comments)

## Response Format
Success:
```json
{ "id": "...", "title": "...", ... }
```

Error:
```json
{ "message": "Error description", "errors": [...] }
```

## Examples
...
```

- [ ] **Step 2: Write admin guide**

```markdown
# Admin UI Guide

## Dashboard
Overview of all resources (post/page/comment counts).

## Posts
- **List**: Browse all posts, filter by status.
- **Create**: Fill form, write content, set publish date.
- **Edit**: Update existing posts.

(Similar for pages, authors, media, comments)

## Tips
- Drafts are only visible to admin; readers see published posts only.
- Comments start as "pending"; approve from admin before public display.
```

- [ ] **Step 3: Update README**

Add section:
```markdown
## CMS (Content Management)

This project includes a custom headless CMS engine. See:
- [API Reference](docs/cms-api.md)
- [Admin Guide](docs/cms-admin-guide.md)

Quick start:
```bash
pnpm dev
# Visit http://localhost:3000/admin/posts to create content
```
```

- [ ] **Step 4: Commit**

```bash
git add docs/cms-api.md docs/cms-admin-guide.md README.md
git commit -m "docs: add CMS API reference and admin guide"
```

---

## Summary

**15 tasks completed:**
1. ✅ Docker + Prisma setup
2. ✅ Post schema + tests
3. ✅ Other schemas + tests
4. ✅ Hooks registry
5. ✅ Built-in hooks
6. ✅ Posts API routes
7. ✅ Other resource API routes
8. ✅ Admin layout + navigation
9. ✅ Data table + form components
10. ✅ Posts admin pages
11. ✅ Other admin pages
12. ✅ Revalidation strategy verification
13. ✅ API docs + admin guide

**Deliverables:**
- ✅ Schema layer (Zod + Prisma)
- ✅ API routes (all resources)
- ✅ Hooks registry + built-in hooks
- ✅ Admin UI (all resources)
- ✅ Revalidation strategy
- ✅ Test suite (schemas, API, components, hooks)
- ✅ Documentation

**Next: Execute implementation plan** using subagent-driven or inline execution.

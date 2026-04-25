# Custom Headless CMS Engine Design

> **Goal:** Replace external Payload CMS integration with internal, API-first headless engine. Single-user admin, PostgreSQL backend, extensible hooks system, frontend-aware caching & revalidation.

---

## Architecture Overview

**Three-layer stack:**

1. **Schema Layer** (`src/cms/schemas/`) — TypeScript definitions for Post, Page, Author, Media, Comment. Each schema: Zod validator + Prisma model + TypeScript type.
2. **API Layer** (`src/app/api/cms/`) — REST routes (`/api/cms/posts`, `/api/cms/pages`, etc.). Request → [hooks.before] → validate → persist → [hooks.after] → response.
3. **Admin UI** (`src/app/admin/`) — React pages calling `/api/cms/*` endpoints. Admin is a decoupled API consumer.

**Hooks System** — Middleware-based plugin architecture. Built-in hooks: `accessControl`, `validate`, `afterSave`. Custom handlers registered at runtime without modifying core API routes.

**Database** — PostgreSQL (Docker + Docker Compose). Prisma ORM for type-safe queries. Tables mirror schemas.

**Caching & Revalidation** — GET `/api/cms/*` returns cache-friendly headers (`public, max-age=300, stale-while-revalidate=86400`). Admin mutations trigger `revalidateTag()` to bust Next.js ISR cache on frontend. Frontend uses `unstable_cache()` with tags for page renders.

---

## Schema Layer

### Content Types

Five fixed schemas (Zod + Prisma):

#### Post
```typescript
{
  id: UUID (primary key)
  title: string (1-200 chars)
  slug: string (unique, URL-safe)
  content: string (rich text / markdown)
  excerpt: string (max 500 chars)
  authorId: UUID (foreign key → Author)
  status: enum ['draft', 'published']
  publishedAt: Date | null
  tags: string[] (array of tag names)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

#### Page
```typescript
{
  id: UUID
  title: string (1-200 chars)
  slug: string (unique)
  content: string (rich text / markdown)
  status: enum ['draft', 'published']
  createdAt: Date
  updatedAt: Date
}
```

#### Author
```typescript
{
  id: UUID
  name: string (1-200 chars)
  email: string (unique)
  bio: string (max 1000 chars)
  avatar: UUID (foreign key → Media, nullable)
  createdAt: Date
  updatedAt: Date
}
```

#### Media
```typescript
{
  id: UUID
  filename: string
  url: string (S3 or file path)
  mimeType: string
  size: number (bytes)
  uploadedAt: Date
  createdAt: Date
}
```

#### Comment
```typescript
{
  id: UUID
  postId: UUID (foreign key → Post)
  author: string (commenter name)
  email: string (for notifications, not public)
  content: string (max 5000 chars)
  status: enum ['pending', 'approved', 'spam']
  createdAt: Date
  updatedAt: Date
}
```

### Validation & Types

- Zod validators (`src/cms/schemas/validators.ts`) define constraints (min/max length, enum values, unique fields).
- TypeScript types auto-derived from Zod: `type Post = z.infer<typeof PostSchema>`.
- Database models in `prisma/schema.prisma` mirror Zod schemas.
- Field-level validation hooks run before persistence (e.g., slug uniqueness, email format).

---

## API Layer

### Routes

REST endpoints under `/src/app/api/cms/`:

```
POST   /api/cms/posts              # Create post
GET    /api/cms/posts              # List posts (paginated, filterable)
GET    /api/cms/posts/[id]         # Fetch single post
PUT    /api/cms/posts/[id]         # Update post
DELETE /api/cms/posts/[id]         # Delete post

(Similar for /pages, /authors, /media, /comments)
```

### Request/Response Flow

**Example: Create Post**

```typescript
// src/app/api/cms/posts/route.ts
export async function POST(req: Request) {
  const hooksRegistry = getHooksRegistry();
  
  try {
    // 1. Parse request body
    const body = await req.json();
    
    // 2. Access control hook (check session, permissions)
    await hooksRegistry.run('posts:accessControl', {
      user: getSession(),
      action: 'create',
    });
    
    // 3. Field-level validation hook
    await hooksRegistry.run('posts:validate', {
      data: body,
      action: 'create',
    });
    
    // 4. Schema validation (Zod)
    const validated = PostSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(body);
    
    // 5. Persist to database
    const post = await db.post.create({
      data: validated,
    });
    
    // 6. Post-save hook (revalidate, webhooks, search index, etc.)
    await hooksRegistry.run('posts:afterSave', {
      post,
      action: 'create',
    });
    
    // 7. Return response (no caching for admin writes)
    return json(post, {
      status: 201,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return json({ errors: error.errors }, { status: 400 });
    }
    if (error instanceof HookError) {
      return json({ message: error.message }, { status: error.status || 403 });
    }
    console.error('POST /api/cms/posts error:', error);
    return json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

**List Posts (GET with pagination & caching)**

```typescript
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const posts = await db.post.findMany({
    where: { status: 'published' }, // Readers see only published
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { publishedAt: 'desc' },
  });
  
  const count = await db.post.count({ where: { status: 'published' } });
  
  return json(
    { posts, pagination: { page, limit, total: count } },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
      },
    }
  );
}
```

### Error Handling

- **400 Bad Request** — Zod validation fails
- **403 Forbidden** — Access control hook rejects (e.g., non-owner, missing session)
- **409 Conflict** — Unique constraint violation (e.g., slug already exists)
- **500 Internal Server Error** — Database or unexpected error

All errors return JSON: `{ message: string, errors?: any[] }`.

---

## Hooks System

### Registry & Execution

**Hooks Registry** (`src/cms/hooks/registry.ts`):

```typescript
export type HookContext = {
  user?: Session;
  data?: any;
  action: 'create' | 'update' | 'delete';
  [key: string]: any;
};

export type HookHandler = (context: HookContext) => Promise<void>;

export class HooksRegistry {
  private handlers: Map<string, HookHandler[]> = new Map();
  
  register(hookName: string, handler: HookHandler) {
    if (!this.handlers.has(hookName)) {
      this.handlers.set(hookName, []);
    }
    this.handlers.get(hookName)!.push(handler);
  }
  
  async run(hookName: string, context: HookContext) {
    const handlers = this.handlers.get(hookName) || [];
    for (const handler of handlers) {
      await handler(context);
    }
  }
}

export const globalHooksRegistry = new HooksRegistry();
```

### Built-in Hooks

**`{resource}:accessControl`**
- Runs before validation. Checks session & permissions.
- Throws `HookError` if unauthorized.
- Single-user: always allows (owner always has access).

**`{resource}:validate`**
- Runs after body parse, before Zod validation.
- Field-level custom validation (e.g., slug uniqueness, email domain whitelist).
- Can modify data in-place or throw `HookError`.

**`{resource}:afterSave`**
- Runs after database insert/update/delete.
- Receives persisted object + action type.
- Triggers revalidation, webhooks, search indexing, etc.
- Errors logged but don't fail the response (fire-and-forget).

### Hook Registration

**Built-in hooks** registered in `src/cms/hooks/builtin.ts`:

```typescript
// Revalidation hook
globalHooksRegistry.register('posts:afterSave', async (context) => {
  revalidateTag('posts');
  if (context.post.status === 'published') {
    revalidateTag(`post-${context.post.slug}`);
  }
});

// Future: custom search indexing, webhooks, etc.
```

**Custom hooks** (user-defined) registered at app startup in `src/app/layout.tsx` or isolated hook file:

```typescript
globalHooksRegistry.register('posts:afterSave', async (context) => {
  await syncToExternalSearchService(context.post);
});
```

---

## Admin UI

### Layout & Structure

```
src/app/admin/
├── layout.tsx              # Shared layout (navbar, sidebar, auth check)
├── page.tsx                # Dashboard (overview, stats)
├── posts/
│   ├── page.tsx            # Posts list (calls GET /api/cms/posts)
│   ├── [id]/
│   │   ├── page.tsx        # Post detail view (read-only)
│   │   └── edit.tsx        # Post editor (calls PUT /api/cms/posts/[id])
│   └── new.tsx             # Create post form (calls POST /api/cms/posts)
├── pages/
│   ├── page.tsx
│   ├── [id]/edit.tsx
│   └── new.tsx
├── authors/
├── media/
└── comments/
```

### Components

**Reusable shadcn/ui-based components:**

- `<DataTable>` — Paginated, sortable table for listing resources.
- `<FormField>` — Wrapper around shadcn/ui Form + Zod validation.
- `<RichTextEditor>` — Tiptap-based editor for `content` fields.
- `<MediaPicker>` — Modal to select/upload media.
- `<DatePicker>` — Shadcn/ui Popover + calendar for dates.
- `<StatusBadge>` — Visual status indicator (Draft, Published, Spam, etc.).

### Example: Posts List

```typescript
// src/app/admin/posts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/cms/posts', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      });
  }, []);
  
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
      ) : (
        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'publishedAt', label: 'Published' },
          ]}
          data={posts}
          onEdit={(post) => window.location.href = `/admin/posts/${post.id}/edit`}
          onDelete={async (post) => {
            await fetch(`/api/cms/posts/${post.id}`, { method: 'DELETE' });
            setPosts(posts.filter((p) => p.id !== post.id));
          }}
        />
      )}
    </div>
  );
}
```

### Example: Post Editor

```typescript
// src/app/admin/posts/[id]/edit.tsx
'use client';

import { useRouter } from 'next/navigation';
import { PostForm } from '@/components/admin/post-form';

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    fetch(`/api/cms/posts/${params.id}`)
      .then((res) => res.json())
      .then(setPost);
  }, [params.id]);
  
  const handleSubmit = async (data) => {
    const res = await fetch(`/api/cms/posts/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (res.ok) {
      router.push('/admin/posts');
    }
  };
  
  return post ? <PostForm post={post} onSubmit={handleSubmit} /> : <p>Loading...</p>;
}
```

### Authentication

- Session middleware checks for `next-auth` session (or custom cookie).
- Protects `/admin/*` routes (redirect to login if no session).
- Admin endpoints (`/api/cms/*`) verify session server-side.
- Single-user: no role checks (owner always has full access).

---

## Data Flow: Create Post

1. User fills form in `/admin/posts/new` (title, content, tags, etc.)
2. Clicks Save → POST to `/api/cms/posts` with JSON body
3. API receives request:
   - Verify session ✅
   - Run `posts:accessControl` hook (allow) ✅
   - Run `posts:validate` hook (check slug uniqueness) ✅
   - Parse & validate with Zod ✅
   - Insert into DB ✅
   - Run `posts:afterSave` hook → `revalidateTag('posts')` ✅
4. Frontend pages subscribed to tag `'posts'` auto-refresh
5. Admin receives post object + 201 status, navigates to edit page

---

## Performance & Caching

### Backend Caching

**GET endpoints** return `Cache-Control: public, max-age=300, stale-while-revalidate=86400`
- Browsers cache for 5 minutes
- Can serve stale copy for up to 1 day while revalidating in background

**Admin mutations** (POST/PUT/DELETE) return `Cache-Control: no-store`
- No caching; always fresh for admin UI

### Frontend Caching

**Content pages** (`/posts`, `/posts/[slug]`, `/pages/[slug]`) use `unstable_cache()` with tags:
```typescript
export const revalidate = 3600; // ISR: revalidate hourly

export default async function PostDetail({ params }) {
  const post = await unstable_cache(
    () => fetch(`http://localhost:3000/api/cms/posts/${params.slug}`),
    ['posts', `post-${params.slug}`],
    { revalidate: 3600, tags: ['posts', `post-${params.slug}`] }
  )();
  
  return <Post data={post} />;
}
```

When admin saves a post, `posts:afterSave` hook calls `revalidateTag('posts')` + `revalidateTag('post-slug')`, which invalidates Next.js cache and re-renders on next request.

---

## Testing Strategy (TDD)

### Schema Tests (Vitest)

```typescript
// src/cms/schemas/__tests__/post.test.ts
import { describe, it, expect } from 'vitest';
import { PostSchema } from '../post';

describe('PostSchema', () => {
  it('accepts valid post data', () => {
    const data = {
      title: 'My Post',
      slug: 'my-post',
      content: '...',
      excerpt: 'Short',
      authorId: '123',
      status: 'published',
      publishedAt: new Date(),
      tags: ['ts'],
    };
    expect(() => PostSchema.parse(data)).not.toThrow();
  });
  
  it('rejects post with missing title', () => {
    const data = { slug: 'test', /* ... */ };
    expect(() => PostSchema.parse(data)).toThrow();
  });
});
```

### API Route Tests (Vitest + Mocked DB)

```typescript
// src/app/api/cms/posts/__tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import * as db from '@/lib/db';

vi.mock('@/lib/db');

describe('POST /api/cms/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('creates post and returns 201', async () => {
    const mockPost = {
      id: '1',
      title: 'Test',
      slug: 'test',
      // ...
    };
    vi.mocked(db.post.create).mockResolvedValue(mockPost);
    
    const req = new Request('http://localhost/api/cms/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', slug: 'test', /* ... */ }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe('1');
  });
  
  it('returns 400 on validation error', async () => {
    const req = new Request('http://localhost/api/cms/posts', {
      method: 'POST',
      body: JSON.stringify({ /* missing required fields */ }),
    });
    
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

### Admin Component Tests (Vitest + RTL)

```typescript
// src/app/admin/posts/__tests__/page.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PostsList from '../page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('PostsList', () => {
  it('renders loading state initially', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    
    render(<PostsList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('renders posts after fetch', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', slug: 'post-1', status: 'published' },
    ];
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ posts: mockPosts }),
      })
    ));
    
    render(<PostsList />);
    
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });
  });
});
```

### Hook Tests (Vitest)

```typescript
// src/cms/hooks/__tests__/registry.test.ts
import { describe, it, expect, vi } from 'vitest';
import { HooksRegistry } from '../registry';

describe('HooksRegistry', () => {
  it('runs registered handlers in order', async () => {
    const registry = new HooksRegistry();
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    
    registry.register('test', handler1);
    registry.register('test', handler2);
    
    await registry.run('test', {});
    
    expect(handler1).toHaveBeenCalledOnce();
    expect(handler2).toHaveBeenCalledOnce();
  });
  
  it('propagates hook errors', async () => {
    const registry = new HooksRegistry();
    registry.register('test', async () => {
      throw new Error('Hook failed');
    });
    
    await expect(registry.run('test', {})).rejects.toThrow('Hook failed');
  });
});
```

---

## Roadmap M2 Update

**Milestone M2: Custom Headless CMS Engine Development**

**Goal:** Build API-first, extensible content management system with schema-driven backend, hooks middleware, and single-user admin UI. Replace external Payload CMS dependency with internal engine.

**Target:** Core API + Admin UI functional for blog posts. Authors, media, comments, pages follow in subsequent tasks.

**Key Principles:**
- API-first design (admin UI is a consumer, not special)
- Plugin architecture (hooks system for extensibility)
- Static-aware (revalidation strategy for Next.js ISR)
- TDD (all features tested before implementation)
- Project standards (shadcn/ui, Conventional Commits, Biome, DRY/YAGNI/KISS)

**Deliverables:**
1. Schema layer (Post, Page, Author, Media, Comment + validators)
2. API routes (CRUD for all resources + error handling)
3. Hooks registry + built-in hooks (accessControl, validate, afterSave)
4. Admin UI (list, create, edit pages for all resources)
5. Revalidation strategy (tag-based + frontend cache invalidation)
6. Test suite (schemas, API routes, components, hooks)
7. Documentation (API endpoints, hook registration, admin guide)
8. Docker Compose config (PostgreSQL setup)

---

## Implementation Notes

- **No placeholders:** Every feature is defined with concrete schema, API behavior, error cases, and tests.
- **Scope:** Fixed content types (no custom fields yet; extensible later via hooks).
- **Single-user:** No complex RBAC; session verification is sufficient.
- **DRY:** Shared components for forms, tables, validation. Hooks avoid code duplication in API routes.
- **YAGNI:** No webhooks, search indexing, media uploads beyond file references. Add when needed.
- **KISS:** Simple hooks model beats complex plugin system; tag-based revalidation beats explicit dependency tracking.

---

## Unanswered Questions / Future Iterations

- **Media storage:** File path references or S3 integration? Start with filesystem references; upgrade to S3 later.
- **Comments moderation:** Workflow for approving comments? Keep simple: admin marks approved/spam manually.
- **Search:** Full-text search on posts/pages? Build hook + integrate Algolia/MeiliSearch when user requests.
- **Webhooks:** Notify external services on publish? Add as hook later; not in M2.
- **API versioning:** Needed now? No. Add when breaking changes required.
- **Rate limiting:** DDoS protection? Add middleware when traffic justifies.

# Articles API Contract

**Endpoint Base**: `/api/articles`  
**Version**: 1.0.0  
**Content-Type**: `application/json`  
**Authentication**: Session-based (NextAuth.js)

## GET /api/articles

List all published articles with pagination and filtering.

**Query Parameters**:
```typescript
{
  page?: number;        // Page number, default: 1, min: 1
  limit?: number;       // Items per page, default: 10, min: 1, max: 50
  categoryId?: string;  // Filter by category UUID
  tagIds?: string[];    // Filter by tag UUIDs (OR logic)
  sortBy?: 'recent' | 'popular' | 'relevance'; // Default: 'recent'
}
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "string",
      "title": "string",
      "summary": "string",
      "publishedAt": "ISO8601",
      "readingTimeMinutes": "number",
      "category": {
        "id": "uuid",
        "name": "string",
        "slug": "string"
      },
      "tags": [
        {
          "id": "uuid",
          "name": "string",
          "slug": "string"
        }
      ],
      "author": {
        "id": "uuid",
        "displayName": "string",
        "avatarUrl": "string|null"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

**Error Responses**:
- 400 Bad Request: Invalid query parameters
- 500 Internal Server Error: Database error

---

## POST /api/articles

Create a new article (authenticated, author only).

**Authentication**: Required (session must be present)

**Request Body**:
```json
{
  "title": "string (1-200 chars)",
  "slug": "string (optional, auto-generated if not provided)",
  "summary": "string (0-300 chars)",
  "content": "string (markdown, min 100 chars)",
  "categoryId": "uuid (optional)",
  "tagIds": ["uuid"],
  "status": "DRAFT | PUBLISHED"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "slug": "string",
  "title": "string",
  "summary": "string",
  "content": "string",
  "htmlContent": "string (cached HTML)",
  "status": "DRAFT | PUBLISHED",
  "publishedAt": "ISO8601|null",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "readingTimeMinutes": "number",
  "author": {
    "id": "uuid",
    "displayName": "string"
  },
  "category": {
    "id": "uuid",
    "name": "string"
  },
  "tags": [
    {
      "id": "uuid",
      "name": "string"
    }
  ]
}
```

**Error Responses**:
- 400 Bad Request: Invalid request body (validation error)
- 401 Unauthorized: Not authenticated
- 403 Forbidden: User is not an author
- 409 Conflict: Slug already exists
- 500 Internal Server Error: Database error

---

## GET /api/articles/:slug

Retrieve a single article by slug.

**Response** (200 OK):
```json
{
  "id": "uuid",
  "slug": "string",
  "title": "string",
  "summary": "string",
  "content": "string (markdown)",
  "htmlContent": "string (cached HTML from markdown)",
  "status": "DRAFT | PUBLISHED | ARCHIVED",
  "publishedAt": "ISO8601|null",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "readingTimeMinutes": "number",
  "viewCount": "number",
  "author": {
    "id": "uuid",
    "displayName": "string",
    "bio": "string|null",
    "avatarUrl": "string|null"
  },
  "category": {
    "id": "uuid",
    "name": "string",
    "slug": "string"
  },
  "tags": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string"
    }
  ]
}
```

**Error Responses**:
- 404 Not Found: Article not found or is DRAFT/ARCHIVED
- 500 Internal Server Error: Database error

**Notes**:
- Increments `viewCount` on successful retrieval
- Only returns PUBLISHED articles to public; authenticated author can see their drafts

---

## PUT /api/articles/:slug

Update an article (authenticated, author only).

**Authentication**: Required

**Request Body**:
```json
{
  "title": "string (optional)",
  "summary": "string (optional)",
  "content": "string (optional)",
  "categoryId": "uuid (optional)",
  "tagIds": ["uuid"] (optional),
  "status": "DRAFT | PUBLISHED | ARCHIVED" (optional)
}
```

**Response** (200 OK): Same as POST response

**Error Responses**:
- 400 Bad Request: Invalid request body or attempt to change immutable slug
- 401 Unauthorized: Not authenticated
- 403 Forbidden: User is not the article author
- 404 Not Found: Article not found
- 500 Internal Server Error: Database error

**Notes**:
- `slug` is immutable after article creation
- Updating `content` regenerates `htmlContent` cache
- `publishedAt` cannot be changed; use status transitions instead

---

## DELETE /api/articles/:slug

Archive an article (soft delete, authenticated author only).

**Authentication**: Required

**Response** (204 No Content)

**Error Responses**:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: User is not the article author
- 404 Not Found: Article not found
- 500 Internal Server Error: Database error

**Notes**:
- Soft delete via status change to ARCHIVED
- URL remains valid; page returns 410 Gone with archive message
- Article can be restored by updating status to PUBLISHED/DRAFT

---

## GET /api/articles/:slug/comments

List comments on an article.

**Query Parameters**:
```typescript
{
  page?: number;      // Default: 1
  limit?: number;     // Default: 10, max: 50
  sortBy?: 'recent' | 'oldest'; // Default: 'oldest' (chronological)
}
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid",
      "content": "string",
      "authorName": "string",
      "authorEmail": "string (partially masked for privacy)",
      "createdAt": "ISO8601",
      "status": "APPROVED | PENDING | REJECTED",
      "replies": [
        {
          "id": "uuid",
          "content": "string",
          "authorName": "string",
          "createdAt": "ISO8601"
        }
      ]
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

**Error Responses**:
- 404 Not Found: Article not found
- 500 Internal Server Error: Database error

---

## POST /api/articles/:slug/comments

Add a comment to an article.

**Request Body**:
```json
{
  "content": "string (1-5000 chars)",
  "authorName": "string (1-100 chars)",
  "authorEmail": "string (valid email)",
  "parentCommentId": "uuid (optional, for nested replies)"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "content": "string",
  "authorName": "string",
  "authorEmail": "string (masked)",
  "createdAt": "ISO8601",
  "status": "APPROVED",
  "parentCommentId": "uuid|null"
}
```

**Error Responses**:
- 400 Bad Request: Invalid request body
- 404 Not Found: Article not found
- 429 Too Many Requests: Rate limit exceeded (max 5 comments per hour per IP)
- 500 Internal Server Error: Database error

**Notes**:
- Comments auto-approved in v1 (status: APPROVED)
- Rate limiting by IP address prevents spam
- Future: author notification on new comment

---

## Response Headers

All responses include:
```
Content-Type: application/json
Cache-Control: max-age=60 (for GET requests)
X-Request-Id: uuid (for tracing)
```

---

## HTTP Status Codes

- **2xx Success**
  - 200 OK: Successful GET/PUT
  - 201 Created: Resource created
  - 204 No Content: Successful DELETE

- **4xx Client Error**
  - 400 Bad Request: Invalid input
  - 401 Unauthorized: Authentication required
  - 403 Forbidden: Insufficient permissions
  - 404 Not Found: Resource not found
  - 409 Conflict: Unique constraint violation

- **5xx Server Error**
  - 500 Internal Server Error: Unexpected server error

---

## Rate Limiting

- **Comments**: 5 per hour per IP
- **Search**: 100 per hour per IP
- **General**: 1000 per hour per IP

Rate limit info returned in response headers:
```
X-RateLimit-Limit: number
X-RateLimit-Remaining: number
X-RateLimit-Reset: ISO8601
```

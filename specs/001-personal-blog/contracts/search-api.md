# Search & Filter API Contract

**Endpoint Base**: `/api/search`  
**Version**: 1.0.0  
**Content-Type**: `application/json`  
**Authentication**: None (public)

## GET /api/search

Full-text search articles with filtering and sorting.

**Query Parameters**:
```typescript
{
  q: string;              // Search query (min 1 char, max 200)
  categoryId?: string;    // Filter by category UUID
  tagIds?: string[];      // Filter by tags (OR logic)
  dateFrom?: ISO8601;     // Filter articles published after date
  dateTo?: ISO8601;       // Filter articles published before date
  sortBy?: 'relevance' | 'recent' | 'popular'; // Default: 'relevance'
  page?: number;          // Page number, default: 1, min: 1
  limit?: number;         // Items per page, default: 10, min: 1, max: 50
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
      "excerpt": "string (first 200 chars of content matching query)",
      "publishedAt": "ISO8601",
      "readingTimeMinutes": "number",
      "matchScore": "number (0-1, relevance score)",
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
        "displayName": "string"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number",
    "hasNextPage": "boolean",
    "hasPreviousPage": "boolean"
  },
  "query": {
    "original": "string (original search query)",
    "filters": {
      "categoryId": "uuid|null",
      "tagIds": ["uuid"],
      "dateRange": {
        "from": "ISO8601|null",
        "to": "ISO8601|null"
      }
    }
  },
  "metadata": {
    "searchDurationMs": "number",
    "resultCount": "number"
  }
}
```

**Error Responses**:
- 400 Bad Request: Invalid query parameters (missing q, invalid date format, etc.)
- 500 Internal Server Error: Search index error

**Examples**:

1. **Simple keyword search**:
   ```
   GET /api/search?q=rust+performance
   ```

2. **Search with category filter**:
   ```
   GET /api/search?q=distributed+systems&categoryId=<systems-arch-id>&sortBy=recent
   ```

3. **Search with date range**:
   ```
   GET /api/search?q=react&dateFrom=2024-01-01&dateTo=2025-12-31&sortBy=popular
   ```

4. **Search with multiple tags**:
   ```
   GET /api/search?q=optimization&tagIds=performance&tagIds=scalability
   ```

---

## GET /api/search/suggestions

Auto-complete suggestions for search queries.

**Query Parameters**:
```typescript
{
  q: string;  // Partial query (min 1 char, max 50)
  limit?: number; // Max suggestions, default: 10, max: 20
}
```

**Response** (200 OK):
```json
{
  "suggestions": [
    {
      "type": "keyword",
      "text": "rust performance optimization",
      "frequency": "number (search count)"
    },
    {
      "type": "tag",
      "text": "rust",
      "count": "number (article count)"
    },
    {
      "type": "category",
      "text": "Systems Architecture",
      "count": "number (article count)"
    },
    {
      "type": "article",
      "text": "Implementing Zero-Copy in Rust",
      "slug": "string"
    }
  ]
}
```

**Error Responses**:
- 400 Bad Request: Invalid parameters
- 500 Internal Server Error: Database error

---

## GET /api/search/filters

Get available filter options (categories, tags).

**Response** (200 OK):
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string",
      "count": "number (articles in category)"
    }
  ],
  "tags": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string",
      "count": "number (articles with tag)"
    }
  ],
  "dateRange": {
    "oldest": "ISO8601 (oldest article)",
    "newest": "ISO8601 (newest article)"
  }
}
```

**Error Responses**:
- 500 Internal Server Error: Database error

**Notes**:
- Static cache; invalidated when new articles published
- Used by search UI to populate filter dropdowns

---

## Relevance Ranking Algorithm

Full-text search ranking considers:

1. **Title Match** (weight: 5x)
   - Exact title match: highest score
   - Title word match: high score
   - Partial title match: medium score

2. **Summary Match** (weight: 2x)
   - Exact match in summary
   - All keywords present in summary

3. **Content Match** (weight: 1x)
   - Keywords found in article content
   - Keyword proximity (closer keywords = higher score)

4. **Recency Boost** (weight: 0.5x)
   - Articles published recently ranked slightly higher
   - Time decay: older articles gradually lower ranked

5. **Popularity Boost** (weight: 0.3x when sortBy=popular)
   - View count increases ranking
   - Comment count increases ranking

**Final Score**: (title_score * 5 + summary_score * 2 + content_score) * recency_boost * popularity_boost

---

## Search Index Maintenance

**Indexed Fields**:
- Article title (English stemming + stopword removal)
- Article summary
- Article content (markdown parsed, HTML stripped)
- Category name
- Tag names

**Index Updates**:
- Triggered on article creation/update/deletion
- Async update (doesn't block API response)
- Maximum 5-second index lag

**Search Optimization**:
- Database full-text search (PostgreSQL tsvector)
- Indexes on `(title, summary, content)` for faster queries
- Pagination to limit results per query
- Query timeout: 5 seconds (returns partial results if exceeded)

---

## Caching Strategy

**Search Results**:
- Cache duration: 60 seconds
- Cache key: hash(query + filters + page + sortBy)
- Invalidation: triggered on new article publication

**Suggestions**:
- Cache duration: 24 hours
- Cache key: query prefix (first 3 characters)
- Invalidation: triggered on article changes

**Filters**:
- Cache duration: 1 hour
- Invalidation: triggered on category/tag changes

---

## Rate Limiting

- **Search queries**: 100 per hour per IP
- **Suggestions**: 1000 per hour per IP
- **Filters**: 1000 per hour per IP

---

## Sorting Options

- **relevance** (default): PostgreSQL full-text search score
- **recent**: publishedAt DESC
- **popular**: viewCount DESC (optional for v1)

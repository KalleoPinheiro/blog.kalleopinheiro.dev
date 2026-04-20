// User types
export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Article types
export type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content: string;
  htmlContent?: string;
  status: ArticleStatus;
  readingTimeMinutes?: number;
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  articles?: Article[];
}

// Tag types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  articles?: Article[];
}

// Comment types
export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Comment {
  id: string;
  content: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
  articleId: string;
  article?: Article;
  authorId?: string;
  author?: User;
  authorName?: string;
  authorEmail?: string;
  parentCommentId?: string;
  parentComment?: Comment;
  replies?: Comment[];
}

// Search types
export interface SearchQuery {
  q: string;
  page?: number;
  limit?: number;
  type?: "article" | "category" | "tag";
}

export interface SearchResult {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

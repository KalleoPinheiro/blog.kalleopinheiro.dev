import { z } from "zod";

// User schemas
export const userCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and hyphens"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(50, "Display name must not exceed 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
});

export const userUpdateSchema = userCreateSchema.partial().omit({ password: true });

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

// Article schemas
export const articleCreateSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  summary: z.string().max(300, "Summary must not exceed 300 characters").optional(),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
});

export const articleUpdateSchema = articleCreateSchema.partial();

export const articlePublishSchema = z.object({
  publishedAt: z.date().optional(),
});

export type ArticleCreate = z.infer<typeof articleCreateSchema>;
export type ArticleUpdate = z.infer<typeof articleUpdateSchema>;
export type ArticlePublish = z.infer<typeof articlePublishSchema>;

// Category schemas
export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  slug: z
    .string()
    .min(1, "Category slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreate = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

// Tag schemas
export const tagCreateSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
  slug: z
    .string()
    .min(1, "Tag slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export const tagUpdateSchema = tagCreateSchema.partial();

export type TagCreate = z.infer<typeof tagCreateSchema>;
export type TagUpdate = z.infer<typeof tagUpdateSchema>;

// Comment schemas
export const commentCreateSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(5000),
  authorId: z.string().optional(),
  authorName: z.string().optional(),
  authorEmail: z.string().email().optional(),
  parentCommentId: z.string().optional(),
});

export const commentUpdateSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(5000),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export type CommentCreate = z.infer<typeof commentCreateSchema>;
export type CommentUpdate = z.infer<typeof commentUpdateSchema>;

// Search schemas
export const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required").max(200),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  type: z.enum(["article", "category", "tag"]).optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// Pagination schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type Pagination = z.infer<typeof paginationSchema>;

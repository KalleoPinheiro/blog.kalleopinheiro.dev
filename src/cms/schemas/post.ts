import { z } from "zod";

// Full Post schema with all fields including id and timestamps
export const PostSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200, "Title must not exceed 200 characters"),
  slug: z.string().min(1).max(200, "Slug must not exceed 200 characters"),
  content: z.string(),
  excerpt: z.string().max(500, "Excerpt must not exceed 500 characters"),
  authorId: z.string(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.date().nullable(),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// CreatePostSchema: omits id, createdAt, updatedAt (for API input)
export const CreatePostSchema = PostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// UpdatePostSchema: all fields optional (for partial updates)
export const UpdatePostSchema = CreatePostSchema.partial();

// Type exports
export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;

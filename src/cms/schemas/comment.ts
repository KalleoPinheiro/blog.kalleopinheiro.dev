import { z } from "zod";

export const CommentSchema = z.object({
  id: z.string().cuid(),
  postId: z.string().cuid(),
  author: z
    .string()
    .min(1)
    .max(200, "Author name must not exceed 200 characters"),
  email: z.string().email("Invalid email format"),
  content: z
    .string()
    .min(1)
    .max(5000, "Content must be between 1 and 5000 characters"),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCommentSchema = CommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCommentSchema = CreateCommentSchema.partial();

export type Comment = z.infer<typeof CommentSchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type UpdateComment = z.infer<typeof UpdateCommentSchema>;

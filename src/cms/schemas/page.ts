import { z } from "zod";

export const PageSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200, "Title must not exceed 200 characters"),
  slug: z.string().min(1).max(200, "Slug must not exceed 200 characters"),
  content: z.string(),
  status: z.enum(["draft", "published"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePageSchema = PageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePageSchema = CreatePageSchema.partial();

export type Page = z.infer<typeof PageSchema>;
export type CreatePage = z.infer<typeof CreatePageSchema>;
export type UpdatePage = z.infer<typeof UpdatePageSchema>;

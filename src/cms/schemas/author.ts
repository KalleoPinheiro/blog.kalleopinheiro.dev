import { z } from "zod";

export const AuthorSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(200, "Name must not exceed 200 characters"),
  email: z.string().email("Invalid email format"),
  bio: z.string().max(1000, "Bio must not exceed 1000 characters").default(""),
  avatarId: z.string().cuid().nullable().default(null),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateAuthorSchema = AuthorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  bio: z.string().max(1000, "Bio must not exceed 1000 characters").optional(),
  avatarId: z.string().cuid().nullable().optional(),
});

export const UpdateAuthorSchema = CreateAuthorSchema.partial();

export type Author = z.infer<typeof AuthorSchema>;
export type CreateAuthor = z.infer<typeof CreateAuthorSchema>;
export type UpdateAuthor = z.infer<typeof UpdateAuthorSchema>;

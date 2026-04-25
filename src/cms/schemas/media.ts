import { z } from "zod";

export const MediaSchema = z.object({
  id: z.string().cuid(),
  filename: z.string().min(1),
  url: z.string().url("Invalid URL format"),
  mimeType: z.string(),
  size: z.number().int().positive("Size must be greater than 0"),
  createdAt: z.date(),
});

export const CreateMediaSchema = MediaSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateMediaSchema = CreateMediaSchema.partial();

export type Media = z.infer<typeof MediaSchema>;
export type CreateMedia = z.infer<typeof CreateMediaSchema>;
export type UpdateMedia = z.infer<typeof UpdateMediaSchema>;

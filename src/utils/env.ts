import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  NEXT_PUBLIC_SITE_URL: z.string(),
  DATABASE_URL: z.string().url(),
  APP_VERSION: z.string().default("dev"),
  ENABLE_API_DOCS: z.string().default("false"),
});

export type Env = z.infer<typeof envSchema>;

export function createEnv(): Env {
  return envSchema.parse(process.env);
}

export const env = createEnv();

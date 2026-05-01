/// <reference types="node" />
import { readFileSync } from "node:fs";
import { defineConfig } from "prisma/config";

try {
  const lines = readFileSync(".env.local", "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1]?.trim();
      const val = match[2]?.trim().replace(/^["']|["']$/g, "");
      if (key && val !== undefined && !(key in process.env)) {
        process.env[key] = val;
      }
    }
  }
} catch {
  // .env.local not present (CI/prod uses real env vars)
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  ...(process.env.DATABASE_URL
    ? {
        datasource: {
          url: process.env.DATABASE_URL,
          ...(process.env.DIRECT_URL
            ? { directUrl: process.env.DIRECT_URL }
            : {}),
        },
      }
    : {}),
});

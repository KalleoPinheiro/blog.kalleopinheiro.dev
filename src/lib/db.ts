import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

let cachedInstance: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (cachedInstance) {
    return cachedInstance;
  }

  if (globalThis.__prisma) {
    cachedInstance = globalThis.__prisma;
    return cachedInstance;
  }

  // @ts-expect-error Prisma 7 requires adapter; using default PostgreSQL adapter
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

  cachedInstance = client;

  if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma = client;
  }

  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getPrismaClient();
    return client[prop as keyof PrismaClient];
  },
});

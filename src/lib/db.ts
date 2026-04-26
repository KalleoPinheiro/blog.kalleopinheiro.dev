import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function initPrisma() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("Prisma initialization skipped: DATABASE_URL not set");
      return null as unknown as PrismaClient;
    }
    const adapter = new PrismaPg({ connectionString });
    return (
      globalForPrisma.prisma ||
      new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
      })
    );
  } catch (error) {
    console.warn("Prisma initialization failed, using stub", error);
    return null as unknown as PrismaClient;
  }
}

const prismaClient = initPrisma();

if (process.env.NODE_ENV !== "production" && prismaClient) {
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;

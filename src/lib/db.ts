import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function initPrisma() {
  try {
    return (
      globalForPrisma.prisma ||
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
      })
    );
  } catch (error) {
    // Return a stub during build when database URL is not available
    console.warn("Prisma initialization failed, using stub", error);
    return null as unknown as PrismaClient;
  }
}

const prismaClient = initPrisma();

if (process.env.NODE_ENV !== "production" && prismaClient) {
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

class MockPrismaClient {
  $connect = vi.fn();
  $disconnect = vi.fn();
}

vi.mock("@/generated/prisma/client", () => ({
  PrismaClient: MockPrismaClient,
}));

describe("db singleton", () => {
  beforeEach(() => {
    const global = globalThis as Record<string, unknown>;
    delete global.__prisma;
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("exports prisma instance", async () => {
    const { prisma: sut } = await import("@/lib/db");
    expect(sut).toBeDefined();
    expect(sut).toHaveProperty("$connect");
    expect(sut).toHaveProperty("$disconnect");
  });

  it("caches instance in non-production", async () => {
    const { prisma: instance1 } = await import("@/lib/db");
    const global = globalThis as Record<string, unknown>;
    expect(global.__prisma).toBe(instance1);
  });

  it("creates new instance without global cache", async () => {
    const { prisma } = await import("@/lib/db");
    expect(prisma).toBeDefined();
  });
});

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

  it("exports prisma proxy", async () => {
    const { prisma: sut } = await import("@/lib/db");
    expect(sut).toBeDefined();
    // Trigger lazy init by accessing a property
    expect(typeof sut.$connect).toBe("function");
    expect(typeof sut.$disconnect).toBe("function");
  });

  it("lazily initializes client on first access", async () => {
    const { prisma } = await import("@/lib/db");
    const global = globalThis as Record<string, unknown>;
    expect(global.__prisma).toBeUndefined();

    // Access a property to trigger lazy init
    void prisma.$connect;

    expect(global.__prisma).toBeDefined();
  });

  it("reuses cached instance", async () => {
    const { prisma } = await import("@/lib/db");
    void prisma.$connect;
    const client1 = (globalThis as Record<string, unknown>).__prisma;

    void prisma.$disconnect;
    const client2 = (globalThis as Record<string, unknown>).__prisma;

    expect(client1).toBe(client2);
  });
});

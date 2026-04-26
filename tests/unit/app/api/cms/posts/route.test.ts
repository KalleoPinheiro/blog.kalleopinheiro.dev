import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/cms/posts/route";

vi.mock("@/lib/db", () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";

describe("GET /api/cms/posts", () => {
  it("returns 200 with posts", async () => {
    const mockFindMany = vi.mocked(prisma.post.findMany);
    const mockCount = vi.mocked(prisma.post.count);
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const req = new Request("http://localhost/api/cms/posts");
    const sut = await GET(req as unknown as NextRequest);

    expect(sut.status).toBe(200);
  });

  it("handles database errors", async () => {
    const mockFindMany = vi.mocked(prisma.post.findMany);
    mockFindMany.mockRejectedValue(new Error("DB error"));

    const req = new Request("http://localhost/api/cms/posts");
    const sut = await GET(req as unknown as NextRequest);

    expect(sut.status).toBe(500);
  });
});

describe("POST /api/cms/posts", () => {
  it("returns 400 on validation error", async () => {
    const req = new Request("http://localhost/api/cms/posts", {
      method: "POST",
      body: JSON.stringify({ title: "a".repeat(201) }),
    });
    const sut = await POST(req as unknown as NextRequest);

    expect(sut.status).toBe(400);
  });
});

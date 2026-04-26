import { type NextRequest } from "next/server";
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

const mockPost = {
  id: "cljp1234567890abcdef12345",
  title: "Test Post",
  slug: "test-post",
  content: "Test content",
  excerpt: "Test excerpt",
  authorId: "author-id",
  status: "published" as const,
  publishedAt: new Date("2024-01-01"),
  tags: ["test"],
  createdAt: new Date(),
  updatedAt: new Date(),
  author: { id: "author-id", name: "Test Author" },
};

describe("GET /api/cms/posts", () => {
  it("returns posts with pagination", async () => {
    const mockFindMany = vi.mocked(prisma.post.findMany);
    const mockCount = vi.mocked(prisma.post.count);
    mockFindMany.mockResolvedValue([mockPost]);
    mockCount.mockResolvedValue(1);

    const req = new Request("http://localhost/api/cms/posts?page=1&limit=10");
    const sut = await GET(req as unknown as NextRequest);

    expect(mockFindMany).toHaveBeenCalledWith({
      include: { author: true },
      skip: 0,
      take: 10,
      orderBy: { createdAt: "desc" },
    });
    expect(sut.status).toBe(200);
    const body = await sut.json();
    expect(body.posts).toEqual([mockPost]);
    expect(body.total).toBe(1);
  });

  it("uses default pagination when params missing", async () => {
    const mockFindMany = vi.mocked(prisma.post.findMany);
    const mockCount = vi.mocked(prisma.post.count);
    mockFindMany.mockResolvedValue([mockPost]);
    mockCount.mockResolvedValue(1);

    const req = new Request("http://localhost/api/cms/posts");
    const sut = await GET(req as unknown as NextRequest);

    expect(mockFindMany).toHaveBeenCalledWith({
      include: { author: true },
      skip: 0,
      take: 10,
      orderBy: { createdAt: "desc" },
    });
    expect(sut.status).toBe(200);
  });

  it("returns 500 on database error", async () => {
    const mockFindMany = vi.mocked(prisma.post.findMany);
    mockFindMany.mockRejectedValue(new Error("DB error"));

    const req = new Request("http://localhost/api/cms/posts");
    const sut = await GET(req as unknown as NextRequest);

    expect(sut.status).toBe(500);
    const body = await sut.json();
    expect(body.error).toBe("Failed to fetch posts");
  });
});

describe("POST /api/cms/posts", () => {
  it("creates post with valid payload", async () => {
    const mockCreate = vi.mocked(prisma.post.create);
    mockCreate.mockResolvedValue(mockPost);

    const payload = {
      title: "Test Post",
      slug: "test-post",
      content: "Test content",
      excerpt: "Test excerpt",
      authorId: "author-id",
      status: "published" as const,
      publishedAt: "2024-01-01",
      tags: ["test"],
    };

    const req = new Request("http://localhost/api/cms/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const sut = await POST(req as unknown as NextRequest);

    expect(sut.status).toBe(201);
    const body = await sut.json();
    expect(body.id).toBe(mockPost.id);
  });

  it("returns 400 on validation error", async () => {
    const req = new Request("http://localhost/api/cms/posts", {
      method: "POST",
      body: JSON.stringify({ title: "a".repeat(201) }),
    });
    const sut = await POST(req as unknown as NextRequest);

    expect(sut.status).toBe(400);
    const body = await sut.json();
    expect(body.error).toBe("Validation error");
    expect(body.details).toBeDefined();
  });

  it("returns 500 on database error", async () => {
    const mockCreate = vi.mocked(prisma.post.create);
    mockCreate.mockRejectedValue(new Error("DB error"));

    const payload = {
      title: "Test Post",
      slug: "test-post",
      content: "Test content",
      excerpt: "Test excerpt",
      authorId: "author-id",
      status: "published" as const,
      publishedAt: "2024-01-01",
      tags: ["test"],
    };

    const req = new Request("http://localhost/api/cms/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const sut = await POST(req as unknown as NextRequest);

    expect(sut.status).toBe(500);
    const body = await sut.json();
    expect(body.error).toBe("Failed to create post");
  });
});

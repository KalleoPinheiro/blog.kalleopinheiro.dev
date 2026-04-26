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

const mockPost = {
  id: "cltest00000000000000000000",
  title: "Test Post",
  slug: "test-post",
  content: "Content",
  excerpt: "Excerpt",
  authorId: "clauthor0000000000000000000",
  status: "draft",
  publishedAt: null,
  tags: [],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  author: { id: "clauthor0000000000000000000", name: "Author" },
};

describe("GET /api/cms/posts", () => {
  it("returns 200 with posts", async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValue([]);
    vi.mocked(prisma.post.count).mockResolvedValue(0);

    const req = new Request("http://localhost/api/cms/posts");
    const sut = await GET(req as unknown as NextRequest);

    expect(sut.status).toBe(200);
  });

  it("returns paginated response with correct skip/take", async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValue([]);
    vi.mocked(prisma.post.count).mockResolvedValue(0);

    const req = new Request("http://localhost/api/cms/posts?page=2&limit=5");
    const sut = await GET(req as unknown as NextRequest);

    expect(sut.status).toBe(200);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 }),
    );
  });

  it("returns 500 on database error", async () => {
    vi.mocked(prisma.post.findMany).mockRejectedValue(new Error("DB error"));

    const req = new Request("http://localhost/api/cms/posts");
    const sut = await GET(req as unknown as NextRequest);

    expect(sut.status).toBe(500);
  });
});

describe("POST /api/cms/posts", () => {
  it("returns 201 with created post", async () => {
    vi.mocked(prisma.post.create).mockResolvedValue(mockPost as never);

    const req = new Request("http://localhost/api/cms/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Post",
        slug: "test-post",
        content: "Content",
        excerpt: "Excerpt",
        authorId: "clauthor0000000000000000000",
        status: "draft",
        publishedAt: null,
        tags: [],
      }),
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
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(prisma.post.create).mockRejectedValue(new Error("DB error"));

    const req = new Request("http://localhost/api/cms/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Post",
        slug: "test-post",
        content: "Content",
        excerpt: "Excerpt",
        authorId: "clauthor0000000000000000000",
        status: "draft",
        publishedAt: null,
        tags: [],
      }),
    });
    const sut = await POST(req as unknown as NextRequest);

    expect(sut.status).toBe(500);
  });
});

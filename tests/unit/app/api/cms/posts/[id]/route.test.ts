import { type NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { DELETE, GET, PUT } from "@/app/api/cms/posts/[id]/route";

vi.mock("@/lib/db", () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

const mockParams = {
  params: Promise.resolve({ id: "cljp1234567890abcdef12345" }),
};

describe("GET /api/cms/posts/[id]", () => {
  it("returns post by id", async () => {
    const mockFindUnique = vi.mocked(prisma.post.findUnique);
    mockFindUnique.mockResolvedValue(mockPost);

    const req = new Request("http://localhost/api/cms/posts/123");
    const sut = await GET(
      req as unknown as NextRequest,
      mockParams as unknown as { params: Promise<{ id: string }> },
    );

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "cljp1234567890abcdef12345" },
      include: { author: true },
    });
    expect(sut.status).toBe(200);
    const body = await sut.json();
    expect(body.id).toBe(mockPost.id);
  });

  it("returns 404 when post not found", async () => {
    const mockFindUnique = vi.mocked(prisma.post.findUnique);
    mockFindUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/cms/posts/123");
    const sut = await GET(
      req as unknown as NextRequest,
      mockParams as unknown as { params: Promise<{ id: string }> },
    );

    expect(sut.status).toBe(404);
    const body = await sut.json();
    expect(body.error).toBe("Post not found");
  });

  it("returns 500 on database error", async () => {
    const mockFindUnique = vi.mocked(prisma.post.findUnique);
    mockFindUnique.mockRejectedValue(new Error("DB error"));

    const req = new Request("http://localhost/api/cms/posts/123");
    const sut = await GET(
      req as unknown as NextRequest,
      mockParams as unknown as { params: Promise<{ id: string }> },
    );

    expect(sut.status).toBe(500);
    const body = await sut.json();
    expect(body.error).toBe("Failed to fetch post");
  });
});

describe("PUT /api/cms/posts/[id]", () => {
  it("updates post with valid payload", async () => {
    const mockUpdate = vi.mocked(prisma.post.update);
    mockUpdate.mockResolvedValue(mockPost);

    const payload = { title: "Updated Title" };
    const req = new Request("http://localhost/api/cms/posts/123", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const sut = await PUT(
      req as unknown as NextRequest,
      mockParams as unknown as { params: Promise<{ id: string }> },
    );

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "cljp1234567890abcdef12345" },
        include: { author: true },
      }),
    );
    expect(sut.status).toBe(200);
    const body = await sut.json();
    expect(body.id).toBe(mockPost.id);
  });

  it("returns 400 on validation error", async () => {
    const req = new Request("http://localhost/api/cms/posts/123", {
      method: "PUT",
      body: JSON.stringify({ title: "a".repeat(201) }),
    });
    const sut = await PUT(
      req as unknown as NextRequest,
      mockParams as unknown as { params: Promise<{ id: string }> },
    );

    expect(sut.status).toBe(400);
    const body = await sut.json();
    expect(body.error).toBe("Validation error");
  });

  it("returns 500 on database error", async () => {
    const mockUpdate = vi.mocked(prisma.post.update);
    mockUpdate.mockRejectedValue(new Error("DB error"));

    const req = new Request("http://localhost/api/cms/posts/123", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated" }),
    });
    const sut = await PUT(
      req as unknown as NextRequest,
      mockParams as unknown as { params: Promise<{ id: string }> },
    );

    expect(sut.status).toBe(500);
    const body = await sut.json();
    expect(body.error).toBe("Failed to update post");
  });
});

describe("DELETE /api/cms/posts/[id]", () => {
  it("deletes post by id", async () => {
    const mockDelete = vi.mocked(prisma.post.delete);
    mockDelete.mockResolvedValue(mockPost);

    const req = new Request("http://localhost/api/cms/posts/123", {
      method: "DELETE",
    });
    const sut = await DELETE(
      req as unknown as NextRequest,
      mockParams as unknown as { params: Promise<{ id: string }> },
    );

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "cljp1234567890abcdef12345" },
    });
    expect(sut.status).toBe(204);
  });

  it("returns 500 on database error", async () => {
    const mockDelete = vi.mocked(prisma.post.delete);
    mockDelete.mockRejectedValue(new Error("DB error"));

    const req = new Request("http://localhost/api/cms/posts/123", {
      method: "DELETE",
    });
    const sut = await DELETE(
      req as unknown as NextRequest,
      mockParams as unknown as { params: Promise<{ id: string }> },
    );

    expect(sut.status).toBe(500);
    const body = await sut.json();
    expect(body.error).toBe("Failed to delete post");
  });
});

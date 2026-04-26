import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { DELETE, GET, PUT } from "@/app/api/cms/posts/[id]/route";
import { Prisma } from "@/generated/prisma/client";

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

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

function makeP2025(): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError("Record not found", {
    code: "P2025",
    clientVersion: "5.0.0",
  });
}

describe("GET /api/cms/posts/[id]", () => {
  it("returns 200 with post", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as never);

    const req = new Request(
      "http://localhost/api/cms/posts/cltest00000000000000000000",
    );
    const sut = await GET(
      req as unknown as NextRequest,
      makeParams("cltest00000000000000000000"),
    );

    expect(sut.status).toBe(200);
    const body = await sut.json();
    expect(body.id).toBe(mockPost.id);
  });

  it("returns 404 when post not found", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(null);

    const req = new Request("http://localhost/api/cms/posts/nonexistent");
    const sut = await GET(
      req as unknown as NextRequest,
      makeParams("nonexistent"),
    );

    expect(sut.status).toBe(404);
  });

  it("returns 500 on database error", async () => {
    vi.mocked(prisma.post.findUnique).mockRejectedValue(new Error("DB error"));

    const req = new Request(
      "http://localhost/api/cms/posts/cltest00000000000000000000",
    );
    const sut = await GET(
      req as unknown as NextRequest,
      makeParams("cltest00000000000000000000"),
    );

    expect(sut.status).toBe(500);
  });
});

describe("PUT /api/cms/posts/[id]", () => {
  it("returns 200 with updated post", async () => {
    vi.mocked(prisma.post.update).mockResolvedValue(mockPost as never);

    const req = new Request(
      "http://localhost/api/cms/posts/cltest00000000000000000000",
      {
        method: "PUT",
        body: JSON.stringify({ title: "Updated Title" }),
      },
    );
    const sut = await PUT(
      req as unknown as NextRequest,
      makeParams("cltest00000000000000000000"),
    );

    expect(sut.status).toBe(200);
    const body = await sut.json();
    expect(body.id).toBe(mockPost.id);
  });

  it("returns 400 on validation error", async () => {
    const req = new Request(
      "http://localhost/api/cms/posts/cltest00000000000000000000",
      {
        method: "PUT",
        body: JSON.stringify({ title: "a".repeat(201) }),
      },
    );
    const sut = await PUT(
      req as unknown as NextRequest,
      makeParams("cltest00000000000000000000"),
    );

    expect(sut.status).toBe(400);
  });

  it("returns 404 when post not found (P2025)", async () => {
    vi.mocked(prisma.post.update).mockRejectedValue(makeP2025());

    const req = new Request("http://localhost/api/cms/posts/nonexistent", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated" }),
    });
    const sut = await PUT(
      req as unknown as NextRequest,
      makeParams("nonexistent"),
    );

    expect(sut.status).toBe(404);
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(prisma.post.update).mockRejectedValue(new Error("DB error"));

    const req = new Request(
      "http://localhost/api/cms/posts/cltest00000000000000000000",
      {
        method: "PUT",
        body: JSON.stringify({ title: "Updated" }),
      },
    );
    const sut = await PUT(
      req as unknown as NextRequest,
      makeParams("cltest00000000000000000000"),
    );

    expect(sut.status).toBe(500);
  });
});

describe("DELETE /api/cms/posts/[id]", () => {
  it("returns 204 on success", async () => {
    vi.mocked(prisma.post.delete).mockResolvedValue(mockPost as never);

    const req = new Request(
      "http://localhost/api/cms/posts/cltest00000000000000000000",
      {
        method: "DELETE",
      },
    );
    const sut = await DELETE(
      req as unknown as NextRequest,
      makeParams("cltest00000000000000000000"),
    );

    expect(sut.status).toBe(204);
  });

  it("calls delete with correct id (cascade verified via prisma schema)", async () => {
    vi.mocked(prisma.post.delete).mockResolvedValue(mockPost as never);

    const req = new Request(
      "http://localhost/api/cms/posts/cltest00000000000000000000",
      {
        method: "DELETE",
      },
    );
    await DELETE(
      req as unknown as NextRequest,
      makeParams("cltest00000000000000000000"),
    );

    expect(prisma.post.delete).toHaveBeenCalledWith({
      where: { id: "cltest00000000000000000000" },
    });
  });

  it("returns 404 when post not found (P2025)", async () => {
    vi.mocked(prisma.post.delete).mockRejectedValue(makeP2025());

    const req = new Request("http://localhost/api/cms/posts/nonexistent", {
      method: "DELETE",
    });
    const sut = await DELETE(
      req as unknown as NextRequest,
      makeParams("nonexistent"),
    );

    expect(sut.status).toBe(404);
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(prisma.post.delete).mockRejectedValue(new Error("DB error"));

    const req = new Request(
      "http://localhost/api/cms/posts/cltest00000000000000000000",
      {
        method: "DELETE",
      },
    );
    const sut = await DELETE(
      req as unknown as NextRequest,
      makeParams("cltest00000000000000000000"),
    );

    expect(sut.status).toBe(500);
  });
});

import { describe, expect, it } from "vitest";
import {
  CreatePostSchema,
  PostSchema,
  UpdatePostSchema,
} from "@/cms/schemas/post";

describe("PostSchema", () => {
  describe("PostSchema - Full post with id and timestamps", () => {
    it("accepts valid post data with all fields", () => {
      const validPost = {
        id: "clh7n3g4p0000qz8h0q0q0q0q",
        title: "My First Post",
        slug: "my-first-post",
        content: "This is the full content of the post.",
        excerpt: "This is a brief excerpt.",
        authorId: "author123",
        status: "published",
        publishedAt: new Date("2025-04-25"),
        tags: ["javascript", "react"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = PostSchema.safeParse(validPost);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("My First Post");
        expect(result.data.status).toBe("published");
      }
    });
  });

  describe("CreatePostSchema - API input validation", () => {
    it("accepts valid create post data without id and timestamps", () => {
      const validCreate = {
        title: "New Post",
        slug: "new-post",
        content: "Post content here",
        excerpt: "Brief excerpt",
        authorId: "author456",
        status: "draft",
        publishedAt: null,
        tags: ["test"],
      };

      const result = CreatePostSchema.safeParse(validCreate);
      expect(result.success).toBe(true);
    });

    it("rejects post with missing title", () => {
      const invalidPost = {
        slug: "new-post",
        content: "Post content",
        excerpt: "Brief excerpt",
        authorId: "author456",
        status: "draft",
        publishedAt: null,
        tags: [],
      };

      const result = CreatePostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it("rejects post with empty slug", () => {
      const invalidPost = {
        title: "New Post",
        slug: "",
        content: "Post content",
        excerpt: "Brief excerpt",
        authorId: "author456",
        status: "draft",
        publishedAt: null,
        tags: [],
      };

      const result = CreatePostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it("rejects post with invalid status", () => {
      const invalidPost = {
        title: "New Post",
        slug: "new-post",
        content: "Post content",
        excerpt: "Brief excerpt",
        authorId: "author456",
        status: "archived",
        publishedAt: null,
        tags: [],
      };

      const result = CreatePostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it("rejects post with title exceeding 200 characters", () => {
      const longTitle = "a".repeat(201);
      const invalidPost = {
        title: longTitle,
        slug: "new-post",
        content: "Post content",
        excerpt: "Brief excerpt",
        authorId: "author456",
        status: "draft",
        publishedAt: null,
        tags: [],
      };

      const result = CreatePostSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });

    it("allows null publishedAt for draft posts", () => {
      const draftPost = {
        title: "Draft Post",
        slug: "draft-post",
        content: "Not published yet",
        excerpt: "Excerpt here",
        authorId: "author789",
        status: "draft",
        publishedAt: null,
        tags: [],
      };

      const result = CreatePostSchema.safeParse(draftPost);
      expect(result.success).toBe(true);
    });

    it("omits id, createdAt, updatedAt from input validation", () => {
      const inputData = {
        title: "New Post",
        slug: "new-post",
        content: "Post content",
        excerpt: "Brief excerpt",
        authorId: "author456",
        status: "draft",
        publishedAt: null,
        tags: [],
      };

      const result = CreatePostSchema.safeParse(inputData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty("id");
        expect(result.data).not.toHaveProperty("createdAt");
        expect(result.data).not.toHaveProperty("updatedAt");
      }
    });
  });

  describe("UpdatePostSchema - Partial updates", () => {
    it("accepts all fields optional for partial updates", () => {
      const partialUpdate = {
        title: "Updated Title",
      };

      const result = UpdatePostSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it("accepts empty object for no-op update", () => {
      const emptyUpdate = {};

      const result = UpdatePostSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    it("accepts multiple fields for complex updates", () => {
      const complexUpdate = {
        title: "New Title",
        content: "New content",
        status: "published",
        publishedAt: new Date(),
        tags: ["updated", "tags"],
      };

      const result = UpdatePostSchema.safeParse(complexUpdate);
      expect(result.success).toBe(true);
    });

    it("rejects invalid status in partial update", () => {
      const invalidUpdate = {
        status: "invalid-status",
      };

      const result = UpdatePostSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it("rejects title exceeding 200 chars in partial update", () => {
      const invalidUpdate = {
        title: "a".repeat(201),
      };

      const result = UpdatePostSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});

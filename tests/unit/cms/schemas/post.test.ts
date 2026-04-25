import { describe, expect, it } from "vitest";
import {
  CreatePostSchema,
  PostSchema,
  UpdatePostSchema,
} from "@/cms/schemas/post";

describe("PostSchema", () => {
  describe("CreatePostSchema", () => {
    it("should accept valid post payload", () => {
      const sut = CreatePostSchema.safeParse({
        title: "Test Post",
        slug: "test-post",
        content: "This is test content",
        excerpt: "This is a test excerpt",
        authorId: "cljp1234567890abcdef12345",
        status: "published",
        publishedAt: new Date("2024-01-01"),
        tags: ["javascript", "testing"],
      });

      expect(sut.success).toBe(true);
    });

    it("should reject title exceeding 200 characters", () => {
      const sut = CreatePostSchema.safeParse({
        title: "a".repeat(201),
        slug: "test-slug",
        content: "content",
        excerpt: "excerpt",
        authorId: "cljp1234567890abcdef12345",
        status: "published",
      });

      expect(sut.success).toBe(false);
    });

    it("should default tags to empty array", () => {
      const sut = CreatePostSchema.safeParse({
        title: "Test Title",
        slug: "test-slug",
        content: "content",
        excerpt: "excerpt",
        authorId: "cljp1234567890abcdef12345",
        status: "published",
      });

      expect(sut.success).toBe(true);
      if (sut.success) {
        expect(sut.data.tags).toEqual([]);
      }
    });
  });

  describe("UpdatePostSchema", () => {
    it("should accept partial updates", () => {
      const sut = UpdatePostSchema.safeParse({
        title: "Updated Title",
      });

      expect(sut.success).toBe(true);
    });

    it("should accept empty update object", () => {
      const sut = UpdatePostSchema.safeParse({});

      expect(sut.success).toBe(true);
    });
  });
});

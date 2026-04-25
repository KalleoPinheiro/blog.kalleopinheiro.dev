import { describe, expect, it } from "vitest";
import { CommentSchema, CreateCommentSchema } from "@/cms/schemas/comment";

describe("Comment Schema", () => {
  const validCommentData = {
    id: "clg1a2b3c4d5e6f7g8h9i0j1",
    postId: "clg1a2b3c4d5e6f7g8h9i0j2",
    author: "Jane Smith",
    email: "jane@example.com",
    content: "This is a great post!",
    status: "approved" as const,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  };

  describe("CommentSchema (full)", () => {
    it("should validate correct comment data", () => {
      const result = CommentSchema.safeParse(validCommentData);
      expect(result.success).toBe(true);
    });

    it("should reject missing postId", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        postId: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid email", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
    });

    it("should reject content with less than 1 character", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        content: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject content exceeding 5000 characters", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        content: "a".repeat(5001),
      });
      expect(result.success).toBe(false);
    });

    it("should accept content with exactly 5000 characters", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        content: "a".repeat(5000),
      });
      expect(result.success).toBe(true);
    });

    it("should reject author name exceeding 200 characters", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        author: "a".repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid status", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        status: "deleted",
      });
      expect(result.success).toBe(false);
    });

    it("should accept 'pending' status", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        status: "pending",
      });
      expect(result.success).toBe(true);
    });

    it("should accept 'rejected' status", () => {
      const result = CommentSchema.safeParse({
        ...validCommentData,
        status: "rejected",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("CreateCommentSchema", () => {
    it("should accept valid create data without id, createdAt, updatedAt", () => {
      const createData = {
        postId: "clg1a2b3c4d5e6f7g8h9i0j2",
        author: "John Commenter",
        email: "john@example.com",
        content: "Excellent article!",
        status: "pending" as const,
      };
      const result = CreateCommentSchema.safeParse(createData);
      expect(result.success).toBe(true);
    });

    it("should reject if required fields are missing", () => {
      const result = CreateCommentSchema.safeParse({
        author: "John Commenter",
      });
      expect(result.success).toBe(false);
    });

    it("should reject if postId is missing", () => {
      const result = CreateCommentSchema.safeParse({
        author: "John Commenter",
        email: "john@example.com",
        content: "Great!",
        status: "pending",
      });
      expect(result.success).toBe(false);
    });
  });
});

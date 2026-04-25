import { describe, it, expect } from "vitest";
import { AuthorSchema, CreateAuthorSchema } from "@/cms/schemas/author";

describe("Author Schema", () => {
  const validAuthorData = {
    id: "clg1a2b3c4d5e6f7g8h9i0j1",
    name: "John Doe",
    email: "john@example.com",
    bio: "A passionate writer",
    avatarId: "clg1a2b3c4d5e6f7g8h9i0j2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  };

  describe("AuthorSchema (full)", () => {
    it("should validate correct author data", () => {
      const result = AuthorSchema.safeParse(validAuthorData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = AuthorSchema.safeParse({
        ...validAuthorData,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });

    it("should allow null avatarId", () => {
      const result = AuthorSchema.safeParse({
        ...validAuthorData,
        avatarId: null,
      });
      expect(result.success).toBe(true);
    });

    it("should reject name exceeding 200 characters", () => {
      const result = AuthorSchema.safeParse({
        ...validAuthorData,
        name: "a".repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it("should reject bio exceeding 1000 characters", () => {
      const result = AuthorSchema.safeParse({
        ...validAuthorData,
        bio: "a".repeat(1001),
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing name", () => {
      const result = AuthorSchema.safeParse({
        ...validAuthorData,
        name: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty name", () => {
      const result = AuthorSchema.safeParse({
        ...validAuthorData,
        name: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("CreateAuthorSchema", () => {
    it("should accept valid create data without id, createdAt, updatedAt", () => {
      const createData = {
        name: "Jane Doe",
        email: "jane@example.com",
        bio: "A tech blogger",
        avatarId: null,
      };
      const result = CreateAuthorSchema.safeParse(createData);
      expect(result.success).toBe(true);
    });

    it("should allow optional bio", () => {
      const createData = {
        name: "Jane Doe",
        email: "jane@example.com",
      };
      const result = CreateAuthorSchema.safeParse(createData);
      expect(result.success).toBe(true);
    });
  });
});

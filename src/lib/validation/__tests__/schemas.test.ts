import { describe, it, expect } from "vitest";
import {
  userCreateSchema,
  articleCreateSchema,
  categoryCreateSchema,
  tagCreateSchema,
} from "../schemas";

describe("Validation Schemas", () => {
  describe("userCreateSchema", () => {
    it("should validate valid user data", () => {
      const validData = {
        email: "user@example.com",
        username: "testuser",
        displayName: "Test User",
        password: "SecurePass123",
      };
      expect(() => userCreateSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid email", () => {
      expect(() =>
        userCreateSchema.parse({
          email: "invalid-email",
          username: "testuser",
          displayName: "Test User",
          password: "SecurePass123",
        })
      ).toThrow();
    });

    it("should reject weak password", () => {
      expect(() =>
        userCreateSchema.parse({
          email: "user@example.com",
          username: "testuser",
          displayName: "Test User",
          password: "weak",
        })
      ).toThrow();
    });

    it("should reject short username", () => {
      expect(() =>
        userCreateSchema.parse({
          email: "user@example.com",
          username: "ab",
          displayName: "Test User",
          password: "SecurePass123",
        })
      ).toThrow();
    });
  });

  describe("articleCreateSchema", () => {
    it("should validate valid article data", () => {
      const validData = {
        slug: "test-article",
        title: "Test Article",
        content: "This is the article content",
      };
      expect(() => articleCreateSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid slug", () => {
      expect(() =>
        articleCreateSchema.parse({
          slug: "Invalid Slug!",
          title: "Test Article",
          content: "Content",
        })
      ).toThrow();
    });

    it("should allow optional fields", () => {
      const validData = {
        slug: "test-article",
        title: "Test Article",
        content: "Content",
        summary: "A summary",
        status: "PUBLISHED" as const,
      };
      expect(() => articleCreateSchema.parse(validData)).not.toThrow();
    });
  });

  describe("categoryCreateSchema", () => {
    it("should validate valid category data", () => {
      const validData = {
        name: "Technology",
        slug: "technology",
      };
      expect(() => categoryCreateSchema.parse(validData)).not.toThrow();
    });

    it("should validate with all required fields", () => {
      const data = {
        name: "Test Category",
        slug: "test-category",
      };
      expect(() => categoryCreateSchema.parse(data)).not.toThrow();
    });
  });

  describe("tagCreateSchema", () => {
    it("should validate valid tag data", () => {
      const validData = {
        name: "React",
        slug: "react",
      };
      expect(() => tagCreateSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid slug format", () => {
      expect(() =>
        tagCreateSchema.parse({
          name: "React",
          slug: "React!",
        })
      ).toThrow();
    });
  });
});

import { describe, it, expect } from "vitest";
import { PageSchema, CreatePageSchema } from "@/cms/schemas/page";

describe("Page Schema", () => {
  const validPageData = {
    id: "clg1a2b3c4d5e6f7g8h9i0j1",
    title: "About Us",
    slug: "about-us",
    content: "This is a page about us",
    status: "published" as const,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  };

  describe("PageSchema (full)", () => {
    it("should validate correct page data", () => {
      const result = PageSchema.safeParse(validPageData);
      expect(result.success).toBe(true);
    });

    it("should reject missing title", () => {
      const result = PageSchema.safeParse({
        ...validPageData,
        title: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty slug", () => {
      const result = PageSchema.safeParse({
        ...validPageData,
        slug: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid status", () => {
      const result = PageSchema.safeParse({
        ...validPageData,
        status: "archived",
      });
      expect(result.success).toBe(false);
    });

    it("should reject title exceeding 200 characters", () => {
      const result = PageSchema.safeParse({
        ...validPageData,
        title: "a".repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it("should reject slug exceeding 200 characters", () => {
      const result = PageSchema.safeParse({
        ...validPageData,
        slug: "a".repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it("should accept 'draft' status", () => {
      const result = PageSchema.safeParse({
        ...validPageData,
        status: "draft",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("CreatePageSchema", () => {
    it("should accept valid create data without id, createdAt, updatedAt", () => {
      const createData = {
        title: "New Page",
        slug: "new-page",
        content: "Content here",
        status: "draft" as const,
      };
      const result = CreatePageSchema.safeParse(createData);
      expect(result.success).toBe(true);
    });

    it("should reject if title is missing", () => {
      const result = CreatePageSchema.safeParse({
        slug: "test",
        content: "content",
        status: "draft",
      });
      expect(result.success).toBe(false);
    });
  });
});

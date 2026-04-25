import { describe, expect, it } from "vitest";
import { CreateMediaSchema, MediaSchema } from "@/cms/schemas/media";

describe("Media Schema", () => {
  const validMediaData = {
    id: "clg1a2b3c4d5e6f7g8h9i0j1",
    filename: "profile.jpg",
    url: "https://example.com/uploads/profile.jpg",
    mimeType: "image/jpeg",
    size: 102400,
    createdAt: new Date("2024-01-01"),
  };

  describe("MediaSchema (full)", () => {
    it("should validate correct media data", () => {
      const result = MediaSchema.safeParse(validMediaData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid url format", () => {
      const result = MediaSchema.safeParse({
        ...validMediaData,
        url: "not-a-valid-url",
      });
      expect(result.success).toBe(false);
    });

    it("should reject zero size", () => {
      const result = MediaSchema.safeParse({
        ...validMediaData,
        size: 0,
      });
      expect(result.success).toBe(false);
    });

    it("should reject negative size", () => {
      const result = MediaSchema.safeParse({
        ...validMediaData,
        size: -100,
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing filename", () => {
      const result = MediaSchema.safeParse({
        ...validMediaData,
        filename: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing url", () => {
      const result = MediaSchema.safeParse({
        ...validMediaData,
        url: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("should accept https and http urls", () => {
      const httpsResult = MediaSchema.safeParse({
        ...validMediaData,
        url: "https://example.com/file.jpg",
      });
      const httpResult = MediaSchema.safeParse({
        ...validMediaData,
        url: "http://example.com/file.jpg",
      });
      expect(httpsResult.success).toBe(true);
      expect(httpResult.success).toBe(true);
    });
  });

  describe("CreateMediaSchema", () => {
    it("should accept valid create data without id, createdAt", () => {
      const createData = {
        filename: "image.png",
        url: "https://example.com/image.png",
        mimeType: "image/png",
        size: 204800,
      };
      const result = CreateMediaSchema.safeParse(createData);
      expect(result.success).toBe(true);
    });

    it("should reject create data with size 0", () => {
      const createData = {
        filename: "image.png",
        url: "https://example.com/image.png",
        mimeType: "image/png",
        size: 0,
      };
      const result = CreateMediaSchema.safeParse(createData);
      expect(result.success).toBe(false);
    });
  });
});

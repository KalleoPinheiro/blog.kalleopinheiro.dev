import { describe, it, expect } from "vitest";
import {
  slugify,
  formatDate,
  calculateReadingTime,
  truncate,
  stripMarkdown,
  generateExcerpt,
} from "../string";

describe("String Utilities", () => {
  describe("slugify", () => {
    it("should convert text to URL-friendly slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Test  Multiple   Spaces")).toBe("test-multiple-spaces");
    });

    it("should remove special characters", () => {
      expect(slugify("Hello@#$%World")).toBe("helloworld");
      expect(slugify("Test-With-Dashes")).toBe("test-with-dashes");
    });

    it("should handle edge cases", () => {
      expect(slugify("---test---")).toBe("test");
      expect(slugify("   ")).toBe("");
    });
  });

  describe("formatDate", () => {
    it("should format date to readable string", () => {
      const date = new Date("2026-01-15T12:00:00Z");
      const formatted = formatDate(date);
      expect(formatted).toContain("January");
      expect(formatted).toContain("2026");
      expect(formatted).toMatch(/\d{1,2}/);
    });
  });

  describe("calculateReadingTime", () => {
    it("should calculate reading time based on word count", () => {
      const shortText = "Hello world";
      expect(calculateReadingTime(shortText)).toBe(1);

      const longText = "word ".repeat(300);
      expect(calculateReadingTime(longText)).toBeGreaterThan(1);
    });

    it("should round up to nearest minute", () => {
      const text = "word ".repeat(150);
      const time = calculateReadingTime(text);
      expect(time).toEqual(Math.ceil(150 / 200));
    });
  });

  describe("truncate", () => {
    it("should truncate text with ellipsis", () => {
      const text = "This is a long text that should be truncated";
      const truncated = truncate(text, 20);
      expect(truncated).toContain("…");
      expect(truncated.length).toBeLessThanOrEqual(21);
    });

    it("should not truncate short text", () => {
      const text = "Short";
      expect(truncate(text, 20)).toBe("Short");
    });
  });

  describe("stripMarkdown", () => {
    it("should remove markdown formatting", () => {
      expect(stripMarkdown("**bold text**")).toBe("bold text");
      expect(stripMarkdown("*italic text*")).toBe("italic text");
      expect(stripMarkdown("# Heading")).toBe("Heading");
    });

    it("should handle multiple lines", () => {
      const markdown = "Line 1\n\nLine 2";
      const stripped = stripMarkdown(markdown);
      expect(stripped).not.toContain("\n\n");
    });
  });

  describe("generateExcerpt", () => {
    it("should generate excerpt from content", () => {
      const content = "# Heading\n\nThis is a long paragraph with some text that should be turned into an excerpt for display purposes.";
      const excerpt = generateExcerpt(content, 100);
      expect(excerpt.length).toBeLessThanOrEqual(101);
      expect(excerpt).not.toContain("#");
    });
  });
});

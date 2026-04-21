import { describe, expect, it, vi } from "vitest";

vi.mock("@/utils/site-config", () => ({
  siteConfig: {
    name: "Test Blog",
    url: "https://test.example.com",
    defaultLocale: "pt-BR",
    description: "Test description.",
    feed: {
      title: "Test Blog",
      description: "Test description.",
      language: "pt-BR",
    },
    social: { github: "testuser" },
  },
}));

import sitemap from "@/utils/sitemap";

describe("sitemap", () => {
  it("returns an array", () => {
    // Arrange / Act
    const sut = sitemap();

    // Assert
    expect(Array.isArray(sut)).toBe(true);
  });

  it("includes an entry for the site root using siteConfig.url", () => {
    // Arrange / Act
    const sut = sitemap();

    // Assert
    expect(sut[0]?.url).toBe("https://test.example.com");
  });

  it("includes lastModified and changeFrequency on the root entry", () => {
    // Arrange / Act
    const sut = sitemap();

    // Assert
    expect(sut[0]?.lastModified).toBeDefined();
    expect(sut[0]?.changeFrequency).toBeDefined();
  });
});

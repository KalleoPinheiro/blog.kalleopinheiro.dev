import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/site-config", () => ({
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

import robots from "./robots";

describe("robots", () => {
  it("allows all user agents", () => {
    // Arrange / Act
    const sut = robots();

    // Assert
    expect(sut.rules).toMatchObject({ userAgent: "*", allow: "/" });
  });

  it("references the sitemap url from siteConfig", () => {
    // Arrange / Act
    const sut = robots();

    // Assert
    expect(sut.sitemap).toBe("https://test.example.com/sitemap.xml");
  });
});

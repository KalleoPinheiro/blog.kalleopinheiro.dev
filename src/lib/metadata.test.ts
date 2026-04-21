import { describe, expect, it, vi } from "vitest";

vi.mock("./site-config", () => ({
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

import { buildPageMetadata, buildRootMetadata } from "./metadata";

describe("buildRootMetadata", () => {
  it("includes a title template with the site name as default", () => {
    // Arrange / Act
    const sut = buildRootMetadata();

    // Assert
    expect(sut.title).toEqual({
      default: "Test Blog",
      template: "%s | Test Blog",
    });
  });

  it("sets the default description from siteConfig", () => {
    // Arrange / Act
    const sut = buildRootMetadata();

    // Assert
    expect(sut.description).toBe("Test description.");
  });

  it("sets the canonical URL to the site root", () => {
    // Arrange / Act
    const sut = buildRootMetadata();

    // Assert
    expect(sut.alternates?.canonical).toBe("https://test.example.com");
  });

  it("includes openGraph defaults", () => {
    // Arrange / Act
    const sut = buildRootMetadata();

    // Assert — toMatchObject avoids narrowing the OpenGraph discriminated union
    expect(sut.openGraph).toMatchObject({
      type: "website",
      url: "https://test.example.com",
      siteName: "Test Blog",
    });
  });

  it("includes a twitter summary card", () => {
    // Arrange / Act
    const sut = buildRootMetadata();

    // Assert — toMatchObject avoids narrowing the Twitter discriminated union
    expect(sut.twitter).toMatchObject({ card: "summary_large_image" });
  });
});

describe("buildPageMetadata", () => {
  it("overrides title and description with page-specific values", () => {
    // Arrange
    const input = { title: "About", description: "About page." };

    // Act
    const sut = buildPageMetadata(input);

    // Assert
    expect(sut.title).toBe("About");
    expect(sut.description).toBe("About page.");
  });

  it("sets canonical to the provided path resolved against the site url", () => {
    // Arrange
    const input = { title: "About", path: "/about" };

    // Act
    const sut = buildPageMetadata(input);

    // Assert
    expect(sut.alternates?.canonical).toBe("https://test.example.com/about");
  });

  it("falls back to root canonical when no path is provided", () => {
    // Arrange
    const input = { title: "Home" };

    // Act
    const sut = buildPageMetadata(input);

    // Assert
    expect(sut.alternates?.canonical).toBe("https://test.example.com");
  });
});

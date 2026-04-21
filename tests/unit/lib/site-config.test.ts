import { describe, expect, it, vi } from "vitest";

vi.mock("@/utils/env", () => ({
  env: {
    NEXT_PUBLIC_SITE_URL: "https://test.example.com",
    NODE_ENV: "test",
    APP_VERSION: "test",
    ENABLE_API_DOCS: "false",
  },
}));

import { type SiteConfig, siteConfig } from "@/utils/site-config";

describe("siteConfig", () => {
  it("derives url from env.NEXT_PUBLIC_SITE_URL", () => {
    // Arrange
    const sut = siteConfig;

    // Act / Assert
    expect(sut.url).toBe("https://test.example.com");
  });

  it("sets pt-BR as the default locale", () => {
    // Arrange
    const sut = siteConfig;

    // Assert
    expect(sut.defaultLocale).toBe("pt-BR");
  });

  it("includes required feed metadata fields with pt-BR language", () => {
    // Arrange
    const sut = siteConfig;

    // Assert
    expect(sut.feed.title).toBeTruthy();
    expect(sut.feed.description).toBeTruthy();
    expect(sut.feed.language).toBe("pt-BR");
  });

  it("satisfies the SiteConfig type shape with all required fields", () => {
    // Arrange & Act — assignment is a compile-time shape check
    const sut: SiteConfig = siteConfig;

    // Assert
    expect(sut.name).toBeTruthy();
    expect(sut.url).toBeTruthy();
    expect(sut.defaultLocale).toBeTruthy();
    expect(sut.description).toBeTruthy();
  });
});

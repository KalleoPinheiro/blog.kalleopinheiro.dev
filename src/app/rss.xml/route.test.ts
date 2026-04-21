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

import { GET } from "./route";

describe("GET /rss.xml", () => {
  it("returns status 200", async () => {
    // Arrange / Act
    const sut = await GET();

    // Assert
    expect(sut.status).toBe(200);
  });

  it("responds with application/rss+xml content-type", async () => {
    // Arrange / Act
    const sut = await GET();

    // Assert
    expect(sut.headers.get("content-type")).toMatch(/application\/rss\+xml/);
  });

  it("body contains RSS 2.0 root element", async () => {
    // Arrange / Act
    const sut = await GET();
    const body = await sut.text();

    // Assert
    expect(body).toContain('<rss version="2.0"');
  });

  it("body contains channel metadata from siteConfig", async () => {
    // Arrange / Act
    const sut = await GET();
    const body = await sut.text();

    // Assert
    expect(body).toContain("<title>Test Blog</title>");
    expect(body).toContain("<link>https://test.example.com</link>");
    expect(body).toContain("<language>pt-BR</language>");
  });
});

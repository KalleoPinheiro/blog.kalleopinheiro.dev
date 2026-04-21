import { beforeEach, describe, expect, it, vi } from "vitest";

describe("GET /api/docs", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns 404 when ENABLE_API_DOCS is false", async () => {
    // Arrange
    vi.doMock("@/lib/env", () => ({
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
        APP_VERSION: "1.0.0",
        ENABLE_API_DOCS: "false",
      },
    }));
    const { GET } = await import("./route");

    // Act
    const sut = await GET();

    // Assert
    expect(sut.status).toBe(404);
  });

  it("returns 200 with HTML when ENABLE_API_DOCS is true", async () => {
    // Arrange
    vi.doMock("@/lib/env", () => ({
      env: {
        NODE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
        APP_VERSION: "dev",
        ENABLE_API_DOCS: "true",
      },
    }));
    const { GET } = await import("./route");

    // Act
    const sut = await GET();

    // Assert
    expect(sut.status).toBe(200);
    expect(sut.headers.get("content-type")).toMatch(/text\/html/);
  });

  it("response body contains swagger-ui reference when enabled", async () => {
    // Arrange
    vi.doMock("@/lib/env", () => ({
      env: {
        NODE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
        APP_VERSION: "dev",
        ENABLE_API_DOCS: "true",
      },
    }));
    const { GET } = await import("./route");

    // Act
    const sut = await GET();
    const body = await sut.text();

    // Assert
    expect(body).toContain("swagger-ui");
  });
});

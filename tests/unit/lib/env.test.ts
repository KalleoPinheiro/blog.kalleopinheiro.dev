import { describe, expect, it, vi } from "vitest";

describe("env", () => {
  it("parses valid environment variables", async () => {
    // Arrange
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
    vi.stubEnv("APP_VERSION", "1.0.0");
    vi.stubEnv("ENABLE_API_DOCS", "false");

    // Act
    const { env: sut } = await import("@/utils/env");

    // Assert
    expect(sut.NODE_ENV).toBe("production");
    expect(sut.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
    expect(sut.APP_VERSION).toBe("1.0.0");
    expect(sut.ENABLE_API_DOCS).toBe("false");
  });

  it("applies defaults for optional variables", async () => {
    // Arrange
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
    delete process.env.APP_VERSION;
    delete process.env.ENABLE_API_DOCS;

    // Act
    const { createEnv } = await import("@/utils/env");
    const sut = createEnv();

    // Assert
    expect(sut.APP_VERSION).toBe("dev");
    expect(sut.ENABLE_API_DOCS).toBe("false");
  });

  it("throws when a required variable is missing", async () => {
    // Arrange
    vi.unstubAllEnvs();
    delete process.env.DATABASE_URL;

    // Act & Assert
    const { createEnv } = await import("@/utils/env");
    expect(() => createEnv()).toThrow();
  });
});

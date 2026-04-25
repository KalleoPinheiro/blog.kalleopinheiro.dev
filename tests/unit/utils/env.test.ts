import { beforeEach, describe, expect, it, vi } from "vitest";
import { createEnv, envSchema } from "@/utils/env";

describe("env", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", originalEnv.NODE_ENV || "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", originalEnv.NEXT_PUBLIC_SITE_URL || "");
    vi.stubEnv("DATABASE_URL", originalEnv.DATABASE_URL || "");
    vi.stubEnv("APP_VERSION", originalEnv.APP_VERSION || "dev");
    vi.stubEnv("ENABLE_API_DOCS", originalEnv.ENABLE_API_DOCS || "false");
    vi.resetModules();
  });

  it("should parse valid env vars", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
    vi.stubEnv("APP_VERSION", "1.0.0");
    vi.stubEnv("ENABLE_API_DOCS", "true");

    const sut = createEnv();

    expect(sut.NODE_ENV).toBe("development");
    expect(sut.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
    expect(sut.DATABASE_URL).toBe("postgresql://user:pass@localhost:5432/db");
    expect(sut.APP_VERSION).toBe("1.0.0");
    expect(sut.ENABLE_API_DOCS).toBe("true");
  });

  it("should use default for NODE_ENV when missing", () => {
    const sut = envSchema.parse({
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    });

    expect(sut.NODE_ENV).toBe("development");
  });

  it("should use default for APP_VERSION when missing", () => {
    const sut = envSchema.parse({
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    });

    expect(sut.APP_VERSION).toBe("dev");
  });

  it("should throw when DATABASE_URL is missing", () => {
    expect(() =>
      envSchema.parse({
        NEXT_PUBLIC_SITE_URL: "https://example.com",
      }),
    ).toThrow();
  });

  it("should throw when DATABASE_URL is not a valid URL", () => {
    expect(() =>
      envSchema.parse({
        NEXT_PUBLIC_SITE_URL: "https://example.com",
        DATABASE_URL: "not-a-url",
      }),
    ).toThrow();
  });

  it("should throw when NEXT_PUBLIC_SITE_URL is missing", () => {
    expect(() =>
      envSchema.parse({
        DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      }),
    ).toThrow();
  });
});

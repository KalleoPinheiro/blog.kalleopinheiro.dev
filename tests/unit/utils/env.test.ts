import { describe, it, expect, beforeEach, vi } from "vitest";
import { createEnv } from "@/utils/env";

describe("env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("should parse valid env vars", () => {
    process.env.NODE_ENV = "development";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
    process.env.APP_VERSION = "1.0.0";
    process.env.ENABLE_API_DOCS = "true";

    const sut = createEnv();

    expect(sut.NODE_ENV).toBe("development");
    expect(sut.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
    expect(sut.DATABASE_URL).toBe("postgresql://user:pass@localhost:5432/db");
    expect(sut.APP_VERSION).toBe("1.0.0");
    expect(sut.ENABLE_API_DOCS).toBe("true");
  });

  it("should use default for NODE_ENV when missing", () => {
    delete process.env.NODE_ENV;
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";

    const sut = createEnv();

    expect(sut.NODE_ENV).toBe("development");
  });

  it("should use default for APP_VERSION when missing", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
    delete process.env.APP_VERSION;

    const sut = createEnv();

    expect(sut.APP_VERSION).toBe("dev");
  });

  it("should throw when DATABASE_URL is missing", () => {
    delete process.env.DATABASE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

    expect(() => createEnv()).toThrow();
  });

  it("should throw when DATABASE_URL is not a valid URL", () => {
    process.env.DATABASE_URL = "not-a-url";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

    expect(() => createEnv()).toThrow();
  });

  it("should throw when NEXT_PUBLIC_SITE_URL is missing", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";

    expect(() => createEnv()).toThrow();
  });
});

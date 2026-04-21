import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    NODE_ENV: "test",
    NEXT_PUBLIC_SITE_URL: "https://test.example.com",
    APP_VERSION: "1.2.3",
    ENABLE_API_DOCS: "false",
  },
}));

import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns status 200", async () => {
    // Arrange / Act
    const sut = await GET();

    // Assert
    expect(sut.status).toBe(200);
  });

  it("responds with JSON content-type", async () => {
    // Arrange / Act
    const sut = await GET();

    // Assert
    expect(sut.headers.get("content-type")).toMatch(/application\/json/);
  });

  it("returns the expected body shape", async () => {
    // Arrange / Act
    const sut = await GET();
    const body = await sut.json();

    // Assert
    expect(body).toMatchObject({
      status: "ok",
      version: "1.2.3",
    });
    expect(typeof body.uptime).toBe("number");
    expect(typeof body.timestamp).toBe("string");
  });

  it("sets Cache-Control: no-store", async () => {
    // Arrange / Act
    const sut = await GET();

    // Assert
    expect(sut.headers.get("cache-control")).toBe("no-store");
  });
});

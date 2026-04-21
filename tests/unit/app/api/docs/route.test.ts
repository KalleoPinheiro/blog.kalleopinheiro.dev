import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/docs/route";

vi.mock("@/utils/swagger", () => ({
  getApiDocs: () => ({
    openapi: "3.1.0",
    info: {
      title: "Personal Blog API",
      version: "1.0.0",
    },
    paths: {
      "/api/health": {
        get: {
          summary: "Healthcheck",
        },
      },
    },
  }),
}));

describe("GET /api/docs", () => {
  it("returns OpenAPI spec as JSON when ENABLE_API_DOCS=true", async () => {
    const sut = GET();

    expect(sut.status).toBe(200);
    expect(sut.headers.get("content-type")).toBe("application/json");

    const body = await sut.json();
    expect(body.openapi).toBe("3.1.0");
    expect(body.info.title).toBe("Personal Blog API");
    expect(body.paths).toHaveProperty("/api/health");
  });
});

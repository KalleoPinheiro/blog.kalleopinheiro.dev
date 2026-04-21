import { describe, expect, it } from "vitest";
import { getApiDocs } from "@/utils/swagger";

describe("swagger", () => {
  describe("getApiDocs", () => {
    it("returns a valid OpenAPI spec object", () => {
      const sut = getApiDocs() as Record<string, unknown>;

      expect(sut).toHaveProperty("openapi", "3.0.0");
      expect(sut).toHaveProperty("info");
      expect(sut).toHaveProperty("paths");
    });

    it("includes required info fields", () => {
      const sut = getApiDocs() as Record<string, unknown>;
      const info = sut.info as Record<string, unknown>;

      expect(info).toHaveProperty("title", "Personal Blog API");
      expect(info).toHaveProperty("version");
      expect(info).toHaveProperty("description");
    });

    it("includes documented API endpoints", () => {
      const sut = getApiDocs() as Record<string, unknown>;
      const paths = sut.paths as Record<string, unknown>;

      expect(paths).toHaveProperty("/api/health");
      expect(paths).toHaveProperty("/api/rss.xml");
      expect(paths).toHaveProperty("/api/docs");
    });

    it("includes health endpoint documentation", () => {
      const sut = getApiDocs() as Record<string, unknown>;
      const paths = sut.paths as Record<string, Record<string, unknown>>;
      const healthPath = paths["/api/health"] as Record<string, unknown>;
      const healthGet = healthPath.get as Record<string, unknown>;

      expect(healthPath).toHaveProperty("get");
      expect(healthGet).toHaveProperty("summary", "Healthcheck");
      expect(healthGet).toHaveProperty("tags");
      expect(healthGet.tags as string[]).toContain("Operations");
    });

    it("includes rss endpoint documentation", () => {
      const sut = getApiDocs() as Record<string, unknown>;
      const paths = sut.paths as Record<string, Record<string, unknown>>;
      const rssPath = paths["/api/rss.xml"] as Record<string, unknown>;
      const rssGet = rssPath.get as Record<string, unknown>;

      expect(rssPath).toHaveProperty("get");
      expect(rssGet).toHaveProperty("summary", "RSS feed");
      expect(rssGet).toHaveProperty("tags");
      expect(rssGet.tags as string[]).toContain("Content");
    });

    it("includes docs endpoint documentation", () => {
      const sut = getApiDocs() as Record<string, unknown>;
      const paths = sut.paths as Record<string, Record<string, unknown>>;
      const docsPath = paths["/api/docs"] as Record<string, unknown>;
      const docsGet = docsPath.get as Record<string, unknown>;

      expect(docsPath).toHaveProperty("get");
      expect(docsGet).toHaveProperty("summary", "OpenAPI specification");
      expect(docsGet).toHaveProperty("tags");
      expect(docsGet.tags as string[]).toContain("Documentation");
    });
  });
});

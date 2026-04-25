import "@testing-library/jest-dom/vitest";

process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.APP_VERSION = "1.0.0";
process.env.ENABLE_API_DOCS = "true";

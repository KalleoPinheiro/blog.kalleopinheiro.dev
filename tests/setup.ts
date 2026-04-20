import { afterAll, afterEach, beforeAll } from "vitest";

// Setup global test environment
beforeAll(() => {
  // Initialize test environment
  process.env.NODE_ENV = "test";
});

afterEach(() => {
  // Cleanup after each test
  vi.clearAllMocks();
});

afterAll(() => {
  // Final cleanup
});

// Mock fetch for API tests if needed
global.fetch = vi.fn();

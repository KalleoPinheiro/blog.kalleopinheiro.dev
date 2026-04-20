import { afterEach, vi } from "vitest";

afterEach(() => {
  // Cleanup after each test
  vi.clearAllMocks();
});

// Mock fetch for API tests if needed
global.fetch = vi.fn() as any;

# Test Structure and Organization

## Overview

The project uses a **mirrored test structure** where tests are organized in a separate `/tests` directory that mirrors the structure of `/src`. This approach provides:

- **Clear separation of concerns**: Source code and tests are physically separated
- **Scalability**: Easy to organize and find tests as the project grows
- **Domain-driven organization**: Future domain-specific tests can be easily grouped

---

## Directory Structure

```
project-root/
├─ src/                          # Source code (production)
│  ├─ app/
│  │  ├─ (public)/
│  │  │  └─ page.tsx
│  │  ├─ api/
│  │  │  ├─ health/route.ts
│  │  │  ├─ docs/route.ts
│  │  │  └─ rss.xml/route.ts
│  │  ├─ layout.tsx
│  │  └─ not-found.tsx
│  │
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ button.tsx
│  │  │  └─ card.tsx
│  │  ├─ layouts/
│  │  │  ├─ site-header.tsx
│  │  │  └─ site-footer.tsx
│  │  ├─ common/              # [Placeholder]
│  │  └─ providers/           # [Placeholder]
│  │
│  ├─ utils/                  # Utilities, config, and helpers
│  │  ├─ env.ts               # Environment variables (typed with Zod)
│  │  ├─ metadata.ts          # Next.js metadata builders
│  │  ├─ site-config.ts       # Site configuration
│  │  ├─ robots.ts            # Robots.txt generator
│  │  ├─ sitemap.ts           # Sitemap generator
│  │  └─ utils.ts             # General utility functions
│  │
│  ├─ features/               # [Placeholder for domain-driven features]
│  ├─ hooks/                  # [Placeholder for custom hooks]
│  ├─ services/               # [Placeholder for API clients]
│  ├─ types/                  # [Placeholder for global types]
│  ├─ styles/
│  │  └─ globals.css
│  └─ ...
│
├─ tests/                       # Test code (mirrored structure)
│  ├─ unit/                   # Unit tests
│  │  ├─ app/
│  │  │  ├─ (public)/
│  │  │  │  └─ page.test.tsx
│  │  │  ├─ api/
│  │  │  │  ├─ health/route.test.ts
│  │  │  │  ├─ docs/route.test.ts
│  │  │  │  └─ rss.xml/route.test.ts
│  │  │  ├─ layout.test.tsx
│  │  │  └─ not-found.test.tsx
│  │  │
│  │  ├─ components/
│  │  │  ├─ ui/
│  │  │  │  └─ button.test.tsx
│  │  │  └─ layouts/
│  │  │     ├─ site-header.test.tsx
│  │  │     └─ site-footer.test.tsx
│  │  │
│  │  └─ lib/
│  │     ├─ env.test.ts
│  │     ├─ metadata.test.ts
│  │     └─ site-config.test.ts
│  │
│  ├─ e2e/                    # End-to-end tests [Placeholder]
│  │  └─ ...
│  │
│  └─ setup.ts                # Test setup/configuration
│
├─ vitest.config.ts           # Vitest configuration
└─ ...
```

---

## Test Categories

### Unit Tests (`tests/unit/`)

**Purpose**: Test individual units of code in isolation (components, functions, utilities).

**Characteristics**:
- Tests run in JSDOM environment (for React components)
- Use Vitest + React Testing Library
- Follow AAA (Arrange, Act, Assert) pattern
- Mocks used for external dependencies (APIs, configs, etc.)
- Fast execution (< 10ms per test typically)

**Files**:
- All `*.test.ts` and `*.test.tsx` files mirror the structure of `src/`

**Example**:
```typescript
// tests/unit/lib/env.test.ts
import { describe, expect, it, vi } from "vitest";

describe("env module", () => {
  it("validates required environment variables", () => {
    // Arrange
    vi.mock("@/utils/env", () => ({
      env: { NODE_ENV: "test", NEXT_PUBLIC_SITE_URL: "https://test.com" }
    }));
    
    // Act
    const { env: sut } = await import("@/utils/env");
    
    // Assert
    expect(sut.NODE_ENV).toBe("test");
  });
});
```

### E2E Tests (`tests/e2e/`)

**Purpose**: Test complete user workflows (cross-browser, cross-platform integration).

**Characteristics**:
- Run against deployed or development server
- Test real API calls, database interactions
- Slower but provide highest confidence
- [Currently placeholder—ready for future implementation]

**Tools**:
- Playwright, Cypress, or similar (to be configured)

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Test file | `{sourceFile}.test.ts(x)` | `page.test.tsx`, `env.test.ts` |
| Test suite | `describe()` with component/function name | `describe("RootLayout", ...)` |
| Test case | `it()` with "should..." phrasing | `it("should render a banner landmark")` |
| Tested unit (variable) | `sut` (System Under Test) | `const sut = <MyComponent />` |

---

## Running Tests

### All Tests
```bash
pnpm test
```

### Watch Mode
```bash
pnpm test:watch
```

### Coverage Report
```bash
pnpm test:coverage
```

Generates:
- Terminal report (text)
- JSON report (`coverage/coverage-final.json`)
- HTML report (`coverage/index.html`)

**Coverage targets** (from `vitest.config.ts`):
- Files monitored: `src/lib/**/*.ts`, `src/app/api/**/*.ts`
- Minimum threshold: 80% lines

### Run Specific Test File
```bash
pnpm test tests/unit/lib/env.test.ts
```

---

## Importing in Tests

**DO** use absolute path imports with `@/` alias:

```typescript
// ✅ Correct
import { env } from "@/utils/env";
import Button from "@/components/ui/button";
import RootLayout from "@/app/layout";
```

**DON'T** use relative imports:

```typescript
// ❌ Incorrect (breaks when test location changes)
import { env } from "../../../src/lib/env";
import Button from "../components/ui/button";
```

---

## Best Practices

### 1. **Test Structure (AAA Pattern)**

```typescript
describe("Component or Function", () => {
  it("should do X when Y happens", () => {
    // Arrange: Set up test data and conditions
    const props = { title: "Test" };
    
    // Act: Execute the code being tested
    const sut = <MyComponent {...props} />;
    render(sut);
    
    // Assert: Verify the results
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```

### 2. **Mocking External Dependencies**

```typescript
// Mock at the top of the file, BEFORE imports
vi.mock("@/utils/env", () => ({
  env: {
    NODE_ENV: "test",
    NEXT_PUBLIC_SITE_URL: "https://test.example.com",
  },
}));

// Then import your code
import { createEnv } from "@/utils/env";
```

### 3. **Use `sut` Variable for Clarity**

```typescript
// ✅ Clear what is being tested
const sut = <Button onClick={handler}>Click</Button>;
render(sut);
fireEvent.click(screen.getByRole("button"));
expect(handler).toHaveBeenCalled();
```

### 4. **No `any` Type in Tests**

Tests must be as strictly typed as source code:

```typescript
// ❌ Avoid
const props: any = { title: "test" };

// ✅ Better
interface ButtonProps { title: string }
const props: ButtonProps = { title: "test" };
```

---

## Configuration

### vitest.config.ts

```typescript
test: {
  environment: "jsdom",                          // Browser-like env for React tests
  globals: true,                                 // No need to import describe/it/expect
  setupFiles: ["./tests/setup.ts"],              // Global test setup
  include: ["tests/unit/**/*.test.{ts,tsx}"], // Where tests live
  clearMocks: true,                              // Auto-reset mocks between tests
  restoreMocks: true,                            // Auto-restore mocks between tests
  coverage: {
    provider: "v8",
    include: ["src/lib/**/*.ts", "src/app/api/**/*.ts"],
    exclude: ["**/*.test.ts", "**/*.test.tsx"],
  },
}
```

### test/setup.ts

Global setup for all tests (e.g., extend matchers, configure environment):

```typescript
import "@testing-library/jest-dom";
// Add custom matchers or global mocks here
```

---

## Common Patterns

### Testing API Routes

```typescript
// tests/unit/app/api/health/route.test.ts
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns 200 with JSON", async () => {
    // Act
    const sut = await GET();
    
    // Assert
    expect(sut.status).toBe(200);
    expect(sut.headers.get("content-type")).toMatch(/application\/json/);
  });
});
```

### Testing React Components

```typescript
// tests/unit/components/ui/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/ui/button";

describe("Button", () => {
  it("calls onClick handler when clicked", () => {
    // Arrange
    const handler = vi.fn();
    const sut = <Button onClick={handler}>Click Me</Button>;
    render(sut);
    
    // Act
    fireEvent.click(screen.getByRole("button"));
    
    // Assert
    expect(handler).toHaveBeenCalledOnce();
  });
});
```

### Testing Utility Functions

```typescript
// tests/unit/lib/utils.test.ts
import { describe, expect, it } from "vitest";
import { formatDate } from "@/utils/utils";

describe("formatDate", () => {
  it("formats date to YYYY-MM-DD", () => {
    // Arrange
    const date = new Date("2026-04-21");
    
    // Act
    const sut = formatDate(date);
    
    // Assert
    expect(sut).toBe("2026-04-21");
  });
});
```

---

## Future: E2E Test Setup

When implementing E2E tests:

1. Create `tests/e2e/` directory
2. Add Playwright/Cypress configuration
3. Write integration tests for user workflows
4. Run in CI/CD pipeline

Example structure:
```
test/e2e/
├─ fixtures/           # Shared test data
├─ pages/              # Page object models
├─ workflows/          # User flow tests
└─ ...
```

---

## Troubleshooting

### Tests not found
- Check file naming: must be `*.test.ts` or `*.test.tsx`
- Check `vitest.config.ts` `include` pattern
- Rebuild with `pnpm test`

### Import errors in tests
- Use absolute imports with `@/` alias
- Check that aliases are defined in `tsconfig.json`
- Ensure mocks are placed before imports

### Mock not working
- Ensure `vi.mock()` is called before importing the module
- Use `vi.resetModules()` in `beforeEach()` if testing multiple conditions
- Check mock path uses `@/` alias

### Type errors
- No `any` types allowed; use proper types
- Run `pnpm typecheck` to verify TypeScript compiles
- Use `as const` for literal types in test setup

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [Project Foundation Spec](.specs/features/foundation/spec.md)

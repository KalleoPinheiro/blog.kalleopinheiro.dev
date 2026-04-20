import { describe, it, expect } from "vitest"

describe("Component Imports", () => {
  it("should resolve Button component from @/components/ui/button", async () => {
    const button = await import("@/components/ui/button")
    expect(button.Button).toBeDefined()
    expect(button.buttonVariants).toBeDefined()
  })

  it("should resolve Input component from @/components/ui/input", async () => {
    const input = await import("@/components/ui/input")
    expect(input.Input).toBeDefined()
  })

  it("should resolve cn utility from @/lib/utils", async () => {
    const utils = await import("@/lib/utils")
    expect(utils.cn).toBeDefined()
    expect(typeof utils.cn).toBe("function")
  })

  it("Button component should export named exports", async () => {
    const button = await import("@/components/ui/button")
    expect(Object.keys(button)).toContain("Button")
    expect(Object.keys(button)).toContain("buttonVariants")
  })

  it("Input component should export named exports", async () => {
    const input = await import("@/components/ui/input")
    expect(Object.keys(input)).toContain("Input")
  })
})

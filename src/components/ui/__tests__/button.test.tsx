import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { Button, buttonVariants } from "../button"

describe("Button Component", () => {
  describe("Rendering", () => {
    it("should render a button element", () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole("button", { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it("should render with text content", () => {
      render(<Button>My Button</Button>)
      expect(screen.getByText("My Button")).toBeInTheDocument()
    })

    it("should support disabled state", () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole("button", { name: /disabled button/i })
      expect(button).toBeDisabled()
    })
  })

  describe("Variants", () => {
    it("should apply default variant styles", () => {
      const { container } = render(<Button variant="default">Default</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("bg-primary")
    })

    it("should apply secondary variant styles", () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("bg-secondary")
    })

    it("should apply outline variant styles", () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("border")
    })

    it("should apply destructive variant styles", () => {
      const { container } = render(<Button variant="destructive">Delete</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("bg-destructive")
    })

    it("should apply ghost variant styles", () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("hover:bg-accent")
    })

    it("should apply link variant styles", () => {
      const { container } = render(<Button variant="link">Link</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("text-primary")
    })
  })

  describe("Sizes", () => {
    it("should apply default size styles", () => {
      const { container } = render(<Button size="default">Default Size</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("h-9")
    })

    it("should apply small size styles", () => {
      const { container } = render(<Button size="sm">Small</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("h-8")
    })

    it("should apply large size styles", () => {
      const { container } = render(<Button size="lg">Large</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("h-10")
    })

    it("should apply icon size styles", () => {
      const { container } = render(<Button size="icon">Icon</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain("size-9")
    })
  })

  describe("CVA Variants", () => {
    it("should export buttonVariants function", () => {
      expect(buttonVariants).toBeDefined()
      expect(typeof buttonVariants).toBe("function")
    })

    it("buttonVariants should generate correct classes", () => {
      const defaultClasses = buttonVariants({ variant: "default", size: "default" })
      expect(defaultClasses).toContain("bg-primary")
    })
  })

  describe("Accessibility", () => {
    it("should support aria-label", () => {
      render(<Button aria-label="Add item">+</Button>)
      const button = screen.getByLabelText("Add item")
      expect(button).toBeInTheDocument()
    })

    it("should be keyboard accessible", () => {
      const { container } = render(<Button>Clickable</Button>)
      const button = container.querySelector("button")
      expect(button?.tagName).toBe("BUTTON")
    })
  })

  describe("Props", () => {
    it("should pass through HTML button attributes", () => {
      render(
        <Button className="custom-class" data-testid="custom-button">
          Test
        </Button>
      )
      const button = screen.getByTestId("custom-button")
      expect(button).toHaveClass("custom-class")
    })

    it("should handle click events", () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)
      screen.getByRole("button", { name: /click/i }).click()
      expect(handleClick).toHaveBeenCalled()
    })
  })
})

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "../card"

describe("Card Component", () => {
  describe("Rendering", () => {
    it("should render a card element", () => {
      const { container } = render(<Card>Test Card</Card>)
      const card = container.querySelector("div[data-slot='card']")
      expect(card).toBeInTheDocument()
      expect(card?.textContent).toContain("Test Card")
    })

    it("should render with correct base styles", () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.querySelector("div[data-slot='card']")
      expect(card?.className).toContain("rounded-xl")
      expect(card?.className).toContain("border")
      expect(card?.className).toContain("bg-card")
    })
  })

  describe("CardHeader", () => {
    it("should render card header", () => {
      const { container } = render(
        <Card>
          <CardHeader>Header Content</CardHeader>
        </Card>
      )
      const header = container.querySelector("div[data-slot='card-header']")
      expect(header).toBeInTheDocument()
      expect(header?.textContent).toContain("Header Content")
    })

    it("should have correct header styles", () => {
      const { container } = render(
        <Card>
          <CardHeader>Header</CardHeader>
        </Card>
      )
      const header = container.querySelector("div[data-slot='card-header']")
      expect(header?.className).toContain("px-6")
    })
  })

  describe("CardTitle", () => {
    it("should render card title", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>My Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText("My Title")).toBeInTheDocument()
    })

    it("should have correct title styles", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
        </Card>
      )
      const title = container.querySelector("div[data-slot='card-title']")
      expect(title?.className).toContain("font-semibold")
    })
  })

  describe("CardDescription", () => {
    it("should render card description", () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>My Description</CardDescription>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText("My Description")).toBeInTheDocument()
    })

    it("should have muted foreground style", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardDescription>Description</CardDescription>
          </CardHeader>
        </Card>
      )
      const description = container.querySelector(
        "div[data-slot='card-description']"
      )
      expect(description?.className).toContain("text-muted-foreground")
    })
  })

  describe("CardContent", () => {
    it("should render card content", () => {
      render(
        <Card>
          <CardContent>Content Area</CardContent>
        </Card>
      )
      expect(screen.getByText("Content Area")).toBeInTheDocument()
    })

    it("should have correct content padding", () => {
      const { container } = render(
        <Card>
          <CardContent>Content</CardContent>
        </Card>
      )
      const content = container.querySelector("div[data-slot='card-content']")
      expect(content?.className).toContain("px-6")
    })
  })

  describe("CardFooter", () => {
    it("should render card footer", () => {
      render(
        <Card>
          <CardFooter>Footer Content</CardFooter>
        </Card>
      )
      expect(screen.getByText("Footer Content")).toBeInTheDocument()
    })

    it("should have flex layout", () => {
      const { container } = render(
        <Card>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      const footer = container.querySelector("div[data-slot='card-footer']")
      expect(footer?.className).toContain("flex")
    })
  })

  describe("CardAction", () => {
    it("should render card action", () => {
      render(
        <Card>
          <CardHeader>
            <CardAction>Action Button</CardAction>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText("Action Button")).toBeInTheDocument()
    })

    it("should have correct positioning", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardAction>Action</CardAction>
          </CardHeader>
        </Card>
      )
      const action = container.querySelector("div[data-slot='card-action']")
      expect(action?.className).toContain("col-start-2")
    })
  })

  describe("Complete Card Structure", () => {
    it("should render complete card with all sections", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      )

      expect(container.querySelector("div[data-slot='card']")).toBeInTheDocument()
      expect(container.querySelector("div[data-slot='card-header']")).toBeInTheDocument()
      expect(container.querySelector("div[data-slot='card-title']")).toBeInTheDocument()
      expect(
        container.querySelector("div[data-slot='card-description']")
      ).toBeInTheDocument()
      expect(container.querySelector("div[data-slot='card-action']")).toBeInTheDocument()
      expect(container.querySelector("div[data-slot='card-content']")).toBeInTheDocument()
      expect(container.querySelector("div[data-slot='card-footer']")).toBeInTheDocument()
    })

    it("should render with custom classes", () => {
      const { container } = render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
          </CardHeader>
        </Card>
      )

      expect(container.querySelector("div[data-slot='card']")).toHaveClass(
        "custom-card"
      )
      expect(container.querySelector("div[data-slot='card-header']")).toHaveClass(
        "custom-header"
      )
      expect(container.querySelector("div[data-slot='card-title']")).toHaveClass(
        "custom-title"
      )
    })
  })

  describe("Accessibility", () => {
    it("should use semantic HTML structure", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )

      const card = container.querySelector("div[data-slot='card']")
      expect(card?.tagName).toBe("DIV")
    })

    it("should support aria attributes", () => {
      const { container } = render(
        <Card aria-label="User Profile Card">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
        </Card>
      )

      const card = container.querySelector("div[data-slot='card']")
      expect(card).toHaveAttribute("aria-label", "User Profile Card")
    })
  })

  describe("Props Passing", () => {
    it("should pass through HTML attributes", () => {
      const { container } = render(
        <Card data-testid="my-card" id="test-card">
          Content
        </Card>
      )

      const card = container.querySelector("[data-testid='my-card']")
      expect(card).toHaveAttribute("id", "test-card")
    })

    it("should merge custom className with default styles", () => {
      const { container } = render(
        <Card className="rounded-lg">Content</Card>
      )

      const card = container.querySelector("div[data-slot='card']")
      expect(card?.className).toContain("rounded-lg")
      expect(card?.className).toContain("border")
    })
  })
})

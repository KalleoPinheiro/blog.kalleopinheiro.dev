import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/utils/site-config", () => ({
  siteConfig: {
    name: "Test Blog",
    url: "https://test.example.com",
    defaultLocale: "pt-BR",
    description: "Test description.",
    feed: {
      title: "Test Blog",
      description: "Test description.",
      language: "pt-BR",
    },
    social: { github: "testuser" },
  },
}));

import Page from "@/app/(public)/page";

describe("Welcome page", () => {
  it("renders exactly one h1 with the site name", () => {
    // Arrange
    const sut = <Page />;

    // Act
    render(sut);

    // Assert
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Test Blog");
  });

  it("renders a main landmark", () => {
    // Arrange
    const sut = <Page />;

    // Act
    render(sut);

    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders a Portuguese tagline", () => {
    // Arrange
    const sut = <Page />;

    // Act
    render(sut);

    // Assert
    expect(screen.getByText(/em breve/i)).toBeInTheDocument();
  });
});

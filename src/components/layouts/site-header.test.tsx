import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/site-config", () => ({
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

import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("renders the site name", () => {
    // Arrange
    const sut = <SiteHeader />;

    // Act
    render(sut);

    // Assert
    expect(screen.getByText("Test Blog")).toBeInTheDocument();
  });

  it("renders a banner landmark", () => {
    // Arrange
    const sut = <SiteHeader />;

    // Act
    render(sut);

    // Assert
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});

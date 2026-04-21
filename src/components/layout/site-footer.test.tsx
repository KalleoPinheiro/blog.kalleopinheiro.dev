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

import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("renders the site name in the copyright notice", () => {
    // Arrange
    const sut = <SiteFooter />;

    // Act
    render(sut);

    // Assert
    expect(screen.getByText(/Test Blog/)).toBeInTheDocument();
  });

  it("renders a contentinfo landmark", () => {
    // Arrange
    const sut = <SiteFooter />;

    // Act
    render(sut);

    // Assert
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});

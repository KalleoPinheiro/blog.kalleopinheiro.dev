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

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans", className: "geist-sans" }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
    className: "geist-mono",
  }),
}));

import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("renders a banner landmark from SiteHeader", () => {
    // Arrange
    const sut = <RootLayout>{"content"}</RootLayout>;

    // Act
    render(sut);

    // Assert
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders a contentinfo landmark from SiteFooter", () => {
    // Arrange
    const sut = <RootLayout>{"content"}</RootLayout>;

    // Act
    render(sut);

    // Assert
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders children inside the layout", () => {
    // Arrange
    const sut = <RootLayout>{"hello world"}</RootLayout>;

    // Act
    render(sut);

    // Assert
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });
});

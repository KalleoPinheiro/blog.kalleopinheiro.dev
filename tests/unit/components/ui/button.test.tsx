import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with text content", () => {
    // Arrange
    const sut = <Button>Click me</Button>;

    // Act
    render(sut);

    // Assert
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("applies the default variant classes", () => {
    // Arrange
    const sut = <Button variant="default">Default</Button>;

    // Act
    render(sut);

    // Assert
    const button = screen.getByRole("button", { name: "Default" });
    expect(button).toHaveClass("bg-primary");
  });
});

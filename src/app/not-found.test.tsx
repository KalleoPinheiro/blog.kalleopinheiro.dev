import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "./not-found";

describe("NotFound page", () => {
  it("renders a main landmark", () => {
    // Arrange
    const sut = <NotFound />;

    // Act
    render(sut);

    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it('renders "404" text', () => {
    // Arrange
    const sut = <NotFound />;

    // Act
    render(sut);

    // Assert
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });
});

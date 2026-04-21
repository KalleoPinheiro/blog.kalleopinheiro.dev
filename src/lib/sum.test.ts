import { describe, expect, it } from "vitest";

import { sum } from "./sum";

describe("sum", () => {
  it("returns the sum of two positive numbers", () => {
    // Arrange
    const sut = sum;

    // Act
    const result = sut(2, 3);

    // Assert
    expect(result).toBe(5);
  });

  it("handles negative numbers", () => {
    // Arrange
    const sut = sum;

    // Act
    const result = sut(-1, -2);

    // Assert
    expect(result).toBe(-3);
  });

  it("returns zero when both inputs are zero", () => {
    // Arrange
    const sut = sum;

    // Act
    const result = sut(0, 0);

    // Assert
    expect(result).toBe(0);
  });
});

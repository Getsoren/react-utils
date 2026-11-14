import { describe, expect, it } from "vitest";
import formatDecimal from "./formatDecimal";

describe("formatDecimal", () => {
  it("should write a number held with a point as the language does", () => {
    expect(formatDecimal("12.3", "fr")).toBe("12,3");
    expect(formatDecimal("-200.00", "fr")).toBe("-200,00");
    expect(formatDecimal("12.3", "en")).toBe("12.3");
    expect(formatDecimal("64", "fr")).toBe("64");
  });

  it("should follow a number while it is typed", () => {
    expect(formatDecimal("12.", "fr")).toBe("12,");
    expect(formatDecimal(".5", "fr")).toBe(",5");
  });

  it("should keep any other text as it is", () => {
    expect(formatDecimal("", "fr")).toBe("");
    expect(formatDecimal("v2.1 du contrat", "fr")).toBe("v2.1 du contrat");
    expect(formatDecimal("1e3", "fr")).toBe("1e3");
    expect(formatDecimal("1.2.3", "fr")).toBe("1.2.3");
  });
});

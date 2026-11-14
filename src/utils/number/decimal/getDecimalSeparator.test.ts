import { describe, expect, it } from "vitest";
import getDecimalSeparator from "./getDecimalSeparator";

describe("getDecimalSeparator", () => {
  it("should return the separator the language writes numbers with", () => {
    expect(getDecimalSeparator("fr")).toBe(",");
    expect(getDecimalSeparator("fr-FR")).toBe(",");
    expect(getDecimalSeparator("de")).toBe(",");
    expect(getDecimalSeparator("en")).toBe(".");
    expect(getDecimalSeparator("en-GB")).toBe(".");
  });

  it("should answer in Latin digits for a language that writes with other digits", () => {
    expect(getDecimalSeparator("ar")).toBe(".");
  });

  it("should accept a tag that carries its own extensions", () => {
    expect(getDecimalSeparator("fr-FR-u-fw-mon-mu-celsius")).toBe(",");
  });

  it("should fall back on a point for a language the platform does not know", () => {
    expect(getDecimalSeparator("not a language")).toBe(".");
    expect(getDecimalSeparator("")).toBe(".");
  });
});

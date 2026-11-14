import { describe, expect, it } from "vitest";
import toDecimalInput from "./toDecimalInput";

describe("toDecimalInput", () => {
  it("should hold a decimal comma as a point, while it is typed too", () => {
    expect(toDecimalInput("2,5")).toBe("2.5");
    expect(toDecimalInput("12,")).toBe("12.");
    expect(toDecimalInput(",5")).toBe(".5");
  });

  it("should keep every decimal when no maximum is given", () => {
    expect(toDecimalInput("33,333")).toBe("33.333");
  });

  it("should keep the given number of decimals at most", () => {
    expect(toDecimalInput("12.345", 2)).toBe("12.34");
    expect(toDecimalInput("12,3", 2)).toBe("12.3");
    expect(toDecimalInput("12,5", 0)).toBe("12");
  });

  it("should drop anything but digits and one separator, a sign included", () => {
    expect(toDecimalInput("1 200 m²")).toBe("1200");
    expect(toDecimalInput("1,2.3")).toBe("1.2");
    expect(toDecimalInput("-30")).toBe("30");
    expect(toDecimalInput("abc")).toBe("");
    expect(toDecimalInput("")).toBe("");
  });
});

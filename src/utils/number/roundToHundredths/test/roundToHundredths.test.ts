import { describe, expect, it } from "vitest";
import roundToHundredths from "../roundToHundredths";

describe("roundToHundredths", () => {
  it("rounds to the cent", () => {
    expect(roundToHundredths(106.255)).toBe(106.26);
    expect(roundToHundredths(4249.999)).toBe(4250);
  });

  it("keeps a value already rounded", () => {
    expect(roundToHundredths(7.5)).toBe(7.5);
    expect(roundToHundredths(0)).toBe(0);
  });

  it("rounds a negative value", () => {
    expect(roundToHundredths(-1.234)).toBe(-1.23);
  });
});

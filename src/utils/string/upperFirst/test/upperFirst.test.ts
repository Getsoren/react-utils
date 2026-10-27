import { describe, expect, it } from "vitest";
import upperFirst from "../upperFirst";

describe("upperFirst", () => {
  it("should uppercase the first letter of a string", () => {
    expect(upperFirst("mini pelle 1,5 T")).toBe("Mini pelle 1,5 T");
  });

  it("should keep the rest of the string as written", () => {
    expect(upperFirst("PEMP 12m")).toBe("PEMP 12m");
    expect(upperFirst("groupe 60 kVA")).toBe("Groupe 60 kVA");
  });

  it("should uppercase an accented first letter", () => {
    expect(upperFirst("électrique")).toBe("Électrique");
  });

  it("should return an empty string if the input is null, undefined or empty", () => {
    expect(upperFirst(null)).toBe("");
    expect(upperFirst(undefined)).toBe("");
    expect(upperFirst("")).toBe("");
  });

  it("should return an empty string if the input is not a string", () => {
    expect(upperFirst(42)).toBe("");
  });
});

import { describe, expect, it } from "vitest";
import normalizeSearch from "../normalizeSearch";

describe("normalizeSearch", () => {
  it("compares texts whatever their case, accents and surrounding spaces", () => {
    expect(normalizeSearch("  Nacelle Électrique ")).toBe("nacelle electrique");
    expect(normalizeSearch("Pelle à chenilles")).toBe("pelle a chenilles");
  });

  it("leaves an already plain text as it is", () => {
    expect(normalizeSearch("scissor-lift")).toBe("scissor-lift");
    expect(normalizeSearch("")).toBe("");
  });
});

import { describe, expect, it } from "vitest";
import toReadableName from "../toReadableName";

describe("toReadableName", () => {
  it("capitalizes the words of a name written in capitals, its small words in lower case", () => {
    expect(["KILOUTOU - QUETIGNY", "ÉTAIS DE MAÇON"].map(toReadableName)).toEqual(["Kiloutou - Quetigny", "Étais de Maçon"]);
  });

  it("leaves a catalog's note between brackets or parentheses as written", () => {
    expect(toReadableName("PELLE À PNEUS 10-11T [avec chauffeur]")).toBe("Pelle à Pneus 10-11t [avec chauffeur]");
    expect(toReadableName("NACELLE (ÉLEC) 12M")).toBe("Nacelle (ÉLEC) 12m");
  });

  it("leaves a name in mixed case as written, its acronyms with it", () => {
    expect(["Dumper diesel gyrabenne CU 6.0 t", "Mini-pelle 2,7 t + godets"].map(toReadableName)).toEqual([
      "Dumper diesel gyrabenne CU 6.0 t",
      "Mini-pelle 2,7 t + godets",
    ]);
  });
});

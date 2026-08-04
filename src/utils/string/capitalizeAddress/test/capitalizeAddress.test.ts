import { describe, expect, it } from "vitest";
import capitalizeAddress from "../capitalizeAddress";

describe("capitalizeAddress", () => {
  it("should keep particles lowercase in an all-caps street name", () => {
    expect(capitalizeAddress("RUE DE LA PAIX")).toBe("Rue de la Paix");
    expect(capitalizeAddress("12 RUE DE LA PAIX")).toBe("12 Rue de la Paix");
  });

  it("should capitalize after hyphens", () => {
    expect(capitalizeAddress("SAINT-ÉTIENNE")).toBe("Saint-Étienne");
    expect(capitalizeAddress("AIX-EN-PROVENCE")).toBe("Aix-en-Provence");
    expect(capitalizeAddress("SAINT-OUEN-SUR-SEINE")).toBe("Saint-Ouen-sur-Seine");
  });

  it("should capitalize after elisions and keep the elided particle lowercase", () => {
    expect(capitalizeAddress("RUE D'ALÉSIA")).toBe("Rue d'Alésia");
    expect(capitalizeAddress("L'HAŸ-LES-ROSES")).toBe("L'Haÿ-les-Roses");
  });

  it("should capitalize a leading particle", () => {
    expect(capitalizeAddress("LE HAVRE")).toBe("Le Havre");
    expect(capitalizeAddress("LA ROCHELLE")).toBe("La Rochelle");
  });

  it("should soften a single all-caps word", () => {
    expect(capitalizeAddress("PARIS")).toBe("Paris");
  });

  it("should leave a correctly cased value untouched", () => {
    expect(capitalizeAddress("Saint-Étienne")).toBe("Saint-Étienne");
    expect(capitalizeAddress("rue d'Alésia")).toBe("rue d'Alésia");
    expect(capitalizeAddress("McDonald")).toBe("McDonald");
  });

  it("should return undefined on empty input", () => {
    expect(capitalizeAddress("")).toBeUndefined();
    expect(capitalizeAddress(null)).toBeUndefined();
    expect(capitalizeAddress(undefined)).toBeUndefined();
  });
});

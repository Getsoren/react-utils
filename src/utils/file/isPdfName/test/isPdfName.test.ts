import { describe, expect, it } from "vitest";
import isPdfName from "../isPdfName";

describe("isPdfName", () => {
  it("tells a PDF by its extension, whatever its case", () => {
    expect(["bon.pdf", "BON.PDF", "dossier/bon.Pdf"].map(isPdfName)).toEqual([true, true, true]);
  });

  it("tells anything else apart", () => {
    expect(["bon.png", "pdf", "bon.pdf.zip", ""].map(isPdfName)).toEqual([false, false, false, false]);
  });
});

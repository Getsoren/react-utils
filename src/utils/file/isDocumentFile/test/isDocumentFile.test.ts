import { describe, expect, it } from "vitest";
import isDocumentFile from "../isDocumentFile";

const fileOf = (name: string, type: string) => new File(["x"], name, { type });

describe("isDocumentFile", () => {
  it("takes images and PDFs", () => {
    expect([fileOf("photo.jpg", "image/jpeg"), fileOf("bon.pdf", "application/pdf")].map(isDocumentFile)).toEqual([true, true]);
  });

  it("takes a PDF sent without its type, by its name", () => {
    expect(isDocumentFile(fileOf("bon.PDF", ""))).toBe(true);
  });

  it("leaves any other file out", () => {
    expect([fileOf("notes.txt", "text/plain"), fileOf("tableur.xlsx", "")].map(isDocumentFile)).toEqual([false, false]);
  });
});

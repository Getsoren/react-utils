import { describe, expect, it } from "vitest";
import fileKeyOf from "../fileKeyOf";

describe("fileKeyOf", () => {
  it("gives the same key to the same file picked again", () => {
    const fileOf = () => new File(["%PDF"], "bon.pdf", { lastModified: 1, type: "application/pdf" });

    expect(fileKeyOf(fileOf())).toBe(fileKeyOf(fileOf()));
  });

  it("tells apart two files of the same name", () => {
    const first = new File(["a"], "bon.pdf", { lastModified: 1 });
    const second = new File(["ab"], "bon.pdf", { lastModified: 2 });

    expect(fileKeyOf(first)).not.toBe(fileKeyOf(second));
  });
});

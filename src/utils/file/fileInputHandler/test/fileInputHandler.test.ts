import type { ChangeEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import fileInputHandler from "../fileInputHandler";

describe("fileInputHandler", () => {
  it("hands the picked files over, then empties the input to take the same files again", () => {
    const input = document.createElement("input");
    const file = new File(["x"], "bon.pdf", { type: "application/pdf" });
    const onFiles = vi.fn();

    input.type = "file";
    Object.defineProperty(input, "files", { value: [file] });
    fileInputHandler(onFiles)({ target: input } as unknown as ChangeEvent<HTMLInputElement>);

    expect(onFiles).toHaveBeenCalledWith([file]);
    expect(input.value).toBe("");
  });

  it("hands nothing over when no file is picked", () => {
    const input = document.createElement("input");
    const onFiles = vi.fn();

    input.type = "file";
    Object.defineProperty(input, "files", { value: null });
    fileInputHandler(onFiles)({ target: input } as unknown as ChangeEvent<HTMLInputElement>);

    expect(onFiles).toHaveBeenCalledWith([]);
  });
});

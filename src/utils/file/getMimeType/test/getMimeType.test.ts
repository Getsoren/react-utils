import { describe, expect, it } from "vitest";
import getMimeType from "../getMimeType";

describe("getMimeType", () => {
  it("trusts a reliable type from the source", () => {
    expect(getMimeType("photo.png", "image/jpeg")).toBe("image/jpeg");
  });

  it("infers the type from the extension when the source says nothing useful", () => {
    expect(getMimeType("delivery.PDF", "application/octet-stream")).toBe("application/pdf");
    expect(getMimeType("site.heic")).toBe("image/heic");
    expect(getMimeType("site.jpg", "")).toBe("image/jpeg");
  });

  it("keeps the generic type, or nothing, for an unknown extension", () => {
    expect(getMimeType("archive.zip", "application/octet-stream")).toBe("application/octet-stream");
    expect(getMimeType("archive.zip")).toBe("");
  });
});

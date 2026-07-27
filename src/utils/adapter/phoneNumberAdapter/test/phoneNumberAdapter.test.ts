import { describe, expect, it } from "vitest";
import phoneNumberAdapter from "../phoneNumberAdapter";

describe("phoneNumberAdapter", () => {
  it("formats French phone numbers correctly without prefix", () => {
    expect(phoneNumberAdapter("0123456789")).toBe("01 23 45 67 89");
    expect(phoneNumberAdapter("33123456789")).toBe("01 23 45 67 89");
  });

  it("formats French phone numbers correctly with prefix", () => {
    // The international form drops the national leading 0.
    expect(phoneNumberAdapter("33123456789", { addPrefix: true })).toBe("+33 1 23 45 67 89");
    expect(phoneNumberAdapter("0123456789", { addPrefix: true })).toBe("+33 1 23 45 67 89");
  });

  it("formats UK phone numbers correctly without prefix", () => {
    expect(phoneNumberAdapter("441234567890")).toBe("1234 567 890");
  });

  it("formats UK phone numbers correctly with prefix", () => {
    expect(phoneNumberAdapter("441234567890", { addPrefix: true })).toBe("+44 1234 567 890");
  });

  it("formats German phone numbers correctly without prefix", () => {
    expect(phoneNumberAdapter("4915123456789")).toBe("0151 234 56789");
  });

  it("formats German phone numbers correctly with prefix", () => {
    expect(phoneNumberAdapter("4915123456789", { addPrefix: true })).toBe("+49 151 234 56789");
  });

  it("formats Spanish phone numbers correctly without prefix", () => {
    expect(phoneNumberAdapter("34987654321")).toBe("987 654 321");
  });

  it("formats Spanish phone numbers correctly with prefix", () => {
    expect(phoneNumberAdapter("34987654321", { addPrefix: true })).toBe("+34 987 654 321");
  });

  it("removes non-digit characters from phone numbers", () => {
    expect(phoneNumberAdapter("+33 (0)123-45-67-89")).toBe("01 23 45 67 89");
  });

  it("handles unsupported country codes gracefully", () => {
    expect(phoneNumberAdapter("991234567890")).toBe("99 12 34 56 78 90");
  });

  it("handles empty or nullish input gracefully", () => {
    expect(phoneNumberAdapter("")).toBe("");
    expect(phoneNumberAdapter(null)).toBe("");
    expect(phoneNumberAdapter(undefined)).toBe("");
    expect(phoneNumberAdapter()).toBe("");
  });

  it("returns digit-free input untouched instead of erasing it", () => {
    expect(phoneNumberAdapter("abcdef")).toBe("abcdef");
    expect(phoneNumberAdapter("  n/a ")).toBe("n/a");
  });

  it("groups by pairs instead of truncating when the length does not match the detected country", () => {
    expect(phoneNumberAdapter("06123456789")).toBe("06 12 34 56 78 9");
    expect(phoneNumberAdapter("3498765432109")).toBe("34 98 76 54 32 10 9");
  });

  it("formats US phone numbers correctly without prefix", () => {
    expect(phoneNumberAdapter("1234567890")).toBe("(123) 456-7890");
  });

  it("formats US phone numbers correctly with prefix", () => {
    expect(phoneNumberAdapter("11234567890", { addPrefix: true })).toBe("+1 (123) 456-7890");
  });

  it("handles mixed inputs with US numbers", () => {
    expect(phoneNumberAdapter("+1-123-456-7890")).toBe("(123) 456-7890");
  });

  it("formats phone numbers correctly with a custom separator", () => {
    expect(phoneNumberAdapter("0123456789", { separator: "-" })).toBe("01-23-45-67-89");
    expect(phoneNumberAdapter("33123456789", { separator: "." })).toBe("01.23.45.67.89");
    expect(phoneNumberAdapter("441234567890", { separator: "/" })).toBe("1234/567/890");
    expect(phoneNumberAdapter("1234567890", { separator: "·" })).toBe("(123)·456-7890");
  });
});

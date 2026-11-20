import { afterEach, describe, expect, it } from "vitest";
import scrollParentOf from "../scrollParentOf";

/**
 * Nests boxes in the page, the first outermost, each with the given `overflow-y`; returns them and an element inside.
 */
const nest = (...overflows: string[]) => {
  const boxes = overflows.map((overflowY) => {
    const box = document.createElement("div");

    box.style.overflowY = overflowY;

    return box;
  });
  const element = document.createElement("div");

  [...boxes, element].reduce((parent, child) => {
    parent.append(child);

    return child;
  }, document.body as HTMLElement);

  return { boxes, element };
};

afterEach(() => {
  document.body.replaceChildren();
});

describe("scrollParentOf", () => {
  it("returns the parent whose content scrolls", () => {
    const { boxes, element } = nest("auto");

    expect(scrollParentOf(element)).toBe(boxes[0]);
  });

  it("takes a box that always scrolls as one that scrolls when needed", () => {
    const { boxes, element } = nest("scroll");

    expect(scrollParentOf(element)).toBe(boxes[0]);
  });

  it("goes past the boxes that hide or show their overflow", () => {
    const { boxes, element } = nest("auto", "hidden", "visible");

    expect(scrollParentOf(element)).toBe(boxes[0]);
  });

  it("stops at the nearest scrolling ancestor, not an outer one", () => {
    const { boxes, element } = nest("auto", "auto");

    expect(scrollParentOf(element)).toBe(boxes[1]);
  });

  it("returns null when only the page scrolls", () => {
    const { element } = nest("hidden");

    expect(scrollParentOf(element)).toBeNull();
  });

  it("returns null for an element outside the page", () => {
    expect(scrollParentOf(document.createElement("div"))).toBeNull();
  });
});

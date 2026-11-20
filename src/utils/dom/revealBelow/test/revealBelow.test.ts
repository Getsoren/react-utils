import { afterEach, describe, expect, it, vi } from "vitest";
import revealBelow from "../revealBelow";

/**
 * A pane that scrolls, the element inside it. jsdom has no `scrollBy`: each box gets a mock of its own.
 */
const layoutOf = () => {
  const pane = document.createElement("div");
  const element = document.createElement("div");

  pane.style.overflowY = "auto";
  Object.defineProperty(pane, "scrollBy", { value: vi.fn() });
  pane.append(element);
  document.body.append(pane);

  return { element, pane };
};

const rectOf = (top: number, height: number) => ({ bottom: top + height, height, top }) as DOMRect;

afterEach(() => {
  document.body.replaceChildren();
});

describe("revealBelow", () => {
  it("scrolls the pane just enough for what opens under the element to show in the window", () => {
    const { element, pane } = layoutOf();

    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rectOf(window.innerHeight - 100, 40));
    revealBelow(element, 500);

    expect(pane.scrollBy).toHaveBeenCalledWith({ behavior: "smooth", top: 440 });
  });

  it("leaves the pane as it is when there is room enough", () => {
    const { element, pane } = layoutOf();

    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rectOf(0, 40));
    revealBelow(element, 100);

    expect(pane.scrollBy).not.toHaveBeenCalled();
  });

  it("leaves the pane as it is when what opens ends right at the window's foot", () => {
    const { element, pane } = layoutOf();

    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rectOf(window.innerHeight - 140, 40));
    revealBelow(element, 100);

    expect(pane.scrollBy).not.toHaveBeenCalled();
  });

  it("does nothing when only the page scrolls", () => {
    const element = document.createElement("div");

    document.body.append(element);
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rectOf(window.innerHeight, 40));

    expect(() => revealBelow(element, 100)).not.toThrow();
  });
});

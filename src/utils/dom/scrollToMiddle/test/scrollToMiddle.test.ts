import { afterEach, describe, expect, it, vi } from "vitest";
import scrollToMiddle from "../scrollToMiddle";

/**
 * A pane that scrolls, in a frame that hides its overflow, the element inside both: a form in its dialog. jsdom has no
 * `scrollBy`: each box gets a mock of its own.
 */
const layoutOf = () => {
  const frame = document.createElement("div");
  const pane = document.createElement("div");
  const element = document.createElement("div");

  frame.style.overflowY = "hidden";
  pane.style.overflowY = "auto";
  Object.defineProperty(frame, "scrollBy", { value: vi.fn() });
  Object.defineProperty(pane, "scrollBy", { value: vi.fn() });
  frame.append(pane);
  pane.append(element);
  document.body.append(frame);

  return { element, frame, pane };
};

const rectOf = (top: number, height: number) => ({ bottom: top + height, height, top }) as DOMRect;

afterEach(() => {
  document.body.replaceChildren();
});

describe("scrollToMiddle", () => {
  it("scrolls the pane down, so that an element below its middle stands in it", () => {
    const { element, pane } = layoutOf();

    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rectOf(700, 40));
    vi.spyOn(pane, "getBoundingClientRect").mockReturnValue(rectOf(100, 600));
    scrollToMiddle(element);

    expect(pane.scrollBy).toHaveBeenCalledWith({ behavior: "smooth", top: 320 });
  });

  it("scrolls the pane up for an element above its middle", () => {
    const { element, pane } = layoutOf();

    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rectOf(0, 40));
    vi.spyOn(pane, "getBoundingClientRect").mockReturnValue(rectOf(100, 600));
    scrollToMiddle(element);

    expect(pane.scrollBy).toHaveBeenCalledWith({ behavior: "smooth", top: -380 });
  });

  it("leaves the frame around the pane as it is", () => {
    const { element, frame, pane } = layoutOf();

    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(rectOf(700, 40));
    vi.spyOn(pane, "getBoundingClientRect").mockReturnValue(rectOf(100, 600));
    scrollToMiddle(element);

    expect(frame.scrollBy).not.toHaveBeenCalled();
  });

  it("does nothing when only the page scrolls", () => {
    const element = document.createElement("div");
    const spy = vi.spyOn(element, "getBoundingClientRect");

    document.body.append(element);
    scrollToMiddle(element);

    expect(spy).not.toHaveBeenCalled();
  });
});

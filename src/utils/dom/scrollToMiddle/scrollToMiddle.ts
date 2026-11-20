import scrollParentOf from "@/utils/dom/scrollParentOf/scrollParentOf";

/**
 * Scrolls an element's own scrolling ancestor, smoothly, so that the element stands in its middle. Unlike
 * `scrollIntoView`, no other ancestor moves: one that hides its overflow, as a dialog's frame, would stay shifted with
 * no way back. Nothing happens when only the page scrolls.
 * @param element
 */
const scrollToMiddle = (element: HTMLElement): void => {
  const parent = scrollParentOf(element);

  if (!parent) {
    return;
  }

  const { height, top } = element.getBoundingClientRect();
  const frame = parent.getBoundingClientRect();

  parent.scrollBy({ behavior: "smooth", top: top + height / 2 - (frame.top + frame.height / 2) });
};

export default scrollToMiddle;

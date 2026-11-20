import scrollParentOf from "@/utils/dom/scrollParentOf/scrollParentOf";

/**
 * Scrolls an element's own scrolling ancestor, smoothly, just enough for `height` pixels under the element to show in
 * the window rather than be cut at its foot: a menu opened under it. Nothing happens when they fit already.
 * @param element
 * @param height
 */
const revealBelow = (element: HTMLElement, height: number): void => {
  const overflow = element.getBoundingClientRect().bottom + height - window.innerHeight;

  if (overflow > 0) {
    scrollParentOf(element)?.scrollBy({ behavior: "smooth", top: overflow });
  }
};

export default revealBelow;

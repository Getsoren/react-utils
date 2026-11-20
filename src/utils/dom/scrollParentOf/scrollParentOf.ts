/**
 * The nearest ancestor an element scrolls in: the first whose content scrolls vertically (`overflow-y` `auto` or
 * `scroll`). None when only the page does.
 * Example: scrollParentOf(rowInADialog) -> the dialog's scrolling content
 * @param element
 */
const scrollParentOf = (element: HTMLElement): HTMLElement | null => {
  const parent = element.parentElement;

  if (!parent) {
    return null;
  }

  const { overflowY } = getComputedStyle(parent);

  return overflowY === "auto" || overflowY === "scroll" ? parent : scrollParentOf(parent);
};

export default scrollParentOf;

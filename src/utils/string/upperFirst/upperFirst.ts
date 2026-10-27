/**
 * Uppercase the first letter of a string and keep the rest as written, unlike `capitalize` which lowercases it
 * Example: upperFirst("pEMP 12m") -> "PEMP 12m"
 * @param string
 */
const upperFirst = (string?: unknown): string => {
  if (!string || typeof string !== "string") {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default upperFirst;

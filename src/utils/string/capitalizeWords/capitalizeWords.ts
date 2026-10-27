import upperFirst from "@/utils/string/upperFirst/upperFirst";

/**
 * Capitalize words in a given string
 * Example: capitalizeWords("hello world") -> "Hello World"
 * @param words
 */
const capitalizeWords = (words?: unknown): string => {
  if (!words || typeof words !== "string") {
    return "";
  }

  return words?.toLowerCase().split(" ").map(upperFirst).join(" ");
};

export default capitalizeWords;

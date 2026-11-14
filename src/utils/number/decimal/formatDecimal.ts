import getDecimalSeparator from "@/utils/number/decimal/getDecimalSeparator";

// Digits with one decimal point at most, which may end the text while the number is being typed
const DECIMAL = /^-?(\d+\.?\d*|\.\d+)$/;

/**
 * Write a decimal number held with a point as a language writes it, while it is typed too
 * Any other text is kept as it is, so a field can show whatever it holds
 * Example: formatDecimal("12.5", "fr") -> "12,5"
 * @param text A number held with a point, as `toDecimalInput` keeps it or as an API stores it
 * @param language A BCP 47 language tag ("fr", "en-GB")
 */
const formatDecimal = (text: string, language: string): string =>
  DECIMAL.test(text) ? text.replace(".", getDecimalSeparator(language)) : text;

export default formatDecimal;

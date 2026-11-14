/**
 * Get the decimal separator a language writes numbers with, in Latin digits
 * Falls back on a point for a language the platform does not know
 * Example: getDecimalSeparator("fr") -> ","
 * @param language A BCP 47 language tag ("fr", "en-GB")
 */
const getDecimalSeparator = (language: string): "," | "." => {
  try {
    return new Intl.NumberFormat(language, { numberingSystem: "latn" }).format(1.5).includes(",") ? "," : ".";
  } catch {
    return ".";
  }
};

export default getDecimalSeparator;

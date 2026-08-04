// Particles kept lowercase inside French (and common romance) place and street names.
const PARTICLES = new Set([
  "a",
  "à",
  "au",
  "aux",
  "d",
  "da",
  "de",
  "del",
  "des",
  "di",
  "du",
  "e",
  "el",
  "en",
  "et",
  "l",
  "la",
  "le",
  "les",
  "lès",
  "los",
  "sous",
  "sur",
  "y",
]);

// A word is a run of anything that is not a separator (space, hyphen, straight or curly apostrophe).
const WORD_REGEX = /[^\s\-'’]+/g;

/**
 * Turns an ALL-CAPS address label into its typographic casing, and leaves anything else untouched:
 * a value already cased correctly ("Saint-Étienne", "rue d'Alésia") must not be reprocessed.
 * Capitals follow toponym rules — after spaces, hyphens and elisions, with particles kept
 * lowercase except on the first word.
 * Returns undefined on empty input so downstream fallbacks (`?? "-"`) keep working.
 * Examples:
 *   capitalizeAddress("RUE DE LA PAIX") -> "Rue de la Paix"
 *   capitalizeAddress("SAINT-ÉTIENNE") -> "Saint-Étienne"
 *   capitalizeAddress("L'HAŸ-LES-ROSES") -> "L'Haÿ-les-Roses"
 * @param value
 */
const capitalizeAddress = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (value !== value.toUpperCase()) {
    return value;
  }

  let isFirstWord = true;

  return value.toLowerCase().replace(WORD_REGEX, (word) => {
    if (!isFirstWord && PARTICLES.has(word)) {
      return word;
    }

    isFirstWord = false;

    return word.charAt(0).toUpperCase() + word.slice(1);
  });
};

export default capitalizeAddress;

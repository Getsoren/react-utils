/**
 * Lowercase, without accents nor surrounding spaces, so two texts compare whatever their spelling.
 * Example: normalizeSearch("  Nacelle Électrique ") -> "nacelle electrique"
 * @param value
 */
const normalizeSearch = (value: string): string => value.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

export default normalizeSearch;

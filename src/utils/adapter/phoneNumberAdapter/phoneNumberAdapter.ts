/**
 * Formats a phone number based on its country code or a default French format.
 *
 * @param phoneNumber The phone number to format (can include country code). Nullish values return "".
 * @param options Optional configuration:
 *  - `addPrefix` (boolean): Add the international prefix (+33, +44, etc.). Default is `false`.
 *  - `separator` (string): Character to separate number groups. Default is a space (" ").
 * @returns The formatted phone number.
 *
 * Usage examples:
 * - phoneNumberAdapter('0123456789') -> "01 23 45 67 89"
 * - phoneNumberAdapter('33123456789') -> "01 23 45 67 89"
 * - phoneNumberAdapter('33123456789', { addPrefix: true }) -> "+33 1 23 45 67 89"
 * - phoneNumberAdapter('1234567890', { separator: '-' }) -> "(123)-456-7890".
 *
 * Input that contains no digit at all (free text such as an extension note) is
 * returned untouched rather than erased, and a number whose length does not
 * match the detected country is grouped by pairs instead of being truncated.
 *
 * @SupportedCountries:
 * | Country Code | Country        | Expected Format       |
 * |--------------|----------------|-----------------------|
 * | 33           | France         | 01 23 45 67 89        |
 * | 44           | United Kingdom | 1234 567 890          |
 * | 49           | Germany        | 0151 234 56789        |
 * | 34           | Spain          | 987 654 321           |
 * | 1            | United States  | (123) 456-7890        |
 */
const phoneNumberAdapter = (phoneNumber?: string | null, options: { addPrefix?: boolean; separator?: string } = {}): string => {
  const { addPrefix = false, separator = " " } = options;

  if (!phoneNumber) {
    return "";
  }

  const trimmed = phoneNumber.trim();
  const validPhoneNumber = trimmed.replace(/\D/g, "");

  if (!validPhoneNumber) {
    return trimmed;
  }

  const detectedCountryCode = (() => {
    if (validPhoneNumber.startsWith("1")) {
      return "us";
    }
    const prefix = validPhoneNumber.slice(0, 2);

    // French phone numbers can start with 0* or 33
    if (validPhoneNumber.startsWith("0")) {
      return "fr";
    }

    switch (prefix) {
      case "33":
        return "fr";
      case "44":
        return "uk";
      case "49":
        return "de";
      case "34":
        return "es";
      default:
        return "unknown";
    }
  })();

  const groupByPairs = (digits: string) => digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

  // { dialCode, national } per country; null when the digits do not fit the
  // detected country's length, in which case we fall back to pair grouping
  // rather than truncating digits away.
  const parsed = (() => {
    switch (detectedCountryCode) {
      case "fr": {
        const numberWithoutCountryCode = validPhoneNumber.startsWith("33") ? validPhoneNumber.slice(2) : validPhoneNumber;
        const localNumber = numberWithoutCountryCode.startsWith("0") ? numberWithoutCountryCode : `0${numberWithoutCountryCode}`;
        return localNumber.length === 10 ? { dialCode: "33", national: groupByPairs(localNumber) } : null;
      }
      case "uk": {
        const numberWithoutCountryCode = validPhoneNumber.startsWith("44") ? validPhoneNumber.slice(2) : validPhoneNumber;
        return numberWithoutCountryCode.length === 10
          ? { dialCode: "44", national: numberWithoutCountryCode.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3") }
          : null;
      }
      case "de": {
        const numberWithoutCountryCode = validPhoneNumber.startsWith("49") ? validPhoneNumber.slice(2) : validPhoneNumber;
        const localNumber = numberWithoutCountryCode.startsWith("0") ? numberWithoutCountryCode : `0${numberWithoutCountryCode}`;
        return { dialCode: "49", national: localNumber.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3") };
      }
      case "es": {
        const numberWithoutCountryCode = validPhoneNumber.startsWith("34") ? validPhoneNumber.slice(2) : validPhoneNumber;
        return numberWithoutCountryCode.length === 9
          ? { dialCode: "34", national: numberWithoutCountryCode.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") }
          : null;
      }
      case "us": {
        const numberWithoutCountryCode = validPhoneNumber.length === 11 ? validPhoneNumber.slice(1) : validPhoneNumber;
        return numberWithoutCountryCode.length === 10
          ? { dialCode: "1", national: numberWithoutCountryCode.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") }
          : null;
      }
      default:
        return null;
    }
  })();

  const formatWithSeparator = (str: string) => str.replace(/ /g, separator);

  if (!parsed) {
    // Unknown country or length mismatch: group by pairs without splitting a
    // dialling code we cannot identify reliably.
    const grouped = formatWithSeparator(groupByPairs(validPhoneNumber));
    return addPrefix ? `+${grouped}` : grouped;
  }

  if (addPrefix) {
    // International form drops the national leading 0: "+33 1 23 45 67 89",
    // never "+33 01 23 45 67 89".
    return `+${parsed.dialCode}${separator}${formatWithSeparator(parsed.national.replace(/^0/, ""))}`;
  }

  return formatWithSeparator(parsed.national);
};

export default phoneNumberAdapter;

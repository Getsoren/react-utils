/**
 * Keep a decimal number as it is typed: digits and one decimal separator, held with a point whichever separator is
 * typed (a French keyboard types a comma). A sign is dropped: a field that takes one says so beside the number.
 * Show the held text back with `formatDecimal`
 * Example: toDecimalInput("12,345", 2) -> "12.34"
 * @param typed The text of the field
 * @param maxDecimals Decimals kept at most, all of them when omitted
 */
const toDecimalInput = (typed: string, maxDecimals?: number): string => {
  const digits = typed.replace(/,/g, ".").replace(/[^\d.]/g, "");

  if (maxDecimals === 0) {
    return digits.match(/^\d*/)?.[0] ?? "";
  }

  const decimals = maxDecimals === undefined ? "*" : `{0,${maxDecimals}}`;

  return digits.match(new RegExp(`^\\d*(?:\\.\\d${decimals})?`))?.[0] ?? "";
};

export default toDecimalInput;

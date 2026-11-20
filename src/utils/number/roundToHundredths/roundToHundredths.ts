/**
 * Rounds to two decimals: an amount to the cent, hours to the hundredth.
 * Example: roundToHundredths(106.255) -> 106.26
 * @param value
 */
const roundToHundredths = (value: number): number => Math.round(value * 100) / 100;

export default roundToHundredths;

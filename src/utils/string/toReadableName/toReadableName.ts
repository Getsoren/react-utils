import capitalizeAddress from "@/utils/string/capitalizeAddress/capitalizeAddress";

/**
 * A name an ERP or a catalog sends in capitals ("KILOUTOU - QUETIGNY"), made readable ("Kiloutou - Quetigny"). A note
 * between brackets or parentheses, as a catalog adds one, is left as written, and so is a name in mixed case, its
 * acronyms with it.
 * @param name
 */
const toReadableName = (name: string): string =>
  name
    // The notes come out at the odd places of the split
    .split(/(\[[^\]]*\]|\([^)]*\))/)
    .map((part, index) => (index % 2 === 0 ? capitalizeAddress(part) : part))
    .join("");

export default toReadableName;

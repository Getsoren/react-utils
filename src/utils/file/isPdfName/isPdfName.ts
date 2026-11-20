/**
 * A PDF told by its name or its stored path: the extension, whatever its case.
 * Example: isPdfName("bon.PDF") -> true
 * @param name
 */
const isPdfName = (name: string): boolean => /\.pdf$/i.test(name);

export default isPdfName;

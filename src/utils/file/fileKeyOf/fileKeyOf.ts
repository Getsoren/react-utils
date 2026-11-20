/**
 * A key for a local file, the same each time the same file is picked again: its name, size and last change.
 * @param file
 */
const fileKeyOf = ({ name, size, lastModified }: File): string => `${name}:${size}:${lastModified}`;

export default fileKeyOf;

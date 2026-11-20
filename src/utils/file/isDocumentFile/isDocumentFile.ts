import isPdfName from "@/utils/file/isPdfName/isPdfName";

/**
 * A document a user can send: an image or a PDF, told by its type, else by its name (a PDF a system sends without its
 * type).
 * @param file
 */
const isDocumentFile = (file: File): boolean => file.type.startsWith("image/") || file.type === "application/pdf" || isPdfName(file.name);

export default isDocumentFile;

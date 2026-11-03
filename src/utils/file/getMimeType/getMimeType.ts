/** The MIME types of the files the upload inputs accept, by extension. */
const MIME_BY_EXTENSION: Record<string, string> = {
  heic: "image/heic",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  pdf: "application/pdf",
  png: "image/png",
};

const GENERIC_BINARY_TYPE = "application/octet-stream";

/**
 * A usable MIME type for a file, inferred from its extension when the source gives none or only
 * the generic binary one (storage downloads often report "application/octet-stream").
 * Example: getMimeType("delivery.pdf", "application/octet-stream") -> "application/pdf"
 * @param fileName - File name with its extension
 * @param fallbackType - MIME type reported by the source (e.g. blob.type), used when reliable
 */
const getMimeType = (fileName: string, fallbackType?: string | null): string => {
  if (fallbackType && fallbackType !== GENERIC_BINARY_TYPE) {
    return fallbackType;
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  return (extension && MIME_BY_EXTENSION[extension]) || fallbackType || "";
};

export default getMimeType;

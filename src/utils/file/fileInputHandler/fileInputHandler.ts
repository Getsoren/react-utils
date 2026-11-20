import type { ChangeEvent } from "react";

/**
 * Change handler of a file input: hands the picked files over, then empties the input so that picking the same files
 * again still fires `change`.
 * @param onFiles
 */
const fileInputHandler =
  (onFiles: (files: File[]) => void) =>
  (event: ChangeEvent<HTMLInputElement>): void => {
    onFiles([...(event.target.files ?? [])]);
    event.target.value = "";
  };

export default fileInputHandler;

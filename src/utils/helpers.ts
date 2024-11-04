/**
 * Converts a base64 string to a Blob object
 */

import { COMPANY_NAME } from "../constants/app.constants";
function base64ToBlob(base64String: string, contentType: string): Blob {
  const sliceSize = 512;
  const byteCharacters = atob(base64String);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

/**
 * Downloads a file from a base64 string
 */
export const downloadBase64File = (
  base64String: string,
  fileName: string,
  fileExtension: string,
  contentType: string
): void => {
  const blob = base64ToBlob(base64String, contentType);
  const url = URL.createObjectURL(blob);
  const fullFileName = fileName.includes(".")
    ? `${COMPANY_NAME}-${fileName}`
    : `${COMPANY_NAME}-${fileName}.${fileExtension}`;

  const a = document.createElement("a");
  a.href = url;
  a.download = fullFileName;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Extracts content type from a base64 string
 */
export const getContentTypeFromBase64 = (
  base64String: string
): string | null => {
  const matches = base64String.match(/^data:(.+);base64,/);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return null;
};

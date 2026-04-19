export const MAX_DOCUMENT_UPLOAD_SIZE = 10 * 1024 * 1024;

export const DOCUMENT_UPLOAD_ACCEPT = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
].join(",");

const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
]);

const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const DOCUMENT_MIME_TYPES_BY_EXTENSION = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export function getFileExtension(fileName = "") {
  const lastDot = fileName.lastIndexOf(".");

  if (lastDot < 0) {
    return "";
  }

  return fileName.slice(lastDot).toLowerCase();
}

export function isAllowedDocumentUpload(file) {
  if (!file) {
    return false;
  }

  if (typeof file.size === "number" && file.size > MAX_DOCUMENT_UPLOAD_SIZE) {
    return false;
  }

  if (file.type && ALLOWED_DOCUMENT_MIME_TYPES.has(file.type)) {
    return true;
  }

  return ALLOWED_DOCUMENT_EXTENSIONS.has(getFileExtension(file.name));
}

export function getDocumentUploadError(file) {
  if (!file) {
    return "Please choose a file to upload";
  }

  if (typeof file.size === "number" && file.size > MAX_DOCUMENT_UPLOAD_SIZE) {
    return "Files must be 10 MB or smaller";
  }

  if (isAllowedDocumentUpload(file)) {
    return "";
  }

  return "Only PDF, Word, and PowerPoint files are allowed";
}

export function getDocumentContentType(file) {
  if (!file) {
    return "application/octet-stream";
  }

  if (file.type) {
    return file.type;
  }

  return DOCUMENT_MIME_TYPES_BY_EXTENSION[getFileExtension(file.name)] || "application/octet-stream";
}

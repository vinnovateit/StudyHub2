import aws4 from "aws4";
import { randomUUID } from "crypto";
import { getDocumentContentType, getDocumentUploadError } from "./documentUpload";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function sanitizeSegment(value) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function encodeR2Key(key) {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function getPublicBaseUrl() {
  return requireEnv("CLOUDFLARE_R2_PUBLIC_BASE_URL").replace(/\/$/, "");
}

export function buildR2ObjectKey(fileName, folderPrefix = "module-pdfs") {
  const folder = folderPrefix
    .split("/")
    .map(sanitizeSegment)
    .filter(Boolean)
    .join("/");

  const safeName = sanitizeSegment(fileName) || "file";
  const uniqueName = `${randomUUID()}-${safeName}`;

  return folder ? `${folder}/${uniqueName}` : uniqueName;
}

function normalizeRequestedFileName(requestedName, fallbackName) {
  const fallbackParts = splitFileName(fallbackName || "file.pdf");
  const requestedParts = splitFileName((requestedName || "").trim());
  const baseName = sanitizeSegment(requestedParts.baseName || fallbackParts.baseName || "file");
  const extension = requestedParts.extension || fallbackParts.extension || ".pdf";

  return `${baseName}${extension}`;
}

export function buildR2PublicUrl(key) {
  return `${getPublicBaseUrl()}/${encodeR2Key(key)}`;
}

function getR2RequestConfig() {
  return {
    accountId: requireEnv("CLOUDFLARE_R2_ACCOUNT_ID"),
    accessKeyId: requireEnv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
    bucket: requireEnv("CLOUDFLARE_R2_BUCKET"),
  };
}

async function signedR2Fetch({ method, path, headers = {}, body }) {
  const { accountId, accessKeyId, secretAccessKey } = getR2RequestConfig();
  const host = `${accountId}.r2.cloudflarestorage.com`;

  const request = {
    host,
    method,
    path,
    service: "s3",
    region: "auto",
    body,
    headers,
  };

  aws4.sign(request, {
    accessKeyId,
    secretAccessKey,
  });

  return fetch(`https://${host}${request.path}`, {
    method: request.method,
    headers: request.headers,
    body,
  });
}

export async function uploadFileToR2(
  file,
  { folderPrefix = "module-pdfs", desiredFileName } = {}
) {
  const { bucket } = getR2RequestConfig();

  const validationError = getDocumentUploadError(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const arrayBuffer = await file.arrayBuffer();
  const body = Buffer.from(arrayBuffer);
  const normalizedFileName = normalizeRequestedFileName(
    desiredFileName,
    file.name || "file.pdf"
  );
  const key = buildR2ObjectKey(normalizedFileName, folderPrefix);
  const path = `/${bucket}/${encodeR2Key(key)}`;
  const contentType = getDocumentContentType(file);

  const response = await signedR2Fetch({
    method: "PUT",
    path,
    body,
    headers: {
      "Content-Type": contentType,
      "Content-Length": body.length,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `R2 upload failed (${response.status}): ${errorText || response.statusText}`
    );
  }

  return {
    key,
    url: buildR2PublicUrl(key),
    name: normalizedFileName,
    mimetype: contentType,
    size: body.length,
  };
}

function getFileNameFromKey(key) {
  const parts = key.split("/");
  return parts[parts.length - 1] || "";
}

function splitFileName(fileName) {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot <= 0) {
    return {
      baseName: fileName,
      extension: "",
    };
  }

  return {
    baseName: fileName.slice(0, lastDot),
    extension: fileName.slice(lastDot),
  };
}

export function buildRenamedR2Key(oldKey, newFileName) {
  const parts = oldKey.split("/");
  const folder = parts.slice(0, -1).join("/");
  const currentName = getFileNameFromKey(oldKey);
  const currentParts = splitFileName(currentName);
  const nextParts = splitFileName(newFileName.trim());
  const extension = nextParts.extension || currentParts.extension || ".pdf";
  const safeBaseName = sanitizeSegment(nextParts.baseName || currentParts.baseName || "file");
  const renamedFileName = `${safeBaseName}${extension}`;

  return folder ? `${folder}/${renamedFileName}` : renamedFileName;
}

export async function renameFileInR2({ oldKey, newFileName }) {
  const { bucket } = getR2RequestConfig();
  const newKey = buildRenamedR2Key(oldKey, newFileName);
  const copySource = `/${bucket}/${encodeR2Key(oldKey)}`;
  const newPath = `/${bucket}/${encodeR2Key(newKey)}`;

  const copyResponse = await signedR2Fetch({
    method: "PUT",
    path: newPath,
    headers: {
      "x-amz-copy-source": copySource,
      "x-amz-metadata-directive": "COPY",
      "Content-Length": 0,
    },
  });

  if (!copyResponse.ok) {
    const errorText = await copyResponse.text();
    throw new Error(
      `R2 rename copy failed (${copyResponse.status}): ${errorText || copyResponse.statusText}`
    );
  }

  const deleteResponse = await signedR2Fetch({
    method: "DELETE",
    path: copySource,
  });

  if (!deleteResponse.ok) {
    await signedR2Fetch({
      method: "DELETE",
      path: newPath,
    }).catch(() => {});

    const errorText = await deleteResponse.text();
    throw new Error(
      `R2 rename delete failed (${deleteResponse.status}): ${errorText || deleteResponse.statusText}`
    );
  }

  return {
    key: newKey,
    url: buildR2PublicUrl(newKey),
    name: `${splitFileName(newFileName.trim()).baseName || "file"}${splitFileName(newFileName.trim()).extension || ".pdf"}`,
  };
}

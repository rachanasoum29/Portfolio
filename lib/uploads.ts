import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
export const UPLOAD_URL_PREFIX = "/uploads";

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/**
 * Local image storage for development.
 *
 * Files are written to `public/uploads/` and served as static assets at `/uploads/...`.
 * The database stores only the public path string (for example `/uploads/projects/abc.jpg`).
 *
 * This module is intentionally small so it can later swap to cloud storage
 * (S3, Cloudflare R2, Vercel Blob) without changing form fields.
 */
export function isAllowedUploadType(type: string) {
  return Object.hasOwn(ALLOWED_TYPES, type);
}

export function isManagedUploadPath(value: string) {
  return value.startsWith(`${UPLOAD_URL_PREFIX}/`) && !value.includes("..");
}

export async function saveUploadedImage(file: File, folder = "projects") {
  if (!isAllowedUploadType(file.type)) {
    throw new UploadError("Use a JPG, PNG, WebP, GIF, or SVG image.");
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    throw new UploadError("Image must be 5MB or smaller.");
  }

  const extension = ALLOWED_TYPES[file.type];
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  const relativeDir = path.posix.join(folder);
  const absoluteDir = path.join(UPLOAD_DIR, ...relativeDir.split("/"));
  await mkdir(absoluteDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absoluteDir, filename), bytes);

  return `${UPLOAD_URL_PREFIX}/${relativeDir}/${filename}`;
}

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_FREE_URL = /^https?:\/\/.+/i;

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isValidSlug(value: string) {
  return value.length >= 1 && value.length <= 80 && SLUG_PATTERN.test(value);
}

export function isValidOptionalHttpUrl(value: string) {
  if (!value) {
    return true;
  }
  if (value.length > 2048) {
    return false;
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidOptionalImagePath(value: string) {
  if (!value) {
    return true;
  }
  if (value.length > 2048 || /\s/.test(value)) {
    return false;
  }
  if (value.startsWith("/")) {
    return value.length > 1;
  }
  return EMAIL_FREE_URL.test(value) && isValidOptionalHttpUrl(value);
}

export function parseTechnologies(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export function parseOrder(value: string) {
  if (!value.trim()) {
    return 0;
  }
  if (!/^-?\d+$/.test(value.trim())) {
    return null;
  }
  const order = Number(value);
  if (!Number.isSafeInteger(order) || order < -9999 || order > 9999) {
    return null;
  }
  return order;
}

"use client";

/**
 * Vendor image uploads are base64'd into localStorage, which caps out around
 * 5MB for the whole origin. Without a size gate a single phone photo can blow
 * the quota, and because the storage helpers swallow QuotaExceededError the
 * vendor sees a success toast while the image is silently dropped. Validate
 * before reading, and let callers report a failed write.
 */

export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const MAX_GALLERY_BYTES = 3 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function megabytes(bytes: number) {
  return Math.round(bytes / (1024 * 1024));
}

/** Returns an error message to show the vendor, or null when the file is fine. */
export function validateImageFile(file: File, maxBytes: number): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `${file.name} is not a supported image — use JPG, PNG or WebP.`;
  }
  if (file.size > maxBytes) {
    return `${file.name} is ${megabytes(file.size)}MB — images must be under ${megabytes(maxBytes)}MB.`;
  }
  return null;
}

export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

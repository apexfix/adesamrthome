export const MAX_PHOTO_COUNT = 4;
export const MAX_PHOTO_PIXELS = 25_000_000;
export const MAX_PHOTO_BYTES = 1_000_000;
export const MAX_TOTAL_PHOTO_BYTES = 3_500_000;
export const PHOTO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Shared metadata limits; the server still validates actual image bytes and pixels.
export function photoSelectionError(photos: ReadonlyArray<{ size: number; type: string }>): string | null {
  if (photos.length > MAX_PHOTO_COUNT) return "Please add no more than 4 photos.";
  if (photos.some(photo => !PHOTO_MIME_TYPES.includes(photo.type) || !Number.isSafeInteger(photo.size) || photo.size <= 0 || photo.size > MAX_PHOTO_BYTES)) {
    return "Please use non-empty JPEG, PNG or WebP photos, at most 1 MB each after resizing.";
  }
  if (photos.reduce((total, photo) => total + photo.size, 0) > MAX_TOTAL_PHOTO_BYTES) {
    return "These photos exceed the 3.5 MB combined limit. Remove a photo and send it later by SMS or email.";
  }
  return null;
}

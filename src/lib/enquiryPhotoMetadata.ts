import { MAX_PHOTO_PIXELS, PHOTO_MIME_TYPES } from "./enquiryPhotoLimits";

const MAX_SOURCE_BYTES = 20_000_000;
const MAX_HEADER_BYTES = 262_144;

export async function checkEnquiryPhotoMetadata(file: File) {
  if (!PHOTO_MIME_TYPES.includes(file.type) || !file.size) {
    throw new Error("Please choose a non-empty JPEG, PNG or WebP photo.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("This original photo exceeds 20 MB. Please crop it or choose a smaller image.");
  }
  // Bound header reads before any browser image decoder is given the file.
  let metadata;
  try {
    const { imageDimensionsFromData } = await import("image-dimensions");
    metadata = imageDimensionsFromData(new Uint8Array(await file.slice(0, MAX_HEADER_BYTES).arrayBuffer()));
  } catch {
    metadata = undefined;
  }
  if (!metadata || `image/${metadata.type}` !== file.type || !Number.isSafeInteger(metadata.width) || !Number.isSafeInteger(metadata.height) || metadata.width <= 0 || metadata.height <= 0) {
    throw new Error("This photo's dimensions could not be read. Please export it as JPEG, PNG or WebP and try again.");
  }
  if (metadata.width * metadata.height > MAX_PHOTO_PIXELS) {
    throw new Error("This photo exceeds 25 megapixels. Please crop it or choose a lower-resolution image.");
  }
  return metadata;
}

import sharp from "sharp";
import { MAX_PHOTO_BYTES, MAX_PHOTO_PIXELS } from "./enquiryPhotoLimits";
import { checkStaticPhotoHeader, MAX_PHOTO_HEADER_BYTES } from "./enquiryPhotoHeader";

const mimeFormats: Record<string, string> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

export class PhotoValidationError extends Error {}

export async function prepareEnquiryPhoto(photo: File, index: number) {
  const errorMessage = `Photo ${index + 1} could not be read. Please use a valid, non-animated JPEG, PNG or WebP under 1 MB and 25 megapixels, or remove it and send photos later.`;
  try {
    if (!mimeFormats[photo.type] || !photo.size || photo.size > MAX_PHOTO_BYTES) {
      throw new PhotoValidationError(errorMessage);
    }
    const input = Buffer.from(await photo.arrayBuffer());
    checkStaticPhotoHeader(input.subarray(0, MAX_PHOTO_HEADER_BYTES), photo.type, photo.size);
    const image = sharp(input, { failOn: "warning", limitInputPixels: MAX_PHOTO_PIXELS });
    const metadata = await image.metadata();
    if (
      metadata.format !== mimeFormats[photo.type] ||
      !metadata.width || !metadata.height ||
      metadata.width * metadata.height > MAX_PHOTO_PIXELS ||
      (metadata.pages ?? 1) > 1
    ) {
      throw new PhotoValidationError(errorMessage);
    }

    // Decode and re-encode, rather than forwarding untrusted original bytes or EXIF/GPS metadata.
    const content = await image
      .rotate()
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 75 })
      .timeout({ seconds: 5 })
      .toBuffer();
    if (content.length > MAX_PHOTO_BYTES) throw new PhotoValidationError(errorMessage);
    return { filename: `door-photo-${index + 1}.jpg`, content, contentType: "image/jpeg" };
  } catch {
    throw new PhotoValidationError(errorMessage);
  }
}

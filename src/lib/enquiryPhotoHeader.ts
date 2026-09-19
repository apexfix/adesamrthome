export const MAX_PHOTO_HEADER_BYTES = 262_144;

// A bounded animation preflight, not a replacement for full server-side decoding.
export function checkStaticPhotoHeader(bytes: Uint8Array, type: string, totalBytes: number) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tag = (offset: number) => String.fromCharCode(...bytes.subarray(offset, offset + 4));
  const invalid = () => { throw new Error("This photo's header could not be checked. Please export a still JPEG, PNG or WebP and try again."); };
  const animated = () => { throw new Error("Animated photos are not supported. Please export a still JPEG, PNG or WebP."); };

  if (type === "image/png") {
    if (bytes.length < 33 || view.getUint32(0) !== 0x89504e47 || view.getUint32(4) !== 0x0d0a1a0a || tag(12) !== "IHDR" || view.getUint32(8) !== 13) invalid();
    let offset = 8;
    // APNG's acTL must precede IDAT. Skip whole chunks, never search arbitrary pixel bytes.
    while (offset + 8 <= bytes.length) {
      const length = view.getUint32(offset);
      const kind = tag(offset + 4);
      const end = offset + length + 12;
      if (length > 0x7fffffff || end > totalBytes) invalid();
      if (kind === "acTL" || kind === "fcTL" || kind === "fdAT") animated();
      if (kind === "IDAT") return;
      if (kind === "IEND" || end > bytes.length) invalid();
      offset = end;
    }
    invalid();
  }

  if (type === "image/webp") {
    if (bytes.length < 20 || tag(0) !== "RIFF" || tag(8) !== "WEBP") invalid();
    const end = view.getUint32(4, true) + 8;
    const length = view.getUint32(16, true);
    if (end > totalBytes || end < 20 || 20 + length + (length % 2) > end) invalid();
    const kind = tag(12);
    if (kind === "VP8X") {
      if (length !== 10 || bytes.length < 30) invalid();
      if (bytes[20] & 0x02) animated();
    } else if (kind !== "VP8 " && kind !== "VP8L") invalid();
  }
}

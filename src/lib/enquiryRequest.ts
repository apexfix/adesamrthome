import { MAX_TOTAL_PHOTO_BYTES } from "./enquiryPhotoLimits";

// Leave room for multipart boundaries and fields, without buffering an unbounded body.
export const MAX_ENQUIRY_REQUEST_BYTES = MAX_TOTAL_PHOTO_BYTES + 500_000;

export class EnquiryRequestError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "EnquiryRequestError";
  }
}

export async function readBoundedEnquiryRequest(request: Request): Promise<Request> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || !Number.isSafeInteger(Number(length)))) {
    throw new EnquiryRequestError("The enquiry could not be read. Please try again.", 400);
  }
  if (length && Number(length) > MAX_ENQUIRY_REQUEST_BYTES) {
    await request.body?.cancel();
    throw new EnquiryRequestError("This enquiry is too large. Please remove a photo and try again.", 413);
  }
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  if (reader) {
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > MAX_ENQUIRY_REQUEST_BYTES) {
          await reader.cancel();
          throw new EnquiryRequestError("This enquiry is too large. Please remove a photo and try again.", 413);
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new Request(request.url, { method: "POST", headers: request.headers, body });
}

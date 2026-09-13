export const uncertainDeliveryMessage = "Delivery is unconfirmed. Your request may already have arrived. Please check by SMS or email before sending another copy.";

export function isEnquiryLeadId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
}

export function readEnquiryResponse(status: number, body: unknown): { leadId: string } | { message: string; uncertain: boolean } {
  const value = body && typeof body === "object" ? body as Record<string, unknown> : {};
  if (status >= 200 && status < 300 && value.success === true && isEnquiryLeadId(value.leadId)) {
    return { leadId: value.leadId };
  }
  if (status === 413) return { message: "This request is too large. Remove a photo and send it later by SMS or email.", uncertain: false };
  if (status === 429) return { message: "Please wait before trying again, or contact us by SMS or email.", uncertain: false };
  if (status >= 400 && status < 500 && status !== 408) {
    const message = typeof value.message === "string" ? value.message.trim().slice(0, 500) : "Please check your enquiry details and try again, or contact us by SMS or email.";
    return { message: message || "Please check your enquiry details and try again.", uncertain: false };
  }
  return { message: uncertainDeliveryMessage, uncertain: true };
}

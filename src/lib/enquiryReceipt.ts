import { isEnquiryService } from "./enquiry";
import { isEnquiryLeadId } from "./enquiryDelivery";

export const ENQUIRY_RECEIPT_KEY = "ade-enquiry-receipt-v1";
export type EnquiryReceipt = { leadId: string; service: string };

export function parseEnquiryReceipt(raw: string | null | undefined): EnquiryReceipt | null {
  if (!raw || raw.length > 512) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const receipt = value as Record<string, unknown>;
    if (!isEnquiryLeadId(receipt.leadId) || typeof receipt.service !== "string" || !isEnquiryService(receipt.service)) return null;
    return { leadId: receipt.leadId, service: receipt.service };
  } catch { return null; }
}

const receiptDetails: Record<string, { intro: string; review: string; next: string }> = {
  "supply-install": {
    intro: "We will review your smart lock requirements and reply by SMS or email.",
    review: "We review your preferred lock, door details and any photos supplied.",
    next: "We confirm the lock, installation scope and package price before you decide whether to book.",
  },
  "installation-only": {
    intro: "We will review installation of your customer-supplied smart lock and reply by SMS or email.",
    review: "We check the model you have purchased, your existing lock and the door details supplied.",
    next: "We confirm compatibility, installation scope and the installation-only price before booking.",
  },
  "security-camera-kit": {
    intro: "We will review your camera equipment enquiry and reply by SMS or email.",
    review: "We review the package name, quantity and product enquiry you shared.",
    next: "We confirm equipment availability, package contents and pricing before you order.",
  },
  "portfolio-project": {
    intro: "We will review your property or project enquiry and reply by SMS or email.",
    review: "We review the properties, quantities and requirements you have shared.",
    next: "We clarify the requested work and whether we can help before confirming scope and pricing.",
  },
  "not-sure": {
    intro: "We will review what you need and reply by SMS or email.",
    review: "We review your questions, existing door and any details or photos you supplied.",
    next: "We help clarify suitable product or service options and pricing before you decide.",
  },
};

export function enquiryReceiptDetails(service: string) {
  return receiptDetails[isEnquiryService(service) ? service : "not-sure"];
}

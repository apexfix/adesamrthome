export const serviceOptions = [
  { value: "supply-install", label: "Supply & install" },
  { value: "installation-only", label: "Installation only" },
  { value: "security-camera-kit", label: "Security camera kit" },
  { value: "portfolio-project", label: "Property / project" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const serviceLabels: Record<string, string> = {
  "supply-install": "Supply and installation",
  "installation-only": "Installation only",
  "security-camera-kit": "Security camera equipment enquiry",
  "portfolio-project": "Property portfolio / building project",
  "not-sure": "Not sure / recommendation needed",
};

export function isEnquiryService(value: string): boolean {
  return serviceOptions.some(option => option.value === value);
}

type ContactField = "phone" | "email";
export function contactValidationIssue(phone: string, email: string): { fields: ContactField[]; message: string } | null {
  if (!phone.trim() && !email.trim()) return { fields: ["phone", "email"], message: "Please enter a mobile number or email address so we can reply." };
  const phoneDigits = phone.replace(/\D/g, "");
  const invalidPhone = Boolean(phone.trim()) && (!/^[+\d\s().-]+$/.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15);
  const invalidEmail = Boolean(email.trim()) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (invalidPhone && invalidEmail) {
    return { fields: ["phone", "email"], message: "Please check your mobile number and email address. You can leave either one blank." };
  }
  if (invalidPhone) {
    return { fields: ["phone"], message: "Please check your mobile number, or leave it blank and enter your email." };
  }
  if (invalidEmail) {
    return { fields: ["email"], message: "Please check your email address, or leave it blank and enter your mobile number." };
  }
  return null;
}

export function contactValidationError(phone: string, email: string): string | null {
  return contactValidationIssue(phone, email)?.message ?? null;
}

// Only fixed catalogue identifiers may leave the enquiry form through analytics.
const productAliases: Record<string, string[]> = {
  "lockin-x9-smart-lock": ["Lockin X9", "Lockin X9 Smart Lock"],
  "lockin-v5-max-smart-lock": ["Lockin V5 Max", "Lockin V5 Max Smart Lock"],
  "lockin-s6-max-smart-lock": ["Lockin S6 Max", "Lockin S6 Max Smart Lock"],
  "lockin-sv40-smart-lock": ["Lockin SV40", "Lockin SV40 Smart Lock"],
  "lockin-s50m-pro-smart-lock": ["Lockin S50M Pro", "Lockin S50M Pro Smart Lock"],
  "lockin-ola-slim-smart-lock": ["Lockin OLA Slim", "Lockin OLA Slim Smart Lock", "Lockin OLA Slim (single-side fingerprint)"],
  "kaadas-k70-se-smart-lock": ["Kaadas K70 SE", "Kaadas K70 SE Smart Lock"],
  "smart-lock-installation-only-service": ["Smart Lock Installation Only Service", "Customer-supplied smart lock"],
  "dahua-5mp-2-camera-poe-security-kit": ["Dahua 5MP 2-Camera PoE Security Kit"],
  "dahua-6mp-smart-dual-light-2-camera-poe-kit": ["Dahua 6MP Smart Dual Light 2-Camera PoE Kit"],
};

export function analyticsProductId(value: unknown): string {
  if (typeof value !== "string") return "not-specified";
  const candidate = value.trim().toLowerCase();
  for (const [id, aliases] of Object.entries(productAliases)) {
    if (candidate === id || aliases.some(alias => alias.toLowerCase() === candidate)) return id;
  }
  return "not-specified";
}

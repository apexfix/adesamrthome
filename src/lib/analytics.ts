export type LeadAttribution = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  gclid: string;
  wbraid: string;
  gbraid: string;
  fbclid: string;
  landingPage: string;
  referrer: string;
};

type AnalyticsValue = string | number | boolean;
type AnalyticsParameters = Record<
  string,
  AnalyticsValue | null | undefined
>;

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
const googleAdsLeadLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL?.trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "ade-lead-attribution-v1";

const emptyAttribution: LeadAttribution = {
  source: "direct",
  medium: "none",
  campaign: "",
  content: "",
  term: "",
  gclid: "",
  wbraid: "",
  gbraid: "",
  fbclid: "",
  landingPage: "",
  referrer: "",
};

function cleanValue(value: string | null, maxLength = 300): string {
  return value?.trim().slice(0, maxLength) ?? "";
}

function readStoredAttribution(): LeadAttribution | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return null;

    const record = parsed as Record<string, unknown>;
    return {
      source: typeof record.source === "string" ? record.source : "direct",
      medium: typeof record.medium === "string" ? record.medium : "none",
      campaign: typeof record.campaign === "string" ? record.campaign : "",
      content: typeof record.content === "string" ? record.content : "",
      term: typeof record.term === "string" ? record.term : "",
      gclid: typeof record.gclid === "string" ? record.gclid : "",
      wbraid: typeof record.wbraid === "string" ? record.wbraid : "",
      gbraid: typeof record.gbraid === "string" ? record.gbraid : "",
      fbclid: typeof record.fbclid === "string" ? record.fbclid : "",
      landingPage:
        typeof record.landingPage === "string" ? record.landingPage : "",
      referrer: typeof record.referrer === "string" ? record.referrer : "",
    };
  } catch {
    return null;
  }
}

function getSafeReferrer(): string {
  if (!document.referrer) return "";

  try {
    const referrerUrl = new URL(document.referrer);
    return `${referrerUrl.origin}${referrerUrl.pathname}`.slice(0, 500);
  } catch {
    return document.referrer.slice(0, 500);
  }
}

export function captureLeadAttribution(): LeadAttribution {
  if (typeof window === "undefined") return emptyAttribution;

  const searchParams = new URLSearchParams(window.location.search);
  const attributionKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "wbraid",
    "gbraid",
    "fbclid",
  ];
  const hasAttributionParameters = attributionKeys.some((key) =>
    searchParams.has(key),
  );
  const storedAttribution = readStoredAttribution();

  if (storedAttribution && !hasAttributionParameters) {
    return storedAttribution;
  }

  const gclid = cleanValue(searchParams.get("gclid"), 300);
  const wbraid = cleanValue(searchParams.get("wbraid"), 300);
  const gbraid = cleanValue(searchParams.get("gbraid"), 300);
  const fbclid = cleanValue(searchParams.get("fbclid"), 300);
  const hasGoogleClickId = Boolean(gclid || wbraid || gbraid);

  const referrer = getSafeReferrer();
  let referrerHost = "";

  if (referrer) {
    try {
      referrerHost = new URL(referrer).hostname.replace(/^www\./, "");
    } catch {
      referrerHost = "referral";
    }
  }

  const attribution: LeadAttribution = {
    source:
      cleanValue(searchParams.get("utm_source"), 100) ||
      (hasGoogleClickId ? "google" : "") ||
      (fbclid ? "facebook" : "") ||
      referrerHost ||
      "direct",
    medium:
      cleanValue(searchParams.get("utm_medium"), 100) ||
      (hasGoogleClickId ? "cpc" : "") ||
      (fbclid ? "paid_social" : "") ||
      (referrerHost ? "referral" : "none"),
    campaign: cleanValue(searchParams.get("utm_campaign"), 150),
    content: cleanValue(searchParams.get("utm_content"), 150),
    term: cleanValue(searchParams.get("utm_term"), 150),
    gclid,
    wbraid,
    gbraid,
    fbclid,
    landingPage: `${window.location.pathname}${window.location.search}`.slice(
      0,
      500,
    ),
    referrer,
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution still travels with the current form submission if storage is blocked.
  }

  return attribution;
}

export function trackEvent(
  eventName: string,
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined" || !window.gtag) return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  window.gtag("event", eventName, safeParameters);
}

export function trackGoogleAdsLead() {
  if (
    typeof window === "undefined" ||
    !window.gtag ||
    !googleAdsId ||
    !googleAdsLeadLabel
  ) {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: `${googleAdsId}/${googleAdsLeadLabel}`,
  });
}

export function trackMetaPageView() {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("track", "PageView");
}

export function trackMetaLead(parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined" || !window.fbq) return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  window.fbq("track", "Lead", safeParameters);
}

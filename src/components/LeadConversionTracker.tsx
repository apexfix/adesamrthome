"use client";

import { useEffect } from "react";
import {
  trackEvent,
  trackGoogleAdsLead,
  trackMetaLead,
} from "@/lib/analytics";

type CompletedLead = {
  service?: string;
  product?: string;
  photoCount?: number;
  preferredTiming?: string;
};

export function LeadConversionTracker() {
  useEffect(() => {
    const storedLead = sessionStorage.getItem("ade_completed_lead");
    if (!storedLead) return;

    sessionStorage.removeItem("ade_completed_lead");

    try {
      const lead = JSON.parse(storedLead) as CompletedLead;
      const service = lead.service || "not-specified";
      const product = lead.product || "not-specified";
      const photoCount = lead.photoCount || 0;
      const highIntentTiming = [
        "as-soon-as-possible",
        "within-one-week",
      ].includes(lead.preferredTiming || "");
      const leadQuality = photoCount >= 3 && highIntentTiming
        ? "high"
        : photoCount > 0 || highIntentTiming
          ? "medium"
          : "standard";

      trackEvent("generate_lead", {
        service,
        product,
        photo_count: photoCount,
        lead_quality: leadQuality,
        form_name: "website_enquiry",
      });
      if (photoCount >= 3) {
        trackEvent("photo_ready_lead", {
          service,
          product,
          photo_count: photoCount,
          lead_quality: leadQuality,
          form_name: "website_enquiry",
        });
      }
      trackGoogleAdsLead();
      trackMetaLead({
        content_name: product !== "not-specified" ? product : service,
        service,
        lead_quality: leadQuality,
      });
    } catch {
      // A malformed session value should not block the thank-you page.
    }
  }, []);

  return null;
}

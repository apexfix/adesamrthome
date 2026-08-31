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

      trackEvent("generate_lead", {
        service,
        product,
        photo_count: lead.photoCount || 0,
        form_name: "website_enquiry",
      });
      trackGoogleAdsLead();
      trackMetaLead({
        content_name: product !== "not-specified" ? product : service,
        service,
      });
    } catch {
      // A malformed session value should not block the thank-you page.
    }
  }, []);

  return null;
}

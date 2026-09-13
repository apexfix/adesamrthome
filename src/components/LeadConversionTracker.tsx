"use client";

import { useEffect } from "react";
import { analyticsProductId, isEnquiryService } from "@/lib/enquiry";
import { isEnquiryLeadId } from "@/lib/enquiryDelivery";
import {
  trackEvent,
  trackGoogleAdsLead,
  trackMetaLead,
} from "@/lib/analytics";

export function LeadConversionTracker() {
  useEffect(() => {
    try {
      const storedLead = sessionStorage.getItem("ade_completed_lead");
      if (!storedLead) return;
      sessionStorage.removeItem("ade_completed_lead");
      const parsed: unknown = JSON.parse(storedLead);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
      const lead = parsed as Record<string, unknown>;
      if (!isEnquiryLeadId(lead.leadId)) return;
      const service = typeof lead.service === "string" && isEnquiryService(lead.service) ? lead.service : "not-specified";
      const product = analyticsProductId(lead.product);
      const photoCount = typeof lead.photoCount === "number" && Number.isInteger(lead.photoCount) && lead.photoCount >= 0 && lead.photoCount <= 4 ? lead.photoCount : 0;
      const highIntentTiming = [
        "as-soon-as-possible",
        "within-one-week",
      ].includes(typeof lead.preferredTiming === "string" ? lead.preferredTiming : "");
      const photoStatus = photoCount >= 4
        ? "complete"
        : photoCount > 0
          ? "partial"
          : "none";
      const leadQuality = photoCount >= 4 && highIntentTiming
        ? "high"
        : photoCount > 0 || highIntentTiming
          ? "medium"
          : "standard";

      trackEvent("generate_lead", {
        service,
        product,
        photo_count: photoCount,
        photo_status: photoStatus,
        lead_quality: leadQuality,
        form_name: "website_enquiry",
      });
      if (photoCount >= 4) {
        trackEvent("photo_ready_lead", {
          service,
          product,
          photo_count: photoCount,
          photo_status: photoStatus,
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

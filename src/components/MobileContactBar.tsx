"use client";

import Link from "next/link";
import { Camera, MessageSquareText } from "lucide-react";
import { businessInfo } from "@/lib/seoData";
import { trackEvent } from "@/lib/analytics";

const smsHref = `sms:${businessInfo.phoneInternational}?body=${encodeURIComponent("Hi ADE Smart Home, I would like a smart lock quote.")}`;
const mailHref = `mailto:${businessInfo.email}?subject=${encodeURIComponent(
  "Smart lock quote with door photos",
)}&body=${encodeURIComponent(
  "Hi ADE Smart Home, I have a smart lock enquiry and door photos to share.",
)}`;

export function MobileContactBar() {
  const onSmsClick = () =>
    trackEvent("mobile_sms_cta_click", { location: "fixed_mobile_bar" });

  const onQuoteFormClick = () =>
    trackEvent("mobile_quote_form_cta_click", { location: "fixed_mobile_bar" });

  const onMailClick = () =>
    trackEvent("mobile_mail_cta_click", { location: "fixed_mobile_bar" });

  return (
    <>
      <div className="h-28 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-2 border-t border-zinc-700 bg-black p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        <a
          href={smsHref}
          onClick={onSmsClick}
          aria-label="Text us for a smart lock quote"
          className="flex h-12 items-center justify-center gap-2 border-r border-zinc-700 text-sm font-bold text-white"
        >
          <MessageSquareText className="h-4 w-4 text-[#c5a47e]" />
          Text for Quote
        </a>
        <Link
          href="/contact?service=not-sure"
          onClick={onQuoteFormClick}
          aria-label="Go to quote form"
          className="flex h-12 items-center justify-center gap-2 bg-[#c5a47e] text-sm font-bold text-black"
        >
          <Camera className="h-4 w-4" />
          Send Door Photos
        </Link>
        <a
          href={mailHref}
          onClick={onMailClick}
          className="col-span-2 mt-2 flex h-10 items-center justify-center gap-2 border-t border-zinc-700 text-xs font-semibold text-white/80"
        >
          <MessageSquareText className="h-4 w-4 text-[#c5a47e]" />
          Or email your details to {businessInfo.email}
        </a>
      </div>
    </>
  );
}

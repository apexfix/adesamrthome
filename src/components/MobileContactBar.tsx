"use client";

import Link from "next/link";
import { Camera, Cctv, MessageSquareText, Tag } from "lucide-react";
import { usePathname } from "next/navigation";
import { businessInfo } from "@/lib/seoData";
import { trackEvent } from "@/lib/analytics";

export function MobileContactBar() {
  const pathname = usePathname();
  const isCameraPage =
    pathname.includes("security-camera") || pathname.includes("dahua-5mp-2-camera");
  const isMixedProductsPage = pathname === "/products";
  const smsHref = `sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(
    isCameraPage
      ? "Hi ADE Smart Home, I would like a security camera kit quote."
      : isMixedProductsPage
        ? "Hi ADE Smart Home, I would like a product quote."
      : "Hi ADE Smart Home, I would like a smart lock quote.",
  )}`;
  const mailHref = `mailto:${businessInfo.email}?subject=${encodeURIComponent(
    isCameraPage
      ? "Security camera kit enquiry"
      : isMixedProductsPage
        ? "ADE Smart Home product enquiry"
        : "Smart lock quote with door photos",
  )}&body=${encodeURIComponent(
    isCameraPage
      ? "Hi ADE Smart Home, I would like more information about a security camera kit."
      : isMixedProductsPage
        ? "Hi ADE Smart Home, I would like more information about one of your products."
      : "Hi ADE Smart Home, I have a smart lock enquiry and door photos to share.",
  )}`;
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
          aria-label="Text for Quote"
          className="flex h-12 items-center justify-center gap-2 border-r border-zinc-700 text-sm font-bold text-white"
        >
          <MessageSquareText className="h-4 w-4 text-[#c5a47e]" />
          Text for Quote
        </a>
        <Link
          href={isCameraPage ? "/contact?service=security-camera-kit#quote" : "/contact#quote"}
          onClick={onQuoteFormClick}
          aria-label={isCameraPage ? "Get Camera Quote" : isMixedProductsPage ? "Get a Quote" : "Send Door Photos"}
          className="flex h-12 items-center justify-center gap-2 bg-[#c5a47e] text-sm font-bold text-black"
        >
          {isCameraPage ? (
            <Cctv className="h-4 w-4" />
          ) : isMixedProductsPage ? (
            <Tag className="h-4 w-4" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          {isCameraPage ? "Get Camera Quote" : isMixedProductsPage ? "Get a Quote" : "Send Door Photos"}
        </Link>
        <a
          href={mailHref}
          onClick={onMailClick}
          className="col-span-2 mt-2 flex h-10 items-center justify-center gap-2 border-t border-zinc-700 text-xs font-semibold text-white/80"
        >
          <MessageSquareText className="h-4 w-4 text-[#c5a47e]" />
          {isCameraPage
            ? "Email camera enquiry"
            : isMixedProductsPage
              ? "Email product enquiry"
              : "Email your details"}
        </a>
      </div>
    </>
  );
}

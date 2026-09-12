"use client";

import Link from "next/link";
import { Camera, Cctv, Mail, MessageSquareText, Tag } from "lucide-react";
import { usePathname } from "next/navigation";
import { businessInfo } from "@/lib/seoData";
import { trackEvent } from "@/lib/analytics";

export function MobileContactBar() {
  const pathname = usePathname();
  const isCameraPage =
    pathname.includes("security-camera") || pathname.includes("dahua-5mp-2-camera");
  const isMixedProductsPage = pathname === "/products" || pathname === "/";
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
      <div className="h-24 md:hidden" aria-hidden="true" />
      <nav aria-label="Quick contact" className="liquid-glass mobile-contact-dock fixed inset-x-3 z-[70] grid grid-cols-[1fr_1.3fr_44px] items-center gap-1 rounded-lg border p-2 md:hidden">
        <a
          href={smsHref}
          onClick={onSmsClick}
          aria-label="Text for Quote"
          className="flex min-h-12 items-center justify-center gap-2 rounded-md text-sm font-bold text-white"
        >
          <MessageSquareText className="h-4 w-4 text-[#c5a47e]" />
          Text us
        </a>
        <Link
          href={isCameraPage ? "/contact?service=security-camera-kit#quote" : "/contact#quote"}
          onClick={onQuoteFormClick}
          aria-label={isCameraPage ? "Get Camera Quote" : isMixedProductsPage ? "Get a Quote" : "Send Door Photos"}
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d9b98f] px-2 text-sm font-bold text-black"
        >
          <span className="flex shrink-0" aria-hidden="true">{isCameraPage ? (
            <Cctv className="h-4 w-4" />
          ) : isMixedProductsPage ? (
            <Tag className="h-4 w-4" />
          ) : (
            <Camera className="h-4 w-4" />
          )}</span>
          <span>{isCameraPage ? "Get Camera Quote" : isMixedProductsPage ? "Get a Quote" : "Send Door Photos"}</span>
        </Link>
        <a
          href={mailHref}
          onClick={onMailClick}
          title="Email your enquiry"
          aria-label="Email your enquiry"
          className="glass-control flex h-11 w-11 items-center justify-center rounded-md border text-white"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
        </a>
      </nav>
    </>
  );
}

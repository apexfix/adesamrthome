"use client";

import Link from "next/link";
import { Camera, Cctv, Mail, MessageSquareText, Tag } from "lucide-react";
import { usePathname } from "next/navigation";
import { businessInfo } from "@/lib/seoData";
import { trackEvent } from "@/lib/analytics";
import { useEffect, useRef, useState } from "react";

export function MobileContactBar() {
  const pathname = usePathname();
  const [visiblePrimaryPath, setVisiblePrimaryPath] = useState<string | null>(null);
  const dockRef = useRef<HTMLElement>(null);
  const [formActive, setFormActive] = useState(false);
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const root = document.documentElement;
    const measure = () => {
      const height = dock.getBoundingClientRect().height;
      // Keep the last visible size while automatic hiding collapses the dock.
      if (height > 0) root.style.setProperty('--mobile-contact-height', `${Math.ceil(height)}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(dock);
    return () => { observer.disconnect(); root.style.removeProperty('--mobile-contact-height'); };
  }, [pathname]);
  useEffect(() => {
    let pointerDown = false;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    const inForm = () => Boolean(document.activeElement?.closest('.quote-section'));
    const release = () => {
      clearTimeout(releaseTimer);
      if (pointerDown) return;
      // Let a click that leaves the form finish before the fixed bar can appear.
      releaseTimer = setTimeout(() => setFormActive(inForm()), 120);
    };
    const focus = () => {
      if (inForm()) { clearTimeout(releaseTimer); setFormActive(true); }
      else release();
    };
    const press = () => { pointerDown = true; };
    const lift = () => { pointerDown = false; release(); };
    document.addEventListener('focusin', focus);
    document.addEventListener('focusout', release);
    document.addEventListener('pointerdown', press, true);
    document.addEventListener('pointerup', lift, true);
    document.addEventListener('pointercancel', lift, true);
    window.addEventListener('blur', lift);
    return () => {
      clearTimeout(releaseTimer);
      document.removeEventListener('focusin', focus);
      document.removeEventListener('focusout', release);
      document.removeEventListener('pointerdown', press, true);
      document.removeEventListener('pointerup', lift, true);
      document.removeEventListener('pointercancel', lift, true);
      window.removeEventListener('blur', lift);
    };
  }, []);
  useEffect(() => {
    const primary = document.querySelector('[data-primary-quote], .product-purchase a[href^="/contact"]');
    if (!primary) return;
    const observer = new IntersectionObserver(([entry]) => setVisiblePrimaryPath(entry.isIntersecting ? pathname : null), { threshold: 0 });
    observer.observe(primary);
    return () => observer.disconnect();
  }, [pathname]);
  // The enquiry page already provides contact links; keep its form unobstructed.
  if (pathname === "/contact") return null;
  const isCameraPage =
    pathname.includes("security-camera") || (pathname.includes("dahua-") && pathname.includes("camera"));
  const isMixedProductsPage = pathname === "/products" || pathname === "/" || pathname.startsWith("/contact");
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
      <div className="mobile-contact-spacer h-24 bg-zinc-950 md:hidden" aria-hidden="true" />
      <nav ref={dockRef} aria-label="Quick contact" data-primary-visible={visiblePrimaryPath === pathname} data-form-active={formActive}
        className="liquid-glass mobile-contact-dock fixed z-[70] grid items-center rounded-lg border md:hidden">
        <a
          href={smsHref}
          onClick={onSmsClick}
          aria-label="Text us for a quote"
          className="flex min-h-12 items-center justify-center gap-2 rounded-md text-sm font-bold text-white"
        >
          <MessageSquareText className="h-4 w-4 text-[#c5a47e]" aria-hidden="true" />
          <span>Text us</span>
        </a>
        <Link
          href={isCameraPage ? "/contact?service=security-camera-kit#quote" : "/contact#quote"}
          onClick={onQuoteFormClick}
          aria-label={isCameraPage ? "Get quote for a camera kit" : isMixedProductsPage ? "Get quote" : "Get quote with door photos"}
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d9b98f] px-2 text-sm font-bold text-black"
        >
          <span className="flex shrink-0" aria-hidden="true">{isCameraPage ? (
            <Cctv className="h-4 w-4" />
          ) : isMixedProductsPage ? (
            <Tag className="h-4 w-4" />
          ) : (
            <Camera className="h-4 w-4" />
          )}</span>
          <span>Get quote</span>
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

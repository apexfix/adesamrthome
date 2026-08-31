"use client";

import Link from "next/link";
import { ArrowRight, Camera, MessageSquareText, Tag } from "lucide-react";
import type { JSX } from "react";
import { trackEvent } from "@/lib/analytics";
import { businessInfo } from "@/lib/seoData";

type CtaStyle = "hero" | "products";

type CTABlock = {
  context: CtaStyle;
  className?: string;
};

const items = [
  {
    context: "hero" as const,
    label: "Text us",
    event: "hero_cta_click",
    icon: MessageSquareText,
    href: `sms:${businessInfo.phoneInternational}?body=Hi%20ADE%20Smart%20Home%2C%20I%20would%20like%20a%20smart%20lock%20quote.`,
    text: "Text us",
    classes:
      "inline-flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-semibold text-white transition-colors hover:text-[#d9b98f] sm:min-h-14 sm:px-5 sm:text-base",
  },
  {
    context: "hero" as const,
    label: "Send door photos",
    event: "hero_cta_click",
    icon: Camera,
    href: `mailto:${businessInfo.email}?subject=Smart%20lock%20quote&body=Hi%20ADE%20Smart%20Home%2C%20I%20have%20door%20photos%20for%20a%20quote.`,
    text: "Send door photos",
    classes:
      "inline-flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-semibold text-white transition-colors hover:text-[#d9b98f] sm:min-h-14 sm:px-5 sm:text-base",
  },
  {
    context: "products" as const,
    label: "Get quote",
    event: "products_cta_click",
    icon: Tag,
    href: "/contact?service=not-sure&cta=products_quote",
    text: "Get quote",
    classes:
      "flex min-h-12 items-center justify-center gap-2 rounded-sm border border-zinc-700 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]",
    component: "link",
  },
  {
    context: "products" as const,
    label: "Send door photos",
    event: "products_cta_click",
    icon: Camera,
    href: `mailto:${businessInfo.email}?subject=Smart%20lock%20quote%20with%20door%20photos&body=Hi%20ADE%20Smart%20Home%2C%20here%20are%20my%20door%20photos.`,
    text: "Send door photos",
    classes:
      "flex min-h-12 items-center justify-center gap-2 rounded-sm border border-zinc-700 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]",
  },
  {
    context: "products" as const,
    label: "Text us",
    event: "products_cta_click",
    icon: MessageSquareText,
    href: `sms:${businessInfo.phoneInternational}?body=Hi%20ADE%20Smart%20Home%2C%20I%20would%20like%20an%20installation%20quote.`,
    text: "Text us",
    classes:
      "flex min-h-12 items-center justify-center gap-2 rounded-sm border border-zinc-700 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]",
  },
];

const heroLinks = [
  {
    label: "Check your door",
    event: "hero_cta_click",
    icon: ArrowRight,
    href: "/blog/smart-lock-door-compatibility-check",
    text: "Check Your Door",
    classes:
      "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white sm:min-h-14 sm:px-8 sm:text-base",
    asLink: true,
    component: "link",
    context: "hero" as const,
    label2: "check_your_door",
  },
  {
    label: "Get a quote",
    event: "hero_cta_click",
    icon: ArrowRight,
    href: "/contact?service=not-sure&cta=hero_quote",
    text: "Get a Quote",
    classes:
      "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-white/50 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-black sm:min-h-14 sm:px-8 sm:text-base",
    asLink: true,
    component: "link",
    context: "hero" as const,
    label2: "quote",
  },
];

function renderAction(item: typeof items[number]): JSX.Element {
  const Icon = item.icon;
  const label = item.context === "hero" ? item.label : item.text.toLowerCase();

  const track = () =>
    trackEvent(item.event, {
      cta: item.label,
      location: item.context,
      destination: item.text.toLowerCase().replace(/\s+/g, "_"),
    });

  return (
    <a
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={item.classes}
      onClick={track}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {item.text}
    </a>
  );
}

export function TrackingCTAs({ context, className }: CTABlock) {
  if (context === "hero") {
    return (
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
        {heroLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={item.classes}
            onClick={() =>
              trackEvent(item.event, {
                cta: item.label2,
                location: item.context,
              })
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.text}
          </Link>
        ))}
        {items
          .filter((item) => item.context === "hero")
          .map((item) => (
            <span key={item.label}>{renderAction(item)}</span>
          ))}
      </div>
    );
  }

  return (
    <div className={`mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:p-5 ${className ?? ""}`}>
      {items
        .filter((item) => item.context === "products")
        .map((item) => (
          <span key={item.label}>{renderAction(item)}</span>
        ))}
    </div>
  );
}

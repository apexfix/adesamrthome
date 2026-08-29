"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { captureLeadAttribution, trackEvent } from "@/lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
const googleTagIds = [...new Set([measurementId, googleAdsId].filter(Boolean))];
const primaryGoogleTagId = googleTagIds[0];

function getLinkLabel(link: HTMLAnchorElement): string {
  return (link.dataset.analyticsLabel || link.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export function SiteAnalytics() {
  const pathname = usePathname();
  const isFirstPageView = useRef(true);

  useEffect(() => {
    captureLeadAttribution();

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href") || "";
      const label = getLinkLabel(link);
      const commonParameters = {
        link_text: label,
        page_path: window.location.pathname,
      };

      if (href.startsWith("tel:")) {
        trackEvent("phone_click", commonParameters);
        return;
      }

      if (href.startsWith("mailto:")) {
        trackEvent("email_click", commonParameters);
        return;
      }

      try {
        const destination = new URL(link.href, window.location.origin);

        if (
          destination.origin === window.location.origin &&
          destination.pathname === "/contact"
        ) {
          trackEvent("quote_click", {
            ...commonParameters,
            service: destination.searchParams.get("service"),
            product: destination.searchParams.get("product"),
          });
          return;
        }

        if (
          destination.origin === window.location.origin &&
          destination.pathname.startsWith("/products/")
        ) {
          trackEvent("product_click", {
            ...commonParameters,
            product_path: destination.pathname,
          });
        }
      } catch {
        // Ignore non-navigation href values.
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (isFirstPageView.current) {
      isFirstPageView.current = false;
      return;
    }

    trackEvent("page_view", {
      page_path: `${window.location.pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!primaryGoogleTagId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryGoogleTagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          ${googleTagIds
            .map((id) => `gtag('config', ${JSON.stringify(id)});`)
            .join("\n          ")}
        `}
      </Script>
    </>
  );
}

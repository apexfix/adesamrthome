import { Fragment, type ReactNode } from "react";
import { Archivo } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileContactBar } from "@/components/MobileContactBar";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { DisclosureMotion } from "@/components/DisclosureMotion";
import { ProcessStepMotion } from "@/components/ProcessStepMotion";
import { GlassHighlight } from "@/components/GlassHighlight";
import { localProducts } from "@/lib/localProducts";
import type { ProductNavigationRoutes } from "@/lib/navigation";
import {
  BUSINESS_HOURS,
  GOOGLE_BUSINESS_URL,
  INSTALL_ONLY_PRICES,
  PACKAGE_FROM_PRICE,
  SERVICE_AREA_LABEL,
  WARRANTY_SUMMARY,
  businessInfo,
  coreServices,
  serviceAreas,
  siteUrl,
  socialProfiles,
} from "@/lib/seoData";

// Self-hosted at build time; the width axis gives headings a narrower, sturdier cut.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-archivo" });

export type SiteLang = "en" | "zh";

/** LocalBusiness schema shared by every page. Hours, phone and prices come from seoData constants. */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Locksmith"],
  "@id": `${siteUrl}/#business`,
  name: businessInfo.name,
  url: siteUrl,
  image: `${siteUrl}/img/og/ade-smart-home-adelaide.jpg`,
  logo: `${siteUrl}/img/logo.png`,
  telephone: businessInfo.phoneInternational,
  email: businessInfo.email,
  priceRange: `A$${INSTALL_ONLY_PRICES.compact}–A$1,350`,
  currenciesAccepted: "AUD",
  description:
    `Smart lock supply and installation across ${SERVICE_AREA_LABEL}. Supply + install packages from A$${PACKAGE_FROM_PRICE}, installation-only from A$${INSTALL_ONLY_PRICES.compact}, free remote door check and no deposit.`,
  address: {
    "@type": "PostalAddress",
    ...(businessInfo.streetAddress ? { streetAddress: businessInfo.streetAddress } : {}),
    addressLocality: businessInfo.addressLocality,
    addressRegion: businessInfo.addressRegion,
    ...(businessInfo.postalCode ? { postalCode: businessInfo.postalCode } : {}),
    addressCountry: businessInfo.country,
  },
  areaServed: [
    { "@type": "City", name: "Adelaide", containedInPlace: { "@type": "State", name: "South Australia" } },
    ...serviceAreas.map((area) => ({ "@type": "Place", name: `${area.name}, SA` })),
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: BUSINESS_HOURS.days,
      opens: BUSINESS_HOURS.opens,
      closes: BUSINESS_HOURS.closes,
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: businessInfo.phoneInternational,
    email: businessInfo.email,
    availableLanguage: ["English", "Chinese"],
    areaServed: "AU-SA",
    description: "Text messages (SMS) and email only. We do not take phone calls.",
  },
  hasMap: GOOGLE_BUSINESS_URL,
  knowsAbout: coreServices,
  knowsLanguage: ["en-AU", "zh-CN"],
  makesOffer: [
    {
      "@type": "Offer",
      name: "Smart lock supply + installation package",
      price: PACKAGE_FROM_PRICE,
      priceCurrency: "AUD",
      url: `${siteUrl}/smart-lock-supply-installation-adelaide`,
    },
    {
      "@type": "Offer",
      name: "Smart lock installation only (compact lock)",
      price: INSTALL_ONLY_PRICES.compact,
      priceCurrency: "AUD",
      url: `${siteUrl}/smart-lock-installation-only-adelaide`,
    },
    {
      "@type": "Offer",
      name: "Smart lock installation only (full-size mortise lock)",
      price: INSTALL_ONLY_PRICES.mortise,
      priceCurrency: "AUD",
      url: `${siteUrl}/smart-lock-installation-only-adelaide`,
    },
  ],
  additionalProperty: [{ "@type": "PropertyValue", name: "Warranty", value: WARRANTY_SUMMARY }],
  sameAs: [GOOGLE_BUSINESS_URL, ...socialProfiles],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "ADE Smart Home",
  inLanguage: ["en-AU", "zh-CN"],
  publisher: { "@id": `${siteUrl}/#business` },
};

const productNavigation: ProductNavigationRoutes = Object.fromEntries(localProducts.map(product => [
  `/products/${product.slug}`,
  product.slug === "smart-lock-installation-only-service" ? "installation" : "locks",
]));

/** The <html> shell for both root layouts: English routes in (site) and Chinese routes in /zh. */
export function RootDocument({ lang, children }: { lang: SiteLang; children: ReactNode }) {
  return (
    <html lang={lang === "zh" ? "zh-CN" : "en-AU"} className={archivo.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Header productNavigation={productNavigation} lang={lang} />
        <div id="site-content" tabIndex={-1}>
          {/* Keep streamed route reconciliation separate from claiming this DOM wrapper. */}
          <Fragment key="route-content">{children}</Fragment>
        </div>
        <Footer lang={lang} />
        <MobileContactBar lang={lang} />
        <SiteAnalytics />
        <DisclosureMotion />
        <ProcessStepMotion />
        <GlassHighlight />
      </body>
    </html>
  );
}

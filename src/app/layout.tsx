import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileContactBar } from "@/components/MobileContactBar";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import {
  businessInfo,
  coreServices,
  serviceAreas,
  siteUrl,
  smartLockBrands,
  socialProfiles,
} from "@/lib/seoData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smart Lock Installation Adelaide | ADE Smart Home",
    template: "%s | ADE Smart Home",
  },
  description:
    "Professional smart lock installation in Adelaide for timber, aluminium and selected security screen doors. Philips, EZVIZ, Samsung, Aqara and imported smart locks. 400+ local installations, free door compatibility check and local after-sales support.",
  keywords: [
    "Smart Lock Installation Adelaide",
    "Digital Door Lock Installation Adelaide",
    "Fingerprint Lock Installer Adelaide",
    "Smart Door Lock Adelaide",
    "Philips Smart Lock Adelaide",
    "EZVIZ Smart Lock Adelaide",
    "Samsung Digital Lock Adelaide",
    "Aqara Smart Lock Adelaide",
    "Imported Smart Lock Installer Adelaide",
    "阿德莱德智能锁安装",
    "阿德莱德电子锁安装",
    "阿德莱德指纹锁安装",
    "阿德莱德自购智能锁安装",
  ],
  authors: [{ name: "ADE Smart Home" }],
  creator: "ADE Smart Home",
  publisher: "ADE Smart Home",
  icons: {
    icon: "/img/logo.png",
    apple: "/img/logo.png",
  },
  openGraph: {
    title: "Smart Lock Installation Adelaide | ADE Smart Home",
    description:
      "Adelaide smart lock installation specialists. 400+ local installations for Philips, EZVIZ, Samsung, Aqara and imported smart locks. Free door compatibility check.",
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/hero1.avif",
        width: 1200,
        height: 630,
        alt: "ADE Smart Home smart lock installation in Adelaide",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Lock Installation Adelaide | ADE Smart Home",
    description:
      "Professional smart lock supply and installation, installation-only service and door compatibility checks across Adelaide.",
    images: ["/img/hero1.avif"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${siteUrl}/#business`,
  name: businessInfo.name,
  url: siteUrl,
  image: `${siteUrl}/img/logo.png`,
  logo: `${siteUrl}/img/logo.png`,
  telephone: businessInfo.phoneInternational,
  email: businessInfo.email,
  priceRange: "$$",
  description:
    "ADE Smart Home provides professional smart lock supply and installation plus installation-only service for compatible customer-supplied locks across Adelaide. The team has completed 400+ local installations with a focus on neat flush-finish workmanship and local after-sales support.",
  address: {
    "@type": "PostalAddress",
    addressLocality: businessInfo.addressLocality,
    addressRegion: businessInfo.addressRegion,
    postalCode: businessInfo.postalCode,
    addressCountry: businessInfo.country,
  },
  areaServed: serviceAreas.map((area) => ({
    "@type": "City",
    name: area.name,
  })),
  knowsAbout: [
    ...coreServices,
    ...smartLockBrands.map((brand) => `${brand} smart lock installation`),
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Smart Lock Installation Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Smart Lock Installation Adelaide",
          description:
            "Professional installation of fingerprint, keypad, video and app-controlled smart locks across Adelaide.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Customer-Supplied Smart Lock Installation Adelaide",
          description:
            "Compatibility assessment and professional installation for suitable smart locks purchased by the customer.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Door Compatibility Check",
          description:
            "Free door photo assessment before smart lock installation to check compatibility and installation requirements.",
        },
      },
    ],
  },
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Completed local installations",
      value: "400+",
    },
    {
      "@type": "PropertyValue",
      name: "Warranty",
      value: "Local support with warranty terms confirmed for each product and installation package",
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  sameAs: socialProfiles,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "ADE Smart Home",
  description:
    "Smart lock supply and installation, customer-supplied smart lock installation and door compatibility checks in Adelaide.",
  inLanguage: ["en-AU", "zh-CN"],
  publisher: {
    "@id": `${siteUrl}/#business`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Header />
        {children}
        <Footer />
        <MobileContactBar />
        <SiteAnalytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { businessInfo, coreServices, serviceAreas, siteUrl, smartLockBrands } from "@/lib/seoData";

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
    "CCTV Installation Adelaide",
    "阿德莱德智能锁安装",
    "阿德莱德电子锁安装",
    "阿德莱德指纹锁安装",
    "阿德莱德监控安装",
  ],
  authors: [{ name: "ADE Smart Home" }],
  creator: "ADE Smart Home",
  publisher: "ADE Smart Home",
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-AU": siteUrl,
      "zh-CN": `${siteUrl}/zh`,
    },
  },
  icons: {
    icon: "/img/logo.png",
    apple: "/img/logo.png",
  },
  openGraph: {
    title: "Smart Lock Installation Adelaide | ADE Smart Home",
    description:
      "Adelaide smart lock installation specialists. 400+ local installations for Philips, EZVIZ, Samsung, Aqara and imported smart locks. Free door compatibility check.",
    url: siteUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/hero1.jpg",
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
      "Professional smart lock installation, CCTV installation and smart home setup across Adelaide.",
    images: ["/img/hero1.jpg"],
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
  "@type": ["LocalBusiness", "Locksmith"],
  "@id": `${siteUrl}/#business`,
  name: businessInfo.name,
  url: siteUrl,
  image: `${siteUrl}/img/logo.png`,
  logo: `${siteUrl}/img/logo.png`,
  telephone: businessInfo.phoneInternational,
  email: businessInfo.email,
  priceRange: "$$",
  description:
    "ADE Smart Home provides professional smart lock installation, digital door lock installation, CCTV installation and smart home setup across Adelaide. The team has completed 400+ local installations with a focus on neat flush-finish workmanship and local after-sales support.",
  address: {
    "@type": "PostalAddress",
    addressLocality: businessInfo.addressLocality,
    addressRegion: businessInfo.addressRegion,
    postalCode: businessInfo.postalCode,
    addressCountry: businessInfo.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: businessInfo.latitude,
    longitude: businessInfo.longitude,
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
    name: "Smart Lock and Smart Home Installation Services",
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
          name: "CCTV Installation Adelaide",
          description:
            "Home security camera installation and smart surveillance setup across Adelaide.",
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
      value: "2-year local product warranty and workmanship support",
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
  sameAs: [
    "https://www.facebook.com/",
    "https://www.instagram.com/",
    "https://www.tiktok.com/",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "ADE Smart Home",
  description:
    "Smart lock installation, digital door lock installation, CCTV installation and smart home services in Adelaide.",
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
      </body>
    </html>
  );
}

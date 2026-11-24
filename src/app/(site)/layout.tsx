import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/RootDocument";
import { siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smart Lock Installation Adelaide | ADE Smart Home",
    template: "%s | ADE Smart Home",
  },
  description:
    "Smart lock supply and installation across Adelaide metro. Supply + install packages from $599, free remote door check, no deposit.",
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
      "Smart lock supply + install packages from $599 across Adelaide metro. Free remote door check, no deposit, app and fingerprint setup on site.",
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/og/ade-smart-home-adelaide.jpg",
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
      "Smart lock supply + install packages from $599 across Adelaide metro. Free remote door check and no deposit.",
    images: ["/img/og/ade-smart-home-adelaide.jpg"],
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

export default function SiteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}

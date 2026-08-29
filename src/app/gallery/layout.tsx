import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Adelaide Smart Lock Installation Gallery",
  description:
    "See real smart lock installations completed across Adelaide by ADE Smart Home, including timber, aluminium and selected security doors.",
  alternates: { canonical: `${siteUrl}/gallery` },
  openGraph: {
    title: "Adelaide Smart Lock Installation Gallery",
    description: "Real smart lock installation results from Adelaide homes.",
    url: `${siteUrl}/gallery`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/hero1.avif", width: 1200, height: 630 }],
    locale: "en_AU",
    type: "website",
  },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return children;
}

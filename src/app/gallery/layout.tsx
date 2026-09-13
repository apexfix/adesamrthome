import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/seoData";
import { installationProjects } from "@/lib/installationProjects";

export const metadata: Metadata = {
  title: "Adelaide Smart Lock Installation Gallery",
  description:
    "View real Lockin smart lock installations in Adelaide, including X9, V5 Max, S6 Max and OLA Slim. Compare installed models or enquire about installation only.",
  alternates: { canonical: `${siteUrl}/gallery` },
  openGraph: {
    title: "Adelaide Smart Lock Installation Gallery",
    description: "Real smart lock installation results from Adelaide homes.",
    url: `${siteUrl}/gallery`,
    siteName: "ADE Smart Home",
    images: [{ url: installationProjects[0].image, alt: installationProjects[0].title }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adelaide Smart Lock Installation Gallery",
    description: "Real smart lock installation results from Adelaide homes.",
    images: [installationProjects[0].image],
  },
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return children;
}

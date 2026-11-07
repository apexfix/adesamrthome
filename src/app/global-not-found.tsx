import type { Metadata } from "next";
import "./globals.css";
import { RootDocument } from "@/components/RootDocument";
import NotFound from "./(site)/not-found";

// With two root layouts ((site) in English, /zh in Chinese) unmatched URLs need their own document.
export const metadata: Metadata = {
  title: "Page not found | ADE Smart Home",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFound />
    </RootDocument>
  );
}

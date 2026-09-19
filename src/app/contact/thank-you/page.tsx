import type { Metadata } from "next";
import { LeadConversionTracker } from "@/components/LeadConversionTracker";
import { EnquiryThankYou } from "@/components/EnquiryThankYou";
import { siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Enquiry Details",
  description: "Keep your ADE Smart Home enquiry reference or check your submission by SMS or email.",
  alternates: { canonical: `${siteUrl}/contact/thank-you` },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 text-white md:pt-32">
      <LeadConversionTracker />
      <EnquiryThankYou />
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  MessageSquareText,
  Mail,
} from "lucide-react";
import { LeadConversionTracker } from "@/components/LeadConversionTracker";
import { businessInfo, siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Enquiry Received",
  description: "Your ADE Smart Home enquiry has been received.",
  alternates: { canonical: `${siteUrl}/contact/thank-you` },
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const isCameraKit = params.service === "security-camera-kit";
  const nextSteps = [
  {
    number: "01",
    title: "We review the details",
    detail: isCameraKit ? "We review the package name, quantity and product enquiry you shared." : "We review the door, current lock, requested service and any photos you supplied.",
  },
  {
    number: "02",
    title: "We ask for anything missing",
    detail: isCameraKit ? "We will contact you by SMS or email if we need more information about the equipment you need." : "If we need another photo or measurement, we will contact you by SMS or email.",
  },
  {
    number: "03",
    title: "You receive the next step",
    detail:
      isCameraKit ? "We confirm equipment availability, package contents and pricing before you order." : "We confirm suitability, scope and pricing before you decide whether to book.",
  },
  ];
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 text-white md:pt-32">
      <LeadConversionTracker />

      <section className="border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-5 pb-14 sm:px-8 md:pb-20">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" aria-hidden="true" />
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">
            Enquiry received
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Thank You. We Have Your Details.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
            {isCameraKit ? "We will review your camera equipment enquiry and reply by SMS or email." : "We will review your smart lock requirements and reply by SMS or email."}
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <h2 className="text-2xl font-black md:text-4xl">What happens next</h2>
          <div className="mt-9 grid border-y border-zinc-800 md:grid-cols-3">
            {nextSteps.map((step, index) => (
              <article
                key={step.number}
                data-process-step
                className={`py-7 md:px-7 ${
                  index > 0 ? "border-t border-zinc-800 md:border-l md:border-t-0" : ""
                }`}
              >
                <p data-step-number className="text-sm font-black text-[#d9b98f]">{step.number}</p>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{step.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={`sms:${businessInfo.phoneInternational}?body=Hi%20ADE%20Smart%20Home%2C%20I%20have%20just%20submitted%20a%20website%20enquiry.`}
              className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#d9b98f] px-5 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
              Add Details by SMS
            </a>
            <a
              href={`mailto:${businessInfo.email}?subject=${isCameraKit ? "Camera%20equipment%20enquiry" : "More%20door%20photos%20for%20my%20enquiry"}`}
              className="inline-flex min-h-14 items-center justify-center gap-3 border border-zinc-700 px-5 text-sm font-bold text-white transition-colors hover:border-[#d9b98f] hover:text-[#d9b98f]"
            >
              <span aria-hidden="true">{isCameraKit ? <Mail className="h-5 w-5" /> : <Camera className="h-5 w-5" />}</span>
              <span>{isCameraKit ? "Email More Details" : "Email More Door Photos"}</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm">
            <Link
              href={isCameraKit ? "/products/security-camera-kits" : "/blog/smart-lock-door-compatibility-check"}
              className="inline-flex items-center gap-2 font-bold text-[#d9b98f] hover:text-white"
            >
              <span>{isCameraKit ? "Browse camera equipment" : "Check door photo requirements"}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/" className="font-bold text-zinc-400 hover:text-white">
              Return home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

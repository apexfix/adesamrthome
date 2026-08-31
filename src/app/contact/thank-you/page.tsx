import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  MessageSquareText,
} from "lucide-react";
import { LeadConversionTracker } from "@/components/LeadConversionTracker";
import { businessInfo, siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Enquiry Received",
  description: "Your ADE Smart Home smart lock enquiry has been received.",
  alternates: { canonical: `${siteUrl}/contact/thank-you` },
  robots: { index: false, follow: false },
};

const nextSteps = [
  {
    number: "01",
    title: "We review the details",
    detail: "We review the door, current lock, requested service and any photos you supplied within 24 hours.",
  },
  {
    number: "02",
    title: "We ask for anything missing",
    detail: "If we need another photo or measurement, we will contact you by SMS or email.",
  },
  {
    number: "03",
    title: "You receive the next step",
    detail:
      "We confirm suitability, scope and pricing (normally within 48 hours) before you decide whether to book.",
  },
];

export default function ThankYouPage() {
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
            We will review your smart lock requirements and reply by SMS or email.
            If you entered an email address, a confirmation and checklist should
            also arrive in your inbox within a short time.
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
                className={`py-7 md:px-7 ${
                  index > 0 ? "border-t border-zinc-800 md:border-l md:border-t-0" : ""
                }`}
              >
                <p className="text-sm font-black text-[#d9b98f]">{step.number}</p>
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
              href={`mailto:${businessInfo.email}?subject=More%20door%20photos%20for%20my%20enquiry`}
              className="inline-flex min-h-14 items-center justify-center gap-3 border border-zinc-700 px-5 text-sm font-bold text-white transition-colors hover:border-[#d9b98f] hover:text-[#d9b98f]"
            >
              <Camera className="h-5 w-5" aria-hidden="true" />
              Email More Door Photos
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm">
            <Link
              href="/blog/smart-lock-door-compatibility-check"
              className="inline-flex items-center gap-2 font-bold text-[#d9b98f] hover:text-white"
            >
              Check door photo requirements
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

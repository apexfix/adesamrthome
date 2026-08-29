import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  DoorOpen,
  PackageCheck,
  MessageSquareText,
  Ruler,
  Smartphone,
  Wrench,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessInfo, siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/smart-lock-installation-only-adelaide`;

export const metadata: Metadata = {
  title: "Smart Lock Installation Only Adelaide",
  description:
    "Already bought a smart lock? Adelaide installation-only service is $150 for smaller compatible smart locks and $350 for larger smart locks. Send the model and door photos for assessment.",
  keywords: [
    "smart lock installation only Adelaide",
    "customer supplied smart lock installation Adelaide",
    "install my smart lock Adelaide",
    "imported smart lock installer Adelaide",
    "digital door lock installation Adelaide",
    "fingerprint lock installation Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Customer-Supplied Smart Lock Installation Adelaide",
    description:
      "Installation-only service: $150 for smaller compatible smart locks and $350 for larger smart locks. Send the model and door photos before booking.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-v5-max/real-install-04.jpg",
        width: 1200,
        height: 1600,
        alt: "Customer-supplied smart lock professionally installed on an Adelaide door",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Lock Installation Only Adelaide",
    description:
      "$150 small-lock and $350 large-lock installation-only service for compatible customer-supplied smart locks across Adelaide.",
    images: ["/img/products/lockin-v5-max/real-install-04.jpg"],
  },
};

const requirements = [
  {
    icon: PackageCheck,
    title: "Exact lock model",
    detail: "Send the product name, model number or the original online listing.",
  },
  {
    icon: DoorOpen,
    title: "Clear door photos",
    detail: "Include both faces of the door, the door edge, current lock and door frame.",
  },
  {
    icon: Ruler,
    title: "Key measurements",
    detail: "Door thickness and the clearance to any security screen help us check suitability.",
  },
  {
    icon: Smartphone,
    title: "App and region details",
    detail: "Imported models may have region, language or app restrictions that need checking.",
  },
];

const steps = [
  {
    number: "01",
    title: "Send the model and door photos",
    detail: "Use the enquiry form below or email the lock listing and clear door photos.",
  },
  {
    number: "02",
    title: "We assess compatibility",
    detail: "We check the lock body, door material, existing cut-out and likely installation scope.",
  },
  {
    number: "03",
    title: "Confirm price and booking",
    detail: "You receive the quoted scope before choosing an available installation time.",
  },
  {
    number: "04",
    title: "Installation and basic setup",
    detail: "We fit the lock, test operation and help with basic app or user setup where supported.",
  },
];

const faqs = [
  {
    question: "Can you install a smart lock that I bought online?",
    answer:
      "Yes, provided the model is compatible with your door and arrives complete and functional. Send the exact listing and door photos before booking so we can assess the likely installation scope.",
  },
  {
    question: "How much does installation-only service cost?",
    answer:
      "Small smart lock installation is $150 and large smart lock installation is $350, subject to a compatibility check. Door material, existing holes and any non-standard cutting or repair work are reviewed before booking.",
  },
  {
    question: "Can you install imported Chinese smart locks?",
    answer:
      "We install many imported fingerprint, keypad, face-recognition and video smart locks. Compatibility, app region, language and lock-body dimensions must be checked first.",
  },
  {
    question: "What happens if the lock will not fit my door?",
    answer:
      "When the photos or measurements show a clear compatibility problem, we will explain it before booking and may suggest a more suitable lock type or model.",
  },
  {
    question: "Who covers the product warranty?",
    answer:
      "The seller or manufacturer remains responsible for the warranty on a customer-supplied lock. Installation support and any workmanship terms are confirmed with the quoted scope.",
  },
];

export default function InstallationOnlyPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Customer-Supplied Smart Lock Installation Adelaide",
    serviceType: "Smart lock installation only",
    url: pageUrl,
    description:
      "Professional installation for compatible customer-supplied fingerprint, keypad, video and imported smart locks across Adelaide.",
    provider: {
      "@id": `${siteUrl}/#business`,
    },
    areaServed: {
      "@type": "City",
      name: "Adelaide",
      addressRegion: "SA",
      addressCountry: "AU",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Smart Lock Installation Only Adelaide",
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="bg-white text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative flex min-h-[650px] items-end overflow-hidden bg-black pt-28 text-white md:min-h-[720px] md:items-center">
        <Image
          src="/img/products/lockin-v5-max/real-install-04.jpg"
          alt="Smart lock installed on a timber door in Adelaide"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">
            Adelaide installation-only service
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Already Bought a Smart Lock?
            <span className="block text-[#d9b98f]">We Can Check and Install It.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">
            Professional installation for compatible customer-supplied smart locks across
            Adelaide. Small smart lock installation is $150 and large smart lock installation is
            $350. Send the exact model and door photos first so we can confirm compatibility
            before booking.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#quote"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              Request Installation Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`sms:${businessInfo.phoneInternational}?body=Hi%20ADE%20Smart%20Home%2C%20I%20would%20like%20an%20installation-only%20quote.`}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Text us
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/25 pt-5 text-xs text-zinc-200">
            {[
              "Small lock installation $150",
              "Large lock installation $350",
              "Compatibility checked first",
              "No upfront payment",
            ].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">
              Before we quote
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Four things help us check the job properly
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              A smart lock can look suitable online but still be incompatible with the door,
              existing lock body or frame clearance. These details let us assess it before
              anyone travels to site.
            </p>
          </div>

          <div className="mt-12 grid border-y border-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {requirements.map(({ icon: Icon, title, detail }, index) => (
              <article
                key={title}
                className={`py-8 md:px-7 ${
                  index > 0 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""
                }`}
              >
                <Icon className="h-7 w-7 text-[#9c7953]" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-12">
          <div className="relative aspect-[4/5] min-h-[440px] overflow-hidden bg-slate-200">
            <Image
              src="/img/smart-lock-door-measurement-requirements.png"
              alt="Door photos and measurements required before smart lock installation"
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">
              Compatibility first
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              We install the right lock for the right door
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              We can assess many fingerprint, keypad, push-pull, mortise, video and imported
              smart locks. Suitability depends on the complete lock body, not only the front
              panel shown in the product listing.
            </p>

            <ul className="mt-7 space-y-4 text-sm leading-6 text-slate-700">
              {[
                "Timber and many aluminium entry doors",
                "Replacement of suitable existing digital locks",
                "Imported models with complete installation hardware",
                "App connection and basic user setup where supported",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/blog/smart-lock-door-compatibility-check"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#8a6b48] hover:text-black"
            >
              View the full door compatibility guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">
              Simple process
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">From photos to installation</h2>
          </div>

          <div className="mt-12 grid border-y border-zinc-800 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className={`py-8 md:px-7 ${
                  index > 0 ? "border-t border-zinc-800 md:border-l md:border-t-0" : ""
                }`}
              >
                <p className="text-sm font-black text-[#d9b98f]">{step.number}</p>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{step.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-5 border border-zinc-800 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
            <ClipboardCheck className="h-9 w-9 text-[#d9b98f]" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-bold">Customer-supplied product responsibility</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                The lock should arrive complete, undamaged and functional. Product defects,
                missing parts and manufacturer warranty remain with the seller or manufacturer;
                the installation scope is confirmed separately.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <Wrench className="mx-auto h-8 w-8 text-[#9c7953]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Installation-only FAQ</h2>
          </div>

          <div className="mt-10 border-y border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-slate-200 last:border-b-0">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left font-bold">
                  {faq.question}
                  <span className="text-xl font-normal text-[#8a6b48] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactForm initialService="installation-only" />
    </main>
  );
}

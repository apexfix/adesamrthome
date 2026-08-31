import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  KeyRound,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessInfo, siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/airbnb-smart-lock-installation-adelaide`;

export const metadata: Metadata = {
  title: "Airbnb Smart Lock Installation Adelaide",
  description:
    "Smart lock supply, installation and setup for Adelaide Airbnb hosts, short-stay operators and property managers. Start with one property or request portfolio pricing.",
  keywords: [
    "Airbnb smart lock installation Adelaide",
    "short stay smart lock Adelaide",
    "property manager smart lock installation Adelaide",
    "Airbnb door lock Adelaide",
    "guest access smart lock Adelaide",
    "rental property smart lock Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Airbnb Smart Lock Installation Adelaide",
    description:
      "Reliable guest access starts at the front door. Smart lock supply, installation and setup for Adelaide short-stay properties.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-x9/real-install-03.jpg",
        width: 1292,
        height: 1723,
        alt: "Smart lock installed on a modern Adelaide short-stay property entrance",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Airbnb Smart Lock Installation Adelaide",
    description:
      "Smart lock supply, installation and guest-access setup for Adelaide Airbnb and short-stay properties.",
    images: ["/img/products/lockin-x9/real-install-03.jpg"],
  },
};

const useCases = [
  {
    icon: KeyRound,
    title: "Guest access",
    detail:
      "Create PIN access for guests and remove the need for physical key handovers where the selected lock supports it.",
  },
  {
    icon: Sparkles,
    title: "Cleaner access",
    detail:
      "Set up separate access for cleaners or maintenance teams using supported lock and app features.",
  },
  {
    icon: Building2,
    title: "Multiple properties",
    detail:
      "Trial one property first, then discuss a consistent lock and installation approach for the wider portfolio.",
  },
  {
    icon: Smartphone,
    title: "Owner handover",
    detail:
      "We test the lock and help with basic app, PIN, fingerprint and administrator setup where supported.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Send the property details",
    detail:
      "Share the suburb, door photos, current lock and whether you already own a smart lock.",
  },
  {
    number: "02",
    title: "Confirm compatibility and scope",
    detail:
      "We assess the door, recommend a suitable route and confirm the installation scope before booking.",
  },
  {
    number: "03",
    title: "Install and configure",
    detail:
      "The lock is fitted and tested, then supported access features are set up with the property owner or manager.",
  },
  {
    number: "04",
    title: "Review the first property",
    detail:
      "Once the pilot is working well, we can plan consistent access for other suitable properties.",
  },
];

const faqs = [
  {
    question: "Can you install a smart lock that I have already purchased?",
    answer:
      "Yes. We offer installation-only service for compatible customer-supplied smart locks. Send the exact model or product listing and clear door photos so we can check suitability before booking.",
  },
  {
    question: "Can guests and cleaners have different access codes?",
    answer:
      "Many smart locks support separate PINs, temporary access or app-managed users. The available controls depend on the selected lock and app, so we confirm the required access workflow before recommending a model.",
  },
  {
    question: "Does the lock connect directly to Airbnb or my property-management software?",
    answer:
      "Some locks and third-party platforms offer integrations, while others are managed through their own app. We configure the lock features included with the selected model; any external platform integration should be confirmed separately before purchase.",
  },
  {
    question: "Can we start with one property before fitting the whole portfolio?",
    answer:
      "Yes. A one-property trial is the practical way to confirm door compatibility, the guest-access workflow and day-to-day usability before planning a larger rollout.",
  },
  {
    question: "Do you service properties outside central Adelaide?",
    answer:
      "We work across Adelaide and surrounding areas. Send the property suburb with your enquiry and we will confirm availability for that location.",
  },
];

export default function AirbnbSmartLockInstallationPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Airbnb Smart Lock Installation Adelaide",
    serviceType: "Smart lock installation for short-stay and rental properties",
    url: pageUrl,
    description:
      "Smart lock supply, installation and setup for Adelaide Airbnb hosts, short-stay operators and property managers.",
    provider: {
      "@id": `${siteUrl}/#business`,
    },
    areaServed: {
      "@type": "City",
      name: "Adelaide",
      addressRegion: "SA",
      addressCountry: "AU",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Airbnb hosts, short-stay operators and property managers",
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
        name: "Airbnb Smart Lock Installation Adelaide",
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

      <section className="relative flex min-h-[680px] items-end overflow-hidden bg-black pt-28 text-white md:min-h-[740px] md:items-center">
        <Image
          src="/img/products/lockin-x9/real-install-03.jpg"
          alt="Smart lock installed on an Adelaide short-stay property entrance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">
            Adelaide short-stay access
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Airbnb Smart Lock Installation
            <span className="block text-[#d9b98f]">Without the Key Handover.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">
            Smart lock supply, installation and setup for Adelaide Airbnb hosts, short-stay
            operators and property managers. Start with one property, confirm the workflow,
            then scale only when it works for your team.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#quote"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              Plan One Property
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`sms:${businessInfo.phoneInternational}?body=Hi%20ADE%20Smart%20Home%2C%20I%20need%20a%20smart%20lock%20for%20an%20Airbnb%20or%20rental%20property.`}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Text Property Details
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/25 pt-5 text-xs text-zinc-200">
            {[
              "Supply and installation",
              "Installation-only available",
              "Compatibility checked first",
              "Portfolio planning after a trial",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">
              Access that fits operations
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Less time coordinating keys between stays
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              The right lock depends on the door, guest-access process and people who need to
              enter between bookings. We check those details before installation, rather than
              treating every property the same.
            </p>
          </div>

          <div className="mt-12 grid border-y border-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map(({ icon: Icon, title, detail }, index) => (
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
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-2 md:items-center lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">
              Two service routes
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Use our lock, or supply your own
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              We can recommend and supply a suitable smart lock, or install a compatible lock
              that you have already purchased. Either route starts with the door and access
              requirements, not just the product photo.
            </p>

            <div className="mt-9 border-y border-slate-200">
              <div className="grid gap-4 border-b border-slate-200 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <ShieldCheck className="h-7 w-7 text-[#9c7953]" aria-hidden="true" />
                <div>
                  <h3 className="font-bold">Supply and installation</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    A compatible lock, standard installation and local support in one quoted
                    package.
                  </p>
                </div>
                <Link
                  href="/smart-lock-supply-installation-adelaide"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#8a6b48] hover:text-black"
                >
                  View packages
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="grid gap-4 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <Wrench className="h-7 w-7 text-[#9c7953]" aria-hidden="true" />
                <div>
                  <h3 className="font-bold">Installation only</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    We check and install compatible customer-supplied smart locks.
                  </p>
                </div>
                <Link
                  href="/smart-lock-installation-only-adelaide"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#8a6b48] hover:text-black"
                >
                  Check my lock
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] min-h-[440px] overflow-hidden bg-slate-200">
            <Image
              src="/img/products/lockin-x9/real-install-04.jpg"
              alt="Smart lock installed for guest access at an Adelaide property"
              fill
              sizes="(min-width: 768px) 48vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">
              Start small, then standardise
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              A practical one-property pilot
            </h2>
          </div>

          <div className="mt-12 grid border-y border-zinc-800 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, index) => (
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

          <div className="mt-10 grid gap-5 border border-zinc-800 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
            <ClipboardCheck className="h-9 w-9 text-[#d9b98f]" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-bold">Managing several Adelaide properties?</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Tell us how many properties you manage and the suburbs involved. After the
                first compatible installation, we can discuss a repeatable scope and portfolio
                pricing.
              </p>
            </div>
            <Link
              href="#quote"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#d9b98f] px-5 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              Discuss a Portfolio
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-[#9c7953]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Short-stay smart lock FAQ</h2>
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

      <ContactForm
        initialService="portfolio-project"
        initialProduct="Airbnb / short-stay property"
      />
    </main>
  );
}

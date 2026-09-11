import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, DoorOpen, Mail, MapPin, MessageSquareText, Wrench } from "lucide-react";
import { businessInfo, serviceAreas, siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/service-areas`;

export const metadata: Metadata = {
  title: "Smart Lock Installation Service Areas Adelaide",
  description:
    "Smart lock supply, installation-only service and door compatibility checks across Adelaide CBD, eastern, western, northern, southern and coastal suburbs.",
  keywords: [
    "smart lock installation service areas Adelaide",
    "smart lock installer near me Adelaide",
    "Adelaide smart lock installation suburbs",
    "digital door lock installer Adelaide",
    "customer supplied smart lock installation Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Adelaide Smart Lock Installation Service Areas",
    description:
      "Explore ADE Smart Home service areas for supplied smart locks, installation-only work and door compatibility checks across Adelaide.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [{
      url: "/img/products/lockin-s50m-pro/real-install-01.jpg",
      width: 1200,
      height: 1600,
      alt: "Smart lock professionally installed on an Adelaide front door",
    }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adelaide Smart Lock Installation Service Areas",
    description: "Smart lock supply, installation-only service and door checks across Adelaide suburbs.",
    images: ["/img/products/lockin-s50m-pro/real-install-01.jpg"],
  },
};

const zones = [
  {
    name: "Central & inner Adelaide",
    detail: "CBD apartments, character homes, rental properties and renovated front entries.",
    areas: "Adelaide CBD, North Adelaide, Unley, Parkside, Prospect and nearby suburbs",
  },
  {
    name: "Eastern & north-eastern suburbs",
    detail: "Timber doors, premium entry doors and practical family-home smart lock upgrades.",
    areas: "Norwood, Burnside, Paradise, Modbury, Tea Tree Gully and surrounding suburbs",
  },
  {
    name: "Western & coastal suburbs",
    detail: "Homes, apartments and townhouses across Adelaide's western and beachside areas.",
    areas: "Glenelg, Henley Beach, West Lakes, Grange, Brighton and nearby suburbs",
  },
  {
    name: "Northern Adelaide",
    detail: "Modern homes, investment properties and family homes needing dependable access.",
    areas: "Mawson Lakes, Salisbury, Pooraka, Ingle Farm and surrounding suburbs",
  },
  {
    name: "Southern Adelaide",
    detail: "Smart lock fitting for homes, units and rental properties south of the city.",
    areas: "Marion, Oaklands Park, Warradale, Edwardstown and nearby suburbs",
  },
];

const faqs = [
  {
    question: "Do you service my Adelaide suburb?",
    answer:
      "We work across metropolitan Adelaide and nearby service suburbs. The locations on this page show common areas rather than a strict boundary. Send your suburb or postcode and door photos so we can confirm availability.",
  },
  {
    question: "Is installation-only service available across Adelaide?",
    answer:
      "Yes. We install compatible customer-supplied smart locks across our Adelaide service area, subject to a door compatibility check and appointment availability.",
  },
  {
    question: "Can you supply the smart lock as well as install it?",
    answer:
      "Yes. You can choose a supply-and-install package, or ask us to install a compatible lock you have already purchased.",
  },
  {
    question: "Can you check my door before arranging a visit?",
    answer:
      "Yes. Send clear photos of both sides of the door, the door edge, current lock and frame. We use these to assess compatibility and likely installation scope before booking.",
  },
  {
    question: "Are there extra costs for some locations?",
    answer:
      "Any location-dependent cost is confirmed before booking. Send your postcode with the door details and we will explain the complete scope before you decide.",
  },
];

export default function ServiceAreasPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Smart Lock Installation Across Adelaide",
    serviceType: "Smart lock supply and installation",
    url: pageUrl,
    description:
      "Smart lock supply, installation-only service and door compatibility checks across metropolitan Adelaide and nearby service suburbs.",
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: serviceAreas.map((area) => ({
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.name,
        addressRegion: "SA",
        addressCountry: "AU",
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Adelaide smart lock services",
      itemListElement: [
        "Smart lock supply and installation",
        "Customer-supplied smart lock installation",
        "Door compatibility check",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: pageUrl },
    ],
  };

  return (
    <main className="bg-white text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative flex min-h-[650px] items-end overflow-hidden bg-black pt-28 text-white md:min-h-[720px] md:items-center">
        <Image
          src="/img/products/lockin-s50m-pro/real-install-01.jpg"
          alt="Smart lock installation on a modern Adelaide front door"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">Local Adelaide service</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Smart Lock Installation
            <span className="block text-[#d9b98f]">Across Adelaide</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">
            Smart locks supplied and installed, customer-supplied lock installation and free door
            compatibility checks across metropolitan Adelaide and nearby service suburbs.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact?service=not-sure"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              Check My Suburb
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent("Hi ADE Smart Home, can you confirm smart lock installation availability for my suburb?")}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Text {businessInfo.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Metropolitan coverage</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">One local service across Adelaide</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              We work across central, eastern, western, northern, southern and coastal Adelaide.
              Your suburb does not need to appear below: send your postcode and door photos and we
              will confirm availability, compatibility and any location-dependent cost before booking.
            </p>
          </div>
          <div className="mt-12 grid border-y border-slate-200 md:grid-cols-2">
            {zones.map((zone, index) => (
              <article
                key={zone.name}
                className={`py-8 md:px-8 ${index % 2 === 1 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""} ${index > 1 ? "border-t border-slate-200" : ""}`}
              >
                <MapPin className="h-6 w-6 text-[#9c7953]" strokeWidth={1.7} aria-hidden="true" />
                <h3 className="mt-4 text-xl font-black">{zone.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{zone.detail}</p>
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-800">{zone.areas}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1eb] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Common service suburbs</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Explore local installation information</h2>
            <p className="mt-5 text-base leading-7 text-slate-700">
              These pages explain common door and property types in frequently serviced Adelaide
              areas. Nearby suburbs shown on each page are also welcome to request a door check.
            </p>
          </div>
          <div className="mt-12 grid gap-px bg-[#d7c6af] sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((area) => (
              <article key={area.slug} className="flex min-w-0 flex-col bg-[#f5f1eb] p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6b48]">Adelaide service area</p>
                <h3 className="mt-3 text-2xl font-black">{area.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">Also near {area.nearby}.</p>
                <Link
                  href={`/smart-lock-installation/${area.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-950 hover:text-[#8a6b48]"
                >
                  View {area.name} service details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">Choose your service</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Your lock or ours, professionally installed</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
                Start with your door and priorities. We can recommend and supply a smart lock, or
                assess a compatible model you have already purchased.
              </p>
            </div>
            <div className="grid gap-px bg-zinc-800 sm:grid-cols-2">
              <article className="bg-black p-7">
                <DoorOpen className="h-7 w-7 text-[#d9b98f]" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-5 text-xl font-black">Supply & installation</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">Compare smart lock packages that include the lock and standard Adelaide installation.</p>
                <Link href="/smart-lock-supply-installation-adelaide" className="mt-6 inline-flex items-center gap-2 text-sm font-bold hover:text-[#d9b98f]">
                  View installed packages <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
              <article className="bg-black p-7">
                <Wrench className="h-7 w-7 text-[#d9b98f]" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-5 text-xl font-black">Installation only</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">Customer-supplied compatible compact locks from $200 and full-size 6068 locks from $350.</p>
                <Link href="/smart-lock-installation-only-adelaide" className="mt-6 inline-flex items-center gap-2 text-sm font-bold hover:text-[#d9b98f]">
                  View installation pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <Check className="mx-auto h-8 w-8 text-[#9c7953]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Adelaide service area FAQ</h2>
          </div>
          <div className="mt-10 border-y border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-slate-200 last:border-b-0">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left font-bold">
                  {faq.question}
                  <span className="text-xl font-normal text-[#8a6b48] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1eb] py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <MapPin className="mx-auto h-8 w-8 text-[#9c7953]" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-black md:text-5xl">Not sure whether we cover your suburb?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700">
            Send your postcode, exact lock model and clear door photos. We will confirm service
            availability and the likely installation scope before arranging a booking.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent("Hi ADE Smart Home, I would like to check service availability for my suburb.")}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-slate-950 px-6 text-sm font-bold text-white hover:bg-[#8a6b48]"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Text Us
            </a>
            <a
              href={`mailto:${businessInfo.email}?subject=${encodeURIComponent("Adelaide smart lock service area enquiry")}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-slate-950 px-6 text-sm font-bold text-slate-950 hover:bg-white"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Email Door Photos
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

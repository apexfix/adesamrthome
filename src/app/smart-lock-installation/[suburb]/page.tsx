import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Check,
  DoorOpen,
  MapPin,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessInfo, serviceAreas, siteUrl } from "@/lib/seoData";

type PageProps = { params: Promise<{ suburb: string }> };

type LocalPageDetail = {
  image: string;
  summary: string;
  doorFocus: string;
  propertyFocus: string;
  relatedSlugs: string[];
};

const localPageDetails: Record<string, LocalPageDetail> = {
  "adelaide-cbd": {
    image: "/img/products/lockin-s50m-pro/real-install-01.jpg",
    summary:
      "Installation support for CBD apartments, city homes, rentals and selected business entries, with access and door approval checked before booking.",
    doorFocus:
      "Apartment and managed-building doors may require approval before hardware is changed. We check the existing lock, fire-door labels, frame clearance and building requirements before recommending a route.",
    propertyFocus:
      "Suitable enquiries include owner-occupied apartments, rental access upgrades, city homes and selected office-style entry doors.",
    relatedSlugs: ["norwood", "unley", "prospect"],
  },
  glenelg: {
    image: "/img/products/lockin-x9/real-install-02.jpg",
    summary:
      "Smart lock fitting for Glenelg homes, apartments and coastal properties, with the door material and entry exposure assessed first.",
    doorFocus:
      "Coastal entries can vary from sheltered timber doors to exposed aluminium doors. We check door thickness, weather exposure, frame clearance and screen-door spacing before confirming a lock.",
    propertyFocus:
      "We can assess detached homes, apartments, townhouses and short-stay properties around Glenelg and nearby beachside suburbs.",
    relatedSlugs: ["marion", "henley-beach", "west-lakes"],
  },
  norwood: {
    image: "/img/products/lockin-v5-max/real-install-02.jpg",
    summary:
      "Smart lock installation for Norwood character homes, renovated properties, apartments and nearby eastern suburbs.",
    doorFocus:
      "Older and renovated doors often have existing holes, decorative hardware or non-standard mortises. Photos help us check whether these can be covered cleanly before any cutting begins.",
    propertyFocus:
      "This service suits character homes, updated front entries, apartments and rental properties in the inner east.",
    relatedSlugs: ["burnside", "paradise", "adelaide-cbd"],
  },
  prospect: {
    image: "/img/products/lockin-s6-max/real-install-01.jpg",
    summary:
      "Professional smart lock installation for Prospect family homes, rentals and renovated front doors across the inner north.",
    doorFocus:
      "Prospect properties can have a mix of original and newer door hardware. We compare the current cut-out, backset, door edge and frame before selecting a compact or full-size lock.",
    propertyFocus:
      "Common service routes include home upgrades, rental access, keyless family entry and customer-supplied lock installation.",
    relatedSlugs: ["adelaide-cbd", "mawson-lakes", "west-lakes"],
  },
  "mawson-lakes": {
    image: "/img/products/lockin-s50m-pro/real-install-03.jpg",
    summary:
      "Smart lock supply and installation-only service for Mawson Lakes homes, townhouses and investment properties.",
    doorFocus:
      "Modern doors still need clearance checks, especially where a security screen sits close to the main entry. We assess handle projection, lock body space and frame alignment first.",
    propertyFocus:
      "We can help with family homes, townhouses, rental access and compatible smart locks already purchased by the customer.",
    relatedSlugs: ["prospect", "modbury", "paradise"],
  },
  unley: {
    image: "/img/products/lockin-sv40/real-install-03.jpg",
    summary:
      "Careful smart lock fitting for Unley homes, heritage-style entries, renovations and nearby inner-southern suburbs.",
    doorFocus:
      "Detailed timber doors and older hardware need a compatibility check that considers existing holes, trim, backset and the final visible finish. We confirm the likely result before booking.",
    propertyFocus:
      "This route suits home renovations, premium front entries, rental properties and keyless access upgrades around Unley.",
    relatedSlugs: ["adelaide-cbd", "burnside", "marion"],
  },
  modbury: {
    image: "/img/products/lockin-x9/real-install-04.jpg",
    summary:
      "Smart lock installation for Modbury family homes, suburban properties and nearby north-eastern Adelaide areas.",
    doorFocus:
      "We check the current latch or mortise, door thickness and any nearby screen door. These measurements determine whether a compact lever lock or full-size smart lock is the better fit.",
    propertyFocus:
      "Available routes include supplied packages, replacement of compatible existing hardware and installation-only for customer-purchased locks.",
    relatedSlugs: ["paradise", "mawson-lakes", "burnside"],
  },
  burnside: {
    image: "/img/products/lockin-v5-max/real-install-04.jpg",
    summary:
      "Smart lock installation for Burnside timber entries, renovated homes and premium residential doors in Adelaide's east.",
    doorFocus:
      "For detailed or premium doors, the final finish matters as much as lock operation. We assess hardware coverage, alignment and required cutting before recommending a model.",
    propertyFocus:
      "We can assess new smart lock packages, replacement projects and compatible customer-supplied locks for homes around Burnside.",
    relatedSlugs: ["norwood", "paradise", "unley"],
  },
  marion: {
    image: "/img/products/lockin-s50m-pro/real-install-06.jpg",
    summary:
      "Smart lock fitting for Marion homes, units and rental properties across Adelaide's inner south-west.",
    doorFocus:
      "The existing handle position, backset, door edge and frame determine the installation method. We use door photos to identify likely conflicts before scheduling.",
    propertyFocus:
      "This service supports home upgrades, rental access, compact keypad locks and full-size biometric smart locks.",
    relatedSlugs: ["glenelg", "unley", "henley-beach"],
  },
  "henley-beach": {
    image: "/img/products/lockin-s6-max/real-install-03.jpg",
    summary:
      "Smart lock installation for Henley Beach homes, townhouses and coastal properties across Adelaide's west.",
    doorFocus:
      "We consider how sheltered the entry is, the door material, screen-door clearance and the selected model's intended use before confirming suitability for a coastal property.",
    propertyFocus:
      "Available support includes supplied smart lock packages and installation-only service for compatible customer-owned models.",
    relatedSlugs: ["west-lakes", "glenelg", "prospect"],
  },
  "west-lakes": {
    image: "/img/products/lockin-s50m-pro/real-install-08.jpg",
    summary:
      "Professional smart lock installation for West Lakes family homes, townhouses and nearby western Adelaide suburbs.",
    doorFocus:
      "Entry exposure, security-screen spacing and existing lock alignment are checked before a model is approved. This helps avoid handle clashes and incomplete coverage.",
    propertyFocus:
      "We can help homeowners, landlords and property managers choose supply-and-install or customer-supplied installation service.",
    relatedSlugs: ["henley-beach", "glenelg", "prospect"],
  },
  paradise: {
    image: "/img/products/lockin-x9/real-install-06.jpg",
    summary:
      "Smart lock installation for Paradise homes, rentals and nearby north-eastern Adelaide suburbs.",
    doorFocus:
      "We assess timber or aluminium door construction, current hardware, frame clearance and any security screen before confirming installation scope.",
    propertyFocus:
      "Service options cover family homes, rental properties, supplied lock packages and compatible locks purchased elsewhere.",
    relatedSlugs: ["modbury", "norwood", "burnside"],
  },
};

const steps = [
  ["01", "Send your suburb and door photos", "Include both door faces, the door edge, current lock and frame clearance."],
  ["02", "Choose the service route", "We confirm whether you need a supplied package or installation for a lock you own."],
  ["03", "Confirm scope and price", "Compatibility, location and any non-standard work are explained before booking."],
  ["04", "Install, test and set up", "The lock is fitted and tested, with basic user or app setup where supported."],
] as const;

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ suburb: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { suburb } = await params;
  const area = serviceAreas.find((item) => item.slug === suburb);
  if (!area) return {};

  const detail = localPageDetails[area.slug];
  const title = `Smart Lock Installation ${area.name} from $200`;
  const description = `Smart lock installation in ${area.name} and nearby suburbs. Installation-only from $200, supplied packages from $699 and free door photo checks.`;
  const image = detail?.image ?? "/img/products/lockin-x9/real-install-02.jpg";

  return {
    title,
    description,
    keywords: [
      `smart lock installation ${area.name}`,
      `smart lock installer ${area.name}`,
      `digital door lock installation ${area.name}`,
      `installation only smart lock ${area.name}`,
      `fingerprint lock installer ${area.name}`,
      "smart lock installation Adelaide",
    ],
    alternates: { canonical: `${siteUrl}/smart-lock-installation/${area.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/smart-lock-installation/${area.slug}`,
      siteName: "ADE Smart Home",
      images: [{
        url: image,
        width: 1200,
        height: 1600,
        alt: "Completed ADE Smart Home smart lock installation on an Adelaide home entry",
      }],
      locale: "en_AU",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function SuburbSmartLockPage({ params }: PageProps) {
  const { suburb } = await params;
  const area = serviceAreas.find((item) => item.slug === suburb);
  if (!area) notFound();

  const detail = localPageDetails[area.slug];
  if (!detail) notFound();

  const pageUrl = `${siteUrl}/smart-lock-installation/${area.slug}`;
  const relatedAreas = detail.relatedSlugs
    .map((slug) => serviceAreas.find((item) => item.slug === slug))
    .filter((item): item is (typeof serviceAreas)[number] => Boolean(item));

  const faqs = [
    {
      question: `Do you install smart locks in ${area.name}?`,
      answer: `Yes. ADE Smart Home services ${area.name} and nearby areas including ${area.nearby}. Send your postcode so we can confirm appointment availability and any location-dependent cost before booking.`,
    },
    {
      question: "Can you install a smart lock that I already purchased?",
      answer:
        "Yes, if the model is complete, functional and compatible with your door. Standard installation is $200 for a compatible compact lock or $350 for a full-size lock using a standard 6068 mortise.",
    },
    {
      question: "Can you supply the smart lock as well?",
      answer:
        "Yes. Supply-and-install packages start from $699 and include the selected lock and standard Adelaide installation. Warranty and support terms are shown for each model.",
    },
    {
      question: "How do you check whether my door is suitable?",
      answer:
        "Send clear photos of both sides of the door, the door edge, current lock and frame. Door thickness and screen-door clearance are also useful. We review these before confirming the model and scope.",
    },
    {
      question: "Are non-standard door modifications included in the displayed price?",
      answer:
        "Displayed prices cover the stated standard installation. If the door needs extra modification, repair work or unusual hardware, we explain and quote that scope before you book.",
    },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: `Smart Lock Installation in ${area.name}`,
    serviceType: "Smart lock supply and installation",
    url: pageUrl,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: {
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.name,
        addressRegion: "SA",
        addressCountry: "AU",
      },
    },
    description: detail.summary,
    offers: [
      {
        "@type": "Offer",
        name: "Compact smart lock standard installation",
        price: "200",
        priceCurrency: "AUD",
        url: `${siteUrl}/smart-lock-installation-only-adelaide`,
        itemOffered: { "@type": "Service", name: `Compact Smart Lock Installation in ${area.name}` },
      },
      {
        "@type": "Offer",
        name: "Full-size smart lock standard 6068 mortise installation",
        price: "350",
        priceCurrency: "AUD",
        url: `${siteUrl}/smart-lock-installation-only-adelaide`,
        itemOffered: { "@type": "Service", name: `Full-Size Smart Lock Installation in ${area.name}` },
      },
    ],
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
      { "@type": "ListItem", position: 2, name: "Adelaide Service Areas", item: `${siteUrl}/service-areas` },
      { "@type": "ListItem", position: 3, name: area.name, item: pageUrl },
    ],
  };

  return (
    <main className="bg-white text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative flex min-h-[680px] items-end overflow-hidden bg-black pt-28 text-white md:min-h-[740px] md:items-center">
        <Image
          src={detail.image}
          alt="Completed smart lock installation on an Adelaide home entry"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-12">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-zinc-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/service-areas" className="hover:text-white">Service Areas</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page">{area.name}</span>
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">Adelaide local installation service</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Smart Lock Installation
            <span className="block text-[#d9b98f]">in {area.name}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">{detail.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#quote" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white">
              Send Door Photos <Camera className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(`Hi ADE Smart Home, I need a smart lock quote in ${area.name}.`)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Text {businessInfo.phone}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/25 pt-5 text-xs text-zinc-200">
            {["Installation only from $200", "Supply + install from $699", "Door compatibility checked first"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> {item}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-zinc-300">Also near {area.nearby}.</p>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Two service routes</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Choose what you need in {area.name}</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              You can choose a complete supplied package or ask us to install a compatible smart
              lock bought elsewhere. We confirm the door, model and scope before booking.
            </p>
          </div>
          <div className="mt-12 grid border-y border-slate-200 md:grid-cols-2">
            <article className="py-9 md:py-12 md:pr-10">
              <PackageCheck className="h-8 w-8 text-[#9c7953]" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#8a6b48]">From $699</p>
              <h3 className="mt-3 text-2xl font-black">Smart lock supplied and installed</h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Compare installed-price packages. The displayed package price includes the selected
                lock and standard Adelaide installation, with warranty terms shown by model.
              </p>
              <Link href="/smart-lock-supply-installation-adelaide" className="mt-6 inline-flex items-center gap-2 text-sm font-bold hover:text-[#8a6b48]">
                Compare installed packages <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
            <article className="border-t border-slate-200 py-9 md:border-l md:border-t-0 md:py-12 md:pl-10">
              <Wrench className="h-8 w-8 text-[#9c7953]" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#8a6b48]">From $200</p>
              <h3 className="mt-3 text-2xl font-black">Install a lock you already own</h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Compatible compact smart lock installation is $200. Full-size smart lock installation
                with a standard 6068 mortise is $350. The customer supplies the lock.
              </p>
              <Link href="/smart-lock-installation-only-adelaide" className="mt-6 inline-flex items-center gap-2 text-sm font-bold hover:text-[#8a6b48]">
                View installation-only pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1eb] py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-12">
          <div className="relative aspect-[4/5] min-h-[460px] overflow-hidden bg-zinc-200">
            <Image src={detail.image} alt="Smart lock professionally fitted to an Adelaide entry door" fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Local door assessment</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">The door decides what will fit</h2>
            <p className="mt-5 text-base leading-7 text-slate-700">{detail.doorFocus}</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{detail.propertyFocus}</p>
            <div className="mt-8 grid gap-px bg-[#d7c6af] sm:grid-cols-2">
              {[
                { icon: DoorOpen, text: "Both faces and the edge of the door" },
                { icon: Camera, text: "Current lock and handle position" },
                { icon: ShieldCheck, text: "Frame and security-screen clearance" },
                { icon: MapPin, text: `Suburb or postcode near ${area.name}` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 bg-[#f5f1eb] p-5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b48]" aria-hidden="true" />
                  <span className="text-sm font-semibold leading-6">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">Simple booking process</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">From photos to installation</h2>
          </div>
          <ol className="mt-12 grid gap-px bg-zinc-800 md:grid-cols-4">
            {steps.map(([number, title, detailText]) => (
              <li key={number} className="bg-black p-6 md:p-8">
                <span className="text-sm font-black text-[#d9b98f]">{number}</span>
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{detailText}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Nearby coverage</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Around {area.name}</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Nearby areas include {area.nearby}. The links show other common service
                areas; your suburb does not need to be listed to request a compatibility check.
              </p>
              <Link href="/service-areas" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#8a6b48] hover:text-black">
                View all Adelaide service areas <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="border-y border-slate-200">
              {relatedAreas.map((relatedArea) => (
                <Link
                  key={relatedArea.slug}
                  href={`/smart-lock-installation/${relatedArea.slug}`}
                  className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 py-5 last:border-b-0 hover:text-[#8a6b48]"
                >
                  <span>
                    <span className="block font-black">Smart lock installation in {relatedArea.name}</span>
                    <span className="mt-1 block text-sm text-slate-600">Near {relatedArea.nearby}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#9c7953]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black md:text-5xl">{area.name} smart lock FAQ</h2>
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

      <div id="quote" className="scroll-mt-24">
        <ContactForm initialService="not-sure" initialProduct={`Smart lock installation in ${area.name}`} />
      </div>
    </main>
  );
}

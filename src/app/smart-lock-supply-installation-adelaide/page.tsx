import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  DoorOpen,
  Fingerprint,
  PackageCheck,
  Phone,
  ScanFace,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessInfo, siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/smart-lock-supply-installation-adelaide`;

export const metadata: Metadata = {
  title: "Smart Locks Supplied & Installed Adelaide",
  description:
    "Compare smart locks supplied and installed in Adelaide from $650. Installed-price Lockin X9, SV40, S6 Max and V5 Max packages with a free door compatibility check and local support.",
  keywords: [
    "smart lock supplied and installed Adelaide",
    "smart lock supply and installation Adelaide",
    "smart lock packages Adelaide",
    "fingerprint door lock installed Adelaide",
    "Lockin smart lock Adelaide",
    "digital door lock supply and install Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Smart Locks Supplied & Installed in Adelaide",
    description:
      "Compare four installed-price smart lock packages from $650, with a free door compatibility check before booking.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-sv40/real-install-03.jpg",
        width: 1200,
        height: 1600,
        alt: "Lockin smart lock supplied and installed on an Adelaide home",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Locks Supplied & Installed Adelaide",
    description:
      "Installed-price smart lock options from $650 with an Adelaide door compatibility check.",
    images: ["/img/products/lockin-sv40/real-install-03.jpg"],
  },
};

const packages = [
  {
    name: "Lockin X9",
    slug: "lockin-x9-smart-lock",
    price: 650,
    label: "Everyday value",
    bestFor: "Simple, reliable keyless entry",
    image: "/img/products/lockin-x9/real-install-02.jpg",
    features: ["Fingerprint", "PIN and NFC", "App and Bluetooth", "Physical backup key"],
  },
  {
    name: "Lockin SV40",
    slug: "lockin-sv40-smart-lock",
    price: 799,
    label: "Popular upgrade",
    bestFor: "Fast finger-vein access",
    image: "/img/products/lockin-sv40/real-install-03.jpg",
    features: ["Finger-vein recognition", "Push-pull design", "PIN, NFC and app", "Auto-lock convenience"],
  },
  {
    name: "Lockin S6 Max",
    slug: "lockin-s6-max-smart-lock",
    price: 1199,
    label: "Advanced security",
    bestFor: "Face ID and front-door video",
    image: "/img/products/lockin-s6-max/real-install-04.jpg",
    features: ["3D face recognition", "Finger-vein access", "Dual cameras", "Remote video calling"],
  },
  {
    name: "Lockin V5 Max",
    slug: "lockin-v5-max-smart-lock",
    price: 1399,
    label: "Flagship choice",
    bestFor: "Premium biometrics and HomeKit",
    image: "/img/products/lockin-v5-max/real-install-04.jpg",
    features: ["Palm-vein recognition", "3D Face ID", "2K video doorbell", "Apple HomeKit"],
  },
];

const priorities = [
  {
    icon: Fingerprint,
    title: "Best value",
    choice: "Lockin X9 · $650 installed",
    detail: "A practical choice for fingerprint, PIN, NFC and app access without a built-in camera.",
  },
  {
    icon: Smartphone,
    title: "Fast family access",
    choice: "Lockin SV40 · $799 installed",
    detail: "Finger-vein recognition and a push-pull body make everyday entry quick and simple.",
  },
  {
    icon: ScanFace,
    title: "Face recognition",
    choice: "Lockin S6 Max · $1199 installed",
    detail: "Combines 3D Face ID, finger-vein access and dual cameras for higher-security entry.",
  },
  {
    icon: Camera,
    title: "Premium connected entry",
    choice: "Lockin V5 Max · $1399 installed",
    detail: "Palm vein, 3D Face ID, a 2K video doorbell and Apple HomeKit in the flagship package.",
  },
];

const faqs = [
  {
    question: "Do the listed prices include installation?",
    answer:
      "Yes. The package prices shown include standard installation after we confirm the selected lock is suitable for your door. Unusual door construction, extensive modification or repair work is discussed and quoted before booking.",
  },
  {
    question: "How do I know which smart lock fits my door?",
    answer:
      "Send clear photos of both sides of the door, the current lock, the door edge and the door frame. We review the door material, thickness, existing cut-out and available clearance before recommending a model.",
  },
  {
    question: "Which smart lock is best if I do not need a camera?",
    answer:
      "The Lockin X9 is the lowest-priced everyday option, while the SV40 adds finger-vein recognition and a push-pull design. Both provide multiple keyless access methods without moving into a full camera lock.",
  },
  {
    question: "Can you install a smart lock I bought from another seller?",
    answer:
      "Yes, for compatible customer-supplied locks. Send the exact model or product listing, along with photos of both sides of the door, the door edge and the frame. We confirm likely compatibility, scope and price before booking.",
  },
  {
    question: "Which models include a camera or video doorbell?",
    answer:
      "The S6 Max includes dual cameras and remote video calling. The V5 Max includes a 2K camera and built-in video doorbell, together with premium biometric access.",
  },
  {
    question: "What happens after installation?",
    answer:
      "We test the lock, explain normal operation and help with basic app, passcode and user setup where supported. Local after-sales assistance is available for installation and setup questions.",
  },
];

export default function SupplyInstallationPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Smart Lock Supply and Installation Adelaide",
    serviceType: "Smart lock supply and installation",
    url: pageUrl,
    description:
      "Installed-price smart lock packages with door compatibility assessment, professional installation and basic setup across Adelaide.",
    provider: {
      "@id": `${siteUrl}/#business`,
    },
    areaServed: {
      "@type": "City",
      name: "Adelaide",
      addressRegion: "SA",
      addressCountry: "AU",
    },
    offers: packages.map((item) => ({
      "@type": "Offer",
      price: item.price,
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/products/${item.slug}`,
      itemOffered: {
        "@type": "Product",
        name: item.name,
        image: `${siteUrl}${item.image}`,
      },
    })),
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
        name: "Smart Locks Supplied and Installed Adelaide",
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
          src="/img/products/lockin-sv40/real-install-03.jpg"
          alt="Lockin smart lock supplied and installed on an Adelaide entry door"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">
            Adelaide installed-price packages
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Smart Locks Supplied
            <span className="block text-[#d9b98f]">and Installed in Adelaide</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">
            Compare four installed-price smart locks from $650. We check your door,
            recommend a suitable model, install it and help with basic setup. Already bought a
            compatible smart lock? We also provide installation-only service.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#packages"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              Compare Installed Packages
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#quote"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              Check My Door
              <DoorOpen className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#installation-only"
              className="inline-flex min-h-12 items-center justify-center gap-2 px-4 text-sm font-bold text-white hover:text-[#d9b98f]"
            >
              Already bought a lock?
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`tel:${businessInfo.phoneInternational}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 px-4 text-sm font-bold text-white hover:text-[#d9b98f]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {businessInfo.phone}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/25 pt-5 text-xs text-zinc-200">
            {[
              "Packages from $650",
              "Standard installation included",
              "Customer-supplied locks welcome",
              "Door checked before booking",
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

      <section id="packages" className="scroll-mt-24 border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">
              Installed-price range
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Choose the level that fits your home</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Every listed price includes the smart lock and standard Adelaide installation,
              subject to a door compatibility check. Any non-standard modification is explained
              and quoted before booking.
            </p>
          </div>

          <div className="mt-12 grid gap-px bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((item) => (
              <article key={item.name} className="flex min-w-0 flex-col bg-white">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <Image
                    src={item.image}
                    alt={`${item.name} installed on an Adelaide door`}
                    fill
                    loading="eager"
                    unoptimized
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a6b48]">
                    {item.label}
                  </p>
                  <h3 className="mt-2 text-xl font-black">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.bestFor}</p>
                  <p className="mt-5 text-3xl font-black text-slate-950">
                    ${item.price}
                    <span className="ml-2 text-xs font-semibold uppercase text-slate-500">installed</span>
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-700">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/products/${item.slug}`}
                    className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 border border-slate-950 px-4 text-sm font-bold transition-colors hover:bg-slate-950 hover:text-white"
                  >
                    View {item.name.replace("Lockin ", "")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">
              Start with your priority
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">A simpler way to compare</h2>
          </div>

          <div className="mt-12 grid gap-px bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {priorities.map(({ icon: Icon, title, choice, detail }) => (
              <article
                key={title}
                className="bg-slate-50 px-5 py-8 md:px-7"
              >
                <Icon className="h-7 w-7 text-[#9c7953]" strokeWidth={1.6} aria-hidden="true" />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#8a6b48]">
                  {title}
                </p>
                <h3 className="mt-3 text-lg font-black">{choice}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="installation-only"
        className="scroll-mt-24 border-y border-slate-200 bg-[#f5f1eb] py-16 md:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:items-center lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">
              Installation only
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black md:text-5xl">
              Already bought a smart lock? We can install it.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
              Bought a Lockin, Philips, Aqara, Yale, Eufy or another smart lock elsewhere? Send
              the exact model listing and clear photos of your door. We check compatibility first,
              then confirm the installation scope and price before booking.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/smart-lock-installation-only-adelaide"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-slate-950 px-6 text-sm font-bold text-white transition-colors hover:bg-[#9c7953]"
              >
                Request Installation Only
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={`tel:${businessInfo.phoneInternational}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-slate-950 px-6 text-sm font-bold text-slate-950 transition-colors hover:bg-white"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {businessInfo.phone}
              </a>
            </div>
          </div>

          <div className="grid gap-px bg-[#d7c6af] sm:grid-cols-2">
            {[
              [
                "Your lock, your choice",
                "Customer-supplied smart locks are assessed on the actual model and door.",
              ],
              [
                "Other brands welcome",
                "We install compatible fingerprint, keypad, app and video smart locks.",
              ],
              [
                "Clear scope first",
                "Door material, existing holes and required modification are checked before booking.",
              ],
              [
                "No surprise pricing",
                "Installation-only work is quoted after the compatibility review.",
              ],
            ].map(([title, detail]) => (
              <article key={title} className="bg-[#f5f1eb] p-6">
                <Check className="h-6 w-6 text-[#8a6b48]" aria-hidden="true" />
                <h3 className="mt-4 font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">
                Included service
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">One package, a clear next step</h2>
              <p className="mt-5 text-base leading-7 text-zinc-400">
                We keep the process practical: check the door first, confirm the model and
                scope, then arrange installation. No online payment is required.
              </p>
            </div>

            <div className="grid gap-px bg-zinc-800 sm:grid-cols-2">
              {[
                { icon: DoorOpen, title: "Door assessment", detail: "Photos and key measurements checked before booking." },
                { icon: PackageCheck, title: "Lock supplied", detail: "The agreed smart lock model is included in the package price." },
                { icon: ShieldCheck, title: "Professional fitting", detail: "Careful preparation, alignment, testing and finishing." },
                { icon: Smartphone, title: "Basic setup", detail: "Passcode, users and supported app functions explained." },
              ].map(({ icon: Icon, title, detail }) => (
                <article
                  key={title}
                  className="bg-black p-6"
                >
                  <Icon className="h-6 w-6 text-[#d9b98f]" aria-hidden="true" />
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-12">
          <div className="relative aspect-[4/5] min-h-[440px] overflow-hidden bg-slate-100">
            <Image
              src="/img/smart-lock-door-measurement-requirements.png"
              alt="Door photos and measurements for choosing a supplied smart lock"
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">
              Free compatibility check
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Send the door before choosing the lock</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              The best model depends on your door thickness, current lock position, door frame
              clearance and any security screen. Photos let us recommend an option that can be
              installed neatly and operate correctly.
            </p>
            <ul className="mt-7 space-y-4 text-sm leading-6 text-slate-700">
              {[
                "Front and inside face of the door",
                "Current lock and handle position",
                "Door edge, lock body and door frame",
                "Door thickness and nearby screen-door clearance",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="#quote"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 bg-slate-950 px-6 text-sm font-bold text-white hover:bg-[#9c7953]"
            >
              Send Door Details
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#9c7953]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Supply and installation FAQ</h2>
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

          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#8a6b48] hover:text-black"
            >
              View every available smart lock
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <ContactForm initialService="supply-install" />
    </main>
  );
}

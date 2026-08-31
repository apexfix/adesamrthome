import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Camera,
  Check,
  ClipboardCheck,
  DoorOpen,
  FileCheck2,
  Hammer,
  HardHat,
  Home,
  KeyRound,
  Layers3,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessInfo, siteUrl } from "@/lib/seoData";

const iconMap = {
  building: Building2,
  calendar: CalendarCheck,
  camera: Camera,
  clipboard: ClipboardCheck,
  door: DoorOpen,
  file: FileCheck2,
  hammer: Hammer,
  hardhat: HardHat,
  home: Home,
  key: KeyRound,
  layers: Layers3,
  map: MapPinned,
  shield: ShieldCheck,
  users: Users,
  wrench: Wrench,
} satisfies Record<string, LucideIcon>;

export type AudienceIcon = keyof typeof iconMap;

type DetailItem = {
  icon: AudienceIcon;
  title: string;
  detail: string;
};

type ProcessItem = {
  title: string;
  detail: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type RelatedLink = {
  href: string;
  label: string;
  detail: string;
};

type AudienceServicePageProps = {
  pageUrl: string;
  serviceName: string;
  serviceType: string;
  schemaDescription: string;
  audienceType: string;
  breadcrumbName: string;
  heroImage: string;
  heroAlt: string;
  eyebrow: string;
  title: string;
  accentTitle: string;
  introduction: string;
  primaryCta: string;
  smsBody: string;
  proofPoints: string[];
  sectionEyebrow: string;
  sectionTitle: string;
  sectionIntroduction: string;
  keyPoints: DetailItem[];
  cautionEyebrow: string;
  cautionTitle: string;
  cautionBody: string;
  idealTitle: string;
  idealIntroduction: string;
  idealFor: DetailItem[];
  processTitle: string;
  process: ProcessItem[];
  relatedTitle: string;
  relatedLinks: RelatedLink[];
  faqTitle: string;
  faqs: FAQItem[];
  initialService?:
    | "supply-install"
    | "installation-only"
    | "portfolio-project"
    | "not-sure";
  initialProduct: string;
};

export function AudienceServicePage({
  pageUrl,
  serviceName,
  serviceType,
  schemaDescription,
  audienceType,
  breadcrumbName,
  heroImage,
  heroAlt,
  eyebrow,
  title,
  accentTitle,
  introduction,
  primaryCta,
  smsBody,
  proofPoints,
  sectionEyebrow,
  sectionTitle,
  sectionIntroduction,
  keyPoints,
  cautionEyebrow,
  cautionTitle,
  cautionBody,
  idealTitle,
  idealIntroduction,
  idealFor,
  processTitle,
  process,
  relatedTitle,
  relatedLinks,
  faqTitle,
  faqs,
  initialService = "not-sure",
  initialProduct,
}: AudienceServicePageProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: serviceName,
    serviceType,
    url: pageUrl,
    description: schemaDescription,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: {
      "@type": "City",
      name: "Adelaide",
      addressRegion: "SA",
      addressCountry: "AU",
    },
    audience: {
      "@type": "Audience",
      audienceType,
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
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: breadcrumbName, item: pageUrl },
    ],
  };

  const smsHref = `sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(smsBody)}`;

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

      <section className="relative flex min-h-[690px] items-end overflow-hidden bg-black pt-28 text-white md:min-h-[760px] md:items-center">
        <Image
          src={heroImage}
          alt={heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            {title}
            <span className="block text-[#d9b98f]">{accentTitle}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">
            {introduction}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#quote"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              {primaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={smsHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Text the Property Details
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/25 pt-5 text-xs text-zinc-200">
            {proofPoints.map((item) => (
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
              {sectionEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">{sectionTitle}</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">{sectionIntroduction}</p>
          </div>

          <div className="mt-12 grid border-y border-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {keyPoints.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <article
                  key={item.title}
                  className={`py-8 md:px-7 ${
                    index > 0 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""
                  }`}
                >
                  <Icon className="h-7 w-7 text-[#9c7953]" strokeWidth={1.6} aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f2e5d2] py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-[auto_1fr] md:items-start lg:px-12">
          <ShieldCheck className="h-10 w-10 text-[#7a5937]" aria-hidden="true" />
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a5937]">
              {cautionEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">{cautionTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">{cautionBody}</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black md:text-5xl">{idealTitle}</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">{idealIntroduction}</p>
          </div>

          <div className="mt-12 grid border-y border-slate-200 md:grid-cols-3">
            {idealFor.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <article
                  key={item.title}
                  className={`py-8 md:px-8 ${
                    index > 0 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""
                  }`}
                >
                  <Icon className="h-8 w-8 text-[#9c7953]" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">Next steps</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black md:text-5xl">{processTitle}</h2>

          <div className="mt-12 grid border-y border-zinc-800 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <article
                key={item.title}
                className={`py-8 md:px-7 ${
                  index > 0 ? "border-t border-zinc-800 md:border-l md:border-t-0" : ""
                }`}
              >
                <p className="text-sm font-black text-[#d9b98f]">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-black md:text-4xl">{relatedTitle}</h2>
          <div className="mt-10 grid border-y border-slate-200 md:grid-cols-3">
            {relatedLinks.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group py-7 md:px-7 ${
                  index > 0 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""
                }`}
              >
                <span className="flex items-center justify-between gap-4 font-bold">
                  {item.label}
                  <ArrowRight
                    className="h-4 w-4 text-[#8a6b48] transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">{item.detail}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <KeyRound className="mx-auto h-8 w-8 text-[#9c7953]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black md:text-5xl">{faqTitle}</h2>
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

      <ContactForm initialService={initialService} initialProduct={initialProduct} />
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  MessageSquareText,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { businessInfo, siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "About ADE Smart Home | Adelaide Smart Lock Team",
  description:
    "Meet ADE Smart Home, Adelaide smart lock specialists with 400+ local installations, door compatibility checks, clear quotes and local after-sales support.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: "About ADE Smart Home | Adelaide Smart Lock Team",
    description:
      "See how ADE Smart Home checks, installs and supports smart locks across Adelaide.",
    url: `${siteUrl}/about`,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-v5-max/real-install-04.jpg",
        width: 1200,
        height: 630,
        alt: "ADE Smart Home smart lock installation in Adelaide",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
};

const process = [
  {
    title: "Send door photos",
    detail:
      "We review both sides of the door, the edge, frame, current lock and any nearby screen door or glass.",
  },
  {
    title: "Confirm compatibility",
    detail:
      "We match the lock body and access features to the door before confirming the scope and price.",
  },
  {
    title: "Install and set up",
    detail:
      "The lock is fitted, aligned and tested, then we help with the normal access and app setup for that model.",
  },
  {
    title: "Local support",
    detail:
      "You can contact ADE Smart Home by SMS or email after installation if you need help with the supplied lock.",
  },
];

export default function AboutPage() {
  const pageUrl = `${siteUrl}/about`;
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: "About ADE Smart Home",
    description: metadata.description,
    mainEntity: { "@id": `${siteUrl}/#business` },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "About ADE Smart Home", item: pageUrl },
    ],
  };
  const smsHref = `sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(
    "Hi ADE Smart Home, I would like help choosing a smart lock.",
  )}`;

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 pt-32 text-white">
      {[aboutSchema, breadcrumbSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-[#d9b98f]">About</span>
        </nav>

        <section className="grid gap-12 py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase text-[#d9b98f]">Adelaide smart lock specialists</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Smart Lock Work, Handled Locally
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              ADE Smart Home supplies and installs smart locks across Adelaide and also installs compatible locks purchased by customers. Our work starts with the door, not a sales script: we check compatibility, explain the scope and confirm the price before booking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact?service=not-sure#quote" className="inline-flex min-h-12 items-center gap-2 bg-[#d9b98f] px-5 font-bold text-black hover:bg-white">
                <Camera className="h-4 w-4" /> Send Door Photos
              </Link>
              <a href={smsHref} className="inline-flex min-h-12 items-center gap-2 border border-zinc-700 px-5 font-bold hover:border-[#d9b98f] hover:text-[#d9b98f]">
                <MessageSquareText className="h-4 w-4" /> Text {businessInfo.phone}
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
            <Image
              src="/img/products/lockin-v5-max/real-install-04.jpg"
              alt="Completed Lockin V5 Max smart lock installation by ADE Smart Home in Adelaide"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="grid border-y border-zinc-800 py-12 sm:grid-cols-3">
          {[
            ["400+", "local installations"],
            ["Two ways", "supply and install, or installation only"],
            ["Before booking", "door compatibility and scope confirmed"],
          ].map(([value, label]) => (
            <div key={value} className="border-zinc-800 py-5 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
              <p className="text-3xl font-black text-[#d9b98f]">{value}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{label}</p>
            </div>
          ))}
        </section>

        <section className="py-20">
          <p className="text-xs font-bold uppercase text-[#d9b98f]">How we work</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">A Clear Path From Door Check to Handover</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <article key={item.title} className="border-t border-zinc-700 pt-6">
                <p className="text-xs font-bold text-[#d9b98f]">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-y border-zinc-800 py-14 lg:grid-cols-2">
          <div>
            <ShieldCheck className="h-8 w-8 text-[#d9b98f]" />
            <h2 className="mt-5 text-3xl font-black">What We Focus On</h2>
            <ul className="mt-7 space-y-4 text-zinc-300">
              {["A neat, aligned finish that suits the existing door", "Clear installed-package and installation-only pricing", "Practical access setup for the people using the door", "Local warranty and after-sales terms stated by product"].map((item) => (
                <li key={item} className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-[#d9b98f]" /><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <Wrench className="h-8 w-8 text-[#d9b98f]" />
            <h2 className="mt-5 text-3xl font-black">Two Ways to Book</h2>
            <p className="mt-5 leading-8 text-zinc-300">
              Choose a supplied-and-installed package from ADE Smart Home, or ask us to install a compatible smart lock you already own. In both cases, door photos help us identify clearance, lock-body and frame issues before the appointment.
            </p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm font-bold text-[#d9b98f]">
              <Link href="/smart-lock-supply-installation-adelaide" className="inline-flex items-center gap-2 hover:text-white">Compare packages <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/smart-lock-installation-only-adelaide" className="inline-flex items-center gap-2 hover:text-white">Installation only <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

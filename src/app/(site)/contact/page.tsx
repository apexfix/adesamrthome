import type { Metadata } from "next";
import { Clock, MessageSquareText, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { BusinessDetails } from "@/components/BusinessDetails";
import { BUSINESS_HOURS, SERVICE_AREA_LABEL, businessInfo, siteUrl, smsHref } from "@/lib/seoData";

const baseMetadata: Metadata = {
  title: "Contact & Free Smart Lock Quote Adelaide",
  description:
    "Text 0431 060 390 for a smart lock quote across Adelaide metro, Mon–Sat 8am–6pm. Send door photos for a free remote check. No deposit required.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "Smart Lock Installation Quote Adelaide | ADE Smart Home",
    description:
      "Request smart lock supply and installation, or installation-only service, in Adelaide.",
    url: `${siteUrl}/contact`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/og/ade-smart-home-adelaide.jpg", width: 1200, height: 630 }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Lock Installation Quote Adelaide",
    description:
      "Request smart lock or installation-only quotes in Adelaide. We reply by SMS or email.",
    images: ["/img/og/ade-smart-home-adelaide.jpg"],
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};
  const hasPrefillParameters = Object.values(params).some((value) => value !== undefined);

  return {
    ...baseMetadata,
    robots: hasPrefillParameters ? { index: false, follow: true } : undefined,
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const initialService =
    typeof params.service === "string" ? params.service : undefined;
  const initialProduct =
    typeof params.product === "string" ? params.product : undefined;

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact#contact`,
    url: `${siteUrl}/contact`,
    name: "Contact ADE Smart Home",
    mainEntity: {
      "@id": `${siteUrl}/#business`,
      telephone: businessInfo.phoneInternational,
      email: businessInfo.email,
    },
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-28 text-white md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <header className="container mx-auto max-w-[1500px] px-5 pb-8 md:px-8 md:pb-10 xl:px-10">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
            Adelaide smart home products
          </p>
          <h1 className="text-4xl font-bold md:text-6xl">
            Get a local quote
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            Smart locks supplied and fitted, or installation only. Text us or send the form;
            we confirm the price before booking and never ask for a deposit.
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-base font-semibold">
            <a href={smsHref("Hi ADE Smart Home, I would like a quote.")} data-contact="sms" className="inline-flex min-h-11 items-center text-[#d9b98f] underline underline-offset-4">Text {businessInfo.phoneDisplay}</a>{" "}
            <span className="text-zinc-400">{BUSINESS_HOURS.label} · {SERVICE_AREA_LABEL}</span>
          </p>
        </div>
      </header>

      <ContactForm
        compact
        initialService={initialService}
        initialProduct={initialProduct}
      />

      <section aria-labelledby="business-details" className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
          <h2 id="business-details" className="text-2xl font-bold">Business details</h2>
          <BusinessDetails className="mt-5 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>

      <section className="border-t border-zinc-900 bg-black py-16">
        <div className="container mx-auto grid max-w-[1500px] gap-10 px-5 md:grid-cols-3 md:px-8 xl:px-10">
          <div>
            <ShieldCheck className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Careful Product Advice</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              We confirm the selected product, package contents and next steps before an order or booking.
            </p>
          </div>
          <div>
            <Clock className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Clear Next Steps</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              We explain what details are needed and confirm availability before booking or purchase.
            </p>
          </div>
          <div>
            <MessageSquareText className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Message-Friendly Support</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Text {businessInfo.phoneDisplay} or email us about smart locks or installation-only jobs.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

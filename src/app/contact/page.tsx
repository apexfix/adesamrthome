import type { Metadata } from "next";
import { Clock, MessageSquareText, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessInfo, siteUrl } from "@/lib/seoData";

const baseMetadata: Metadata = {
  title: "Get a Smart Home Product Quote in Adelaide",
  description:
    "Request a smart lock, installation-only or security camera kit quote from ADE Smart Home in Adelaide. We reply by SMS or email.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "Get a Quote | ADE Smart Home Adelaide",
    description:
      "Request smart lock supply, installation-only service or a security camera equipment package in Adelaide.",
    url: `${siteUrl}/contact`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/og/ade-smart-home-adelaide.jpg", width: 1200, height: 630 }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get a Smart Home Product Quote in Adelaide",
    description:
      "Request smart lock supply and installation or installation-only service in Adelaide.",
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
      telephone: businessInfo.phone,
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
            Smart locks, installation only or camera kits. Tell us what you need;
            we will reply by SMS or email and confirm the price before booking.
          </p>
        </div>
      </header>

      <ContactForm
        compact
        initialService={initialService}
        initialProduct={initialProduct}
      />

      <section className="border-t border-zinc-900 bg-black py-16">
        <div className="container mx-auto grid max-w-[1500px] gap-10 px-5 md:grid-cols-3 md:px-8 xl:px-10">
          <div>
            <ShieldCheck className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Careful Product Advice</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              We confirm the selected product, package contents and next steps before an order or booking.
            </p>
          </div>
          <div>
            <Clock className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Clear Next Steps</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              We explain what details are needed and confirm availability before booking or purchase.
            </p>
          </div>
          <div>
            <MessageSquareText className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Message-Friendly Support</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Text 0431060390 or email us about smart locks, installation-only jobs or security camera kits.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

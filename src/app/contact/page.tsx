import type { Metadata } from "next";
import { Clock, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessInfo, siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Get a Smart Lock or CCTV Quote in Adelaide",
  description:
    "Request a smart lock supply and installation quote, installation-only service or CCTV consultation in Adelaide. Call 0431 060 390.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "Get a Quote | ADE Smart Home Adelaide",
    description:
      "Request smart lock supply and installation, installation-only service or a CCTV consultation in Adelaide.",
    url: `${siteUrl}/contact`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/hero1.avif", width: 1200, height: 630 }],
    locale: "en_AU",
    type: "website",
  },
};

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

      <header className="container mx-auto px-4 pb-10 md:px-6 md:pb-14">
        <div className="max-w-4xl">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a47e]">
            Adelaide smart security
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Get the Right Advice Before You Book
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            Tell us whether you need a new smart lock, installation for a lock
            you already own, CCTV, or help choosing. We will confirm the scope
            and price before any booking.
          </p>
        </div>
      </header>

      <ContactForm
        initialService={initialService}
        initialProduct={initialProduct}
      />

      <section className="border-t border-zinc-900 bg-black py-16">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-3 md:px-6">
          <div>
            <ShieldCheck className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Careful Installation</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Door suitability is checked before work begins, with clean preparation and finishing.
            </p>
          </div>
          <div>
            <Clock className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Clear Next Steps</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              We explain what photos or measurements are needed and confirm availability before booking.
            </p>
          </div>
          <div>
            <Phone className="h-8 w-8 text-[#c5a47e]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold">Local Adelaide Support</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Call 0431 060 390 to discuss smart locks, installation-only jobs or CCTV requirements.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

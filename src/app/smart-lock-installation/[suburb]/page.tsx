import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  businessInfo,
  coreServices,
  serviceAreas,
  siteUrl,
  smartLockBrands,
} from "@/lib/seoData";

type PageProps = {
  params: Promise<{
    suburb: string;
  }>;
};

export function generateStaticParams() {
  return serviceAreas.map((area) => ({
    suburb: area.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { suburb } = await params;
  const area = serviceAreas.find((item) => item.slug === suburb);

  if (!area) {
    return {};
  }

  const title = `Smart Lock Installation ${area.name} | Digital Door Lock Installer`;
  const description = `Professional smart lock installation in ${area.name} and nearby suburbs including ${area.nearby}. ADE Smart Home installs Philips, EZVIZ, Samsung, Aqara and imported smart locks with free door compatibility checks.`;

  return {
    title,
    description,
    keywords: [
      `smart lock installation ${area.name}`,
      `digital door lock installation ${area.name}`,
      `fingerprint lock installer ${area.name}`,
      `smart door lock ${area.name}`,
      `Philips smart lock ${area.name}`,
      `EZVIZ smart lock ${area.name}`,
      `locksmith ${area.name}`,
      `CCTV installation ${area.name}`,
      "smart lock installation Adelaide",
    ],
    alternates: {
      canonical: `${siteUrl}/smart-lock-installation/${area.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/smart-lock-installation/${area.slug}`,
      siteName: "ADE Smart Home",
      images: [
        {
          url: "/img/hero1.jpg",
          width: 1200,
          height: 630,
          alt: `Smart lock installation in ${area.name} by ADE Smart Home`,
        },
      ],
      locale: "en_AU",
      type: "website",
    },
  };
}

export default async function SuburbSmartLockPage({ params }: PageProps) {
  const { suburb } = await params;
  const area = serviceAreas.find((item) => item.slug === suburb);

  if (!area) {
    notFound();
  }

  const pageUrl = `${siteUrl}/smart-lock-installation/${area.slug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: `Smart Lock Installation in ${area.name}`,
    serviceType: "Smart Lock Installation",
    provider: {
      "@type": ["LocalBusiness", "Locksmith"],
      "@id": `${siteUrl}/#business`,
      name: businessInfo.name,
      telephone: businessInfo.phoneInternational,
      email: businessInfo.email,
      url: siteUrl,
    },
    areaServed: {
      "@type": "City",
      name: area.name,
      addressRegion: "SA",
      addressCountry: "AU",
    },
    description: `Professional smart lock installation in ${area.name} and nearby suburbs including ${area.nearby}. Services include fingerprint locks, keypad locks, video smart locks, app setup and door compatibility checks.`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Smart Lock Installation Services in ${area.name}`,
      itemListElement: coreServices.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `${service} in ${area.name}`,
        },
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do you install smart locks in ${area.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ADE Smart Home provides professional smart lock installation in ${area.name} and nearby suburbs including ${area.nearby}.`,
        },
      },
      {
        "@type": "Question",
        name: "Can you check if my door is suitable before installation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can send photos of your door, existing lock and door frame for a free compatibility check before booking.",
        },
      },
      {
        "@type": "Question",
        name: "What smart lock brands do you install?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `We install ${smartLockBrands.join(
            ", "
          )} and other compatible smart locks depending on the door type.`,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-300">
            ADE Smart Home · Adelaide Local Installer
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Smart Lock Installation in {area.name}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-200">
            Professional smart lock installation for {area.description} We install
            fingerprint, keypad, video intercom and app-controlled smart locks with
            clean flush-finish workmanship.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-center font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Send Door Photo for Free Check
            </Link>
            <a
              href={`tel:${businessInfo.phone}`}
              className="rounded-full border border-white px-6 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-neutral-950"
            >
              Call {businessInfo.phone}
            </a>
          </div>

          <p className="mt-6 text-sm text-neutral-300">
            Also servicing nearby areas: {area.nearby}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-950">
              Door Compatibility Check
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              Before installation, we check your door type, existing lock position,
              door thickness, frame clearance and whether extra cutting or lock body
              modification is required.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-950">
              Clean Flush-Finish Installation
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              Our work focuses on accurate alignment, clean drilling, neat finishing
              and stable lock operation. This is especially important for imported
              smart locks and complex Adelaide doors.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-950">
              Local After-Sales Support
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              We provide local Adelaide support after installation, including app
              setup, user management, passcode setup and troubleshooting guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-neutral-950">
              Digital Door Lock Installer for {area.name} Homes
            </h2>
            <p className="mt-5 leading-8 text-neutral-700">
              Many homes in {area.name} use different door types, including timber
              front doors, aluminium doors, apartment entry doors and selected
              security screen doors. A smart lock cannot be installed properly by
              simply replacing the old lock without checking the door structure.
              Our process starts with a door photo assessment so we can recommend a
              suitable lock and avoid unnecessary damage.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-950">
                Smart Lock Brands We Commonly Install
              </h3>
              <ul className="mt-5 grid gap-3 text-neutral-700 sm:grid-cols-2">
                {smartLockBrands.map((brand) => (
                  <li key={brand} className="rounded-2xl bg-neutral-50 px-4 py-3">
                    {brand}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-950">
                Common Installation Services
              </h3>
              <ul className="mt-5 space-y-3 text-neutral-700">
                <li>Fingerprint smart lock installation</li>
                <li>Keypad and passcode lock installation</li>
                <li>Video smart lock and doorbell setup</li>
                <li>App connection and user management setup</li>
                <li>Existing digital lock replacement</li>
                <li>CCTV and smart home security setup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-bold text-neutral-950">
              Why Choose ADE Smart Home in {area.name}
            </h2>
            <div className="mt-6 space-y-5 leading-8 text-neutral-700">
              <p>
                ADE Smart Home specialises in smart lock and smart home security
                installation across Adelaide. We have completed 400+ local
                installations and understand the common door types used in South
                Australian homes.
              </p>
              <p>
                Our focus is not just selling a lock. We help customers choose a
                suitable model, check door compatibility, complete the physical
                installation, set up the app and explain how to use the lock safely
                in daily life.
              </p>
              <p>
                For customers in {area.name}, we can help with new smart lock
                installation, replacement of existing digital locks, imported smart
                lock installation and CCTV security upgrades.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-neutral-950 p-8 text-white">
            <h3 className="text-2xl font-bold">Free Door Photo Check</h3>
            <p className="mt-4 leading-7 text-neutral-200">
              Send us clear photos of your door, current lock and door frame. We
              will check whether your door is suitable and recommend the best
              installation option.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/contact"
                className="block rounded-full bg-white px-5 py-3 text-center font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                Get a Free Quote
              </Link>
              <a
                href={`mailto:${businessInfo.email}`}
                className="block rounded-full border border-white px-5 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-neutral-950"
              >
                Email Photos
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold text-neutral-950">
            Smart Lock Installation FAQ for {area.name}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-950">
                Do you install smart locks in {area.name}?
              </h3>
              <p className="mt-3 leading-7 text-neutral-700">
                Yes. We service {area.name} and nearby suburbs including{" "}
                {area.nearby}.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-950">
                Can you install imported smart locks?
              </h3>
              <p className="mt-3 leading-7 text-neutral-700">
                Yes. We install many imported smart locks, but we check door
                compatibility first because some models require special fitting.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-950">
                How do I get a quote?
              </h3>
              <p className="mt-3 leading-7 text-neutral-700">
                Send photos of your door, current lock and door frame through the
                contact page. We will check the door and provide a quote.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

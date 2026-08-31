import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquareText } from "lucide-react";
import {
  businessInfo,
  deliveryAndReturnsUrl,
  installationDeliveryServiceId,
  merchantReturnPolicyId,
  siteUrl,
} from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Delivery, Cancellations and Returns",
  description:
    "Delivery, cancellation, return and warranty information for ADE Smart Home smart lock supply and installation packages in Adelaide.",
  alternates: { canonical: deliveryAndReturnsUrl },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "How supplied locks are delivered",
    content: [
      "ADE Smart Home supplies smart locks as part of an all-inclusive Adelaide installation package. After door compatibility, scope and price are confirmed, we bring the selected lock to the agreed installation address for the booked appointment. We do not operate a separate postal shipping service for these packages.",
      "Standard local delivery is included in the advertised all-inclusive package price. Work outside the standard service area, unusual access requirements or a changed installation address must be confirmed before the booking.",
    ],
  },
  {
    title: "Before installation",
    content: [
      "Contact us as soon as possible if you need to cancel or reschedule. Any cancellation, refund or change is assessed against the confirmed quote, work already completed, products specially ordered for the job and the condition of any supplied lock.",
      "A lock that has not been installed or configured may be eligible for return after assessment. Contact us before returning or handing over any product so we can confirm the next step.",
    ],
  },
  {
    title: "After installation",
    content: [
      "A smart lock that has been installed, fitted to a door or configured is not automatically eligible for a change-of-mind return. If there is a product fault, installation concern or the supplied package is not as described, contact us promptly so we can inspect the issue and arrange an appropriate remedy where required.",
      "Nothing on this page excludes, restricts or modifies rights and remedies that cannot be excluded under the Australian Consumer Law.",
    ],
  },
  {
    title: "Customer-supplied smart locks",
    content: [
      "For installation-only work, the customer remains responsible for obtaining the correct and complete product. Product returns, missing parts and manufacturer warranty claims generally remain with the original seller or manufacturer. ADE Smart Home remains responsible for the installation services described in the accepted quote.",
    ],
  },
  {
    title: "Warranty and support",
    content: [
      "Warranty coverage and local after-sales support are stated in the accepted quote or package description. Keep your invoice, quote and any product documentation. When reporting an issue, include the lock model, installation address, a short description and clear photos or video where useful.",
    ],
  },
];

const policySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#business`,
      name: businessInfo.name,
      url: siteUrl,
      hasShippingService: { "@id": installationDeliveryServiceId },
      hasMerchantReturnPolicy: { "@id": merchantReturnPolicyId },
    },
    {
      "@type": "ShippingService",
      "@id": installationDeliveryServiceId,
      name: "Adelaide installation appointment delivery",
      description:
        "Supplied smart locks are brought to the confirmed Adelaide installation address with no separate shipping charge for standard all-inclusive packages.",
      fulfillmentType: "https://schema.org/FulfillmentTypeDelivery",
      shippingConditions: {
        "@type": "ShippingConditions",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "AU",
          addressRegion: "SA",
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "AUD",
        },
      },
    },
    {
      "@type": "MerchantReturnPolicy",
      "@id": merchantReturnPolicyId,
      merchantReturnLink: deliveryAndReturnsUrl,
    },
  ],
};

export default function DeliveryAndReturnsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 text-white md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(policySchema) }}
      />
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 pb-12 md:px-6 md:pb-16">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a47e]">
            ADE Smart Home
          </p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Delivery, Cancellations and Returns
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-400 md:text-lg">
            How supplied smart locks reach your Adelaide installation appointment, and what to do
            when a booking, product or completed installation needs attention.
          </p>
          <p className="mt-4 text-sm text-zinc-500">Last updated: 31 August 2026</p>
        </div>
      </header>

      <div className="container mx-auto grid gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="max-w-3xl space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-black tracking-tight text-white">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-400 md:text-base">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="h-fit border border-zinc-800 bg-black p-6 md:p-8 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold text-white">Need help with an order?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Send the lock model, installation address and a short description. SMS or email works
            best while we are on site.
          </p>
          <div className="mt-6 space-y-3">
            <a
              href={`mailto:${businessInfo.email}?subject=Delivery%20or%20return%20enquiry`}
              className="flex min-h-12 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email us
            </a>
            <a
              href={`sms:${businessInfo.phoneInternational}?body=Hi%20ADE%20Smart%20Home%2C%20I%20need%20help%20with%20a%20delivery%2C%20booking%20or%20return.`}
              className="flex min-h-12 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Text 0431 060 390
            </a>
          </div>
          <Link
            href="/smart-lock-supply-installation-adelaide"
            className="mt-6 inline-flex text-sm font-bold text-[#c5a47e] hover:text-white"
          >
            View supplied lock packages
          </Link>
        </aside>
      </div>
    </main>
  );
}

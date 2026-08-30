import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquareText } from "lucide-react";
import { businessInfo, siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ADE Smart Home collects, uses, stores and protects personal information provided through smart lock enquiries and our website.",
  alternates: { canonical: `${siteUrl}/privacy-policy` },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "Information we collect",
    content: [
      "When you request a quote or contact us, we may collect your name, mobile number, email address, suburb, service requirements, smart lock model, messages, and door or installation photos you choose to provide.",
      "Our website may also collect basic technical and advertising information, such as the page visited, referral source, campaign details, browser or device information, and interactions with our enquiry links.",
    ],
  },
  {
    title: "How we collect information",
    content: [
      "We collect information directly from you through our website enquiry form, SMS, email, social media messages, Meta lead forms, and conversations about a potential or confirmed installation.",
      "Website analytics and advertising services may collect limited technical information through cookies or similar technologies when those services are enabled.",
    ],
  },
  {
    title: "Why we use your information",
    content: [
      "We use your information to respond to enquiries, assess door and lock compatibility, prepare quotes, arrange installations, provide after-sales support, maintain service records, improve our website, measure advertising performance, and meet legal or business record-keeping requirements.",
      "We do not sell personal information. We do not add enquiry details to unrelated marketing lists without permission.",
    ],
  },
  {
    title: "Storage and service providers",
    content: [
      "Information may be stored in our business email, website hosting, analytics, advertising, and customer communication systems. We take reasonable steps to limit access and protect the information we hold.",
      "We may use service providers including Vercel, Google, and Meta to host the website, deliver email, analyse website activity, or process advertising enquiries. These providers may process or store information outside Australia, including in the United States and other locations where they operate.",
    ],
  },
  {
    title: "Sharing and disclosure",
    content: [
      "We disclose personal information only when reasonably needed to provide the requested service, operate our website and communications, comply with law, protect our rights or safety, or with your consent.",
      "If a job requires a supplier or service partner, we only share the details reasonably required for that purpose.",
    ],
  },
  {
    title: "Access, correction and deletion",
    content: [
      "You may ask what personal information we hold about you, request a correction, or ask us to delete information that is no longer required. Some records may need to be retained for legal, warranty, security, or accounting purposes.",
      "Contact us using the details below. We may need to verify your identity before completing a request.",
    ],
  },
  {
    title: "Privacy questions or complaints",
    content: [
      "If you have a privacy question or complaint, contact us with enough detail for us to investigate. We will acknowledge the request and aim to respond within a reasonable time.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-28 text-white md:pt-32">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 pb-12 md:px-6 md:pb-16">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a47e]">
            ADE Smart Home
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            This policy explains how we handle personal information when you visit our website,
            request a smart lock quote, or contact us about an installation.
          </p>
          <p className="mt-4 text-sm text-zinc-500">Last updated: 30 August 2026</p>
        </div>
      </header>

      <div className="container mx-auto grid gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="max-w-3xl space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-400 md:text-base">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-black tracking-tight text-white">Updates to this policy</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
              We may update this policy when our services, systems, or legal obligations change.
              The current version and update date will remain available on this page.
            </p>
          </section>
        </div>

        <aside className="h-fit border border-zinc-800 bg-black p-6 md:p-8 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold text-white">Contact ADE Smart Home</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            For access, correction, deletion, or a privacy complaint, contact us by email or SMS.
          </p>
          <div className="mt-6 space-y-3">
            <a
              href={`mailto:${businessInfo.email}?subject=Privacy%20request`}
              className="flex min-h-12 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email us
            </a>
            <a
              href={`sms:${businessInfo.phoneInternational}?body=Hi%20ADE%20Smart%20Home%2C%20I%20have%20a%20privacy%20request.`}
              className="flex min-h-12 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Text 0431 060 390
            </a>
          </div>
          <p className="mt-6 text-xs leading-5 text-zinc-600">
            ADE Smart Home provides mobile smart lock services across Adelaide, South Australia.
          </p>
          <Link
            href="/contact?service=not-sure"
            className="mt-6 inline-flex text-sm font-bold text-[#c5a47e] hover:text-white"
          >
            Return to the enquiry page
          </Link>
        </aside>
      </div>
    </main>
  );
}

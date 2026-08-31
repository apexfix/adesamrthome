import type { Metadata } from "next";
import { AudienceServicePage } from "@/components/AudienceServicePage";
import { siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/digital-door-lock-adelaide`;

export const metadata: Metadata = {
  title: "Digital Door Lock Installation Adelaide",
  description:
    "Adelaide digital door lock installation service for homes and properties. Door compatibility checks first, with supply-and-install packages and installation-only options.",
  keywords: [
    "digital door lock Adelaide",
    "digital door lock installation Adelaide",
    "smart door lock installation Adelaide",
    "digital lock installer Adelaide",
    "smart lock installer Adelaide",
    "door lock digital access Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Digital Door Lock Installation Adelaide",
    description:
      "Local Adelaide team for digital door lock fitting, installation, and setup support.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-v5-max/real-install-04.jpg",
        width: 1292,
        height: 1723,
        alt: "Digital door lock installation on a residential Adelaide entry door",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Door Lock Installation Adelaide",
    description:
      "Professional digital door lock installation in Adelaide with local compatibility checks and setup support.",
    images: ["/img/products/lockin-v5-max/real-install-04.jpg"],
  },
};

const faqs = [
  {
    question: "What is the difference between installation-only and all-inclusive packages?",
    answer:
      "All-inclusive packages include a supplied lock plus installation and setup scope. Installation-only is for customers who have a compatible lock and only need professional fitting.",
  },
  {
    question: "Can I request digital lock installation for imported models?",
    answer:
      "Yes, where the model is compatible and complete. We check hardware dimensions, app support, and any region issues before quoting.",
  },
  {
    question: "Do you include app and access setup?",
    answer:
      "Yes, we include practical setup where the selected model and lock features support it.",
  },
  {
    question: "Will my digital lock need major door modifications?",
    answer:
      "Some models need minor changes depending on door and frame size. We identify likely scope before booking.",
  },
  {
    question: "How do I avoid delays before booking?",
    answer:
      "Upload clear photos, include suburb and model details, and state whether you own the lock already.",
  },
];

export default function DigitalDoorLockAdelaidePage() {
  return (
    <AudienceServicePage
      pageUrl={pageUrl}
      serviceName="Digital Door Lock Installation Adelaide"
      serviceType="Digital smart door lock installation and setup in Adelaide"
      schemaDescription="Door-first digital lock installation service in Adelaide, including supply-and-install and compatible installation-only routes."
      audienceType="Homeowners and renters in Adelaide looking for digital access control"
      breadcrumbName="Digital Door Lock Installation Adelaide"
      heroImage="/img/products/lockin-v5-max/real-install-04.jpg"
      heroAlt="Digital door lock fitted on an Adelaide home"
      eyebrow="Adelaide digital-entry upgrade"
      title="Digital Door Lock Installation"
      accentTitle="Done Right at the Door."
      introduction="We review your door first, then choose the right digital lock route. That reduces compatibility risk and helps avoid hidden modification work."
      primaryCta="Get a Digital Lock Quote"
      smsBody="Hi ADE Smart Home, I need digital door lock installation in Adelaide. Please check compatibility and quote scope."
      proofPoints={[
        "Door compatibility first",
        "Supply-and-install or install-only",
        "Support for multiple lock brands",
        "Clear quote before booking",
      ]}
      sectionEyebrow="Installations that start with your door"
      sectionTitle="Why a digital lock route is still a compatibility route"
      sectionIntroduction="Even if you already chose a model, compatibility determines whether the lock can be installed cleanly and operate reliably."
      keyPoints={[
        {
          icon: "camera",
          title: "Photo-first diagnosis",
          detail: "Use clear outside/inside/edge/frame images so we can assess before appointment.",
        },
        {
          icon: "layers",
          title: "Model-to-door match",
          detail: "We check model dimensions against your door type and existing lock hardware.",
        },
        {
          icon: "shield",
          title: "Access management",
          detail: "We configure standard users, PIN and app access in practical daily-use format.",
        },
        {
          icon: "clipboard",
          title: "Scope transparency",
          detail: "We confirm the likely installation scope before booking so you know what to expect.",
        },
      ]}
      cautionEyebrow="Model fit matters"
      cautionTitle="Some digital locks are not ideal for all entry doors"
      cautionBody="Door thickness, frame geometry, and old lock cut-outs can affect fit. We identify these issues before scheduling and suggest the right route early."
      idealTitle="Best fit for this page"
      idealIntroduction="Use this page if you prefer digital lock terminology and want clarity before selecting lock type or installer."
      idealFor={[
        {
          icon: "key",
          title: "Tech-focused households",
          detail: "Those who use app/PIN/access codes and want clean setup support.",
        },
        {
          icon: "calendar",
          title: "Time-sensitive owners",
          detail: "People who need quick, clearly scoped lock fitting after a compatibility check.",
        },
        {
          icon: "users",
          title: "Shared-access scenarios",
          detail: "Homes with cleaners, renters or family needing controlled access workflows.",
        },
      ]}
      processTitle="From digital lock enquiry to completion"
      process={[
        {
          title: "Share compatibility details",
          detail: "Submit the lock model, suburb, and door photos.",
        },
        {
          title: "Receive route recommendation",
          detail: "We confirm whether the selected lock is suitable or if an alternate model should be considered.",
        },
        {
          title: "Approve scope and quote",
          detail: "You get the installation route and scope before booking an appointment.",
        },
        {
          title: "Install and test",
          detail: "We complete installation and verify operation before handover.",
        },
      ]}
      relatedTitle="Other lock service pages"
      relatedLinks={[
        {
          href: "/smart-lock-installation-adelaide",
          label: "Smart lock installation Adelaide",
          detail: "General installation page for Adelaide homeowners and landlords.",
        },
        {
          href: "/smart-lock-installation-only-adelaide",
          label: "Installation-only service",
          detail: "Use your own compatible digital or smart lock.",
        },
        {
          href: "/smart-lock-installer-adelaide",
          label: "Smart lock installer Adelaide",
          detail: "Find the local service path focused on fitting and installation support.",
        },
      ]}
      faqTitle="Digital lock installation FAQ"
      faqs={faqs}
      initialService="not-sure"
      initialProduct="Digital door lock"
    />
  );
}

import type { Metadata } from "next";
import { AudienceServicePage } from "@/components/AudienceServicePage";
import { siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/smart-lock-installer-adelaide`;

export const metadata: Metadata = {
  title: "Smart Lock Installer Adelaide",
  description:
    "Looking for a smart lock installer in Adelaide? We provide installation, compatibility checks, and practical setup support for residential smart locks.",
  keywords: [
    "smart lock installer Adelaide",
    "Adelaide smart lock installer",
    "smart lock installer near me",
    "digital door lock installer Adelaide",
    "smart lock fitting Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Smart Lock Installer Adelaide",
    description:
      "Certified local smart lock installer for Adelaide homes and properties, with package and installation-only options.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-x9/real-install-03.jpg",
        width: 1292,
        height: 1723,
        alt: "Local smart lock installer fitting a door lock in Adelaide",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Lock Installer Adelaide",
    description:
      "Local smart lock installer in Adelaide with compatibility-first process and installation-only support.",
    images: ["/img/products/lockin-x9/real-install-03.jpg"],
  },
};

const faqs = [
  {
    question: "Do I need to buy a lock first for installation?",
    answer:
      "Not always. You can choose a supplied package or send a compatible lock for installation-only service.",
  },
  {
    question: "Can this installer handle apartment and unit doors?",
    answer:
      "Yes. We assess each door type separately and check access, frames, and any building approval implications first.",
  },
  {
    question: "How quickly can installation be confirmed?",
    answer:
      "After receiving photos and suburb details, we confirm compatibility and route scope first, then provide quote details.",
  },
  {
    question: "Do you do emergency or after-hours installs?",
    answer:
      "Availability is handled case by case. Send your preferred timing and we will confirm possible windows.",
  },
  {
    question: "What is required from me before the visit?",
    answer:
      "Clear door photos, lock model (if installed-only), suburb, and your preferred timing are usually enough to get started.",
  },
];

export default function SmartLockInstallerAdelaidePage() {
  return (
    <AudienceServicePage
      pageUrl={pageUrl}
      serviceName="Smart Lock Installer Adelaide"
      serviceType="Licensed smart lock installer for Adelaide properties"
      schemaDescription="Local Adelaide smart lock installer offering supply-and-install and installation-only services with compatibility assessment."
      audienceType="Adelaide homeowners, tenants, and property owners seeking installation support"
      breadcrumbName="Smart Lock Installer Adelaide"
      heroImage="/img/products/lockin-x9/real-install-03.jpg"
      heroAlt="Smart lock installer working on an Adelaide entry door"
      eyebrow="Local installer service"
      title="Smart Lock Installer"
      accentTitle="Reliable Installation in Adelaide."
      introduction="Searchers who ask for a 'smart lock installer' usually need hands-on help. We handle compatibility checks, fitting scope, and practical setup locally."
      primaryCta="Book an Installer"
      smsBody="Hi ADE Smart Home, I am looking for a smart lock installer in Adelaide. Please advise available times."
      proofPoints={[
        "Adelaide-area installation coverage",
        "Clear installation scope before scheduling",
        "Supply route and installation-only route",
        "Practical setup support after fitting",
      ]}
      sectionEyebrow="Hands-on installation service"
      sectionTitle="The installer workflow that works"
      sectionIntroduction="We start with photos and installation details so the visit is focused, predictable, and better scoped for your exact door."
      keyPoints={[
        {
          icon: "hardhat",
          title: "Installer-led process",
          detail: "We lead the process from compatibility review to handover in one workflow.",
        },
        {
          icon: "file",
          title: "Clear scope",
          detail: "Any non-standard modifications are discussed before the job is booked.",
        },
        {
          icon: "door",
          title: "Door and hardware check",
          detail: "The existing lock body, frame, and access path determine the installation approach.",
        },
        {
          icon: "users",
          title: "Flexible client needs",
          detail: "One-off home upgrades and larger property portfolios are both supported through the same process.",
        },
      ]}
      cautionEyebrow="Before appointment"
      cautionTitle="We only quote after a practical compatibility review"
      cautionBody="This helps avoid mismatch and unexpected scope changes. If your photos show compatibility issues, we will advise an alternative route before booking."
      idealTitle="When to use this page"
      idealIntroduction="Use this service page when your requirement is explicitly for an on-site installer and structured support."
      idealFor={[
        {
          icon: "shield",
          title: "Exact installation need",
          detail: "You need a local technician to install and configure a lock.",
        },
        {
          icon: "wrench",
          title: "Ready-to-buy homeowners",
          detail: "You already decided to install and want the right installer workflow.",
        },
        {
          icon: "clipboard",
          title: "Multiple properties",
          detail: "You need clean handover documentation and standard installation handling across jobs.",
        },
      ]}
      processTitle="Installer-ready process"
      process={[
        {
          title: "Submit request",
          detail:
            "Use suburb, timing, photos, and current lock details for a practical compatibility check.",
        },
        {
          title: "Route confirmation",
          detail: "You get a clear route and scope path based on your lock setup.",
        },
        {
          title: "Installation visit",
          detail: "We handle fitting, adjustment, and finish checks with local attention to detail.",
        },
        {
          title: "Post-install handover",
          detail: "You receive operation guidance and practical access setup tips.",
        },
      ]}
      relatedTitle="More service pages"
      relatedLinks={[
        {
          href: "/smart-lock-installation-adelaide",
          label: "Smart lock installation in Adelaide",
          detail: "Complete installation and route options for Adelaide homes.",
        },
        {
          href: "/smart-lock-supply-installation-adelaide",
          label: "Installed smart lock packages",
          detail: "All-inclusive package options starting from Lockin X9.",
        },
        {
          href: "/smart-lock-installation-only-adelaide",
          label: "Own your lock already?",
          detail: "Installation-only assessment and fitting for compatible customer-supplied locks.",
        },
      ]}
      faqTitle="Smart lock installer FAQ"
      faqs={faqs}
      initialService="not-sure"
      initialProduct="Smart lock installer service"
    />
  );
}

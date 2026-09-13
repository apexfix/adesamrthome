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
      "Local smart lock installation service for Adelaide homes and properties, with package and installation-only options.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-x9/real-install-03.jpg",
        width: 1292,
        height: 1723,
        alt: "Lockin X9 smart lock installed on an Adelaide door",
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
      "No. We offer smart locks with standard installation, or we can fit a compatible lock you have bought elsewhere. Send the model or product link before booking so we can check the fit.",
  },
  {
    question: "Can this installer handle apartment and unit doors?",
    answer:
      "Send photos and details of your apartment or unit door first. Suitability depends on the door, frame, existing hardware and any required building approvals; not every door can be modified.",
  },
  {
    question: "How quickly can installation be confirmed?",
    answer:
      "Send your suburb, lock model and preferred timing. We confirm door compatibility, installation scope and available appointments before a booking is made.",
  },
  {
    question: "Do you do emergency or after-hours installs?",
    answer:
      "Availability is handled case by case. Send your preferred timing and we will confirm possible windows.",
  },
  {
    question: "What is required from me before the visit?",
    answer:
      "Your suburb and a mobile number or email are enough to start an enquiry. The exact lock model and photos of the outside, inside, door edge and frame help us confirm compatibility before the visit.",
  },
];

export default function SmartLockInstallerAdelaidePage() {
  return (
    <AudienceServicePage
      pageUrl={pageUrl}
      serviceName="Smart Lock Installer Adelaide"
      serviceType="Smart lock installation service for Adelaide properties"
      schemaDescription="Local Adelaide smart lock installer offering supply-and-install and installation-only services with compatibility assessment."
      audienceType="Adelaide homeowners, tenants, and property owners seeking installation support"
      breadcrumbName="Smart Lock Installer Adelaide"
      heroImage="/img/products/lockin-x9/real-install-03.jpg"
      heroAlt="Completed Lockin X9 smart lock installation on an Adelaide entry door"
      eyebrow="Local installer service"
      title="Smart Lock Installer"
      accentTitle="Reliable Installation in Adelaide."
      introduction="Need a smart lock fitted in Adelaide? Choose a lock with installation, or bring a compatible model you have purchased elsewhere. Send your suburb and lock details for a door check and quote by SMS or email."
      primaryCta="Request an Installation Quote"
      smsBody="Hi ADE Smart Home, I am looking for a smart lock installer in Adelaide. Please advise available times."
      proofPoints={[
        "Adelaide-area installation coverage",
        "Clear installation scope before scheduling",
        "Supplied locks and compatible customer-supplied models",
        "Practical setup support after fitting",
      ]}
      sectionEyebrow="Hands-on installation service"
      sectionTitle="What Your Installation Involves"
      sectionIntroduction="We check how the lock will fit your door, explain any extra work and confirm the price before arranging a visit."
      keyPoints={[
        {
          icon: "hardhat",
          title: "Choose the right fit",
          detail: "Send the model or product link, including locks bought from another retailer, for a compatibility check.",
        },
        {
          icon: "file",
          title: "Clear scope",
          detail: "Any non-standard modifications are discussed before the job is booked.",
        },
        {
          icon: "door",
          title: "Door and hardware check",
          detail: "We check the lock body, door material, frame and handle clearance before confirming the fitting work.",
        },
        {
          icon: "users",
          title: "Setup and handover",
          detail: "After fitting, we test normal operation and explain supported passcode, user and app setup.",
        },
      ]}
      cautionEyebrow="Before appointment"
      cautionTitle="We only quote after a practical compatibility review"
      cautionBody="Send door photos when you can. If the chosen model does not suit the door, we will discuss alternatives before you commit to an installation."
      idealTitle="Already Bought a Lock, or Still Choosing?"
      idealIntroduction="Both are welcome. We can help you understand the fitting requirements before you book."
      idealFor={[
        {
          icon: "shield",
          title: "A lock you already own",
          detail: "Installation only is A$200 for a compatible compact lock or A$350 for a standard 6068 full-size mortise lock. Extra work is quoted before booking.",
        },
        {
          icon: "wrench",
          title: "A lock supplied and installed",
          detail: "Compare our installed packages, including the Lockin X9 at A$699 with standard Adelaide installation, subject to a door compatibility check.",
        },
        {
          icon: "clipboard",
          title: "Multiple properties",
          detail: "Tell us how many doors need locks and whether they use the same hardware, so we can assess each fitting and discuss scheduling.",
        },
      ]}
      processTitle="From Enquiry to Installation"
      process={[
        {
          title: "Submit request",
          detail:
            "Leave your suburb and mobile or email. Add a model link and door photos if you have them ready.",
        },
        {
          title: "Confirm the quote",
          detail: "We review the door and lock, explain any non-standard work and confirm the price and available appointments.",
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
      relatedTitle="Compare Your Installation Options"
      relatedLinks={[
        {
          href: "/smart-lock-installation-adelaide",
          label: "Smart lock installation in Adelaide",
          detail: "Door checks, supported lock types and what to expect when booking.",
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

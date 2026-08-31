import type { Metadata } from "next";
import { AudienceServicePage } from "@/components/AudienceServicePage";
import { siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/smart-lock-installation-adelaide`;

export const metadata: Metadata = {
  title: "Smart Lock Installation Adelaide",
  description:
    "Professional smart lock installation in Adelaide. Local compatibility checks, supply-and-install packages and installation-only service for compatible customer-supplied locks.",
  keywords: [
    "smart lock installation Adelaide",
    "smart lock installer Adelaide",
    "adelaide smart lock installer",
    "door lock installation Adelaide",
    "digital door lock installation",
    "smart lock fitting Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Smart Lock Installation Adelaide",
    description:
      "Adelaide smart lock installation with compatibility-first process, local support, and no upfront payment.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-x9/real-install-02.jpg",
        width: 1292,
        height: 1723,
        alt: "Smart lock installation service for an Adelaide home entry",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Lock Installation Adelaide",
    description:
      "Supply-and-install and installation-only smart lock services in Adelaide with local compatibility checks.",
    images: ["/img/products/lockin-x9/real-install-02.jpg"],
  },
};

const faqs = [
  {
    question: "Can you help if I already bought a smart lock?",
    answer:
      "Yes. We can install compatible customer-supplied locks after we check the model and door compatibility.",
  },
  {
    question: "What is included in your smart lock installation service?",
    answer:
      "For supply-and-install packages: selected lock, standard installation, and setup support. For installation-only: we check your existing lock model and door first before booking.",
  },
  {
    question: "Do you only do one brand of smart lock?",
    answer:
      "No. We can install Lockin packages and compatible imported locks that match the door, required access, and scope.",
  },
  {
    question: "Can a smart lock not fit my door?",
    answer:
      "Yes. Fit depends on door material, thickness, current hardware and frame conditions. We do compatibility checks to avoid wrong choices.",
  },
  {
    question: "Can you install in suburban areas outside CBD?",
    answer:
      "Yes. We serve Adelaide and nearby local areas. Send your suburb in the enquiry so we can confirm availability quickly.",
  },
];

export default function SmartLockInstallationAdelaidePage() {
  return (
    <AudienceServicePage
      pageUrl={pageUrl}
      serviceName="Smart Lock Installation Adelaide"
      serviceType="Smart lock installation and setup in Adelaide"
      schemaDescription="Local smart lock installation service in Adelaide with supply-and-install and installation-only routes."
      audienceType="Homeowners, tenants, landlords, and property owners in Adelaide"
      breadcrumbName="Smart Lock Installation Adelaide"
      heroImage="/img/products/lockin-x9/real-install-02.jpg"
      heroAlt="Smart lock installation on an Adelaide entry door"
      eyebrow="Adelaide smart-lock support"
      title="Smart Lock Installation"
      accentTitle="Handled Locally in Adelaide."
      introduction="Whether you want a new lock package or installation for a lock you already own, we use a door-first process to reduce rework and avoid incompatible choices."
      primaryCta="Start Smart Lock Installation"
      smsBody="Hi ADE Smart Home, I need smart lock installation in Adelaide and want an exact scope quote."
      proofPoints={[
        "Door compatibility checked first",
        "Supply-and-install or installation-only options",
        "Local on-site service in Adelaide",
        "Photo + suburb details for faster quote",
      ]}
      sectionEyebrow="Installation that starts correctly"
      sectionTitle="Compatibility is the first thing we check"
      sectionIntroduction="Smart lock success depends on more than the lock model. We assess your door, frame, existing hardware and access needs before booking."
      keyPoints={[
        {
          icon: "door",
          title: "Door-first assessment",
          detail: "We confirm clearance, lock body space, and hardware conditions before choosing a package or route.",
        },
        {
          icon: "map",
          title: "Adelaide coverage",
          detail: "We can handle homes and complexes across Adelaide and nearby suburbs after confirming location details.",
        },
        {
          icon: "wrench",
          title: "Two service routes",
          detail: "Choose package installation or installation-only if you already own a compatible lock.",
        },
        {
          icon: "door",
          title: "Direct workflow",
          detail: "Photo submission and a simple lead form mean fewer back-and-forth details requests.",
        },
      ]}
      cautionEyebrow="Scope depends on compatibility"
      cautionTitle="Not every door is suitable for every lock"
      cautionBody="Some doors need special compatibility handling. We will confirm suitability first and quote scope before scheduling, so you avoid delays or surprises."
      idealTitle="Who this page is for"
      idealIntroduction="Use this page if your key goal is straightforward installation service for your Adelaide home or rental property."
      idealFor={[
        {
          icon: "home",
          title: "Homeowners",
          detail: "Replacement of current key lock or upgrade to keyless entry.",
        },
        {
          icon: "building",
          title: "Property owners",
          detail: "Simple route from compatibility check to installation plan for each unit.",
        },
        {
          icon: "key",
          title: "Existing lock owners",
          detail: "Installation-only option when you already purchased a compatible smart lock.",
        },
      ]}
      processTitle="The process from enquiry to install"
      process={[
        {
          title: "Send details and photos",
          detail:
            "Share suburb, lock choice, photos, and timing so we can assess your door quickly.",
        },
        {
          title: "Match the route",
          detail:
            "We confirm whether supply-and-install or installation-only is the best route for your situation.",
        },
        {
          title: "Confirm quote and timing",
          detail:
            "You receive the scope and price range before final scheduling and we confirm a date.",
        },
        {
          title: "Install, test, and hand over",
          detail:
            "We fit and test the lock and provide practical setup support for daily use.",
        },
      ]}
      relatedTitle="Related Adelaide lock routes"
      relatedLinks={[
        {
          href: "/smart-lock-supply-installation-adelaide",
          label: "Smart lock supply and install",
          detail: "Compare installed-price packages and lock options.",
        },
        {
          href: "/smart-lock-installation-only-adelaide",
          label: "Installation-only support",
          detail: "Use your own lock with compatibility-first installation.",
        },
        {
          href: "/digital-door-lock-adelaide",
          label: "Digital door lock service",
          detail: "A route focused on digital lock compatibility and setup.",
        },
      ]}
      faqTitle="Smart lock installation FAQ"
      faqs={faqs}
      initialService="not-sure"
      initialProduct="General smart lock installation"
    />
  );
}

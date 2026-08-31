import type { Metadata } from "next";
import { AudienceServicePage } from "@/components/AudienceServicePage";
import { siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/new-home-smart-lock-installation-adelaide`;

export const metadata: Metadata = {
  title: "New Home Smart Lock Installation Adelaide",
  description:
    "Plan a smart lock for an Adelaide new home or renovation before the entry door and hardware are finalised. Compare supplied packages or compatible installation-only service.",
  keywords: [
    "new home smart lock Adelaide",
    "builder smart lock installation Adelaide",
    "renovation digital door lock Adelaide",
    "smart lock installer new build Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "New Home Smart Lock Installation Adelaide",
    description:
      "Plan the smart lock, front door and hardware together for a cleaner new-home installation.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-v5-max/real-install-02.jpg",
        width: 1292,
        height: 1723,
        alt: "Premium smart lock installed on a modern Adelaide new-home entrance",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Home Smart Lock Installation Adelaide",
    description: "Choose the lock and front-door preparation before the build is finished.",
    images: ["/img/products/lockin-v5-max/real-install-02.jpg"],
  },
};

const faqs = [
  {
    question: "When should I choose the smart lock for a new home?",
    answer:
      "The most useful time is before the entry door and hardware details are final. This allows the lock dimensions, mortise requirements, handle position, frame and any screen-door clearance to be considered together.",
  },
  {
    question: "Can you work with a builder, door supplier or renovator?",
    answer:
      "We can review the proposed lock and door information and explain the installation requirements for the selected model. Responsibility for door manufacture, site preparation and other trades remains with the relevant supplier or contractor unless separately agreed.",
  },
  {
    question: "Can I purchase the lock myself?",
    answer:
      "Yes, if the customer-supplied lock is compatible with the chosen door and the required parts are available. Send the exact model and door specifications before ordering where possible.",
  },
  {
    question: "Which smart lock is best for a new front door?",
    answer:
      "The answer depends on preferred access methods, whether a camera or video doorbell is wanted, door style, hardware preparation, budget and the household's backup-access needs. We compare those requirements before recommending a route.",
  },
  {
    question: "Can the smart lock be installed before handover?",
    answer:
      "Timing depends on site access, door readiness, power or network requirements where relevant and coordination with the builder or owner. Confirm the proposed installation stage and access arrangements before booking.",
  },
];

export default function NewHomeSmartLockInstallationPage() {
  return (
    <AudienceServicePage
      pageUrl={pageUrl}
      serviceName="New Home Smart Lock Installation Adelaide"
      serviceType="Smart lock planning and installation for new homes and renovations"
      schemaDescription="Smart lock selection, door compatibility planning, supply and installation, and compatible installation-only service for Adelaide new homes and renovations."
      audienceType="New-home owners, renovators, builders and door suppliers"
      breadcrumbName="New Home Smart Lock Installation Adelaide"
      heroImage="/img/products/lockin-v5-max/real-install-02.jpg"
      heroAlt="Premium smart lock installed on a modern Adelaide new-home front door"
      eyebrow="Adelaide new homes and renovations"
      title="Plan the Smart Lock"
      accentTitle="Before the Door Is Final."
      introduction="A new front door is the best opportunity to consider the lock body, handle position, frame, screen-door clearance and preferred access features together."
      primaryCta="Plan My New-Home Lock"
      smsBody="Hi ADE Smart Home, I am planning a smart lock for a new home or renovation in Adelaide."
      proofPoints={[
        "Lock and door reviewed together",
        "Supply or installation only",
        "Builder-ready requirements",
        "Quote before booking",
      ]}
      sectionEyebrow="Plan before purchase"
      sectionTitle="The cleanest installation starts with the door specification"
      sectionIntroduction="Choosing early gives the owner, door supplier and installer a clearer picture of the lock dimensions, preparation and access features required for the finished entry."
      keyPoints={[
        {
          icon: "hardhat",
          title: "Project stage",
          detail: "Tell us whether the door is being selected, manufactured, installed or already ready for hardware.",
        },
        {
          icon: "door",
          title: "Door and frame details",
          detail: "Share the door material, thickness, edge preparation, frame and nearby glass or screen-door clearance.",
        },
        {
          icon: "key",
          title: "Access priorities",
          detail: "Choose between practical keyless entry, premium biometrics, camera features and supported smart-home access.",
        },
        {
          icon: "file",
          title: "Model requirements",
          detail: "The selected lock specifications can be reviewed before the door and hardware decisions are finalised.",
        },
      ]}
      cautionEyebrow="Coordinate the project scope"
      cautionTitle="Confirm who is responsible for the door preparation and installation stage"
      cautionBody="A smart-lock plan may involve the owner, builder, door supplier and installer. Before booking, confirm that the door is ready, the selected model is compatible, site access is available and any preparation expected from another trade has been completed."
      idealTitle="Three ways to use the planning service"
      idealIntroduction="The project can start from a preferred smart-lock model, a selected front door or a simple list of the access features the household wants."
      idealFor={[
        {
          icon: "home",
          title: "New-home owner",
          detail: "Compare access options and installed packages before the front-door hardware is finalised.",
        },
        {
          icon: "hammer",
          title: "Renovation",
          detail: "Assess whether the existing entry will be retained, modified or replaced before choosing the lock.",
        },
        {
          icon: "hardhat",
          title: "Builder or door supplier",
          detail: "Share proposed door and lock details early so the model requirements are clear before installation day.",
        },
      ]}
      processTitle="From design choice to installation-ready door"
      process={[
        {
          title: "Share the project stage",
          detail: "Tell us the suburb, build or renovation stage, preferred timing and whether the entry door has been selected.",
        },
        {
          title: "Choose the access brief",
          detail: "List the required methods such as fingerprint, PIN, NFC, app, camera, video doorbell or smart-home access.",
        },
        {
          title: "Review door and lock details",
          detail: "Provide door specifications, drawings or photos and the exact model if one has already been selected.",
        },
        {
          title: "Confirm scope and timing",
          detail: "The installation route, responsibilities, price and appointment timing are agreed before booking.",
        },
      ]}
      relatedTitle="Compare the next step"
      relatedLinks={[
        {
          href: "/smart-lock-supply-installation-adelaide",
          label: "Installed-price packages",
          detail: "Compare the current Lockin supply-and-install options and included features.",
        },
        {
          href: "/smart-lock-installation-only-adelaide",
          label: "Customer-supplied lock",
          detail: "Request installation-only assessment if the smart lock has already been purchased.",
        },
        {
          href: "/blog/smart-lock-door-compatibility-check",
          label: "Door compatibility guide",
          detail: "See the photos, dimensions and clearance details used before installation.",
        },
      ]}
      faqTitle="New-home smart-lock FAQ"
      faqs={faqs}
      initialService="not-sure"
      initialProduct="New home / renovation"
    />
  );
}

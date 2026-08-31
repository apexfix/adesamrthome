import type { Metadata } from "next";
import { AudienceServicePage } from "@/components/AudienceServicePage";
import { siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/property-manager-smart-lock-installation-adelaide`;

export const metadata: Metadata = {
  title: "Property Manager Smart Lock Installation Adelaide",
  description:
    "Smart lock assessment, supply and installation for Adelaide property managers. Start with one property, use a repeatable door-photo check and plan compatible multi-property work.",
  keywords: [
    "property manager smart lock Adelaide",
    "rental property smart lock installation Adelaide",
    "multi property smart lock installer Adelaide",
    "real estate smart lock Adelaide",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Property Manager Smart Lock Installation Adelaide",
    description:
      "A compatibility-first installation workflow for Adelaide rental and managed-property portfolios.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-sv40/real-install-01.jpg",
        width: 1292,
        height: 1723,
        alt: "Smart lock installed for an Adelaide managed property",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Manager Smart Lock Installation Adelaide",
    description: "Start with one managed property and build a repeatable smart-lock workflow.",
    images: ["/img/products/lockin-sv40/real-install-01.jpg"],
  },
};

const faqs = [
  {
    question: "Can we trial one property before discussing a wider rollout?",
    answer:
      "Yes. A one-property trial helps confirm door compatibility, access needs, handover and day-to-day usability before the same approach is considered for other suitable properties.",
  },
  {
    question: "Can you install locks that owners or managers have already purchased?",
    answer:
      "Yes, where the exact customer-supplied model is compatible with the door and complete for installation. Send the product listing and door photos before booking. Product warranty and missing parts remain with the seller or manufacturer.",
  },
  {
    question: "Can different properties use the same lock model?",
    answer:
      "Sometimes, but the door and access requirements still need to be checked property by property. A standard photo checklist helps identify exceptions before appointments are scheduled.",
  },
  {
    question: "Do smart locks integrate with property-management software?",
    answer:
      "Integration depends on the selected lock, app and third-party platform. We configure the supported lock features included with the chosen model; external integrations should be verified separately before purchase.",
  },
  {
    question: "What should the manager send for a quote?",
    answer:
      "For each property, send the suburb or address reference, exact lock model if known, outside and inside door photos, the door edge, frame, any screen-door clearance and preferred timing.",
  },
];

export default function PropertyManagerSmartLockInstallationPage() {
  return (
    <AudienceServicePage
      pageUrl={pageUrl}
      serviceName="Property Manager Smart Lock Installation Adelaide"
      serviceType="Smart lock installation support for managed and rental properties"
      schemaDescription="Smart lock assessment, supply and installation, compatible installation-only work and portfolio planning for Adelaide property managers."
      audienceType="Property managers, real estate teams, landlords and short-stay operators"
      breadcrumbName="Property Manager Smart Lock Installation Adelaide"
      heroImage="/img/products/lockin-sv40/real-install-01.jpg"
      heroAlt="Smart lock installed at an Adelaide managed rental property"
      eyebrow="Adelaide managed properties"
      title="A Repeatable Smart-Lock Process"
      accentTitle="Starting With One Door."
      introduction="Use a consistent door-photo checklist, confirm compatibility before scheduling and trial one property before planning compatible work across a wider portfolio."
      primaryCta="Plan One Trial Property"
      smsBody="Hi ADE Smart Home, I manage properties in Adelaide and would like to discuss a smart-lock trial property."
      proofPoints={[
        "One-property pilot",
        "Supply or installation only",
        "Door checks before scheduling",
        "Property-by-property records",
      ]}
      sectionEyebrow="Built around property operations"
      sectionTitle="Fewer surprises between enquiry and installation"
      sectionIntroduction="A consistent intake process makes it easier to identify suitable doors, missing information and higher-risk exceptions before an installer is scheduled."
      keyPoints={[
        {
          icon: "clipboard",
          title: "One photo checklist",
          detail: "Outside, inside, door edge, frame and screen-door clearance for each property.",
        },
        {
          icon: "key",
          title: "Access requirements",
          detail: "Define who needs entry, how access is managed and which backup method the property will use.",
        },
        {
          icon: "wrench",
          title: "Two service routes",
          detail: "Choose a supplied package or request installation of a compatible owner-supplied smart lock.",
        },
        {
          icon: "calendar",
          title: "Clear scheduling inputs",
          detail: "Suburb, property access, preferred timing and tenant or cleaner coordination are captured before booking.",
        },
      ]}
      cautionEyebrow="Each door still needs assessment"
      cautionTitle="A portfolio standard does not make every property identical"
      cautionBody="Door construction, existing hardware, screen-door clearance, building approval and access needs can differ between properties. We can build a repeatable process, but the selected lock and scope are confirmed for each door rather than assumed across the portfolio."
      idealTitle="Where the workflow is most useful"
      idealIntroduction="Start with a property that has a clear access problem and complete door information, then use the result to decide whether the approach should be repeated."
      idealFor={[
        {
          icon: "home",
          title: "Long-term rentals",
          detail: "Plan authorised access while keeping product selection, handover and backup access clear.",
        },
        {
          icon: "users",
          title: "Short-stay portfolios",
          detail: "Consider guest, cleaner and maintenance access for suitable properties without relying on physical key handovers.",
        },
        {
          icon: "building",
          title: "Apartment portfolios",
          detail: "Identify door and building requirements early, particularly for common-property or specialised entry doors.",
        },
      ]}
      processTitle="A four-step managed-property pilot"
      process={[
        {
          title: "Choose one property",
          detail: "Select a clear use case with an owner or manager ready to provide door details and access requirements.",
        },
        {
          title: "Complete the door check",
          detail: "Send the standard photo set, suburb or property reference, exact model if owned and preferred timing.",
        },
        {
          title: "Confirm and install",
          detail: "Suitability, scope, price and availability are agreed before the appointment and the supported access features are tested.",
        },
        {
          title: "Review before repeating",
          detail: "Use the first result to refine the model, photo checklist, handover and scheduling process for future properties.",
        },
      ]}
      relatedTitle="Support for different managed-property needs"
      relatedLinks={[
        {
          href: "/airbnb-smart-lock-installation-adelaide",
          label: "Airbnb and short stays",
          detail: "Plan guest and cleaner access for a suitable short-stay property.",
        },
        {
          href: "/apartment-smart-lock-installation-adelaide",
          label: "Apartments and units",
          detail: "Review door hardware, clearance and building requirements before installation.",
        },
        {
          href: "/smart-lock-installation-only-adelaide",
          label: "Customer-supplied locks",
          detail: "Request installation-only assessment for a compatible model already purchased.",
        },
      ]}
      faqTitle="Property manager smart-lock FAQ"
      faqs={faqs}
      initialService="not-sure"
      initialProduct="Property manager / portfolio trial"
    />
  );
}

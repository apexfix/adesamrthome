import type { Metadata } from "next";
import { AudienceServicePage } from "@/components/AudienceServicePage";
import { siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/apartment-smart-lock-installation-adelaide`;

export const metadata: Metadata = {
  title: "Apartment Smart Lock Installation Adelaide",
  description:
    "Smart lock assessment and installation for Adelaide apartments and units. Check the door, existing hardware, building requirements and screen-door clearance before booking.",
  keywords: [
    "apartment smart lock installation Adelaide",
    "unit door smart lock Adelaide",
    "apartment digital door lock Adelaide",
    "smart lock installer Adelaide apartment",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Apartment Smart Lock Installation Adelaide",
    description:
      "Compatibility-first smart lock assessment for Adelaide apartment and unit entry doors.",
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/lockin-x9/real-install-01.jpg",
        width: 1292,
        height: 1723,
        alt: "Smart lock installed on an Adelaide apartment entry door",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apartment Smart Lock Installation Adelaide",
    description: "Check apartment-door compatibility before choosing or installing a smart lock.",
    images: ["/img/products/lockin-x9/real-install-01.jpg"],
  },
};

const faqs = [
  {
    question: "Can every apartment entry door have a smart lock?",
    answer:
      "No. Suitability depends on the door construction, existing lock body, frame, clearance and any building or strata requirements. Send clear photos first and confirm any required approval with the relevant building manager before changes are made.",
  },
  {
    question: "What if the apartment door is a fire-rated door?",
    answer:
      "Do not assume that a standard smart lock or modification is suitable for a fire-rated door. The door, hardware approvals and proposed work need to be checked for the specific property. We do not describe a door as compliant based on photos alone.",
  },
  {
    question: "Can you install a smart lock I already bought?",
    answer:
      "Yes, where the customer-supplied model is compatible with the door and permitted scope. Send the exact model or product listing plus photos of both sides, the door edge, frame and any screen door.",
  },
  {
    question: "Will a smart lock work with my security or screen door?",
    answer:
      "The main issue is physical clearance between the doors and handles. Send a side-on photo showing the gap so the lock body and handle projection can be assessed before a model is confirmed.",
  },
  {
    question: "What information should I include in the quote request?",
    answer:
      "Include the suburb or postcode, whether the home is an apartment or unit, the exact lock model if already purchased, preferred timing and clear photos of the outside, inside, edge and frame of the door.",
  },
];

export default function ApartmentSmartLockInstallationPage() {
  return (
    <AudienceServicePage
      pageUrl={pageUrl}
      serviceName="Apartment Smart Lock Installation Adelaide"
      serviceType="Smart lock assessment and installation for apartments and units"
      schemaDescription="Smart lock assessment, supply and installation, and compatible installation-only service for Adelaide apartments and units."
      audienceType="Apartment owners, unit residents, landlords and property managers"
      breadcrumbName="Apartment Smart Lock Installation Adelaide"
      heroImage="/img/products/lockin-x9/real-install-01.jpg"
      heroAlt="Smart lock fitted to an Adelaide apartment entry door"
      eyebrow="Adelaide apartments and units"
      title="Apartment Smart Locks"
      accentTitle="Checked Before Installation."
      introduction="Apartment entry doors can involve existing mortise hardware, screen-door clearance and building requirements. We assess the door and proposed lock before confirming the installation route."
      primaryCta="Assess My Apartment Door"
      smsBody="Hi ADE Smart Home, I need a smart-lock compatibility check for an apartment or unit door."
      proofPoints={[
        "Door and hardware assessed first",
        "Building approval considered",
        "Supply or installation-only routes",
        "SMS and email enquiries",
      ]}
      sectionEyebrow="Apartment-specific checks"
      sectionTitle="The lock is only one part of the decision"
      sectionIntroduction="A useful assessment looks at the complete entry: the door, existing hardware, frame, nearby glass, clearance and any property rules that affect the proposed work."
      keyPoints={[
        {
          icon: "door",
          title: "Existing door hardware",
          detail: "We look at the current lock body, handle position, available space and frame alignment.",
        },
        {
          icon: "file",
          title: "Building requirements",
          detail: "Owners and residents should confirm any strata, building-manager or landlord approval needed for the property.",
        },
        {
          icon: "layers",
          title: "Door status",
          detail: "Fire-rated or specialised doors need property-specific assessment; suitability is not assumed from a product listing.",
        },
        {
          icon: "camera",
          title: "Clearance photos",
          detail: "A side view helps check nearby walls, glass, security doors and screen-door clearance.",
        },
      ]}
      cautionEyebrow="Approval and door status matter"
      cautionTitle="Confirm the permitted scope before modifying an apartment entry door"
      cautionBody="Some apartment doors and common-property entrances have requirements beyond ordinary residential doors. If the door is fire-rated, part of common property or subject to strata or landlord approval, confirm the relevant requirements before booking. A photo assessment helps with likely hardware compatibility but does not certify the door or proposed work."
      idealTitle="Three common apartment enquiries"
      idealIntroduction="We can help identify the practical next step, whether you are choosing a new lock or already have the hardware."
      idealFor={[
        {
          icon: "building",
          title: "Owner-occupied apartment",
          detail: "Compare suitable access options after the door, frame and building requirements are understood.",
        },
        {
          icon: "key",
          title: "Rental or short stay",
          detail: "Consider guest, tenant, cleaner and backup access without assuming every app or integration works the same way.",
        },
        {
          icon: "wrench",
          title: "Customer-supplied lock",
          detail: "Send the exact model and complete door photos for an installation-only assessment before booking.",
        },
      ]}
      processTitle="From apartment-door photos to a confirmed scope"
      process={[
        {
          title: "Send four door views",
          detail: "Share the outside, inside, door edge and frame, plus a side view of any security or screen door.",
        },
        {
          title: "Add the property details",
          detail: "Include suburb, apartment or unit type, current lock and any building or landlord requirements already known.",
        },
        {
          title: "Confirm the route",
          detail: "We identify whether a supplied package, installation-only service or further confirmation is appropriate.",
        },
        {
          title: "Quote before booking",
          detail: "Scope, price and availability are confirmed before an installation appointment is made.",
        },
      ]}
      relatedTitle="Other smart-lock routes"
      relatedLinks={[
        {
          href: "/smart-lock-installation-only-adelaide",
          label: "Already bought a lock?",
          detail: "Request installation-only assessment for a compatible customer-supplied model.",
        },
        {
          href: "/airbnb-smart-lock-installation-adelaide",
          label: "Airbnb and short stay",
          detail: "Plan guest and cleaner access for a suitable rental-property door.",
        },
        {
          href: "/blog/smart-lock-door-compatibility-check",
          label: "Door compatibility guide",
          detail: "See the exact door photos and measurements that make an assessment more useful.",
        },
      ]}
      faqTitle="Apartment smart-lock FAQ"
      faqs={faqs}
      initialService="not-sure"
      initialProduct="Apartment / unit entry door"
    />
  );
}

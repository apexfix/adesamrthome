import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Check,
  DoorOpen,
  MapPin,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessInfo, serviceAreas, siteUrl } from "@/lib/seoData";

type PageProps = { params: Promise<{ suburb: string }> };

type LocalPageDetail = {
  image: string;
  summary: string;
  doorFocus: string;
  propertyFocus: string;
  relatedSlugs: string[];
};

const localPageDetails: Record<string, LocalPageDetail> = {
  "adelaide-cbd": {
    image: "/img/products/lockin-s50m-pro/real-install-01.jpg",
    summary:
      "Installation support for CBD apartments, city homes, rentals and selected business entries, with access and door approval checked before booking.",
    doorFocus:
      "Apartment and managed-building doors may require approval before hardware is changed. We check the existing lock, fire-door labels, frame clearance and building requirements before recommending a route.",
    propertyFocus:
      "Suitable enquiries include owner-occupied apartments, rental access upgrades, city homes and selected office-style entry doors.",
    relatedSlugs: ["norwood", "unley", "prospect"],
  },
  glenelg: {
    image: "/img/products/lockin-x9/real-install-02.jpg",
    summary:
      "Smart lock fitting for Glenelg homes, apartments and coastal properties, with the door material and entry exposure assessed first.",
    doorFocus:
      "Coastal entries can vary from sheltered timber doors to exposed aluminium doors. We check door thickness, weather exposure, frame clearance and screen-door spacing before confirming a lock.",
    propertyFocus:
      "We can assess detached homes, apartments, townhouses and short-stay properties around Glenelg and nearby beachside suburbs.",
    relatedSlugs: ["marion", "henley-beach", "west-lakes"],
  },
  norwood: {
    image: "/img/products/lockin-v5-max/real-install-02.jpg",
    summary:
      "Smart lock installation for Norwood character homes, renovated properties, apartments and nearby eastern suburbs.",
    doorFocus:
      "Older and renovated doors often have existing holes, decorative hardware or non-standard mortises. Photos help us check whether these can be covered cleanly before any cutting begins.",
    propertyFocus:
      "This service suits character homes, updated front entries, apartments and rental properties in the inner east.",
    relatedSlugs: ["burnside", "paradise", "adelaide-cbd"],
  },
  prospect: {
    image: "/img/products/lockin-s6-max/real-install-01.jpg",
    summary:
      "Professional smart lock installation for Prospect family homes, rentals and renovated front doors across the inner north.",
    doorFocus:
      "Prospect properties can have a mix of original and newer door hardware. We compare the current cut-out, backset, door edge and frame before selecting a compact or full-size lock.",
    propertyFocus:
      "Common service routes include home upgrades, rental access, keyless family entry and customer-supplied lock installation.",
    relatedSlugs: ["adelaide-cbd", "mawson-lakes", "west-lakes"],
  },
  "mawson-lakes": {
    image: "/img/products/lockin-s50m-pro/real-install-03.jpg",
    summary:
      "Smart lock supply and installation-only service for Mawson Lakes homes, townhouses and investment properties.",
    doorFocus:
      "Modern doors still need clearance checks, especially where a security screen sits close to the main entry. We assess handle projection, lock body space and frame alignment first.",
    propertyFocus:
      "We can help with family homes, townhouses, rental access and compatible smart locks already purchased by the customer.",
    relatedSlugs: ["prospect", "modbury", "paradise"],
  },
  unley: {
    image: "/img/products/lockin-sv40/real-install-03.jpg",
    summary:
      "Careful smart lock fitting for Unley homes, heritage-style entries, renovations and nearby inner-southern suburbs.",
    doorFocus:
      "Detailed timber doors and older hardware need a compatibility check that considers existing holes, trim, backset and the final visible finish. We confirm the likely result before booking.",
    propertyFocus:
      "This route suits home renovations, premium front entries, rental properties and keyless access upgrades around Unley.",
    relatedSlugs: ["adelaide-cbd", "burnside", "marion"],
  },
  modbury: {
    image: "/img/products/lockin-x9/real-install-04.jpg",
    summary:
      "Smart lock installation for Modbury family homes, suburban properties and nearby north-eastern Adelaide areas.",
    doorFocus:
      "We check the current latch or mortise, door thickness and any nearby screen door. These measurements determine whether a compact lever lock or full-size smart lock is the better fit.",
    propertyFocus:
      "Available routes include supplied packages, replacement of compatible existing hardware and installation-only for customer-purchased locks.",
    relatedSlugs: ["paradise", "mawson-lakes", "burnside"],
  },
  burnside: {
    image: "/img/products/lockin-v5-max/real-install-04.jpg",
    summary:
      "Smart lock installation for Burnside timber entries, renovated homes and premium residential doors in Adelaide's east.",
    doorFocus:
      "For detailed or premium doors, the final finish matters as much as lock operation. We assess hardware coverage, alignment and required cutting before recommending a model.",
    propertyFocus:
      "We can assess new smart lock packages, replacement projects and compatible customer-supplied locks for homes around Burnside.",
    relatedSlugs: ["norwood", "paradise", "unley"],
  },
  marion: {
    image: "/img/products/lockin-s50m-pro/real-install-06.jpg",
    summary:
      "Smart lock fitting for Marion homes, units and rental properties across Adelaide's inner south-west.",
    doorFocus:
      "The existing handle position, backset, door edge and frame determine the installation method. We use door photos to identify likely conflicts before scheduling.",
    propertyFocus:
      "This service supports home upgrades, rental access, compact keypad locks and full-size biometric smart locks.",
    relatedSlugs: ["glenelg", "unley", "henley-beach"],
  },
  "henley-beach": {
    image: "/img/products/lockin-s6-max/real-install-03.jpg",
    summary:
      "Smart lock installation for Henley Beach homes, townhouses and coastal properties across Adelaide's west.",
    doorFocus:
      "We consider how sheltered the entry is, the door material, screen-door clearance and the selected model's intended use before confirming suitability for a coastal property.",
    propertyFocus:
      "Available support includes supplied smart lock packages and installation-only service for compatible customer-owned models.",
    relatedSlugs: ["west-lakes", "glenelg", "prospect"],
  },
  "west-lakes": {
    image: "/img/products/lockin-s50m-pro/real-install-08.jpg",
    summary:
      "Professional smart lock installation for West Lakes family homes, townhouses and nearby western Adelaide suburbs.",
    doorFocus:
      "Entry exposure, security-screen spacing and existing lock alignment are checked before a model is approved. This helps avoid handle clashes and incomplete coverage.",
    propertyFocus:
      "We can help homeowners, landlords and property managers choose supply-and-install or customer-supplied installation service.",
    relatedSlugs: ["henley-beach", "glenelg", "prospect"],
  },
  paradise: {
    image: "/img/products/lockin-x9/real-install-06.jpg",
    summary:
      "Smart lock installation for Paradise homes, rentals and nearby north-eastern Adelaide suburbs.",
    doorFocus:
      "We assess timber or aluminium door construction, current hardware, frame clearance and any security screen before confirming installation scope.",
    propertyFocus:
      "Service options cover family homes, rental properties, supplied lock packages and compatible locks purchased elsewhere.",
    relatedSlugs: ["modbury", "norwood", "burnside"],
  },
};

type LocalPageEnhancement = {
  imageAlt: string;
  planningPoints: readonly string[];
  localQuestion: string;
  localAnswer: string;
};

const localPageEnhancements: Record<string, LocalPageEnhancement> = {
  "adelaide-cbd": {
    imageAlt: "Smart lock installed on a managed apartment-style entry near Adelaide CBD",
    planningPoints: [
      "Check with the strata manager, landlord or building manager before changing shared-building entry hardware.",
      "Photograph any fire-door label, door closer and existing intercom so these requirements can be reviewed before a model is suggested.",
      "Confirm lift, loading-zone or contractor access arrangements when the building controls service appointments.",
    ],
    localQuestion: "Can you install a smart lock on an Adelaide CBD apartment door?",
    localAnswer:
      "Often yes, but apartment entry doors may be fire-rated or controlled by strata or building rules. We first check clear photos of the door, labels, closer, frame and existing hardware. Written approval may be required before any modification is booked.",
  },
  glenelg: {
    imageAlt: "Black smart lock fitted to a coastal home entry near Glenelg",
    planningPoints: [
      "Show whether the front door is sheltered from salt air and rain, as exposure affects model selection and maintenance advice.",
      "Measure the gap between the main door and any security screen so the smart lock handle will not clash when both doors close.",
      "For apartments or short-stay properties, confirm any strata or owner approval before changing the existing lock.",
    ],
    localQuestion: "What should Glenelg homeowners check for a coastal smart lock installation?",
    localAnswer:
      "Send photos that show the whole entry, door material, weather exposure and any security screen. We assess clearance and compatibility first, then explain suitable models and practical care for an exposed coastal entry before you book.",
  },
  norwood: {
    imageAlt: "Full-size smart lock installed on a renovated timber entry near Norwood",
    planningPoints: [
      "Photograph decorative plates, old keyholes and previous cut-outs so the finished hardware coverage can be assessed.",
      "Include a side view of mouldings or glass panels near the handle because they can limit the width available for a full-size lock.",
      "For a renovated door, provide the door thickness and backset rather than relying only on its external appearance.",
    ],
    localQuestion: "Can a smart lock be fitted to an older or character-style door in Norwood?",
    localAnswer:
      "Possibly. Older doors often have non-standard holes, mortises or decorative hardware, so the cleanest result depends on what is already there. We review both faces, the door edge and measurements before recommending a compact or full-size option.",
  },
  prospect: {
    imageAlt: "Video smart lock installed on a family home entry near Prospect",
    planningPoints: [
      "Show all existing holes and plates when an older handle is being replaced, especially after a front-door renovation.",
      "For rental access, decide whether you need temporary PINs, app access or simple fingerprint entry before choosing the model.",
      "Check the screen-door gap and frame alignment, as either can affect handle clearance and reliable latching.",
    ],
    localQuestion: "Which smart lock setup works for a Prospect rental property?",
    localAnswer:
      "The best choice depends on who manages access and whether temporary codes or remote control are required. We can assess a supplied package or a compatible lock you already own, then confirm the door fit and setup scope before installation.",
  },
  "mawson-lakes": {
    imageAlt: "Smart lock installed on a modern townhouse entry near Mawson Lakes",
    planningPoints: [
      "Measure the space between the entry door and a nearby security screen before selecting a projecting handle or video lock.",
      "For an investment property, choose how tenants, owners and managers will receive or revoke access before app setup.",
      "Photograph the latch edge and frame even on a newer door because alignment still determines reliable automatic locking.",
    ],
    localQuestion: "Can you install a customer-supplied smart lock in Mawson Lakes?",
    localAnswer:
      "Yes, when the model is complete, functional and compatible with the door. Send the model name plus photos of both door faces, the edge, frame and security-screen gap so we can confirm the likely installation route and price.",
  },
  unley: {
    imageAlt: "Slim smart lock fitted to a detailed residential entry near Unley",
    planningPoints: [
      "Show timber mouldings, glass sidelights and decorative trim near the handle so available mounting space is clear.",
      "Photograph old lock holes and cover plates to check whether the new smart lock can leave a neat visible finish.",
      "If the door is part of a renovation, confirm its final thickness and frame position after painting or joinery work.",
    ],
    localQuestion: "Will a smart lock damage the look of a detailed Unley front door?",
    localAnswer:
      "A clean result depends on the existing cut-outs, trim and space around the handle. We assess photos and measurements before recommending a shape and size, and explain any visible coverage or additional work before booking.",
  },
  modbury: {
    imageAlt: "Keypad smart lock installed on a suburban home entry near Modbury",
    planningPoints: [
      "Include the security screen in your door photos to confirm the new handle will clear it when both doors are shut.",
      "Show the existing latch or mortise and frame strike because worn alignment may need attention before automatic locking is reliable.",
      "If you already bought a lock, send the exact model and all supplied parts so compatibility can be checked before travel is booked.",
    ],
    localQuestion: "How do I choose between a compact and full-size smart lock in Modbury?",
    localAnswer:
      "The existing lock cut-out, door thickness, frame and screen-door clearance usually decide the practical option. A compact lock may suit a simpler replacement, while a full-size mortise model needs more door space and installation work.",
  },
  burnside: {
    imageAlt: "Premium face-recognition smart lock installed on a timber entry near Burnside",
    planningPoints: [
      "Provide close photos of timber grain, decorative hardware and existing holes where the final visible finish is a priority.",
      "Show pull handles, glass panels and nearby trim because premium doors can have limited flat mounting space.",
      "Confirm whether face recognition, video doorbell or simple fingerprint access is the main priority before choosing a larger model.",
    ],
    localQuestion: "How do you protect the finish of a premium timber door in Burnside?",
    localAnswer:
      "We assess the existing hardware coverage, flat mounting area and required cutting before recommending a lock. Photos help us explain the expected visible result and identify when extra door work may be needed before an appointment is accepted.",
  },
  marion: {
    imageAlt: "Fingerprint smart lock installed on a home entry near Marion",
    planningPoints: [
      "For a unit or rental, confirm owner, landlord or strata permission before changing entry hardware.",
      "Photograph the door edge and strike plate to show whether the current latch and frame are aligned.",
      "Include any screen door and its handle in the photo so the required clearance can be measured before model selection.",
    ],
    localQuestion: "Do you install smart locks on units and rental properties around Marion?",
    localAnswer:
      "Yes, subject to door compatibility and any required owner or strata approval. We can provide a supplied package or install a compatible customer-owned lock after reviewing the model, door photos and access requirements.",
  },
  "henley-beach": {
    imageAlt: "Video smart lock fitted to a coastal home entry near Henley Beach",
    planningPoints: [
      "Show whether the lock face is protected by a porch or exposed to coastal weather before selecting a model.",
      "Measure the main-door and security-screen gap to prevent a handle or camera housing from clashing.",
      "Plan occasional cleaning and inspection for an exposed entry, following the selected manufacturer's care guidance.",
    ],
    localQuestion: "Does coastal exposure matter for a Henley Beach smart lock?",
    localAnswer:
      "Yes. Shelter, direct rain, salt air and door material can affect suitability and care. Send a wide photo showing the entry exposure as well as close photos of the door and frame, and we will explain the practical options before booking.",
  },
  "west-lakes": {
    imageAlt: "Full-size smart lock installed on a western Adelaide home near West Lakes",
    planningPoints: [
      "Photograph the full entry to show weather exposure and whether a porch or screen protects the smart lock.",
      "Check the distance to any security screen, pull handle or decorative panel before choosing a full-size model.",
      "For managed or rental properties, decide how access will be issued and removed before the lock is configured.",
    ],
    localQuestion: "What photos do you need for a West Lakes smart lock quote?",
    localAnswer:
      "Send both faces of the door, its edge, the frame, current lock and a wider photo showing weather exposure and any screen door. Include the lock model if you already own one. These details let us assess fit before confirming the scope.",
  },
  paradise: {
    imageAlt: "Smart lock installed on a residential entry near Paradise Adelaide",
    planningPoints: [
      "Show whether the door is timber or aluminium and include the edge profile, as each construction needs a different fit check.",
      "Photograph the frame strike and closed-door alignment if the current lock is difficult to latch or needs pressure to close.",
      "Include a security screen in the measurements so both handles can operate without contact.",
    ],
    localQuestion: "Can you replace an existing digital lock on a Paradise home?",
    localAnswer:
      "Often yes, but the replacement must cover the existing holes and work with the door and frame. Send the current lock model and clear photos of both sides and the door edge so we can check whether a direct replacement or additional work is required.",
  },
};

const steps = [
  ["01", "Send your suburb and door photos", "Include both door faces, the door edge, current lock and frame clearance."],
  ["02", "Choose the service route", "We confirm whether you need a supplied package or installation for a lock you own."],
  ["03", "Confirm scope and price", "Compatibility, location and any non-standard work are explained before booking."],
  ["04", "Install, test and set up", "The lock is fitted and tested, with basic user or app setup where supported."],
] as const;

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ suburb: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { suburb } = await params;
  const area = serviceAreas.find((item) => item.slug === suburb);
  if (!area) return {};

  const detail = localPageDetails[area.slug];
  const enhancement = localPageEnhancements[area.slug];
  const title = `Smart Lock Installation ${area.name} from $200`;
  const description = `Smart lock installation in ${area.name} and nearby suburbs. Installation-only from $200, supplied packages from $699 and free door photo checks.`;
  const image = detail?.image ?? "/img/products/lockin-x9/real-install-02.jpg";

  return {
    title,
    description,
    keywords: [
      `smart lock installation ${area.name}`,
      `smart lock installer ${area.name}`,
      `digital door lock installation ${area.name}`,
      `installation only smart lock ${area.name}`,
      `fingerprint lock installer ${area.name}`,
      "smart lock installation Adelaide",
    ],
    alternates: { canonical: `${siteUrl}/smart-lock-installation/${area.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/smart-lock-installation/${area.slug}`,
      siteName: "ADE Smart Home",
      images: [{
        url: image,
        width: 1200,
        height: 1600,
        alt: enhancement.imageAlt,
      }],
      locale: "en_AU",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function SuburbSmartLockPage({ params }: PageProps) {
  const { suburb } = await params;
  const area = serviceAreas.find((item) => item.slug === suburb);
  if (!area) notFound();

  const detail = localPageDetails[area.slug];
  if (!detail) notFound();
  const enhancement = localPageEnhancements[area.slug];
  if (!enhancement) notFound();

  const pageUrl = `${siteUrl}/smart-lock-installation/${area.slug}`;
  const relatedAreas = detail.relatedSlugs
    .map((slug) => serviceAreas.find((item) => item.slug === slug))
    .filter((item): item is (typeof serviceAreas)[number] => Boolean(item));

  const faqs = [
    {
      question: enhancement.localQuestion,
      answer: enhancement.localAnswer,
    },
    {
      question: `Do you install smart locks in ${area.name}?`,
      answer: `Yes. ADE Smart Home services ${area.name} and nearby areas including ${area.nearby}. Send your postcode so we can confirm appointment availability and any location-dependent cost before booking.`,
    },
    {
      question: "Can you install a smart lock that I already purchased?",
      answer:
        "Yes, if the model is complete, functional and compatible with your door. Standard installation is $200 for a compatible compact lock or $350 for a full-size lock using a standard 6068 mortise.",
    },
    {
      question: "Can you supply the smart lock as well?",
      answer:
        "Yes. Supply-and-install packages start from $699 and include the selected lock and standard Adelaide installation. Warranty and support terms are shown for each model.",
    },
    {
      question: "How do you check whether my door is suitable?",
      answer:
        "Send clear photos of both sides of the door, the door edge, current lock and frame. Door thickness and screen-door clearance are also useful. We review these before confirming the model and scope.",
    },
    {
      question: "Are non-standard door modifications included in the displayed price?",
      answer:
        "Displayed prices cover the stated standard installation. If the door needs extra modification, repair work or unusual hardware, we explain and quote that scope before you book.",
    },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: `Smart Lock Installation in ${area.name}`,
    serviceType: "Smart lock supply and installation",
    url: pageUrl,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: {
      "@type": "Place",
      name: area.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: area.name,
        addressRegion: "SA",
        addressCountry: "AU",
      },
    },
    description: detail.summary,
    offers: [
      {
        "@type": "Offer",
        name: "Compact smart lock standard installation",
        price: "200",
        priceCurrency: "AUD",
        url: `${siteUrl}/smart-lock-installation-only-adelaide`,
        itemOffered: { "@type": "Service", name: `Compact Smart Lock Installation in ${area.name}` },
      },
      {
        "@type": "Offer",
        name: "Full-size smart lock standard 6068 mortise installation",
        price: "350",
        priceCurrency: "AUD",
        url: `${siteUrl}/smart-lock-installation-only-adelaide`,
        itemOffered: { "@type": "Service", name: `Full-Size Smart Lock Installation in ${area.name}` },
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Adelaide Service Areas", item: `${siteUrl}/service-areas` },
      { "@type": "ListItem", position: 3, name: area.name, item: pageUrl },
    ],
  };

  return (
    <main className="bg-white text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative flex min-h-[680px] items-end overflow-hidden bg-black pt-28 text-white md:min-h-[740px] md:items-center">
        <Image
          src={detail.image}
          alt={enhancement.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 md:pb-20 lg:px-12">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-zinc-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/service-areas" className="hover:text-white">Service Areas</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page">{area.name}</span>
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">Adelaide local installation service</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Smart Lock Installation
            <span className="block text-[#d9b98f]">in {area.name}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">{detail.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#quote" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white">
              Send Door Photos <Camera className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(`Hi ADE Smart Home, I need a smart lock quote in ${area.name}.`)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Text {businessInfo.phone}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/25 pt-5 text-xs text-zinc-200">
            {["Installation only from $200", "Supply + install from $699", "Door compatibility checked first"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" /> {item}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-zinc-300">Also near {area.nearby}.</p>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Two service routes</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">Choose what you need in {area.name}</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              You can choose a complete supplied package or ask us to install a compatible smart
              lock bought elsewhere. We confirm the door, model and scope before booking.
            </p>
          </div>
          <div className="mt-12 grid border-y border-slate-200 md:grid-cols-2">
            <article className="py-9 md:py-12 md:pr-10">
              <PackageCheck className="h-8 w-8 text-[#9c7953]" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#8a6b48]">From $699</p>
              <h3 className="mt-3 text-2xl font-black">Smart lock supplied and installed</h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Compare installed-price packages. The displayed package price includes the selected
                lock and standard Adelaide installation, with warranty terms shown by model.
              </p>
              <Link href="/smart-lock-supply-installation-adelaide" className="mt-6 inline-flex items-center gap-2 text-sm font-bold hover:text-[#8a6b48]">
                Compare installed packages <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
            <article className="border-t border-slate-200 py-9 md:border-l md:border-t-0 md:py-12 md:pl-10">
              <Wrench className="h-8 w-8 text-[#9c7953]" strokeWidth={1.6} aria-hidden="true" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#8a6b48]">From $200</p>
              <h3 className="mt-3 text-2xl font-black">Install a lock you already own</h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Compatible compact smart lock installation is $200. Full-size smart lock installation
                with a standard 6068 mortise is $350. The customer supplies the lock.
              </p>
              <Link href="/smart-lock-installation-only-adelaide" className="mt-6 inline-flex items-center gap-2 text-sm font-bold hover:text-[#8a6b48]">
                View installation-only pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1eb] py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-12">
          <div className="relative aspect-[4/5] min-h-[460px] overflow-hidden bg-zinc-200">
            <Image src={detail.image} alt={enhancement.imageAlt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Local door assessment</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">The door decides what will fit</h2>
            <p className="mt-5 text-base leading-7 text-slate-700">{detail.doorFocus}</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{detail.propertyFocus}</p>
            <div className="mt-8 grid gap-px bg-[#d7c6af] sm:grid-cols-2">
              {[
                { icon: DoorOpen, text: "Both faces and the edge of the door" },
                { icon: Camera, text: "Current lock and handle position" },
                { icon: ShieldCheck, text: "Frame and security-screen clearance" },
                { icon: MapPin, text: `Suburb or postcode near ${area.name}` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 bg-[#f5f1eb] p-5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b48]" aria-hidden="true" />
                  <span className="text-sm font-semibold leading-6">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr] md:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Before you book</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Planning an installation in {area.name}</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                A few local property and door details can change the most suitable installation route.
                Include these points with your photos so the first quote is more accurate.
              </p>
            </div>
            <ol className="border-y border-slate-200">
              {enhancement.planningPoints.map((point, index) => (
                <li key={point} className="grid grid-cols-[44px_1fr] gap-4 border-b border-slate-200 py-6 last:border-b-0">
                  <span className="text-sm font-black text-[#9c7953]">0{index + 1}</span>
                  <p className="text-base leading-7 text-slate-700">{point}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b98f]">Simple booking process</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">From photos to installation</h2>
          </div>
          <ol className="mt-12 grid gap-px bg-zinc-800 md:grid-cols-4">
            {steps.map(([number, title, detailText]) => (
              <li key={number} className="bg-black p-6 md:p-8">
                <span className="text-sm font-black text-[#d9b98f]">{number}</span>
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{detailText}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b48]">Nearby coverage</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Around {area.name}</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Nearby areas include {area.nearby}. The links show other common service
                areas; your suburb does not need to be listed to request a compatibility check.
              </p>
              <Link href="/service-areas" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#8a6b48] hover:text-black">
                View all Adelaide service areas <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="border-y border-slate-200">
              {relatedAreas.map((relatedArea) => (
                <Link
                  key={relatedArea.slug}
                  href={`/smart-lock-installation/${relatedArea.slug}`}
                  className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 py-5 last:border-b-0 hover:text-[#8a6b48]"
                >
                  <span>
                    <span className="block font-black">Smart lock installation in {relatedArea.name}</span>
                    <span className="mt-1 block text-sm text-slate-600">Near {relatedArea.nearby}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#9c7953]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black md:text-5xl">{area.name} smart lock FAQ</h2>
          </div>
          <div className="mt-10 border-y border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-slate-200 last:border-b-0">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left font-bold">
                  {faq.question}
                  <span className="text-xl font-normal text-[#8a6b48] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div id="quote" className="scroll-mt-24">
        <ContactForm initialService="not-sure" initialProduct={`Smart lock installation in ${area.name}`} />
      </div>
    </main>
  );
}

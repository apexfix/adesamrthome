import type { Product } from "@/types";

export interface SmartLockBrand {
  slug: "lockin" | "kaadas";
  name: string;
  title: string;
  description: string;
  introduction: string;
  selectionGuidance: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

export const smartLockBrandPages: SmartLockBrand[] = [
  {
    slug: "lockin",
    name: "Lockin",
    title: "Lockin Smart Locks Adelaide",
    description:
      "Compare Lockin smart locks with professional Adelaide installation, door compatibility checks and local support from ADE Smart Home.",
    introduction:
      "ADE Smart Home supplies and installs a practical Lockin range for Adelaide homes, apartments and selected narrow-frame entries. Compare compact fingerprint models, full-size camera locks and premium face-recognition options, then send door photos so we can confirm the right fit.",
    selectionGuidance:
      "The best model depends on the door material, existing cut-outs, available stile width and the access features you actually need. We check these details before booking so the selected lock and mortise suit the door.",
    highlights: [
      "Fingerprint, PIN, app and compatible card access across selected models",
      "Compact, full-size and camera-equipped options",
      "Installed-price packages shown clearly on each product",
      "Free door-photo compatibility assessment before booking",
    ],
    faqs: [
      {
        question: "Which Lockin smart lock is best for my Adelaide home?",
        answer:
          "That depends on your door construction, available mounting space and preferred access methods. Send photos of both door faces, the edge, frame and existing lock for a model recommendation.",
      },
      {
        question: "Does the listed Lockin price include installation?",
        answer:
          "Most Lockin listings show an installed Adelaide package. Where a lock-only option is available, the product page labels the lock-only and installed prices separately.",
      },
      {
        question: "Can Lockin smart locks fit aluminium or narrow-frame doors?",
        answer:
          "Some models may suit compatible narrow frames, but clearance and lock-body requirements vary. ADE Smart Home confirms likely compatibility from door photos before an appointment is booked.",
      },
    ],
  },
  {
    slug: "kaadas",
    name: "Kaadas",
    title: "Kaadas Smart Locks Adelaide",
    description:
      "Explore Kaadas smart locks in Adelaide with lock-only and professional installation options, compatibility checks and local support.",
    introduction:
      "ADE Smart Home supplies and installs selected Kaadas smart locks across Adelaide. The current local range includes the K70 SE, a full-size smart lock designed for households wanting face recognition, fingerprint access and connected entry features in one system.",
    selectionGuidance:
      "Full-size Kaadas models require enough door width and a compatible lock-body installation. Before purchase or booking, we assess the existing lock, door edge, frame clearance and door material from clear photos.",
    highlights: [
      "Premium full-size smart lock options",
      "Multiple keyless entry methods on selected models",
      "Lock-only and supplied-installation pricing shown separately",
      "Adelaide door compatibility assessment and local installation",
    ],
    faqs: [
      {
        question: "Can ADE Smart Home install Kaadas smart locks in Adelaide?",
        answer:
          "Yes. We install compatible Kaadas smart locks across the Adelaide metropolitan area after checking the door and installation requirements.",
      },
      {
        question: "Can I buy a Kaadas lock without installation?",
        answer:
          "Where a lock-only price is shown, you can choose the lock by itself. The product page also shows the complete standard Adelaide installation package separately.",
      },
      {
        question: "What photos are needed for a Kaadas compatibility check?",
        answer:
          "Send the outside and inside of the door, the door edge with the current lock visible, the frame and any nearby handle or glass clearance.",
      },
    ],
  },
];

export function getSmartLockBrand(slug: string) {
  return smartLockBrandPages.find((brand) => brand.slug === slug);
}

export function getSmartLockBrandUrl(name: string) {
  const brand = smartLockBrandPages.find(
    (candidate) => candidate.name.toLowerCase() === name.toLowerCase(),
  );

  return brand ? `/brands/${brand.slug}` : null;
}

export function isProductFromBrand(product: Product, brandName: string) {
  const normalizedBrand = brandName.toLowerCase();
  const values = [
    product.name,
    product.sku,
    ...(product.brands || []).flatMap((item) => [item.name, item.slug]),
    ...(product.categories || []).flatMap((item) => [item.name, item.slug]),
    ...(product.tags || []).flatMap((item) => [item.name, item.slug]),
    ...(product.attributes || []).flatMap((attribute) => [
      attribute.name,
      ...(attribute.options || []),
      ...(attribute.terms || []).flatMap((term) => [term.name, term.slug]),
    ]),
  ];

  return values.some((value) => value?.toLowerCase().includes(normalizedBrand));
}

export const siteUrl = "https://www.adesmarthome.com.au";

export const deliveryAndReturnsUrl = `${siteUrl}/delivery-and-returns`;

export const businessInfo = {
  name: "ADE Smart Home",
  phone: "0431060390",
  /** Human-readable phone, used for visible text. */
  phoneDisplay: "0431 060 390",
  phoneInternational: "+61431060390",
  email: "info@adesmarthome.com.au",
  addressLocality: "Adelaide",
  addressRegion: "SA",
  // TODO(owner): only fill this in if it matches the address verified on your Google Business Profile.
  postalCode: "",
  country: "AU",
  // TODO(owner): street address is not published yet. Add it here if you want it shown and in the schema.
  streetAddress: "",
};

// Text and email only: the business does not take phone calls, so there is deliberately no tel: link.
export const smsHref = (body?: string) =>
  `sms:${businessInfo.phoneInternational}${body ? `?body=${encodeURIComponent(body)}` : ""}`;
export const mailHref = (subject?: string) =>
  `mailto:${businessInfo.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

/**
 * Opening hours — edit here and every page, the footer and the JSON-LD schema update together.
 * `days` uses schema.org day names; `opens`/`closes` are 24-hour HH:MM.
 */
export const BUSINESS_HOURS = {
  label: "Mon–Sat 8am–6pm",
  labelZh: "周一至周六 早 8 点到晚 6 点",
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  opens: "08:00",
  closes: "18:00",
};

/** TODO(owner): fill in your 11-digit ABN, e.g. "12 345 678 901". It stays hidden on the site while empty. */
export const BUSINESS_ABN = "";

/**
 * The person customers meet. Reviews on Google name him, so the site does too.
 * TODO(owner): fill the empty fields; each one stays hidden on /about while empty.
 */
export const INSTALLER = {
  name: "John",
  role: "Smart lock installer",
  /** Path under /public, e.g. "/img/about/john.jpg". */
  photo: "",
  /** e.g. "8 years fitting locks and door hardware in Adelaide". */
  experience: "",
  /** e.g. "SA licence no. ..." — only if one applies to your work. */
  licence: "",
  /** e.g. "$10M public liability insurance". */
  insurance: "",
};

export const SERVICE_AREA_LABEL = "Adelaide metro";
export const SERVICE_AREA_LABEL_ZH = "阿德莱德市区及周边";

export const WARRANTY_SUMMARY =
  "12-month workmanship warranty on every installation. Products are covered by the manufacturer’s warranty.";
export const WARRANTY_SUMMARY_ZH = "安装工艺保修 12 个月；锁具本身按厂家保修。";

/** Supply + install package price shown in the hero and schema. */
export const PACKAGE_FROM_PRICE = 599;
export const INSTALL_ONLY_PRICES = { compact: 200, mortise: 350 };

/** Google Business Profile share link; used for the review section and the schema's hasMap/sameAs. */
export const GOOGLE_BUSINESS_URL = "https://g.page/r/Cak2vtUI0QLfEBM";
export const GOOGLE_REVIEW_URL = `${GOOGLE_BUSINESS_URL}/review`;

export const socialProfiles = [
  "https://www.facebook.com/profile.php?id=61571291020457",
  "https://www.instagram.com/adesmarthome/",
  "https://www.tiktok.com/@adesmarthome",
  "https://www.xiaohongshu.com/user/profile/5dc514ea0000000001005c66",
];

export const siteLastModified = "2026-11-07";

export const serviceAreas = [
  {
    slug: "adelaide-cbd",
    name: "Adelaide CBD",
    nearby: "North Adelaide, Kent Town, Mile End and Parkside",
    description:
      "apartment entries, timber front doors, office doors and rental properties around central Adelaide.",
  },
  {
    slug: "glenelg",
    name: "Glenelg",
    nearby: "Brighton, Somerton Park, Plympton and Henley Beach",
    description:
      "coastal homes, apartments, timber doors and selected aluminium doors near the beachside suburbs.",
  },
  {
    slug: "norwood",
    name: "Norwood",
    nearby: "Kent Town, Stepney, Maylands and Payneham",
    description:
      "character homes, renovated houses, apartments and shopfront-style doors in Adelaide’s eastern suburbs.",
  },
  {
    slug: "prospect",
    name: "Prospect",
    nearby: "Kilburn, Nailsworth, Blair Athol and Croydon Park",
    description:
      "family homes, rental properties and upgraded front entry doors in Adelaide’s inner north.",
  },
  {
    slug: "mawson-lakes",
    name: "Mawson Lakes",
    nearby: "Parafield Gardens, Pooraka, Salisbury and Ingle Farm",
    description:
      "modern homes, townhouses and investment properties requiring reliable smart lock access control.",
  },
  {
    slug: "unley",
    name: "Unley",
    nearby: "Hyde Park, Parkside, Malvern and Goodwood",
    description:
      "premium residential doors, heritage-style homes and clean flush-finish smart lock upgrades.",
  },
  {
    slug: "modbury",
    name: "Modbury",
    nearby: "Tea Tree Gully, Ridgehaven, Hope Valley and Para Vista",
    description:
      "suburban homes, family properties and practical smart lock upgrades across the north-east.",
  },
  {
    slug: "burnside",
    name: "Burnside",
    nearby: "Toorak Gardens, Tusmore, Kensington Park and St Peters",
    description:
      "premium homes, timber entry doors and neat smart lock installations with careful finishing.",
  },
  {
    slug: "marion",
    name: "Marion",
    nearby: "Oaklands Park, Mitchell Park, Warradale and Edwardstown",
    description:
      "homes, units and rental properties requiring fingerprint, keypad and app-controlled smart locks.",
  },
  {
    slug: "henley-beach",
    name: "Henley Beach",
    nearby: "Grange, Fulham, West Beach and Findon",
    description:
      "coastal properties where smart locks need clean installation and reliable local after-sales support.",
  },
  {
    slug: "west-lakes",
    name: "West Lakes",
    nearby: "Semaphore Park, Tennyson, Seaton and Grange",
    description:
      "family homes, townhouses and waterfront properties requiring secure smart lock upgrades.",
  },
  {
    slug: "paradise",
    name: "Paradise",
    nearby: "Campbelltown, Athelstone, Newton and Dernancourt",
    description:
      "residential homes and rental properties needing professional smart lock installation and setup.",
  },
];

export const smartLockBrands = [
  "Lockin",
  "Philips",
  "EZVIZ",
  "Samsung",
  "Aqara",
  "Eufy",
  "Yale",
  "Kaadas",
  "Dessmann",
  "imported smart locks",
];

export const coreServices = [
  "Smart lock supply and installation",
  "Customer-supplied smart lock installation",
  "Smart lock installation",
  "Digital door lock installation",
  "Fingerprint lock installation",
  "Video smart lock installation",
  "Keypad lock installation",
  "Door compatibility check",
];

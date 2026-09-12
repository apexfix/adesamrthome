import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import {
  Calendar,
  Camera,
  ChevronRight,
  MessageSquareText,
  Ruler,
  ShieldCheck,
  Tag,
  Zap,
} from "lucide-react";
import { ProductGallery } from "@/components/ProductGallery";
import { InstallationPhotoStrip } from "@/components/InstallationPhotoStrip";
import StoryCarousel from "@/components/StoryCarousel"; // 导入案例轮播
import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { localProducts } from "@/lib/localProducts";
import {
  businessInfo,
  siteUrl,
} from "@/lib/seoData";
import type { Product, ProductAttribute, ProductImage } from "@/types";
import { getSmartLockBrandUrl } from "@/lib/brandData";
import { isSecurityCameraKit } from "@/lib/productType";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 定义 Story 类型接口
interface Story {
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  suburb: string;
  date: string;
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getPrice(product: Product) {
  const minorUnit = product.prices?.currency_minor_unit || 2;
  const divider = Math.pow(10, minorUnit);
  const current = (parseInt(product.prices?.price || "0", 10) / divider).toFixed(0);
  const regular = (
    parseInt(product.prices?.regular_price || product.prices?.price || "0", 10) /
    divider
  ).toFixed(0);

  return { current, regular, isOnSale: regular !== current };
}

function getOptionalPrice(product: Product, value?: string) {
  if (!value) {
    return null;
  }

  const minorUnit = product.prices?.currency_minor_unit || 2;
  return (parseInt(value, 10) / Math.pow(10, minorUnit)).toFixed(0);
}

function getProductBrand(product: Product) {
  const brandAttribute = product.attributes?.find(
    (attribute) => attribute.name.toLowerCase() === "brand"
  );
  const attributeBrand = brandAttribute ? getAttributeValues(brandAttribute)[0] : undefined;

  return attributeBrand || product.brands?.[0]?.name || product.name.split(" ")[0];
}

export function generateStaticParams() {
  return localProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found", robots: { index: false, follow: false } };
  }

  const { current } = getPrice(product);
  const isService = product.kind === "service";
  const isCameraKit = isSecurityCameraKit(product);
  const priceIncludesInstallation = product.price_includes_installation !== false;
  const url = `${siteUrl}/products/${product.slug}`;
  const image = product.images?.[0]?.src
    ? new URL(product.images[0].src, siteUrl).toString()
    : `${siteUrl}/img/og/ade-smart-home-adelaide.jpg`;
  const priceMessage = isService
    ? `from A$${current} for compatible customer-supplied smart locks across Adelaide`
    : isCameraKit
      ? `A$${current} equipment package with two 5MP cameras and a four-channel PoE recorder`
    : priceIncludesInstallation
      ? `from $${current} with standard Adelaide installation included`
      : `from $${current} lock only, with an Adelaide installation package available`;
  const description = isService
    ? "Smart lock installation-only service across Adelaide. A$200 for compact locks and A$350 for standard 6068 mortise locks. Customer supplies the lock."
    : isCameraKit
      ? `${product.name} for A$${current}. Two Dahua 5MP cameras and one four-channel PoE NVR for Adelaide homes and small businesses.`
    : `${product.name} ${priceMessage}. ${stripHtml(product.short_description || "")} Free door compatibility check.`.slice(0, 158);
  const seoTitle = isService
    ? "Smart Lock Installation Prices Adelaide"
    : isCameraKit
      ? "Dahua 5MP 2-Camera Security Kit Adelaide"
    : `${product.name} Adelaide`;

  return {
    title: seoTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description,
      url,
      siteName: "ADE Smart Home",
      images: [{ url: image, alt: product.name }],
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [image],
    },
  };
}

function getAttributeValues(attribute: ProductAttribute) {
  if (Array.isArray(attribute.options)) {
    return attribute.options;
  }

  if (Array.isArray(attribute.terms)) {
    return attribute.terms.map((term) => term.name || term.slug).filter(Boolean) as string[];
  }

  return [];
}

const installationPhotosBySlug: Record<string, { src: string; alt: string }[]> = {
  "lockin-ola-slim-smart-lock": [
    {
      src: "/img/products/lockin-ola-slim/real-install-gate.jpg",
      alt: "Lockin OLA Slim installed on a grey slatted entry gate, full gate view",
    },
    {
      src: "/img/products/lockin-ola-slim/real-install-edge.jpg",
      alt: "Lockin OLA Slim installation close-up showing the lock panels and gate-edge mortise",
    },
  ],
  "lockin-s50m-pro-smart-lock": [
    {
      src: "/img/products/lockin-s50m-pro/real-install-01.jpg",
      alt: "Lockin smart lock installed on black glass entry door in Adelaide",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-02.jpg",
      alt: "Close-up of Lockin smart lock keypad and camera after installation",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-03.jpg",
      alt: "Close-up view of Lockin smart lock camera module on black door",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-04.jpg",
      alt: "Lockin smart lock installed on white front door with sidelights",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-05.jpg",
      alt: "Lockin smart lock product front and interior panel",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-06.jpg",
      alt: "Lockin smart lock installed beside stainless pull handle",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-07.jpg",
      alt: "Real installation close-up of Lockin keypad smart lock",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-08.jpg",
      alt: "Lockin smart lock installed on timber entry door",
    },
  ],
  "lockin-v5-max-smart-lock": Array.from({ length: 6 }, (_, index) => ({
    src: `/img/products/lockin-v5-max/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `Lockin V5 Max smart lock Adelaide installation view ${index + 1}`,
  })),
  "lockin-sv40-smart-lock": Array.from({ length: 6 }, (_, index) => ({
    src: `/img/products/lockin-sv40/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `Lockin SV40 smart lock Adelaide installation view ${index + 1}`,
  })),
  "lockin-s6-max-smart-lock": Array.from({ length: 4 }, (_, index) => ({
    src: `/img/products/lockin-s6-max/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `Lockin S6 Max smart lock Adelaide installation view ${index + 1}`,
  })),
  "lockin-x9-smart-lock": Array.from({ length: 6 }, (_, index) => ({
    src: `/img/products/lockin-x9/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `Lockin X9 smart lock Adelaide installation view ${index + 1}`,
  })),
  "smart-lock-installation-only-service": [
    {
      src: "/img/products/lockin-x9/real-install-03.jpg",
      alt: "Smart lock installation completed on an Adelaide home entry door",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-01.jpg",
      alt: "Full-size smart lock professionally fitted to an Adelaide entry door",
    },
    {
      src: "/img/products/lockin-ola-slim/real-install-edge.jpg",
      alt: "Compact smart lock and small mortise installed on a narrow-frame gate",
    },
    {
      src: "/img/products/lockin-s6-max/real-install-02.jpg",
      alt: "Customer smart lock professionally installed in Adelaide",
    },
  ],
};

const replacementWarrantySlugs = new Set([
  "lockin-x9-smart-lock",
  "lockin-s6-max-smart-lock",
  "lockin-v5-max-smart-lock",
]);

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error("Failed to fetch product", error);
  }

  if (!product) {
    notFound();
  }

  // 1. 价格计算逻辑
  const { current: currentPrice, regular: regularPrice, isOnSale } = getPrice(product);
  const currencySymbol = product.prices?.currency_symbol || "$";
  const installedPrice = getOptionalPrice(product, product.installed_price);
  const isService = product.kind === "service";
  const isCameraKit = isSecurityCameraKit(product);
  const serviceOptions = product.service_options || [];
  const hasSeparateInstallationPrice =
    product.price_includes_installation === false && installedPrice !== null;
  const hasReplacementWarranty = replacementWarrantySlugs.has(product.slug);
  const brandName = getProductBrand(product);
  const brandPath = isService || isCameraKit ? null : getSmartLockBrandUrl(brandName);
  const brandUrl = brandPath ? `${siteUrl}${brandPath}` : undefined;
  
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ src: "/placeholder.jpg", alt: product.name }];
  const detailImages = product.detail_images || [];
  const installationPhotos = installationPhotosBySlug[slug] || [];
  const productUrl = `${siteUrl}/products/${product.slug}`;
  const productDescription = stripHtml(
    product.short_description || product.description || ""
  );
  const productImages = Array.from(
    new Set(
      [...galleryImages, ...installationPhotos, ...detailImages].map((image: ProductImage) =>
        new URL(image.src, siteUrl).toString(),
      ),
    ),
  );
  const encodedProductName = encodeURIComponent(product.name);
  const quotePrefill = encodeURIComponent(
    `Hi ADE Smart Home, I would like a quote for ${product.name} in Adelaide.`
  );
  const emailPrefill = encodeURIComponent(
    isCameraKit
      ? `Hi ADE Smart Home,\nI am interested in the ${product.name}.\nSuburb:\nPlease contact me with availability.`
      : `Hi ADE Smart Home,\nI need help with smart lock installation and would like a quote.\nProduct: ${product.name}\nSuburb:\nPhotos: attached`
  );

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: productDescription,
    sku: product.sku,
    model: product.name,
    brand: { "@type": "Brand", name: brandName, url: brandUrl },
    category: isCameraKit ? "Video Surveillance System" : "Smart Lock",
    image: productImages,
    mainEntityOfPage: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.prices?.currency_code || "AUD",
      price: currentPrice,
      availability: isCameraKit
        ? "https://schema.org/InStock"
        : "https://schema.org/LimitedAvailability",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${siteUrl}/#business` },
      areaServed: {
        "@type": "City",
        name: businessInfo.addressLocality,
      },
    },
    additionalProperty: isCameraKit
      ? [
          { "@type": "PropertyValue", name: "Camera quantity", value: "2" },
          { "@type": "PropertyValue", name: "Camera resolution", value: "5MP" },
          { "@type": "PropertyValue", name: "Recorder channels", value: "4" },
        ]
      : [
          {
            "@type": "PropertyValue",
            name: "Standard Adelaide installation",
            value: hasSeparateInstallationPrice
              ? `A$${installedPrice} total package after door compatibility confirmation`
              : "Included",
          },
          {
            "@type": "PropertyValue",
            name: "Door compatibility check",
            value: "Free before booking",
          },
        ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${productUrl}#service`,
    name: product.name,
    description: productDescription,
    url: productUrl,
    image: productImages,
    serviceType: "Customer-supplied smart lock installation",
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Adelaide metropolitan area",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Smart lock installation options",
      itemListElement: serviceOptions.map((option) => ({
        "@type": "Offer",
        priceCurrency: product.prices?.currency_code || "AUD",
        price: getOptionalPrice(product, option.price),
        url: productUrl,
        itemOffered: {
          "@type": "Service",
          name: option.name,
          description: option.description,
        },
      })),
    },
  };

  const structuredData = isService ? serviceSchema : productSchema;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: isService
          ? "Installation Services"
          : isCameraKit
            ? "Security Camera Kits"
            : "Smart Locks",
        item: `${siteUrl}/products`,
      },
      ...(!isService && brandUrl
        ? [{
            "@type": "ListItem",
            position: 3,
            name: `${brandName} Smart Locks`,
            item: brandUrl,
          }]
        : []),
      {
        "@type": "ListItem",
        position: !isService && brandUrl ? 4 : 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  // 2. 【新增】获取关联的安装案例
  const postsDirectory = path.join(process.cwd(), "content/posts");
  let relatedStories: Story[] = [];
  let hasBrandSpecificStories = false;

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    const allStories = filenames
      .filter((fn) => fn.endsWith(".md"))
      .map((filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);
        return {
          slug: filename.replace(".md", ""),
          title: data.title || "Untitled Project",
          coverImage: data.coverImage || "",
          category: data.category || "Installation",
          suburb: data.suburb || "Adelaide",
          date: data.date || ""
        } as Story;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const brandNameLower = brandName.toLowerCase();
    const modelName = product.name
      .toLowerCase()
      .replace(brandNameLower, "")
      .replace("smart lock", "")
      .trim();
    const brandStories = allStories
      .filter((story) => story.title.toLowerCase().includes(brandNameLower))
      .sort((a, b) => {
        const aMatchesModel = a.title.toLowerCase().includes(modelName);
        const bMatchesModel = b.title.toLowerCase().includes(modelName);

        if (aMatchesModel !== bMatchesModel) {
          return aMatchesModel ? -1 : 1;
        }

        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    if (!isCameraKit) {
      hasBrandSpecificStories = brandStories.length > 0;
      relatedStories = (hasBrandSpecificStories ? brandStories : allStories).slice(0, 4);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 pt-28 text-white md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        
        {/* 面包屑导航 */}
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-white transition-colors">
            {isService ? "Services" : "Collection"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          {!isService && brandPath && (
            <>
              <Link href={brandPath} className="hover:text-white transition-colors">
                {brandName}
              </Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="text-[#c5a47e]">{product.name}</span>
        </nav>

        <div className="mb-24 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* 左侧：图片展示 */}
          <div className="relative order-2 lg:order-1">
            <ProductGallery images={galleryImages} square={detailImages.length > 0} />
            {isOnSale && (
              <div className="absolute right-5 top-5 z-20 bg-red-700 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white">
                Special Offer
              </div>
            )}
          </div>

          {/* 右侧：产品信息 */}
          <div className="order-1 flex flex-col lg:order-2">
            <div className="mb-10">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
                {product.categories?.[0]?.name || "Premium Smart Security"}
              </p>
              <h1 className="mb-8 text-4xl font-black leading-tight md:text-5xl">
                {product.name}
              </h1>
              
              {isService ? (
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {serviceOptions.map((option, index) => (
                    <div
                      key={option.name}
                      className={`border p-5 ${
                        index === 0
                          ? "border-zinc-700 bg-zinc-900/50"
                          : "border-[#c5a47e]/60 bg-[#c5a47e]/5"
                      }`}
                    >
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">
                        {option.name}
                      </p>
                      <p className="text-4xl font-black text-[#c5a47e]">
                        {currencySymbol}{getOptionalPrice(product, option.price)}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-400">
                        {option.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : isCameraKit ? (
                <div className="mb-8 border-l-2 border-[#c5a47e] pl-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#c5a47e]">
                    Two-camera equipment package
                  </p>
                  <p className="text-5xl font-black text-[#c5a47e]">
                    {currencySymbol}{currentPrice}
                  </p>
                </div>
              ) : hasSeparateInstallationPrice ? (
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="border-l-2 border-zinc-700 pl-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                      Lock only
                    </p>
                    <p className="text-4xl font-black text-white">
                      {currencySymbol}{currentPrice}
                    </p>
                  </div>
                  <div className="border-l-2 border-[#c5a47e] pl-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#c5a47e]">
                      Lock + standard Adelaide installation
                    </p>
                    <p className="text-4xl font-black text-[#c5a47e]">
                      {currencySymbol}{installedPrice}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-5xl font-black text-[#c5a47e]">
                    {currencySymbol}{currentPrice}
                  </span>
                  {isOnSale && (
                    <span className="text-xl text-zinc-600 line-through decoration-zinc-700 font-medium">
                      {currencySymbol}{regularPrice}
                    </span>
                  )}
                  <span className="ml-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                    Standard Adelaide Install Included
                  </span>
                </div>
              )}

              <div className="mb-10 h-px w-full bg-zinc-800" />

              <div 
                className="prose prose-invert prose-zinc max-w-none text-zinc-400 font-light leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: product.short_description || "" }} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="liquid-glass-soft flex items-center gap-4 rounded-md border p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#c5a47e]/10">
                  <ShieldCheck className="w-6 h-6 text-[#c5a47e]" />
                </div>
                <div>
                  <p className="font-bold text-sm">
                    {isService
                      ? "Free Compatibility Check"
                      : isCameraKit
                        ? "Two 5MP Cameras"
                      : hasReplacementWarranty
                        ? "2-Year Warranty"
                        : "Local Product Support"}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                    {isService
                      ? "Before Booking"
                      : isCameraKit
                        ? "Clear day and night monitoring"
                      : hasReplacementWarranty
                        ? "Covered lock faults replaced"
                        : "Terms confirmed before booking"}
                  </p>
                </div>
              </div>
              <div className="liquid-glass-soft flex items-center gap-4 rounded-md border p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#c5a47e]/10">
                  <Zap className="w-6 h-6 text-[#c5a47e]" />
                </div>
                <div>
                  <p className="font-bold text-sm">
                    {isService
                      ? "Adelaide-Wide Service"
                      : isCameraKit
                        ? "4-Channel PoE NVR"
                        : "Expert Install"}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                    {isCameraKit ? "Room for two more cameras" : "Adelaide Local Team"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-zinc-400 sm:col-span-2">
                {isService
                  ? "Installation only; the customer supplies the smart lock. Standard prices apply after compatibility confirmation. Extra parts, repairs and non-standard work are quoted before booking."
                  : isCameraKit
                    ? "The A$443 package contains two DH-IPC-HDW2541EMP-AS-ANZ 5MP cameras and one DHI-NVR4104HS-P-4KS2/L four-channel PoE recorder. This exact package is currently in stock."
                  : hasSeparateInstallationPrice
                    ? `Choose ${currencySymbol}${currentPrice} lock only or ${currencySymbol}${installedPrice} with standard Adelaide installation. Door compatibility is confirmed before booking; non-standard work is quoted first if required.`
                    : hasReplacementWarranty
                      ? "Listed price includes the lock, standard Adelaide installation and a 2-year local warranty. Covered lock faults are replaced under the stated warranty terms after assessment."
                      : "Listed price includes the lock and standard Adelaide installation. Product support and warranty terms are confirmed before booking."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="mb-2 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-500">
                <div className="h-2 w-2 bg-emerald-500" />
                {isService
                  ? "Send photos before booking"
                  : isCameraKit
                    ? "In stock now"
                    : "Ask for current availability"}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href={`/contact?service=${isService ? "installation-only" : isCameraKit ? "security-camera-kit" : "supply-install"}&product=${encodedProductName}`}
                  className="h-16 bg-[#c5a47e] text-black hover:bg-[#e8d0a9] rounded-sm font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  {isService
                    ? "Request Installation Quote"
                    : isCameraKit
                      ? "Enquire About This Kit"
                      : "Check Price & Availability"}
                </Link>
                {!isCameraKit && <Link
                  href="/blog/smart-lock-door-compatibility-check"
                  className="h-16 bg-transparent text-white border-2 border-zinc-800 hover:border-[#c5a47e] rounded-sm font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all"
                >
                  <Ruler className="w-5 h-5" />
                  Check Door Fit
                </Link>}
                <a
                  href={`sms:${businessInfo.phoneInternational}?body=${quotePrefill}`}
                  className="liquid-glass-soft flex h-16 items-center justify-center gap-3 rounded-sm border border-zinc-800 text-sm font-black uppercase tracking-widest text-white transition-colors hover:border-[#c5a47e]"
                >
                  <MessageSquareText className="w-5 h-5" />
                  Text Quote
                </a>
                <a
                  href={`mailto:${businessInfo.email}?subject=${isCameraKit ? "Dahua%20Camera%20Kit%20Enquiry" : "Door%20Photos%20for%20Install"}&body=${emailPrefill}`}
                  className="h-16 bg-transparent text-white border border-zinc-800 rounded-sm font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:border-[#c5a47e] transition-all"
                >
                  <Camera className="w-5 h-5" />
                  {isCameraKit ? "Email Enquiry" : "Send Door Photos"}
                </a>
                {!isService && !isCameraKit && (
                  <Link
                    href={`/contact?service=installation-only&product=${encodedProductName}`}
                    className="h-16 bg-transparent text-[#d9b98f] border border-zinc-700 rounded-sm font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all col-span-1 sm:col-span-2"
                  >
                    <Tag className="w-5 h-5" />
                    Installation-only for my lock
                  </Link>
                )}
              </div>
              {!isService && !isCameraKit && (
                <p className="text-xs leading-6 text-zinc-500">
                  Supplied installation packages are brought to the confirmed Adelaide appointment;
                  we do not offer separate postal shipping. See our{" "}
                  <Link
                    href="/delivery-and-returns"
                    className="font-semibold text-zinc-300 underline underline-offset-4 hover:text-[#c5a47e]"
                  >
                    delivery and returns information
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 详细描述区 */}
        <div className="grid grid-cols-1 gap-14 border-t border-zinc-800 pt-20 lg:grid-cols-3 lg:gap-20">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              {isService ? "Service" : "Technical"}{" "}
              <span className="text-[#c5a47e]">{isService ? "Details" : "Specs"}</span>
            </h2>
            {product.attributes && (
              <dl className="space-y-6">
                {product.attributes.map((attr, index) => {
                  const values = getAttributeValues(attr);

                  if (values.length === 0) {
                    return null;
                  }

                  return (
                    <div key={`${attr.name}-${attr.id || index}`} className="border-b border-zinc-900 pb-4">
                      <dt className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{attr.name}</dt>
                      <dd className="text-white font-medium">{values.join(", ")}</dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-8">
              {isService ? "How It" : "Product"}{" "}
              <span className="text-[#c5a47e]">{isService ? "Works" : "Story"}</span>
            </h2>
            <div 
              className="prose prose-invert prose-zinc max-w-none text-base leading-8 text-zinc-400 prose-headings:text-white prose-img:rounded-md prose-img:border prose-img:border-zinc-800"
              dangerouslySetInnerHTML={{ __html: product.description || "" }} 
            />
          </div>
        </div>

        {detailImages.length > 0 && (
          <section className="mt-24 border-t border-zinc-900 pt-20">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
                Product details
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Explore the <span className="text-[#c5a47e]">{product.name}</span>
              </h2>
            </div>
            <div className="mx-auto max-w-5xl overflow-hidden bg-black">
              {detailImages.map((image, index) => (
                <Image
                  key={image.id || image.src}
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 1920}
                  height={image.height || 1920}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  loading={index < 2 ? "eager" : "lazy"}
                  className="h-auto w-full"
                />
              ))}
            </div>
          </section>
        )}

        <InstallationPhotoStrip photos={installationPhotos} />

        {/* 【新增】：关联安装案例区域 */}
        {relatedStories.length > 0 && (
          <div className="mt-24 border-t border-zinc-800 pt-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Installation <span className="text-[#c5a47e]">Gallery</span>
                </h2>
                <p className="text-zinc-500 font-light leading-relaxed">
                  {hasBrandSpecificStories
                    ? `Real results from Adelaide homes. See how ${brandName} looks when professionally installed by our team.`
                    : "See recent Adelaide smart-lock installation work. Exact models and door compatibility vary by property."}
                </p>
              </div>
              <Link 
                href="/blog" 
                className="group flex items-center gap-2 text-[#c5a47e] font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity"
              >
                View All Stories <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <StoryCarousel stories={relatedStories} />
          </div>
        )}

      </div>
    </main>
  );
}

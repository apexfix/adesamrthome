import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seoData";
import type { Product } from "@/types";
import { TrackingCTAs } from "@/components/cta/TrackingCTAs";

export const metadata: Metadata = {
  title: "Smart Locks with Adelaide Installation",
  description:
    "Compare Lockin and Kaadas smart locks for Adelaide homes. View fingerprint, finger-vein, face recognition and camera models with lock-only and installed options.",
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    title: "Smart Locks with Adelaide Installation",
    description:
      "Compare Lockin and Kaadas smart locks and request a free Adelaide door compatibility check.",
    url: `${siteUrl}/products`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/hero1.avif", width: 1200, height: 630 }],
    locale: "en_AU",
    type: "website",
  },
};

const SMART_LOCK_CHILD_CATEGORIES = new Set([
  "smartlock",
  "smartlocks",
  "smartlockwithcamera",
  "lockin",
  "philips",
  "ezviz",
  "samsung",
  "dessmann",
  "aqara",
  "kaadas",
  "eufy",
  "yale",
]);

const SMART_LOCK_BRANDS = ["Lockin", "Kaadas", "Philips", "EZVIZ", "Samsung", "Dessmann"];

function normalizeCategory(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function productMatchesCategory(product: Product, categoryParam: string) {
  const requested = normalizeCategory(categoryParam);
  const categories = product.categories || [];

  return categories.some((cat) => {
    const categoryName = normalizeCategory(cat.name || "");
    const categorySlug = normalizeCategory(cat.slug || "");

    if (categoryName === requested || categorySlug === requested) {
      return true;
    }

    if (requested === "smartlock" || requested === "smartlocks") {
      return (
        SMART_LOCK_CHILD_CATEGORIES.has(categoryName) ||
        SMART_LOCK_CHILD_CATEGORIES.has(categorySlug)
      );
    }

    return false;
  });
}

function productMatchesBrand(product: Product, brandParam: string) {
  const requested = normalizeCategory(brandParam);
  const searchableValues = [
    ...(product.tags || []).map((tag) => tag.name || tag.slug || ""),
    ...(product.brands || []).map((brand) => brand.name || brand.slug || ""),
    ...(product.categories || []).map((cat) => cat.name || cat.slug || ""),
    product.name || "",
    product.sku || "",
  ];

  return searchableValues.some((value) => normalizeCategory(value).includes(requested));
}

function getPageTitle(categoryParam: string | null, brandParam: string | null) {
  if (brandParam) {
    return `${brandParam} Smart Locks`;
  }

  const normalized = categoryParam ? normalizeCategory(categoryParam) : "";

  if (normalized === "smartlock" || normalized === "smartlocks") {
    return "Smart Locks";
  }

  if (normalized === "lockin") {
    return "Lockin Smart Locks";
  }

  if (normalized === "kaadas") {
    return "Kaadas Smart Locks";
  }

  return categoryParam || "All Products";
}

export default async function ProductsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 兼容 Next.js 最新版本的异步参数读取逻辑
  const params = props.searchParams ? await props.searchParams : {};
  const categoryParam = typeof params.category === 'string' ? params.category : null;
  const brandParam = typeof params.brand === 'string' ? params.brand : null;

  const allProducts: Product[] = await getProducts(1, 50);

  const categoryProducts = categoryParam
    ? allProducts.filter((product) => productMatchesCategory(product, categoryParam))
    : allProducts;

  const displayedProducts = brandParam
    ? categoryProducts.filter((product) => productMatchesBrand(product, brandParam))
    : categoryProducts;

  const pageTitle = getPageTitle(categoryParam, brandParam);
  const isSmartLocksPage =
    categoryParam !== null &&
    ["smartlock", "smartlocks"].includes(normalizeCategory(categoryParam));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/products#collection`,
    url: `${siteUrl}/products`,
    name: "Smart Locks with Adelaide Installation",
    description:
      "Smart locks supplied with standard Adelaide installation and a free door compatibility check.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allProducts.length,
      itemListElement: allProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/products/${product.slug}`,
        name: product.name,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Smart Locks",
        item: `${siteUrl}/products`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 md:px-6">
        
        {/* 页面标题区域 */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase">
            {pageTitle}
          </h1>
          <div className="h-1 w-20 bg-[#c5a47e] rounded-full" />
          {categoryParam && (
             <p className="mt-6 text-zinc-400 max-w-2xl mx-auto">
               Showing all available products in the {pageTitle} category.
             </p>
          )}
          {isSmartLocksPage && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products?category=SMART+LOCK"
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  !brandParam
                    ? "border-[#c5a47e] bg-[#c5a47e] text-black"
                    : "border-zinc-800 text-zinc-400 hover:border-[#c5a47e] hover:text-white"
                }`}
              >
                All Brands
              </Link>
              {SMART_LOCK_BRANDS.map((brand) => (
                <Link
                  key={brand}
                  href={`/products?category=SMART+LOCK&brand=${encodeURIComponent(brand)}`}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    brandParam && normalizeCategory(brandParam) === normalizeCategory(brand)
                      ? "border-[#c5a47e] bg-[#c5a47e] text-black"
                      : "border-zinc-800 text-zinc-400 hover:border-[#c5a47e] hover:text-white"
                  }`}
                >
                  {brand}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 border-y border-zinc-800 px-5 py-4 text-sm text-zinc-300">
            Already have a smart lock?{" "}
            <Link
              href="/smart-lock-installation-only-adelaide"
              className="font-semibold text-[#c5a47e] hover:text-white"
            >
              Request an installation-only quote
            </Link>
            .
          </div>

          <TrackingCTAs context="products" />
        </div>

        {/* 产品网格展示 */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-zinc-500 border border-zinc-900 rounded-md bg-zinc-900/50 max-w-3xl mx-auto">
            <p className="text-xl">No products found in this category.</p>
            <p className="text-sm mt-2">Try another category or contact us for current availability.</p>
          </div>
        )}
        
      </div>
    </div>
  );
}

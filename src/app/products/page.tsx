import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seoData";
import type { Product } from "@/types";
import { TrackingCTAs } from "@/components/cta/TrackingCTAs";
import { notFound } from "next/navigation";

const baseMetadata: Metadata = {
  title: "Smart Locks & Security Camera Kits Adelaide",
  description:
    "Shop smart locks with Adelaide installation and Dahua security camera kits from ADE Smart Home.",
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    title: "Smart Locks & Security Camera Kits Adelaide",
    description:
      "Compare smart locks, installation-only services and Dahua security camera equipment packages in Adelaide.",
    url: `${siteUrl}/products`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/og/ade-smart-home-adelaide.jpg", width: 1200, height: 630, alt: "Smart locks available with Adelaide installation" }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Locks & Security Camera Kits Adelaide",
    description:
      "Compare smart locks, installation-only services and Dahua security camera equipment packages in Adelaide.",
    images: ["/img/og/ade-smart-home-adelaide.jpg"],
  },
};

export async function generateMetadata(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = props.searchParams ? await props.searchParams : {};
  const categoryParam = typeof params.category === "string" ? params.category : null;
  const brandParam = typeof params.brand === "string" ? params.brand : null;
  const hasFilters = categoryParam !== null || brandParam !== null;

  if (hasFilters) {
    const allProducts = await getProducts(1, 50);
    const matchingCategory = categoryParam
      ? allProducts.filter((product) => productMatchesCategory(product, categoryParam))
      : allProducts;
    const matchingProducts = brandParam
      ? matchingCategory.filter((product) => productMatchesBrand(product, brandParam))
      : matchingCategory;

    if (matchingProducts.length === 0) {
      return {
        title: "Product Filter Not Found",
        description: "The requested smart lock product filter is not available.",
        robots: { index: false, follow: false },
      };
    }
  }

  return {
    ...baseMetadata,
    robots: hasFilters ? { index: false, follow: true } : undefined,
  };
}

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

const SMART_LOCK_BRANDS = [
  { name: "Lockin", href: "/brands/lockin" },
  { name: "Kaadas", href: "/brands/kaadas" },
];

const PRODUCT_CATEGORIES = [
  { name: "Smart Locks", href: "/products?category=smart-lock" },
  { name: "Security Camera Kits", href: "/products/security-camera-kits" },
];

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

  if (normalized === "securitycamerakits") {
    return "Security Camera Kits";
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

  if ((categoryParam || brandParam) && displayedProducts.length === 0) {
    notFound();
  }

  const pageTitle = getPageTitle(categoryParam, brandParam);
  const isAllProductsPage = categoryParam === null && brandParam === null;
  const normalizedCategory = categoryParam ? normalizeCategory(categoryParam) : "";
  const isSmartLocksPage =
    brandParam !== null || SMART_LOCK_CHILD_CATEGORIES.has(normalizedCategory);
  const isCameraKitsPage =
    categoryParam !== null && normalizeCategory(categoryParam) === "securitycamerakits";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/products#collection`,
    url: `${siteUrl}/products`,
    name: "Smart Locks and Security Camera Kits Adelaide",
    description:
      "Smart locks, installation-only service and security camera equipment packages from ADE Smart Home in Adelaide.",
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
        name: "Products",
        item: `${siteUrl}/products`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black pt-32 pb-24">
      {!categoryParam && !brandParam && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        
        {/* 页面标题区域 */}
        <div className="mb-14 border-b border-zinc-800 pb-12">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">Adelaide smart security</p>
          <h1 className="mb-5 mt-3 text-4xl font-extrabold text-white md:text-6xl">
            {pageTitle}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Link
              href="/products"
              aria-current={!categoryParam && !brandParam ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
                !categoryParam && !brandParam
                  ? "border-[#c5a47e] bg-[#c5a47e] text-black"
                  : "glass-control text-zinc-200 hover:text-white"
              }`}
            >
              All Products
            </Link>
            {PRODUCT_CATEGORIES.map((category) => {
              const isActive =
                category.name === "Smart Locks" &&
                ["smartlock", "smartlocks"].includes(normalizedCategory);

              return (
                <Link
                  key={category.name}
                  href={category.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-[#c5a47e] bg-[#c5a47e] text-black"
                      : "glass-control text-zinc-200 hover:text-white"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
          {categoryParam && (
               <p className="mt-6 max-w-2xl text-zinc-400">
               Showing all available products in the {pageTitle} category.
             </p>
          )}
          {isAllProductsPage && (
            <p className="mt-7 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
              Browse smart locks, installation-only service and security camera
              equipment packages available from ADE Smart Home in Adelaide.
            </p>
          )}
          {isSmartLocksPage && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {SMART_LOCK_BRANDS.map((brand) => (
                <Link
                  key={brand.name}
                  href={brand.href}
                  className="glass-control inline-flex min-h-11 items-center rounded-md border px-4 py-2 text-sm font-semibold text-zinc-200 hover:text-white"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          )}
          {isSmartLocksPage && <div className="mt-10 w-full max-w-2xl border-y border-zinc-800 py-5 text-base leading-7 text-zinc-300">
            Already have a smart lock?{" "}
            <Link
              href="/smart-lock-installation-only-adelaide"
              className="font-semibold text-[#c5a47e] hover:text-white"
            >
              Request an installation-only quote
            </Link>
            .
          </div>}

          {isSmartLocksPage && !isCameraKitsPage && <TrackingCTAs context="products" />}
        </div>

        {/* 产品网格展示 */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    </main>
  );
}

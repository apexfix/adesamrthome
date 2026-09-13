import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { RevealGroup } from "@/components/RevealGroup";
import { CatalogueInstallation } from "@/components/CatalogueInstallation";
import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seoData";
import { TrackingCTAs } from "@/components/cta/TrackingCTAs";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronDown, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { catalogueHref, groupCatalogue, selectCatalogue, type CatalogueParams } from "@/lib/catalogue";

interface ProductsPageProps { searchParams?: Promise<CatalogueParams> }

const baseMetadata: Metadata = {
  title: "Smart Locks & Security Camera Kits Adelaide",
  description: "Shop smart locks with Adelaide installation and Dahua security camera kits from ADE Smart Home.",
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    title: "Smart Locks & Security Camera Kits Adelaide",
    description: "Compare smart locks, installation-only services and Dahua security camera equipment packages in Adelaide.",
    url: `${siteUrl}/products`, siteName: "ADE Smart Home",
    images: [{ url: "/img/og/ade-smart-home-adelaide.jpg", width: 1200, height: 630, alt: "Smart locks available with Adelaide installation" }],
    locale: "en_AU", type: "website",
  },
  twitter: {
    card: "summary_large_image", title: "Smart Locks & Security Camera Kits Adelaide",
    description: "Compare smart locks, installation-only services and Dahua security camera equipment packages in Adelaide.",
    images: ["/img/og/ade-smart-home-adelaide.jpg"],
  },
};

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};
  const selection = selectCatalogue(await getProducts(1, 50), params);
  if (!selection.valid) return {
    title: "Product Filter Not Found", description: "The requested product filter is not available.",
    robots: { index: false, follow: false },
  };
  return selection.filtered ? {
    ...baseMetadata,
    title: `${selection.title} Adelaide`, robots: { index: false, follow: true },
  } : baseMetadata;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = searchParams ? await searchParams : {};
  const allProducts = await getProducts(1, 50);
  const selection = selectCatalogue(allProducts, params);
  if (!selection.valid) notFound();
  const { category, brand, brands, groups, products, title, filtered } = selection;
  const categories = groupCatalogue(allProducts).filter(group => group.products.length > 0);
  const isSmartLocksPage = category?.slug === "smart-lock" ||
    (filtered && products.length > 0 && groups.find(group => group.id === "smart-lock")?.products.length === products.length);

  const collectionSchema = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    "@id": `${siteUrl}/products#collection`, url: `${siteUrl}/products`,
    name: "Smart Locks and Security Camera Kits Adelaide",
    description: "Smart locks, installation-only service and security camera equipment packages from ADE Smart Home in Adelaide.",
    mainEntity: {
      "@type": "ItemList", numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem", position: index + 1, url: `${siteUrl}/products/${product.slug}`, name: product.name,
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
    ],
  };

  return (
    <main className="min-h-screen bg-black pt-32 pb-24">
      {!filtered && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-white">Home</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          {!filtered ? <span aria-current="page">Products</span> : <><Link href="/products" className="inline-flex min-h-11 items-center hover:text-white">Products</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page" className="text-[#d9b98f]">{title}</span></>}
        </nav>
        <header className="mb-8 border-b border-zinc-800 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">Adelaide smart security</p>
          <h1 className="mb-5 mt-3 break-words text-4xl font-extrabold text-white md:text-5xl">{title}</h1>
          {!filtered && <p className="max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">Smart locks, installation-only services and CCTV kits in Adelaide.</p>}
          <nav aria-label="Product categories" className="mt-6 flex flex-wrap gap-2">
            <Link href="/products" aria-current={!filtered ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-md border px-4 py-2 text-sm font-semibold ${!filtered ? "border-[#c5a47e] bg-[#c5a47e] text-black" : "glass-control text-zinc-200 hover:text-white"}`}>All Products</Link>
            {categories.map(item => <Link key={item.id} href={catalogueHref(item.id, brand?.slug)} aria-current={category?.slug === item.id ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-md border px-4 py-2 text-sm font-semibold ${category?.slug === item.id ? "border-[#c5a47e] bg-[#c5a47e] text-black" : "glass-control text-zinc-200 hover:text-white"}`}>{item.name}</Link>)}
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <form action="/products" method="get" className="flex max-w-full flex-wrap items-end gap-3" aria-label="Filter by brand">
              {category && <input type="hidden" name="category" value={category.slug} />}
              <div className="min-w-0 max-w-full">
                <label htmlFor="catalogue-brand" className="mb-2 block text-sm font-semibold text-zinc-300">Brand</label>
                <div className="relative">
                <select key={brand?.slug || "all"} id="catalogue-brand" name="brand" defaultValue={brand?.slug || ""} className="min-h-11 w-52 max-w-full appearance-none rounded-md border border-zinc-700 bg-zinc-950 py-2 pl-3 pr-10 text-base text-white [color-scheme:dark]">
                  <option value="">All brands</option>
                  {brands.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-300" aria-hidden="true" />
                </div>
              </div>
              <button type="submit" className="glass-control inline-flex min-h-11 items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold text-white"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Apply</button>
              {filtered && <Link href="/products" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f]"><X className="h-4 w-4" aria-hidden="true" />Clear filters</Link>}
            </form>
            <p data-catalogue-count className="pb-2 text-sm text-zinc-300">{products.length} {products.length === 1 ? "result" : "results"}</p>
          </div>
          {isSmartLocksPage && <div className="mt-6 text-base leading-7 text-zinc-300">Already have a smart lock? <Link href="/smart-lock-installation-only-adelaide" className="font-semibold text-[#c5a47e] hover:text-white">Request an installation-only quote</Link>.</div>}
          {isSmartLocksPage && <TrackingCTAs context="products" />}
        </header>

        {products.length ? groups.filter(group => group.products.length > 0).map(group => (
          <section key={group.id} data-catalogue-section={group.id} aria-labelledby={`catalogue-${group.id}`} className="mb-12 last:mb-0">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 id={`catalogue-${group.id}`} className="text-2xl font-bold text-white">{group.name}</h2>
              <span className="text-sm text-zinc-400">{group.products.length} {group.id === "installation-service" ? "service" : group.products.length === 1 ? "product" : "products"}</span>
            </div>
            {group.id === "installation-service" ? group.products.map(product => <CatalogueInstallation key={product.id} product={product} />) : <RevealGroup className={group.id === "security-camera-kits" ? "grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2" : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
              {group.products.map(product => <ProductCard key={product.id} product={product} prefetch={false} />)}
            </RevealGroup>}
          </section>
        )) : (
          <section aria-labelledby="catalogue-empty-title" className="max-w-3xl py-10">
            <h2 id="catalogue-empty-title" className="text-2xl font-bold text-white">{filtered ? "No matching products" : "Catalogue unavailable"}</h2>
            <p className="mt-3 text-base leading-7 text-zinc-400">{filtered ? "No listings match this category and brand combination." : "There are no listings to display right now. Please contact us for product availability."}</p>
            <div className="mt-5 flex flex-wrap gap-5">
              {filtered && <Link href="/products" className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#d9b98f]"><X className="h-4 w-4" aria-hidden="true" />Clear all filters</Link>}
              <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#d9b98f]">Ask about availability <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </section>
        )}
        <nav aria-label="Product guides" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-800 pt-6 text-sm text-[#d9b98f]">
          <Link prefetch={false} href="/brands/lockin" className="inline-flex min-h-11 items-center underline underline-offset-4">Lockin range</Link>
          <Link prefetch={false} href="/brands/kaadas" className="inline-flex min-h-11 items-center underline underline-offset-4">Kaadas range</Link>
          <Link prefetch={false} href="/products/security-camera-kits" className="inline-flex min-h-11 items-center underline underline-offset-4">Compare camera kits</Link>
        </nav>
      </div>
    </main>
  );
}

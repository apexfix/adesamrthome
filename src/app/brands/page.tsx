import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, ShieldCheck } from "lucide-react";
import { getProducts } from "@/lib/api";
import { isProductFromBrand, smartLockBrandPages } from "@/lib/brandData";
import { siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Smart Lock Brands Adelaide",
  description:
    "Compare Lockin and Kaadas smart locks available with professional Adelaide installation and a free door compatibility check.",
  alternates: { canonical: `${siteUrl}/brands` },
  openGraph: {
    title: "Smart Lock Brands Adelaide | ADE Smart Home",
    description:
      "Compare the Lockin and Kaadas ranges available with professional smart lock installation across Adelaide.",
    url: `${siteUrl}/brands`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/hero1.avif", width: 1200, height: 630, alt: "Smart lock brands installed in Adelaide" }],
    locale: "en_AU",
    type: "website",
  },
};

export default async function BrandsPage() {
  const products = await getProducts(1, 100);
  const brands = smartLockBrandPages.map((brand) => ({
    ...brand,
    products: products.filter((product) => isProductFromBrand(product, brand.name)),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/brands#collection`,
    url: `${siteUrl}/brands`,
    name: "Smart Lock Brands Adelaide",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: brands.map((brand, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${brand.name} Smart Locks Adelaide`,
        url: `${siteUrl}/brands/${brand.slug}`,
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Smart Lock Brands", item: `${siteUrl}/brands` },
    ],
  };

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 pt-32 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link> / Brands
        </nav>
        <header className="max-w-4xl py-14 md:py-20">
          <p className="text-xs font-bold uppercase text-[#d9b98f]">ADE Smart Home</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">Smart Lock Brands in Adelaide</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Compare the smart lock ranges we currently supply, then request a free door-photo assessment before choosing a model or installation package.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {brands.map((brand) => {
            const image = brand.products[0]?.images?.[0];
            return (
              <article key={brand.slug} className="overflow-hidden rounded-md border border-zinc-800 bg-black">
                {image && (
                  <div className="relative aspect-[16/10] bg-white">
                    <Image src={image.src} alt={image.alt} fill className="object-contain p-5" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                )}
                <div className="p-7 md:p-9">
                  <p className="text-xs font-bold uppercase text-[#d9b98f]">{brand.products.length} current {brand.products.length === 1 ? "model" : "models"}</p>
                  <h2 className="mt-3 text-3xl font-black">{brand.name} Smart Locks</h2>
                  <p className="mt-4 leading-7 text-zinc-400">{brand.introduction}</p>
                  <Link href={`/brands/${brand.slug}`} className="mt-7 inline-flex items-center gap-2 font-bold text-[#d9b98f] hover:text-white">
                    Compare {brand.name} models <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-16 grid gap-8 border-y border-zinc-800 py-10 md:grid-cols-2">
          <div className="flex gap-4"><Camera className="h-6 w-6 shrink-0 text-[#d9b98f]" /><div><h2 className="text-xl font-bold">Check the door first</h2><p className="mt-2 leading-7 text-zinc-400">Door photos let us assess likely fit, clearances and installation scope before you commit to a model.</p></div></div>
          <div className="flex gap-4"><ShieldCheck className="h-6 w-6 shrink-0 text-[#d9b98f]" /><div><h2 className="text-xl font-bold">Need installation only?</h2><p className="mt-2 leading-7 text-zinc-400">Already bought another brand? We also install compatible customer-supplied smart locks across Adelaide.</p><Link href="/smart-lock-installation-only-adelaide" className="mt-3 inline-block font-bold text-[#d9b98f] hover:text-white">View installation-only pricing</Link></div></div>
        </section>
      </div>
    </main>
  );
}

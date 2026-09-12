import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Camera, Check, ChevronDown, ChevronRight, MessageSquareText } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { getSmartLockBrand, isProductFromBrand, smartLockBrandPages } from "@/lib/brandData";
import { businessInfo, siteUrl } from "@/lib/seoData";

interface BrandPageProps { params: Promise<{ brand: string }> }

export function generateStaticParams() {
  return smartLockBrandPages.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = getSmartLockBrand(slug);
  if (!brand) return { title: "Brand Not Found", robots: { index: false, follow: false } };

  const url = `${siteUrl}/brands/${brand.slug}`;
  const featuredProduct = (await getProducts(1, 100)).find(product => isProductFromBrand(product, brand.name));
  const image = featuredProduct?.images?.[0];
  const shareImage = image?.src || "/img/og/ade-smart-home-adelaide.jpg";
  return {
    title: brand.title,
    description: brand.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${brand.title} | ADE Smart Home`,
      description: brand.description,
      url,
      siteName: "ADE Smart Home",
      images: [{ url: shareImage, width: image?.width, height: image?.height, alt: image?.alt || `${brand.name} smart locks in Adelaide` }],
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: brand.title,
      description: brand.description,
      images: [shareImage],
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand: slug } = await params;
  const brand = getSmartLockBrand(slug);
  if (!brand) notFound();

  const products = (await getProducts(1, 100)).filter((product) =>
    isProductFromBrand(product, brand.name),
  );
  const pageUrl = `${siteUrl}/brands/${brand.slug}`;
  const singleProduct = products.length === 1 ? products[0] : null;
  const packageDivider = 10 ** (singleProduct?.prices?.currency_minor_unit ?? 2);
  const lockOnlyPrice = singleProduct?.prices?.price ? Number(singleProduct.prices.price) / packageDivider : null;
  const installedPrice = singleProduct?.installed_price ? Number(singleProduct.installed_price) / packageDivider : null;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Smart Lock Brands", item: `${siteUrl}/brands` },
      { "@type": "ListItem", position: 3, name: `${brand.name} Smart Locks`, item: pageUrl },
    ],
  };
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: brand.title,
    description: brand.description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: `${siteUrl}/products/${product.slug}` })),
    },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: brand.faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 pt-32 text-white">
      {[breadcrumb, collection, faq].map((data, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />)}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link><ChevronRight className="h-3 w-3" />
          <Link href="/brands" className="hover:text-white">Brands</Link><ChevronRight className="h-3 w-3" />
          <span className="text-[#d9b98f]">{brand.name}</span>
        </nav>
        <header className="max-w-4xl py-10 md:py-14">
          <p className="text-xs font-bold uppercase text-[#d9b98f]">Supplied and installed in Adelaide</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">{brand.title}</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">{brand.introduction}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact?service=supply-install&product=${encodeURIComponent(`${brand.name} smart lock (model to confirm)`)}`} className="inline-flex min-h-12 items-center gap-2 bg-[#d9b98f] px-5 font-bold text-black hover:bg-white"><Camera className="h-4 w-4" aria-hidden="true" /> Send Door Photos</Link>
            <a href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(`Hi ADE Smart Home, I would like help choosing a ${brand.name} smart lock.`)}`} className="inline-flex min-h-12 items-center gap-2 border border-zinc-700 px-5 font-bold hover:border-[#d9b98f] hover:text-[#d9b98f]"><MessageSquareText className="h-4 w-4" /> Text {businessInfo.phone}</a>
          </div>
        </header>

        <section aria-labelledby="models-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-zinc-800 pb-5">
            <div><p className="text-xs font-bold uppercase text-[#d9b98f]">Current range</p><h2 id="models-heading" className="mt-2 text-3xl font-black">{singleProduct ? `${brand.name} Smart Lock` : `Compare ${brand.name} Models`}</h2></div>
            <p className="text-sm text-zinc-400">{products.length} {products.length === 1 ? "model" : "models"} listed</p>
          </div>
          <div className={singleProduct ? "grid items-start gap-10 lg:grid-cols-2 lg:gap-16" : "grid gap-7 sm:grid-cols-2 lg:grid-cols-3"}>
            {products.map((product,index) => <ProductCard key={product.id} product={product} priority={index === 0} imageSizes={singleProduct ? "(max-width: 1023px) 100vw, 580px" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 390px"} />)}
            {singleProduct && lockOnlyPrice !== null && installedPrice !== null && (
              <div className="py-3 lg:py-8">
                <h3 className="text-2xl font-bold">Choose your package</h3>
                <p className="mt-4 text-base leading-7 text-zinc-400">{singleProduct.name}. Choose the lock by itself or include standard Adelaide installation.</p>
                <dl className="mt-6 divide-y divide-zinc-800 border-y border-zinc-800">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 py-5"><dt className="font-semibold">Lock only</dt><dd className="text-3xl font-bold text-[#d9b98f]">A${lockOnlyPrice.toLocaleString("en-AU")}</dd></div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3 py-5"><dt className="font-semibold">With standard installation</dt><dd className="text-3xl font-bold text-[#d9b98f]">A${installedPrice.toLocaleString("en-AU")}</dd></div>
                </dl>
                <p className="mt-5 text-base leading-7 text-zinc-400">We confirm door compatibility and the installation scope before booking. Any non-standard work is quoted first.</p>
                <Link href={`/contact?service=supply-install&product=${encodeURIComponent(singleProduct.name)}`} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#d9b98f] px-5 text-sm font-bold text-black">Ask about this model <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                <p className="mt-6 text-base leading-7 text-zinc-400">Already own a compatible lock? <Link href="/smart-lock-installation-only-adelaide" className="text-[#d9b98f] underline underline-offset-4">See installation-only prices</Link>.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-20 grid gap-10 border-y border-zinc-800 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div><h2 className="text-3xl font-black">Choosing the Right {brand.name} Lock</h2><p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300">{brand.selectionGuidance}</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3"><Link href="/blog/smart-lock-door-compatibility-check" className="font-bold text-[#d9b98f] hover:text-white">See the door compatibility photo guide</Link>{brand.slug === "lockin" && <Link href="/blog/lockin-x9-vs-s6-max-vs-v5-max-adelaide" className="font-bold text-[#d9b98f] hover:text-white">Compare X9, S6 Max and V5 Max</Link>}</div></div>
          <ul className="space-y-4">{brand.highlights.map((item) => <li key={item} className="flex gap-3 text-zinc-300"><Check className="mt-1 h-5 w-5 shrink-0 text-[#d9b98f]" /><span>{item}</span></li>)}</ul>
        </section>

        <section className="mt-16 max-w-4xl"><p className="text-xs font-bold uppercase text-[#d9b98f]">Common questions</p><h2 className="mt-3 text-3xl font-black">{brand.name} Smart Lock FAQ</h2><div className="mt-8 divide-y divide-zinc-800 border-y border-zinc-800">{brand.faqs.map((item) => <details key={item.question} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold"><span>{item.question}</span><ChevronDown className="h-5 w-5 shrink-0 text-[#d9b98f] transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="mt-3 leading-7 text-zinc-400">{item.answer}</p></details>)}</div></section>
      </div>
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Camera, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { GalleryResults } from "@/components/GalleryResults";
import { siteUrl } from "@/lib/seoData";
import { installationProjects as projects } from "@/lib/installationProjects";
import { selectGallery, type GalleryParams } from "@/lib/galleryFilters";

interface GalleryPageProps { searchParams?: Promise<GalleryParams> }

export async function generateMetadata({ searchParams }: GalleryPageProps): Promise<Metadata> {
  const selection = selectGallery(projects, searchParams ? await searchParams : {});
  if (!selection.valid) return { title: "Gallery Filter Not Found", robots: { index: false, follow: false } };
  return selection.filtered ? {
    title: `${selection.model || "Smart Lock"} Installation Gallery${selection.suburb ? ` - ${selection.suburb}` : ""}`,
    robots: { index: false, follow: true },
    alternates: { canonical: `${siteUrl}/gallery` },
  } : {};
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const selection = selectGallery(projects, searchParams ? await searchParams : {});
  if (!selection.valid) notFound();
  const { model, suburb, models, suburbs, results, filtered } = selection;
  const gallerySchema = {
    "@context": "https://schema.org", "@type": "ImageGallery",
    "@id": `${siteUrl}/gallery#gallery`, name: "Adelaide Smart Lock Installation Gallery",
    url: `${siteUrl}/gallery`, inLanguage: "en-AU",
    primaryImageOfPage: results[0]?.image ? `${siteUrl}${results[0].image}` : undefined,
    associatedMedia: results.map((project, index) => ({
      "@type": "ImageObject", name: project.title, caption: project.description,
      contentUrl: `${siteUrl}${project.image}`, representativeOfPage: index === 0,
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Installation Gallery", item: `${siteUrl}/gallery` },
    ],
  };
  return (
    <main className="min-h-screen bg-zinc-950 pb-16 pt-28 md:pb-24 md:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-white">Home</Link>
          <span className="inline-flex min-h-11 items-center" aria-hidden="true">/</span>
          <span className="inline-flex min-h-11 items-center" aria-current="page">Installation gallery</span>
        </nav>
        <header className="border-b border-zinc-800 pb-6 md:pb-8">
          <p className="text-sm font-semibold text-[#c5a47e]">Real Adelaide work</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">Smart lock installation gallery</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">Real Adelaide installations. Compare models below, or book installation-only for a compatible lock you already own.</p>
          <Link href="/smart-lock-installation-only-adelaide" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f]">Installation-only options <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </header>

        <div className="flex flex-wrap items-end justify-between gap-4 py-5 md:py-7">
          <form key={JSON.stringify([model, suburb])} action="/gallery" method="get" aria-label="Filter installation gallery" className="flex max-w-full flex-wrap items-end gap-3">
            <label className="grid max-w-full gap-2 text-sm font-semibold text-zinc-300">
              Lock model
              <span className="relative block max-w-full">
                <select name="model" defaultValue={model || ""} className="min-h-12 w-full min-w-[min(10rem,100%)] max-w-full appearance-none rounded-md border border-zinc-600 bg-zinc-900 py-2 pl-3 pr-10 text-base text-white [color-scheme:dark]">
                  <option value="">All models</option>
                  {models.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4" aria-hidden="true" />
              </span>
            </label>
            {(suburbs.length > 1 || suburb) && <label className="grid max-w-full gap-2 text-sm font-semibold text-zinc-300">
              Area
              <span className="relative block max-w-full">
                <select name="suburb" defaultValue={suburb || ""} className="min-h-12 w-full min-w-[min(10rem,100%)] max-w-full appearance-none rounded-md border border-zinc-600 bg-zinc-900 py-2 pl-3 pr-10 text-base text-white [color-scheme:dark]">
                  <option value="">All areas</option>
                  {suburbs.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4" aria-hidden="true" />
              </span>
            </label>}
            <button type="submit" className="glass-control inline-flex min-h-12 items-center gap-2 rounded-md border px-4 text-sm font-semibold text-white"><SlidersHorizontal size={18} aria-hidden="true" />Apply</button>
            {filtered && <Link prefetch={false} href="/gallery" className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-semibold text-[#d9b98f]"><X size={18} aria-hidden="true" />Clear filters</Link>}
          </form>
          <p role="status" data-gallery-count className="text-sm text-zinc-400">{results.length} {results.length === 1 ? "installation" : "installations"}{filtered && <span> / {projects.length} total</span>}</p>
        </div>

        {results.length > 0 ? <GalleryResults key={JSON.stringify([model, suburb])} projects={results} /> : (
          <section className="border-y border-zinc-800 py-10" aria-labelledby="gallery-empty">
            <h2 id="gallery-empty" className="text-2xl font-bold text-white">{filtered ? "No matching installations" : "Installation photos unavailable"}</h2>
            <p className="mt-3 text-base leading-7 text-zinc-400">{filtered ? "No published photos match these filters." : "Contact us about your lock and door requirements."}</p>
            <Link href={filtered ? "/gallery" : "/contact#quote"} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f]">{filtered ? "Clear all filters" : "Ask about installation"}<ArrowRight size={18} aria-hidden="true" /></Link>
          </section>
        )}

        <section className="mt-12 grid gap-8 border-y border-zinc-800 py-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">Will it fit your door?</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">Every door needs its own compatibility check. Send photos of the outside, inside, door edge and frame so we can check the existing hardware and available clearance before booking.</p>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Link href="/contact#quote" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#c5a47e] px-4 py-3 text-sm font-bold text-black hover:bg-white"><Camera className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Send door photos</span></Link>
            <Link href="/blog/smart-lock-door-compatibility-check" className="inline-flex min-h-12 items-center justify-center gap-3 px-4 text-sm font-semibold text-[#d9b98f]"><span>Door compatibility guide</span><ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
          </div>
        </section>
      </div>
    </main>
  );
}

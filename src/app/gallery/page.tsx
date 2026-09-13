"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MapPin, X, ZoomIn } from "lucide-react";
import { siteUrl } from "@/lib/seoData";
import { installationProjects as projects } from "@/lib/installationProjects";

const categories = ["All", ...new Set(projects.map(project => project.category))];
const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "@id": `${siteUrl}/gallery#gallery`,
  name: "Adelaide Smart Lock Installation Gallery",
  url: `${siteUrl}/gallery`,
  inLanguage: "en-AU",
  primaryImageOfPage: `${siteUrl}${projects[0].image}`,
  associatedMedia: projects.map(project => ({
    "@type": "ImageObject",
    name: project.title,
    caption: project.description,
    contentUrl: `${siteUrl}${project.image}`,
    representativeOfPage: project.id === 1,
  })),
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Installation Gallery", item: `${siteUrl}/gallery` },
  ],
};

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photoTriggerRef = useRef<HTMLButtonElement | null>(null);
  const filteredProjects = filter === "All" ? projects : projects.filter(project => project.category === filter);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selectedProject || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  return (
    <main className="min-h-screen bg-zinc-950 pb-16 pt-28 md:pb-24 md:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Installation gallery</span>
        </nav>
        <header className="border-b border-zinc-800 pb-6 md:pb-8">
          <p className="text-sm font-semibold text-[#c5a47e]">Real Adelaide work</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">Smart lock installation gallery</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">Real Adelaide installations. Compare models below, or book installation-only for a compatible lock you already own.</p>
          <Link href="/smart-lock-installation-only-adelaide" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f]">
            Installation-only options <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        <div className="flex flex-wrap items-end justify-between gap-4 py-5 md:py-7">
          <label className="flex flex-wrap items-center gap-3 text-sm font-semibold text-zinc-300">
            Lock model
            <select value={filter} onChange={event => setFilter(event.target.value)} className="min-h-12 min-w-40 rounded-md border border-zinc-600 bg-zinc-900 px-3 text-base text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a47e]">
              {categories.map(category => <option key={category} value={category}>{category === "All" ? "All models" : category}</option>)}
            </select>
          </label>
          <p role="status" className="text-sm text-zinc-400"><span>{filteredProjects.length} {filteredProjects.length === 1 ? "installation" : "installations"}</span></p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <article key={project.id} className="liquid-glass-soft flex min-w-0 flex-col overflow-hidden rounded-md border">
              <button type="button" onClick={event => { photoTriggerRef.current = event.currentTarget; setSelectedProject(project); }} aria-label={`View full photo: ${project.title}`} className="group relative block aspect-[4/5] w-full overflow-hidden bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#c5a47e]">
                <Image src={project.image} alt={`${project.title}: ${project.description}`} fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 46vw, 460px" className="object-contain" loading={index === 0 ? "eager" : "lazy"} />
                <span title="View full photo" className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-md border border-white/30 bg-black/75 text-white group-hover:bg-black"><ZoomIn className="h-5 w-5" aria-hidden="true" /></span>
              </button>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="flex items-center gap-2 text-sm text-[#c5a47e]"><MapPin className="h-4 w-4" aria-hidden="true" /> <span>{project.suburb}, SA</span></p>
                <h2 className="mt-3 text-xl font-bold leading-7 text-white">{project.title}</h2>
                <p className="mt-3 text-base leading-7 text-zinc-400">{project.description}</p>
                <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-5">
                  <Link href={`/products/${project.productSlug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f]">View {project.category}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                  <Link href={`/contact?service=supply-install&product=${encodeURIComponent(`Lockin ${project.category}`)}#quote`} className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-zinc-600 underline-offset-4">Ask about this model</Link>
                </div>
              </div>
            </article>
          ))}
        </div>

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

      <dialog ref={dialogRef} onClose={() => { setSelectedProject(null); photoTriggerRef.current?.focus({ preventScroll: true }); }} aria-labelledby="installation-photo-title" className="fixed inset-0 m-auto max-h-[94dvh] w-[calc(100%-24px)] max-w-5xl overflow-auto rounded-md border border-zinc-700 bg-zinc-950 p-4 text-white shadow-2xl backdrop:bg-black/85 md:p-6">
        {selectedProject && <>
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id="installation-photo-title" className="text-lg font-semibold md:text-xl">{selectedProject.title}</h2>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close photo" title="Close photo" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-zinc-600 hover:bg-zinc-800"><X className="h-5 w-5" aria-hidden="true" /></button>
          </div>
          <div className="relative h-[62dvh] w-full"><Image src={selectedProject.image} alt={selectedProject.description} fill sizes="(max-width: 1024px) 90vw, 980px" className="object-contain" /></div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">{selectedProject.description}</p>
        </>}
      </dialog>
    </main>
  );
}

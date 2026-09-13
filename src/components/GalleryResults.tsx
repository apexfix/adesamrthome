"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, ZoomIn } from "lucide-react";
import { GalleryImage } from "@/components/GalleryImage";
import { ImageLightbox } from "@/components/ImageLightbox";
import { RevealGroup } from "@/components/RevealGroup";
import type { InstallationProject } from "@/lib/installationProjects";

export function GalleryResults({ projects }: { projects: InstallationProject[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  return <>
    <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project, index) => (
        <article key={project.id} data-gallery-project className="liquid-glass-soft motion-card flex min-w-0 flex-col overflow-hidden rounded-md border">
          <a href={project.image} onClick={event => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            event.currentTarget.focus({ preventScroll: true });
            setSelectedIndex(index);
          }} aria-label={`View full photo: ${project.title}`} className="group relative block aspect-[4/5] w-full overflow-hidden bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#c5a47e]">
            <GalleryImage key={project.image} photo={{ src: project.image, alt: `${project.title}: ${project.description}` }} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 46vw, 460px" className="object-contain" eager={index === 0} />
            <span title="View full photo" className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-md border border-white/30 bg-black/75 text-white group-hover:bg-black"><ZoomIn className="h-5 w-5" aria-hidden="true" /></span>
          </a>
          <div data-glass-highlight className="flex flex-1 flex-col p-5 md:p-6">
            {project.suburb && <p className="flex items-center gap-2 text-sm text-[#c5a47e]"><MapPin className="h-4 w-4 shrink-0" aria-hidden="true" /> <span className="[overflow-wrap:anywhere]">{project.suburb}, SA</span></p>}
            <h2 className="mt-3 text-xl font-bold leading-7 text-white [overflow-wrap:anywhere]">{project.title}</h2>
            <p className="mt-3 text-base leading-7 text-zinc-400 [overflow-wrap:anywhere]">{project.description}</p>
            <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-5">
              <Link prefetch={false} href={`/products/${project.productSlug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f]">View {project.category}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
              <Link prefetch={false} href={`/contact?service=supply-install&product=${encodeURIComponent(`Lockin ${project.category}`)}#quote`} className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-zinc-600 underline-offset-4">Ask about this model</Link>
            </div>
          </div>
        </article>
      ))}
    </RevealGroup>
    {selectedIndex !== null && <ImageLightbox photos={projects.map(project => ({ src: project.image, alt: `${project.title}: ${project.description}` }))} index={selectedIndex} onIndexChange={setSelectedIndex} onClose={() => setSelectedIndex(null)} label="Installation gallery preview" />}
  </>;
}

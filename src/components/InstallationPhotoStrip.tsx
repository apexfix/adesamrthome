"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { GalleryImage, type GalleryPhoto } from "@/components/GalleryImage";
import { ImageLightbox } from "@/components/ImageLightbox";
import { useGalleryScroller } from "@/components/useGalleryScroller";

export function InstallationPhotoStrip({ photos }: { photos: GalleryPhoto[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { scrollerRef, edges, scroll } = useGalleryScroller(photos.length);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const finishDrag = () => {
    drag.current.active = false;
    if (scrollerRef.current) scrollerRef.current.dataset.dragging = "false";
  };
  if (!photos.length) return null;

  return <>
    <section className="mt-24 border-t border-zinc-800 pt-20">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase text-[#c5a47e]">Real Installations</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Adelaide On-Door Photos</h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">Real front doors, real retrofits, and real finish quality from local Adelaide installations.</p>
      </div>
      <div className="mb-5 flex justify-end gap-3">
        <button type="button" className="gallery-scroll-button" onClick={() => scroll("left")} disabled={!edges.left} aria-label="Scroll installation photos left" title="Previous installation photos"><ChevronLeft aria-hidden="true" /></button>
        <button type="button" className="gallery-scroll-button" onClick={() => scroll("right")} disabled={!edges.right} aria-label="Scroll installation photos right" title="Next installation photos"><ChevronRight aria-hidden="true" /></button>
      </div>
      <div ref={scrollerRef} className="installation-photo-scroller gallery-scroller no-scrollbar -mx-4 cursor-grab select-none overflow-x-auto px-4 pb-2 active:cursor-grabbing"
        onPointerDown={event => {
          const node = scrollerRef.current;
          if (!node || event.pointerType !== "mouse" || event.button !== 0) return;
          drag.current = { active: true, moved: false, startX: event.clientX, scrollLeft: node.scrollLeft };
          node.dataset.dragging = "true";
          const target = event.target instanceof Element ? event.target.closest("button") : null;
          (target || node).setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const node = scrollerRef.current;
          if (!node || !drag.current.active) return;
          const distance = event.clientX - drag.current.startX;
          if (Math.abs(distance) > 6) { drag.current.moved = true; event.preventDefault(); }
          if (drag.current.moved) node.scrollLeft = drag.current.scrollLeft - distance;
        }}
        onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}>
        <div className="flex gap-4">
          {photos.map((photo, index) => <button key={photo.src} type="button"
            onClick={event => {
              if (event.detail !== 0 && drag.current.moved) { drag.current.moved = false; return; }
              drag.current.moved = false;
              event.currentTarget.focus({ preventScroll: true });
              setSelectedIndex(index);
            }}
            className="gallery-snap-item liquid-glass-soft group relative aspect-[4/5] w-[220px] shrink-0 overflow-hidden rounded-md border text-left md:w-[260px]"
            aria-label={`Open photo: ${photo.alt}`}>
            <GalleryImage key={photo.src} photo={photo} className="object-cover" sizes="260px" />
            <span className="gallery-zoom-icon" aria-hidden="true"><ZoomIn size={20} /></span>
          </button>)}
        </div>
      </div>
    </section>
    {selectedIndex !== null && <ImageLightbox photos={photos} index={selectedIndex} onIndexChange={setSelectedIndex} onClose={() => setSelectedIndex(null)} label="Installation photo preview" />}
  </>;
}

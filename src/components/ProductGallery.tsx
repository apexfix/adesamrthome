"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryImage } from "@/components/GalleryImage";
import { ImageLightbox } from "@/components/ImageLightbox";
import { useGalleryScroller } from "@/components/useGalleryScroller";

interface ProductGalleryProps {
  images: { src: string; alt: string }[];
  square?: boolean;
}

export function ProductGallery({ images, square = false }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const { scrollerRef, edges, scroll } = useGalleryScroller(images.length);
  const activeIndex = Math.min(selectedIndex, Math.max(0, images.length - 1));

  if (images.length === 0) return <div className="product-gallery-main relative aspect-square bg-white"><GalleryImage photo={{ src: "", alt: "Product image" }} sizes="100vw" /></div>;

  return (
    <div className="flex flex-col gap-4">
      <button type="button" onClick={event => { event.currentTarget.focus({ preventScroll: true }); setExpanded(true); }} title="View larger image" aria-label={`Open product image ${activeIndex + 1} of ${images.length}`}
        className={cn(
          "product-gallery-main relative flex items-center justify-center overflow-hidden rounded-md border border-zinc-800 bg-white",
          square ? "aspect-square" : "aspect-[3/4]"
        )}
      >
        <GalleryImage key={images[activeIndex].src} photo={images[activeIndex]}
          sizes="(max-width: 1023px) calc(100vw - 40px), (max-width: 1500px) 45vw, 660px"
          className="object-contain p-4" eager highPriority={activeIndex === 0}
        />
        <span className="gallery-zoom-icon" aria-hidden="true"><ZoomIn size={20} /></span>
      </button>
      
      {images.length > 1 && (
        <div className="flex items-center gap-1">
        <button type="button" className="gallery-scroll-button" disabled={!edges.left} onClick={() => scroll("left")} aria-label="Scroll product images left" title="Previous thumbnails"><ChevronLeft aria-hidden="true" /></button>
        <div ref={scrollerRef} role="group" aria-label="Product images" className="product-thumbnails gallery-scroller flex min-w-0 flex-1 justify-start gap-3 overflow-x-auto px-1 py-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Show image ${idx + 1} of ${images.length}: ${img.alt || "product view"}`}
              aria-pressed={activeIndex === idx}
              className={cn(
                "gallery-snap-item relative h-14 w-14 md:h-20 md:w-20 shrink-0 cursor-pointer overflow-hidden rounded-sm border bg-white transition-colors",
                activeIndex === idx
                  ? "border-[#c5a47e] opacity-100"
                  : "border-zinc-800 opacity-70 hover:border-zinc-500 hover:opacity-100"
              )}
            >
              <GalleryImage key={img.src} photo={img}
                sizes="80px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
        <button type="button" className="gallery-scroll-button" disabled={!edges.right} onClick={() => scroll("right")} aria-label="Scroll product images right" title="Next thumbnails"><ChevronRight aria-hidden="true" /></button>
        </div>
      )}
      {expanded && <ImageLightbox photos={images} index={activeIndex} onIndexChange={setSelectedIndex} onClose={() => setExpanded(false)} label="Product image preview" />}
    </div>
  );
}

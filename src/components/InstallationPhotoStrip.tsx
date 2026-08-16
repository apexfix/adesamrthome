"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface InstallationPhoto {
  src: string;
  alt: string;
}

export function InstallationPhotoStrip({ photos }: { photos: InstallationPhoto[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<InstallationPhoto | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });

  const scrollPhotos = (direction: "left" | "right") => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    dragState.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
    };
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;

    if (!scroller || !dragState.current.active) {
      return;
    }

    const distance = event.clientX - dragState.current.startX;

    if (Math.abs(distance) > 6) {
      dragState.current.moved = true;
    }

    scroller.scrollLeft = dragState.current.scrollLeft - distance;
  };

  const handlePointerUp = () => {
    dragState.current.active = false;
  };

  const handlePhotoClick = (photo: InstallationPhoto) => {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }

    setSelectedPhoto(photo);
  };

  useEffect(() => {
    if (!selectedPhoto) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="mt-24 pt-20 border-t border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <p className="text-[#c5a47e] text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
              Real Installations
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Adelaide On-Door Photos
            </h2>
          </div>
          <p className="text-zinc-500 max-w-xl text-sm leading-relaxed">
            Real front doors, real retrofits, and real finish quality from local Adelaide installations.
          </p>
        </div>

        <div className="flex justify-end gap-3 mb-5">
          <button
            type="button"
            onClick={() => scrollPhotos("left")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a47e]"
            aria-label="Scroll installation photos left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollPhotos("right")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a47e]"
            aria-label="Scroll installation photos right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={scrollerRef}
          className="-mx-4 overflow-x-auto px-4 pb-2 no-scrollbar cursor-grab active:cursor-grabbing select-none touch-pan-x"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="flex gap-4">
            {photos.map((photo) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => handlePhotoClick(photo)}
                className="group relative aspect-[4/5] w-[220px] md:w-[260px] shrink-0 overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a47e]"
                aria-label={`Open photo: ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="260px"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-[10px] font-bold uppercase tracking-widest text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                  View Photo
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Installation photo preview"
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a47e]"
            aria-label="Close photo preview"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute inset-0 cursor-zoom-out"
            aria-label="Close photo preview"
          />

          <div className="relative mx-auto flex h-full max-h-screen w-full max-w-6xl items-center justify-center p-4 md:p-8 pointer-events-none">
            <div className="relative h-full max-h-[88vh] w-full">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

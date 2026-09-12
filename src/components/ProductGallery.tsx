"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { src: string; alt: string }[];
  square?: boolean;
}

export function ProductGallery({ images, square = false }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-md border border-zinc-800 bg-white p-6 md:p-10",
          square ? "aspect-square" : "aspect-[3/4]"
        )}
      >
        <Image
          src={images[selectedIndex].src}
          alt={images[selectedIndex].alt || "Product image"}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4 transition-all duration-300 ease-in-out"
          loading="eager"
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-start gap-4 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Show image ${idx + 1} of ${images.length}: ${img.alt || "product view"}`}
              aria-pressed={selectedIndex === idx}
              className={cn(
                "relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-sm border bg-white transition-colors",
                selectedIndex === idx 
                  ? "border-[#c5a47e] opacity-100"
                  : "border-zinc-800 opacity-70 hover:border-zinc-500 hover:opacity-100"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `Thumbnail ${idx}`}
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

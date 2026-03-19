"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { src: string; alt: string }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image */}
      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-lg border border-slate-100 aspect-[3/4] relative overflow-hidden flex items-center justify-center">
        <Image
          src={images[selectedIndex].src}
          alt={images[selectedIndex].alt || "Product image"}
          fill
          className="object-contain drop-shadow-2xl p-4 transition-all duration-500 ease-in-out"
          priority
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide justify-center md:justify-start">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative w-20 h-24 rounded-2xl bg-white border-2 overflow-hidden shrink-0 transition-all cursor-pointer shadow-sm",
                selectedIndex === idx 
                  ? "border-black ring-1 ring-black/10 opacity-100 scale-105" 
                  : "border-transparent hover:border-slate-300 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `Thumbnail ${idx}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

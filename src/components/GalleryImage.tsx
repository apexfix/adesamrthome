"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, RotateCw } from "lucide-react";

export interface GalleryPhoto { src: string; alt: string }

export function GalleryImage({ photo, sizes, className, eager = false, highPriority = false, showStatus = false }: {
  photo: GalleryPhoto; sizes: string; className?: string; eager?: boolean; highPriority?: boolean; showStatus?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (failed || !photo.src) return <span className="gallery-image-fallback">
    <span role="img" aria-label={`${photo.alt || "Product image"}: image unavailable`}><ImageOff size={24} aria-hidden="true" /></span><span>Image unavailable</span>
    {showStatus && photo.src && <button type="button" className="gallery-retry" title="Retry image" aria-label="Retry image" onClick={() => { setFailed(false); setLoaded(false); setAttempt(value => value + 1); }}><RotateCw size={20} aria-hidden="true" /></button>}
  </span>;
  return <>
    <Image key={attempt} src={photo.src} alt={photo.alt || "Product image"} fill sizes={sizes} className={className} draggable={false}
      loading={eager ? "eager" : "lazy"} fetchPriority={highPriority ? "high" : "auto"} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
    {showStatus && !loaded && <span className="gallery-loading" role="status">Loading image...</span>}
  </>;
}

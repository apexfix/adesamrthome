"use client";

import { useEffect, useRef } from "react";
import { ImageOff } from "lucide-react";

export function EnquiryPhotoPreview({ photo }: { photo: File }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    const preview = previewRef.current;
    if (!image || !preview) return;
    let url: string;
    try {
      url = URL.createObjectURL(photo);
    } catch {
      preview.dataset.state = "failed";
      return;
    }
    const loaded = () => { preview.dataset.state = "ready"; };
    const failed = () => { preview.dataset.state = "failed"; };
    preview.dataset.state = "loading";
    image.addEventListener("load", loaded);
    image.addEventListener("error", failed);
    image.src = url;
    return () => {
      image.removeEventListener("load", loaded);
      image.removeEventListener("error", failed);
      image.removeAttribute("src");
      URL.revokeObjectURL(url);
    };
  }, [photo]);

  return (
    <div ref={previewRef} className="enquiry-photo-preview" data-state="loading">
      {/* eslint-disable-next-line @next/next/no-img-element -- Private local File URL; never send an enquiry photo through an image optimizer. */}
      <img ref={imageRef} alt={`Preview of ${photo.name}`} width={64} height={64} />
      <span className="enquiry-photo-loading" aria-hidden="true">...</span>
      <span className="enquiry-photo-failed" role="img" aria-label={`Preview unavailable for ${photo.name}`}><ImageOff size={22} aria-hidden="true" /></span>
    </div>
  );
}

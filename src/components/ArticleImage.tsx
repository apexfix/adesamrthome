"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return (
    <span className="article-image-fallback my-10 flex aspect-[14/9] w-full flex-col items-center justify-center gap-3 rounded-md border border-zinc-700 bg-zinc-900 p-4 text-center text-sm text-zinc-300">
      <span role="img" aria-label={`${alt}: image unavailable`}><ImageOff size={28} aria-hidden="true" /></span>
      <span>Image unavailable</span>
    </span>
  );
  return <Image src={src} alt={alt} width={1400} height={900} onError={() => setFailed(true)}
    sizes="(max-width: 767px) calc(100vw - 40px), 704px"
    className="my-10 h-auto w-full rounded-md border border-zinc-800" />;
}

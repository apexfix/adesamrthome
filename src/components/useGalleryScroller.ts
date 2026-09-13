"use client";

import { useEffect, useRef, useState } from "react";
import { shouldReduceVisualEffects } from "@/lib/visualEffects";

export function useGalleryScroller(count: number) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const measure = () => {
      const left = node.scrollLeft > 1;
      const right = node.scrollLeft + node.clientWidth < node.scrollWidth - 1;
      setEdges(previous => previous.left === left && previous.right === right ? previous : { left, right });
    };
    measure();
    node.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => { node.removeEventListener("scroll", measure); observer.disconnect(); };
  }, [count]);
  const scroll = (direction: "left" | "right") => {
    const node = scrollerRef.current;
    node?.scrollBy({ left: (direction === "left" ? -1 : 1) * Math.max(160, node.clientWidth * 0.8), behavior: shouldReduceVisualEffects() ? "instant" : "smooth" });
  };
  return { scrollerRef, edges, scroll };
}

"use client";

import { useId, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGalleryScroller } from "@/components/useGalleryScroller";

export function StoryRail({ children, count }: { children: ReactNode; count: number }) {
  const id = useId();
  const { scrollerRef, edges, scroll } = useGalleryScroller(count);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const finishDrag = () => {
    drag.current.active = false;
    if (scrollerRef.current) scrollerRef.current.dataset.dragging = "false";
  };
  return <div className="story-rail min-w-0">
    {count > 1 && <div className="mb-4 flex justify-end gap-3">
      <button type="button" className="gallery-scroll-button" disabled={!edges.left} onClick={() => scroll("left")} aria-controls={id} aria-label="Previous stories" title="Previous stories"><ChevronLeft aria-hidden="true" /></button>
      <button type="button" className="gallery-scroll-button" disabled={!edges.right} onClick={() => scroll("right")} aria-controls={id} aria-label="Next stories" title="Next stories"><ChevronRight aria-hidden="true" /></button>
    </div>}
    <div id={id} ref={scrollerRef} role="region" aria-label="Installation stories" tabIndex={0}
      className="story-scroller gallery-scroller flex gap-5 overflow-x-auto px-1 pt-1 pb-4"
      onDragStart={event => event.preventDefault()}
      onKeyDown={event => {
        if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault(); scroll(event.key === "ArrowRight" ? "right" : "left");
        }
      }}
      onPointerDown={event => {
        drag.current.moved = false;
        const node = scrollerRef.current;
        if (!node || event.pointerType !== "mouse" || event.button !== 0) return;
        drag.current = { active: true, moved: false, startX: event.clientX, scrollLeft: node.scrollLeft };
        node.dataset.dragging = "true";
        const target = event.target instanceof Element ? event.target.closest("a") : null;
        (target || node).setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const node = scrollerRef.current;
        if (!node || !drag.current.active) return;
        const distance = event.clientX - drag.current.startX;
        if (Math.abs(distance) > 6) { drag.current.moved = true; event.preventDefault(); }
        if (drag.current.moved) node.scrollLeft = drag.current.scrollLeft - distance;
      }}
      onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
      onClickCapture={event => {
        if (event.detail !== 0 && drag.current.moved) { event.preventDefault(); event.stopPropagation(); }
        drag.current.moved = false;
      }}>
      {children}
    </div>
  </div>;
}

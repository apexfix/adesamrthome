"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { GalleryImage, type GalleryPhoto } from "@/components/GalleryImage";
import { getServerVisualEffectsSnapshot, getVisualEffectsSnapshot, subscribeToVisualEffects } from "@/lib/visualEffects";

export function ImageLightbox({ photos, index, onIndexChange, onClose, label }: {
  photos: GalleryPhoto[]; index: number; onIndexChange: (index: number) => void; onClose: () => void; label: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backdropPress = useRef(false);
  const completed = useRef(false);
  const [closing, setClosing] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const preference = useSyncExternalStore(subscribeToVisualEffects, getVisualEffectsSnapshot, getServerVisualEffectsSnapshot);
  const reduced = preference !== "standard";
  const activeIndex = Math.min(Math.max(index, 0), Math.max(0, photos.length - 1));
  const finish = useCallback(() => { if (!completed.current) { completed.current = true; onClose(); } }, [onClose]);
  const requestClose = () => {
    if (reduced) finish();
    else { closeRef.current?.focus({ preventScroll: true }); setClosing(true); }
  };
  const move = (delta: number) => { if (!closing && photos.length > 1) { setZoomed(false); onIndexChange((activeIndex + delta + photos.length) % photos.length); } };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const style = document.body.style;
    const previous = ["overflow", "padding-right"].map(property => [property, style.getPropertyValue(property), style.getPropertyPriority(property)]);
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap > 0) style.setProperty("padding-right", `${parseFloat(getComputedStyle(document.body).paddingRight) + gap}px`);
    style.setProperty("overflow", "hidden");
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      for (const [property, value, priority] of previous) {
        if (value) style.setProperty(property, value, priority);
        else style.removeProperty(property);
      }
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(finish, reduced ? 0 : 240);
    return () => window.clearTimeout(timer);
  }, [closing, reduced, finish]);

  return <dialog ref={dialogRef} className="image-lightbox installation-photo-dialog" aria-label={label} data-closing={closing}
    onCancel={event => { event.preventDefault(); requestClose(); }}
    onKeyDown={event => {
      if (event.key === "Tab") {
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
      if (zoomed && event.target instanceof Element && event.target.closest('.image-lightbox-stage')) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
    }}
    onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
    onClick={event => { if (event.target === event.currentTarget && backdropPress.current) requestClose(); backdropPress.current = false; }}>
    <div className="image-lightbox-toolbar">
      <span aria-live="polite" aria-atomic="true">{photos.length ? activeIndex + 1 : 0} / {photos.length}</span>
      <div className="image-lightbox-actions">
        <button type="button" aria-label={zoomed ? "Reset zoom" : "Zoom in"} title={zoomed ? "Reset zoom" : "Zoom in"} aria-pressed={zoomed} disabled={closing} onClick={() => setZoomed(value => !value)}>{zoomed ? <ZoomOut aria-hidden="true" /> : <ZoomIn aria-hidden="true" />}</button>
        {photos.length > 1 && <>
          <button type="button" aria-label="Previous image" title="Previous image" disabled={closing} onClick={() => move(-1)}><ChevronLeft aria-hidden="true" /></button>
          <button type="button" aria-label="Next image" title="Next image" disabled={closing} onClick={() => move(1)}><ChevronRight aria-hidden="true" /></button>
        </>}
        <button ref={closeRef} type="button" aria-label="Close photo preview" title="Close photo preview" onClick={requestClose}><X aria-hidden="true" /></button>
      </div>
    </div>
    <div key={activeIndex} className="image-lightbox-stage" data-zoomed={zoomed} tabIndex={zoomed ? 0 : undefined} role={zoomed ? "region" : undefined} aria-label={zoomed ? "Enlarged photo" : undefined}>
      <div className="image-lightbox-canvas">
        <GalleryImage key={photos[activeIndex]?.src ?? "missing"} photo={photos[activeIndex] ?? { src: "", alt: "Photo" }} sizes={zoomed ? "(min-width: 1280px) 2400px, 200vw" : "(min-width: 1280px) 1200px, 100vw"} className="object-contain" eager showStatus />
      </div>
    </div>
    <p className="image-lightbox-caption">{photos[activeIndex]?.alt || "Photo"}</p>
  </dialog>;
}

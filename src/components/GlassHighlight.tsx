"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getServerVisualEffectsSnapshot, getVisualEffectsSnapshot, subscribeToVisualEffects } from "@/lib/visualEffects";

export function GlassHighlight() {
  const pathname = usePathname();
  const preference = useSyncExternalStore(subscribeToVisualEffects, getVisualEffectsSnapshot, getServerVisualEffectsSnapshot);
  useEffect(() => {
    if (preference !== "standard") return;
    const media = matchMedia("(hover: hover) and (pointer: fine)");
    let panel: HTMLElement | null = null;
    let frame = 0;
    let x = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (panel) { delete panel.dataset.highlightActive; panel.style.removeProperty("--shine-x"); }
      panel = null;
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") { reset(); return; }
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-glass-highlight]") : null;
      if (target !== panel) { reset(); panel = target; }
      if (!panel) return;
      x = event.clientX;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!panel?.isConnected) { reset(); return; }
        const bounds = panel.getBoundingClientRect();
        panel.style.setProperty("--shine-x", `${Math.max(0, Math.min(100, (x - bounds.left) / Math.max(1, bounds.width) * 100))}%`);
        panel.dataset.highlightActive = "true";
      });
    };
    const leave = (event: PointerEvent) => { if (panel && (!(event.relatedTarget instanceof Node) || !panel.contains(event.relatedTarget))) reset(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("visibilitychange", reset);
    media.addEventListener("change", reset);
    return () => {
      reset();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("visibilitychange", reset);
      media.removeEventListener("change", reset);
    };
  }, [pathname, preference]);
  return null;
}

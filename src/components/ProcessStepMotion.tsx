"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getServerVisualEffectsSnapshot, getVisualEffectsSnapshot, subscribeToVisualEffects } from "@/lib/visualEffects";

export function ProcessStepMotion() {
  const pathname = usePathname();
  const preference = useSyncExternalStore(subscribeToVisualEffects, getVisualEffectsSnapshot, getServerVisualEffectsSnapshot);
  useEffect(() => {
    if (preference !== "standard" || typeof IntersectionObserver === "undefined") return;
    const steps = [...document.querySelectorAll<HTMLElement>("[data-process-step]")];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.stepMotion = "active";
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.35 });
    for (const step of steps) {
      step.dataset.stepMotion = "ready";
      observer.observe(step);
    }
    return () => {
      observer.disconnect();
      for (const step of steps) delete step.dataset.stepMotion;
    };
  }, [pathname, preference]);
  return null;
}

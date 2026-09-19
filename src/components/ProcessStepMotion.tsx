"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getServerVisualEffectsSnapshot, getVisualEffectsSnapshot, subscribeToVisualEffects } from "@/lib/visualEffects";

export function ProcessStepMotion() {
  const pathname = usePathname();
  const preference = useSyncExternalStore(subscribeToVisualEffects, getVisualEffectsSnapshot, getServerVisualEffectsSnapshot);
  useEffect(() => {
    if (preference !== "standard" || typeof IntersectionObserver === "undefined") return;
    const steps = new Set<HTMLElement>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !steps.has(entry.target as HTMLElement) || !entry.target.isConnected) continue;
        (entry.target as HTMLElement).dataset.stepMotion = "active";
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.35 });
    const register = (root: Document | HTMLElement) => {
      const candidates = [...root.querySelectorAll<HTMLElement>("[data-process-step]")];
      if (root instanceof HTMLElement && root.matches("[data-process-step]")) candidates.unshift(root);
      for (const step of candidates) {
        if (steps.has(step)) continue;
        steps.add(step);
        step.dataset.stepMotion = "ready";
        observer.observe(step);
      }
    };
    register(document);
    // Receipt steps can arrive after the route shell has hydrated.
    const additions = typeof MutationObserver === "undefined" ? null : new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node instanceof HTMLElement && node.isConnected) register(node);
      }
      for (const step of steps) if (!step.isConnected) {
        observer.unobserve(step);
        delete step.dataset.stepMotion;
        steps.delete(step);
      }
    });
    additions?.observe(document.getElementById("site-content") ?? document.body, { childList: true, subtree: true });
    return () => {
      additions?.disconnect();
      observer.disconnect();
      for (const step of steps) delete step.dataset.stepMotion;
    };
  }, [pathname, preference]);
  return null;
}

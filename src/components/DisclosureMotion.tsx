"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getServerVisualEffectsSnapshot, getVisualEffectsSnapshot, subscribeToVisualEffects } from "@/lib/visualEffects";

type Transition = { animation: Animation; expanded: boolean; overflow: string; priority: string };

export function DisclosureMotion() {
  const pathname = usePathname();
  const preference = useSyncExternalStore(subscribeToVisualEffects, getVisualEffectsSnapshot, getServerVisualEffectsSnapshot);

  useEffect(() => {
    if (preference !== "standard") return;
    const active = new Map<HTMLDetailsElement, Transition>();
    const settle = (details: HTMLDetailsElement, transition: Transition) => {
      if (active.get(details) !== transition) return;
      active.delete(details);
      details.open = transition.expanded;
      if (transition.overflow) details.style.setProperty("overflow", transition.overflow, transition.priority);
      else details.style.removeProperty("overflow");
      transition.animation.cancel();
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      const summary = event.target.closest<HTMLElement>("details[data-faq] > summary");
      const details = summary?.parentElement;
      if (!summary || !(details instanceof HTMLDetailsElement) || !details.animate) return;
      // Preserve genuine links/controls inside a summary, if a future question adds one.
      if (event.target.closest("a, button, input, select, textarea")) return;
      event.preventDefault();
      summary.focus({ preventScroll: true });
      const previous = active.get(details);
      const expanded = !(previous?.expanded ?? details.open);
      const from = details.getBoundingClientRect().height;
      const overflow = previous?.overflow ?? details.style.getPropertyValue("overflow");
      const priority = previous?.priority ?? details.style.getPropertyPriority("overflow");
      if (previous) { active.delete(details); previous.animation.cancel(); }
      details.open = true;
      const style = getComputedStyle(details);
      const closedHeight = summary.getBoundingClientRect().height + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const to = expanded ? details.getBoundingClientRect().height : closedHeight;
      details.style.overflow = "hidden";
      try {
        const animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" });
        const transition = { animation, expanded, overflow, priority };
        active.set(details, transition);
        animation.finished.then(() => settle(details, transition), () => settle(details, transition));
      } catch {
        details.open = expanded;
        if (overflow) details.style.setProperty("overflow", overflow, priority);
        else details.style.removeProperty("overflow");
      }
    };
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("click", click);
      for (const [details, transition] of active) settle(details, transition);
    };
  }, [pathname, preference]);

  return null;
}

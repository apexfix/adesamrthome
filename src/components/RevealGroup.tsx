"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { getServerVisualEffectsSnapshot, getVisualEffectsSnapshot, subscribeToVisualEffects } from "@/lib/visualEffects";

export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const preference = useSyncExternalStore(subscribeToVisualEffects, getVisualEffectsSnapshot, getServerVisualEffectsSnapshot);
  useEffect(() => {
    const group = ref.current;
    if (!group || preference !== "standard" || typeof IntersectionObserver === "undefined") return;
    const animations = new Set<Animation>();
    const children = [...group.children].filter((node): node is HTMLElement => node instanceof HTMLElement);
    const positions = new Map(children.map((node, index) => [node, index]));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const node = entry.target as HTMLElement;
        if (node.contains(document.activeElement) || !node.animate) continue;
        try {
          const animation = node.animate([
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" },
          ], { duration: 480, delay: Math.min(positions.get(node) ?? 0, 3) * 70, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
          animations.add(animation);
          const finish = () => { animations.delete(animation); animation.cancel(); };
          animation.finished.then(finish, () => animations.delete(animation));
        } catch { /* Static HTML remains visible if animation support fails. */ }
      }
    }, { threshold: 0.1 });
    for (const node of children) {
      const bounds = node.getBoundingClientRect();
      if (bounds.top >= innerHeight || bounds.bottom <= 0 || bounds.left >= innerWidth || bounds.right <= 0) observer.observe(node);
    }
    const showFocusedContent = (event: FocusEvent) => {
      for (const animation of animations) {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        if (target instanceof Element && event.target instanceof Node && target.contains(event.target)) animation.cancel();
      }
    };
    group.addEventListener("focusin", showFocusedContent);
    return () => {
      observer.disconnect();
      group.removeEventListener("focusin", showFocusedContent);
      for (const animation of animations) animation.cancel();
    };
  }, [children, preference]);
  return <div ref={ref} data-reveal-group className={className}>{children}</div>;
}

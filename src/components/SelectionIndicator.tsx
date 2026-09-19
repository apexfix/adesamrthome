"use client";

import { useLayoutEffect, useRef } from "react";

export function SelectionIndicator({ activeKey }: { activeKey: string }) {
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const group = indicator?.parentElement;
    if (!indicator || !group || typeof ResizeObserver === "undefined") return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const selected = group.querySelector<HTMLElement>(':scope > [aria-current="page"], :scope > [aria-pressed="true"]');
      if (!selected || !group.getBoundingClientRect().width) {
        indicator.dataset.ready = "false";
        return;
      }
      const bounds = group.getBoundingClientRect();
      const target = selected.getBoundingClientRect();
      indicator.style.width = `${target.width}px`;
      indicator.style.height = `${target.height}px`;
      indicator.style.transform = `translate(${target.left - bounds.left - group.clientLeft + group.scrollLeft}px, ${target.top - bounds.top - group.clientTop + group.scrollTop}px)`;
      indicator.dataset.ready = "true";
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    for (const child of group.children) if (child !== indicator) observer.observe(child);
    document.fonts.ready.then(measure);
    return () => { disposed = true; observer.disconnect(); };
  }, [activeKey]);

  return <span ref={indicatorRef} className="selection-indicator" aria-hidden="true" />;
}

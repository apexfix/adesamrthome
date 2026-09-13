"use client";

import { useSyncExternalStore } from "react";
import {
  getServerVisualEffectsSnapshot,
  getVisualEffectsSnapshot,
  setReducedVisualEffects,
  subscribeToVisualEffects,
} from "@/lib/visualEffects";

export function VisualEffectsControl() {
  const preference = useSyncExternalStore(subscribeToVisualEffects, getVisualEffectsSnapshot, getServerVisualEffectsSnapshot);
  const systemReduced = preference === "system";

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-x-3">
      {preference !== null && (
        <label className="inline-flex min-h-11 max-w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm text-zinc-200">
          <input
            type="checkbox"
            className="h-5 w-5 shrink-0 accent-[#d9b98f]"
            checked={preference !== "standard"}
            disabled={systemReduced}
            onChange={event => setReducedVisualEffects(event.target.checked)}
            aria-describedby={systemReduced ? "visual-effects-system" : undefined}
          />
          <span>Reduce visual effects</span>
        </label>
      )}
      {systemReduced && <span id="visual-effects-system" className="text-xs text-zinc-400">System preference</span>}
    </div>
  );
}

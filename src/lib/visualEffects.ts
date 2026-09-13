const storageKey = "ade-reduce-visual-effects";
const changeEvent = "ade-visual-effects-change";
const mediaQueries = ["(prefers-reduced-motion: reduce)", "(prefers-reduced-transparency: reduce)"];
let manualReduction = false;
let initialized = false;

function readPreference() {
  try {
    manualReduction = window.localStorage.getItem(storageKey) === "true";
  } catch {
    // Keep the current tab's preference when browser storage is unavailable.
  }
  initialized = true;
}

export function getVisualEffectsSnapshot(): "system" | "reduced" | "standard" {
  if (!initialized) readPreference();
  if (mediaQueries.some(query => window.matchMedia(query).matches)) return "system";
  return manualReduction ? "reduced" : "standard";
}

export function shouldReduceVisualEffects() {
  return getVisualEffectsSnapshot() !== "standard";
}

function applyPreference() {
  document.documentElement.dataset.visualEffects = shouldReduceVisualEffects() ? "reduced" : "standard";
}

export function subscribeToVisualEffects(onChange: () => void) {
  const update = () => { applyPreference(); onChange(); };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    readPreference();
    update();
  };
  const media = mediaQueries.map(query => window.matchMedia(query));
  media.forEach(query => query.addEventListener("change", update));
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, update);
  applyPreference();
  return () => {
    media.forEach(query => query.removeEventListener("change", update));
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changeEvent, update);
  };
}

export function setReducedVisualEffects(reduced: boolean) {
  manualReduction = reduced;
  initialized = true;
  try {
    window.localStorage.setItem(storageKey, String(reduced));
  } catch {
    // Storage failure must not prevent changing the current page.
  }
  applyPreference();
  window.dispatchEvent(new Event(changeEvent));
}

export function getServerVisualEffectsSnapshot() {
  return null;
}

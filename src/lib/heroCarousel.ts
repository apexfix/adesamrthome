export const HERO_INTERVAL = 7000;

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  href: string;
  src: string;
  alt: string;
}

export interface CarouselState {
  count: number;
  index: number;
  pending: number | null;
  ready: boolean[];
  userPaused: boolean;
  visible: boolean;
  inViewport: boolean;
}

export type CarouselEvent =
  | { type: "next" | "previous" | "tick" | "pause" | "play" }
  | { type: "select" | "ready"; index: number }
  | { type: "visible" | "inViewport"; value: boolean };

export function initialCarousel(count: number): CarouselState {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  return { count: safeCount, index: 0, pending: null, ready: Array(safeCount).fill(false), userPaused: false, visible: false, inViewport: false };
}

export function canAutoPlay(state: CarouselState, reduced = false) {
  return state.count > 1 && state.ready[state.index] && state.pending === null && !state.userPaused && !reduced && state.visible && state.inViewport;
}

function selectSlide(state: CarouselState, index: number, userPaused: boolean): CarouselState {
  if (!state.count) return state;
  const target = (index + state.count) % state.count;
  return state.ready[target]
    ? { ...state, index: target, pending: null, userPaused }
    : { ...state, pending: target, userPaused };
}

export function reduceCarousel(state: CarouselState, event: CarouselEvent): CarouselState {
  switch (event.type) {
    case "visible": case "inViewport": return { ...state, [event.type]: event.value };
    case "pause": return state.userPaused ? state : { ...state, userPaused: true };
    case "play": return { ...state, userPaused: false };
    case "ready": {
      if (!Number.isInteger(event.index) || event.index < 0 || event.index >= state.count || state.ready[event.index]) return state;
      const ready = state.ready.map((value, index) => value || index === event.index);
      return { ...state, ready, ...(state.pending === event.index ? { index: event.index, pending: null } : {}) };
    }
    case "select":
      return Number.isInteger(event.index) && event.index >= 0 && event.index < state.count ? selectSlide(state, event.index, true) : state;
    case "next": return selectSlide(state, (state.pending ?? state.index) + 1, true);
    case "previous": return selectSlide(state, (state.pending ?? state.index) - 1, true);
    case "tick": return canAutoPlay(state) ? selectSlide(state, state.index + 1, false) : state;
  }
}

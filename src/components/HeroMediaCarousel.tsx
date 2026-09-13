"use client";

import { useEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { canAutoPlay, HERO_INTERVAL, initialCarousel, reduceCarousel, type HeroSlide } from "@/lib/heroCarousel";
import { getServerVisualEffectsSnapshot, getVisualEffectsSnapshot, shouldReduceVisualEffects, subscribeToVisualEffects } from "@/lib/visualEffects";

const fallbackImage = "/img/hero1-optimized.avif";

function SlideImage({ slide, index, active, onReady }: { slide: HeroSlide; index: number; active: boolean; onReady: (index: number) => void }) {
  const [failed, setFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  return (
    <div className="hero-slide" data-active={active} aria-hidden={!active} inert={!active}>
      {!fallbackFailed && <Image
        src={failed ? fallbackImage : slide.src} alt={failed ? "Modern home exterior" : slide.alt}
        fill sizes="(min-width: 1024px) 55vw, 100vw" quality={75}
        priority={index === 0} fetchPriority={index === 0 ? "high" : "low"} loading={index === 0 ? undefined : "eager"}
        className="hero-slide-image" onLoad={() => onReady(index)}
        onError={() => { if (failed || slide.src === fallbackImage) { setFallbackFailed(true); onReady(index); } else setFailed(true); }}
      />}
      {fallbackFailed && <p className="hero-image-unavailable">{slide.title}</p>}
    </div>
  );
}

export function HeroMediaCarousel({ slides, children }: { slides: HeroSlide[]; children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceCarousel, slides.length, initialCarousel);
  const preference = useSyncExternalStore(subscribeToVisualEffects, getVisualEffectsSnapshot, getServerVisualEffectsSnapshot);
  const reduced = preference !== "standard";
  const playing = canAutoPlay(state, reduced);
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const ready = (index: number) => dispatch({ type: "ready", index });

  useEffect(() => {
    const syncVisibility = () => dispatch({ type: "visible", value: !document.hidden });
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => dispatch({ type: "inViewport", value: entry.isIntersecting && entry.intersectionRatio >= 0.25 }), { threshold: [0, 0.25] });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => { document.removeEventListener("visibilitychange", syncVisibility); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (!shouldReduceVisualEffects() && !document.hidden) dispatch({ type: "tick" });
    }, HERO_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [playing, state.index]);

  const active = slides[state.index];
  const pause = () => dispatch({ type: "pause" });
  return (
    <div ref={rootRef} className="hero-carousel" role="region" aria-roledescription={slides.length > 1 ? "carousel" : undefined} aria-label="Smart security services"
      data-index={state.index} data-playing={playing} data-user-paused={state.userPaused} data-pending={state.pending ?? ""}
      onPointerEnter={event => { if (event.pointerType === "mouse") pause(); }}
      onFocusCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) pause(); }}
      onPointerDown={event => { if (!(event.target as Element).closest("[data-playback-control]")) pause(); }}>
      {children}
      <div className="hero-media"
        onTouchStart={event => { pause(); touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={event => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !event.changedTouches[0]) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) dispatch({ type: dx < 0 ? "next" : "previous" });
        }}>
        {slides.length ? slides.map((slide, index) => (
          (index === 0 || state.ready[0] || state.pending === index) && <SlideImage key={slide.id} slide={slide} index={index} active={index === state.index} onReady={ready} />
        )) : <SlideImage slide={{ id: "fallback", title: "Smart security for Adelaide", description: "", href: "/contact#quote", src: fallbackImage, alt: "Modern home exterior" }} index={0} active onReady={ready} />}
      </div>
      <div className="hero-media-footer">
        <div className="hero-caption" aria-live={state.userPaused ? "polite" : "off"} aria-atomic="true">
          <Link href={active?.href ?? "/contact#quote"} className="hero-slide-link">
            <span>{active?.title ?? "Smart security for Adelaide"}</span><ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p>{active?.description ?? "Smart locks, installation and camera equipment."}</p>
        </div>
        {slides.length > 1 && <div className="hero-controls-slot">{preference !== null && <div className="hero-controls liquid-glass" role="group" aria-label="Slideshow controls">
          <button type="button" data-playback-control className="hero-icon-button" aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            title={reduced ? "Slideshow paused by reduced visual effects" : playing ? "Pause slideshow" : "Play slideshow"}
            disabled={reduced} onClick={() => dispatch({ type: playing ? "pause" : "play" })}>
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <div className="hero-indicators" role="group" aria-label="Choose a service slide">
            {slides.map((slide, index) => <button key={slide.id} type="button" className="hero-indicator" aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-pressed={index === state.index} title={slide.title} onClick={() => dispatch({ type: "select", index })}>
              <span className="hero-progress-track" aria-hidden="true"><span key={`${state.index}-${playing}`} className="hero-progress" data-running={playing && index === state.index} /></span>
            </button>)}
          </div>
          <span className="hero-slide-count" aria-hidden="true">{state.index + 1} / {slides.length}</span>
          <button type="button" className="hero-icon-button" aria-label="Previous slide" title="Previous slide" onClick={() => dispatch({ type: "previous" })}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" className="hero-icon-button" aria-label="Next slide" title="Next slide" onClick={() => dispatch({ type: "next" })}><ArrowRight size={18} aria-hidden="true" /></button>
        </div>}</div>}
      </div>
    </div>
  );
}

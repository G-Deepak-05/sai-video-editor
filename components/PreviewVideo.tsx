"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Muted looping preview. Nothing is fetched until it nears the viewport;
 * it pauses when it leaves. Poster shows until frames are ready (and on failure).
 */
export function PreviewVideo({ src, srcSmall, poster, className = "", eager = false, active = true }: { src: string; srcSmall?: string; poster?: string; className?: string; eager?: boolean; active?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  // Posters are fetched by the browser immediately, even with preload="none" — so attach them only when near the viewport.
  useEffect(() => {
    const v = ref.current;
    if (!v || !poster) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { v.poster = poster; io.disconnect(); } }, { rootMargin: "800px" });
    io.observe(v);
    return () => io.disconnect();
  }, [poster]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !active) { v.pause(); return; }
    let io: IntersectionObserver | undefined;
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute("src")) v.src = srcSmall && window.matchMedia("(max-width: 767px)").matches ? srcSmall : src;
          v.play().catch(() => {});
        } else v.pause();
      },
        { rootMargin: eager ? "0px" : "200px" },
      );
      io.observe(v);
    };
    // "eager" previews (hero) wait for load + a beat so the poster/LCP image gets the bandwidth first
    if (eager && document.readyState !== "complete") window.addEventListener("load", () => setTimeout(start, 600), { once: true });
    else if (eager) setTimeout(start, 600);
    else start();
    return () => { cancelled = true; io?.disconnect(); };
  }, [src, srcSmall, eager, active]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      onError={() => setFailed(true)}
      style={failed ? { objectFit: "cover" } : undefined}
    />
  );
}

"use client";
import { useEffect, useRef } from "react";

/** Thin scroll-progress line across the top of the page. Updates only when scrolling. */
export function ScrollFeedback() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]" aria-hidden>
      <div ref={bar} className="h-full origin-left bg-[var(--accent)]" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

/** Desktop-only cursor. Elements opt in with data-cursor="PLAY" | "VIEW" | "OPEN". */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("has-cursor");
    setOn(true);
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(el?.dataset.cursor ?? "");
    };
    const tick = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!on) return null;
  return (
    <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[110]" aria-hidden>
      <div
        className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-[var(--fg)] text-[10px] font-semibold tracking-[0.15em] text-black transition-[width,height] duration-300"
        style={{ width: label ? 84 : 10, height: label ? 84 : 10, transitionTimingFunction: "var(--ease)", mixBlendMode: label ? "normal" : "difference" }}
      >
        {label}
      </div>
    </div>
  );
}

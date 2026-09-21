"use client";
import { useEffect, useRef, useState } from "react";

const MARKS = [["Work", "work"], ["Services", "services"], ["About", "about"], ["Contact", "contact"]] as const;

/** Custom scrollbar: a little mouse rides a film-timeline track. Drag it, or click a chapter tick. Desktop only. */
export function Scroller() {
  const track = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [marks, setMarks] = useState<{ label: string; at: number; y: number }[]>([]);
  const [drag, setDrag] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setOn(true);
    document.documentElement.classList.add("has-scroller");
    const max = () => document.documentElement.scrollHeight - innerHeight;
    const onScroll = () => setP(max() > 0 ? scrollY / max() : 0);
    const measure = () => {
      setMarks(MARKS.flatMap(([label, id]) => {
        const el = document.getElementById(id);
        if (!el || max() <= 0) return [];
        const y = el.getBoundingClientRect().top + scrollY;
        return [{ label, y, at: Math.min(1, y / max()) }];
      }));
      onScroll();
    };
    measure();
    const t = setTimeout(measure, 1500); // after fonts/videos settle the height
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    return () => { clearTimeout(t); removeEventListener("scroll", onScroll); removeEventListener("resize", measure); document.documentElement.classList.remove("has-scroller"); };
  }, []);

  const seek = (clientY: number) => {
    const r = track.current!.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    scrollTo({ top: ratio * (document.documentElement.scrollHeight - innerHeight) });
  };

  if (!on) return null;
  return (
    <div className="fixed right-3 top-1/2 z-[70] hidden -translate-y-1/2 select-none md:block" aria-hidden>
      <div
        ref={track}
        className="relative h-[52vh] w-10 cursor-pointer"
        data-cursor=""
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); seek(e.clientY); }}
        onPointerMove={(e) => drag && seek(e.clientY)}
        onPointerUp={() => setDrag(false)}
      >
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/15" />
        <div className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-[var(--accent)]" style={{ height: `${p * 100}%` }} />
        {marks.map((m) => (
          <button key={m.label} tabIndex={-1} onPointerDown={(e) => e.stopPropagation()} onClick={() => scrollTo({ top: m.y })}
            className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: `${m.at * 100}%` }}>
            <span className="block h-1.5 w-1.5 rounded-full bg-white/40 transition-transform group-hover:scale-150 group-hover:bg-[var(--accent)]" />
            <span className="label pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-black/70 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">{m.label}</span>
          </button>
        ))}
        {/* the mouse */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: `${p * 100}%`, transition: drag ? "none" : "top 0.12s linear" }}>
          <div className={`relative flex h-11 w-7 justify-center rounded-full border-2 bg-[#0a0a0a] pt-2 transition-all duration-300 ${drag ? "scale-110 border-[var(--accent)]" : "border-[var(--fg)]"}`}>
            <span className="h-2 w-[3px] rounded-full bg-[var(--accent)] animate-[wheel_1.4s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
      <style>{`@keyframes wheel{0%{transform:translateY(0);opacity:1}70%{transform:translateY(8px);opacity:0}100%{opacity:0}}`}</style>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Film-leader countdown: sweeping hand, 3‑2‑1, frame counter, then a two-piece "cut" reveal. */
export const LOADER_MS = 2400;

export function Loader() {
  const [show, setShow] = useState(true);
  const [t, setT] = useState(0);

  useEffect(() => {
    // ~12 updates/sec instead of per-frame renders; the sweep itself is a pure CSS animation
    const start = performance.now();
    const iv = setInterval(() => setT(Math.min((performance.now() - start) / (LOADER_MS - 500), 1)), 80);
    const done = setTimeout(() => setShow(false), LOADER_MS);
    return () => { clearInterval(iv); clearTimeout(done); };
  }, []);

  const count = Math.max(1, 3 - Math.floor(t * 3));
  const frames = Math.floor(t * 72); // 3 seconds @ 24fps
  const pct = Math.round(t * 100);

  const half = (top: boolean) => (
    <motion.div
      className={`absolute inset-x-0 ${top ? "top-0" : "bottom-0"} h-1/2 overflow-hidden bg-[#0a0a0a]`}
      exit={{ y: top ? "-100%" : "100%" }}
      transition={{ duration: 0.8, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className={`absolute inset-x-0 ${top ? "top-0" : "bottom-0"} h-[100vh]`}>
        <Leader count={count} frames={frames} pct={pct} />
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100]" aria-hidden exit={{ transition: { duration: 0.9 } }}>
          {half(true)}
          {half(false)}
          {/* the cut line */}
          <motion.div className="absolute left-0 top-1/2 h-px w-full bg-[var(--accent)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Leader({ count, frames, pct }: { count: number; frames: number; pct: number }) {
  return (
    <div className="relative h-full w-full">
      {/* sprocket edges */}
      {["left-4", "right-4"].map((s) => (
        <div key={s} className={`absolute ${s} inset-y-0 flex flex-col justify-around py-3`}>
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className="block h-3 w-5 rounded-sm bg-white/10" />)}
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[min(70vw,60vh)] w-[min(70vw,60vh)] items-center justify-center rounded-full border border-white/25">
          <div className="absolute inset-4 rounded-full border border-white/10" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/15" />
          <div className="absolute bottom-0 top-0 left-1/2 w-px bg-white/15" />
          <div className="absolute inset-0 rounded-full will-change-transform" style={{ background: "conic-gradient(from 0deg, rgba(232,85,45,0) 0deg, rgba(232,85,45,0.4) 359deg, rgba(232,85,45,0) 360deg)", animation: "sweep 0.93s linear infinite" }}>
            <div className="absolute left-1/2 top-0 h-1/2 w-px bg-[var(--accent)]" />
          </div>
          <span key={count} className="display relative text-[min(38vw,34vh)] leading-none animate-[pop_0.33s_ease-out]">{count}</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-14 pb-6">
        <span className="display text-2xl tracking-[0.25em] md:text-4xl">SAIKUMAR</span>
        <span className="label tabular-nums !text-[var(--fg)]">00:00:{String(Math.floor(frames / 24)).padStart(2, "0")}:{String(frames % 24).padStart(2, "0")} · {String(pct).padStart(3, "0")}%</span>
      </div>
      <style>{`@keyframes sweep{to{transform:rotate(360deg)}}@keyframes pop{0%{transform:scale(1.25);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { motion } from "motion/react";
import { projects } from "@/lib/projects";
import { services } from "@/lib/site";

export function ProjectViewer({ ids, index, onIndex, onClose }: { ids: string[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const p = projects.find((x) => x.id === ids[index])!;
  const n = ids.length;
  const go = (d: number) => onIndex((index + d + n) % n);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  });

  const tags = p.categories.map((c) => services.find((s) => s.id === c)?.label).filter(Boolean);

  return (
    <motion.div role="dialog" aria-modal="true" aria-label={p.title} className="fixed inset-0 z-[90] flex flex-col bg-[#0a0a0a]"
      initial={{ clipPath: "inset(50% 50% 50% 50%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
      <div className="wrap flex items-center justify-between py-5">
        <span className="label">{String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
        <button autoFocus onClick={onClose} data-cursor="" className="label u !text-[var(--fg)]">Close ✕</button>
      </div>

      <div className="wrap flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pb-8 lg:flex-row">
        <div className={`flex min-h-0 items-center justify-center bg-black ${p.orientation === "portrait" ? "lg:w-[38%]" : "lg:flex-1"}`}>
          <div className={p.orientation === "portrait" ? "aspect-[9/16] max-h-[78vh]" : "aspect-video w-full"} key={p.id}>
            {p.src ? (
              <video className="h-full w-full" src={p.src} poster={p.poster} controls autoPlay playsInline preload="metadata" />
            ) : p.driveId ? (
              <iframe className="h-full w-full" src={`https://drive.google.com/file/d/${p.driveId}/preview`} title={p.title} allow="autoplay; fullscreen" allowFullScreen />
            ) : (
              // Fallback: never a blank rectangle
              // eslint-disable-next-line @next/next/no-img-element
              <img className="h-full w-full object-cover" src={p.poster} alt={p.title} />
            )}
          </div>
        </div>

        <aside className="flex shrink-0 flex-col justify-between gap-8 lg:w-80">
          <div>
            <h2 className="display text-4xl md:text-5xl">{p.title}</h2>
            <p className="mt-4 text-[var(--mute)]">{p.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => <li key={t} className="label rounded-full border border-[var(--line)] px-3 py-1.5">{t}</li>)}
            </ul>
          </div>
          <div className="flex gap-6">
            <button onClick={() => go(-1)} className="label u !text-[var(--fg)]" aria-label="Previous project">← Prev</button>
            <button onClick={() => go(1)} className="label u !text-[var(--fg)]" aria-label="Next project">Next →</button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

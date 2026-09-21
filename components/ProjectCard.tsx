"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/lib/projects";
import { services } from "@/lib/site";
import { PreviewVideo } from "./PreviewVideo";

const label = (id: string) => services.find((s) => s.id === id)?.label ?? id;

export function ProjectCard({ project: p, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const portrait = p.orientation === "portrait";
  const frame = useRef<HTMLButtonElement>(null);
  const { scrollYProgress: sp } = useScroll({ target: frame, offset: ["start end", "center center"] });
  const { scrollYProgress: sp2 } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const inset = useTransform(sp, [0, 1], [22, 0]);
  const clip = useTransform(inset, (v) => `inset(${v}% ${v * 0.5}% ${v}% ${v * 0.5}%)`);
  const inner = useTransform(sp2, [0, 1], [1.28, 1.02]);
  const shift = useTransform(sp2, [0, 1], ["-6%", "6%"]);
  // Rhythm: alternate wide / offset so the page cuts like an edit, not a grid of thumbnails.
  const span = portrait ? "md:col-span-5 md:col-start-2" : index % 3 === 0 ? "md:col-span-12" : index % 3 === 1 ? "md:col-span-7" : "md:col-span-7 md:col-start-6";

  return (
    <motion.article
      layout
      className={span}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex items-baseline justify-between">
        <span className="display text-5xl text-[var(--mute)]">{String(index + 1).padStart(2, "0")}</span>
        <span className="label">{p.categories.map(label).join(" · ")}</span>
      </div>
      <button ref={frame} onClick={onOpen} data-cursor="VIEW" aria-label={`Open project: ${p.title}`} className="group relative block w-full overflow-hidden bg-[var(--bg-2)] text-left">
        <motion.div style={{ clipPath: clip }} className={portrait ? "aspect-[9/14]" : "aspect-video"}>
          <motion.div style={{ scale: inner, y: shift }} className="h-full w-full">
            <PreviewVideo src={p.preview} poster={p.poster} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease)] group-hover:scale-[1.06]" />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100 max-md:from-black/40">
          <p className="max-w-sm text-sm text-white/85">{p.description}</p>
        </div>
      </button>
      <h3 className="display mt-4 text-3xl md:text-4xl">{p.title}</h3>
    </motion.article>
  );
}

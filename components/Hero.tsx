"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PreviewVideo } from "./PreviewVideo";
import { Magnetic } from "./Magnetic";
import { useViewer } from "./Shell";
import { hero, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { LOADER_MS } from "./Loader";

const D = LOADER_MS / 1000 - 0.3;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useViewer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const bars = useTransform(scrollYProgress, [0, 0.8], ["0vh", "16vh"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const textO = useTransform(scrollYProgress, [0.1, 0.6], [1, 0]);
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.poster} srcSet="/work/10-sm.jpg 720w, /work/10.jpg 1440w" sizes="100vw" alt="" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <PreviewVideo src={hero.preview} srcSmall="/work/10-sm.mp4" eager className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/50" />
      </motion.div>

      <motion.div aria-hidden style={{ height: bars }} className="absolute inset-x-0 top-0 z-10 bg-[#0a0a0a]" />
      <motion.div aria-hidden style={{ height: bars }} className="absolute inset-x-0 bottom-0 z-10 bg-[#0a0a0a]" />

      <motion.div style={{ y: textY, opacity: textO }} className="wrap relative z-20 w-full pb-10 pt-32 md:pb-14">
        <motion.p className="label !text-[var(--fg)]/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 0.2, duration: 1 }}>
          {site.role} — 01
        </motion.p>
        <h1 className="display mt-3 text-[clamp(4rem,19vw,20rem)] leading-[0.85]">
          <span className="block overflow-hidden">
            <motion.span className="block" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.3, delay: D, ease }}>
              Saikumar
            </motion.span>
          </span>
          <span className="sr-only"> — Video Editor</span>
        </h1>

        <motion.div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 0.6, duration: 1, ease }}>
          <p className="max-w-md text-lg text-[var(--fg)]/85">Candid • Reels • Long Form • Ads • Real Estate</p>
          <div className="flex items-center gap-8">
            <Magnetic>
              <button data-cursor="PLAY" onClick={() => open(hero.id, projects.map((p) => p.id))} className="group flex items-center gap-3 whitespace-nowrap rounded-full bg-[var(--fg)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black">
                Watch showreel <span className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden>→</span>
              </button>
            </Magnetic>
            <a href="#work" className="label u !text-[var(--fg)]">View work</a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

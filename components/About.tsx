"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Lines, Reveal } from "./Reveal";

export function About() {
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: box, offset: ["start end", "end start"] });
  const clip = useTransform(p, [0.05, 0.4], ["inset(18% 18% 18% 18%)", "inset(0% 0% 0% 0%)"]);
  const y = useTransform(p, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" className="wrap py-[clamp(5rem,12vw,10rem)]" aria-labelledby="about-h">
      <div className="grid items-center gap-14 md:grid-cols-12">
        <div ref={box} className="md:col-span-5">
          <motion.div style={{ clipPath: clip }} className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-2)]">
            <motion.div style={{ y, scale: 1.15 }} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/saikumar.jpg" alt="Portrait of Saikumar, video editor, seated in a studio" loading="lazy" className="h-full w-full object-cover" />
            </motion.div>
          </motion.div>
          <p className="display mt-5 text-4xl md:text-5xl">Saikumar</p>
          <p className="mt-1 text-base font-bold uppercase tracking-[0.2em] text-[var(--fg)]/70 md:text-lg">Video Editor</p>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <h2 id="about-h" className="display text-[clamp(3rem,7vw,7rem)]"><Lines lines={["The editor", "behind the cut."]} /></h2>
          <Reveal className="mt-10">
            <p className="text-lg leading-relaxed text-[var(--mute)] md:text-xl">
              I&apos;m a video editor focused on turning raw footage into engaging visual stories. From reels and advertisements to long-form content, candid edits and real-estate videos, my approach is built around rhythm, timing and visual storytelling.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

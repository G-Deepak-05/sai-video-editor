"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

/**
 * The scroll-as-timeline effect (clip-path + per-frame video seeking, pinned over 380vh) is the
 * single heaviest thing on the page, and clip-path is a paint property, not a compositor one — doing
 * it every scroll frame across a long pinned section is what made mobile scrolling feel worse than
 * desktop. Phones get a plain autoplaying loop instead; desktop keeps the full scrubbed version.
 */
export function ScrubReel() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setDesktop(!reduce && window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches);
  }, []);
  return desktop ? <ScrubReelDesktop /> : <ScrubReelMobile />;
}

function ScrubReelMobile() {
  const box = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vid.current, sec = box.current;
    if (!v || !sec) return;
    let loaded = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!loaded) { loaded = true; v.src = "/work/scrub-sm.mp4"; v.poster = "/work/scrub-sm.jpg"; v.load(); }
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={box} className="relative aspect-video w-full overflow-hidden bg-black" aria-label="Speed-ramp showreel clip">
      <video ref={vid} className="h-full w-full object-cover" muted loop playsInline preload="none" aria-hidden />
      <div className="absolute inset-0 bg-black/30" />
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="display absolute inset-0 flex items-center justify-center text-center text-[clamp(3rem,13vw,7rem)] mix-blend-difference"
      >
        Cut. Ramp. Land it.
      </motion.p>
      <span className="label absolute bottom-5 left-5 !text-[var(--fg)]">Speed ramp — showreel</span>
    </section>
  );
}

/** Scroll is the timeline: a pinned clip whose playhead is driven by scroll, with an eased "ramp" curve. */
function ScrubReelDesktop() {
  const box = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const tcEl = useRef<HTMLSpanElement>(null);
  const target = useRef(0);
  const near = useRef(false);
  const { scrollYProgress: p } = useScroll({ target: box, offset: ["start start", "end end"] });

  // Speed-ramp curve: linger, surge through the middle, ease out.
  const ramp = (x: number) => (x < 0.25 ? x * 0.6 : x < 0.7 ? 0.15 + (x - 0.25) * 1.6 : 0.87 + (x - 0.7) * 0.43);
  useMotionValueEvent(p, "change", (v) => { target.current = ramp(v); });

  useEffect(() => {
    const v = vid.current, sec = box.current;
    if (!v || !sec) return;
    let raf = 0, cur = 0, loaded = false;

    // Download the (all-intra, seek-friendly) clip only when the section is about to be reached.
    const io = new IntersectionObserver(([e]) => {
      near.current = e.isIntersecting;
      if (e.isIntersecting && !loaded) { loaded = true; v.src = "/work/scrub.mp4"; v.load(); }
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
    }, { rootMargin: "100% 0px" });
    io.observe(sec);
    const pio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { v.poster = "/work/scrub.jpg"; pio.disconnect(); } }, { rootMargin: "100% 0px" });
    pio.observe(sec);

    function loop() {
      raf = 0;
      if (!near.current || !v) return;
      cur += (target.current - cur) * 0.14;
      if (v.duration) {
        const t = Math.min(cur * v.duration, v.duration - 0.05);
        if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t;
        const f = Math.floor(v.currentTime * 24);
        if (tcEl.current) tcEl.current.textContent = `00:${String(Math.floor(f / 24)).padStart(2, "0")}:${String(f % 24).padStart(2, "0")}`;
      }
      raf = requestAnimationFrame(loop);
    }
    return () => { io.disconnect(); pio.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const inset = useTransform(p, [0, 0.15, 0.85, 1], [12, 0, 0, 12]);
  const clip = useTransform(inset, (v) => `inset(${v}% ${v * 0.6}% ${v}% ${v * 0.6}% round ${v * 0.4}px)`);
  const scale = useTransform(p, [0, 1], [1.15, 1]);
  const l1 = useTransform(p, [0.05, 0.15, 0.3, 0.4], [0, 1, 1, 0]);
  const l2 = useTransform(p, [0.4, 0.5, 0.6, 0.7], [0, 1, 1, 0]);
  const l3 = useTransform(p, [0.75, 0.85, 0.95, 1], [0, 1, 1, 1]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <section ref={box} className="relative h-[380vh]" aria-label="Scroll-driven showreel: the page scroll acts as an editing timeline">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.video ref={vid} style={{ scale }} className="h-full w-full object-cover" muted playsInline preload="none" aria-hidden />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[["Cut.", l1], ["Ramp.", l2], ["Land it.", l3]].map(([t, o]) => (
            <motion.p key={t as string} style={{ opacity: o as never }} className="display absolute text-[clamp(4rem,16vw,16rem)] mix-blend-difference">{t as string}</motion.p>
          ))}
        </div>

        <div className="wrap absolute inset-x-0 bottom-6 flex items-center gap-6">
          <span ref={tcEl} className="label tabular-nums !text-[var(--fg)]">00:00:00</span>
          <div className="relative h-px flex-1 bg-white/25">
            <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-[var(--accent)]" />
            <motion.div style={{ left: bar }} className="absolute -top-2 h-4 w-0.5 bg-[var(--accent)]" />
          </div>
          <span className="label !text-[var(--fg)]">Scroll = timeline</span>
        </div>
      </div>
    </section>
  );
}

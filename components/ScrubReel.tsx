"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

/** Scroll is the timeline: a pinned clip whose playhead is driven by scroll, with an eased "ramp" curve. */
export function ScrubReel() {
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
    const small = window.matchMedia("(max-width: 767px)").matches;

    // Download the (all-intra, seek-friendly) clip only when the section is about to be reached.
    const io = new IntersectionObserver(([e]) => {
      near.current = e.isIntersecting;
      if (e.isIntersecting && !loaded) { loaded = true; v.src = small ? "/work/scrub-sm.mp4" : "/work/scrub.mp4"; v.load(); }
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
    }, { rootMargin: "100% 0px" });
    io.observe(sec);
    const pio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { v.poster = small ? "/work/scrub-sm.jpg" : "/work/scrub.jpg"; pio.disconnect(); } }, { rootMargin: "100% 0px" });
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

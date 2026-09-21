"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";

/** Speed-ramp marquee: drifts slowly, surges with scroll velocity, and flips direction when you scroll up. */
export function Marquee({ words = ["Cut", "Ramp", "Sync", "Story"] }: { words?: string[] }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(vel, [-2000, 0, 2000], [-6, 0, 6]);
  const dir = useRef(1);
  const ref = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_, dt) => {
    if (!visible.current) return;
    const b = boost.get();
    if (b !== 0) dir.current = b < 0 ? -1 : 1;
    const move = dir.current * (0.6 + Math.abs(b) * 2.2) * (dt / 16);
    const w = (ref.current?.scrollWidth ?? 2) / 2;
    let n = x.get() - move;
    if (n <= -w) n += w;
    if (n > 0) n -= w;
    x.set(n);
  });

  const row = [...words, ...words, ...words].map((w, i) => (
    <span key={i} className="flex items-center gap-8 pr-8">
      <span className={`display text-[clamp(4rem,14vw,13rem)] ${i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_var(--fg)]" : ""}`}>{w}</span>
      <span className="text-[var(--accent)]" aria-hidden>●</span>
    </span>
  ));

  return (
    <div ref={wrap} className="overflow-hidden py-6" aria-hidden>
      <motion.div ref={ref} style={{ x }} className="flex w-max whitespace-nowrap">
        {row}{row}
      </motion.div>
    </div>
  );
}

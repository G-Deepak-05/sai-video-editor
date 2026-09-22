"use client";
import { Lines } from "./Reveal";
import { useContent } from "./Shell";

export function Craft() {
  const { craftHeading, craft } = useContent();
  return (
    <section className="wrap py-[clamp(5rem,12vw,10rem)]" aria-labelledby="craft-h">
      <h2 id="craft-h" className="display text-[clamp(3rem,9vw,9rem)]"><Lines lines={[craftHeading]} /></h2>
      <ul className="mt-12 grid gap-x-10 sm:grid-cols-2">
        {craft.map((c, i) => (
          <li key={c} className="group flex items-baseline justify-between border-t border-[var(--line)] py-5 transition-colors hover:border-[var(--accent)]">
            <span className="display text-3xl transition-transform duration-500 group-hover:translate-x-3 md:text-5xl">{c}</span>
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

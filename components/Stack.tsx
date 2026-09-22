"use client";
import { Lines, Reveal } from "./Reveal";
import { useContent } from "./Shell";
import type { ToolItem } from "@/lib/content";

function Row({ items, reverse = false, label }: { items: ToolItem[]; reverse?: boolean; label: string }) {
  if (!items.length) return null;
  // repeat enough times that one half always overfills the viewport, then animate -50%
  const reps = Math.max(2, Math.ceil(10 / items.length));
  const half = Array.from({ length: reps }).flatMap(() => items);
  const cell = (t: ToolItem, i: number) => (
    <li key={i} className="group flex shrink-0 items-center gap-4 px-8 md:px-12">
      {t.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.logo} alt="" width={48} height={48} className="h-10 w-10 rounded-lg object-contain opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0 md:h-14 md:w-14" />
      )}
      <span className="display whitespace-nowrap text-2xl text-[var(--fg)]/50 transition-colors group-hover:text-[var(--fg)] md:text-4xl">{t.name}</span>
    </li>
  );
  return (
    <div className="group/row overflow-hidden border-y border-[var(--line)] py-6" role="group" aria-label={label}>
      <ul className={`flex w-max ${reverse ? "animate-[marq-r_45s_linear_infinite]" : "animate-[marq_45s_linear_infinite]"} group-hover/row:[animation-play-state:paused]`}>
        {[...half, ...half].map(cell)}
      </ul>
    </div>
  );
}

export function Stack() {
  const { stackHeading, stackBody, tools, aiTools } = useContent();
  if (!tools.length && !aiTools.length) return null;
  return (
    <section className="bg-[var(--bg-2)] py-[clamp(5rem,12vw,10rem)]" aria-labelledby="stack-h">
      <div className="wrap">
        <h2 id="stack-h" className="display text-[clamp(3rem,9vw,9rem)]"><Lines lines={stackHeading} /></h2>
        <Reveal className="mt-10 max-w-xl">
          <p className="text-lg text-[var(--mute)] md:text-xl">{stackBody}</p>
        </Reveal>
      </div>
      <div className="mt-14 space-y-6">
        <Row items={tools} label="Editing and design software" />
        <Row items={aiTools} reverse label="AI tools" />
      </div>
      <style>{`@keyframes marq{to{transform:translateX(-50%)}}@keyframes marq-r{from{transform:translateX(-50%)}to{transform:translateX(0)}}`}</style>
    </section>
  );
}

"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/lib/site";
import { PreviewVideo } from "./PreviewVideo";
import { Lines } from "./Reveal";
import { useProjects, useViewer } from "./Shell";

export function Services() {
  const [active, setActive] = useState<string>(services[0].id);
  const { open } = useViewer();
  const projects = useProjects();
  const s = services.find((x) => x.id === active)!;
  // Preview comes from real work only; a service with no matching clip shows text alone.
  const clip = projects.find((p) => p.categories.includes(s.id));

  return (
    <section id="services" className="relative bg-[var(--bg-2)] py-[clamp(5rem,12vw,10rem)]" aria-labelledby="services-h">
      <div className="wrap">
        <h2 id="services-h" className="display text-[clamp(3rem,9vw,9rem)]"><Lines lines={["What I edit"]} /></h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <ul className="lg:col-span-7" onMouseLeave={() => {}}>
            {services.map((x, i) => (
              <li key={x.id} className="border-t border-[var(--line)] last:border-b">
                <button
                  onMouseEnter={() => setActive(x.id)}
                  onFocus={() => setActive(x.id)}
                  onClick={() => setActive(x.id)}
                  aria-pressed={active === x.id}
                  data-cursor=""
                  className={`display flex w-full items-baseline gap-4 py-3 text-left text-[clamp(2.6rem,7vw,6.5rem)] transition-all duration-500 ${active === x.id ? "translate-x-4 text-[var(--fg)]" : "text-[var(--fg)]/45"}`}
                >
                  <span className="label !text-[var(--mute)]">{String(i + 1).padStart(2, "0")}</span>
                  {x.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                {clip && (
                  <button onClick={() => open(clip.id, projects.filter((p) => p.categories.includes(s.id)).map((p) => p.id))} data-cursor="PLAY" className="relative mb-6 block aspect-video w-full overflow-hidden bg-black" aria-label={`Watch ${s.label} example`}>
                    {clip.preview ? (
                      <PreviewVideo src={clip.preview} poster={clip.poster} eager className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={clip.poster} alt="" className="h-full w-full object-cover" />
                    )}
                  </button>
                )}
                <p className="text-lg text-[var(--fg)]/85">{s.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.points.map((t) => <li key={t} className="label rounded-full border border-[var(--line)] px-3 py-1.5">{t}</li>)}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

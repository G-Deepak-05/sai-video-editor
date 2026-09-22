"use client";
import type { Project } from "@/lib/projects";
import { Lines } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { useContent } from "./Shell";

/**
 * No live Instagram feed is fetched — this is a curated strip of the portfolio's own posters.
 * The CTA only appears once an Instagram URL is set.
 */
export function Feed({ projects }: { projects: Project[] }) {
  const { feedHeading, contact } = useContent();
  const picks = [...projects.filter((p) => p.orientation === "portrait").slice(0, 1), ...projects.filter((p) => p.orientation === "landscape").slice(0, 4)];
  if (!picks.length) return null;
  return (
    <section className="py-[clamp(5rem,10vw,9rem)]" aria-labelledby="feed-h">
      <div className="wrap">
        <h2 id="feed-h" className="display text-[clamp(3rem,9vw,9rem)]"><Lines lines={feedHeading} /></h2>
      </div>
      <div className="wrap mt-12 flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none]">
        {picks.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id} src={p.poster} alt={`${p.title} — still frame`} loading="lazy" className={`h-[52vw] max-h-[420px] shrink-0 object-cover ${p.orientation === "portrait" ? "aspect-[9/16]" : "aspect-[4/5]"}`} />
        ))}
      </div>
      {contact.instagram && (
        <div className="wrap mt-10">
          <Magnetic>
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" data-cursor="OPEN" className="label u !text-[var(--fg)]">View more on Instagram →</a>
          </Magnetic>
        </div>
      )}
    </section>
  );
}

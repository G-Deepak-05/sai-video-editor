import type { Project } from "@/lib/projects";
import { site } from "@/lib/site";
import { Lines } from "./Reveal";
import { Magnetic } from "./Magnetic";

/**
 * No Instagram URL/content was supplied, so this is a static curated strip of the portfolio
 * posters. The CTA only appears once site.contact.instagram is set.
 */
export function Feed({ projects }: { projects: Project[] }) {
  const picks = [...projects.filter((p) => p.orientation === "portrait").slice(0, 1), ...projects.filter((p) => p.orientation === "landscape").slice(0, 4)];
  if (!picks.length) return null;
  return (
    <section className="py-[clamp(5rem,10vw,9rem)]" aria-labelledby="feed-h">
      <div className="wrap">
        <h2 id="feed-h" className="display text-[clamp(3rem,9vw,9rem)]"><Lines lines={["More from", "the feed"]} /></h2>
      </div>
      <div className="wrap mt-12 flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none]">
        {picks.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id} src={p.poster} alt={`${p.title} — still frame`} loading="lazy" className={`h-[52vw] max-h-[420px] shrink-0 object-cover ${p.orientation === "portrait" ? "aspect-[9/16]" : "aspect-[4/5]"}`} />
        ))}
      </div>
      {site.contact.instagram && (
        <div className="wrap mt-10">
          <Magnetic>
            <a href={site.contact.instagram} target="_blank" rel="noopener noreferrer" data-cursor="OPEN" className="label u !text-[var(--fg)]">View more on Instagram →</a>
          </Magnetic>
        </div>
      )}
    </section>
  );
}

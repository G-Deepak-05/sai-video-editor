"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { projects } from "@/lib/projects";
import { services } from "@/lib/site";
import { ProjectCard } from "./ProjectCard";
import { Lines } from "./Reveal";
import { useViewer } from "./Shell";

export function Work() {
  const [filter, setFilter] = useState<string>("all");
  const { open } = useViewer();

  // Only categories that at least one real project supports.
  const filters = useMemo(
    () => [{ id: "all", label: "All" }, ...services.filter((s) => projects.some((p) => p.categories.includes(s.id))).map((s) => ({ id: s.id, label: s.label }))],
    [],
  );
  const list = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter as never));
  const ids = list.map((p) => p.id);

  return (
    <section id="work" className="wrap pb-[clamp(5rem,12vw,10rem)]" aria-labelledby="work-h">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 id="work-h" className="display text-[clamp(3rem,9vw,9rem)]"><Lines lines={["Selected work"]} /></h2>
        <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-x-6 gap-y-2">
          {filters.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
              className={`label u transition-colors ${filter === f.id ? "!text-[var(--accent)]" : "hover:!text-[var(--fg)]"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <LayoutGroup>
        <motion.div layout className="mt-16 grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onOpen={() => open(p.id, ids)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </section>
  );
}

"use client";
import { useState } from "react";
import type { Project } from "@/lib/projects";
import type { SiteContent } from "@/lib/content";
import { ProjectsPanel } from "./ProjectsPanel";
import { ContentPanel } from "./ContentPanel";
import { OfflineNotice } from "@/components/OfflineNotice";

export function AdminApp({ initialProjects, initialContent, storageError }: { initialProjects: Project[]; initialContent: SiteContent; storageError: string }) {
  const [tab, setTab] = useState<"projects" | "content">("projects");

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); location.reload(); }

  return (
    <main className="mx-auto max-w-5xl px-5 pt-10 md:px-8">
      <OfflineNotice />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Admin</p>
          <h1 className="display text-5xl md:text-7xl">Edit site</h1>
        </div>
        <div className="flex gap-6"><a href="/" target="_blank" className="label u !text-[var(--fg)]">View site ↗</a><button onClick={logout} className="label u !text-[var(--fg)]">Log out</button></div>
      </header>

      <div role="tablist" aria-label="Admin section" className="mt-8 flex gap-8 border-b border-[var(--line)]">
        {([["projects", "Projects & media"], ["content", "Every other part of the site"]] as const).map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`pb-3 text-sm font-bold uppercase tracking-[0.14em] transition-colors ${tab === id ? "border-b-2 border-[var(--accent)] text-[var(--fg)]" : "text-[var(--mute)] hover:text-[var(--fg)]"}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Both panels stay mounted so switching tabs never loses unsaved edits. */}
      <div className="mt-10" hidden={tab !== "projects"}>
        <ProjectsPanel initial={initialProjects} services={initialContent.services} storageError={storageError} />
      </div>
      <div className="mt-10" hidden={tab !== "content"}>
        <ContentPanel initial={initialContent} storageError={storageError} />
      </div>
    </main>
  );
}

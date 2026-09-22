"use client";
import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import type { ServiceCopy } from "@/lib/content";
import { uploadFile, capturePoster, useJobs, inputCls } from "./adminApi";

export function ProjectsPanel({ initial, services, storageError }: { initial: Project[]; services: ServiceCopy[]; storageError: string }) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const { jobs, track } = useJobs();
  const coverFor = useRef<string | null>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const edit = (id: string, patch: Partial<Project>) => { setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p))); setDirty(true); };
  const move = (i: number, d: number) => setProjects((ps) => { const a = [...ps], j = i + d; if (j < 0 || j >= a.length) return ps; [a[i], a[j]] = [a[j], a[i]]; setDirty(true); return a; });
  const remove = (id: string) => { if (confirm("Remove this project from the site? (The files stay in storage.)")) { setProjects((ps) => ps.filter((p) => p.id !== id)); setDirty(true); } };
  const toggleCat = (p: Project, c: string) => edit(p.id, { categories: p.categories.includes(c as never) ? p.categories.filter((x) => x !== c) : [...p.categories, c as never] });

  async function addVideo(file: File, cover?: File) {
    const t = track(file.name);
    try {
      let posterBlob: Blob, w = 1920, h = 1080;
      if (cover) posterBlob = cover;
      else ({ blob: posterBlob, w, h } = await capturePoster(file));
      const src = await uploadFile(file, file.name, (n) => t.pct(Math.round(n * 0.95)));
      const poster = await uploadFile(posterBlob, "cover.jpg", () => {});
      const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "New project";
      const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}-${Date.now().toString(36)}`;
      setProjects((ps) => [{ id, title, description: "", categories: [], orientation: h > w ? "portrait" : "landscape", poster, src }, ...ps]);
      setDirty(true); t.done();
    } catch (e) { t.fail(e instanceof Error ? e.message : "Upload failed."); }
  }

  async function replaceCover(id: string, file: File) {
    const t = track(`Cover: ${file.name}`);
    try { edit(id, { poster: await uploadFile(file, file.name, t.pct) }); t.done(); } catch (e) { t.fail(e instanceof Error ? e.message : "Upload failed."); }
  }

  async function save() {
    setSaving(true); setStatus("");
    const res = await fetch("/api/admin/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(projects) });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) { setDirty(false); setStatus(`Saved — ${data.count} projects are live.`); }
    else setStatus(data.error || "Save failed.");
  }

  return (
    <div className="pb-28">
      <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f && coverFor.current) replaceCover(coverFor.current, f); e.target.value = ""; }} />

      {storageError && <p role="alert" className="mb-6 rounded-lg border border-[var(--accent)] p-4 text-sm">Storage isn&apos;t reachable: {storageError}. Showing the built-in list; saving will fail until this is fixed.</p>}

      <section className="rounded-2xl border border-dashed border-[var(--line)] p-6">
        <h2 className="display text-3xl">Add a video</h2>
        <p className="mt-2 text-[var(--mute)]">MP4 works best (H.264, up to 600 MB). A cover frame is taken automatically — or choose your own image.</p>
        <form className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const v = fd.get("video") as File; const c = fd.get("cover") as File; if (v?.size) { addVideo(v, c?.size ? c : undefined); e.currentTarget.reset(); } }}>
          <label className="flex-1"><span className="label">Video</span><input name="video" type="file" accept="video/mp4,video/quicktime,video/webm" required className={inputCls} /></label>
          <label className="flex-1"><span className="label">Cover image (optional)</span><input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className={inputCls} /></label>
          <button className="rounded-full bg-[var(--fg)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-black">Upload</button>
        </form>
        {jobs.map((j) => (
          <div key={j.id} className="mt-4 text-sm">
            <div className="flex justify-between"><span className="truncate">{j.label}</span><span>{j.error ? "failed" : j.done ? "done ✓" : `${j.pct}%`}</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded bg-white/10"><div className={`h-full transition-all ${j.error ? "bg-[var(--accent)]" : "bg-[var(--fg)]"}`} style={{ width: `${j.pct}%` }} /></div>
            {j.error && <p role="alert" className="mt-1 text-[var(--accent)]">{j.error}</p>}
          </div>
        ))}
      </section>

      <ul className="mt-10 space-y-5">
        {projects.map((p, i) => (
          <li key={p.id} className="grid gap-5 rounded-2xl border border-[var(--line)] p-5 md:grid-cols-[220px_1fr]">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.poster} alt="" className={`w-full rounded-lg object-cover ${p.orientation === "portrait" ? "aspect-[9/14]" : "aspect-video"}`} />
              <button onClick={() => { coverFor.current = p.id; coverInput.current?.click(); }} className="label u mt-2 !text-[var(--fg)]">Replace cover</button>
            </div>
            <div className="space-y-3">
              <input aria-label="Title" className={`${inputCls} text-xl font-semibold`} value={p.title} maxLength={120} onChange={(e) => edit(p.id, { title: e.target.value })} />
              <textarea aria-label="Description" className={inputCls} rows={2} maxLength={400} placeholder="Short description" value={p.description} onChange={(e) => edit(p.id, { description: e.target.value })} />
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <button key={s.id} type="button" aria-pressed={p.categories.includes(s.id)} onClick={() => toggleCat(p, s.id)}
                    className={`label rounded-full border px-3 py-1.5 transition-colors ${p.categories.includes(s.id) ? "border-[var(--fg)] !text-[var(--fg)]" : "border-[var(--line)]"}`}>{s.label}</button>
                ))}
              </div>
              <div className="flex items-center gap-5 pt-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="label u !text-[var(--fg)] disabled:opacity-30">↑ Up</button>
                <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} className="label u !text-[var(--fg)] disabled:opacity-30">↓ Down</button>
                <button onClick={() => remove(p.id)} className="label u ml-auto !text-[var(--accent)]">Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--line)] bg-[#0a0a0a]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <p className="text-sm" role="status">{status || (dirty ? "You have unsaved changes." : "All changes saved.")}</p>
          <button onClick={save} disabled={!dirty || saving} className="rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-black disabled:opacity-40">{saving ? "Saving…" : "Save & publish"}</button>
        </div>
      </div>
    </div>
  );
}

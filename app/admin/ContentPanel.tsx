"use client";
import { useState } from "react";
import type { SiteContent, ToolItem, Testimonial } from "@/lib/content";
import { uploadFile, useJobs, inputCls } from "./adminApi";

const label = "label mb-1.5 block";
const field = "mb-6";

function Text({ v, onChange, max, big = false }: { v: string; onChange: (s: string) => void; max: number; big?: boolean }) {
  return <input className={`${inputCls} ${big ? "text-lg font-semibold" : ""}`} value={v} maxLength={max} onChange={(e) => onChange(e.target.value)} />;
}
function Area({ v, onChange, max, rows = 3 }: { v: string; onChange: (s: string) => void; max: number; rows?: number }) {
  return <textarea className={inputCls} rows={rows} value={v} maxLength={max} onChange={(e) => onChange(e.target.value)} />;
}

/** Up to 3 short heading lines (rendered one per line, e.g. "Have a story" / "to tell?"). */
function Lines({ v, onChange }: { v: string[]; onChange: (v: string[]) => void }) {
  const lines = v.length ? v : [""];
  return (
    <div className="space-y-2">
      {lines.map((l, i) => (
        <div key={i} className="flex gap-2">
          <input className={inputCls} value={l} maxLength={60} onChange={(e) => onChange(lines.map((x, j) => (j === i ? e.target.value : x)))} />
          {lines.length > 1 && <button type="button" onClick={() => onChange(lines.filter((_, j) => j !== i))} className="label u shrink-0 !text-[var(--accent)]">Remove</button>}
        </div>
      ))}
      {lines.length < 3 && <button type="button" onClick={() => onChange([...lines, ""])} className="label u !text-[var(--fg)]">+ Add line</button>}
    </div>
  );
}

/** A plain reorderable list of short strings (The Craft). */
function StringList({ v, onChange, max = 40 }: { v: string[]; onChange: (v: string[]) => void; max?: number }) {
  return (
    <div className="space-y-2">
      {v.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input className={inputCls} value={item} maxLength={max} onChange={(e) => onChange(v.map((x, j) => (j === i ? e.target.value : x)))} />
          <button type="button" onClick={() => onChange(v.filter((_, j) => j !== i))} className="label u shrink-0 !text-[var(--accent)]">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...v, ""])} className="label u !text-[var(--fg)]">+ Add</button>
    </div>
  );
}

/** Tool/AI-tool rows: a name plus an optional uploaded logo. Used for both marquee rows. */
function ToolList({ v, onChange }: { v: ToolItem[]; onChange: (v: ToolItem[]) => void }) {
  const { jobs, track } = useJobs();
  async function setLogo(i: number, file: File) {
    const t = track(`Logo: ${file.name}`);
    try { const logo = await uploadFile(file, file.name, t.pct); onChange(v.map((x, j) => (j === i ? { ...x, logo } : x))); t.done(); }
    catch (e) { t.fail(e instanceof Error ? e.message : "Upload failed."); }
  }
  return (
    <div className="space-y-3">
      {v.map((t, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-[var(--line)] p-3">
          {t.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.logo} alt="" className="h-9 w-9 shrink-0 rounded object-contain" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white/5 text-xs text-[var(--mute)]">—</span>
          )}
          <input className={`${inputCls} flex-1`} placeholder="Name" value={t.name} maxLength={60} onChange={(e) => onChange(v.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
          <label className="label u shrink-0 cursor-pointer !text-[var(--fg)]">
            Logo
            <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setLogo(i, f); e.target.value = ""; }} />
          </label>
          <button type="button" onClick={() => onChange(v.filter((_, j) => j !== i))} className="label u shrink-0 !text-[var(--accent)]">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...v, { name: "" }])} className="label u !text-[var(--fg)]">+ Add tool</button>
      {jobs.map((j) => (
        <div key={j.id} className="text-xs text-[var(--mute)]">{j.label} — {j.error ?? (j.done ? "done ✓" : `${j.pct}%`)}</div>
      ))}
    </div>
  );
}

function TestimonialList({ v, onChange }: { v: Testimonial[]; onChange: (v: Testimonial[]) => void }) {
  return (
    <div className="space-y-3">
      {v.map((t, i) => (
        <div key={i} className="rounded-lg border border-[var(--line)] p-3">
          <textarea className={inputCls} rows={2} placeholder="Quote" value={t.quote} maxLength={500} onChange={(e) => onChange(v.map((x, j) => (j === i ? { ...x, quote: e.target.value } : x)))} />
          <div className="mt-2 flex gap-2">
            <input className={inputCls} placeholder="Who said it" value={t.by} maxLength={100} onChange={(e) => onChange(v.map((x, j) => (j === i ? { ...x, by: e.target.value } : x)))} />
            <button type="button" onClick={() => onChange(v.filter((_, j) => j !== i))} className="label u shrink-0 !text-[var(--accent)]">Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...v, { quote: "", by: "" }])} className="label u !text-[var(--fg)]">+ Add testimonial</button>
      <p className="text-xs text-[var(--mute)]">Real testimonials only — this section stays hidden while the list is empty.</p>
    </div>
  );
}

export function ContentPanel({ initial, storageError }: { initial: SiteContent; storageError: string }) {
  const [c, setC] = useState<SiteContent>(initial);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const { jobs: photoJobs, track: trackPhoto } = useJobs();

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => { setC((cur) => ({ ...cur, [key]: value })); setDirty(true); };
  const setContact = <K extends keyof SiteContent["contact"]>(key: K, value: string) => { setC((cur) => ({ ...cur, contact: { ...cur.contact, [key]: value } })); setDirty(true); };
  const setService = (id: string, patch: Partial<SiteContent["services"][number]>) => set("services", c.services.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  async function setPhoto(file: File) {
    const t = trackPhoto(file.name);
    try { set("aboutPhoto", await uploadFile(file, file.name, t.pct)); t.done(); } catch (e) { t.fail(e instanceof Error ? e.message : "Upload failed."); }
  }

  async function save() {
    setSaving(true); setStatus("");
    const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) { setDirty(false); setStatus("Saved — the site is updated."); }
    else setStatus(data.error || "Save failed.");
  }

  return (
    <div className="grid gap-12 pb-28 md:grid-cols-2">
      {storageError && <p role="alert" className="rounded-lg border border-[var(--accent)] p-4 text-sm md:col-span-2">Storage isn&apos;t reachable: {storageError}. Showing the built-in copy; saving will fail until this is fixed.</p>}

      <section>
        <h2 className="display text-3xl">Identity &amp; SEO</h2>
        <div className={`${field} mt-5`}><span className={label}>Name</span><Text v={c.name} max={60} onChange={(v) => set("name", v)} /></div>
        <div className={field}><span className={label}>Role</span><Text v={c.role} max={60} onChange={(v) => set("role", v)} /></div>
        <div className={field}><span className={label}>Search-result title</span><Text v={c.seoTitle} max={70} onChange={(v) => set("seoTitle", v)} /></div>
        <div className={field}><span className={label}>Search-result description</span><Area v={c.seoDescription} max={200} onChange={(v) => set("seoDescription", v)} /></div>
      </section>

      <section>
        <h2 className="display text-3xl">Hero</h2>
        <div className={`${field} mt-5`}><span className={label}>Supporting line</span><Text v={c.heroTagline} max={140} onChange={(v) => set("heroTagline", v)} /></div>
        <div className={field}><span className={label}>Primary button</span><Text v={c.heroCtaPrimary} max={40} onChange={(v) => set("heroCtaPrimary", v)} /></div>
        <div className={field}><span className={label}>Secondary link</span><Text v={c.heroCtaSecondary} max={40} onChange={(v) => set("heroCtaSecondary", v)} /></div>
      </section>

      <section>
        <h2 className="display text-3xl">Intro</h2>
        <div className={`${field} mt-5`}><span className={label}>Heading</span><Lines v={c.introHeading} onChange={(v) => set("introHeading", v)} /></div>
        <div className={field}><span className={label}>Paragraph</span><Area v={c.introBody} max={1000} rows={5} onChange={(v) => set("introBody", v)} /></div>
      </section>

      <section>
        <h2 className="display text-3xl">About</h2>
        <div className="mt-5 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.aboutPhoto} alt="" className="h-24 w-20 rounded-lg object-cover" />
          <label className="label u cursor-pointer !text-[var(--fg)]">
            Replace photo
            <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(f); e.target.value = ""; }} />
          </label>
        </div>
        {photoJobs.map((j) => <p key={j.id} className="mt-2 text-xs text-[var(--mute)]">{j.error ?? (j.done ? "Uploaded ✓" : `Uploading… ${j.pct}%`)}</p>)}
        <div className={`${field} mt-5`}><span className={label}>Heading</span><Lines v={c.aboutHeading} onChange={(v) => set("aboutHeading", v)} /></div>
        <div className={field}><span className={label}>Paragraph</span><Area v={c.aboutBody} max={1000} rows={5} onChange={(v) => set("aboutBody", v)} /></div>
      </section>

      <section>
        <h2 className="display text-3xl">Selected work</h2>
        <div className={`${field} mt-5`}><span className={label}>Section heading</span><Text v={c.workHeading} max={60} onChange={(v) => set("workHeading", v)} /></div>
      </section>

      <section>
        <h2 className="display text-3xl">The craft</h2>
        <div className={`${field} mt-5`}><span className={label}>Section heading</span><Text v={c.craftHeading} max={60} onChange={(v) => set("craftHeading", v)} /></div>
        <div className={field}><span className={label}>Skills list</span><StringList v={c.craft} onChange={(v) => set("craft", v)} /></div>
      </section>

      <section className="md:col-span-2">
        <h2 className="display text-3xl">What I edit</h2>
        <div className={`${field} mt-5 max-w-md`}><span className={label}>Section heading</span><Text v={c.servicesHeading} max={60} onChange={(v) => set("servicesHeading", v)} /></div>
        <p className="mb-4 text-xs text-[var(--mute)]">The 7 categories are fixed (they drive the project filters) — their name, description and tags are editable.</p>
        <div className="grid gap-4 lg:grid-cols-2">
          {c.services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-[var(--line)] p-4">
              <p className="label mb-2">{s.id}</p>
              <div className="mb-3"><Text v={s.label} max={40} big onChange={(v) => setService(s.id, { label: v })} /></div>
              <div className="mb-3"><Area v={s.blurb} max={320} rows={3} onChange={(v) => setService(s.id, { blurb: v })} /></div>
              <span className="label mb-1.5 block">Tags (comma separated)</span>
              <Text v={s.points.join(", ")} max={200} onChange={(v) => setService(s.id, { points: v.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 8) })} />
            </div>
          ))}
        </div>
      </section>

      <section className="md:col-span-2">
        <h2 className="display text-3xl">Tools of the trade</h2>
        <div className={`${field} mt-5`}><span className={label}>Heading</span><Lines v={c.stackHeading} onChange={(v) => set("stackHeading", v)} /></div>
        <div className={field}><span className={label}>Paragraph</span><Area v={c.stackBody} max={500} rows={3} onChange={(v) => set("stackBody", v)} /></div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div><span className={label}>Editing &amp; design software</span><ToolList v={c.tools} onChange={(v) => set("tools", v)} /></div>
          <div><span className={label}>AI tools</span><ToolList v={c.aiTools} onChange={(v) => set("aiTools", v)} /></div>
        </div>
      </section>

      <section>
        <h2 className="display text-3xl">More from the feed</h2>
        <div className={`${field} mt-5`}><span className={label}>Heading</span><Lines v={c.feedHeading} onChange={(v) => set("feedHeading", v)} /></div>
      </section>

      <section>
        <h2 className="display text-3xl">Testimonials</h2>
        <div className="mt-5"><TestimonialList v={c.testimonials} onChange={(v) => set("testimonials", v)} /></div>
      </section>

      <section className="md:col-span-2">
        <h2 className="display text-3xl">Contact</h2>
        <div className={`${field} mt-5 max-w-md`}><span className={label}>Heading</span><Lines v={c.contactHeading} onChange={(v) => set("contactHeading", v)} /></div>
        <div className={`${field} max-w-md`}><span className={label}>Supporting line</span><Area v={c.contactSubtext} max={300} rows={2} onChange={(v) => set("contactSubtext", v)} /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div><span className={label}>Email</span><Text v={c.contact.email} max={200} onChange={(v) => setContact("email", v)} /></div>
          <div><span className={label}>Phone</span><Text v={c.contact.phone} max={40} onChange={(v) => setContact("phone", v)} /></div>
          <div><span className={label}>WhatsApp link (https://wa.me/…)</span><Text v={c.contact.whatsapp} max={600} onChange={(v) => setContact("whatsapp", v)} /></div>
          <div><span className={label}>Instagram URL</span><Text v={c.contact.instagram} max={600} onChange={(v) => setContact("instagram", v)} /></div>
          <div><span className={label}>YouTube URL</span><Text v={c.contact.youtube} max={600} onChange={(v) => setContact("youtube", v)} /></div>
          <div><span className={label}>LinkedIn URL</span><Text v={c.contact.linkedin} max={600} onChange={(v) => setContact("linkedin", v)} /></div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--line)] bg-[#0a0a0a]/95 backdrop-blur md:col-span-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <p className="text-sm" role="status">{status || (dirty ? "You have unsaved changes." : "All changes saved.")}</p>
          <button onClick={save} disabled={!dirty || saving} className="rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-black disabled:opacity-40">{saving ? "Saving…" : "Save & publish"}</button>
        </div>
      </div>
    </div>
  );
}

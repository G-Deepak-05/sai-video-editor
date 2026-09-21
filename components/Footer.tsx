import { site } from "@/lib/site";

const link = "u text-base font-bold uppercase tracking-[0.16em] text-[var(--fg)] md:text-lg";

export function Footer() {
  return (
    <footer className="wrap border-t border-[var(--line)] pb-10 pt-16 md:pt-24">
      <p className="display text-[clamp(4rem,15vw,15rem)] leading-[0.85]">{site.name}</p>
      <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p className="text-lg font-bold uppercase tracking-[0.2em] text-[var(--fg)]/70 md:text-xl">{site.role}</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-10 gap-y-4">
          {[["Work", "#work"], ["Services", "#services"], ["About", "#about"], ["Contact", "#contact"]].map(([l, h]) => (
            <a key={h} href={h} className={link}>{l}</a>
          ))}
          {([["Instagram", site.contact.instagram], ["YouTube", site.contact.youtube], ["LinkedIn", site.contact.linkedin]] as const).map(([l, h]) => h && <a key={l} href={h} className={link} target="_blank" rel="noopener noreferrer">{l}</a>)}
          {site.contact.email && <a href={`mailto:${site.contact.email}`} className={link}>Email</a>}
        </nav>
      </div>
      <p className="mt-12 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--mute)]">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
    </footer>
  );
}

import type { Metadata } from "next";
import { Lines, Reveal } from "@/components/Reveal";
import { Magnetic } from "@/components/Magnetic";

export const metadata: Metadata = { title: "Forbidden", robots: { index: false, follow: false } };

/**
 * Renders when `forbidden()` is thrown (see app/admin/page.tsx) — today that's only the admin
 * login lockout after repeated failed attempts. Real 403 status, via Next's `forbidden.tsx` convention.
 */
export default function Forbidden() {
  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-24 md:px-12">
      <div className="pointer-events-none absolute inset-0 border-y border-dashed border-white/10" aria-hidden />
      <a href="/" className="label u absolute left-6 top-8 !text-[var(--fg)] md:left-12">← Saikumar</a>

      <div className="mx-auto w-full max-w-2xl">
        <p className="display text-7xl text-[var(--accent)] md:text-8xl">403</p>
        <h1 className="display mt-2 text-[clamp(2.75rem,9vw,6rem)] leading-[0.9]">
          <Lines lines={["Cut.", "This edit bay is locked."]} />
        </h1>
        <Reveal delay={0.3} className="mt-6">
          <p className="max-w-md text-lg text-[var(--mute)]">
            Too many attempts from here, so it&apos;s locked for about 15 minutes. Grab a coffee and try again shortly.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-10">
          <Magnetic>
            <a href="/" className="group inline-flex items-center gap-3 rounded-full bg-[var(--fg)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black">
              Back to the reel <span className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden>→</span>
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </main>
  );
}

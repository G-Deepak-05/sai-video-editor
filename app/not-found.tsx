import type { Metadata } from "next";
import { Lines, Reveal } from "@/components/Reveal";
import { Magnetic } from "@/components/Magnetic";
import { NotFoundPath } from "./NotFoundPath";

export const metadata: Metadata = { title: "Scene not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-24 md:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-6 pt-8 opacity-40 md:px-12" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => <span key={i} className="h-3 w-5 rounded-sm bg-white/10" />)}
      </div>

      <a href="/" className="label u absolute left-6 top-8 !text-[var(--fg)] md:left-12">← Saikumar</a>

      <div className="mx-auto w-full max-w-2xl">
        <p className="display text-7xl text-[var(--accent)] md:text-8xl">404</p>
        <h1 className="display mt-2 text-[clamp(2.75rem,9vw,6rem)] leading-[0.9]">
          <Lines lines={["That scene didn't", "make the final cut."]} />
        </h1>
        <Reveal delay={0.3} className="mt-6">
          <p className="max-w-md text-lg text-[var(--mute)]">
            The page you&apos;re looking for got left on the cutting-room floor — wrong link, or it moved.
          </p>
          <NotFoundPath />
        </Reveal>

        <Reveal delay={0.45} className="mt-10 flex flex-wrap items-center gap-8">
          <Magnetic>
            <a href="/" className="group inline-flex items-center gap-3 rounded-full bg-[var(--fg)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black">
              Back to the reel <span className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden>→</span>
            </a>
          </Magnetic>
          <a href="/#work" className="label u !text-[var(--fg)]">View the work</a>
        </Reveal>
      </div>
    </main>
  );
}

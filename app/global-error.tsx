"use client";
// global-error replaces the root layout entirely when it renders, so — per Next's convention —
// it defines its own <html>/<body>, re-imports fonts and global styles, and stays dependency-light
// (no Motion, no context) since this is the last-resort fallback and needs to be as hard to break
// as possible.
import { Anton, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain">
        <title>Something jammed — Saikumar</title>
        <main className="flex min-h-screen flex-col justify-center px-6 py-24 md:px-12">
          <div className="mx-auto w-full max-w-2xl">
            <p className="display text-7xl text-[var(--accent)] md:text-8xl">500</p>
            <h1 className="display mt-2 text-[clamp(2.75rem,9vw,6rem)] leading-[0.9]">Something jammed in the gate.</h1>
            <p className="mt-6 max-w-md text-lg text-[var(--mute)]">A frame got stuck mid-run on my end, not yours. Try running it again.</p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <button onClick={() => retry()} className="rounded-full bg-[var(--fg)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black">
                Try again
              </button>
              <a href="/" className="label u !text-[var(--fg)]">Back to the reel</a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

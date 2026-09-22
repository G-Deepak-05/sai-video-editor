"use client";
import { useEffect, useState } from "react";

/**
 * A full-screen takeover shown when the browser reports no connection — this is a plain
 * navigator.onLine + online/offline listener, not a service-worker offline cache: it covers
 * losing signal mid-session (the realistic case here), not loading the site with zero connectivity
 * on a first visit, which this non-PWA site can't do anything about anyway.
 */
export function OfflineNotice() {
  const [offline, setOffline] = useState(false);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  async function retry() {
    setPinging(true);
    try {
      await fetch("/", { method: "HEAD", cache: "no-store" });
      setOffline(false);
    } catch {
      // still down — the offline listener (or another retry) will clear it
    } finally {
      setPinging(false);
    }
  }

  if (!offline) return null;
  return (
    <div role="alert" className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center">
      <span className="label flex items-center gap-2 !text-[var(--accent)]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden /> No signal
      </span>
      <h1 className="display mt-4 text-[clamp(2.5rem,8vw,5rem)] leading-[0.9]">You&apos;ve lost the feed.</h1>
      <p className="mt-4 max-w-sm text-lg text-[var(--mute)]">
        Looks like you&apos;re offline. Reconnect and we&apos;ll pick up right where the take left off.
      </p>
      <button onClick={retry} disabled={pinging} className="mt-8 rounded-full bg-[var(--fg)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black disabled:opacity-50">
        {pinging ? "Checking…" : "Try again"}
      </button>
    </div>
  );
}

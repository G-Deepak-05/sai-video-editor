"use client";
import { useEffect, useState } from "react";

/**
 * Small, honest touch: shows what URL actually 404'd.
 * Deferred to a post-mount effect (not read directly during render) because the not-found boundary
 * can resolve the pathname differently between the server render and the first client render,
 * which would otherwise be a hydration mismatch — see the "must fetch data on the client-side
 * instead" note in Next's not-found.js docs.
 */
export function NotFoundPath() {
  const [path, setPath] = useState<string | null>(null);
  useEffect(() => { setPath(window.location.pathname); }, []);
  if (!path || path === "/") return null;
  return <p className="label mt-4 !text-[var(--fg)]/50">You tried to screen: {path}</p>;
}

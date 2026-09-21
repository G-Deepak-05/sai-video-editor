"use client";
import { useState } from "react";

export function LoginForm() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (res.ok) location.reload();
    else { setErr((await res.json().catch(() => ({}))).error || "Login failed."); setBusy(false); }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="label">Admin</p>
        <h1 className="display mt-2 text-6xl">Sign in</h1>
        <label className="mt-8 block">
          <span className="label">Password</span>
          <input type="password" autoFocus autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--line)] bg-transparent px-4 py-3 text-lg outline-none focus:border-[var(--fg)]" />
        </label>
        {err && <p role="alert" className="mt-3 text-sm text-[var(--accent)]">{err}</p>}
        <button disabled={busy || !pw} className="mt-6 w-full rounded-full bg-[var(--fg)] px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-black disabled:opacity-40">
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}

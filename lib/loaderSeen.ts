// Shared by Loader (whether to run the countdown) and Hero (whether to wait for it) so the two
// stay in sync without needing React context — a plain localStorage flag, since "seen it once" is
// meant to persist across visits, not just this tab's session.
const KEY = "saikumar-seen-loader-v1";

export function hasSeenLoader(): boolean {
  try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
}

export function markLoaderSeen() {
  try { localStorage.setItem(KEY, "1"); } catch { /* private mode etc. — just replays next time */ }
}

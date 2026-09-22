import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const TTL_S = 60 * 60 * 12; // 12h

const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET (>=32 chars) is not set");
  return s;
};
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

const safeEq = (a: string, b: string) => {
  const A = Buffer.from(a), B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
};

export function passwordOk(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  // compare hashes so length differences don't leak
  return safeEq(sign("pw:" + input), sign("pw:" + pw));
}

export async function startSession() {
  const exp = Math.floor(Date.now() / 1000) + TTL_S;
  const jar = await cookies();
  jar.set(COOKIE, `${exp}.${sign(String(exp))}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: TTL_S });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  try {
    const v = (await cookies()).get(COOKIE)?.value;
    if (!v) return false;
    const [exp, sig] = v.split(".");
    return !!exp && !!sig && Number(exp) > Date.now() / 1000 && safeEq(sig, sign(exp));
  } catch {
    return false;
  }
}

/**
 * Login-attempt lockout, tracked in a small signed cookie rather than in-memory state:
 * an in-memory Map here would need to be shared between this module's copy loaded by the
 * Route Handler and the copy loaded by the admin page's Server Component, and Next doesn't
 * guarantee those are the same module instance. A signed cookie is state the browser hands
 * back on every request, so it's consistent everywhere by construction — and per-browser
 * rather than per-IP, so one shared office connection can't lock everyone out at once.
 */
const FAILS_COOKIE = "admin_fails";
const WINDOW_S = 15 * 60;
const MAX_ATTEMPTS = 8;

async function readFails(): Promise<{ n: number; t: number }> {
  const v = (await cookies()).get(FAILS_COOKIE)?.value;
  const [nStr, tStr, sig] = (v ?? "").split(".");
  if (!nStr || !tStr || !sig || !safeEq(sig, sign(`${nStr}.${tStr}`))) return { n: 0, t: 0 };
  const n = Number(nStr), t = Number(tStr);
  if (!Number.isFinite(n) || !Number.isFinite(t) || Date.now() / 1000 - t > WINDOW_S) return { n: 0, t: 0 };
  return { n, t };
}

/** Called on a wrong-password attempt. Returns true once the count has just tipped over the limit. */
export async function recordFailedLogin(): Promise<boolean> {
  const prev = await readFails();
  const n = prev.n + 1;
  const t = prev.n === 0 ? Math.floor(Date.now() / 1000) : prev.t;
  const jar = await cookies();
  jar.set(FAILS_COOKIE, `${n}.${t}.${sign(`${n}.${t}`)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: WINDOW_S });
  return n > MAX_ATTEMPTS;
}

/** Read-only: is this browser currently locked out? Used to show a real 403 instead of the login form. */
export async function isLockedOut(): Promise<boolean> {
  return (await readFails()).n > MAX_ATTEMPTS;
}

/** Called on a successful login, so a later failed attempt starts a fresh count. */
export async function clearFails() {
  (await cookies()).delete(FAILS_COOKIE);
}

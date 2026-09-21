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

/** Best-effort in-memory throttle (per server instance) for login attempts. */
const attempts = new Map<string, { n: number; t: number }>();
export function throttled(ip: string) {
  const now = Date.now();
  const a = attempts.get(ip);
  if (!a || now - a.t > 15 * 60_000) { attempts.set(ip, { n: 1, t: now }); return false; }
  a.n++;
  return a.n > 8;
}

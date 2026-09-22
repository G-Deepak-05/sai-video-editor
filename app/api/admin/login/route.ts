import { clearFails, isLockedOut, passwordOk, recordFailedLogin, startSession } from "@/lib/auth";

export async function POST(req: Request) {
  if (await isLockedOut()) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !passwordOk(password)) {
    const nowLocked = await recordFailedLogin();
    return Response.json({ error: nowLocked ? "Too many attempts. Try again in 15 minutes." : "Wrong password." }, { status: nowLocked ? 429 : 401 });
  }
  await clearFails();
  await startSession();
  return Response.json({ ok: true });
}

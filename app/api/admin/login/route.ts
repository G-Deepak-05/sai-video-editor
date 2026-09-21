import { passwordOk, startSession, throttled } from "@/lib/auth";

export async function POST(req: Request) {
  const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (throttled(ip)) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !passwordOk(password)) return Response.json({ error: "Wrong password." }, { status: 401 });
  await startSession();
  return Response.json({ ok: true });
}

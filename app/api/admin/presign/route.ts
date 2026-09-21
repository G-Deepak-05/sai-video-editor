import { isAdmin } from "@/lib/auth";
import { presignPut, publicUrl } from "@/lib/r2";

const RULES: Record<string, { kind: "video" | "image"; ext: string; max: number }> = {
  "video/mp4": { kind: "video", ext: "mp4", max: 600 * 1024 * 1024 },
  "video/quicktime": { kind: "video", ext: "mov", max: 600 * 1024 * 1024 },
  "video/webm": { kind: "video", ext: "webm", max: 600 * 1024 * 1024 },
  "image/jpeg": { kind: "image", ext: "jpg", max: 20 * 1024 * 1024 },
  "image/png": { kind: "image", ext: "png", max: 20 * 1024 * 1024 },
  "image/webp": { kind: "image", ext: "webp", max: 20 * 1024 * 1024 },
};

const slug = (s: string) => s.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "file";

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { filename, contentType, size } = (await req.json().catch(() => ({}))) as { filename?: string; contentType?: string; size?: number };
  const rule = contentType ? RULES[contentType] : undefined;
  if (!filename || !rule) return Response.json({ error: "Unsupported file type." }, { status: 400 });
  if (!size || size > rule.max) return Response.json({ error: `File too large (max ${Math.round(rule.max / 1048576)} MB).` }, { status: 400 });

  const key = `uploads/${rule.kind}s/${Date.now().toString(36)}-${slug(filename)}.${rule.ext}`;
  return Response.json({ uploadUrl: await presignPut(key, contentType!), publicUrl: publicUrl(key), key });
}

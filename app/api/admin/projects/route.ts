import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getJson, putJson } from "@/lib/r2";
import { PROJECTS_KEY, PROJECTS_TAG } from "@/lib/data";
import { seedProjects, type Project } from "@/lib/projects";
import { services } from "@/lib/site";

const CATS = new Set<string>(services.map((s) => s.id));
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const url = (v: unknown) => { const s = str(v, 600); return /^https:\/\//.test(s) || s.startsWith("/") ? s : ""; };

function clean(input: unknown): Project[] | null {
  if (!Array.isArray(input) || input.length > 200) return null;
  const seen = new Set<string>();
  const out: Project[] = [];
  for (const raw of input as Record<string, unknown>[]) {
    const id = str(raw.id, 80).replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const title = str(raw.title, 120);
    const poster = url(raw.poster);
    if (!id || !title || !poster || seen.has(id)) return null;
    seen.add(id);
    const src = url(raw.src), driveId = str(raw.driveId, 80);
    if (!src && !driveId) return null;
    out.push({
      id, title, poster,
      description: str(raw.description, 400),
      categories: (Array.isArray(raw.categories) ? raw.categories : []).filter((c): c is Project["categories"][number] => typeof c === "string" && CATS.has(c)),
      orientation: raw.orientation === "portrait" ? "portrait" : "landscape",
      ...(url(raw.preview) ? { preview: url(raw.preview) } : {}),
      ...(src ? { src } : {}),
      ...(driveId ? { driveId } : {}),
    });
  }
  return out;
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json((await getJson<Project[]>(PROJECTS_KEY)) ?? seedProjects);
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const projects = clean(await req.json().catch(() => null));
  if (!projects) return Response.json({ error: "Invalid project list." }, { status: 400 });

  // keep a timestamped backup of whatever was live before overwriting
  const previous = await getJson<Project[]>(PROJECTS_KEY);
  if (previous) await putJson(`data/backups/projects-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, previous, "private, no-store");
  await putJson(PROJECTS_KEY, projects);

  revalidateTag(PROJECTS_TAG, { expire: 0 });
  revalidatePath("/");
  return Response.json({ ok: true, count: projects.length });
}

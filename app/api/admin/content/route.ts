import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getJson, putJson } from "@/lib/r2";
import { CONTENT_KEY, CONTENT_TAG } from "@/lib/data";
import { defaultContent, mergeContent, SERVICE_IDS, type SiteContent, type ServiceCopy, type ToolItem, type Testimonial, type ContactInfo } from "@/lib/content";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const url = (v: unknown) => { const s = str(v, 600); return /^https:\/\//.test(s) || s.startsWith("/") ? s : ""; };
const lines = (v: unknown, max: number, maxLen: number) => (Array.isArray(v) ? v.map((x) => str(x, maxLen)).slice(0, max) : []);
const strList = (v: unknown, max: number, maxLen: number) => (Array.isArray(v) ? v.map((x) => str(x, maxLen)).filter(Boolean).slice(0, max) : []);

function cleanTools(v: unknown, max: number): ToolItem[] {
  if (!Array.isArray(v)) return [];
  const out: ToolItem[] = [];
  for (const raw of v as Record<string, unknown>[]) {
    const name = str(raw?.name, 60);
    if (!name) continue;
    const logo = url(raw?.logo);
    out.push(logo ? { name, logo } : { name });
    if (out.length >= max) break;
  }
  return out;
}

function cleanTestimonials(v: unknown): Testimonial[] {
  if (!Array.isArray(v)) return [];
  const out: Testimonial[] = [];
  for (const raw of v as Record<string, unknown>[]) {
    const quote = str(raw?.quote, 500), by = str(raw?.by, 100);
    if (quote && by) out.push({ quote, by });
    if (out.length >= 20) break;
  }
  return out;
}

function cleanServices(v: unknown): ServiceCopy[] | null {
  if (!Array.isArray(v) || v.length !== SERVICE_IDS.length) return null;
  const out: ServiceCopy[] = [];
  const seen = new Set<string>();
  for (const raw of v as Record<string, unknown>[]) {
    const id = str(raw?.id, 40) as ServiceCopy["id"];
    if (!SERVICE_IDS.includes(id) || seen.has(id)) return null;
    seen.add(id);
    out.push({ id, label: str(raw?.label, 40), blurb: str(raw?.blurb, 320), points: strList(raw?.points, 8, 30) });
  }
  return SERVICE_IDS.every((id) => seen.has(id)) ? out : null;
}

function cleanContact(v: unknown): ContactInfo {
  const raw = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    email: str(raw.email, 200),
    instagram: url(raw.instagram),
    youtube: url(raw.youtube),
    linkedin: url(raw.linkedin),
    whatsapp: url(raw.whatsapp),
    phone: str(raw.phone, 40),
  };
}

function clean(input: unknown): SiteContent | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const services = cleanServices(raw.services);
  if (!services) return null;
  return {
    name: str(raw.name, 60) || defaultContent.name,
    role: str(raw.role, 60) || defaultContent.role,
    seoTitle: str(raw.seoTitle, 70) || defaultContent.seoTitle,
    seoDescription: str(raw.seoDescription, 200) || defaultContent.seoDescription,
    heroTagline: str(raw.heroTagline, 140),
    heroCtaPrimary: str(raw.heroCtaPrimary, 40) || defaultContent.heroCtaPrimary,
    heroCtaSecondary: str(raw.heroCtaSecondary, 40) || defaultContent.heroCtaSecondary,
    introHeading: lines(raw.introHeading, 3, 60),
    introBody: str(raw.introBody, 1000),
    aboutHeading: lines(raw.aboutHeading, 3, 60),
    aboutBody: str(raw.aboutBody, 1000),
    aboutPhoto: url(raw.aboutPhoto) || defaultContent.aboutPhoto,
    contactHeading: lines(raw.contactHeading, 3, 60),
    contactSubtext: str(raw.contactSubtext, 300),
    craftHeading: str(raw.craftHeading, 60),
    craft: strList(raw.craft, 24, 40),
    workHeading: str(raw.workHeading, 60),
    servicesHeading: str(raw.servicesHeading, 60),
    services,
    stackHeading: lines(raw.stackHeading, 3, 60),
    stackBody: str(raw.stackBody, 500),
    tools: cleanTools(raw.tools, 40),
    aiTools: cleanTools(raw.aiTools, 40),
    feedHeading: lines(raw.feedHeading, 3, 60),
    testimonials: cleanTestimonials(raw.testimonials),
    contact: cleanContact(raw.contact),
  };
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const saved = await getJson<Partial<SiteContent>>(CONTENT_KEY);
  return Response.json(mergeContent(saved));
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const content = clean(await req.json().catch(() => null));
  if (!content) return Response.json({ error: "Invalid content — check every service category is present." }, { status: 400 });

  const previous = await getJson<Partial<SiteContent>>(CONTENT_KEY);
  if (previous) await putJson(`data/backups/site-content-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, previous, "private, no-store");
  await putJson(CONTENT_KEY, content);

  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/");
  return Response.json({ ok: true });
}

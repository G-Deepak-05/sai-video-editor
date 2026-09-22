import "server-only";
import { seedProjects, type Project } from "./projects";
import { mergeContent, type SiteContent } from "./content";

/** Where the admin-managed data lives in the bucket (publicly readable, same origin as the videos). */
export const PROJECTS_KEY = "data/projects.json";
export const PROJECTS_TAG = "projects";
export const CONTENT_KEY = "data/site-content.json";
export const CONTENT_TAG = "site-content";

const publicBase = () => (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

async function readPublicJson<T>(key: string, tag: string): Promise<unknown> {
  const base = publicBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/${key}`, { next: { tags: [tag], revalidate: 300 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** Public site: read the JSON from R2's public URL (cached, revalidated on admin save). Falls back to built-ins. */
export async function getProjects(): Promise<Project[]> {
  const data = await readPublicJson<Project[]>(PROJECTS_KEY, PROJECTS_TAG);
  return Array.isArray(data) ? (data as Project[]) : seedProjects;
}

/** Public site: the editable copy/contact/tool lists, merged over the shipped defaults so a
 *  field an old save doesn't have (added later) still falls back sensibly. */
export async function getSiteContent(): Promise<SiteContent> {
  const saved = (await readPublicJson<Partial<SiteContent>>(CONTENT_KEY, CONTENT_TAG)) as Partial<SiteContent> | null;
  return mergeContent(saved);
}

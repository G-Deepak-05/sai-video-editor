import "server-only";
import { seedProjects, type Project } from "./projects";

/** Where the admin-managed list lives in the bucket (publicly readable, same origin as the videos). */
export const PROJECTS_KEY = "data/projects.json";
export const PROJECTS_TAG = "projects";

const publicBase = () => (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

/** Public site: read the JSON from R2's public URL (cached, revalidated on admin save). Falls back to built-ins. */
export async function getProjects(): Promise<Project[]> {
  const base = publicBase();
  if (!base) return seedProjects;
  try {
    const res = await fetch(`${base}/${PROJECTS_KEY}`, { next: { tags: [PROJECTS_TAG], revalidate: 300 } });
    if (!res.ok) return seedProjects;
    const data = await res.json();
    return Array.isArray(data) ? (data as Project[]) : seedProjects;
  } catch {
    return seedProjects;
  }
}

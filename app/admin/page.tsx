import type { Metadata } from "next";
import { forbidden } from "next/navigation";
import { isAdmin, isLockedOut } from "@/lib/auth";
import { getJson } from "@/lib/r2";
import { PROJECTS_KEY, CONTENT_KEY } from "@/lib/data";
import { seedProjects, type Project } from "@/lib/projects";
import { mergeContent, type SiteContent } from "@/lib/content";
import { AdminApp } from "./AdminApp";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    // Too many failed attempts from this browser: show the real 403 instead of another login form.
    if (await isLockedOut()) forbidden();
    return <LoginForm />;
  }
  let projects: Project[] = seedProjects;
  let content: SiteContent = mergeContent(null);
  let error = "";
  try {
    const [p, c] = await Promise.all([getJson<Project[]>(PROJECTS_KEY), getJson<Partial<SiteContent>>(CONTENT_KEY)]);
    projects = p ?? seedProjects;
    content = mergeContent(c);
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not reach storage.";
  }
  return <AdminApp initialProjects={projects} initialContent={content} storageError={error} />;
}

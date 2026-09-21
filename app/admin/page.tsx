import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { getJson } from "@/lib/r2";
import { PROJECTS_KEY } from "@/lib/data";
import { seedProjects, type Project } from "@/lib/projects";
import { AdminApp } from "./AdminApp";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />;
  let projects: Project[] = seedProjects;
  let error = "";
  try {
    projects = (await getJson<Project[]>(PROJECTS_KEY)) ?? seedProjects;
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not reach storage.";
  }
  return <AdminApp initial={projects} storageError={error} />;
}

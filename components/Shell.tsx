"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Lenis from "lenis";
import { Cursor } from "./Cursor";
import { Scroller } from "./Scroller";
import { ScrollFeedback } from "./ScrollFeedback";
import { OfflineNotice } from "./OfflineNotice";
import { Loader } from "./Loader";
import { ProjectViewer } from "./ProjectViewer";
import type { Project } from "@/lib/projects";
import type { SiteContent } from "@/lib/content";
import { defaultContent } from "@/lib/content";

type Ctx = { open: (id: string, list?: string[]) => void };
const ViewerCtx = createContext<Ctx>({ open: () => {} });
export const useViewer = () => useContext(ViewerCtx);

const ProjectsCtx = createContext<Project[]>([]);
/** Live project list (from R2, or the built-in defaults). */
export const useProjects = () => useContext(ProjectsCtx);

const ContentCtx = createContext<SiteContent>(defaultContent);
/** Live, admin-editable site copy (from R2, or the built-in defaults). */
export const useContent = () => useContext(ContentCtx);

export function Shell({ children, projects, content }: { children: React.ReactNode; projects: Project[]; content: SiteContent }) {
  const [state, setState] = useState<{ ids: string[]; index: number } | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  const open = useCallback((id: string, list?: string[]) => {
    const ids = list && list.length ? list : projects.map((p) => p.id);
    setState({ ids, index: Math.max(0, ids.indexOf(id)) });
  }, [projects]);

  return (
    <ContentCtx.Provider value={content}>
    <ProjectsCtx.Provider value={projects}>
    <ViewerCtx.Provider value={{ open }}>
      <Loader />
      <Cursor />
      <Scroller />
      <ScrollFeedback />
      <OfflineNotice />
      {children}
      {state && (
        <ProjectViewer
          ids={state.ids}
          index={state.index}
          onIndex={(index) => setState((s) => (s ? { ...s, index } : s))}
          onClose={() => setState(null)}
        />
      )}
    </ViewerCtx.Provider>
    </ProjectsCtx.Provider>
    </ContentCtx.Provider>
  );
}

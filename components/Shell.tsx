"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Lenis from "lenis";
import { Cursor } from "./Cursor";
import { Scroller } from "./Scroller";
import { ScrollFeedback } from "./ScrollFeedback";
import { Loader } from "./Loader";
import { ProjectViewer } from "./ProjectViewer";
import { projects } from "@/lib/projects";

type Ctx = { open: (id: string, list?: string[]) => void };
const ViewerCtx = createContext<Ctx>({ open: () => {} });
export const useViewer = () => useContext(ViewerCtx);

export function Shell({ children }: { children: React.ReactNode }) {
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
  }, []);

  return (
    <ViewerCtx.Provider value={{ open }}>
      <Loader />
      <Cursor />
      <Scroller />
      <ScrollFeedback />
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
  );
}

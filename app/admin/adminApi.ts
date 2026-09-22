"use client";
import { useRef, useState } from "react";

export type Job = { id: number; label: string; pct: number; error?: string; done?: boolean };

/** PUT a file straight to R2 through a short-lived signed URL, reporting progress. */
export async function uploadFile(file: Blob & { name?: string }, name: string, onPct: (n: number) => void): Promise<string> {
  const contentType = file.type || "application/octet-stream";
  const res = await fetch("/api/admin/presign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: name, contentType, size: file.size }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not start upload.");
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("Cache-Control", "public, max-age=31536000, immutable");
    xhr.upload.onprogress = (e) => e.lengthComputable && onPct(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}). Check the bucket CORS settings.`)));
    xhr.onerror = () => reject(new Error("Upload blocked. Check the bucket CORS settings."));
    xhr.send(file);
  });
  return data.publicUrl as string;
}

/** Grab a frame from a local video file to use as its cover image. */
export function capturePoster(file: File): Promise<{ blob: Blob; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = url;
    const fail = () => { URL.revokeObjectURL(url); reject(new Error("Couldn't read this video in the browser — pick a cover image instead.")); };
    v.onerror = fail;
    v.onloadedmetadata = () => { v.currentTime = Math.min(1.5, (v.duration || 2) * 0.15); };
    v.onseeked = () => {
      const scale = Math.min(1, 1440 / v.videoWidth);
      const c = document.createElement("canvas");
      c.width = Math.round(v.videoWidth * scale); c.height = Math.round(v.videoHeight * scale);
      c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
      c.toBlob((b) => { URL.revokeObjectURL(url); b ? resolve({ blob: b, w: v.videoWidth, h: v.videoHeight }) : fail(); }, "image/jpeg", 0.85);
    };
  });
}

/** Tracks a list of in-flight upload/save jobs with progress, for a small inline progress-bar UI. */
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const jobId = useRef(0);
  const track = (label: string) => {
    const id = ++jobId.current;
    setJobs((j) => [...j, { id, label, pct: 0 }]);
    const set = (patch: Partial<Job>) => setJobs((j) => j.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    return {
      pct: (n: number) => set({ pct: n }),
      fail: (e: string) => set({ error: e }),
      done: () => { set({ pct: 100, done: true }); setTimeout(() => setJobs((j) => j.filter((x) => x.id !== id)), 3000); },
    };
  };
  return { jobs, track };
}

export const inputCls = "w-full rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 text-base outline-none focus:border-[var(--fg)]";

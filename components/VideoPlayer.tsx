"use client";
import { useEffect, useRef, useState } from "react";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

/**
 * A custom player (native controls hidden) for the project viewer: a YouTube-style big center
 * play button, ±10s skip, a draggable scrubber, mute and fullscreen — the affordances a native
 * <video controls> doesn't give consistently across browsers.
 */
export function VideoPlayer({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [bump, setBump] = useState<"fwd" | "back" | null>(null);

  const wake = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    if (playing && !scrubbing) hideTimer.current = setTimeout(() => setShowControls(false), 2500);
  };
  useEffect(() => () => clearTimeout(hideTimer.current), []);
  useEffect(() => { wake(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [playing, scrubbing]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); } else v.pause();
  };

  const skip = (d: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + d, 0), v.duration || 0);
    setBump(d > 0 ? "fwd" : "back");
    setTimeout(() => setBump(null), 420);
  };

  const seekTo = (clientX: number) => {
    const v = videoRef.current, track = trackRef.current;
    if (!v || !track || !v.duration) return;
    const r = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    v.currentTime = ratio * v.duration;
    setTime(v.currentTime);
  };

  const toggleMute = () => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } };
  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  };
  useEffect(() => {
    const f = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", f);
    return () => document.removeEventListener("fullscreenchange", f);
  }, []);

  const pct = duration ? (time / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      className="group/player relative h-full w-full select-none bg-black"
      onMouseMove={wake}
      onTouchStart={wake}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => { setPlaying(true); setStarted(true); }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => { const b = e.currentTarget.buffered; if (b.length) setBuffered(b.end(b.length - 1)); }}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        autoPlay
      />

      {/* YouTube-style big center play/pause button */}
      <button
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className={`absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-all duration-300 md:h-20 md:w-20 ${!playing || showControls ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"} hover:bg-black/70 hover:scale-105`}
      >
        {playing ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>

      {/* skip feedback flash */}
      {bump && (
        <div className={`pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-black/55 px-4 py-3 text-white ${bump === "fwd" ? "left-[62%]" : "right-[62%]"}`}>
          {bump === "back" && <SkipIcon back />}
          <span className="label !text-white">10</span>
          {bump === "fwd" && <SkipIcon />}
        </div>
      )}

      {!started && poster && <div className="pointer-events-none absolute inset-0 bg-black/10" aria-hidden />}

      {/* bottom control bar */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2 pt-10 transition-opacity duration-300 md:px-4 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div
          ref={trackRef}
          className="group/track relative -mt-1 mb-2 h-4 cursor-pointer touch-none"
          onPointerDown={(e) => { setScrubbing(true); (e.target as HTMLElement).setPointerCapture(e.pointerId); seekTo(e.clientX); }}
          onPointerMove={(e) => scrubbing && seekTo(e.clientX)}
          onPointerUp={() => setScrubbing(false)}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
        >
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/25 transition-all group-hover/track:h-[5px]">
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/35" style={{ width: `${bufPct}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
          </div>
          <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--accent)] shadow transition-transform group-hover/track:scale-125" style={{ left: `calc(${pct}% - 6px)` }} />
        </div>

        <div className="flex items-center gap-4 text-white">
          <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="shrink-0">
            {playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button onClick={() => skip(-10)} aria-label="Back 10 seconds" className="flex shrink-0 items-center gap-0.5"><SkipIcon back /><span className="text-[10px] font-semibold">10</span></button>
          <button onClick={() => skip(10)} aria-label="Forward 10 seconds" className="flex shrink-0 items-center gap-0.5"><span className="text-[10px] font-semibold">10</span><SkipIcon /></button>
          <span className="label !text-white tabular-nums">{fmt(time)} / {fmt(duration)}</span>
          <span className="ml-auto flex items-center gap-4">
            <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M16.5 12 20 15.5 18.6 17 15 13.4 11.4 17 10 15.5 13.5 12 10 8.5 11.4 7 15 10.6 18.6 7 20 8.5z" /><path d="M3 9v6h4l5 5V4L7 9z" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M3 9v6h4l5 5V4L7 9z" /><path d="M16 8a5 5 0 0 1 0 8v-2a3 3 0 0 0 0-4z" /><path d="M16 4.5a8.5 8.5 0 0 1 0 15v-2a6.5 6.5 0 0 0 0-11z" /></svg>
              )}
            </button>
            <button onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
              {fullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M9 3H5a2 2 0 0 0-2 2v4h2V5h4zm6 0v2h4v4h2V5a2 2 0 0 0-2-2zM5 15H3v4a2 2 0 0 0 2 2h4v-2H5zm14 0v4h-4v2h4a2 2 0 0 0 2-2v-4z" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M3 9V5a2 2 0 0 1 2-2h4v2H5v4zm18 0V5a2 2 0 0 0-2-2h-4v2h4v4zM3 15v4a2 2 0 0 0 2 2h4v-2H5v-4zm18 0v4a2 2 0 0 1-2 2h-4v-2h4v-4z" /></svg>
              )}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

function SkipIcon({ back = false }: { back?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={back ? "-scale-x-100" : ""} aria-hidden>
      <path d="M4 9a8 8 0 1 1-1.5 6.5" />
      <path d="M2 4v5h5" />
    </svg>
  );
}

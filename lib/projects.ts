import type { ServiceId } from "./site";

export type Project = {
  id: string;
  title: string;
  categories: ServiceId[];
  description: string;
  orientation: "landscape" | "portrait";
  preview?: string; // short muted loop (optional — admin uploads only need a poster)
  poster: string;
  /**
   * Full-length video. Swap `src` for a CDN URL (R2, Bunny, Mux, S3…) when ready and the
   * viewer will use a native <video>. Until then `driveId` is played via Drive's embed.
   */
  src?: string;
  driveId?: string;
};

// Full-length videos live in Cloudflare R2 (URL comes from the environment, never hard-coded).
// NEXT_PUBLIC_VIDEO_BASE overrides; otherwise R2_PUBLIC_URL + the folder the original ten were uploaded to.
const R2_PUBLIC = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
const VIDEO_BASE = (process.env.NEXT_PUBLIC_VIDEO_BASE || (R2_PUBLIC ? `${R2_PUBLIC}/saikumar-web-videos` : "")).replace(/\/$/, "");
// No base configured -> undefined, and the viewer falls back to the Google Drive embed.
const v = (name: string) => (VIDEO_BASE ? `${VIDEO_BASE}/${name}.mp4` : undefined);

const p = (n: number) => ({ preview: `/work/${n}.mp4`, poster: `/work/${n}.jpg` });

// Categories were assigned from reviewing the delivered files; adjust here, the UI follows.
/** Built-in defaults; used until an admin saves data/projects.json to R2. */
export const seedProjects: Project[] = [
  { id: "corporate-launch", title: "Office Launch Story", categories: ["candid", "long-form"], description: "I cut this multi-camera event story for atmosphere and flow.", orientation: "landscape", ...p(9), src: v("corporate-launch"), driveId: "1JpkOoLR75JOkrVNQSM04rSzw-TRp2rfY" },
  { id: "workshop-ad", title: "Speed Reading Workshop Ad", categories: ["ads"], description: "A speaker-led promo where I used bold titles to drive sign-ups.", orientation: "landscape", ...p(6), src: v("workshop-ad"), driveId: "1SUCvbNrVaLp2udaBYVQ6jO6DVvddH5GT" },
  { id: "space-tour", title: "Office Space Tour", categories: ["real-estate"], description: "A workspace walkthrough I paced with clean transitions and simple location titles.", orientation: "landscape", ...p(8), src: v("space-tour"), driveId: "1r22IphDgFv4JXVyz52DSwuddhIrIt7eH" },
  { id: "hook-reel", title: "Talking-Head Reel", categories: ["reels"], description: "A vertical short I edited with word-by-word captions and a tight rhythm.", orientation: "portrait", ...p(1), src: v("hook-reel"), driveId: "1V0GKIZmE_Ii68B7iQ2SnCIqRhDIm6Udl" },
  { id: "dance-event", title: "Dance Event Film", categories: ["speed-ramp", "long-form"], description: "High-energy stage footage I shaped with motion effects and dynamic timing.", orientation: "landscape", ...p(10), src: v("dance-event"), driveId: "1DoTLRXzzHkCsyrvLokzHWyd0cKSAF17y" },
  { id: "festival-procession", title: "Festival Procession", categories: ["candid", "long-form"], description: "A cultural celebration I told through street-level moments.", orientation: "landscape", ...p(4), src: v("festival-procession"), driveId: "1RGsKwbSETTi0IQRnkCJVgnWNqlMCcmW4" },
  { id: "birthday-candid", title: "Birthday Candids", categories: ["candid"], description: "Warm, natural moments I assembled into a celebration film.", orientation: "landscape", ...p(5), src: v("birthday-candid"), driveId: "1MCZRB16kY5ACZjY7SdGs7ja_rUEyJ1OZ" },
  { id: "workshop-day", title: "Community Workshop Day", categories: ["candid", "long-form"], description: "Observational coverage of a day, edited around people at work and play.", orientation: "landscape", ...p(2), src: v("workshop-day"), driveId: "1To88ASotZ0YdO82oRlF9zra4Xf3eyLuy" },
  { id: "event-recap", title: "Event Recap", categories: ["long-form"], description: "A recap I cut to keep a longer event moving.", orientation: "landscape", ...p(3), src: v("event-recap"), driveId: "1tigtZKk-grPhW7LPLebYvez4xmpJqeoU" },
  { id: "office-candid", title: "Office Moments", categories: ["candid"], description: "Behind-the-scenes moments I cut into a short story.", orientation: "landscape", ...p(7), src: v("office-candid"), driveId: "1qr60FqtAL5Ez494ebGSuJlp269KeKYsa" },
];

/** The hero uses bundled local assets (fast LCP), so it stays a fixed seed project. */
export const hero = seedProjects.find((p) => p.id === "dance-event")! as Project & { preview: string };

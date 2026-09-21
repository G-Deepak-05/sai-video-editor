import type { ServiceId } from "./site";

export type Project = {
  id: string;
  title: string;
  categories: ServiceId[];
  description: string;
  orientation: "landscape" | "portrait";
  preview: string; // short muted loop
  poster: string;
  /**
   * Full-length video. Swap `src` for a CDN URL (R2, Bunny, Mux, S3…) when ready and the
   * viewer will use a native <video>. Until then `driveId` is played via Drive's embed.
   */
  src?: string;
  driveId?: string;
};

const p = (n: number) => ({ preview: `/work/${n}.mp4`, poster: `/work/${n}.jpg` });

// Categories were assigned from reviewing the delivered files; adjust here, the UI follows.
export const projects: Project[] = [
  { id: "corporate-launch", title: "Office Launch Story", categories: ["candid", "long-form"], description: "I cut this multi-camera event story for atmosphere and flow.", orientation: "landscape", ...p(9), driveId: "1JpkOoLR75JOkrVNQSM04rSzw-TRp2rfY" },
  { id: "workshop-ad", title: "Speed Reading Workshop Ad", categories: ["ads"], description: "A speaker-led promo where I used bold titles to drive sign-ups.", orientation: "landscape", ...p(6), driveId: "1SUCvbNrVaLp2udaBYVQ6jO6DVvddH5GT" },
  { id: "space-tour", title: "Office Space Tour", categories: ["real-estate"], description: "A workspace walkthrough I paced with clean transitions and simple location titles.", orientation: "landscape", ...p(8), driveId: "1r22IphDgFv4JXVyz52DSwuddhIrIt7eH" },
  { id: "hook-reel", title: "Talking-Head Reel", categories: ["reels"], description: "A vertical short I edited with word-by-word captions and a tight rhythm.", orientation: "portrait", ...p(1), driveId: "1V0GKIZmE_Ii68B7iQ2SnCIqRhDIm6Udl" },
  { id: "dance-event", title: "Dance Event Film", categories: ["speed-ramp", "long-form"], description: "High-energy stage footage I shaped with motion effects and dynamic timing.", orientation: "landscape", ...p(10), driveId: "1DoTLRXzzHkCsyrvLokzHWyd0cKSAF17y" },
  { id: "festival-procession", title: "Festival Procession", categories: ["candid", "long-form"], description: "A cultural celebration I told through street-level moments.", orientation: "landscape", ...p(4), driveId: "1RGsKwbSETTi0IQRnkCJVgnWNqlMCcmW4" },
  { id: "birthday-candid", title: "Birthday Candids", categories: ["candid"], description: "Warm, natural moments I assembled into a celebration film.", orientation: "landscape", ...p(5), driveId: "1MCZRB16kY5ACZjY7SdGs7ja_rUEyJ1OZ" },
  { id: "workshop-day", title: "Community Workshop Day", categories: ["candid", "long-form"], description: "Observational coverage of a day, edited around people at work and play.", orientation: "landscape", ...p(2), driveId: "1To88ASotZ0YdO82oRlF9zra4Xf3eyLuy" },
  { id: "event-recap", title: "Event Recap", categories: ["long-form"], description: "A recap I cut to keep a longer event moving.", orientation: "landscape", ...p(3), driveId: "1tigtZKk-grPhW7LPLebYvez4xmpJqeoU" },
  { id: "office-candid", title: "Office Moments", categories: ["candid"], description: "Behind-the-scenes moments I cut into a short story.", orientation: "landscape", ...p(7), driveId: "1qr60FqtAL5Ez494ebGSuJlp269KeKYsa" },
];

export const hero = projects[4];

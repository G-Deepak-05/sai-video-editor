// No "server-only" guard here: this is just default copy (no secrets), and the client-side
// Shell component needs `defaultContent`/`SiteContent` as its context default.
import { site as staticSite, services as staticServices, craft as staticCraft, type ServiceId } from "./site";

export type ToolItem = { name: string; logo?: string };
export type Testimonial = { quote: string; by: string };
export type ServiceCopy = { id: ServiceId; label: string; blurb: string; points: string[] };
export type ContactInfo = { email: string; instagram: string; youtube: string; linkedin: string; whatsapp: string; phone: string };

/**
 * Everything on the page an admin can rewrite from /admin, with its shipped-with-the-code default.
 * `services` keeps the same 7 fixed ids as lib/site.ts (they drive project categories/filters) —
 * only their label/blurb/points/order are editable. Structural things (the domain, `ServiceId`
 * itself) stay in lib/site.ts.
 */
export type SiteContent = {
  name: string;
  role: string;
  seoTitle: string;
  seoDescription: string;
  heroTagline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  introHeading: string[];
  introBody: string;
  aboutHeading: string[];
  aboutBody: string;
  aboutPhoto: string;
  contactHeading: string[];
  contactSubtext: string;
  craftHeading: string;
  craft: string[];
  workHeading: string;
  servicesHeading: string;
  services: ServiceCopy[];
  stackHeading: string[];
  stackBody: string;
  tools: ToolItem[];
  aiTools: ToolItem[];
  feedHeading: string[];
  testimonials: Testimonial[];
  contact: ContactInfo;
};

export const defaultContent: SiteContent = {
  name: staticSite.name,
  role: staticSite.role,
  seoTitle: staticSite.title,
  seoDescription: staticSite.description,
  heroTagline: "Candid • Reels • Long Form • Ads • Real Estate",
  heroCtaPrimary: "Watch showreel",
  heroCtaSecondary: "View work",
  introHeading: ["I edit moments", "into stories."],
  introBody:
    "I'm Saikumar. I turn raw footage into engaging visual stories through precise cuts, rhythm, transitions, speed ramps and thoughtful pacing. My work spans candid films, reels, long-form content, ads, intros and real-estate videos.",
  aboutHeading: ["The editor", "behind the cut."],
  aboutBody:
    "I'm a video editor focused on turning raw footage into engaging visual stories. From reels and advertisements to long-form content, candid edits and real-estate videos, my approach is built around rhythm, timing and visual storytelling.",
  aboutPhoto: "/saikumar.jpg",
  contactHeading: ["Have a story", "to tell?"],
  contactSubtext: "Have a project in mind? Let's talk — I'd love to hear about it.",
  craftHeading: "The craft",
  craft: staticCraft,
  workHeading: "Selected work",
  servicesHeading: "What I edit",
  services: staticServices.map((s) => ({ id: s.id, label: s.label, blurb: s.blurb, points: [...s.points] })),
  stackHeading: ["Tools of", "the trade"],
  stackBody:
    "I edit with industry-standard software for editing, motion and design, and I use advanced AI tools — Claude, Gemini, ChatGPT, Higgsfield, Seedance and more — to speed up ideation, scripting, visuals and sound, so more of my time goes into the cut itself.",
  tools: staticSite.tools,
  aiTools: staticSite.aiTools,
  feedHeading: ["More from", "the feed"],
  testimonials: staticSite.testimonials,
  contact: { ...staticSite.contact },
};

/** The fixed set of service ids the rest of the app (categories, project tagging) depends on. */
export const SERVICE_IDS: ServiceId[] = staticServices.map((s) => s.id);

/** Layers a saved (possibly partial, possibly old-shape) document over the shipped defaults. */
export function mergeContent(saved: Partial<SiteContent> | null | undefined): SiteContent {
  if (!saved || typeof saved !== "object") return defaultContent;
  return {
    ...defaultContent,
    ...saved,
    contact: { ...defaultContent.contact, ...(saved.contact ?? {}) },
  };
}

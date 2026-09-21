/**
 * Single source of truth for owner-supplied details.
 * Leave a value empty ("") and the UI that depends on it is hidden — nothing is invented.
 */
export const site = {
  name: "Saikumar",
  role: "Video Editor",
  // Set NEXT_PUBLIC_SITE_URL in Netlify (Site settings → Environment variables). Falls back to Netlify's URL.
  url: (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000").replace(/\/$/, ""),
  title: "Saikumar | Video Editor & Visual Storyteller",
  description:
    "I'm Saikumar, a professional video editor specializing in reels, long-form videos, ads, candid edits, real-estate videos, intros and speed-ramp editing.",
  contact: {
    email: "Saikumarss232@gmail.com",
    instagram: "https://www.instagram.com/its_saikumarfx",
    youtube: "https://youtube.com/@user-saikumar232",
    linkedin: "https://www.linkedin.com/in/sai-kumar-332481383",
    whatsapp: "https://wa.me/917569977914", // assumes +91 (India) country code
    phone: "+91 75699 77914",
  },
  // Core editing tools shown in the marquee (logos in /public/logos).
  tools: [
    { name: "Premiere Pro", logo: "/logos/premiere-pro.svg" },
    { name: "After Effects", logo: "/logos/after-effects.svg" },
    { name: "DaVinci Resolve", logo: "/logos/davinci-resolve.svg" },
    { name: "Photoshop", logo: "/logos/photoshop.svg" },
    { name: "Illustrator", logo: "/logos/illustrator.svg" },
    { name: "Blender", logo: "/logos/blender.svg" },
    { name: "Canva", logo: "/logos/canva.svg" },
  ],
  aiTools: [
    { name: "Claude", logo: "/logos/claude.svg" },
    { name: "Gemini", logo: "/logos/gemini.svg" },
    { name: "ChatGPT", logo: "/logos/chatgpt.svg" },
    { name: "Higgsfield", logo: "/logos/higgsfield.png" },
    { name: "Seedance", logo: "/logos/seedance.svg" },
    { name: "Kling", logo: "/logos/kling.svg" },
    { name: "Sora", logo: "/logos/sora.svg" },
    { name: "Nano Banana", logo: "/logos/nano-banana.svg" },
    { name: "Midjourney", logo: "/logos/midjourney.svg" },
    { name: "Runway", logo: "/logos/runway.svg" },
    { name: "Luma", logo: "/logos/luma.svg" },
    { name: "Suno", logo: "/logos/suno.svg" },
    { name: "ElevenLabs", logo: "/logos/elevenlabs.svg" },
  ],
  // Only real testimonials. Empty => no testimonials section.
  testimonials: [] as { quote: string; by: string }[],
};

export const services = [
  { id: "candid", label: "Candid", blurb: "I cut natural moments to music — emotional pacing, clean transitions and the highlights that make people feel it again.", points: ["Natural moments", "Music synchronization", "Pacing", "Transitions"] },
  { id: "reels", label: "Reels", blurb: "I build short-form edits around a strong hook, fast pacing, captions and beat-matched cuts.", points: ["Hooks", "Captions", "Beat sync", "Effects"] },
  { id: "long-form", label: "Long Form", blurb: "I hold longer stories together with structure, retention-minded pacing, clean cuts and consistent audio.", points: ["Story structure", "Retention", "Clean cuts", "Audio sync"] },
  { id: "intro", label: "Intro", blurb: "I make openings that grab attention — title sequences and brand intros with a clear visual identity.", points: ["Title sequences", "Brand intros", "Logo reveals"] },
  { id: "ads", label: "Ads", blurb: "I cut promotional edits that communicate fast: strong hooks, clear messaging and a call to action.", points: ["Promos", "Social ads", "Fast messaging", "CTA"] },
  { id: "real-estate", label: "Real Estate", blurb: "I show spaces with smooth transitions, music-driven pacing and a walkthrough rhythm.", points: ["Walkthroughs", "Smooth transitions", "Visual pacing"] },
  { id: "speed-ramp", label: "Speed Ramp", blurb: "I shift between slow and fast motion with speed transitions locked to the beat.", points: ["Slow motion", "Fast motion", "Beat sync", "Dynamic transitions"] },
] as const;

export type ServiceId = (typeof services)[number]["id"];

export const craft = ["Video Editing", "Visual Storytelling", "Pacing", "Transitions", "Speed Ramping", "Sound"];

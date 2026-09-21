import { Shell } from "@/components/Shell";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ScrubReel } from "@/components/ScrubReel";
import { Intro } from "@/components/Intro";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Craft } from "@/components/Craft";
import { Stack } from "@/components/Stack";
import { Feed } from "@/components/Feed";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

export default function Home() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    description: site.description,
    knowsAbout: ["Video editing", "Reels editing", "Long-form editing", "Ad editing", "Real estate video editing", "Speed ramp editing"],
    sameAs: [site.contact.instagram, site.contact.youtube, site.contact.linkedin].filter(Boolean),
    image: `${site.url}/saikumar.jpg`,
    telephone: site.contact.phone || undefined,
    email: site.contact.email || undefined,
    subjectOf: projects.map((p) => ({ "@type": "VideoObject", name: p.title, description: p.description, thumbnailUrl: `${site.url}${p.poster}` })),
  };
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Marquee />
        <ScrubReel />
        <Work />
        <Services />
        <Craft />
        <Stack />
        <Feed />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </Shell>
  );
}

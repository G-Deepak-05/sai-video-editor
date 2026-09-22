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
import { getProjects, getSiteContent } from "@/lib/data";

export default async function Home() {
  const [projects, content] = await Promise.all([getProjects(), getSiteContent()]);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.name,
    jobTitle: content.role,
    url: site.url,
    description: content.seoDescription,
    knowsAbout: ["Video editing", "Reels editing", "Long-form editing", "Ad editing", "Real estate video editing", "Speed ramp editing"],
    sameAs: [content.contact.instagram, content.contact.youtube, content.contact.linkedin].filter(Boolean),
    image: content.aboutPhoto.startsWith("http") ? content.aboutPhoto : `${site.url}${content.aboutPhoto}`,
    telephone: content.contact.phone || undefined,
    email: content.contact.email || undefined,
    subjectOf: projects.map((p) => ({ "@type": "VideoObject", name: p.title, description: p.description, thumbnailUrl: `${site.url}${p.poster}` })),
  };
  return (
    <Shell projects={projects} content={content}>
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
        <Feed projects={projects} />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </Shell>
  );
}

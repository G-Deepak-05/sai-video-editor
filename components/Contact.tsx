"use client";
import { Lines } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { useContent } from "./Shell";

export function Contact() {
  const { contactHeading, contactSubtext, contact } = useContent();
  const { email, instagram, whatsapp, phone, youtube, linkedin } = contact;
  const primary = email ? `mailto:${email}?subject=Video%20editing%20project` : whatsapp ? `${whatsapp}?text=Hi%2C%20I%20have%20a%20video%20editing%20project.` : instagram || "#contact";
  const items = [
    email && { label: "Email", value: email, href: `mailto:${email}`, icon: "/logos/gmail.svg" },
    whatsapp && { label: "WhatsApp", value: "Message me", href: whatsapp, icon: "/logos/whatsapp.svg" },
    phone && { label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}`, icon: "/logos/phone.svg" },
    instagram && { label: "Instagram", value: instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, ""), href: instagram, icon: "/logos/instagram.svg" },
    youtube && { label: "YouTube", value: "Watch on YouTube", href: youtube, icon: "/logos/youtube.svg" },
    linkedin && { label: "LinkedIn", value: "Connect with me", href: linkedin, icon: "/logos/linkedin.svg" },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: string }[];

  return (
    <section id="contact" className="wrap py-[clamp(6rem,14vw,12rem)]" aria-labelledby="contact-h">
      <h2 id="contact-h" className="display text-[clamp(3.5rem,13vw,14rem)]"><Lines lines={contactHeading} /></h2>
      <p className="mt-8 max-w-md text-lg text-[var(--mute)]">{contactSubtext}</p>
      <div className="mt-10">
        <Magnetic>
          <a href={primary} data-cursor="OPEN" className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-8 py-5 text-sm font-semibold uppercase tracking-[0.14em] text-black">
            Start a project <span className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden>→</span>
          </a>
        </Magnetic>
      </div>
      {items.length > 0 && (
        <ul className="mt-20 grid gap-4 md:grid-cols-2">
          {items.map((i) => (
            <li key={i.label}>
              <a href={i.href} data-cursor="OPEN" className="group flex items-center gap-5 rounded-2xl border border-[var(--line)] p-5 transition-colors duration-300 hover:border-[var(--fg)]/40 hover:bg-white/[0.04] md:p-6"
                {...(i.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.icon} alt="" width={56} height={56} className="h-12 w-12 shrink-0 object-contain transition-transform duration-500 group-hover:scale-110 md:h-14 md:w-14" />
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[var(--mute)]">{i.label}</span>
                  <span className="mt-1 block break-all text-xl font-semibold md:text-2xl">{i.value}</span>
                </span>
                <span className="ml-auto text-2xl opacity-40 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";
import { Lines, Reveal } from "./Reveal";
import { useContent } from "./Shell";

export function Intro() {
  const { introHeading, introBody } = useContent();
  return (
    <section className="wrap py-[clamp(6rem,16vw,14rem)]" aria-labelledby="intro-h">
      <h2 id="intro-h" className="display text-[clamp(3rem,10vw,10rem)]">
        <Lines lines={introHeading} />
      </h2>
      <div className="mt-14 grid gap-8 md:grid-cols-12">
        <Reveal className="md:col-span-5 md:col-start-7">
          <p className="text-lg leading-relaxed text-[var(--fg)]/85 md:text-xl">{introBody}</p>
        </Reveal>
      </div>
    </section>
  );
}

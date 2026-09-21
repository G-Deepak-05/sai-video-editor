import { Lines, Reveal } from "./Reveal";

export function Intro() {
  return (
    <section className="wrap py-[clamp(6rem,16vw,14rem)]" aria-labelledby="intro-h">
      <h2 id="intro-h" className="display text-[clamp(3rem,10vw,10rem)]">
        <Lines lines={["I edit moments", "into stories."]} />
      </h2>
      <div className="mt-14 grid gap-8 md:grid-cols-12">
        <Reveal className="md:col-span-5 md:col-start-7">
          <p className="text-lg leading-relaxed text-[var(--mute)] md:text-xl">
            <span className="text-[var(--fg)]">I&apos;m Saikumar.</span> I turn raw footage into engaging visual stories through precise cuts, rhythm, transitions, speed ramps and thoughtful pacing. My work spans candid films, reels, long-form content, ads, intros and real-estate videos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

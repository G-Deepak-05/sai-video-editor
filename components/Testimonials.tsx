"use client";
import { useContent } from "./Shell";

export function Testimonials() {
  const { testimonials } = useContent();
  if (!testimonials.length) return null;
  return (
    <section className="wrap py-24" aria-label="Testimonials">
      {testimonials.map((t) => (
        <figure key={t.by} className="mb-12">
          <blockquote className="display text-4xl md:text-6xl">“{t.quote}”</blockquote>
          <figcaption className="label mt-4">{t.by}</figcaption>
        </figure>
      ))}
    </section>
  );
}

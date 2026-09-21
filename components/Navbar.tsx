"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";

const links = [["Work", "#work"], ["Services", "#services"], ["About", "#about"], ["Contact", "#contact"]];

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 80);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${open ? "bg-[#0a0a0a]" : solid ? "bg-[#0a0a0a]/80 backdrop-blur-md" : ""}`}>
      <nav aria-label="Primary" className="wrap flex items-center justify-between py-7">
        <a href="#top" className="display text-4xl tracking-[0.12em] md:text-5xl" onClick={() => setOpen(false)}>{site.name}</a>
        <ul className="hidden gap-14 md:flex">
          {links.map(([l, h]) => (
            <li key={h}><a href={h} className="u text-[1.1rem] font-bold uppercase tracking-[0.16em] text-[var(--fg)]" data-cursor="">{l}</a></li>
          ))}
        </ul>
        <span className="hidden text-[1rem] font-bold uppercase tracking-[0.18em] text-[var(--fg)]/70 md:block">{site.role}</span>
        <button className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--fg)] md:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
      </nav>
    </header>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="wrap fixed inset-0 z-40 flex flex-col justify-center gap-5 overflow-y-auto bg-[#0a0a0a] pt-24 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {links.map(([l, h], i) => (
              <motion.a key={h} href={h} onClick={() => setOpen(false)} className="display text-6xl"
                initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i, duration: 0.6 }}>
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

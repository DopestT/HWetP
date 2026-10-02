import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const LINKS = [
  { label: "Discover", href: "/#discover" },
  { label: "Trending", href: "/#trending" },
  { label: "New", href: "/#new" },
  { label: "Categories", href: "/#categories" },
  { label: "Favorites", href: "/library" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-titanium/20 bg-abyss/75 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-6 md:px-12 md:py-5">
          <Link to="/" className="flex min-h-11 items-center gap-3" aria-label="HERWET home">
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-cyan/60" />
              <span className="absolute inset-1 rounded-full border border-cyan/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>
            <span className="chrome-wordmark text-lg tracking-[-0.05em]">HERWET</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="font-mono text-[10px] uppercase tracking-[0.24em] text-seafoam/55 transition hover:text-cyan">
                {link.label}
              </a>
            ))}
          </nav>

          <button onClick={() => setOpen(true)} className="group flex min-h-11 items-center gap-3 text-seafoam/80 transition hover:text-cyan" aria-label="Open menu" aria-expanded={open}>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] sm:inline">Sonar</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-titanium transition group-hover:border-cyan">
              <Menu size={16} />
            </span>
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!open}>
        <div className="absolute inset-0 bg-abyss/94 backdrop-blur-2xl" onClick={() => setOpen(false)} />
        <div className="relative flex h-full flex-col">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-4 sm:px-6 md:px-12 md:py-5">
            <span className="chrome-wordmark text-xl tracking-[-0.05em]">HERWET</span>
            <button onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full border border-titanium text-seafoam transition hover:border-cyan hover:text-cyan" aria-label="Close menu">
              <X size={16} />
            </button>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="absolute rounded-full border border-cyan/15" style={{ width: `${(i + 1) * 220}px`, height: `${(i + 1) * 220}px`, left: `${-(i + 1) * 110}px`, top: `${-(i + 1) * 110}px` }} />
            ))}
            <span className="absolute h-2 w-2 rounded-full bg-cyan" style={{ left: -4, top: -4 }} />
          </div>

          <nav className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center overflow-y-auto px-5 py-6 sm:px-6 md:px-12" aria-label="Menu">
            <ul className="space-y-1">
              {LINKS.map((link, i) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-5 py-2 sm:gap-6">
                    <span className="font-mono text-xs text-titanium transition group-hover:text-cyan">0{i + 1}</span>
                    <span className="heading-display text-[clamp(2.45rem,11vw,4.5rem)] text-seafoam transition group-hover:text-cyan">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-8 sm:px-6 md:px-12 md:pb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-titanium/40 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>18+ only</span>
              <span>Privacy · Consent · Takedown</span>
              <span className="text-cyan">herwet.com</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React from "react";
import { Link } from "react-router-dom";

const LEGAL = [
  { label: "18+ / Age Assurance", to: "/trust/age" },
  { label: "Report Content", to: "/trust/report" },
  { label: "Takedown / DMCA", to: "/trust/takedown" },
  { label: "Privacy", to: "/trust/privacy" },
  { label: "Terms", to: "/trust/terms" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan/15 bg-abyss/55 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-[#061522] to-[#00F2FF]/10" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-[130%] -translate-x-1/2 rounded-full bg-cyan/10 blur-[160px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-14 sm:px-6 md:px-12 md:py-20">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <div className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-seafoam">HER<span className="text-cyan">WET</span></div>
            <h2 className="heading-display mt-5 text-5xl text-seafoam md:text-7xl">Go deeper.</h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-seafoam/45">Production frontend foundation. Content sources, accounts, monetization, and moderation services remain intentionally disconnected until the infrastructure and compliance layer are ready.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-[9px] uppercase tracking-[0.2em] text-seafoam/50 sm:grid-cols-3 sm:gap-x-10">
            {LEGAL.map((item) => <Link key={item.to} to={item.to} className="transition hover:text-cyan">{item.label}</Link>)}
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-titanium/30 pt-7 font-mono text-[9px] uppercase tracking-[0.22em] text-titanium md:mt-16 md:flex-row md:items-center">
          <span>© 2026 HERWET</span><span className="text-cyan/60">herwet.com</span><span>Adults only · Privacy first</span>
        </div>
      </div>
    </footer>
  );
}

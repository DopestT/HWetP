import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import wordmark from "@/assets/herwet-wordmark.webp";

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-transparent px-5 pb-14 pt-28 sm:px-6 md:px-12 md:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan/10 blur-[140px]" />
        <div className="absolute left-[8%] top-[35%] h-64 w-64 rounded-full bg-[#0d7f86]/10 blur-[100px]" />
        <div className="absolute right-[8%] top-[50%] h-72 w-72 rounded-full bg-[#7adbe0]/5 blur-[120px]" />
        <div className="absolute inset-0 isobaric-lines opacity-20" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-[1600px] flex-col justify-center">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/80">
          <span className="h-px w-10 bg-cyan/60" />
          <span>HERWET · PRIVATE OCEAN LAYER</span>
        </div>

        <div className="mt-7 max-w-5xl sm:mt-8">
          <img src={wordmark} alt="HERWET PUSSY" className="w-full max-w-[980px] object-contain drop-shadow-[0_0_26px_rgba(0,242,255,0.16)] sm:w-[96%]" />
          <div className="mt-5 h-px w-2/3 bg-gradient-to-r from-transparent via-cyan/70 to-transparent shadow-[0_0_18px_rgba(0,242,255,0.55)]" />
        </div>

        <h1 className="heading-display mt-8 max-w-6xl text-[clamp(3.25rem,15vw,7.8rem)] leading-[0.86] text-seafoam sm:mt-10 sm:text-[9vw] md:text-[7vw] lg:text-[5.2vw]">
          Go <span className="text-cyan text-glow">deeper.</span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-seafoam/60 md:text-lg">
          A premium ocean-themed discovery experience. Search the depths, follow the current, and surface what you want faster.
        </p>

        <form onSubmit={submitSearch} id="discover" className="glass-panel mt-8 flex w-full max-w-3xl items-center gap-3 rounded-2xl px-4 py-3.5 cyan-glow sm:mt-10 sm:rounded-full sm:px-5 sm:py-4">
          <Search size={19} className="text-cyan" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the depths" className="min-w-0 flex-1 bg-transparent text-base text-seafoam placeholder:text-seafoam/35 focus:outline-none" />
          <button type="submit" className="min-h-11 shrink-0 rounded-full border border-cyan/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan/80 transition hover:border-cyan hover:bg-cyan hover:text-abyss">
            <span className="sm:hidden">GO</span><span className="hidden sm:inline">SONAR SEARCH</span>
          </button>
        </form>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-seafoam/40 sm:mt-10 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0 sm:text-[10px] sm:tracking-[0.2em]">
          <span className="shrink-0 rounded-full border border-titanium/60 px-3 py-2">Trending now</span>
          <span className="shrink-0 rounded-full border border-titanium/60 px-3 py-2">Recently surfaced</span>
          <span className="shrink-0 rounded-full border border-titanium/60 px-3 py-2">Deepest views</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1600px] items-center justify-between border-t border-titanium/25 pt-6 font-mono text-[9px] uppercase tracking-[0.22em] text-titanium">
        <span>Content layer not connected</span>
        <a href="#trending" className="flex items-center gap-2 text-cyan/70 hover:text-cyan">Descend <ChevronDown size={13} /></a>
      </div>
    </section>
  );
}

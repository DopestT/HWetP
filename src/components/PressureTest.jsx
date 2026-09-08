import React from "react";
import { Eye, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { formatViews, VIDEOS } from "@/data/catalog";

export default function PressureTest() {
  return (
    <section id="new" className="relative overflow-hidden bg-transparent py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0 isobaric-lines opacity-10" />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-6 md:px-12">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/80"><span className="h-px w-10 bg-cyan/60" /><span>02 · Fresh Tide</span></div>
        <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="heading-display text-5xl text-seafoam md:text-7xl">Just Surfaced</h2>
          <Link to="/category/fresh" className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan hover:text-seafoam">View all new →</Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {VIDEOS.map((item) => (
            <Link key={item.slug} to={`/watch/${item.slug}`} className="group overflow-hidden rounded-lg border border-titanium/30 bg-card transition active:scale-[0.985] hover:border-cyan/40">
              <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${item.tone}`}>
                <div className="absolute inset-0 isobaric-lines opacity-25" />
                <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan/45 bg-abyss/45 text-cyan backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-cyan group-hover:text-abyss"><Play size={15} fill="currentColor" /></div></div>
              </div>
              <div className="p-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-seafoam">{item.title}</h3>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-seafoam/40">{item.duration} · New</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/80 md:mt-24"><span className="h-px w-10 bg-cyan/60" /><span>03 · Most Watched</span></div>
        <h2 className="heading-display mt-5 text-5xl text-seafoam md:text-7xl">Deepest Views</h2>

        <div className="mt-10 divide-y divide-titanium/25 border-y border-titanium/25">
          {[...VIDEOS].sort((a, b) => b.views - a.views).slice(0, 4).map((item, i) => (
            <Link key={item.slug} to={`/watch/${item.slug}`} className="group flex items-center justify-between gap-4 py-6 transition hover:bg-cyan/[0.025]">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <span className="font-mono text-xs text-titanium">0{i + 1}</span>
                <div className={`h-14 w-24 shrink-0 rounded-md border border-titanium/30 bg-gradient-to-br ${item.tone}`} />
                <div className="min-w-0"><h3 className="truncate font-heading text-base font-bold uppercase tracking-[0.06em] text-seafoam group-hover:text-cyan md:text-lg">{item.title}</h3><div className="mt-1 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-seafoam/40"><Eye size={12} />{formatViews(item.views)} views</div></div>
              </div>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-cyan/60 sm:inline">Enter →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

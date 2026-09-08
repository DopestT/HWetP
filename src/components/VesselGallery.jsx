import React, { useRef } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { formatViews, VIDEOS } from "@/data/catalog";

export default function VesselGallery({ items = VIDEOS, source = "fallback" }) {
  const trackRef = useRef(null);
  const visible = items.slice(0, 6);

  const scrollBy = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * Math.min(trackRef.current.clientWidth * 0.8, 620), behavior: "smooth" });
  };

  return (
    <section id="trending" className="relative bg-transparent py-20 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/80"><span className="h-px w-10 bg-cyan/60" /><span>01 · Live Current</span></div>
            <h2 className="heading-display mt-5 text-5xl text-seafoam md:text-7xl">Trending in the Current</h2>
          </div>
          <div className="max-w-sm"><p className="text-sm leading-relaxed text-seafoam/50">A flowing discovery rail powered by the approved production catalog when available.</p><div className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-seafoam/30">{source === "api" ? "Production catalog" : "Preview fallback"}</div></div>
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button onClick={() => scrollBy(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-titanium text-seafoam transition hover:border-cyan hover:text-cyan" aria-label="Scroll left"><ArrowLeft size={16} /></button>
          <button onClick={() => scrollBy(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-titanium text-seafoam transition hover:border-cyan hover:text-cyan" aria-label="Scroll right"><ArrowRight size={16} /></button>
        </div>
      </div>

      <div ref={trackRef} className="no-scrollbar mask-fade-r mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 touch-pan-x sm:px-6 md:mt-10 md:gap-5 md:px-12">
        {visible.map((item, i) => (
          <Link key={item.id} to={`/watch/${item.slug}`} data-sonar className="group relative aspect-video w-[86vw] max-w-[520px] shrink-0 snap-center overflow-hidden rounded-xl border border-titanium/30 bg-card transition duration-300 active:scale-[0.985] sm:w-[82vw]">
            {item.thumbnailUrl && item.source === "api" ? <img src={item.thumbnailUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90" /> : <div className={`absolute inset-0 bg-gradient-to-br ${item.tone}`} />}
            <div className="absolute inset-0 opacity-30 isobaric-lines" />
            <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/20 to-transparent" />
            <div className="absolute left-6 top-6 max-w-[70%] truncate font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/80">{item.id}</div>
            <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan/50 bg-abyss/35 text-cyan backdrop-blur-md transition group-hover:scale-110 group-hover:bg-cyan group-hover:text-abyss"><Play size={18} fill="currentColor" /></div></div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss via-abyss/70 to-transparent p-6 pt-16">
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-seafoam/45">{String(i + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}</div>
              <h3 className="mt-2 font-heading text-2xl font-bold uppercase tracking-[0.05em] text-seafoam">{item.title}</h3>
              <p className="mt-1 text-xs text-seafoam/50">{item.duration} · {formatViews(item.views || 0)} views</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

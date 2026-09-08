import React, { useMemo } from "react";
import { ArrowLeft, Clock, Compass, Layers, Radar, Sparkles, Waves } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SonarCursor from "@/components/SonarCursor";
import VideoCard from "@/components/VideoCard";
import WaterPlasma from "@/components/WaterPlasma";
import { CATEGORY_META, VIDEOS } from "@/data/catalog";

const ICONS = { current: Waves, fresh: Sparkles, "deep-finds": Radar, explore: Compass, collections: Layers, history: Clock };

export default function Category() {
  const { slug = "explore" } = useParams();
  const category = CATEGORY_META[slug] || CATEGORY_META.explore;
  const Icon = ICONS[slug] || Compass;
  const items = useMemo(() => {
    if (slug === "history") return VIDEOS.slice().reverse().slice(0, 4);
    const matched = VIDEOS.filter((video) => video.categories.includes(slug));
    return matched.length ? matched : VIDEOS;
  }, [slug]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-abyss text-seafoam sonar-cursor">
      <WaterPlasma intensity="soft" /><SonarCursor /><Nav />
      <main className="relative z-10 mx-auto max-w-[1600px] px-5 pb-20 pt-24 sm:px-6 md:px-12 md:pb-24 md:pt-32">
        <Link to="/#categories" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-seafoam/45 transition hover:text-cyan"><ArrowLeft size={14} /> Back to categories</Link>
        <section className="mt-7 overflow-hidden rounded-2xl border border-titanium/25 bg-abyss/30 p-5 backdrop-blur-md sm:p-7 md:mt-8 md:p-12">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div className="max-w-4xl"><div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-cyan/75"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan/35 bg-cyan/5 text-cyan"><Icon size={17} /></span><span>{category.eyebrow}</span></div><h1 className="heading-display mt-5 text-[clamp(3rem,14vw,6rem)] text-seafoam md:text-8xl">{category.title}</h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-seafoam/50 md:text-base">{category.body} Neutral placeholders remain in place until approved catalog sources are connected.</p></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-seafoam/30">{items.length} signals surfaced</div>
          </div>
        </section>
        <div className="no-scrollbar mt-7 flex gap-2 overflow-x-auto pb-1 sm:mt-8 sm:flex-wrap sm:overflow-visible sm:pb-0">{Object.entries(CATEGORY_META).map(([key, item]) => <Link key={key} to={`/category/${key}`} className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition ${key === slug ? "border-cyan bg-cyan text-abyss" : "border-titanium/40 text-seafoam/45 hover:border-cyan hover:text-cyan"}`}>{item.title}</Link>)}</div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <VideoCard key={item.slug} item={item} label={category.title} />)}</div>
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}

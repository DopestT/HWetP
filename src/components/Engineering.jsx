import React from "react";
import { Clock, Compass, Layers, Radar, Sparkles, Waves } from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { icon: Waves, slug: "current", title: "Current", body: "What is moving fastest right now." },
  { icon: Sparkles, slug: "fresh", title: "Fresh", body: "Recently surfaced additions." },
  { icon: Radar, slug: "deep-finds", title: "Deep Finds", body: "Discovery beyond the obvious." },
  { icon: Compass, slug: "explore", title: "Explore", body: "Browse by category and interest." },
  { icon: Layers, slug: "collections", title: "Collections", body: "Curated groups and saved sets." },
  { icon: Clock, slug: "history", title: "History", body: "Return to what you viewed before." },
];

export default function Engineering() {
  return (
    <section id="categories" className="relative bg-transparent py-20 md:py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan/5 blur-[140px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-6 md:px-12">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/80"><span className="h-px w-10 bg-cyan/60" /><span>04 · Browse the Ocean</span></div>
        <h2 className="heading-display mt-5 max-w-4xl text-5xl text-seafoam md:text-7xl">Explore Categories</h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-seafoam/50">A focused category system built to expand without turning the homepage into a wall of links.</p>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-titanium/30 bg-titanium/30 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, i) => (
            <Link key={category.title} to={`/category/${category.slug}`} data-sonar className="group relative bg-abyss/70 p-7 transition-colors duration-500 hover:bg-card md:p-9">
              <div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.22em] text-titanium">0{i + 1}</span><category.icon size={20} className="text-cyan/65 transition group-hover:text-cyan" strokeWidth={1.5} /></div>
              <h3 className="heading-display mt-10 text-2xl text-seafoam transition group-hover:text-cyan">{category.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-seafoam/45">{category.body}</p>
              <div className="mt-8 h-px w-0 bg-cyan transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div id="favorites" className="glass-panel mt-14 flex flex-col justify-between gap-6 rounded-xl p-6 sm:mt-16 sm:p-7 md:flex-row md:items-center md:p-10">
          <div><div className="font-mono text-[9px] uppercase tracking-[0.22em] text-cyan/70">Your private layer</div><h3 className="heading-display mt-3 text-3xl text-seafoam md:text-4xl">Favorites + History</h3><p className="mt-3 max-w-xl text-sm text-seafoam/45">Favorites and recently viewed items persist on this device. Account sync can be added when the production user layer is connected.</p></div>
          <Link to="/library" className="min-h-12 shrink-0 rounded-lg border border-cyan/45 bg-cyan/5 px-6 py-4 text-center font-heading text-xs uppercase tracking-[0.2em] text-cyan transition hover:bg-cyan hover:text-abyss">Open your library</Link>
        </div>
      </div>
    </section>
  );
}

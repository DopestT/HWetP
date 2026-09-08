import React, { useMemo, useState } from "react";
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SonarCursor from "@/components/SonarCursor";
import VideoCard from "@/components/VideoCard";
import WaterPlasma from "@/components/WaterPlasma";
import { VIDEOS } from "@/data/catalog";

const FILTERS = ["All", "Trending", "New", "Featured"];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [draft, setDraft] = useState(query);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("relevance");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = VIDEOS.filter((video) => {
      const matchesQuery = !q || `${video.title} ${video.category} ${video.id}`.toLowerCase().includes(q);
      const matchesFilter = filter === "All" || video.category === filter;
      return matchesQuery && matchesFilter;
    });
    if (sort === "views") items = [...items].sort((a, b) => b.views - a.views);
    if (sort === "newest") items = [...items].reverse();
    return items;
  }, [query, filter, sort]);

  const submit = (event) => {
    event.preventDefault();
    const next = draft.trim();
    setParams(next ? { q: next } : {});
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-abyss text-seafoam sonar-cursor">
      <WaterPlasma intensity="soft" /><SonarCursor /><Nav />
      <main className="relative z-10 mx-auto max-w-[1600px] px-5 pb-20 pt-24 sm:px-6 md:px-12 md:pb-24 md:pt-32">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-seafoam/45 transition hover:text-cyan"><ArrowLeft size={14} /> Back to the current</Link>
        <div className="mt-8 max-w-4xl"><div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/75">Sonar search</div><h1 className="heading-display mt-3 text-[clamp(2.8rem,13vw,4.5rem)] text-seafoam md:text-7xl">Search the depths</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-seafoam/50">Search is wired against the neutral production catalog until approved sources are connected.</p></div>

        <form onSubmit={submit} className="glass-panel mt-7 flex w-full max-w-4xl items-center gap-3 rounded-2xl px-4 py-3.5 cyan-glow sm:mt-8 sm:rounded-full sm:px-5 sm:py-4"><SearchIcon size={19} className="text-cyan" /><input value={draft} onChange={(e) => setDraft(e.target.value)} type="search" placeholder="Search the depths" className="min-w-0 flex-1 bg-transparent text-base text-seafoam placeholder:text-seafoam/35 focus:outline-none" /><button type="submit" className="min-h-11 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan transition hover:bg-cyan hover:text-abyss">Search</button></form>

        <div className="mt-7 flex flex-col gap-4 border-b border-titanium/25 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">{FILTERS.map((item) => <button key={item} onClick={() => setFilter(item)} className={`min-h-11 shrink-0 rounded-full border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition ${filter === item ? "border-cyan bg-cyan text-abyss" : "border-titanium/40 text-seafoam/45 hover:border-cyan hover:text-cyan"}`}>{item}</button>)}</div>
          <label className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-seafoam/40"><SlidersHorizontal size={13} /> Sort<select value={sort} onChange={(e) => setSort(e.target.value)} className="min-h-11 rounded-full border border-titanium/40 bg-abyss/60 px-3 py-2 text-seafoam/70 focus:outline-none focus:ring-1 focus:ring-cyan"><option value="relevance">Relevance</option><option value="views">Most viewed</option><option value="newest">Newest</option></select></label>
        </div>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-seafoam/35">{results.length} signals found{query ? ` for “${query}”` : ""}</div>
        {results.length ? <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{results.map((item) => <VideoCard key={item.slug} item={item} />)}</div> : <div className="glass-panel mt-8 rounded-xl p-10 text-center"><div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan/65">No signal</div><h2 className="mt-3 font-heading text-2xl font-bold uppercase text-seafoam">Nothing surfaced</h2><p className="mt-2 text-sm text-seafoam/45">Try a broader search or switch the filter back to All.</p></div>}
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Clock, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SonarCursor from "@/components/SonarCursor";
import VideoCard from "@/components/VideoCard";
import WaterPlasma from "@/components/WaterPlasma";
import { clearFavorites, clearHistory, getFavorites, getHistory } from "@/lib/herwetStorage";

export default function Library() {
  const [tab, setTab] = useState("favorites");
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  const refresh = () => {
    setFavorites(getFavorites());
    setHistory(getHistory());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("herwet:library-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("herwet:library-change", refresh);
    };
  }, []);

  const items = tab === "favorites" ? favorites : history;
  const clearCurrent = () => {
    if (tab === "favorites") clearFavorites(); else clearHistory();
    refresh();
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-abyss text-seafoam sonar-cursor">
      <WaterPlasma intensity="soft" /><SonarCursor /><Nav />
      <main className="relative z-10 mx-auto max-w-[1600px] px-5 pb-20 pt-24 sm:px-6 md:px-12 md:pb-24 md:pt-32">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-seafoam/45 transition hover:text-cyan"><ArrowLeft size={14} /> Back to the current</Link>
        <div className="mt-8 max-w-4xl"><div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/75">Your private layer</div><h1 className="heading-display mt-3 text-[clamp(2.75rem,12vw,4.5rem)] text-seafoam md:text-7xl">Favorites + History</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-seafoam/50">Saved and recently viewed items stay on this device for now. Account sync can replace local storage later.</p></div>
        <div className="mt-8 flex flex-col gap-4 border-b border-titanium/25 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0"><button onClick={() => setTab("favorites")} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition ${tab === "favorites" ? "border-cyan bg-cyan text-abyss" : "border-titanium/40 text-seafoam/45 hover:border-cyan hover:text-cyan"}`}><Bookmark size={13} /> Favorites <span>{favorites.length}</span></button><button onClick={() => setTab("history")} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition ${tab === "history" ? "border-cyan bg-cyan text-abyss" : "border-titanium/40 text-seafoam/45 hover:border-cyan hover:text-cyan"}`}><Clock size={13} /> History <span>{history.length}</span></button></div>
          {items.length > 0 && <button onClick={clearCurrent} className="inline-flex min-h-11 items-center gap-2 self-start font-mono text-[9px] uppercase tracking-[0.18em] text-seafoam/35 transition hover:text-cyan sm:self-auto"><Trash2 size={13} /> Clear {tab}</button>}
        </div>
        {items.length ? <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <VideoCard key={item.slug} item={item} label={tab === "favorites" ? "Saved" : "Recently viewed"} />)}</div> : <div className="glass-panel mt-8 rounded-xl p-10 text-center"><div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan/65">Quiet water</div><h2 className="mt-3 font-heading text-2xl font-bold uppercase text-seafoam">Nothing here yet</h2><p className="mt-2 text-sm text-seafoam/45">{tab === "favorites" ? "Use the Favorite button on a watch page to save something here." : "Open a watch page and it will appear here automatically."}</p></div>}
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}

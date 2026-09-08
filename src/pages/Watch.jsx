import React, { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Flag, Play, Share2, Volume2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SonarCursor from "@/components/SonarCursor";
import WaterPlasma from "@/components/WaterPlasma";
import { formatViews } from "@/data/catalog";
import { getCatalog, getCatalogItem } from "@/lib/catalogClient";
import { addToHistory, isFavorite, toggleFavorite } from "@/lib/herwetStorage";

export default function Watch() {
  const { slug } = useParams();
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [source, setSource] = useState("loading");

  useEffect(() => {
    let active = true;
    setSource("loading");
    setVideo(null);

    Promise.all([getCatalogItem(slug), getCatalog({ limit: 12 })]).then(([current, catalog]) => {
      if (!active) return;
      setVideo(current.item);
      setSource(current.source);
      setRelated(catalog.items.filter((item) => item.slug !== current.item.slug).slice(0, 6));
      setSaved(isFavorite(current.item.slug));
      addToHistory(current.item);
    });

    return () => { active = false; };
  }, [slug]);

  const handleFavorite = () => {
    if (video) setSaved(toggleFavorite(video));
  };

  const handleShare = async () => {
    if (!video) return;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: video.title, url });
      else if (navigator.clipboard) await navigator.clipboard.writeText(url);
    } catch {
      // Native share can be cancelled by the user.
    }
  };

  if (!video) {
    return (
      <div className="relative isolate min-h-screen overflow-hidden bg-abyss text-seafoam sonar-cursor">
        <WaterPlasma intensity="soft" /><SonarCursor /><Nav />
        <main className="relative z-10 mx-auto max-w-[1600px] px-5 pb-20 pt-28 sm:px-6 md:px-12"><div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan/70">Scanning the current…</div></main>
      </div>
    );
  }

  const hasDirectVideo = source === "api" && video.mediaAllowed && video.mediaUrl && ["remote_stream", "licensed_hosted"].includes(video.mediaMode);
  const hasEmbeddedVideo = source === "api" && video.mediaAllowed && video.mediaUrl && video.mediaMode === "embed";

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-abyss text-seafoam sonar-cursor">
      <WaterPlasma intensity="soft" /><SonarCursor /><Nav />
      <main className="relative z-10 mx-auto max-w-[1600px] px-5 pb-20 pt-24 sm:px-6 md:px-12 md:pt-32">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-seafoam/45 transition hover:text-cyan"><ArrowLeft size={14} /> Back to the current</Link>
        <div className="mt-7 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-titanium/30 bg-card shadow-[0_0_60px_rgba(0,242,255,0.08)] sm:rounded-2xl">
              {hasDirectVideo ? (
                <video className="h-full w-full bg-black object-contain" src={video.mediaUrl} poster={video.thumbnailUrl || undefined} controls preload="metadata" playsInline />
              ) : hasEmbeddedVideo ? (
                <iframe
                  src={video.mediaUrl}
                  title={video.title}
                  className="h-full w-full border-0 bg-black"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  allow="autoplay; fullscreen; picture-in-picture"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                />
              ) : (
                <>
                  {video.thumbnailUrl && source === "api" ? <img src={video.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" /> : <div className={`absolute inset-0 bg-gradient-to-br ${video.tone}`} />}
                  <div className="absolute inset-0 isobaric-lines opacity-25" /><div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-[90px]" />
                  <button onClick={() => setPlaying((value) => !value)} className="absolute inset-0 flex items-center justify-center" aria-label={playing ? "Pause prototype" : "Play prototype"}><span className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan/60 bg-abyss/50 text-cyan backdrop-blur-md transition active:scale-95 hover:scale-105 hover:bg-cyan hover:text-abyss sm:h-20 sm:w-20"><Play size={28} fill="currentColor" /></span></button>
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-abyss/95 via-abyss/55 to-transparent px-3 pb-3 pt-14 sm:gap-4 sm:px-5 sm:pb-4 sm:pt-16"><button className="text-seafoam/70 transition hover:text-cyan" aria-label="Play"><Play size={16} fill="currentColor" /></button><div className="h-1 flex-1 overflow-hidden rounded-full bg-seafoam/15"><div className="h-full w-[28%] rounded-full bg-cyan" /></div><span className="hidden font-mono text-[10px] text-seafoam/60 sm:inline">{video.duration}</span><Volume2 size={16} className="hidden text-seafoam/60 sm:block" /></div>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-5 border-b border-titanium/25 pb-7 md:flex-row md:items-start md:justify-between">
              <div><div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/75">{video.id} · {source === "api" ? "approved catalog" : "preview fallback"}</div><h1 className="mt-2 font-heading text-[clamp(2rem,10vw,3rem)] font-bold uppercase tracking-[0.03em] text-seafoam md:text-5xl">{video.title}</h1><p className="mt-2 text-sm text-seafoam/45">{formatViews(video.views || 0)} views · {video.duration}</p></div>
              <div className="flex flex-wrap gap-2"><ActionButton icon={Bookmark} active={saved} onClick={handleFavorite} label={saved ? "Saved" : "Favorite"} /><ActionButton icon={Share2} onClick={handleShare} label="Share" /><Link to={`/trust/report?video=${encodeURIComponent(video.slug)}&ref=${encodeURIComponent(video.id)}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-titanium/50 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-seafoam/60 transition hover:border-cyan hover:text-cyan"><Flag size={14} /> Report</Link></div>
            </div>

            <div className="glass-panel mt-6 rounded-xl p-6"><div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">About this video</div><p className="mt-3 max-w-3xl text-sm leading-relaxed text-seafoam/55">{video.description || (source === "api" ? "Approved catalog metadata will appear here when provided by the authorized source." : "This is a neutral production placeholder. Approved source attribution, moderation status, categories, and media metadata will populate here when the content layer is online.")}</p>{video.attributionText && <p className="mt-4 text-xs text-seafoam/40">Source: {video.attributionText}</p>}<div className="mt-5 flex flex-wrap gap-2">{(video.categories?.length ? video.categories : ["preview"]).map((tag) => <span key={tag} className="rounded-full border border-titanium/40 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-seafoam/45">{tag}</span>)}</div></div>
          </section>

          <aside><div className="xl:sticky xl:top-28"><div className="flex items-center justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">Next current</div><h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-[0.04em] text-seafoam">Related</h2></div><span className="font-mono text-[9px] uppercase tracking-[0.2em] text-seafoam/30">Auto-flow</span></div><div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-3 xl:block xl:space-y-4 xl:overflow-visible xl:pb-0">{related.map((item) => <Link key={item.slug} to={`/watch/${item.slug}`} className="group block w-[78vw] shrink-0 overflow-hidden rounded-xl border border-titanium/25 bg-card transition active:scale-[0.985] hover:border-cyan/45 sm:w-[360px] xl:w-auto"><div className="relative aspect-video overflow-hidden">{item.thumbnailUrl && item.source === "api" ? <img src={item.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" /> : <div className={`absolute inset-0 bg-gradient-to-br ${item.tone}`} />}<div className="absolute inset-0 isobaric-lines opacity-20" /><div className="absolute inset-0 flex items-center justify-center"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan/40 bg-abyss/45 text-cyan transition group-hover:scale-110 group-hover:bg-cyan group-hover:text-abyss"><Play size={14} fill="currentColor" /></span></div></div><div className="p-4"><div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan/60">{item.id}</div><div className="mt-1 font-heading text-lg font-bold uppercase text-seafoam">{item.title}</div><div className="mt-1 text-xs text-seafoam/40">{item.duration} · {formatViews(item.views || 0)} views</div></div></Link>)}</div></div></aside>
        </div>
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, active = false, onClick }) {
  return <button onClick={onClick} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition active:scale-95 ${active ? "border-cyan bg-cyan text-abyss" : "border-titanium/50 text-seafoam/60 hover:border-cyan hover:text-cyan"}`}><Icon size={14} /> {label}</button>;
}

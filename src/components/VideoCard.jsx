import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { formatViews } from "@/data/catalog";

export default function VideoCard({ item, label }) {
  const useThumb = item.thumbnailUrl && item.source === "api";

  return (
    <Link to={`/watch/${item.slug}`} className="group overflow-hidden rounded-xl border border-titanium/25 bg-card/55 backdrop-blur-sm transition duration-300 active:scale-[0.985] hover:-translate-y-1 hover:border-cyan/45">
      <div className="relative aspect-video overflow-hidden">
        {useThumb ? <img src={item.thumbnailUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90" /> : <div className={`absolute inset-0 bg-gradient-to-br ${item.tone}`} />}
        <div className="absolute inset-0 isobaric-lines opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss/45 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan/45 bg-abyss/45 text-cyan backdrop-blur-md transition group-hover:scale-110 group-hover:bg-cyan group-hover:text-abyss">
            <Play size={16} fill="currentColor" />
          </span>
        </div>
        <div className="absolute left-4 top-4 max-w-[70%] truncate font-mono text-[9px] uppercase tracking-[0.2em] text-cyan/75">{item.id}</div>
        <div className="absolute bottom-3 right-3 rounded-full bg-abyss/70 px-2 py-1 font-mono text-[9px] text-seafoam/70">{item.duration}</div>
      </div>
      <div className="p-5">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan/60">{label || item.category}</div>
        <h2 className="mt-2 font-heading text-xl font-bold uppercase tracking-[0.03em] text-seafoam">{item.title}</h2>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-seafoam/40"><span>{formatViews(item.views || 0)} views</span>{item.source === "api" && <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-cyan/45">Approved catalog</span>}</div>
      </div>
    </Link>
  );
}

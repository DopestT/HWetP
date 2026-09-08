export const VIDEOS = [
  { id: "HW-01", slug: "current-one", title: "Current One", duration: "12:08", views: 1800000, category: "Trending", categories: ["current", "explore"], tone: "from-cyan/25 via-[#0d4d58]/35 to-abyss" },
  { id: "HW-02", slug: "current-two", title: "Current Two", duration: "08:42", views: 924000, category: "New", categories: ["fresh", "current"], tone: "from-[#164c68]/40 via-[#08283d]/35 to-abyss" },
  { id: "HW-03", slug: "current-three", title: "Current Three", duration: "15:31", views: 681000, category: "Featured", categories: ["deep-finds", "collections"], tone: "from-[#0b6f73]/30 via-[#08252f]/40 to-abyss" },
  { id: "HW-04", slug: "current-four", title: "Current Four", duration: "10:14", views: 544000, category: "Trending", categories: ["current", "collections"], tone: "from-[#1b6573]/30 via-[#0b2433]/35 to-abyss" },
  { id: "HW-05", slug: "deep-five", title: "Deep Five", duration: "06:58", views: 318000, category: "New", categories: ["fresh", "deep-finds"], tone: "from-[#0c5764]/35 via-[#06242e]/40 to-abyss" },
  { id: "HW-06", slug: "night-current", title: "Night Current", duration: "18:22", views: 242000, category: "Featured", categories: ["deep-finds", "explore", "history"], tone: "from-[#155267]/35 via-[#071a2a]/45 to-abyss" },
];

export const CATEGORY_META = {
  current: { title: "Current", eyebrow: "Fast water", body: "What is moving fastest right now." },
  fresh: { title: "Fresh", eyebrow: "Just surfaced", body: "Recently surfaced additions and new signals." },
  "deep-finds": { title: "Deep Finds", eyebrow: "Below the obvious", body: "Discovery beyond the surface-level feed." },
  explore: { title: "Explore", eyebrow: "Open water", body: "Browse broad interests and discover adjacent currents." },
  collections: { title: "Collections", eyebrow: "Curated sets", body: "Grouped selections designed for focused browsing." },
  history: { title: "History", eyebrow: "Your wake", body: "A view of recently visited content." },
};

export function formatViews(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 ? 1 : 0)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return String(value);
}

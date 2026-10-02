import { VIDEOS } from '@/data/catalog';
import { fetchVideo, fetchVideos } from '@/lib/api';

const TONES = [
  'from-cyan/25 via-[#0d4d58]/35 to-abyss',
  'from-[#164c68]/40 via-[#08283d]/35 to-abyss',
  'from-[#0b6f73]/30 via-[#08252f]/40 to-abyss',
  'from-[#1b6573]/30 via-[#0b2433]/35 to-abyss',
  'from-[#0c5764]/35 via-[#06242e]/40 to-abyss',
  'from-[#155267]/35 via-[#071a2a]/45 to-abyss',
];

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return '00:00';
  const value = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(value / 60);
  const secs = value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function titleCase(value = '') {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toneFor(value = '') {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  return TONES[Math.abs(hash) % TONES.length];
}

export function normalizeApiVideo(item) {
  const categories = Array.isArray(item.categories) ? item.categories : [];
  return {
    id: item.id || item.slug || 'HW',
    slug: item.slug,
    title: item.title || 'Untitled',
    description: item.description || '',
    duration: formatDuration(item.duration_seconds),
    durationSeconds: item.duration_seconds ?? null,
    views: 0,
    category: categories[0] ? titleCase(categories[0]) : 'Explore',
    categories,
    tone: toneFor(item.slug || item.id || item.title || ''),
    mediaMode: item.media_mode || null,
    mediaUrl: item.media_allowed === false ? null : (item.media_url || null),
    mediaAllowed: item.media_allowed !== false,
    thumbnailUrl: item.thumbnail_url || null,
    attributionText: item.attribution_text || null,
    publishedAt: item.published_at || null,
    sourceType: item.source_type || null,
    source: 'api',
  };
}

export async function getCatalog(options = {}) {
  try {
    const payload = await fetchVideos(options);
    if (Array.isArray(payload?.items)) {
      return { items: payload.items.map(normalizeApiVideo), source: 'api' };
    }
  } catch {
    // The production API may be offline in preview environments.
  }

  const q = (options.q || '').trim().toLowerCase();
  const category = (options.category || '').trim();
  let items = VIDEOS.filter((video) => {
    const matchesQuery = !q || `${video.title} ${video.category} ${video.id}`.toLowerCase().includes(q);
    const matchesCategory = !category || video.categories.includes(category);
    return matchesQuery && matchesCategory;
  });

  if (Number.isFinite(options.limit)) items = items.slice(0, options.limit);
  return { items, source: 'fallback' };
}

export async function getCatalogItem(slug) {
  try {
    const item = await fetchVideo(slug);
    if (item?.slug) return { item: normalizeApiVideo(item), source: 'api' };
  } catch {
    // Fall back to the neutral local catalog until the API is online.
  }

  return { item: VIDEOS.find((video) => video.slug === slug) || VIDEOS[0], source: 'fallback' };
}

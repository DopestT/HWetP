const FAVORITES_KEY = "herwet:favorites";
const HISTORY_KEY = "herwet:history";
const AGE_KEY = "herwet:age-confirmed";

function safeRead(key) {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function safeWrite(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("herwet:library-change"));
}

export function getFavorites() { return safeRead(FAVORITES_KEY); }
export function isFavorite(slug) { return getFavorites().some((item) => item.slug === slug); }
export function toggleFavorite(video) {
  const current = getFavorites();
  const exists = current.some((item) => item.slug === video.slug);
  const next = exists ? current.filter((item) => item.slug !== video.slug) : [{ ...video, savedAt: Date.now() }, ...current];
  safeWrite(FAVORITES_KEY, next);
  return !exists;
}

export function getHistory() { return safeRead(HISTORY_KEY); }
export function addToHistory(video) {
  const current = getHistory().filter((item) => item.slug !== video.slug);
  safeWrite(HISTORY_KEY, [{ ...video, viewedAt: Date.now() }, ...current].slice(0, 50));
}
export function clearHistory() { safeWrite(HISTORY_KEY, []); }
export function clearFavorites() { safeWrite(FAVORITES_KEY, []); }

export function getAgeConfirmed() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(AGE_KEY) === "yes";
}
export function setAgeConfirmed() {
  if (typeof window !== "undefined") window.sessionStorage.setItem(AGE_KEY, "yes");
}

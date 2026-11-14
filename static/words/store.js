// localStorage persistence. Falls back to memory when storage is blocked,
// so the app still works for the session.
import { DEFAULT_SETTINGS } from './srs.js';

export const KEYS = Object.freeze({
  settings: 'wordspring.settings.v1',
  scheme: 'color-scheme',
});

/** Each study language keeps its own progress. English keeps the original key. */
export const progressKey = (study) =>
  study === 'en' ? 'wordspring.progress.v1' : `wordspring.progress.${study}.v1`;

const memory = new Map();

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return memory.get(key);
  }
}

function write(key, value) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const emptyProgress = () => ({
  v: 1,
  cards: {},                                    // word index -> packed card
  daily: { day: -1, new: 0, rev: 0, done: 0, extra: 0 },
  log: {},                                      // day number -> answers given
});

const num = (v, min, max, fallback) =>
  Number.isFinite(+v) ? Math.min(max, Math.max(min, +v)) : fallback;

export function sanitizeSettings(s = {}) {
  const d = DEFAULT_SETTINGS;
  return {
    newPerDay: Math.round(num(s.newPerDay, 0, 100, d.newPerDay)),
    maxReviews: Math.round(num(s.maxReviews, 10, 500, d.maxReviews)),
    order: ['mixed', 'frequency', 'random'].includes(s.order) ? s.order : d.order,
    pace: num(s.pace, 0.5, 2, d.pace),
    study: typeof s.study === 'string' ? s.study : d.study,
    lang: typeof s.lang === 'string' ? s.lang : d.lang,
  };
}

export function sanitizeProgress(p, wordCount) {
  const out = emptyProgress();
  if (!p || typeof p !== 'object') return out;
  for (const [id, a] of Object.entries(p.cards ?? {})) {
    const n = Number(id);
    if (!Number.isInteger(n) || n < 0 || n >= wordCount) continue;
    if (!Array.isArray(a) || a.length !== 5 || !a.every(Number.isFinite)) continue;
    out.cards[n] = a;
  }
  for (const [day, count] of Object.entries(p.log ?? {})) {
    if (Number.isFinite(+day) && Number.isFinite(count)) out.log[day] = count;
  }
  if (p.daily && Number.isFinite(p.daily.day)) out.daily = { ...out.daily, ...p.daily };
  return out;
}

export const loadSettings = () => sanitizeSettings(read(KEYS.settings));
export const saveSettings = (s) => write(KEYS.settings, s);
export const loadProgress = (study, wordCount) => sanitizeProgress(read(progressKey(study)), wordCount);
export const saveProgress = (study, p) => write(progressKey(study), p);

/** Ask the browser not to evict our data under storage pressure. */
export function requestPersistence() {
  navigator.storage?.persist?.().catch(() => {});
}

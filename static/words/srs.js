// Spaced-repetition scheduler (SM-2 family), tuned for one study session per day.
// Everything is measured in whole days; "today" is a local day number.
//
// Card shape: { i, e, d, n, l }
//   i  interval in days (0 = still being learned today)
//   e  ease factor (growth multiplier applied on "Good")
//   d  day number the card is next due
//   n  number of successful reviews
//   l  number of lapses (times forgotten after being learned)

export const AGAIN = 1, HARD = 2, GOOD = 3, EASY = 4;

export const DEFAULT_SETTINGS = Object.freeze({
  newPerDay: 10,      // new words introduced per daily session
  maxReviews: 100,    // cap on due reviews per daily session
  order: 'mixed',     // 'mixed' | 'frequency' (most common first) | 'random'
  pace: 1,            // interval multiplier: <1 = see cards more often, >1 = less often
  lang: 'en',         // definition language
});

const START_EASE = 2.5;
const MIN_EASE = 1.3;
const MAX_INTERVAL = 365;
const DAY_ROLLOVER_HOUR = 4; // studying after midnight still counts as "today"

/** Local day number, rolling over at 04:00 local time. */
export function dayNumber(date = new Date()) {
  const shifted = new Date(date.getTime() - DAY_ROLLOVER_HOUR * 3600e3);
  return Math.floor((shifted.getTime() - shifted.getTimezoneOffset() * 60e3) / 864e5);
}

export function dateOfDay(day) {
  return new Date(day * 864e5 + new Date().getTimezoneOffset() * 60e3 + 12 * 3600e3);
}

/**
 * Pure scheduling step: returns the card's next state for a rating.
 * @param {object|null} card  current state, or null for a brand-new card
 * @param {1|2|3|4} rating
 * @param {number} today      day number
 * @param {number} pace       interval multiplier
 */
export function schedule(card, rating, today, pace = 1) {
  const c = card ? { ...card } : { i: 0, e: START_EASE, d: today, n: 0, l: 0 };
  const clampEase = (e) => Math.max(MIN_EASE, Math.round(e * 100) / 100);
  let interval;

  if (c.i === 0) {
    // New, or being (re)learned: one good answer graduates it to tomorrow.
    if (rating === AGAIN) interval = 0;
    else if (rating === HARD) { interval = 1; c.e = clampEase(c.e - 0.15); }
    else if (rating === GOOD) interval = 1;
    else { interval = c.l > 0 ? 2 : 4; c.e = clampEase(c.e + 0.15); }
  } else {
    // Reviewing late and still remembering is evidence of a stronger memory.
    const late = Math.max(0, today - c.d);
    if (rating === AGAIN) {
      interval = 0;
      c.l += 1;
      c.e = clampEase(c.e - 0.2);
    } else if (rating === HARD) {
      c.e = clampEase(c.e - 0.15);
      interval = Math.max(c.i + 1, Math.round(c.i * 1.2 * pace));
    } else {
      const good = Math.max(c.i + 1, Math.round((c.i + late / 2) * c.e * pace));
      if (rating === GOOD) interval = good;
      else {
        interval = Math.max(good + 1, Math.round((c.i + late) * c.e * 1.3 * pace));
        c.e = clampEase(c.e + 0.15);
      }
    }
  }

  if (interval > 0) c.n += 1;
  c.i = Math.min(interval, MAX_INTERVAL);
  c.d = today + c.i;
  return c;
}

/** Mastery bucket for display. */
export function bucket(card) {
  if (!card) return 'new';
  if (card.i === 0) return 'learning';
  return card.i >= 21 ? 'mature' : 'young';
}

// ───────── New-word order ─────────
// Each mode is a fixed sequence of word indexes, so the same words come up on
// every visit and reload; each day's new words are the next unseen ones in it.

/** Small deterministic PRNG (mulberry32). */
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Frequency bands for 'mixed' (by rank, 0-based) and how often each is drawn.
 * 4 : 3 : 2 : 1 means a day of 10 new words averages 4 very common, 3 common,
 * 2 less common and 1 rarer word. Within a band, words still come in frequency
 * order. When a band runs out, the others share its weight.
 */
export const MIX_BANDS = [
  { upTo: 500, weight: 4 },
  { upTo: 1200, weight: 3 },
  { upTo: 2000, weight: 2 },
  { upTo: Infinity, weight: 1 },
];

/** @param {'mixed'|'frequency'|'random'} mode  @param {number} count  number of words */
export function newCardOrder(mode, count) {
  const ids = Array.from({ length: count }, (_, i) => i);
  if (mode === 'frequency') return ids;

  if (mode === 'random') {
    const rand = seededRandom(0x5eed);
    for (let k = ids.length - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1));
      [ids[k], ids[j]] = [ids[j], ids[k]];
    }
    return ids;
  }

  const rand = seededRandom(0x313d);
  const bands = MIX_BANDS.map(() => []);
  for (const id of ids) bands[MIX_BANDS.findIndex((b) => id < b.upTo)].push(id);
  const next = bands.map(() => 0);
  const out = [];
  while (out.length < count) {
    const open = MIX_BANDS.map((b, k) => (next[k] < bands[k].length ? b.weight : 0));
    let r = rand() * open.reduce((a, w) => a + w, 0);
    let pick = open.findLastIndex((w) => w > 0);
    for (let k = 0; k < open.length; k++) {
      if (!open[k]) continue;
      r -= open[k];
      if (r < 0) { pick = k; break; }
    }
    out.push(bands[pick][next[pick]++]);
  }
  return out;
}

// Compact array form for storage: [interval, ease, due, reps, lapses]
export const pack = (c) => [c.i, c.e, c.d, c.n, c.l];
export const unpack = (a) => (a ? { i: a[0], e: a[1], d: a[2], n: a[3], l: a[4] } : null);

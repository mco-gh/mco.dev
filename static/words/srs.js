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
  order: 'frequency', // 'frequency' (most common first) | 'random'
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

// Compact array form for storage: [interval, ease, due, reps, lapses]
export const pack = (c) => [c.i, c.e, c.d, c.n, c.l];
export const unpack = (a) => (a ? { i: a[0], e: a[1], d: a[2], n: a[3], l: a[4] } : null);

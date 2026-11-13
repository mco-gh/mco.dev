# Words

Flashcards with spaced repetition for the 2,809 most common English words
(New General Service List 1.2). A fully static, offline-capable progressive web app:
no server code, no login, all progress in the browser's localStorage.

## Where it lives

The app is part of the mco.dev Hugo site and is published at https://mco.dev/words/.

- `static/words/` is the app itself. Hugo copies `static/` to the site unchanged,
  so everything in that folder is public.
- `words-src/` (this folder) holds what should not be published: this README,
  the data-generation sources in `build/`, and a local preview config in `.claude/`.

## Run it locally

Serve the site's `static/` folder so URLs match production:

    python3 -m http.server 4174 --directory static

Then open http://localhost:4174/words/. Running `hugo server` also works
(http://localhost:1313/words/). Opening `index.html` straight from disk does not
work, because browsers block module scripts and service workers on `file://`.

## Publish

Commit and push to `master`; Netlify runs `hugo` and publishes `public/`.
Before each release, bump `VERSION` in `static/words/sw.js` (see Updating).

## Layout

    static/words/                 the published app (https://mco.dev/words/)
      index.html, styles.css      markup and styles
      app.js                      UI, session queue, settings, routing
      srs.js                      spaced-repetition scheduler (pure functions)
      store.js                    localStorage persistence + validation
      i18n.js                     definition languages and UI strings
      sw.js, manifest.webmanifest PWA: offline cache and install metadata
      data/words.json             [word, IPA, part of speech] in frequency order
      data/defs.<lang>.json       one definition per word, same order
    words-src/build/              scripts and sources used to generate data/

## Spaced repetition

An SM-2 style scheduler in whole days, assuming one session per day.

- New word: Again = repeat later in the same session, Hard/Good = tomorrow, Easy = 4 days.
- Review: Good multiplies the interval by the card's ease (starts at 2.5), Hard by 1.2
  (ease -0.15), Easy by ease x 1.3 (ease +0.15). Typical Good chain: 1, 3, 8, 20, 50, 125 days.
- Again on a learned word resets it to tomorrow and lowers its ease by 0.2 (minimum 1.3).
- Late reviews answered correctly get credit for the extra time elapsed.
- The day rolls over at 04:00 local time. Intervals are capped at 365 days.

## New-word order

Each order is a fixed sequence of the 2,809 words (`newCardOrder` in `srs.js`);
each day's new words are the next unseen ones in it, so they don't reshuffle on reload.

- **Mixed** (default): draws from four frequency bands (ranks 1-500, 501-1200,
  1201-2000, 2001+) weighted 4 : 3 : 2 : 1, keeping frequency order within each band.
  A day of 10 new words averages 4 very common, 3 common, 2 less common and 1 rarer word.
  Tune `MIX_BANDS` to change the blend.
- **Most common first**: strict frequency order. Best for beginners.
- **Random**: a fixed shuffle of the whole list. Mostly less common words, so best
  for advanced learners.

Settings (new words/day, max reviews/day, order, pace) live under
`wordspring.settings.v1`; progress under `wordspring.progress.v1`.

## Add a definition language

1. Create `static/words/data/defs.<code>.json`: a JSON array of 2,809 strings in the same
   order as `words.json`.
2. Add an entry to `LANGS` in `static/words/i18n.js` (name, defs path, part-of-speech labels,
   interval units, UI strings; missing UI strings fall back to English).
3. Add the new file to `ASSETS` in `static/words/sw.js` and bump `VERSION` there.

## Updating

The service worker serves cached files first and refreshes them in the background,
so bump `VERSION` in `static/words/sw.js` on every release; users get the new version on their
next visit.

## Credits

Word list, pronunciations and English definitions: New General Service List 1.2
(Browne, Culligan & Phillips, CC BY-SA 4.0) via the NGSL Learning Dictionary,
https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html

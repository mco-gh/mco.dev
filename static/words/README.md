# Words

Flashcards with spaced repetition for the 2,809 most common English words
(New General Service List 1.2). A fully static, offline-capable progressive web app:
no server code, no login, all progress in the browser's localStorage.

## Run it

Any static file server works. Service workers need `http://localhost` or HTTPS
(opening `index.html` straight from disk will not work, because browsers block
module scripts and service workers on `file://`).

    cd app
    python3 -m http.server 4173

Then open http://localhost:4173. To publish, upload the contents of `app/` to any
static host (GitHub Pages, Netlify, Cloudflare Pages, S3, ...). All paths are relative,
so it also works from a sub-folder.

## Layout

    app/
      index.html, styles.css      markup and styles
      app.js                      UI, session queue, settings, routing
      srs.js                      spaced-repetition scheduler (pure functions)
      store.js                    localStorage persistence + validation
      i18n.js                     definition languages and UI strings
      sw.js, manifest.webmanifest PWA: offline cache and install metadata
      data/words.json             [word, IPA, part of speech] in frequency order
      data/defs.<lang>.json       one definition per word, same order
    build/                        scripts and sources used to generate data/

## Spaced repetition

An SM-2 style scheduler in whole days, assuming one session per day.

- New word: Again = repeat later in the same session, Hard/Good = tomorrow, Easy = 4 days.
- Review: Good multiplies the interval by the card's ease (starts at 2.5), Hard by 1.2
  (ease -0.15), Easy by ease x 1.3 (ease +0.15). Typical Good chain: 1, 3, 8, 20, 50, 125 days.
- Again on a learned word resets it to tomorrow and lowers its ease by 0.2 (minimum 1.3).
- Late reviews answered correctly get credit for the extra time elapsed.
- The day rolls over at 04:00 local time. Intervals are capped at 365 days.

Settings (new words/day, max reviews/day, order, pace) live under
`wordspring.settings.v1`; progress under `wordspring.progress.v1`.

## Add a definition language

1. Create `app/data/defs.<code>.json`: a JSON array of 2,809 strings in the same
   order as `words.json`.
2. Add an entry to `LANGS` in `app/i18n.js` (name, defs path, part-of-speech labels,
   interval units, UI strings; missing UI strings fall back to English).
3. Add the new file to `ASSETS` in `app/sw.js` and bump `VERSION` there.

## Updating

The service worker serves cached files first and refreshes them in the background,
so bump `VERSION` in `sw.js` on every release; users get the new version on their
next visit.

## Credits

Word list, pronunciations and English definitions: New General Service List 1.2
(Browne, Culligan & Phillips, CC BY-SA 4.0) via the NGSL Learning Dictionary,
https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html

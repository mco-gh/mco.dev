# Words

Flashcards with spaced repetition for the most common words in English (2,809 words,
New General Service List 1.2) and French (1,354 words, Éduscol frequency list).
The learner picks a **study language** (front of the cards) and an **explanation
language** (back of the cards and the whole interface); both can be English or French.
A fully static, offline-capable progressive web app: no server code, no login, all
progress in the browser's localStorage.

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
      i18n.js                     study + explanation languages and UI strings
      sw.js, manifest.webmanifest PWA: offline cache and install metadata
      data/<study>/words.json     [word, IPA, part of speech] in frequency order
      data/<study>/defs.<lang>.json  one explanation per word, same order
    words-src/build/              English sources: NGSL parse script + French glosses
    words-src/build/fr/           French sources: fr-words-*.txt and build.py

## Spaced repetition

An SM-2 style scheduler in whole days, assuming one session per day.

- New word: Again = repeat later in the same session, Hard/Good = tomorrow, Easy = 4 days.
- Review: Good multiplies the interval by the card's ease (starts at 2.5), Hard by 1.2
  (ease -0.15), Easy by ease x 1.3 (ease +0.15). Typical Good chain: 1, 3, 8, 20, 50, 125 days.
- Again on a learned word resets it to tomorrow and lowers its ease by 0.2 (minimum 1.3).
- Late reviews answered correctly get credit for the extra time elapsed.
- The day rolls over at 04:00 local time. Intervals are capped at 365 days.

## New-word order

Each order is a fixed sequence of the study language's words (`newCardOrder` in `srs.js`);
each day's new words are the next unseen ones in it, so they don't reshuffle on reload.

- **Mixed** (default): draws from four frequency bands weighted 4 : 3 : 2 : 1, keeping
  frequency order within each band. The bands are shares of the list (for English they
  end at ranks 500, 1,200 and 2,000), so every language is split the same way.
  A day of 10 new words averages 4 very common, 3 common, 2 less common and 1 rarer word.
  Tune `MIX_BANDS` to change the blend.
- **Most common first**: strict frequency order. Best for beginners.
- **Random**: a fixed shuffle of the whole list. Mostly less common words, so best
  for advanced learners.

## Storage

- `wordspring.settings.v1`: study language, explanation language, new words/day,
  max reviews/day, order, pace.
- Progress is kept per study language: `wordspring.progress.v1` for English (the
  original key) and `wordspring.progress.<study>.v1` for the others (`...fr.v1`).
- Backups (Settings > Export) hold every study language's progress. Older
  English-only backups still import.

## The French word list

Source: Éduscol's "Liste de fréquence lexicale" (about 1,500 of the most frequent French
words, compiled by Étienne Brunet), spreadsheet from
https://eduscol.education.gouv.fr/6873/liste-de-frequence-lexicale

How it was turned into cards (`words-src/build/fr/fr-words-*.txt`, one line per card:
`word|IPA|part of speech|English meaning|French definition`, most frequent first):

- Words listed several times with different roles (e.g. "le" as article and as pronoun)
  share one card with a combined part of speech: 1,462 rows became 1,354 cards.
- Dropped: inflected forms of words already listed (toute, beaux, eaux, l'une, noire,
  claire, haute, fine, vieil) and the proper name "françois".
- Corrected spellings: coeur/oeil/oeuvre to cœur/œil/œuvre, and two lemmatisation slips
  in the source ("manier" and "miser" listed as nouns are "manière" and "misère").
- The order is the source's frequency order, unchanged.
- Pronunciations, noun genders (nm / nf / nmf), English meanings and French
  definitions were written for this app.

Rebuild the JSON after editing those files:

    python3 words-src/build/fr/build.py

## Add an explanation language

1. For each study language, create `static/words/data/<study>/defs.<code>.json`: a JSON
   array with one string per word, in the same order as that folder's `words.json`.
2. Add an entry to `LANGS` in `static/words/i18n.js` (name, part-of-speech labels,
   interval units, About text, UI strings; missing UI strings fall back to English).
3. Add the new files to `ASSETS` in `static/words/sw.js` and bump `VERSION` there.

## Add a study language

1. Create `static/words/data/<code>/words.json` (`[word, "/IPA/", part of speech]` in
   frequency order) and a `defs.<lang>.json` there for every explanation language.
2. Add an entry to `STUDY` in `static/words/i18n.js` (name, speech-synthesis voice), and
   a `study.<code>` string (the language's name) for each explanation language.
3. Add the files to `ASSETS` in `static/words/sw.js` and bump `VERSION`.

## Updating

The service worker serves cached files first and refreshes them in the background,
so bump `VERSION` in `static/words/sw.js` on every release; users get the new version on their
next visit.

## Credits

English word list, pronunciations and definitions: New General Service List 1.2
(Browne, Culligan & Phillips, CC BY-SA 4.0) via the NGSL Learning Dictionary,
https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html

French word list: Éduscol, "Liste de fréquence lexicale" (Étienne Brunet),
https://eduscol.education.gouv.fr/6873/liste-de-frequence-lexicale
Its reuse terms have not been checked.

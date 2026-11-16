# Words

Flashcards with spaced repetition for the most common words in five languages:

| Study language | Words | Source | Licence of the source |
|---|---|---|---|
| English | 2,809 | New General Service List 1.2 | CC BY-SA 4.0 |
| French  | 1,354 | Éduscol "Liste de fréquence lexicale" | not checked |
| Spanish | 2,107 | RAE CORPES XXI lemma frequencies | CC BY-SA 4.0 |
| German  | 2,088 | IDS Mannheim DeReWo lemma list (2012) | CC BY-NC 3.0 (non-commercial) |
| Japanese | 2,052 | NINJAL BCCWJ word list (主要語彙表) | free for research and educational use |

The learner picks a **study language** (front of the cards) and an **explanation
language** (back of the cards and the whole interface): English, French, Spanish,
German or Japanese. When the two match, the back shows a short definition in that language.
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
    words-src/build/              English sources (NGSL parse script, French glosses)
                                  and build.py, which builds the fr / es / de data
    words-src/build/<lang>/       <lang>-words-*.txt sources for fr, es, de
    words-src/build/icons/        full-bleed icon source + render.sh

The app icon is `static/words/icons/icon.svg`; the header logo is a small inline copy
in `index.html`. After changing either SVG, regenerate the PNG icons with headless
Chrome (ImageMagick's built-in SVG renderer drops the gradient and the letter):

    bash words-src/build/icons/render.sh

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

## The Spanish word list

Source: the Real Academia Española's CORPES XXI frequency lists ("5000 lemas más
frecuentes", CC BY-SA 4.0), https://www.rae.es/corpes/

- Taken in frequency order, keeping the top ~2,100 after filtering.
- Dropped: punctuation, numbers written as digits, symbols, foreign words, proper names
  (countries, cities, people, brands, abbreviations), fillers ("eeh"), the contractions
  "del" and "al", and the nationalities of smaller countries (colombiano, cubano, chileno,
  venezolano). Major nationalities and languages (español, inglés, francés…) stay.
- Lemmas listed with several parts of speech (que, uno, más…) share one card.
- The RAE files some feminine nouns under the masculine form ("músico" for "música");
  where the feminine is the everyday word, the card uses it (música, carretera,
  perspectiva, característica, ganas).
- Pronunciations follow Latin American Spanish (no /θ/), the majority accent in this
  pan-Hispanic corpus; the listen button uses an es-MX voice.

## The German word list

Source: DeReWo basic lemma list, version v-ww-bll-320000g-2012-12-31-1.0,
© Institut für Deutsche Sprache, Programmbereich Korpuslinguistik, Mannheim, 2013,
licensed CC BY-NC 3.0 (attribution, non-commercial),
https://www.ids-mannheim.de/derewo

- Taken in the list's frequency order, keeping ~2,100 after filtering.
- Dropped: contractions (im, zum, zur, am, vom, beim, ins, aufs), sentence-initial
  capitalised duplicates (Was, Ich, Für…), corpus artefacts from web and Wikipedia text
  (Infobox, Weblink, Navigationsleiste, Einzelnachweis, Patentamt), surnames, place-name
  adjectives (Berliner, Münchner…), and terms for regional government bodies
  (Verbandsgemeinde, Landrat, Ortsbürgermeister…).
- Nouns are written with their article ("der Tag"), with gender codes nm / nf / nn,
  nmf for nouns like "der/die Erwachsene", and npl for plural-only nouns (die Leute).
- Combined headwords are spelled out ("der, die, das", "dieser, diese, dieses").
- Because the source is CC BY-NC, the German data must not be used commercially, and
  the credit above must stay (it is also in the app's About dialog).

## The Japanese word list

Source: the BCCWJ word list (`BCCWJ-main_goihyo.zip`, the frequency list of the core
Balanced Corpus of Contemporary Written Japanese), National Institute for Japanese
Language and Linguistics (NINJAL), https://clrd.ninjal.ac.jp/bccwj/en/freq-list.html.
NINJAL makes it free for research and educational use; it has no formal licence, so
keep the app free and non-commercial and keep the credit in the About dialog.

- Ranked by average usage rate across the six registers (books, published books,
  magazines, newspapers, Yahoo! Chiebukuro Q&A, Yahoo! blogs), keeping words that occur
  in at least five of them.
- Dropped: proper nouns, symbols, prefixes and suffixes, fillers (あー, えー), compound
  numerals (二十, 三百…; the single digits, 百, 千, 万, 億 stay), and a few lemmas that
  only make sense inside longer words (具体 of 具体的, 積極 of 積極的…).
- BCCWJ lemmas use dictionary kanji (為る, 有る, 其の, 迚も); words are shown as they are
  usually written instead (する, ある, その, とても). The reading is in hiragana
  (katakana for loanwords) and is left out of `words.json` when the word is all kana.
- Parts of speech: noun, verb, adj (い-adjective), adjna (な-adjective), adv, pron, conj,
  det (連体詞), intj, num.

## Rebuilding the word data

Each `words-src/build/<lang>/<lang>-words-*.txt` line is
`word|IPA|part of speech|English meaning|French meaning`, most frequent first.
After editing, rebuild that language's JSON:

    python3 words-src/build/build.py fr      # or es, de

The script refuses to write anything if a line has the wrong number of fields, a
duplicate word, an unknown part of speech or a non-IPA character in the pronunciation.

The Spanish and German explanations live in `words-src/build/<study>/<study>-esde-*.txt`
(`word|Spanish|German`, one line per word, in exactly the order of that study language's
`words.json`). Rebuild them with:

    python3 words-src/build/build_esde.py en   # or fr, es, de

It writes `defs.es.json` and `defs.de.json` and refuses to write anything if a word is
missing, extra or out of order.

Japanese has its own builder. The Japanese study list is in
`words-src/build/ja/ja-words-*.txt`
(`word|reading|part of speech|English|French|Spanish|German|Japanese definition`), and
the Japanese explanations for the other study languages are in
`words-src/build/<study>/<study>-ja-*.txt` (`word|Japanese`, in `words.json` order):

    python3 words-src/build/build_ja.py ja     # the Japanese study list
    python3 words-src/build/build_ja.py en     # defs.ja.json for en (or fr, es, de)

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

Spanish word list: Real Academia Española, CORPES XXI (CC BY-SA 4.0),
https://www.rae.es/corpes/

German word list: DeReWo, © Institut für Deutsche Sprache, Mannheim, 2013
(CC BY-NC 3.0), https://www.ids-mannheim.de/derewo

Japanese word list: BCCWJ word list, National Institute for Japanese Language and
Linguistics (NINJAL), https://clrd.ninjal.ac.jp/bccwj/en/freq-list.html
(free for research and educational use).

The French, Spanish, German and Japanese pronunciations, readings, genders, definitions
and all translations (including every Spanish, German and Japanese explanation) were
written for this app.

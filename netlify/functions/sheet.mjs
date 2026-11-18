// GET /api/sheet?q=<song>&src=imslp|mutopia — free sheet music search for the Sheet app.
//
// IMSLP and the Mutopia Project don't let browsers read their search results
// directly (no CORS headers), so Sheet asks this function, which searches them
// and returns a short, uniform list. The Internet Archive does allow browsers,
// so Sheet searches it itself.
//
// Each result: { source, title, composer, forText, instruments, year, style,
// license, url, pdf, midi, preview, files }. `instruments` is a list of
// lower-case words describing every arrangement on the page, which the app
// matches against the instrument you picked.
//
// Responses are cached by Netlify's CDN for a day, so repeat searches don't
// reach IMSLP or Mutopia at all.

const UA = 'mco.dev Sheet (https://mco.dev/sheet/)';
const TIMEOUT = 9000;

const json = (body, status = 200, cache = true) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': cache ? 'public, max-age=3600' : 'no-store',
    'Netlify-CDN-Cache-Control': cache ? 'public, s-maxage=86400, stale-while-revalidate=604800' : 'no-store',
  },
});

const get = async (url, type = 'json') => {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`${new URL(url).host} answered ${res.status}`);
  return type === 'json' ? res.json() : res.text();
};

// Words that don't help decide whether a title matches the search.
const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'in', 'on', 'to', 'for', 'my', 'de', 'la', 'le', 'el', 'der', 'die', 'das', 'op', 'no']);
export const words = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter((w) => w && !STOP.has(w));
const allIn = (needles, hay) => { const h = new Set(words(hay)); return needles.every((w) => h.has(w)); };

// IMSLP's fields are wiki markup: ''italic'', [[Link|text]], {{flat}}.
const unwiki = (s) => s
  .replace(/\{\{flat\}\}/gi, '♭').replace(/\{\{sharp\}\}/gi, '♯').replace(/\{\{natural\}\}/gi, '♮')
  .replace(/\{\{[^{}|]*\|([^{}]*)\}\}/g, '$1').replace(/\{\{[^{}]*\}\}/g, '')
  .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1').replace(/'{2,}/g, '')
  .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const decode = (s) => s
  .replace(/<[^>]*>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/\s+/g, ' ').trim();

// ───────── IMSLP ─────────
// IMSLP abbreviations used in its Tags field, mapped to the words the app matches on.
const IMSLP_TAGS = {
  pf: 'piano', gtr: 'guitar', vn: 'violin', vc: 'cello', va: 'viola', db: 'double bass', fl: 'flute',
  cl: 'clarinet', ob: 'oboe', bn: 'bassoon', sax: 'saxophone', asax: 'saxophone', tsax: 'saxophone',
  tpt: 'trumpet', hn: 'horn', tbn: 'trombone', tba: 'tuba', hp: 'harp', org: 'organ', acc: 'accordion',
  mand: 'mandolin', uke: 'ukulele', rec: 'recorder', hpd: 'harpsichord', bjo: 'banjo', voice: 'voice',
  sop: 'voice', alt: 'voice', ten: 'voice', bar: 'voice', bass: 'voice', mixed: 'choir', chorus: 'choir',
  orch: 'orchestra', perc: 'percussion', timp: 'percussion', picc: 'flute', lute: 'lute', harm: 'harmonium',
};

function parseImslp(title, text) {
  const field = (name) => unwiki((text.match(new RegExp(`\\|${name}=([^\\n]*)`)) ?? [])[1] ?? '');
  const instrumentation = field('Instrumentation');
  const tags = field('Tags').split(/[;,\s]+/).map((t) => IMSLP_TAGS[t.toLowerCase()]).filter(Boolean);
  // Arrangements are listed under headings such as "===For Guitar (Tárrega)===".
  const arrangements = [...text.matchAll(/^=+\s*For ([^=(\n]+)/gm)].map((m) => m[1].trim());
  const pdfs = [...text.matchAll(/\|File Name \d+=([^\n]+\.pdf)\s*$/gim)].length;
  const [, workTitle = title, composer = ''] = title.match(/^(.*) \((.*)\)$/) ?? [];
  const [last, first] = composer.split(', ');
  return {
    source: 'imslp',
    title: field('Work Title') || workTitle,
    alt: field('Alternative Title'),
    composer: first ? `${first} ${last}` : composer,
    forText: instrumentation,
    instruments: [instrumentation, ...tags, ...arrangements].join(', ').toLowerCase(),
    year: field('Year/Date of Composition') || field('First Publication').match(/\d{4}/)?.[0] || '',
    style: field('Piece Style'),
    license: 'Public domain (in most countries)',
    url: `https://imslp.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    files: pdfs,
  };
}

async function imslp(q) {
  const need = words(q);
  const api = 'https://imslp.org/api.php?format=json&action=query';
  const found = await get(`${api}&list=search&srnamespace=0&srlimit=30&srsearch=${encodeURIComponent(q)}`);
  // Lists of works, people and categories aren't scores. Short titles without a
  // composer are usually redirects ("Fur elise"), which resolve to the work below.
  const titles = (found.query?.search ?? []).map((s) => s.title).filter((t) => !/^List of /i.test(t));
  if (!titles.length) return [];

  // Page text can be long (a popular work lists hundreds of arrangements), so
  // fetch a few pages per request to stay under the API's response size limit.
  const batches = [];
  for (let i = 0; i < titles.length; i += 6) batches.push(titles.slice(i, i + 6));
  const replies = await Promise.all(batches.map((b) =>
    get(`${api}&prop=revisions&rvprop=content&redirects=1&titles=${encodeURIComponent(b.join('|'))}`).catch(() => null)));

  const rank = new Map();   // resolved page title -> best search position
  const aliases = new Map(); // resolved page title -> titles that redirect to it
  const pages = new Map();
  for (const reply of replies) {
    const redirect = new Map((reply?.query?.redirects ?? []).map((r) => [r.from, r.to]));
    for (const p of Object.values(reply?.query?.pages ?? {})) if (p.revisions?.[0]?.['*']) pages.set(p.title, p.revisions[0]['*']);
    for (const [from, to] of redirect) aliases.set(to, `${aliases.get(to) ?? ''} ${from}`);
  }
  titles.forEach((t, i) => {
    const page = [...aliases].find(([, from]) => from.includes(t))?.[0] ?? t;
    if (!rank.has(page)) rank.set(page, i);
  });

  return [...pages]
    .filter(([title]) => /\(.+\)$/.test(title)) // work pages are named "Title (Last, First)"
    .map(([title, text]) => ({ i: rank.get(title) ?? 99, r: parseImslp(title, text), also: aliases.get(title) ?? '' }))
    // Keep works whose title, alternative title or a redirect to it contains every word searched for.
    .filter(({ r, also }) => allIn(need, `${r.title} ${r.alt} ${r.composer} ${also}`))
    .sort((a, b) => a.i - b.i)
    .map(({ r }) => { delete r.alt; return r; });
}

// ───────── Mutopia ─────────
async function mutopia(q) {
  const need = words(q);
  const html = await get(`https://www.mutopiaproject.org/cgibin/make-table.cgi?searchingfor=${encodeURIComponent(q)}`, 'text');
  const out = [];
  for (const [table] of html.matchAll(/<table class="table-bordered result-table">[\s\S]*?<\/table>/g)) {
    const cells = [...table.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    const href = (re) => table.match(new RegExp(`href="([^"]*${re})"`))?.[1] ?? '';
    const [title, composer, , , forText, , style, , source, license, info, date] = cells.map(decode);
    const id = table.match(/piece-info\.cgi\?id=(\d+)/)?.[1];
    if (!title || !id) continue;
    const r = {
      source: 'mutopia',
      title: title.replace(/^\d+\.\s*/, ''),
      composer: composer.replace(/^by /, ''),
      forText: forText.replace(/^for /, ''),
      instruments: forText.replace(/^for /, '').toLowerCase(),
      year: '',
      style,
      license,
      url: `https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=${id}`,
      pdf: href('-let\\.pdf') || href('\\.pdf'),
      pdfA4: href('-a4\\.pdf'),
      midi: href('\\.mid'),
      preview: href('-preview\\.png') || href('\\.png'),
      files: 1,
    };
    if (allIn(need, `${r.title} ${r.composer} ${source}`)) out.push(r);
  }
  return out;
}

const SOURCES = { imslp, mutopia };

export default async (req) => {
  const params = new URL(req.url).searchParams;
  const q = (params.get('q') ?? '').trim().slice(0, 120);
  const src = params.get('src') ?? '';
  if (!q || !SOURCES[src]) return json({ error: 'Usage: /api/sheet?q=<song>&src=imslp|mutopia' }, 400, false);
  try {
    return json({ source: src, results: (await SOURCES[src](q)).slice(0, 30) });
  } catch (err) {
    console.error(`sheet ${src}:`, err);
    return json({ error: `Couldn't reach ${src === 'imslp' ? 'IMSLP' : 'Mutopia'}` }, 502, false);
  }
};

export const config = {
  path: '/api/sheet',
  // Per visitor: a search makes two requests, so this allows a search every few seconds.
  rateLimit: { windowLimit: 40, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};

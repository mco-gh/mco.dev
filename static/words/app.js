import { schedule, bucket, pack, unpack, dayNumber, dateOfDay, newCardOrder, AGAIN } from './srs.js';
import {
  KEYS, progressKey, emptyProgress, loadProgress, saveProgress, loadSettings, saveSettings,
  sanitizeProgress, sanitizeSettings, requestPersistence,
} from './store.js';
import {
  LANGS, STUDY, dataPath, t, setLang, getLang, setStudy, getStudy, posLabel, fmtInterval, aboutContent,
} from './i18n.js';

const $ = (id) => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// ───────── State ─────────
let words = [];            // [word, ipa, pos][] for the study language
let defs = [];             // one explanation per word, in the explanation language
const wordsCache = {};     // study -> words
const defsCache = {};      // "study/lang" -> defs
let settings = loadSettings();
let progress = emptyProgress();
let today = dayNumber();
let queue = [];            // [{ id, kind: 'new' | 'learning' | 'review' }]
let flipped = false;
let undoState = null;

// ───────── Boot ─────────
async function init() {
  setLang(settings.lang);
  setStudy(settings.study);
  applyStrings();
  wireEvents();
  try {
    [words, defs] = await loadData(getStudy(), getLang()).catch((err) => {
      if (getStudy() === 'en') throw err;
      setStudy('en'); // the saved study language is unavailable: fall back
      return loadData('en', getLang());
    });
  } catch (err) {
    console.error(err);
    $('load-error').textContent = t('load.error');
    $('load-error').hidden = false;
    return;
  }
  progress = loadProgress(getStudy(), words.length);
  applyStrings();
  fillSettingsForm();
  startSession();
  route();
  registerServiceWorker();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

async function loadWords(study) {
  wordsCache[study] ??= await fetchJson(dataPath(study, 'words.json'));
  return wordsCache[study];
}

async function loadDefs(study, lang) {
  const key = `${study}/${lang}`;
  defsCache[key] ??= await fetchJson(dataPath(study, `defs.${lang}.json`));
  return defsCache[key];
}

const loadData = (study, lang) => Promise.all([loadWords(study), loadDefs(study, lang)]);

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.warn('SW registration failed', err));
  }
}

// ───────── i18n ─────────
function applyStrings() {
  document.documentElement.lang = getLang();
  document.title = t('app.title');
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  // Strings that depend on the study language: "*" in the key is the study code.
  const examples = words.slice(0, 3).map((w) => w[0]);
  const vars = { language: t(`study.${getStudy()}`), a: examples[0] ?? '…', b: examples[1] ?? '…', c: examples[2] ?? '…' };
  for (const el of document.querySelectorAll('[data-i18n-study]')) {
    el.textContent = t(el.dataset.i18nStudy.replace('*', getStudy()), vars);
  }
  for (const id of ['word', 'ipa', 'word-back', 'ipa-back']) $(id).lang = getStudy();
  for (const el of document.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
  for (const el of document.querySelectorAll('[data-i18n-placeholder]')) el.placeholder = t(el.dataset.i18nPlaceholder);
  for (const [id, key] of [['open-settings', 'nav.settings'], ['open-about', 'nav.about']]) {
    $(id).setAttribute('aria-label', t(key));
    $(id).title = t(key);
  }
  renderAbout();
  $('speak').setAttribute('aria-label', t('card.listen'));
  $('tabs').setAttribute('aria-label', 'Words');
  updateSchemeLabel();
}

function renderAbout() {
  const nodes = [];
  for (const section of aboutContent()) {
    const wrap = el('section');
    wrap.append(el('h3', '', section.h));
    if (section.p) {
      const p = el('p');
      for (const part of section.p) {
        if (typeof part === 'string') { p.append(part); continue; }
        const a = el('a', '', part.text);
        a.href = part.href;
        a.target = '_blank';
        a.rel = 'noopener';
        p.append(a);
      }
      wrap.append(p);
    }
    if (section.ul) wrap.append(el('ul'));
    for (const item of section.ul ?? []) wrap.lastChild.append(el('li', '', item));
    nodes.push(wrap);
  }
  $('about-body').replaceChildren(...nodes);
}

// ───────── Session / queue ─────────
function ensureToday() {
  today = dayNumber();
  if (progress.daily.day !== today) {
    progress.daily = { day: today, new: 0, rev: 0, done: 0, extra: 0 };
  }
}

function startSession() {
  ensureToday();
  undoState = null;
  const { cards, daily } = progress;
  const learning = [];
  const due = [];
  for (const [id, c] of Object.entries(cards)) {
    if (c[0] === 0) learning.push(+id);
    else if (c[2] <= today) due.push(+id);
  }
  due.sort((a, b) => cards[a][2] - cards[b][2] || a - b);
  due.length = Math.min(due.length, Math.max(0, settings.maxReviews - daily.rev));

  const fresh = pickNew(Math.max(0, settings.newPerDay + daily.extra - daily.new));

  // Spread new words evenly among the reviews so a session doesn't front-load them.
  const mixed = due.map((id) => ({ id, kind: 'review' }));
  const gap = (mixed.length + fresh.length) / (fresh.length || 1);
  fresh.forEach((id, k) => mixed.splice(Math.min(mixed.length, Math.round(k * gap)), 0, { id, kind: 'new' }));

  queue = [...learning.map((id) => ({ id, kind: 'learning' })), ...mixed];
  renderStudy();
}

const orderCache = {};

/** The next `count` unseen words in the chosen new-word order. */
function pickNew(count) {
  if (count <= 0) return [];
  const order = (orderCache[settings.order] ??= newCardOrder(settings.order, words.length));
  const picked = [];
  for (const id of order) {
    if (progress.cards[id]) continue;
    picked.push(id);
    if (picked.length === count) break;
  }
  return picked;
}

function answer(rating) {
  const item = queue[0];
  if (!item || !flipped) return;
  ensureToday();
  const prev = progress.cards[item.id];
  undoState = {
    id: item.id,
    prev: prev ? [...prev] : null,
    daily: { ...progress.daily },
    logged: progress.log[today] ?? 0,
    queue: queue.map((q) => ({ ...q })),
  };

  const next = schedule(unpack(prev), rating, today, settings.pace);
  progress.cards[item.id] = pack(next);
  if (!prev) progress.daily.new += 1;
  else if (prev[0] > 0) progress.daily.rev += 1;
  progress.log[today] = (progress.log[today] ?? 0) + 1;

  queue.shift();
  if (next.i === 0) {
    // Forgotten: show it again a few cards later in this same session.
    queue.splice(Math.min(queue.length, 4), 0, { id: item.id, kind: 'learning' });
  } else {
    progress.daily.done += 1;
  }
  persist();
  if (rating !== AGAIN) requestPersistence();
  renderStudy();
}

function undo() {
  if (!undoState) return;
  const u = undoState;
  if (u.prev) progress.cards[u.id] = u.prev;
  else delete progress.cards[u.id];
  progress.daily = u.daily;
  if (u.logged) progress.log[today] = u.logged;
  else delete progress.log[today];
  queue = u.queue;
  undoState = null;
  persist();
  renderStudy();
}

function persist() {
  if (!saveProgress(getStudy(), progress)) toast(t('msg.storage'));
}

// ───────── Study view ─────────
function renderStudy() {
  const item = queue[0];
  $('undo').hidden = !undoState;
  $('session').hidden = !item;
  $('done').hidden = !!item;
  if (!item) return renderDone();

  const count = (kind) => queue.filter((q) => q.kind === kind).length;
  $('count-new').textContent = count('new');
  $('count-learning').textContent = count('learning');
  $('count-review').textContent = count('review');
  const bar = $('session-bar');
  bar.max = progress.daily.done + queue.length;
  bar.value = progress.daily.done;

  const [word, ipa, pos] = words[item.id];
  const def = defs[item.id] ?? '';
  const card = $('card');

  // Reset to the front without animating (which would flash the next answer).
  card.classList.add('instant');
  setFlipped(false);
  $('word').textContent = $('word-back').textContent = word;
  $('word').classList.toggle('long', word.length > 12);
  $('ipa').textContent = $('ipa-back').textContent = ipa;
  $('pos').textContent = $('pos-back').textContent = posLabel(pos);
  $('definition').textContent = def;
  $('definition').classList.toggle('long', def.length > 70);
  $('definition').classList.toggle('short', def.length <= 28);
  $('badge-new').hidden = item.kind !== 'new';
  void card.offsetWidth;
  card.classList.remove('instant');
  if (!reducedMotion.matches) {
    card.animate(
      [{ opacity: 0, transform: 'translateY(14px) scale(0.98)' }, { opacity: 1, transform: 'none' }],
      { duration: 240, easing: 'ease-out' },
    );
  }

  const current = unpack(progress.cards[item.id]);
  for (const btn of document.querySelectorAll('.rate')) {
    const next = schedule(current, +btn.dataset.rating, today, settings.pace);
    btn.querySelector('small').textContent = fmtInterval(next.i);
  }
}

function setFlipped(value) {
  flipped = value;
  // Don't leave focus on a rating button that is about to be hidden, or the next
  // Space press would be swallowed by it instead of revealing the next card.
  if (!value && $('ratings').contains(document.activeElement)) document.activeElement.blur();
  $('card').classList.toggle('flipped', value);
  $('face-front').inert = value;
  $('face-back').inert = !value;
  $('show').hidden = value;
  $('ratings').hidden = !value;
}

function reveal() {
  if (!queue[0] || flipped) return;
  setFlipped(true);
  $('ratings').querySelector('.rate-3').focus({ preventScroll: true });
}

function renderDone() {
  const tomorrow = Object.values(progress.cards).filter((c) => c[0] > 0 && c[2] <= today + 1).length;
  const unseen = words.length - Object.keys(progress.cards).length;
  $('done-today').textContent = progress.daily.done;
  $('done-streak').textContent = streak();
  $('done-tomorrow').textContent = tomorrow + Math.min(settings.newPerDay, unseen);
  const extra = Math.min(unseen, Math.max(5, settings.newPerDay));
  $('more').hidden = unseen === 0;
  $('more').textContent = t('done.more', { n: extra });
  $('more').dataset.extra = extra;
  $('done-sub').textContent = unseen === 0 ? t('done.finished') : t('done.sub');
}

function streak() {
  let day = progress.log[today] ? today : today - 1;
  let n = 0;
  while (progress.log[day]) { n += 1; day -= 1; }
  return n;
}

function speak() {
  const item = queue[0];
  if (!item) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(words[item.id][0]);
  u.lang = STUDY[getStudy()].voice;
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

// ───────── Words view ─────────
const PAGE = 120;
let listMatches = [];
let listShown = 0;

function renderWords() {
  const q = $('search').value.trim().toLowerCase();
  const filter = $('filter').value;
  listMatches = [];
  for (let id = 0; id < words.length; id++) {
    if (filter !== 'all' && bucket(unpack(progress.cards[id])) !== filter) continue;
    // Match the word, its pronunciation or reading (so Japanese can be found by kana), or the explanation.
    if (q && !words[id][0].toLowerCase().includes(q) && !words[id][1].includes(q)
      && !(defs[id] ?? '').toLowerCase().includes(q)) continue;
    listMatches.push(id);
  }
  listShown = 0;
  $('word-list').replaceChildren();
  $('words-count').textContent = listMatches.length
    ? t('words.count', { n: new Intl.NumberFormat(getLang()).format(listMatches.length) })
    : t('words.empty');
  appendWords();
}

function appendWords() {
  const frag = document.createDocumentFragment();
  for (const id of listMatches.slice(listShown, listShown + PAGE)) {
    const [word, ipa, pos] = words[id];
    const b = bucket(unpack(progress.cards[id]));
    const li = el('li');
    const head = el('div', 'head');
    head.append(
      el('span', 'w', word, getStudy()), el('span', 'ipa', ipa, getStudy()), el('span', 'p', posLabel(pos)),
    );
    const status = el('span', 'status');
    status.append(el('span', `dot b-${b}`), el('span', 'label', t(`bucket.${b}`)));
    head.append(status);
    li.append(el('span', 'rank', `#${id + 1}`), head, el('p', 'def', defs[id] ?? ''));
    frag.append(li);
  }
  listShown += PAGE;
  $('word-list').append(frag);
}

function el(tag, className, text, lang) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  if (lang) node.lang = lang;
  return node;
}

// ───────── Progress view ─────────
function renderProgress() {
  const nf = new Intl.NumberFormat(getLang());
  const counts = { new: words.length, learning: 0, young: 0, mature: 0 };
  const forecast = new Array(14).fill(0);
  for (const packed of Object.values(progress.cards)) {
    const c = unpack(packed);
    counts[bucket(c)] += 1;
    counts.new -= 1;
    const offset = Math.max(0, c.d - today);
    if (offset < 14) forecast[offset] += 1;
  }
  const reviews = Object.values(progress.log).reduce((a, b) => a + b, 0);
  $('st-streak').textContent = nf.format(streak());
  $('st-learned').textContent = nf.format(counts.young + counts.mature);
  $('st-mature').textContent = nf.format(counts.mature);
  $('st-reviews').textContent = nf.format(reviews);

  const order = ['mature', 'young', 'learning', 'new'];
  $('mastery-bar').replaceChildren(...order.filter((b) => counts[b]).map((b) => {
    const seg = el('span', `b-${b}`);
    seg.style.flexGrow = counts[b];
    return seg;
  }));
  $('mastery-legend').replaceChildren(...order.map((b) => {
    const li = el('li');
    li.append(el('span', `dot b-${b}`), t(`bucket.${b}`), el('b', '', nf.format(counts[b])));
    return li;
  }));

  const peak = Math.max(1, ...forecast);
  const dayFmt = new Intl.DateTimeFormat(getLang(), { weekday: 'narrow' });
  const fullFmt = new Intl.DateTimeFormat(getLang(), { weekday: 'long', day: 'numeric', month: 'long' });
  $('forecast').replaceChildren(...forecast.map((n, k) => {
    const date = dateOfDay(today + k);
    const li = el('li');
    li.setAttribute('aria-label', `${fullFmt.format(date)}: ${n}`);
    const col = el('span', 'col');
    col.style.setProperty('--v', n / peak);
    const num = el('span', 'n', n || '');
    const day = el('span', 'day', dayFmt.format(date));
    num.ariaHidden = day.ariaHidden = 'true';
    li.append(num, col, day);
    return li;
  }));
}

// ───────── Routing ─────────
const VIEWS = ['study', 'words', 'progress'];

function route() {
  const name = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'study';
  for (const v of VIEWS) $(`view-${v}`).hidden = v !== name;
  for (const a of document.querySelectorAll('.tabs a')) {
    if (a.dataset.tab === name) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  if (!words.length) return;
  if (name === 'words') renderWords();
  if (name === 'progress') renderProgress();
  if (name === 'study' && dayNumber() !== today) startSession();
}

function refreshAll() {
  startSession();
  route();
}

// ───────── Theme ─────────
const schemeMeta = document.querySelector('meta[name="color-scheme"]');
const darkQuery = matchMedia('(prefers-color-scheme: dark)');

function setScheme(value) {
  schemeMeta.content = value;
  try {
    if (value === 'light dark') localStorage.removeItem(KEYS.scheme);
    else localStorage.setItem(KEYS.scheme, value);
  } catch { /* theme still applies for this visit */ }
  syncSchemeControl();
}

function syncSchemeControl() {
  const value = ['light', 'dark'].includes(schemeMeta.content) ? schemeMeta.content : 'light dark';
  for (const input of document.querySelectorAll('input[name="scheme"]')) input.checked = input.value === value;
}

function updateSchemeLabel() {
  $('scheme-system').textContent = t('set.systemNow', { scheme: t(darkQuery.matches ? 'set.darkLc' : 'set.lightLc') });
}

// ───────── Settings ─────────
function fillSettingsForm() {
  for (const [id, choices] of [['study', STUDY], ['lang', LANGS]]) {
    $(id).replaceChildren(...Object.entries(choices).map(([code, l]) => {
      const o = el('option', '', l.name);
      o.value = code;
      return o;
    }));
  }
  $('study').value = getStudy();
  $('lang').value = getLang();
  $('newPerDay').value = settings.newPerDay;
  $('maxReviews').value = settings.maxReviews;
  for (const input of document.querySelectorAll('input[name="order"]')) input.checked = input.value === settings.order;
  $('pace').value = String(settings.pace);
  syncSchemeControl();
}

function updateSettings(patch) {
  settings = sanitizeSettings({ ...settings, ...patch });
  if (!saveSettings(settings)) toast(t('msg.storage'));
}

async function changeLanguage(code) {
  try {
    defs = await loadDefs(getStudy(), code);
  } catch {
    toast(t('load.error'));
    $('lang').value = getLang();
    return;
  }
  setLang(code);
  updateSettings({ lang: code });
  applyStrings();
  // Keep the current card and its flip state; only the text changes.
  const wasFlipped = flipped;
  renderStudy();
  if (wasFlipped && queue[0]) { $('card').classList.add('instant'); setFlipped(true); requestAnimationFrame(() => $('card').classList.remove('instant')); }
  route();
}

/** Switch the language being learned: new word list, and that language's own progress. */
async function changeStudy(code) {
  let data;
  try {
    data = await loadData(code, getLang());
  } catch {
    toast(t('msg.studyError'));
    $('study').value = getStudy();
    return;
  }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  [words, defs] = data;
  setStudy(code);
  updateSettings({ study: code });
  progress = loadProgress(code, words.length);
  applyStrings();
  $('study').value = code;
  refreshAll();
}

function exportBackup() {
  // Every study language's progress, not just the one on screen.
  const all = {};
  for (const code of Object.keys(STUDY)) {
    const p = code === getStudy() ? progress : loadProgress(code, Infinity);
    if (Object.keys(p.cards).length) all[code] = p;
  }
  const blob = new Blob(
    [JSON.stringify({ app: 'wordspring', v: 2, exportedAt: new Date().toISOString(), settings, progress: all })],
    { type: 'application/json' },
  );
  const a = el('a');
  a.href = URL.createObjectURL(blob);
  a.download = `words-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(t('msg.exported'));
}

async function importBackup(file) {
  try {
    const data = JSON.parse(await file.text());
    if (data?.app !== 'wordspring' || typeof data.progress !== 'object' || !data.progress) throw new Error('shape');
    // v1 backups hold English progress only; v2 holds one entry per study language.
    const byStudy = typeof data.progress.cards === 'object' ? { en: data.progress } : data.progress;
    const codes = Object.keys(STUDY).filter((code) => typeof byStudy[code]?.cards === 'object');
    if (!codes.length) throw new Error('shape');
    for (const code of codes) saveProgress(code, sanitizeProgress(byStudy[code], Infinity));
    progress = loadProgress(getStudy(), words.length);
    if (data.settings) {
      updateSettings({ ...data.settings, lang: getLang(), study: getStudy() });
      fillSettingsForm();
    }
    refreshAll();
    toast(t('msg.imported'));
  } catch {
    toast(t('msg.importBad'));
  }
}

let toastTimer;
function toast(message) {
  const node = $('toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 2600);
}

// ───────── Events ─────────
function wireEvents() {
  addEventListener('hashchange', route);

  // Study
  $('card').addEventListener('click', (e) => { if (!e.target.closest('button')) reveal(); });
  $('show').addEventListener('click', reveal);
  $('ratings').addEventListener('click', (e) => {
    const btn = e.target.closest('.rate');
    if (btn) answer(+btn.dataset.rating);
  });
  $('undo').addEventListener('click', undo);
  $('more').addEventListener('click', () => {
    progress.daily.extra += +$('more').dataset.extra;
    persist();
    startSession();
  });
  if ('speechSynthesis' in window) {
    $('speak').hidden = false;
    $('speak').addEventListener('click', speak);
  }

  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    if ($('view-study').hidden || document.querySelector('dialog[open]')) return;
    if (e.target.closest('input, select, textarea')) return;
    const control = e.target.closest('button, a');
    const onButton = control && (control.checkVisibility?.() ?? true);
    if ((e.key === ' ' || e.key === 'Enter') && !flipped && !onButton) { e.preventDefault(); reveal(); }
    else if (flipped && e.key >= '1' && e.key <= '4') { e.preventDefault(); answer(+e.key); }
    else if (e.key.toLowerCase() === 'z' && undoState) undo();
  });

  // Words
  let searchTimer;
  $('search').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(renderWords, 120); });
  $('filter').addEventListener('change', renderWords);
  new IntersectionObserver((entries) => {
    if (entries.some((en) => en.isIntersecting) && listShown < listMatches.length) appendWords();
  }, { rootMargin: '600px' }).observe($('list-sentinel'));

  // Settings
  fillSettingsForm();
  $('study').addEventListener('change', (e) => changeStudy(e.target.value));
  $('lang').addEventListener('change', (e) => changeLanguage(e.target.value));
  $('scheme').addEventListener('change', (e) => setScheme(e.target.value));
  darkQuery.addEventListener('change', updateSchemeLabel);
  $('order').addEventListener('change', (e) => {
    updateSettings({ order: e.target.value });
    if (words.length) refreshAll();
  });
  for (const id of ['newPerDay', 'maxReviews', 'pace']) {
    $(id).addEventListener('change', (e) => {
      updateSettings({ [id]: e.target.value });
      e.target.value = String(settings[id]);
      if (words.length) refreshAll();
    });
  }
  $('export').addEventListener('click', exportBackup);
  $('import').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importBackup(file);
    e.target.value = '';
  });
  $('reset').addEventListener('close', (e) => {
    const confirmed = e.target.returnValue === 'reset';
    e.target.returnValue = '';
    if (!confirmed) return;
    progress = emptyProgress();
    persist();
    refreshAll();
    toast(t('msg.reset'));
  });

  // Stay in sync with other tabs, and roll over to a new day while left open.
  addEventListener('storage', (e) => {
    if (e.key === KEYS.scheme) { schemeMeta.content = e.newValue ?? 'light dark'; syncSchemeControl(); }
    if (e.key === progressKey(getStudy()) && words.length) { progress = loadProgress(getStudy(), words.length); refreshAll(); }
    if (e.key === KEYS.settings && words.length) {
      settings = loadSettings();
      fillSettingsForm();
      if (settings.study !== getStudy() && STUDY[settings.study]) changeStudy(settings.study);
      else if (settings.lang !== getLang()) changeLanguage(settings.lang);
      else refreshAll();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && words.length && dayNumber() !== today) refreshAll();
  });

  wireDialogFallbacks();
  wireInstall();
}

// Invoker commands and closedby are progressive enhancements; cover browsers without them.
function wireDialogFallbacks() {
  if (!('commandForElement' in HTMLButtonElement.prototype)) {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button[commandfor]');
      const target = btn && document.getElementById(btn.getAttribute('commandfor'));
      if (!(target instanceof HTMLDialogElement)) return;
      if (btn.getAttribute('command') === 'show-modal') target.showModal();
      else if (btn.getAttribute('command') === 'close') target.close();
    });
  }
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => { pressedOutside = e.target === dialog && outside(e, dialog); });
      dialog.addEventListener('pointerup', (e) => { if (pressedOutside && e.target === dialog && outside(e, dialog)) dialog.close(); });
    }
  }
}

function wireInstall() {
  const button = $('install');
  const supportsWebInstall = typeof Navigator.prototype.install === 'function';
  let deferredPrompt;
  if (matchMedia('(display-mode: standalone)').matches) return;
  if (supportsWebInstall) button.hidden = false;

  addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (!supportsWebInstall) button.hidden = false;
  });
  addEventListener('appinstalled', () => { button.hidden = true; });

  button.addEventListener('click', async () => {
    if (button.getAttribute('aria-disabled') === 'true') return;
    button.setAttribute('aria-disabled', 'true');
    try {
      if (supportsWebInstall) {
        await navigator.install();
        toast(t('msg.installed'));
        button.hidden = true;
      } else if (deferredPrompt) {
        const promptEvent = deferredPrompt;
        deferredPrompt = undefined;
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        toast(t(outcome === 'accepted' ? 'msg.installed' : 'msg.installCancelled'));
        if (!deferredPrompt) button.hidden = true;
      }
    } catch (error) {
      if (error.name === 'AbortError') toast(t('msg.installCancelled'));
      else console.error(error);
    } finally {
      button.removeAttribute('aria-disabled');
    }
  });
}

init();

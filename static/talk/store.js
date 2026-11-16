// Settings live in this browser's localStorage and nowhere else. If storage
// is blocked the app still works for the session.
const KEY = 'talk.settings.v1';

const DEFAULTS = Object.freeze({
  name: '',
  lang: '',            // language code; empty means "guess from the browser"
  engine: 'gemini-live',
  apiKey: '',
  captions: true,
});

export function loadSettings() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch {}
  const s = { ...DEFAULTS };
  for (const k of Object.keys(DEFAULTS)) {
    if (typeof saved[k] === typeof DEFAULTS[k]) s[k] = saved[k];
  }
  return s;
}

export function saveSettings(settings) {
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch {}
}

export function clearSettings() {
  try { localStorage.removeItem(KEY); } catch {}
  return { ...DEFAULTS };
}

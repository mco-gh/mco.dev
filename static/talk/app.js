// Talk: the page controller. Wires the lobby, the call screen and settings to
// the three independent pieces: languages/ (who speaks what), rtc.js (the link
// between the two browsers) and engines/ + translator.js (voice translation).
import { LANGUAGES, getLanguage, guessLanguage, setUiLanguage, t } from './languages/index.js';
import { loadSettings, saveSettings, clearSettings } from './store.js';
import { getEngine } from './engines/index.js';
import { startTranslator } from './translator.js';
import { openLink, newRoomCode } from './rtc.js';

const $ = (id) => document.getElementById(id);
const el = {
  lobby: $('lobby'), call: $('call'), setup: $('setup'), invite: $('invite'),
  preview: $('preview'), name: $('name'), chips: $('lang-chips'), hellos: $('hellos'),
  keyPill: $('key-pill'), keyPillText: $('key-pill-text'), error: $('lobby-error'),
  start: $('start'), startLabel: $('start-label'), inviteLink: $('invite-link'), cancelWait: $('cancel-wait'),
  remote: $('remote'), self: $('self'), peerChip: $('peer-chip'), selfChip: $('self-chip'),
  statusChip: $('status-chip'), statusText: $('status-text'), captions: $('captions'),
  mic: $('btn-mic'), cam: $('btn-cam'), translate: $('btn-translate'), captionsBtn: $('btn-captions'), hangup: $('btn-hangup'),
  settings: $('settings'), apiKey: $('api-key'), toggleKey: $('toggle-key'), keyLink: $('key-link'),
  captionsOn: $('captions-on'), forget: $('forget'), toast: $('toast'),
};

let settings = loadSettings();
if (!getLanguage(settings.lang)) settings.lang = guessLanguage().code;

const roomFromUrl = () => decodeURIComponent(location.hash.slice(1)).trim().toLowerCase();

// ── Call state ──────────────────────────────────────────────────────────────
let localStream = null;
let link = null;          // rtc.js link while waiting or in a call
let audioCtx = null;
let peer = null;          // { name, lang, canTranslate } once they say hello
let remoteStream = null;
let translateOn = true;   // shared switch: either person can flip it for both
let keyFailed = false;    // the engine rejected our key during this call
let busy = false;

const engine = () => getEngine(settings.engine);
const micTrack = () => localStream?.getAudioTracks()[0];
const canTranslate = () => Boolean(settings.apiKey) && !keyFailed;

// ── Small UI helpers ────────────────────────────────────────────────────────
let toastTimer = 0;
function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 3500);
}

function showError(message) {
  el.error.textContent = message ?? '';
  el.error.hidden = !message;
}

function renderLobby() {
  setUiLanguage(settings.lang);
  const joining = Boolean(roomFromUrl());
  el.startLabel.textContent = busy ? t('connecting') : t(joining ? 'join' : 'start');
  el.start.disabled = busy;
  el.keyPill.dataset.ready = String(Boolean(settings.apiKey));
  el.keyPillText.textContent = t(settings.apiKey ? 'key.on' : 'key.off');
  el.toggleKey.textContent = t(el.apiKey.type === 'password' ? 'settings.show' : 'settings.hide');
  el.selfChip.textContent = settings.name || t('you');
  if (peer) renderStatus();
}

function buildLanguagePicker() {
  el.chips.replaceChildren(...LANGUAGES.map((language) => {
    const label = document.createElement('label');
    const input = Object.assign(document.createElement('input'), {
      type: 'radio', name: 'lang', value: language.code, checked: language.code === settings.lang,
    });
    const flag = Object.assign(document.createElement('span'), { className: 'flag', textContent: language.flag });
    flag.setAttribute('aria-hidden', 'true');
    label.append(input, flag, language.name);
    return label;
  }));
  el.hellos.replaceChildren(...LANGUAGES.map((language) =>
    Object.assign(document.createElement('span'), { textContent: language.hello, lang: language.code })));
}

// ── Camera and microphone ───────────────────────────────────────────────────
async function getLocalStream() {
  if (localStream) return localStream;
  const audio = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio, video: { width: { ideal: 1280 }, height: { ideal: 720 } } });
  } catch {
    // No camera (or camera refused): a voice-only call still works.
    localStream = await navigator.mediaDevices.getUserMedia({ audio });
  }
  el.preview.srcObject = localStream;
  el.self.srcObject = localStream;
  el.preview.parentElement.classList.toggle('has-video', localStream.getVideoTracks().length > 0);
  return localStream;
}

// ── Translation ─────────────────────────────────────────────────────────────
// A lane is one direction of translation. It can be asked to be on or off at
// any time; starts and stops are run one after another so they never overlap.
function makeLane(start, stop) {
  let current = null;
  let want = false;
  let running = false;
  let state = 'off';
  const lane = {
    get state() { return state; },
    setState(next) { state = next; renderStatus(); },
    async set(on) {
      want = on;
      if (running) return;
      running = true;
      try {
        while (want !== Boolean(current)) {
          if (want) {
            lane.setState('starting');
            try { current = await start(lane); } catch (err) { want = false; onTranslateError(String(err?.message ?? err)); }
          } else {
            stop(current);
            current = null;
          }
        }
      } finally {
        running = false;
        if (!current) lane.setState('off');
      }
    },
  };
  return lane;
}

function onTranslateError(reason) {
  keyFailed = true;
  toast(t('err.translate', { reason: reason === 'badkey' ? t('err.badkey') : reason }));
  sayHello();
  syncTranslation();
}

const engineState = (lane, onLive) => (state, detail) => {
  if (state === 'error') return onTranslateError(detail);
  if (state === 'live') onLive();
  lane.setState(state === 'live' ? 'live' : 'starting');
};

// My voice, translated here before it is sent.
const outgoing = makeLane(
  async (lane) => {
    const mixed = audioCtx.createMediaStreamDestination();
    const translator = await startTranslator({
      ctx: audioCtx, engine: engine(), apiKey: settings.apiKey,
      stream: new MediaStream([micTrack()]),
      target: getLanguage(peer.lang),
      onCaption: (text) => link?.send({ t: 'cap', text }),
      onState: engineState(lane, () => link?.setAudioTrack(mixed.stream.getAudioTracks()[0])),
    });
    translator.output.connect(mixed);
    return translator;
  },
  (translator) => {
    translator.stop();
    link?.setAudioTrack(micTrack());
  },
);

// My friend's voice, translated here after it arrives (used when I have a key
// and they don't).
const incoming = makeLane(
  async (lane) => {
    const translator = await startTranslator({
      ctx: audioCtx, engine: engine(), apiKey: settings.apiKey,
      stream: new MediaStream(remoteStream.getAudioTracks()),
      target: getLanguage(settings.lang),
      onCaption: showCaption,
      onState: engineState(lane, () => { el.remote.muted = true; }),
    });
    translator.output.connect(audioCtx.destination);
    return translator;
  },
  (translator) => {
    translator.stop();
    el.remote.muted = false;
  },
);

/** Why (or whether) translation is needed right now. */
function translationPlan() {
  if (!peer) return { kind: 'none' };
  const mine = getLanguage(settings.lang);
  const theirs = getLanguage(peer.lang);
  if (peer.lang === settings.lang) return { kind: 'same', mine };
  if (!theirs || !engine().supports(mine) || !engine().supports(theirs)) return { kind: 'unsupported' };
  if (!translateOn) return { kind: 'off', mine, theirs };
  if (!canTranslate() && !peer.canTranslate) return { kind: 'nokey', mine, theirs };
  return { kind: 'translate', mine, theirs };
}

function syncTranslation() {
  const active = translationPlan().kind === 'translate' && canTranslate();
  // Each person with a key translates their own voice. If only I have one, I
  // also translate what I hear, so a single key covers the whole call.
  outgoing.set(active);
  incoming.set(active && !peer.canTranslate && Boolean(remoteStream?.getAudioTracks().length));
  renderStatus();
}

function renderStatus() {
  if (!peer) return;
  const plan = translationPlan();
  const text = {
    same: () => t('status.same', { lang: plan.mine.name }),
    unsupported: () => t('status.unsupported'),
    off: () => t('status.off'),
    nokey: () => t('status.nokey'),
    translate: () => t('status.live', { a: plan.mine.name, b: plan.theirs.name }),
    none: () => '',
  }[plan.kind]();
  let state = { translate: 'live', nokey: 'warn', unsupported: 'warn' }[plan.kind] ?? 'off';
  // When my friend is doing all the translating there is nothing local to wait for.
  if (plan.kind === 'translate' && canTranslate() && outgoing.state !== 'live') state = 'starting';
  el.statusChip.dataset.state = state;
  el.statusText.textContent = state === 'starting' ? t('status.starting') : text;
  el.translate.setAttribute('aria-pressed', String(translateOn));
  el.translate.disabled = plan.kind === 'same' || plan.kind === 'unsupported';
  el.peerChip.textContent = `${getLanguage(peer.lang)?.flag ?? ''} ${peer.name || t('friend')}`.trim();
}

// ── Captions ────────────────────────────────────────────────────────────────
let captionText = '';
let captionTimer = 0;
function showCaption(fragment) {
  if (!settings.captions || !fragment) return;
  captionText = (captionText + fragment).replace(/\s+/g, ' ');
  // Keep roughly two lines, cutting at a word.
  if (captionText.length > 150) captionText = captionText.slice(-150).replace(/^\S*\s/, '');
  el.captions.textContent = captionText.trim();
  el.captions.hidden = false;
  clearTimeout(captionTimer);
  captionTimer = setTimeout(clearCaption, 5000);
}
function clearCaption() {
  captionText = '';
  el.captions.hidden = true;
}

// ── The call ────────────────────────────────────────────────────────────────
function sayHello() {
  link?.send({ t: 'hello', name: settings.name, lang: settings.lang, canTranslate: canTranslate(), translate: translateOn });
}

function onMessage(msg) {
  if (!msg || typeof msg !== 'object') return;
  if (msg.t === 'hello') {
    const first = !peer;
    peer = { name: String(msg.name ?? '').slice(0, 30), lang: String(msg.lang ?? ''), canTranslate: Boolean(msg.canTranslate) };
    if (first) {
      // The host's switch position wins at the start; after that it is shared.
      if (!isHost) translateOn = msg.translate !== false;
      enterCall();
      toast(t('joined', { name: peer.name || t('friend') }));
    }
    syncTranslation();
  } else if (msg.t === 'translate') {
    translateOn = Boolean(msg.on);
    syncTranslation();
  } else if (msg.t === 'cap') {
    showCaption(String(msg.text ?? '').slice(0, 500));
  }
}

let isHost = false;

async function startOrJoin() {
  if (busy || link) return;
  showError();
  if (typeof Peer === 'undefined' || !navigator.mediaDevices?.getUserMedia || !window.AudioWorkletNode) {
    return showError(t('err.browser'));
  }
  busy = true;
  renderLobby();
  try {
    await getLocalStream();
  } catch {
    busy = false;
    renderLobby();
    return showError(t('err.media'));
  }
  // Created inside the click so the browser lets it play sound.
  audioCtx ??= new AudioContext({ latencyHint: 'interactive' });
  audioCtx.resume();

  const joinCode = roomFromUrl();
  isHost = !joinCode;
  const code = joinCode || newRoomCode();
  keyFailed = false;
  translateOn = true;

  link = openLink({
    code,
    host: isHost,
    stream: localStream,
    handlers: {
      onWaiting() {
        busy = false;
        renderLobby();
        el.inviteLink.value = `${location.origin}${location.pathname}#${code}`;
        el.setup.hidden = true;
        el.invite.hidden = false;
      },
      onOpen: sayHello,
      onStream(stream) {
        remoteStream = stream;
        if (el.remote.srcObject !== stream) el.remote.srcObject = stream;
        if (peer) syncTranslation();
      },
      onMessage,
      onEnded: endCall,
    },
  });
}

function enterCall() {
  busy = false;
  el.lobby.hidden = true;
  el.call.hidden = false;
  el.mic.setAttribute('aria-pressed', String(micTrack()?.enabled ?? false));
  const video = localStream.getVideoTracks()[0];
  el.cam.setAttribute('aria-pressed', String(video?.enabled ?? false));
  el.cam.disabled = !video;
  el.captionsBtn.setAttribute('aria-pressed', String(settings.captions));
  renderLobby();
}

function endCall(reason) {
  const wasInCall = Boolean(peer);
  outgoing.set(false);
  incoming.set(false);
  link?.close();
  link = null;
  peer = null;
  remoteStream = null;
  busy = false;
  el.remote.srcObject = null;
  el.remote.muted = false;
  clearCaption();
  // Re-enable anything muted during the call so the next one starts fresh.
  for (const track of localStream?.getTracks() ?? []) track.enabled = true;
  // A used link is spent: go back to a clean lobby.
  if (isHost || reason !== 'noroom') history.replaceState(null, '', location.pathname);
  el.call.hidden = true;
  el.lobby.hidden = false;
  el.invite.hidden = true;
  el.setup.hidden = false;
  renderLobby();
  if (!reason) return;
  const message = {
    left: t('ended.left'), lost: t('ended.lost'), full: t('ended.full'),
    noroom: t('err.noroom'), taken: t('err.taken'), network: t('err.network'), browser: t('err.browser'),
  }[reason] ?? t('ended.left');
  if (wasInCall || reason === 'full') toast(message); else showError(message);
}

// ── Events ──────────────────────────────────────────────────────────────────
el.setup.addEventListener('submit', (event) => { event.preventDefault(); startOrJoin(); });
el.cancelWait.addEventListener('click', () => endCall());
el.hangup.addEventListener('click', () => endCall());
window.addEventListener('pagehide', () => link?.close());
window.addEventListener('hashchange', () => { if (!link) renderLobby(); });

el.name.addEventListener('input', () => {
  settings.name = el.name.value.trim();
  saveSettings(settings);
  el.selfChip.textContent = settings.name || t('you');
});

el.chips.addEventListener('change', (event) => {
  settings.lang = event.target.value;
  saveSettings(settings);
  renderLobby();
});

el.mic.addEventListener('click', () => {
  const track = micTrack();
  if (!track) return;
  track.enabled = !track.enabled;
  el.mic.setAttribute('aria-pressed', String(track.enabled));
});

el.cam.addEventListener('click', () => {
  const track = localStream?.getVideoTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  el.cam.setAttribute('aria-pressed', String(track.enabled));
});

el.translate.addEventListener('click', () => {
  translateOn = !translateOn;
  link?.send({ t: 'translate', on: translateOn });
  syncTranslation();
});

function setCaptions(on) {
  settings.captions = on;
  saveSettings(settings);
  el.captionsBtn.setAttribute('aria-pressed', String(on));
  el.captionsOn.checked = on;
  if (!on) clearCaption();
}
el.captionsBtn.addEventListener('click', () => setCaptions(!settings.captions));
el.captionsOn.addEventListener('change', () => setCaptions(el.captionsOn.checked));

// Settings
el.apiKey.addEventListener('change', () => {
  const key = el.apiKey.value.trim();
  if (key === settings.apiKey) return;
  settings.apiKey = key;
  saveSettings(settings);
  keyFailed = false;
  renderLobby();
  if (!peer) return;
  // Mid-call: restart translation with the new key and tell the other side.
  outgoing.set(false);
  incoming.set(false);
  sayHello();
  syncTranslation();
});

el.toggleKey.addEventListener('click', () => {
  el.apiKey.type = el.apiKey.type === 'password' ? 'text' : 'password';
  renderLobby();
});

el.forget.addEventListener('click', () => {
  settings = clearSettings();
  settings.lang = guessLanguage().code;
  el.name.value = '';
  el.apiKey.value = '';
  el.captionsOn.checked = settings.captions;
  buildLanguagePicker();
  renderLobby();
  if (peer) { sayHello(); syncTranslation(); }
  toast(t('forgot'));
});

// The key field saves on "change", which also fires when the dialog closes
// with the field still focused, so "Done" and Esc both keep what was typed.
el.settings.addEventListener('close', () => el.apiKey.dispatchEvent(new Event('change')));

// Copy the invite link, with feedback in the bubble next to the button.
let copyTimer = 0;
async function copyInvite(button) {
  const tip = button.nextElementSibling;
  let ok = true;
  try { await navigator.clipboard.writeText(el.inviteLink.value); } catch { ok = false; }
  clearTimeout(copyTimer);
  button.removeAttribute('data-copied');
  button.removeAttribute('data-failed');
  button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
  tip.textContent = t(ok ? 'copied' : 'copyFailed');
  if (!ok) el.inviteLink.select();
  copyTimer = setTimeout(() => {
    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');
    tip.textContent = '';
  }, 2000);
}

if ('CommandEvent' in window) {
  // `command` events don't bubble, so listen in the capture phase.
  document.addEventListener('command', (event) => {
    if (event.command === '--copy') copyInvite(event.source);
  }, true);
} else {
  // Older browsers: do by hand what the command/commandfor attributes declare.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[command]');
    if (!button) return;
    const command = button.getAttribute('command');
    if (command === '--copy') copyInvite(button);
    if (command === 'show-modal') document.getElementById(button.getAttribute('commandfor'))?.showModal();
  });
}

// ── Boot ────────────────────────────────────────────────────────────────────
el.name.value = settings.name;
el.apiKey.value = settings.apiKey;
el.captionsOn.checked = settings.captions;
el.keyLink.href = engine().keyUrl;
buildLanguagePicker();
renderLobby();

// Show the camera preview straight away if permission was already given, so
// returning visitors see themselves without being prompted on page load.
navigator.permissions?.query({ name: 'camera' })
  .then((status) => { if (status.state === 'granted') return getLocalStream(); })
  .catch(() => {});

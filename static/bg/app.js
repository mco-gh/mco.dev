// BG: the page logic. game.js knows the rules, board.js draws, net.js connects;
// this file runs the lobby, the turn-by-turn flow, chat, video and settings.
import * as BG from './game.js';
import { Board } from './board.js';
import { openLink, newCode, cleanCode } from './net.js';

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Colors ───────────────────────────────────────────────────────────────────
const THEMES = {
  Carnival: { chipA: '#ffd23f', chipB: '#ee4266', felt: '#2a1f5c', pointA: '#3bceac', pointB: '#ff8c42', frame: '#6c4cf1' },
  Classic: { chipA: '#f7ecd4', chipB: '#8c1c13', felt: '#1e6f50', pointA: '#e8c887', pointB: '#5a2d0c', frame: '#5b3a1e' },
  Ocean: { chipA: '#f8f9fa', chipB: '#ff6b6b', felt: '#0b3954', pointA: '#4ecdc4', pointB: '#1a659e', frame: '#087e8b' },
  Sunset: { chipA: '#fff1c1', chipB: '#5f0f40', felt: '#fb8b24', pointA: '#e36414', pointB: '#9a031e', frame: '#0f4c5c' },
  Sorbet: { chipA: '#ff5d8f', chipB: '#3a86ff', felt: '#f1faee', pointA: '#a8dadc', pointB: '#ffb703', frame: '#457b9d' },
};
const CSS_VAR = { chipA: '--chip-a', chipB: '--chip-b', felt: '--felt', pointA: '--point-a', pointB: '--point-b', frame: '--frame' };

function loadColors() {
  try {
    const saved = JSON.parse(localStorage.getItem('bg-colors'));
    const ok = saved && Object.keys(CSS_VAR).every((k) => /^#[0-9a-f]{6}$/i.test(saved[k]));
    if (ok) return saved;
  } catch {}
  return { ...THEMES.Carnival };
}

let colors = loadColors();

function applyColors(save = false) {
  for (const [key, name] of Object.entries(CSS_VAR)) document.documentElement.style.setProperty(name, colors[key]);
  for (const input of document.querySelectorAll('[data-color]')) input.value = colors[input.dataset.color];
  for (const button of $('theme-list').children) {
    const theme = THEMES[button.dataset.theme];
    button.setAttribute('aria-pressed', String(Object.keys(CSS_VAR).every((k) => theme[k] === colors[k])));
  }
  if (save) try { localStorage.setItem('bg-colors', JSON.stringify(colors)); } catch {}
}

for (const [name, theme] of Object.entries(THEMES)) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme';
  button.dataset.theme = name;
  for (const [key, cssVar] of Object.entries(CSS_VAR)) button.style.setProperty(cssVar, theme[key]);
  const swatch = document.createElement('span');
  swatch.className = 'theme-swatch';
  swatch.setAttribute('aria-hidden', 'true');
  swatch.append(document.createElement('i'), document.createElement('i'));
  button.append(swatch, name);
  button.addEventListener('click', () => { colors = { ...theme }; applyColors(true); });
  $('theme-list').append(button);
}
for (const input of document.querySelectorAll('[data-color]')) {
  input.addEventListener('input', () => { colors[input.dataset.color] = input.value; applyColors(true); });
}
applyColors();

// ── State ────────────────────────────────────────────────────────────────────
let link = null;          // the connection, or null
let host = false;
let code = '';
let me = 0;               // which side this player is
let game = null;
let selected = null;      // the point (or 'bar') whose checker is picked up
let paths = new Map();    // where the picked-up checker can land
let rolling = false;      // dice are tumbling
let moving = false;       // a multi-dice move is being played out
let peerHere = false;
let celebrated = false;

const board = new Board($('board'), onPick);
const preview = new Board($('preview'));
preview.sync(BG.startingBoard(), { instant: true });
preview.showDice([6, 5]);

// ── Toast ────────────────────────────────────────────────────────────────────
const toastEl = $('toast');
const nativePopover = 'showPopover' in toastEl;
if (!nativePopover) toastEl.removeAttribute('popover');
let toastTimer = 0;
function toast(message) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  if (nativePopover) {
    if (toastEl.matches(':popover-open')) toastEl.hidePopover();
    toastEl.showPopover();                       // re-showing lifts it above any open dialog
  } else {
    toastEl.classList.add('show');
  }
  toastTimer = setTimeout(() => {
    if (nativePopover) toastEl.hidePopover();
    else toastEl.classList.remove('show');
  }, 3800);
}

// ── Lobby ────────────────────────────────────────────────────────────────────
function setLobby(state, error = '') {
  $('setup').hidden = state !== 'idle';
  $('invite').hidden = state !== 'waiting';
  $('joining').hidden = state !== 'joining' && state !== 'opening';
  $('joining').lastChild.textContent = state === 'opening' ? 'Setting up your game…' : 'Joining the game…';
  $('lobby-error').hidden = !error;
  $('lobby-error').textContent = error;
  if (state === 'waiting') $('code-text').textContent = code;
}

function show(screen) {
  $('lobby').hidden = screen !== 'lobby';
  $('game').hidden = screen !== 'game';
}

const inviteLink = () => `${location.origin}${location.pathname}#${code}`;

const PROBLEMS = {
  noroom: 'No game found with that code. Check it and try again.',
  full: 'That game already has two players.',
  network: 'Couldn’t reach the connection service. Check your internet and try again.',
  browser: 'This browser can’t make peer-to-peer connections.',
  lost: 'The connection dropped before the game started.',
  left: 'The other player left.',
};

function connect() {
  if (!game) setLobby(host ? 'opening' : 'joining');
  // Ignore callbacks from a connection we have already replaced or dropped.
  const guard = (fn) => (...args) => { if (link === mine) fn(...args); };
  const mine = openLink({
    code,
    host,
    on: {
      waiting: guard(() => { if (!game) setLobby('waiting'); }),
      open: guard(onPeer),
      message: guard(onMessage),
      peerLeft: guard(onPeerLeft),
      remoteStream: guard(showRemote),
      ended: guard(onEnded),
    },
  });
  link = mine;
  if (localStream) link.setMedia(localStream);
}

function onPeer() {
  peerHere = true;
  if ($('lost').open) $('lost').close();
  if (!host) return;                    // the host's first message tells a guest what to show
  if (game) {
    sendSync();
    toast('Your opponent is back.');
    render();
  } else {
    startGame();
  }
}

function onPeerLeft() {
  peerHere = false;
  toast('Your opponent disconnected.');
  render();
}

function onEnded(reason) {
  link = null;
  peerHere = false;
  if (reason === 'taken' && host && !game) {
    code = newCode();                   // someone else has that code; quietly pick another
    return connect();
  }
  if (!game) return toLobby(PROBLEMS[reason] ?? PROBLEMS.network);
  if (reason === 'left') {
    toast('Your opponent left the game.');
    return toLobby();
  }
  $('lost-text').textContent = host
    ? 'The connection service dropped. Rejoin to keep this game open for your opponent.'
    : reason === 'noroom'
      ? 'Couldn’t find the game. Your opponent may have left.'
      : 'The link to your opponent dropped. The game is still there if they are.';
  render();
  if (!$('lost').open) $('lost').showModal();
}

function toLobby(error = '') {
  link?.close();
  link = null;
  game = null;
  peerHere = false;
  stopMedia();
  showRemote(null);
  $('chat-log').replaceChildren();
  $('chat-empty').hidden = false;
  for (const id of ['lost', 'leave']) if ($(id).open) $(id).close();
  if (location.hash) history.replaceState(null, '', location.pathname);
  show('lobby');
  setLobby('idle', error);
}

$('start-form').addEventListener('submit', (event) => {
  event.preventDefault();
  host = true;
  me = Number(new FormData(event.target).get('side'));
  code = newCode();
  connect();
});

function join(text) {
  const wanted = cleanCode(text);
  if (wanted.length !== 7) return setLobby('idle', 'A game code looks like abc-def.');
  host = false;
  code = wanted;
  history.replaceState(null, '', `#${code}`);
  connect();
}

$('join-form').addEventListener('submit', (event) => {
  event.preventDefault();
  join($('join-code').value);
});

$('cancel-wait').addEventListener('click', () => toLobby());
$('leave-yes').addEventListener('click', () => toLobby());
$('lost-quit').addEventListener('click', () => toLobby());
$('lost-rejoin').addEventListener('click', () => {
  $('lost').close();
  connect();
});
$('lost').addEventListener('cancel', (event) => event.preventDefault());

if (navigator.share) {
  $('share-btn').hidden = false;
  $('share-btn').addEventListener('click', () => {
    navigator.share({ title: 'BG', text: 'Play backgammon with me!', url: inviteLink() }).catch(() => {});
  });
}

// Tell the other player when this tab goes away for good.
addEventListener('pagehide', (event) => { if (!event.persisted) link?.close(); });

// ── The game ─────────────────────────────────────────────────────────────────
const send = (message) => link?.send(message);
const sendSync = () => send({ t: 'sync', hostSide: me, game });

function startGame() {
  game = BG.newGame(BG.openingDice());
  send({ t: 'start', hostSide: me, dice: game.dice });
  begin(true);
}

/** Put a game on screen. A fresh one opens with each player rolling one die. */
async function begin(fresh) {
  const current = game;
  rolling = moving = false;
  selected = null;
  celebrated = false;
  show('game');
  board.setView(me);
  $('chip-me').className = `chip-face ${me ? 'b' : 'a'}`;
  $('chip-them').className = `chip-face ${me ? 'a' : 'b'}`;
  if (!fresh) return render();
  rolling = true;
  render();
  await board.showDice(game.dice, { owner: 'split', tumble: true });
  await sleep(700);
  if (game !== current) return;
  rolling = false;
  render();
}

function shownDice() {
  const double = game.dice.length === 2 && game.dice[0] === game.dice[1];
  const values = double ? Array(4).fill(game.dice[0]) : game.dice;
  const left = game.left.slice();
  const used = values.map((v) => {
    const k = left.indexOf(v);
    if (k < 0) return true;
    left.splice(k, 1);
    return false;
  });
  return { values, used };
}

function render() {
  if (!game) return;
  const myTurn = game.turn === me;
  const busy = rolling || moving;
  const { phase } = game;

  board.sync(game.board);
  $('pips-me').textContent = `${BG.pipCount(game.board, me)} pips`;
  $('pips-them').textContent = `${BG.pipCount(game.board, 1 - me)} pips`;
  $('seat-me').classList.toggle('turn', myTurn && phase !== 'over');
  $('seat-them').classList.toggle('turn', !myTurn && phase !== 'over');

  if (!rolling) {
    const { values, used } = shownDice();
    board.showDice(values, { used, owner: myTurn ? 'me' : 'them' });
  }

  const moves = myTurn && !busy ? BG.currentMoves(game) : [];
  $('roll').hidden = !(myTurn && phase === 'roll');
  $('undo').hidden = !(myTurn && phase === 'move' && !busy && game.history.length);
  $('done').hidden = !(myTurn && phase === 'move' && !busy && !moves.length);

  let status = '';
  if (phase === 'roll') {
    status = myTurn ? 'Your turn. Roll the dice.' : 'Waiting for your opponent to roll…';
  } else if (phase === 'move' && rolling) {
    status = game.opening ? 'Opening roll: highest goes first…' : 'Rolling…';
  } else if (phase === 'move' && !myTurn) {
    status = game.opening ? 'Your opponent won the opening roll.' : 'Your opponent is moving…';
  } else if (phase === 'move' && moves.length) {
    status = game.opening && !game.history.length ? 'You won the opening roll. Your move.' : 'Your move.';
  } else if (phase === 'move' && !moving) {
    status = game.history.length ? 'Happy with that? Choose Done to end your turn.' : 'No legal moves. Choose Done to pass.';
  }
  $('status').textContent = status;

  const linkState = $('link-state');
  linkState.dataset.state = peerHere ? 'on' : 'off';
  $('link-text').textContent = peerHere ? 'Connected' : host ? `Away. They can rejoin with ${code}` : 'Disconnected';

  const movable = [...new Set(moves.map((m) => m.from))];
  if (!movable.includes(selected)) selected = null;
  if (movable.includes('bar')) selected = 'bar';
  else if (movable.length === 1) selected = movable[0];
  paths = selected === null ? new Map() : BG.pathsFrom(game, selected);
  board.setHints({ movable, selected, targets: [...paths.keys()] });

  $('over').hidden = phase !== 'over';
  if (phase === 'over') celebrate();
}

function onPick(where) {
  if (!game || rolling || moving || game.turn !== me || game.phase !== 'move') return;
  if (selected !== null && paths.has(where)) return playPath(paths.get(where));
  const canLift = BG.currentMoves(game).some((m) => m.from === where);
  selected = canLift && where !== selected ? where : null;
  render();
}

async function playPath(steps) {
  const current = game;
  moving = true;
  for (const [k, move] of steps.entries()) {
    if (k) await sleep(380);            // let the checker land before its next hop
    if (game !== current) return;
    BG.play(game, move);
    send({ t: 'move', from: move.from, to: move.to, die: move.die });
    selected = null;
    if (k < steps.length - 1) render();
  }
  moving = false;
  render();
}

async function tumble() {
  const current = game;
  rolling = true;
  render();
  await board.showDice(shownDice().values, { owner: game.turn === me ? 'me' : 'them', tumble: true });
  if (game !== current) return;
  rolling = false;
  render();
}

$('roll').addEventListener('click', () => {
  if (!game || game.turn !== me || game.phase !== 'roll') return;
  const dice = [BG.rollDie(), BG.rollDie()];
  BG.roll(game, dice);
  send({ t: 'roll', dice });
  tumble();
});

$('undo').addEventListener('click', () => {
  if (!game || game.turn !== me || game.phase !== 'move' || moving) return;
  if (!BG.undo(game)) return;
  send({ t: 'undo' });
  selected = null;
  render();
});

$('done').addEventListener('click', () => {
  if (!game || game.turn !== me || game.phase !== 'move' || BG.currentMoves(game).length) return;
  BG.endTurn(game);
  send({ t: 'end' });
  render();
});

$('again').addEventListener('click', () => {
  if (game?.phase !== 'over') return;
  if (host) return peerHere ? startGame() : toast('Your opponent isn’t connected.');
  send({ t: 'again' });
  toast('Asked your opponent’s browser for a new game…');
});

function celebrate() {
  const won = game.winner === me;
  const kind = BG.winKind(game.board, game.winner);
  $('over-title').textContent = won ? 'You win! 🎉' : 'Your opponent wins';
  $('over-sub').textContent = kind === 'single' ? (won ? 'Nicely played.' : 'Good game. Fancy a rematch?')
    : `That’s a ${kind}${won ? '!' : '. Ouch.'}`;
  if (celebrated) return;
  celebrated = true;
  const confetti = $('confetti');
  confetti.replaceChildren();
  if (!won) return;
  const shades = [colors.chipA, colors.chipB, colors.pointA, colors.pointB, '#ffffff'];
  for (let n = 0; n < 48; n++) {
    const bit = document.createElement('i');
    bit.style.setProperty('--left', `${Math.random() * 100}%`);
    bit.style.setProperty('--delay', `${Math.random() * 0.9}s`);
    bit.style.setProperty('--spin', `${(Math.random() - 0.5) * 900}deg`);
    bit.style.background = shades[n % shades.length];
    confetti.append(bit);
  }
}

// ── Messages from the other player ───────────────────────────────────────────
const isDie = (n) => Number.isInteger(n) && n >= 1 && n <= 6;
const isDice = (d) => Array.isArray(d) && d.length === 2 && d.every(isDie);

function onMessage(message) {
  switch (message?.t) {
    case 'start':
      if (host || !isDice(message.dice) || message.dice[0] === message.dice[1]) return;
      me = message.hostSide === 0 ? 1 : 0;
      game = BG.newGame(message.dice);
      return begin(true);
    case 'sync':
      if (host || !message.game?.board) return;
      me = message.hostSide === 0 ? 1 : 0;
      game = message.game;
      return begin(false);
    case 'resync':
      return host && game ? sendSync() : undefined;
    case 'again':
      return host && game?.phase === 'over' ? startGame() : undefined;
    case 'chat':
      return addChat('them', String(message.text ?? '').slice(0, 500));
    case 'roll': case 'move': case 'undo': case 'end':
      return theirTurn(message);
  }
}

/** Apply the other player's action, or put the boards back in step if it doesn't fit. */
function theirTurn(message) {
  const outOfStep = () => (host ? sendSync() : send({ t: 'resync' }));
  if (!game || game.turn === me || game.phase === 'over') return outOfStep();
  if (message.t === 'roll') {
    if (game.phase !== 'roll' || !isDice(message.dice)) return outOfStep();
    BG.roll(game, message.dice);
    return tumble();
  }
  if (game.phase !== 'move') return outOfStep();
  if (message.t === 'move') {
    const move = BG.currentMoves(game).find((m) => m.from === message.from && m.to === message.to && m.die === message.die);
    if (!move) return outOfStep();
    BG.play(game, move);
  } else if (message.t === 'undo') {
    if (!BG.undo(game)) return outOfStep();
  } else {
    if (BG.currentMoves(game).length) return outOfStep();
    BG.endTurn(game);
  }
  render();
}

// ── Chat ─────────────────────────────────────────────────────────────────────
let chatVisible = true;
new IntersectionObserver(([entry]) => { chatVisible = entry.isIntersecting; }).observe($('chat-log'));

function addChat(who, text) {
  if (!text.trim()) return;
  const log = $('chat-log');
  const item = document.createElement('li');
  item.className = who;
  const label = document.createElement('span');
  label.className = 'visually-hidden';
  label.textContent = who === 'me' ? 'You: ' : 'Opponent: ';
  item.append(label, text);
  log.append(item);
  log.scrollTop = log.scrollHeight;
  $('chat-empty').hidden = true;
  if (who === 'them' && !chatVisible) toast(`💬 ${text.length > 80 ? `${text.slice(0, 80)}…` : text}`);
}

$('chat-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('chat-input');
  const text = input.value.trim();
  if (!text) return;
  if (!link?.connected) return toast('Your opponent isn’t connected right now.');
  send({ t: 'chat', text });
  addChat('me', text);
  input.value = '';
});

// ── Camera and microphone ────────────────────────────────────────────────────
const want = { cam: false, mic: false };
let localStream = null;
let mediaJob = Promise.resolve();

async function syncMedia() {
  localStream?.getTracks().forEach((track) => track.stop());
  localStream = null;
  if (want.cam || want.mic) {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: want.cam ? { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } : false,
        audio: want.mic,
      });
    } catch {
      want.cam = want.mic = false;
      toast('Couldn’t use your camera or microphone. Check this site’s permissions.');
    }
  }
  if (!game && localStream) {           // left the game while the browser was asking
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
    want.cam = want.mic = false;
  }
  $('video-me').srcObject = want.cam ? localStream : null;
  $('videos').dataset.me = want.cam ? 'cam' : want.mic ? 'mic' : 'off';
  $('btn-cam').setAttribute('aria-pressed', String(want.cam));
  $('btn-mic').setAttribute('aria-pressed', String(want.mic));
  link?.setMedia(localStream);
}

function stopMedia() {
  want.cam = want.mic = false;
  mediaJob = mediaJob.then(syncMedia);
}

for (const kind of ['cam', 'mic']) {
  $(`btn-${kind}`).addEventListener('click', () => {
    want[kind] = !want[kind];
    mediaJob = mediaJob.then(syncMedia);   // one change at a time, in order
  });
}

function showRemote(stream) {
  const video = $('video-them');
  video.srcObject = stream;
  $('videos').dataset.them = !stream ? 'off' : stream.getVideoTracks().length ? 'cam' : 'mic';
  if (stream) video.play().catch(() => toast('Tap the video to hear your opponent.'));
}
$('video-them').addEventListener('click', (event) => event.target.play().catch(() => {}));

// ── Dialogs ──────────────────────────────────────────────────────────────────
// Closing animates in CSS where the browser can transition out of the top
// layer. Elsewhere, play the exit by hand before really closing.
let displayTransitions;
function canAnimateExit() {
  if (displayTransitions === undefined) {
    displayTransitions = false;
    if (CSS.supports?.('transition-behavior', 'allow-discrete')) {
      const probe = document.createElement('div');
      probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
      document.body.append(probe);
      void getComputedStyle(probe).display;
      probe.style.display = 'none';
      displayTransitions = getComputedStyle(probe).display === 'block';
      probe.remove();
    }
  }
  return displayTransitions && CSS.supports?.('overlay', 'auto');
}

async function closeDialog(dialog) {
  if (!canAnimateExit()) {
    dialog.setAttribute('data-closing', '');
    const running = dialog.getAnimations({ subtree: true });
    if (running.length) {
      await Promise.race([Promise.allSettled(running.map((a) => a.finished)), sleep(2000)]);
    }
    if (!dialog.hasAttribute('data-closing')) return;
    dialog.removeAttribute('data-closing');
  }
  dialog.close();
}

for (const dialog of document.querySelectorAll('dialog')) {
  if (dialog.id === 'lost') continue;            // must be answered, not dismissed
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  for (const button of dialog.querySelectorAll('[data-close]')) {
    button.addEventListener('click', () => closeDialog(dialog));
  }
}

// Click-outside-to-close where `closedby` isn't supported yet.
if (!('closedBy' in HTMLDialogElement.prototype)) {
  const outside = (e, dialog) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => { pressedOutside = outside(e, dialog); });
    dialog.addEventListener('pointerup', (e) => { if (pressedOutside && outside(e, dialog)) closeDialog(dialog); });
  }
}

// ── Copy buttons ─────────────────────────────────────────────────────────────
const copyTimers = new WeakMap();
let lastCopyMessage = '';

async function copy(button, command) {
  const text = command === '--copy-link' ? inviteLink() : code;
  let ok = true;
  try { await navigator.clipboard.writeText(text); } catch { ok = false; }
  const tip = button.nextElementSibling;
  clearTimeout(copyTimers.get(button));
  button.removeAttribute('data-copied');
  button.removeAttribute('data-failed');
  tip.textContent = '';
  void button.offsetWidth;
  button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
  let message = ok ? 'Copied' : 'Copy failed';
  if (message === lastCopyMessage) message += ' ';   // so screen readers repeat it
  lastCopyMessage = message;
  requestAnimationFrame(() => { tip.textContent = message; });
  copyTimers.set(button, setTimeout(() => {
    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');
    tip.textContent = '';
  }, 2000));
}

if ('CommandEvent' in window) {
  // `command` events don't bubble, so listen in the capture phase.
  document.addEventListener('command', (event) => {
    if (event.command.startsWith('--copy')) copy(event.source, event.command);
  }, true);
} else {
  // Older browsers: do by hand what the command/commandfor attributes declare.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[command]');
    if (!button) return;
    const command = button.getAttribute('command');
    if (command.startsWith('--copy')) copy(button, command);
    if (command === 'show-modal') document.getElementById(button.getAttribute('commandfor'))?.showModal();
  });
}

// ── Boot ─────────────────────────────────────────────────────────────────────
setLobby('idle');
// Opening an invite link in a tab that already has BG open only changes the hash.
addEventListener('hashchange', () => {
  if (!game && !link && location.hash.length > 1) join(location.hash);
});
if (location.hash.length > 1) {
  $('join-code').value = cleanCode(location.hash);
  join(location.hash);
}

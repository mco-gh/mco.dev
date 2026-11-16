// Chess: the page logic. chess.js knows the rules, board.js draws, net.js
// connects; this file runs the lobby, the game flow, chat, video and settings.
import * as Chess from './chess.js';
import { Board, pieceEl, pieceSVG } from './board.js';
import { openLink, newCode, cleanCode } from './net.js';

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TITLE = document.title;

// ── Colors ───────────────────────────────────────────────────────────────────
const THEMES = {
  Carnival: { pieceW: '#ffd23f', pieceB: '#ff4f79', light: '#e4dcff', dark: '#7a5cf0', frame: '#2a1f5c', glow: '#3bceac' },
  Classic: { pieceW: '#fffaf0', pieceB: '#3b2a1e', light: '#f0d9b5', dark: '#b58863', frame: '#5b3a1e', glow: '#f6e05e' },
  Ocean: { pieceW: '#ffffff', pieceB: '#ff6b6b', light: '#d7f0f7', dark: '#3a86c8', frame: '#0b3954', glow: '#ffd166' },
  Meadow: { pieceW: '#fdfdf5', pieceB: '#2f2a26', light: '#eeeed2', dark: '#769656', frame: '#33502a', glow: '#ffb703' },
  Candy: { pieceW: '#fffbe6', pieceB: '#5a189a', light: '#ffe3ef', dark: '#ff8fb8', frame: '#b5179e', glow: '#72efdd' },
  Midnight: { pieceW: '#edf2f4', pieceB: '#ef233c', light: '#8d99ae', dark: '#2b2d42', frame: '#14152b', glow: '#ffd60a' },
};
const CSS_VAR = { pieceW: '--piece-w', pieceB: '--piece-b', light: '--sq-light', dark: '--sq-dark', frame: '--frame', glow: '--glow' };

function loadColors() {
  try {
    const saved = JSON.parse(localStorage.getItem('chess-colors'));
    const ok = saved && Object.keys(CSS_VAR).every((k) => /^#[0-9a-f]{6}$/i.test(saved[k]));
    if (ok) return saved;
  } catch {}
  return { ...THEMES.Carnival };
}

/** An outline that shows up against a piece's own color: dark on light, light on dark. */
function outline(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const bright = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.42;
  const mix = (v) => Math.round(bright ? v * 0.32 : v + (255 - v) * 0.72);
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
}

function themeVars(theme, style) {
  for (const [key, name] of Object.entries(CSS_VAR)) style.setProperty(name, theme[key]);
  style.setProperty('--piece-w-line', outline(theme.pieceW));
  style.setProperty('--piece-b-line', outline(theme.pieceB));
}

let colors = loadColors();

function applyColors(save = false) {
  themeVars(colors, document.documentElement.style);
  for (const input of document.querySelectorAll('[data-color]')) input.value = colors[input.dataset.color];
  for (const button of $('theme-list').children) {
    const theme = THEMES[button.dataset.theme];
    button.setAttribute('aria-pressed', String(Object.keys(CSS_VAR).every((k) => theme[k] === colors[k])));
  }
  if (save) try { localStorage.setItem('chess-colors', JSON.stringify(colors)); } catch {}
}

for (const [name, theme] of Object.entries(THEMES)) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme';
  button.dataset.theme = name;
  themeVars(theme, button.style);
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

for (const el of document.querySelectorAll('[data-piece]')) el.innerHTML = pieceSVG(el.dataset.piece.toLowerCase());

// ── State ────────────────────────────────────────────────────────────────────
let link = null;          // the connection, or null
let host = false;
let code = '';
let me = 'w';             // which color this player has
let game = null;
let selected = null;      // the square of the picked-up piece
let targets = new Map();  // where it can go → whether that captures
let wasSelected = false;  // the press landed on the piece already picked up
let drawOffer = null;     // 'sent' | 'received' | null
let cancelPromo = null;   // closes the promotion picker, if it is open
let peerHere = false;
let celebrated = false;
let shownMoves = -1;

const board = new Board($('board'), { press: onPress, release: onRelease });

// The lobby's board plays through an opening, to show how the pieces move.
const sqOf = (name) => 'abcdefgh'.indexOf(name[0]) + (8 - Number(name[1])) * 8;
const DEMO = 'e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 c2c3 g8f6 d2d4 e5d4 c3d4 c5b4 b1c3 f6e4 e1g1 b4c3 b2c3 d7d5'.split(' ');
const preview = new Board($('preview'));
let demo = Chess.newGame();
let demoStep = 0;
preview.sync(demo.pos.board, { instant: true });
const calm = matchMedia('(prefers-reduced-motion: reduce)');
setInterval(() => {
  if ($('lobby').hidden || document.hidden || calm.matches) return;
  if (demoStep < DEMO.length) {
    const step = DEMO[demoStep];
    const move = Chess.findMove(demo, sqOf(step.slice(0, 2)), sqOf(step.slice(2)));
    Chess.play(demo, move);
    preview.sync(demo.pos.board, { move });
    preview.setHints({ last: [move.from, move.to] });
  } else if (demoStep > DEMO.length + 1) {
    demo = Chess.newGame();
    demoStep = -1;
    preview.sync(demo.pos.board);
    preview.setHints();
  }
  demoStep++;
}, 1400);

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
  if (state === 'waiting') {
    $('code-text').textContent = code;
    $('waiting-text').textContent = `You play ${me === 'w' ? 'white' : 'black'}. Waiting for them to join…`;
  }
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
    drawOffer = null;
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
  cancelPromo?.();
  stopMedia();
  showRemote(null);
  $('chat-log').replaceChildren();
  $('chat-empty').hidden = false;
  for (const id of ['lost', 'leave', 'resign-ask']) if ($(id).open) $(id).close();
  if (location.hash) history.replaceState(null, '', location.pathname);
  document.title = TITLE;
  show('lobby');
  setLobby('idle', error);
}

$('start-form').addEventListener('submit', (event) => {
  event.preventDefault();
  host = true;
  const side = new FormData(event.target).get('side');
  me = side === 'r' ? (crypto.getRandomValues(new Uint8Array(1))[0] & 1 ? 'w' : 'b') : side;
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
    navigator.share({ title: 'Chess', text: 'Play chess with me!', url: inviteLink() }).catch(() => {});
  });
}

// Tell the other player when this tab goes away for good.
addEventListener('pagehide', (event) => { if (!event.persisted) link?.close(); });

// ── The game ─────────────────────────────────────────────────────────────────
const send = (message) => link?.send(message);
const sendSync = () => send({ t: 'sync', hostSide: me, moves: game.moves, result: game.result });

function startGame() {
  game = Chess.newGame();
  send({ t: 'start', hostSide: me });
  begin();
}

/** Put a game on screen. */
function begin() {
  cancelPromo?.();
  selected = null;
  drawOffer = null;
  celebrated = false;
  shownMoves = -1;
  $('confetti').replaceChildren();
  show('game');
  board.setView(me);
  board.sync(game.pos.board, { instant: true });
  $('piece-me').replaceChildren(seatPiece(me));
  $('piece-them').replaceChildren(seatPiece(Chess.other(me)));
  render();
}

function seatPiece(color) {
  const el = pieceEl(color === 'w' ? 'K' : 'k');
  el.classList.add('chip');
  return el;
}

const RESULTS = {
  stalemate: 'Stalemate: no legal moves, and no check.',
  repetition: 'The same position came up three times.',
  fifty: 'Fifty moves without a capture or a pawn move.',
  material: 'Neither side has enough pieces left to checkmate.',
  agreed: 'You both agreed to call it even.',
};

function render(how = {}) {
  if (!game) return;
  const { pos, result } = game;
  const myTurn = pos.turn === me;
  const playing = !result;

  board.sync(pos.board, how);

  const movable = new Set(myTurn && playing && !cancelPromo ? game.legal.map((m) => m.from) : []);
  if (!movable.has(selected)) selected = null;
  targets = new Map(game.legal.filter((m) => m.from === selected).map((m) => [m.to, Boolean(m.capture)]));
  board.setHints({
    movable,
    selected,
    targets,
    last: game.last && [game.last.from, game.last.to],
    check: game.check ? Chess.kingSquare(pos.board, pos.turn) : null,
  });

  $('seat-me').classList.toggle('turn', myTurn && playing);
  $('seat-them').classList.toggle('turn', !myTurn && playing);

  const taken = Chess.captures(pos.board);
  const lead = me === 'w' ? taken.lead : -taken.lead;
  showTaken($('taken-me'), taken[me], lead);
  showTaken($('taken-them'), taken[Chess.other(me)], -lead);

  let status = '';
  if (result) status = 'Game over.';
  else if (!game.moves.length) status = myTurn ? 'You play white. Your move.' : 'You play black. White moves first.';
  else if (myTurn) status = game.check ? 'Check! Your move.' : 'Your move.';
  else status = game.check ? 'Check! Waiting for your opponent…' : 'Waiting for your opponent…';
  $('status').textContent = status;
  document.title = myTurn && playing ? `Your move · ${TITLE}` : TITLE;

  $('draw').hidden = $('resign').hidden = !playing;
  $('draw').disabled = drawOffer === 'sent';
  $('draw').textContent = drawOffer === 'sent' ? 'Draw offered' : 'Offer draw';
  $('offer').hidden = !(playing && drawOffer === 'received');

  $('link-state').dataset.state = peerHere ? 'on' : 'off';
  $('link-text').textContent = peerHere ? 'Connected' : host ? `Away. They can rejoin with ${code}` : 'Disconnected';

  showMoves();

  $('over').hidden = playing;
  if (result) {
    if ($('resign-ask').open) $('resign-ask').close();
    celebrate();
  }
}

function showTaken(el, pieces, lead) {
  el.replaceChildren(...pieces.map((piece) => pieceEl(piece)));
  if (lead > 0) el.append(Object.assign(document.createElement('span'), { className: 'lead', textContent: `+${lead}` }));
  const names = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen' };
  el.setAttribute('aria-label', pieces.length ? `Captured: ${pieces.map((p) => names[p.toLowerCase()]).join(', ')}` : 'Nothing captured');
  el.setAttribute('role', 'img');
}

function showMoves() {
  if (shownMoves === game.san.length) return;
  shownMoves = game.san.length;
  const list = $('moves');
  const rows = [];
  for (let n = 0; n < game.san.length; n += 2) {
    const row = document.createElement('li');
    const cell = (text, className = '') => Object.assign(document.createElement('span'), { textContent: text, className });
    row.append(cell(`${n / 2 + 1}.`, 'no'), cell(game.san[n]), cell(game.san[n + 1] ?? ''));
    rows.push(row);
  }
  list.replaceChildren(...rows);
  list.scrollTop = list.scrollHeight;
  list.hidden = !rows.length;
  $('moves-empty').hidden = rows.length > 0;
}

// ── Moving ───────────────────────────────────────────────────────────────────
const canPlay = () => game && !game.result && game.pos.turn === me && !cancelPromo;

/** A square was pressed. Returns true if its piece is now picked up (and may be dragged). */
function onPress(sq) {
  if (!canPlay()) return false;
  if (selected !== null && targets.has(sq)) {
    tryMove(selected, sq);
    return false;
  }
  if (game.legal.some((m) => m.from === sq)) {
    wasSelected = selected === sq;
    selected = sq;
    render();
    return true;
  }
  selected = null;
  render();
  return false;
}

/** The press ended on `sq`. Returns true if a dragged piece was played there. */
function onRelease(sq, dragged) {
  if (!canPlay() || selected === null) return false;
  if (dragged) return sq !== null && targets.has(sq) && tryMove(selected, sq);
  if (wasSelected) {                    // a second tap puts the piece back down
    selected = null;
    render();
  }
  return false;
}

/** Play from → to. Returns true if it was played straight away (a promotion asks first). */
function tryMove(from, to) {
  const options = game.legal.filter((m) => m.from === from && m.to === to);
  if (!options.length) return false;
  if (options.length === 1) {
    commit(options[0]);
    return true;
  }
  const current = game;
  askPromotion().then((type) => {
    if (game !== current || game.result) return;
    const move = type && options.find((m) => m.promo === type);
    if (move) commit(move);
    else render();
  });
  return false;
}

function commit(move) {
  Chess.play(game, move);
  send({ t: 'move', from: move.from, to: move.to, promo: move.promo ?? null, n: game.moves.length });
  selected = null;
  drawOffer = null;                     // moving on turns down an offer, and withdraws your own
  render({ move });       // board.js settles a dragged piece without a glide
}

function askPromotion() {
  return new Promise((resolve) => {
    const done = (type) => {
      cancelPromo = null;
      $('promo').hidden = true;
      resolve(type);
    };
    cancelPromo = () => done(null);
    $('promo-row').replaceChildren(...[...'qrbn'].map((type) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' }[type]);
      button.append(pieceEl(me === 'w' ? type.toUpperCase() : type));
      button.addEventListener('click', () => done(type));
      return button;
    }));
    $('promo').hidden = false;
    render();
    $('promo-row').firstChild.focus();
  });
}
$('promo-cancel').addEventListener('click', () => cancelPromo?.());
$('promo').addEventListener('keydown', (event) => { if (event.key === 'Escape') cancelPromo?.(); });

// ── Draws, resigning, rematches ──────────────────────────────────────────────
$('draw').addEventListener('click', () => {
  if (!game || game.result || drawOffer) return;
  if (!link?.connected) return toast('Your opponent isn’t connected right now.');
  drawOffer = 'sent';
  send({ t: 'draw-offer' });
  toast('Draw offered.');
  render();
});

$('draw-yes').addEventListener('click', () => {
  if (!game || game.result || drawOffer !== 'received') return;
  send({ t: 'draw-accept' });
  Chess.finish(game, { kind: 'agreed', winner: null });
  render();
});

$('draw-no').addEventListener('click', () => {
  if (drawOffer !== 'received') return;
  drawOffer = null;
  send({ t: 'draw-decline' });
  render();
});

$('resign-yes').addEventListener('click', () => {
  $('resign-ask').close();
  if (!game || game.result) return;
  send({ t: 'resign' });
  Chess.finish(game, { kind: 'resign', winner: Chess.other(me) });
  render();
});

/** Host only: a new game with the colors swapped. */
function rematch() {
  me = Chess.other(me);
  startGame();
}

$('again').addEventListener('click', () => {
  if (!game?.result) return;
  if (host) return peerHere ? rematch() : toast('Your opponent isn’t connected.');
  send({ t: 'again' });
  toast('Asked your opponent’s browser for a new game…');
});

function celebrate() {
  const { kind, winner } = game.result;
  const won = winner === me;
  if (kind === 'checkmate') {
    $('over-title').textContent = won ? 'Checkmate! You win 🎉' : 'Checkmate';
    $('over-sub').textContent = won ? 'Nicely played.' : 'Your opponent wins. Fancy a rematch?';
  } else if (kind === 'resign') {
    $('over-title').textContent = won ? 'You win! 🎉' : 'You resigned';
    $('over-sub').textContent = won ? 'Your opponent resigned.' : 'Your opponent wins. Fancy a rematch?';
  } else {
    $('over-title').textContent = 'It’s a draw 🤝';
    $('over-sub').textContent = RESULTS[kind];
  }
  if (celebrated) return;
  celebrated = true;
  const confetti = $('confetti');
  confetti.replaceChildren();
  if (!won) return;
  const shades = [colors.pieceW, colors.pieceB, colors.light, colors.glow, '#ffffff'];
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
function onMessage(message) {
  switch (message?.t) {
    case 'start':
      if (host || !['w', 'b'].includes(message.hostSide)) return;
      me = Chess.other(message.hostSide);
      game = Chess.newGame();
      return begin();
    case 'sync': {
      if (host || !['w', 'b'].includes(message.hostSide)) return;
      const rebuilt = Chess.replay(message.moves, message.result);
      if (!rebuilt) return;
      me = Chess.other(message.hostSide);
      game = rebuilt;
      return begin();
    }
    case 'resync':
      return host && game ? sendSync() : undefined;
    case 'again':
      return host && game?.result ? rematch() : undefined;
    case 'chat':
      return addChat('them', String(message.text ?? '').slice(0, 500));
    case 'move':
      return theirMove(message);
    case 'resign':
      if (!game || game.result) return;
      Chess.finish(game, { kind: 'resign', winner: me });
      return render();
    case 'draw-offer':
      if (!game || game.result) return;
      drawOffer = 'received';
      toast('Your opponent offers a draw.');
      return render();
    case 'draw-accept':
      if (!game || game.result || drawOffer !== 'sent') return;
      Chess.finish(game, { kind: 'agreed', winner: null });
      return render();
    case 'draw-decline':
      if (drawOffer !== 'sent') return;
      drawOffer = null;
      toast('Your opponent declined the draw.');
      return render();
  }
}

/** Play the other player's move, or put the boards back in step if it doesn't fit. */
function theirMove(message) {
  const outOfStep = () => (host ? sendSync() : send({ t: 'resync' }));
  if (!game || game.result || game.pos.turn === me || message.n !== game.moves.length + 1) return outOfStep();
  const move = Chess.findMove(game, message.from, message.to, message.promo);
  if (!move) return outOfStep();
  Chess.play(game, move);
  drawOffer = null;
  render({ move });
}

// ── Chat ─────────────────────────────────────────────────────────────────────
let chatVisible = true;
new IntersectionObserver(([entry]) => { chatVisible = entry.isIntersecting; }).observe($('chat-form'));

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
  if (message === lastCopyMessage) message += ' ';   // so screen readers repeat it
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
// Opening an invite link in a tab that already has Chess open only changes the hash.
addEventListener('hashchange', () => {
  if (!game && !link && location.hash.length > 1) join(location.hash);
});
if (location.hash.length > 1) {
  $('join-code').value = cleanCode(location.hash);
  join(location.hash);
}

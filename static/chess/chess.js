// The rules of chess, and nothing else: no drawing, no networking.
//
// A square is a number 0–63 counted from a8 (0) along each rank to h1 (63).
// A piece is a letter: uppercase for white (PNBRQK), lowercase for black.
// A position is { board, turn, castle, ep, half }; positions are never changed
// in place, so a game can keep them around safely.
const FILES = 'abcdefgh';
const KNIGHT = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const DIAG = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const ORTH = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const ALL = [...DIAG, ...ORTH];
const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9 };
const START_COUNT = { p: 8, n: 2, b: 2, r: 2, q: 1 };

export const squareName = (sq) => FILES[sq & 7] + (8 - (sq >> 3));
export const colorOf = (piece) => (piece === piece.toUpperCase() ? 'w' : 'b');
export const other = (color) => (color === 'w' ? 'b' : 'w');
const onBoard = (r, f) => r >= 0 && r < 8 && f >= 0 && f < 8;

export function startPosition() {
  const rows = 'rnbqkbnr' + 'pppppppp' + '.'.repeat(32) + 'PPPPPPPP' + 'RNBQKBNR';
  return { board: [...rows].map((c) => (c === '.' ? null : c)), turn: 'w', castle: 'KQkq', ep: -1, half: 0 };
}

export const kingSquare = (board, color) => board.indexOf(color === 'w' ? 'K' : 'k');

/** Is this square attacked by any piece of color `by`? */
export function attacked(board, sq, by) {
  const r = sq >> 3;
  const f = sq & 7;
  const at = (rr, ff) => (onBoard(rr, ff) ? board[rr * 8 + ff] : undefined);
  const is = (piece, type) => piece === (by === 'w' ? type.toUpperCase() : type);
  const pawnRow = by === 'w' ? r + 1 : r - 1;      // pawns capture towards the other side
  if (is(at(pawnRow, f - 1), 'p') || is(at(pawnRow, f + 1), 'p')) return true;
  for (const [dr, df] of KNIGHT) if (is(at(r + dr, f + df), 'n')) return true;
  for (const [dr, df] of ALL) if (is(at(r + dr, f + df), 'k')) return true;
  for (const [dirs, type] of [[DIAG, 'b'], [ORTH, 'r']]) {
    for (const [dr, df] of dirs) {
      for (let rr = r + dr, ff = f + df; ; rr += dr, ff += df) {
        const piece = at(rr, ff);
        if (piece === undefined) break;
        if (piece === null) continue;
        if (is(piece, type) || is(piece, 'q')) return true;
        break;
      }
    }
  }
  return false;
}

/** Every move the pieces can make, ignoring whether it leaves the king in check. */
function candidateMoves(pos) {
  const { board, turn } = pos;
  const moves = [];
  const mine = (piece) => piece && colorOf(piece) === turn;
  const add = (from, to, extra) => moves.push({ from, to, piece: board[from], capture: board[to], ...extra });

  for (let from = 0; from < 64; from++) {
    const piece = board[from];
    if (!mine(piece)) continue;
    const r = from >> 3;
    const f = from & 7;
    const type = piece.toLowerCase();

    if (type === 'p') {
      const d = turn === 'w' ? -1 : 1;
      const home = turn === 'w' ? 6 : 1;
      const last = turn === 'w' ? 0 : 7;
      const advance = (to) => {
        if (to >> 3 === last) for (const promo of 'qrbn') add(from, to, { promo });
        else add(from, to);
      };
      const one = from + d * 8;
      if (onBoard(r + d, f) && !board[one]) {
        advance(one);
        if (r === home && !board[one + d * 8]) add(from, one + d * 8, { double: true });
      }
      for (const df of [-1, 1]) {
        if (!onBoard(r + d, f + df)) continue;
        const to = one + df;
        if (board[to] && !mine(board[to])) advance(to);
        else if (to === pos.ep) add(from, to, { ep: true, capture: turn === 'w' ? 'p' : 'P' });
      }
      continue;
    }

    if (type === 'n' || type === 'k') {
      for (const [dr, df] of type === 'n' ? KNIGHT : ALL) {
        const to = (r + dr) * 8 + f + df;
        if (onBoard(r + dr, f + df) && !mine(board[to])) add(from, to);
      }
    } else {
      for (const [dr, df] of type === 'b' ? DIAG : type === 'r' ? ORTH : ALL) {
        for (let rr = r + dr, ff = f + df; onBoard(rr, ff); rr += dr, ff += df) {
          const to = rr * 8 + ff;
          if (mine(board[to])) break;
          add(from, to);
          if (board[to]) break;
        }
      }
    }

    // Castling: king and rook unmoved, nothing between them, and the king
    // neither in check nor passing through or landing on an attacked square.
    const base = turn === 'w' ? 56 : 0;
    if (type === 'k' && from === base + 4) {
      const them = other(turn);
      const rook = turn === 'w' ? 'R' : 'r';
      const safe = (...squares) => squares.every((sq) => !attacked(board, sq, them));
      const empty = (...squares) => squares.every((sq) => !board[sq]);
      if (pos.castle.includes(turn === 'w' ? 'K' : 'k') && board[base + 7] === rook
        && empty(base + 5, base + 6) && safe(base + 4, base + 5, base + 6)) add(from, base + 6, { castle: 'K' });
      if (pos.castle.includes(turn === 'w' ? 'Q' : 'q') && board[base] === rook
        && empty(base + 1, base + 2, base + 3) && safe(base + 4, base + 3, base + 2)) add(from, base + 2, { castle: 'Q' });
    }
  }
  return moves;
}

/** The position after a move. */
export function apply(pos, move) {
  const board = pos.board.slice();
  const { turn } = pos;
  board[move.from] = null;
  board[move.to] = move.promo ? (turn === 'w' ? move.promo.toUpperCase() : move.promo) : move.piece;
  if (move.ep) board[move.to + (turn === 'w' ? 8 : -8)] = null;
  if (move.castle) {
    const base = move.from - 4;
    const [rookFrom, rookTo] = move.castle === 'K' ? [base + 7, base + 5] : [base, base + 3];
    board[rookTo] = board[rookFrom];
    board[rookFrom] = null;
  }
  // A king or rook leaving home, or a rook captured at home, ends that castling right.
  const LOSES = { 60: 'KQ', 63: 'K', 56: 'Q', 4: 'kq', 7: 'k', 0: 'q' };
  const gone = (LOSES[move.from] ?? '') + (LOSES[move.to] ?? '');
  return {
    board,
    turn: other(turn),
    castle: [...pos.castle].filter((c) => !gone.includes(c)).join(''),
    ep: move.double ? (move.from + move.to) / 2 : -1,
    half: move.capture || move.piece.toLowerCase() === 'p' ? 0 : pos.half + 1,
  };
}

export function legalMoves(pos) {
  return candidateMoves(pos).filter((move) => {
    const next = apply(pos, move);
    return !attacked(next.board, kingSquare(next.board, pos.turn), next.turn);
  });
}

export const inCheck = (pos) => attacked(pos.board, kingSquare(pos.board, pos.turn), other(pos.turn));

// ── A game ───────────────────────────────────────────────────────────────────
// result: null while playing, else { kind, winner } where kind is 'checkmate',
// 'stalemate', 'repetition', 'fifty', 'material', 'resign' or 'agreed', and
// winner is 'w', 'b' or null for a draw.

export function newGame() {
  const game = { pos: startPosition(), moves: [], san: [], seen: new Map(), last: null, result: null, legal: [], check: false };
  look(game);
  return game;
}

/** Work out what the side to move can do, and note the position for repetition. */
function look(game) {
  const { pos } = game;
  game.legal = legalMoves(pos);
  game.check = inCheck(pos);
  // Two positions only repeat if the same en passant capture is really on offer.
  const ep = game.legal.some((m) => m.ep) ? pos.ep : '-';
  const key = `${pos.board.map((p) => p ?? '.').join('')} ${pos.turn} ${pos.castle} ${ep}`;
  const times = (game.seen.get(key) ?? 0) + 1;
  game.seen.set(key, times);
  return times;
}

/** Neither side has enough left to ever give checkmate. */
function deadPosition(board) {
  const rest = [];
  board.forEach((piece, sq) => { if (piece && piece.toLowerCase() !== 'k') rest.push([piece.toLowerCase(), ((sq >> 3) + sq) & 1]); });
  if (!rest.length) return true;
  if (rest.length === 1) return rest[0][0] === 'b' || rest[0][0] === 'n';
  return rest.every(([type, shade]) => type === 'b' && shade === rest[0][1]);
}

/** The legal move matching what a player asked for, if there is one. */
export function findMove(game, from, to, promo = null) {
  return game.legal.find((m) => m.from === from && m.to === to && (m.promo ?? null) === (promo ?? null));
}

function notation(game, move) {
  if (move.castle) return move.castle === 'K' ? 'O-O' : 'O-O-O';
  const type = move.piece.toLowerCase();
  const dest = squareName(move.to);
  if (type === 'p') {
    return (move.capture ? `${FILES[move.from & 7]}x` : '') + dest + (move.promo ? `=${move.promo.toUpperCase()}` : '');
  }
  // Say which piece, when two of a kind could reach the same square.
  const rivals = game.legal.filter((m) => m.piece === move.piece && m.to === move.to && m.from !== move.from);
  let which = '';
  if (rivals.length) {
    if (!rivals.some((m) => (m.from & 7) === (move.from & 7))) which = FILES[move.from & 7];
    else if (!rivals.some((m) => m.from >> 3 === move.from >> 3)) which = String(8 - (move.from >> 3));
    else which = squareName(move.from);
  }
  return type.toUpperCase() + which + (move.capture ? 'x' : '') + dest;
}

/** Play one of game.legal. */
export function play(game, move) {
  if (game.result) return false;
  const mover = game.pos.turn;
  let san = notation(game, move);
  game.pos = apply(game.pos, move);
  game.moves.push({ from: move.from, to: move.to, promo: move.promo ?? null });
  game.last = move;
  const times = look(game);
  if (!game.legal.length) game.result = game.check ? { kind: 'checkmate', winner: mover } : { kind: 'stalemate', winner: null };
  else if (deadPosition(game.pos.board)) game.result = { kind: 'material', winner: null };
  else if (times >= 3) game.result = { kind: 'repetition', winner: null };
  else if (game.pos.half >= 100) game.result = { kind: 'fifty', winner: null };
  if (game.check) san += game.result?.kind === 'checkmate' ? '#' : '+';
  game.san.push(san);
  return true;
}

/** End the game off the board: a resignation or an agreed draw. */
export function finish(game, result) {
  if (!game.result) game.result = result;
}

/** Rebuild a game from its list of moves; null if any of them isn't legal. */
export function replay(moves, result = null) {
  const game = newGame();
  if (!Array.isArray(moves) || moves.length > 2000) return null;
  for (const m of moves) {
    const move = m && findMove(game, m.from, m.to, m.promo);
    if (!move || !play(game, move)) return null;
  }
  const ok = result && ['resign', 'agreed'].includes(result.kind) && ['w', 'b', null].includes(result.winner);
  if (ok) finish(game, { kind: result.kind, winner: result.winner });
  return game;
}

/**
 * What each side has taken, and who is ahead.
 * { w: pieces white captured, b: pieces black captured, lead: points white is ahead }
 */
export function captures(board) {
  const count = {};
  let lead = 0;
  for (const piece of board) {
    if (!piece || piece.toLowerCase() === 'k') continue;
    count[piece] = (count[piece] ?? 0) + 1;
    lead += VALUE[piece.toLowerCase()] * (colorOf(piece) === 'w' ? 1 : -1);
  }
  const lost = (color) => [...'qrbnp'].flatMap((type) => {
    const piece = color === 'w' ? type.toUpperCase() : type;
    return Array(Math.max(0, START_COUNT[type] - (count[piece] ?? 0))).fill(piece);
  });
  return { w: lost('b'), b: lost('w'), lead };
}

// Backgammon rules, with no UI and no networking. Both players run this same
// code on the same messages, so their boards stay identical.
//
// The board is 24 points, indexed 0–23. Side 0's checkers are positive counts
// and travel from index 23 down to 0; side 1's are negative and travel the
// other way. A move's `from` is a point index or 'bar'; `to` is an index or 'off'.

const sign = (side) => (side === 0 ? 1 : -1);

/** A point index as that side counts it: 1 (deepest in home) … 24. */
export const posOf = (side, index) => (side === 0 ? index + 1 : 24 - index);
export const indexOf = (side, pos) => (side === 0 ? pos - 1 : 24 - pos);
export const countAt = (board, side, index) => Math.max(0, board.pts[index] * sign(side));

export function startingBoard() {
  const pts = Array(24).fill(0);
  for (const [pos, n] of [[24, 2], [13, 5], [8, 3], [6, 5]]) {
    pts[indexOf(0, pos)] = n;
    pts[indexOf(1, pos)] = -n;
  }
  return { pts, bar: [0, 0], off: [0, 0] };
}

function allHome(board, side) {
  if (board.bar[side]) return false;
  for (let pos = 7; pos <= 24; pos++) if (countAt(board, side, indexOf(side, pos))) return false;
  return true;
}

function anyBehind(board, side, pos) {
  for (let p = pos + 1; p <= 6; p++) if (countAt(board, side, indexOf(side, p))) return true;
  return false;
}

/** Every move one die allows, ignoring the "use as many dice as you can" rule. */
function movesForDie(board, side, die) {
  const out = [];
  const home = allHome(board, side);
  const consider = (from, pos) => {
    const dest = pos - die;
    if (dest >= 1) {
      const to = indexOf(side, dest);
      const blockers = countAt(board, 1 - side, to);
      if (blockers <= 1) out.push({ from, to, die, hit: blockers === 1 });
    } else if (home && (dest === 0 || !anyBehind(board, side, pos))) {
      out.push({ from, to: 'off', die, hit: false });
    }
  };
  if (board.bar[side]) {
    consider('bar', 25);
    return out;
  }
  for (let pos = 24; pos >= 1; pos--) {
    const index = indexOf(side, pos);
    if (countAt(board, side, index)) consider(index, pos);
  }
  return out;
}

export function applyMove(board, side, move) {
  const next = { pts: board.pts.slice(), bar: board.bar.slice(), off: board.off.slice() };
  if (move.from === 'bar') next.bar[side]--;
  else next.pts[move.from] -= sign(side);
  if (move.to === 'off') {
    next.off[side]++;
  } else {
    if (move.hit) {
      next.pts[move.to] = 0;
      next.bar[1 - side]++;
    }
    next.pts[move.to] += sign(side);
  }
  return next;
}

const without = (dice, k) => dice.filter((_, i) => i !== k);

/** The most dice that can be played from here. */
function mostPlayable(board, side, dice) {
  let most = 0;
  const tried = new Set();
  for (let k = 0; k < dice.length; k++) {
    if (tried.has(dice[k])) continue;
    tried.add(dice[k]);
    const rest = without(dice, k);
    for (const move of movesForDie(board, side, dice[k])) {
      most = Math.max(most, 1 + mostPlayable(applyMove(board, side, move), side, rest));
      if (most === dice.length) return most;
    }
  }
  return most;
}

/**
 * The moves allowed next. A player must play as many dice as possible, and
 * when only one of two different dice can be played it must be the larger.
 */
export function legalMoves(board, side, dice) {
  const target = mostPlayable(board, side, dice);
  if (!target) return [];
  let out = [];
  const tried = new Set();
  for (let k = 0; k < dice.length; k++) {
    if (tried.has(dice[k])) continue;
    tried.add(dice[k]);
    const rest = without(dice, k);
    for (const move of movesForDie(board, side, dice[k])) {
      if (1 + mostPlayable(applyMove(board, side, move), side, rest) === target) out.push(move);
    }
  }
  if (target === 1 && dice.length === 2 && dice[0] !== dice[1]) {
    const larger = out.filter((m) => m.die === Math.max(...dice));
    if (larger.length) out = larger;
  }
  return out;
}

export function pipCount(board, side) {
  let total = board.bar[side] * 25;
  for (let i = 0; i < 24; i++) total += countAt(board, side, i) * posOf(side, i);
  return total;
}

/** 'single', 'gammon' (loser bore nothing off) or 'backgammon'. */
export function winKind(board, winner) {
  const loser = 1 - winner;
  if (board.off[loser]) return 'single';
  let deep = board.bar[loser] > 0;
  for (let pos = 19; pos <= 24; pos++) if (countAt(board, loser, indexOf(loser, pos))) deep = true;
  return deep ? 'backgammon' : 'gammon';
}

// ── A game in progress ───────────────────────────────────────────────────────
// phase: 'roll' (the player to move must roll), 'move', or 'over'.

/** The opening roll: side 0 threw dice[0], side 1 threw dice[1]; higher starts with both. */
export function newGame(dice) {
  return {
    board: startingBoard(),
    turn: dice[0] > dice[1] ? 0 : 1,
    phase: 'move',
    dice: dice.slice(),
    left: dice.slice(),
    history: [],
    opening: true,
    winner: null,
  };
}

export function roll(game, dice) {
  game.dice = dice.slice();
  game.left = dice[0] === dice[1] ? Array(4).fill(dice[0]) : dice.slice();
  game.history = [];
  game.opening = false;
  game.phase = 'move';
}

export function currentMoves(game) {
  return game.phase === 'move' ? legalMoves(game.board, game.turn, game.left) : [];
}

export function play(game, move) {
  game.history.push({ board: game.board, die: move.die });
  game.board = applyMove(game.board, game.turn, move);
  game.left.splice(game.left.indexOf(move.die), 1);
  if (game.board.off[game.turn] === 15) {
    game.phase = 'over';
    game.winner = game.turn;
  }
}

export function undo(game) {
  const last = game.history.pop();
  if (!last) return false;
  game.board = last.board;
  game.left.push(last.die);
  return true;
}

export function endTurn(game) {
  game.turn = 1 - game.turn;
  game.phase = 'roll';
  game.dice = [];
  game.left = [];
  game.history = [];
  game.opening = false;
}

/**
 * Where the checker on `from` can go this turn, including by chaining dice.
 * Returns a Map of destination → the list of single-die moves that gets there.
 */
export function pathsFrom(game, from) {
  const found = new Map();
  const walk = (board, left, at, path) => {
    for (const move of legalMoves(board, game.turn, left)) {
      if (move.from !== at) continue;
      const steps = [...path, move];
      const known = found.get(move.to);
      // Prefer fewer dice, then the smaller die, which keeps the big one free.
      if (!known || steps.length < known.length || (steps.length === 1 && known.length === 1 && move.die < known[0].die)) {
        found.set(move.to, steps);
      }
      if (move.to !== 'off') {
        walk(applyMove(board, game.turn, move), without(left, left.indexOf(move.die)), move.to, steps);
      }
    }
  };
  if (game.phase === 'move') walk(game.board, game.left, from, []);
  return found;
}

export function rollDie() {
  const buf = new Uint8Array(1);
  do crypto.getRandomValues(buf); while (buf[0] >= 252);   // 252 = 6 × 42, so no bias
  return (buf[0] % 6) + 1;
}

export function openingDice() {
  let a, b;
  do { a = rollDie(); b = rollDie(); } while (a === b);
  return [a, b];
}

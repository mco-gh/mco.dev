// Draws a backgammon board and animates it. Everything is laid out on a
// 1500 × 1000 grid and scaled with container units in CSS, so the board is
// sharp at any size. Checkers and dice are long-lived elements that are only
// ever given new coordinates, which is what lets CSS glide them into place.
import { countAt, posOf } from './game.js';

const CHECKER = 84;
const TOP = 30;
const BOTTOM = 970;
const HALF_X = { left: 30, right: 720 };
const BAR_X = 675;
const TRAY_X = 1350;
const DIE = 76;
const TUMBLE_MS = 750;

const el = (tag, className, parent) => {
  const node = document.createElement(tag);
  node.className = className;
  parent?.append(node);
  return node;
};
const place = (node, box) => {
  for (const [key, value] of Object.entries(box)) node.style.setProperty(`--${key}`, value);
};
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export class Board {
  /** onPick(where) is called with a point index, 'bar' or 'off'. Leave it out for a display-only board. */
  constructor(root, onPick) {
    this.root = root;
    this.me = 0;
    this.board = null;
    this.checkers = [];
    this.arrivals = 0;
    this.diceTimer = 0;
    root.classList.add('board');
    root.replaceChildren();

    for (const [x, w] of [[HALF_X.left, 600], [HALF_X.right, 600]]) {
      place(el('div', 'felt', root), { x, y: TOP, w, h: BOTTOM - TOP });
    }
    place(el('div', 'felt well', root), { x: TRAY_X, y: TOP, w: 120, h: 440 });
    place(el('div', 'felt well', root), { x: TRAY_X, y: BOTTOM - 440, w: 120, h: 440 });

    this.spots = el('div', 'spots', root);
    const button = (className, where) => {
      const b = el('button', className);
      b.type = 'button';
      if (onPick) b.addEventListener('click', () => onPick(where));
      return b;
    };
    this.points = Array.from({ length: 24 }, (_, i) => button('spot point', i));
    this.barSpot = button('spot bar-spot', 'bar');
    this.offSpot = button('spot off-spot', 'off');
    place(this.barSpot, { x: BAR_X - 45, y: TOP, w: 90, h: 460 });
    place(this.offSpot, { x: TRAY_X, y: BOTTOM - 440, w: 120, h: 440 });

    this.ghosts = el('div', 'ghosts', root);
    this.ghosts.setAttribute('aria-hidden', 'true');
    this.pieces = el('div', 'pieces', root);
    this.pieces.setAttribute('aria-hidden', 'true');
    this.diceBox = el('div', 'dice', root);
    this.diceBox.setAttribute('role', 'img');
    this.dice = Array.from({ length: 4 }, () => {
      const die = el('div', 'die', this.diceBox);
      die.hidden = true;
      for (let i = 0; i < 9; i++) el('i', '', die);
      return die;
    });
    if (!onPick) root.inert = true;
    this.setView(0);
  }

  /** Turn the board so that side's home is at the bottom right. */
  setView(me) {
    this.me = me;
    const order = [this.barSpot];
    for (let pos = 24; pos >= 1; pos--) {
      const index = me === 0 ? pos - 1 : 24 - pos;
      const point = this.points[index];
      const top = pos >= 13;
      point.classList.toggle('top', top);
      point.classList.toggle('bottom', !top);
      point.classList.toggle('alt', pos % 2 === 0);
      place(point, { x: this.#column(pos), y: top ? TOP : BOTTOM - 450, w: 100, h: 450 });
      order.push(point);
    }
    order.push(this.offSpot);
    this.spots.replaceChildren(...order);
  }

  #column(pos) {
    const half = pos >= 19 || pos <= 6 ? HALF_X.right : HALF_X.left;
    return half + (pos >= 13 ? (pos - 13) % 6 : (12 - pos) % 6) * 100;
  }

  /** Where the j-th of n checkers sits on a point, the bar or the tray. */
  #slot(where, side, j, n) {
    const mine = side === this.me;
    if (where === 'off') {
      return { x: TRAY_X + 10, y: mine ? BOTTOM - 34 - j * 27 : TOP + 10 + j * 27 };
    }
    if (where === 'bar') {
      const step = Math.min(70, 330 / Math.max(1, n - 1));
      return { x: BAR_X - CHECKER / 2, y: mine ? 396 - j * step : 520 + j * step };
    }
    const pos = posOf(this.me, where);
    const step = n <= 5 ? CHECKER : (5 * CHECKER - CHECKER) / (n - 1);
    return {
      x: this.#column(pos) + (100 - CHECKER) / 2,
      y: pos >= 13 ? TOP + j * step : BOTTOM - CHECKER - j * step,
    };
  }

  /**
   * Show a position. Checkers that are no longer where they should be slide to
   * where one is missing, so a move, a hit, bearing off and an undo all animate
   * without being told what happened.
   */
  sync(board, { instant = false } = {}) {
    this.board = board;
    if (!this.checkers.length) {
      for (const side of [0, 1]) {
        for (let n = 0; n < 15; n++) {
          this.checkers.push({ node: el('div', `chk ${side ? 'b' : 'a'}`, this.pieces), side, where: 'off', order: 0 });
        }
      }
      instant = true;
    }
    const moved = new Set();
    const stacks = new Map();
    const stack = (side, where) => {
      const key = `${side}:${where}`;
      if (!stacks.has(key)) stacks.set(key, { side, where, list: [] });
      return stacks.get(key).list;
    };
    for (const c of this.checkers) stack(c.side, c.where).push(c);
    for (const { list } of stacks.values()) list.sort((a, b) => a.order - b.order);

    for (const side of [0, 1]) {
      const want = new Map([['bar', board.bar[side]], ['off', board.off[side]]]);
      for (let i = 0; i < 24; i++) want.set(i, countAt(board, side, i));
      const spare = [];
      for (const [where, n] of want) {
        const list = stack(side, where);
        while (list.length > n) spare.push(list.pop());    // the top checker leaves first
      }
      for (const [where, n] of want) {
        const list = stack(side, where);
        while (list.length < n) {
          const c = spare.pop();
          c.where = where;
          c.order = ++this.arrivals;
          list.push(c);
          moved.add(c);
        }
      }
    }

    if (instant) this.root.classList.add('still');
    for (const { side, where, list } of stacks.values()) {
      list.forEach((c, j) => {
        place(c.node, this.#slot(where, side, j, list.length));
        c.node.style.zIndex = moved.has(c) ? 100 + j : j + 1;
        c.node.classList.toggle('off', where === 'off');
        c.top = j === list.length - 1;
        if (moved.has(c) && !instant) setTimeout(() => { c.node.style.zIndex = j + 1; }, 600);
      });
    }
    if (instant) {
      void this.root.offsetWidth;                          // apply positions before transitions return
      this.root.classList.remove('still');
    }
    this.#describe();
  }

  #describe() {
    const b = this.board;
    const mine = (n) => `${n} of your checkers`;
    const theirs = (n) => `${n} of your opponent’s checkers`;
    this.points.forEach((point, i) => {
      const own = countAt(b, this.me, i);
      const opp = countAt(b, 1 - this.me, i);
      point.setAttribute('aria-label', `Point ${posOf(this.me, i)}: ${own ? mine(own) : opp ? theirs(opp) : 'empty'}`);
    });
    this.barSpot.setAttribute('aria-label', `Bar: ${mine(b.bar[this.me])}, ${theirs(b.bar[1 - this.me])}`);
    this.offSpot.setAttribute('aria-label', `Home tray: ${b.off[this.me]} of your checkers borne off`);
  }

  /** Mark what can be picked up, what is picked up, and where it may land. */
  setHints({ movable = [], selected = null, targets = [] } = {}) {
    const side = this.me;
    const spotFor = (where) => (where === 'bar' ? this.barSpot : where === 'off' ? this.offSpot : this.points[where]);
    for (const spot of [...this.points, this.barSpot, this.offSpot]) spot.classList.remove('can', 'target');
    for (const where of movable) spotFor(where).classList.add('can');
    for (const where of targets) spotFor(where).classList.add('target');
    for (const c of this.checkers) {
      const live = c.side === side && c.top;
      c.node.classList.toggle('hot', live && movable.includes(c.where));
      c.node.classList.toggle('sel', live && c.where === selected);
    }
    this.ghosts.replaceChildren();
    if (!this.board) return;
    for (const where of targets) {
      const n = where === 'off' ? this.board.off[side] : countAt(this.board, side, where);
      const ghost = el('div', `landing${where === 'off' ? ' off' : ''}`, this.ghosts);
      place(ghost, this.#slot(where, side, n, n + 1));
    }
  }

  /**
   * Show dice. `values` are the faces, `used` flags the ones already played and
   * `owner` is 'me', 'them' or 'split' (the opening roll: one die each).
   * With `tumble` the dice rattle first; the promise resolves when they settle.
   */
  showDice(values, { used = [], owner = 'me', tumble = false } = {}) {
    clearInterval(this.diceTimer);
    const run = (this.diceRun = (this.diceRun ?? 0) + 1);  // a newer call cancels an older tumble
    const centre = { me: 1020, them: 330 };
    this.dice.forEach((die, k) => {
      die.hidden = k >= values.length;
      if (die.hidden) return;
      let x;
      if (owner === 'split') x = centre[k === this.me ? 'me' : 'them'] - DIE / 2;
      else x = centre[owner] + (k - (values.length - 1) / 2) * (DIE + 16) - DIE / 2;
      place(die, { x, y: 500 - DIE / 2 });
      die.dataset.v = values[k];
      die.classList.toggle('used', Boolean(used[k]));
      die.classList.remove('tumble');
    });
    this.diceBox.setAttribute('aria-label', values.length ? `Dice: ${values.join(', ')}` : 'No dice rolled');
    if (!tumble || !values.length || calm()) return Promise.resolve();

    const live = this.dice.slice(0, values.length);
    for (const die of live) {
      void die.offsetWidth;                                // restart the CSS animation
      die.classList.add('tumble');
    }
    const shuffle = () => live.forEach((die) => { die.dataset.v = 1 + Math.floor(Math.random() * 6); });
    shuffle();
    this.diceTimer = setInterval(shuffle, 90);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (run !== this.diceRun) return resolve();
        clearInterval(this.diceTimer);
        live.forEach((die, k) => { die.dataset.v = values[k]; die.classList.remove('tumble'); });
        resolve();
      }, TUMBLE_MS);
    });
  }
}

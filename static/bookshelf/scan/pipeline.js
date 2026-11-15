// Turns a bookshelf photo into a list of books with spine outlines, entirely in
// the browser: image work is done on canvases and the only network calls are
// the model requests made by the `ask` function passed in.
//
// The scan runs in stages, each designed to remove a specific source of error:
//
//   1. Layout   - find each shelf row / stack on a small overview image.
//   2. Detect   - cut every row into tiles of ~16 books and have the model
//                 outline and read each spine at high resolution. The outline
//                 and the title come back in the same record, so a title can
//                 never drift onto a neighbouring spine.
//   3. Verify   - draw the numbered outlines back onto the tile and have the
//                 model check its own work against the picture: wrong labels,
//                 sloppy outlines, merged or missing books.
//   4. Snap     - nudge every outline edge onto the nearest strong edge in the
//                 photo itself (see snapQuadToEdges).
//   5. Merge    - drop duplicates where tiles overlap, sort into reading order.

import { z } from '../vendor/anthropic.js';
import { ScanError } from './errors.js';
import { area, centroid, isUsableQuad, overlapOfSmaller, snapQuadToEdges } from './geometry.js';

const DISPLAY_MAX_EDGE = 2400; // the copy kept with the shelf and embedded in downloads
const MASTER_MAX_EDGE = 4096; // stored photo
const OVERVIEW_MAX_EDGE = 1568; // layout pass
const TILE_MAX_EDGE = 1900; // detection pass; stays under the model's 3.75 MP image limit
const TILE_MIN_EDGE = 1400; // small crops are enlarged so thin spines stay readable
const BOOKS_PER_TILE = 16;
const CONCURRENCY = 4;

const SYSTEM = `You are the vision component of a bookshelf cataloguing app. People photograph \
their shelves and the app overlays a clickable outline on every book spine. Your coordinates are \
drawn directly on the photo, and your titles are shown to the owner of the books, so precision \
matters more than coverage: an outline that spills onto the neighbouring book, or a title attached \
to the wrong spine, is worse than leaving a book out.

All coordinates are integer pixel positions in the image you are looking at, with the origin at \
the top-left corner, x increasing to the right and y increasing downward.`;

const Point = z.object({ x: z.number().int(), y: z.number().int() });

const Spine = z.object({
  tl: Point.describe('Upper-left corner of the spine face as it appears in the image'),
  tr: Point.describe('Upper-right corner'),
  br: Point.describe('Lower-right corner'),
  bl: Point.describe('Lower-left corner'),
  spine_text: z.string().describe('The text printed on the spine exactly as you can read it, or "" if none is legible'),
  title: z.string().describe('The book title, or "" if you cannot determine it'),
  author: z.string().describe('The author(s), or "" if not determinable'),
  legibility: z.enum(['clear', 'partial', 'unreadable']),
  cut_off: z.boolean().describe('True if the spine continues beyond the edge of this image'),
  genre: z.string().describe('A short genre or subject label, e.g. "Science fiction" or "Programming"; "" if unknown'),
  blurb: z.string().describe('One sentence (25 words or fewer) on what the book is about; "" if the book is unidentified'),
});

const LayoutSchema = z.object({
  groups: z.array(
    z.object({
      kind: z.enum(['row', 'stack']).describe('row: books standing side by side. stack: books lying flat on top of each other.'),
      x0: z.number().int(),
      y0: z.number().int(),
      x1: z.number().int(),
      y1: z.number().int(),
      book_count: z.number().int().describe('Approximate number of books in the group'),
    }),
  ),
});

const DetectSchema = z.object({ spines: z.array(Spine) });

const VerifySchema = z.object({
  corrections: z.array(
    z.object({
      number: z.number().int().describe('The number drawn on the outline being corrected'),
      action: z.enum(['fix', 'remove']),
      reason: z.string(),
      spine: Spine.describe('The complete corrected record. For "remove", repeat the existing record.'),
    }),
  ),
  missing: z.array(Spine).describe('Books visible in the image that have no outline at all'),
});

function layoutPrompt(width, height) {
  return `This photo is ${width} x ${height} pixels. Find every group of books in it.

A group is either a "row" (books standing upright or leaning, side by side along a shelf) or a \
"stack" (books lying flat, piled on top of each other). A bookcase with three shelves has at least \
three groups; a pile of books lying on top of a row is its own group.

For each group give a bounding box (x0, y0 = top-left, x1, y1 = bottom-right) that fully contains \
every book in the group, with a small margin, and an approximate count of the books in it. Ignore \
anything that is not a book (ornaments, boxes, picture frames) unless it sits between books, in \
which case just let the box span it. List groups from top to bottom, then left to right.`;
}

function detectPrompt(width, height, kind) {
  const arrangement =
    kind === 'stack'
      ? 'The books here are mostly lying flat in a stack, so their spines run horizontally.'
      : 'The books here are mostly standing side by side, so their spines run vertically (some may lean).';
  return `This image is ${width} x ${height} pixels. It is a crop of one section of a bookshelf. \
${arrangement}

Find every book spine and return one record per book, working in order along the shelf (left to \
right for a row, top to bottom for a stack).

For each book:
- Give the four corners of the visible spine face as a quadrilateral that follows the spine's own \
edges. Leaning books get a tilted quadrilateral, not an upright box. Corners are named by where \
they appear in the image (tl = upper-left, tr = upper-right, br = lower-right, bl = lower-left). \
Trace the actual boundary between this book and its neighbours: adjacent outlines should meet at \
the gap between the books and never overlap. Include the whole spine from its top edge to its \
bottom edge, but not the shelf, the cover face, or the page edges. Take care with the two ends: \
books usually stand a little way back from the front of the shelf, so a strip of shelf board is \
visible in front of them. The spine ends where the book itself ends and meets the board, not at \
the front lip of the board, and at the other end it stops at the book's own edge, not at the \
shelf above. Books in a row differ in height, so each book gets its own top and bottom.
- Read the spine. Put the literal text in spine_text, then give the proper title and author. Use \
your knowledge of books to complete a title that is partly hidden or abbreviated on the spine, and \
to supply an author the spine omits, but only when you are confident which book it is. If you \
cannot tell, leave title and author empty rather than guessing; the outline is still useful.
- Set legibility to "clear" when you could read the spine outright, "partial" when you relied on \
recognising the book from fragments, and "unreadable" when you could not identify it.
- Set cut_off to true when the spine runs past the left/right (or top/bottom) edge of this image. \
Neighbouring crops overlap, so a book cut off here appears whole in the next one.

Every physical book gets exactly one record, including thin ones and ones with blank spines. \
Multi-volume sets are separate books. Do not return records for objects that are not books.`;
}

function verifyPrompt(width, height, records) {
  return `Two versions of the same ${width} x ${height} pixel bookshelf crop are attached. The \
first is the original. On the second, an earlier pass has drawn a numbered outline around each \
book spine it found. The records it produced for those numbers are:

${JSON.stringify(records, null, 1)}

Check that pass against what you can see, one number at a time. For each numbered outline look at \
the spine underneath its number in the original image and ask:
- Does the outline cover exactly one book? An outline that spans two books, covers only part of a \
spine, or is shifted sideways so it straddles a boundary needs fixing.
- Do the two ends of the outline sit on the ends of the book? An outline that runs past the book \
onto the shelf board it stands on, or up into the gap above a short book, needs fixing; so does \
one that stops well short of the book's end.
- Is the title/author recorded for that number really the text on the spine under that number? \
Titles shifted along by one book are the most common mistake, so compare each record with its own \
spine, not with the list order.
- Is it a book at all, and is it the only outline for that book?

Report only what needs to change:
- "fix": give the complete corrected record (corners and text) for that number.
- "remove": the outline is not a book, or duplicates another outline.
Then list under "missing" any book that has no outline, with a full record for each.

Do not report outlines that are already right; small imperfections of a few pixels are fine. \
If everything is correct, return empty lists.`;
}

const quadOf = (spine) => [spine.tl, spine.tr, spine.br, spine.bl].map((p) => [p.x, p.y]);

/** Run async jobs with a concurrency cap, preserving order. */
async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

/** Split a group's bounding box into overlapping tiles of roughly BOOKS_PER_TILE books. */
export function planTiles(group, width, height) {
  const horizontal = group.kind !== 'stack';
  const x0 = Math.max(0, Math.min(group.x0, group.x1));
  const y0 = Math.max(0, Math.min(group.y0, group.y1));
  const x1 = Math.min(width, Math.max(group.x0, group.x1));
  const y1 = Math.min(height, Math.max(group.y0, group.y1));
  const w = x1 - x0;
  const h = y1 - y0;
  if (w < 8 || h < 8) return [];

  const count = Math.max(1, group.book_count);
  const pieces = Math.ceil(count / BOOKS_PER_TILE);
  const span = horizontal ? w : h;
  // Overlap by about three average books so any book cut by one tile is whole in the next.
  const overlap = pieces > 1 ? Math.min((3 * span) / count, (0.35 * span) / pieces) : 0;
  const tileSpan = (span + (pieces - 1) * overlap) / pieces;
  // Padding so spine ends are not flush with the crop edge.
  const padX = Math.round((horizontal ? 0.015 : 0.04) * w) + 6;
  const padY = Math.round((horizontal ? 0.05 : 0.015) * h) + 6;

  const tiles = [];
  for (let i = 0; i < pieces; i++) {
    const start = i * (tileSpan - overlap);
    const left = Math.max(0, Math.floor((horizontal ? x0 + start : x0) - padX));
    const top = Math.max(0, Math.floor((horizontal ? y0 : y0 + start) - padY));
    const right = Math.min(width, Math.ceil((horizontal ? x0 + start + tileSpan : x1) + padX));
    const bottom = Math.min(height, Math.ceil((horizontal ? y1 : y0 + start + tileSpan) + padY));
    tiles.push({ kind: group.kind, left, top, width: right - left, height: bottom - top });
  }
  return tiles;
}

const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function usableSpines(spines, tileImage) {
  const minArea = tileImage.width * tileImage.height * 0.0002;
  return spines.filter((spine) => {
    const quad = quadOf(spine);
    if (!isUsableQuad(quad, minArea)) return false;
    const [cx, cy] = centroid(quad);
    return cx >= 0 && cy >= 0 && cx <= tileImage.width && cy <= tileImage.height;
  });
}


// --- Canvas helpers -------------------------------------------------------------

function canvasOf(width, height) {
  const canvas = new OffscreenCanvas(width, height);
  return { canvas, context: canvas.getContext('2d') };
}

const toBlob = (canvas, quality) => canvas.convertToBlob({ type: 'image/jpeg', quality });

async function toBase64(canvas, quality) {
  const bytes = new Uint8Array(await (await toBlob(canvas, quality)).arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

/** Crop a tile out of the master photo and scale it to the size the model reads best. */
export async function renderTile(master, tile, fixedScale) {
  const longEdge = Math.max(tile.width, tile.height);
  const target = Math.min(TILE_MAX_EDGE, Math.max(TILE_MIN_EDGE, longEdge));
  const scale = fixedScale ?? target / longEdge;
  const width = Math.max(1, Math.round(tile.width * scale));
  const height = Math.max(1, Math.round(tile.height * scale));
  const { canvas, context } = canvasOf(width, height);
  context.imageSmoothingQuality = 'high';
  context.drawImage(master, tile.left, tile.top, tile.width, tile.height, 0, 0, width, height);
  return { canvas, jpeg: await toBase64(canvas, 0.9), width, height, scale };
}

/** Draw numbered outlines on a tile so the model can check them against the photo. */
export async function annotate(tileImage, spines) {
  const colors = ['#ff2d55', '#00e5ff', '#ffe600', '#39ff14'];
  const fontSize = Math.max(16, Math.round(Math.max(tileImage.width, tileImage.height) / 85));
  const { canvas, context } = canvasOf(tileImage.width, tileImage.height);
  context.drawImage(tileImage.canvas, 0, 0);
  context.lineJoin = 'round';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `bold ${fontSize}px Helvetica, Arial, sans-serif`;

  const trace = (quad) => {
    context.beginPath();
    quad.forEach(([x, y], i) => (i ? context.lineTo(x, y) : context.moveTo(x, y)));
    context.closePath();
  };
  const edge = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

  spines.forEach((spine, i) => {
    const quad = quadOf(spine);
    const color = colors[i % colors.length];
    trace(quad);
    context.strokeStyle = '#000';
    context.lineWidth = 5;
    context.stroke();
    context.strokeStyle = color;
    context.lineWidth = 2.5;
    context.stroke();
  });
  // Labels go on last so no outline is drawn across a number.
  spines.forEach((spine, i) => {
    const quad = quadOf(spine);
    const color = colors[i % colors.length];
    // Stagger labels along the spine so numbers on thin neighbouring books do not collide.
    const t = [0.3, 0.5, 0.7][i % 3];
    const tall = edge(quad[0], quad[3]) >= edge(quad[0], quad[1]);
    const startMid = tall ? mid(quad[0], quad[1]) : mid(quad[0], quad[3]);
    const endMid = tall ? mid(quad[3], quad[2]) : mid(quad[1], quad[2]);
    const cx = startMid[0] + (endMid[0] - startMid[0]) * t;
    const cy = startMid[1] + (endMid[1] - startMid[1]) * t;
    const label = String(i + 1);
    const boxW = fontSize * (0.62 * label.length + 0.7);
    const boxH = fontSize * 1.25;
    context.fillStyle = '#000';
    context.strokeStyle = color;
    context.lineWidth = 1.5;
    context.beginPath();
    context.roundRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH, 3);
    context.fill();
    context.stroke();
    context.fillStyle = color;
    context.fillText(label, cx, cy + fontSize * 0.04);
  });
  return toBase64(canvas, 0.88);
}

/** Lightly blurred greyscale copy of the photo, for edge snapping. */
function grayscale(master) {
  const { canvas, context } = canvasOf(master.width, master.height);
  if ('filter' in context) context.filter = 'blur(1px)'; // not in Safari; snapping still works without it
  context.drawImage(master, 0, 0);
  const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const data = new Uint8Array(canvas.width * canvas.height);
  for (let i = 0, p = 0; i < data.length; i++, p += 4) {
    data[i] = (rgba[p] * 299 + rgba[p + 1] * 587 + rgba[p + 2] * 114) / 1000;
  }
  return { data, width: canvas.width, height: canvas.height };
}

async function scanTile(master, tile, ask) {
  const image = await renderTile(master, tile);
  const usage = [];

  const detected = await ask({
    system: SYSTEM,
    images: [{ jpeg: image.jpeg }],
    prompt: detectPrompt(image.width, image.height, tile.kind),
    schema: DetectSchema,
  });
  usage.push(detected.usage);
  let spines = usableSpines(detected.output.spines, image);
  let changes = 0;

  if (spines.length) {
    const annotated = await annotate(image, spines);
    const records = spines.map((spine, i) => ({ number: i + 1, title: spine.title, author: spine.author, spine_text: spine.spine_text }));
    const checked = await ask({
      system: SYSTEM,
      images: [
        { jpeg: image.jpeg, caption: 'Original crop:' },
        { jpeg: annotated, caption: 'Same crop with the numbered outlines from the earlier pass:' },
      ],
      prompt: verifyPrompt(image.width, image.height, records),
      schema: VerifySchema,
    });
    usage.push(checked.usage);

    const next = spines.map((spine) => spine);
    for (const correction of checked.output.corrections) {
      const index = correction.number - 1;
      if (index < 0 || index >= next.length || !next[index]) continue;
      if (correction.action === 'remove') {
        next[index] = null;
        changes++;
      } else if (usableSpines([correction.spine], image).length) {
        next[index] = correction.spine;
        changes++;
      }
    }
    const added = usableSpines(checked.output.missing, image);
    changes += added.length;
    spines = [...next.filter(Boolean), ...added];
  }

  // Tile pixels -> master pixels.
  const books = spines.map((spine) => ({
    ...spine,
    quad: quadOf(spine).map(([x, y]) => [tile.left + x / image.scale, tile.top + y / image.scale]),
  }));
  return { books, usage, changes };
}

function dedupe(books) {
  const rank = (book) => (book.cut_off ? 0 : 2) + (book.title ? 1 : 0);
  const kept = [];
  const ordered = [...books].sort((a, b) => rank(b) - rank(a) || area(b.quad) - area(a.quad));
  for (const book of ordered) {
    if (!kept.some((other) => overlapOfSmaller(book.quad, other.quad) > 0.55)) kept.push(book);
  }
  return kept;
}

/**
 * @param {Buffer} input the uploaded photo
 * @param {(event: {done: number, total: number, message: string}) => void} onProgress
 * @param {{verify?: boolean}} [options]
 */
/**
 * @param {Blob} file the chosen photo
 * @param {object} options
 * @param {(request: {system: string, images: {jpeg: string, caption?: string}[], prompt: string, schema: object, effort?: string}) => Promise<{output: object, usage: object}>} options.ask
 *   Sends one question about some images to the model (see createAsk in claude.js).
 * @param {(event: {done: number, total: number, message: string}) => void} [options.onProgress]
 * @returns {Promise<{width: number, height: number, image: Blob, books: object[], stats: object}>}
 */
export async function scanPhoto(file, { ask, onProgress = () => {} }) {
  // Normalise: apply EXIF rotation and cap the size.
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new ScanError('That file could not be read as an image. Try a JPEG or PNG.');
  }
  const masterScale = Math.min(1, MASTER_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * masterScale);
  const height = Math.round(bitmap.height * masterScale);
  const { canvas: master, context: masterContext } = canvasOf(width, height);
  masterContext.imageSmoothingQuality = 'high';
  masterContext.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let done = 0;
  let total = 3;
  const step = (message) => onProgress({ done: Math.min(done, total), total, message });
  step('Looking for shelves…');

  const overviewScale = Math.min(1, OVERVIEW_MAX_EDGE / Math.max(width, height));
  const overview = await renderTile(master, { left: 0, top: 0, width, height }, overviewScale);
  const layout = await ask({
    system: SYSTEM,
    images: [{ jpeg: overview.jpeg }],
    prompt: layoutPrompt(overview.width, overview.height),
    schema: LayoutSchema,
    effort: 'medium',
  });
  const usage = [layout.usage];

  let groups = layout.output.groups.map((group) => ({
    ...group,
    x0: group.x0 / overview.scale,
    y0: group.y0 / overview.scale,
    x1: group.x1 / overview.scale,
    y1: group.y1 / overview.scale,
  }));
  let tiles = groups.flatMap((group, groupIndex) => planTiles(group, width, height).map((tile) => ({ ...tile, groupIndex })));
  if (!tiles.length) {
    // No shelves reported: treat the whole photo as one row and let detection decide.
    groups = [{ kind: 'row', x0: 0, y0: 0, x1: width, y1: height, book_count: BOOKS_PER_TILE }];
    tiles = [{ kind: 'row', left: 0, top: 0, width, height, groupIndex: 0 }];
  }

  done = 1;
  total = 1 + tiles.length + 1;
  const sections = tiles.length === 1 ? '1 section' : `${tiles.length} sections`;
  step(`Found ${groups.length === 1 ? '1 shelf' : `${groups.length} shelves`}. Reading spines in ${sections}…`);

  let corrections = 0;
  let found = 0;
  const tileResults = await pool(tiles, CONCURRENCY, async (tile) => {
    const result = await scanTile(master, tile, ask);
    done++;
    found += result.books.length;
    corrections += result.changes;
    step(`Read ${found} spines so far…`);
    return { usage: result.usage, books: result.books.map((book) => ({ ...book, groupIndex: tile.groupIndex, kind: tile.kind })) };
  });
  for (const result of tileResults) usage.push(...result.usage);

  step('Tightening outlines…');
  const gray = grayscale(master);
  const maxShift = Math.max(6, Math.round(Math.max(width, height) * 0.0035));

  let books = dedupe(tileResults.flatMap((result) => result.books));
  books = books.map((book) => ({ ...book, quad: snapQuadToEdges(book.quad, gray, { maxShift }) }));

  // A book sliced by the edge of the photo that could not be named is clutter, not a find.
  const margin = Math.max(width, height) * 0.004;
  const touchesPhotoEdge = (quad) => quad.some(([x, y]) => x <= margin || y <= margin || x >= width - margin || y >= height - margin);
  books = books.filter((book) => book.title.trim() || !touchesPhotoEdge(book.quad));

  // Reading order: shelf by shelf, then along the shelf.
  books.sort((a, b) => {
    if (a.groupIndex !== b.groupIndex) return a.groupIndex - b.groupIndex;
    const [ax, ay] = centroid(a.quad);
    const [bx, by] = centroid(b.quad);
    return a.kind === 'stack' ? ay - by : ax - bx;
  });

  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  const round = (value) => Math.round(value * 1e4) / 1e4;
  const result = books.map((book, i) => ({
    id: `b${i + 1}`,
    title: book.title.trim(),
    author: book.author.trim(),
    spineText: book.spine_text.trim(),
    legibility: book.legibility,
    genre: book.genre.trim(),
    blurb: book.blurb.trim(),
    shelf: book.groupIndex + 1,
    // Normalised to the photo (0..1) so the overlay scales with the image.
    quad: book.quad.map(([x, y]) => [round(clamp01(x / width)), round(clamp01(y / height))]),
  }));

  // The copy that is displayed and embedded in downloads.
  const displayScale = Math.min(1, DISPLAY_MAX_EDGE / Math.max(width, height));
  const display = canvasOf(Math.round(width * displayScale), Math.round(height * displayScale));
  display.context.imageSmoothingQuality = 'high';
  display.context.drawImage(master, 0, 0, display.canvas.width, display.canvas.height);

  done = total;
  step(`Done: ${result.length} books.`);

  return {
    width: display.canvas.width,
    height: display.canvas.height,
    image: await toBlob(display.canvas, 0.82),
    books: result,
    stats: {
      shelves: groups.length,
      sections: tiles.length,
      corrections,
      inputTokens: usage.reduce((sum, u) => sum + (u?.input_tokens ?? 0), 0),
      outputTokens: usage.reduce((sum, u) => sum + (u?.output_tokens ?? 0), 0),
    },
  };
}

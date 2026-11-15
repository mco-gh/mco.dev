// Turning a shelf into files people can keep, and reading those files back.
//
// Two download shapes, both readable again by importShelfFile():
//   - one .html file with the photo, data and viewer all embedded
//   - a .zip of index.html + image.jpg + books.js, for hosting or hand-editing

const FORMAT = 'shelf-scanner';

// --- Page template ------------------------------------------------------------

let assets;
/** The viewer's own source, styles and tooltip polyfill, fetched once from this app. */
function loadAssets() {
  const text = (url) =>
    fetch(url).then((response) => {
      if (!response.ok) throw new Error(`Could not load ${url}`);
      return response.text();
    });
  assets ??= Promise.all([text('styles.css'), text('viewer.js'), text('vendor/interestfor.min.js')]).then(([css, viewer, polyfill]) => ({ css, viewer, polyfill }));
  return assets;
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
// Text placed inside a <script> element must not contain a closing script tag.
const safeForScript = (source) => source.replace(/<\/(script)/gi, '<\\/$1');

function shelfData(shelf) {
  const { name, createdAt, width, height, books } = shelf;
  return { format: FORMAT, version: 1, name, createdAt, width, height, books };
}

/**
 * @param {object} shelf
 * @param {object} options
 * @param {string} options.imageSrc  a data: URL (single file) or a relative path (zip)
 * @param {boolean} options.inlineData  embed the book data in the page, or load it from books.js
 */
async function pageHtml(shelf, { imageSrc, inlineData }) {
  const { css, viewer, polyfill } = await loadAssets();
  const name = escapeHtml(shelf.name);
  const data = inlineData
    ? `<script type="application/json" id="shelf-data">${JSON.stringify(shelfData(shelf)).replace(/</g, '\\u003c')}</script>`
    : '<script src="books.js"></script>';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="generator" content="Bookshelf">
<title>${name}</title>
<style>
${css}
</style>
</head>
<body>
<main>
<h1>${name}</h1>
<div id="shelf-root"></div>
<noscript><p>This page needs JavaScript to make the book spines interactive.</p></noscript>
<img id="shelf-photo" src="${imageSrc}" alt="" hidden>
</main>
${data}
<script type="text/plain" id="interestfor-polyfill">${safeForScript(polyfill)}</script>
<script type="module">
${safeForScript(viewer.replace(/^export /gm, ''))}

// Tooltips use the interestfor attribute; load the bundled polyfill only where the browser lacks it.
if (!('interestForElement' in HTMLButtonElement.prototype)) {
  const script = document.createElement('script');
  script.textContent = document.getElementById('interestfor-polyfill').textContent;
  document.head.append(script);
}
const shelf = window.SHELF_DATA ?? JSON.parse(document.getElementById('shelf-data').textContent);
mountShelf(document.getElementById('shelf-root'), shelf, { imageUrl: document.getElementById('shelf-photo').src });
</script>
</body>
</html>
`;
}

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export const fileStem = (shelf) =>
  shelf.name
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 60) || 'bookshelf';

/** One self-contained page: open it from disk, email it, or host it anywhere. */
export async function buildHtmlFile(shelf) {
  const html = await pageHtml(shelf, { imageSrc: await blobToDataUrl(shelf.image), inlineData: true });
  return new Blob([html], { type: 'text/html' });
}

/** A folder to host or edit: the page, the photo, and the book list as a separate file. */
export async function buildZipFile(shelf) {
  const html = await pageHtml(shelf, { imageSrc: 'image.jpg', inlineData: false });
  const books = `// Book data for index.html. Edit titles and authors here; keep the structure intact.\nwindow.SHELF_DATA = ${JSON.stringify(shelfData(shelf), null, 2)};\n`;
  const encoder = new TextEncoder();
  return zip([
    { name: 'index.html', bytes: encoder.encode(html) },
    { name: 'books.js', bytes: encoder.encode(books) },
    { name: 'image.jpg', bytes: new Uint8Array(await shelf.image.arrayBuffer()) },
  ]);
}

export function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// --- Zip (stored, no compression: the photo is already a JPEG) -----------------

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(files) {
  const encoder = new TextEncoder();
  const now = new Date();
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const parts = [];
  const central = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const crc = crc32(file.bytes);
    const size = file.bytes.length;
    const fields = (view, at) => {
      view.setUint16(at, 20, true); // version needed
      view.setUint16(at + 2, 0x0800, true); // UTF-8 names
      view.setUint16(at + 4, 0, true); // stored
      view.setUint16(at + 6, time, true);
      view.setUint16(at + 8, date, true);
      view.setUint32(at + 10, crc, true);
      view.setUint32(at + 14, size, true);
      view.setUint32(at + 18, size, true);
      view.setUint16(at + 22, name.length, true);
    };
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    fields(local, 4);
    parts.push(local.buffer, name, file.bytes);

    const entry = new DataView(new ArrayBuffer(46));
    entry.setUint32(0, 0x02014b50, true);
    entry.setUint16(4, 20, true); // version made by
    fields(entry, 6);
    entry.setUint32(42, offset, true);
    central.push(entry.buffer, name);
    offset += 30 + name.length + size;
  }

  const centralSize = central.reduce((sum, part) => sum + part.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end.buffer], { type: 'application/zip' });
}

/** Read a zip into a Map of name -> Uint8Array. Handles stored and deflated entries. */
async function unzip(buffer) {
  const view = new DataView(buffer);
  let end = buffer.byteLength - 22;
  while (end >= 0 && view.getUint32(end, true) !== 0x06054b50) end--;
  if (end < 0) throw new Error('not a zip');
  const count = view.getUint16(end + 10, true);
  let at = view.getUint32(end + 16, true);
  const decoder = new TextDecoder();
  const files = new Map();
  for (let i = 0; i < count; i++) {
    if (view.getUint32(at, true) !== 0x02014b50) throw new Error('bad zip directory');
    const method = view.getUint16(at + 10, true);
    const compressedSize = view.getUint32(at + 20, true);
    const nameLength = view.getUint16(at + 28, true);
    const extraLength = view.getUint16(at + 30, true);
    const commentLength = view.getUint16(at + 32, true);
    const localOffset = view.getUint32(at + 42, true);
    const name = decoder.decode(new Uint8Array(buffer, at + 46, nameLength));
    const dataStart = localOffset + 30 + view.getUint16(localOffset + 26, true) + view.getUint16(localOffset + 28, true);
    const raw = new Uint8Array(buffer, dataStart, compressedSize);
    if (method === 0) files.set(name, raw);
    else if (method === 8) {
      const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      files.set(name, new Uint8Array(await new Response(stream).arrayBuffer()));
    }
    at += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

// --- Reading a saved shelf back --------------------------------------------------

/** Treat a file's contents as untrusted: keep only well-formed fields. */
function cleanShelf(data, fallbackName) {
  if (data?.format !== FORMAT || !Array.isArray(data.books)) throw new Error('not a shelf');
  const text = (value) => (typeof value === 'string' ? value.slice(0, 500) : '');
  const books = data.books
    .filter(
      (book) =>
        Array.isArray(book?.quad) &&
        book.quad.length === 4 &&
        book.quad.every((p) => Array.isArray(p) && p.length === 2 && p.every((n) => Number.isFinite(n) && n >= 0 && n <= 1)),
    )
    .map((book, i) => ({
      id: `b${i + 1}`,
      title: text(book.title),
      author: text(book.author),
      spineText: text(book.spineText),
      legibility: ['clear', 'partial', 'unreadable'].includes(book.legibility) ? book.legibility : 'clear',
      genre: text(book.genre),
      blurb: text(book.blurb),
      shelf: Number.isInteger(book.shelf) ? book.shelf : 1,
      quad: book.quad.map(([x, y]) => [x, y]),
    }));
  return {
    name: text(data.name).slice(0, 80) || fallbackName,
    createdAt: Number.isNaN(Date.parse(data.createdAt)) ? new Date().toISOString() : new Date(data.createdAt).toISOString(),
    width: Number.isFinite(data.width) && data.width > 0 ? data.width : 4,
    height: Number.isFinite(data.height) && data.height > 0 ? data.height : 3,
    books,
  };
}

/**
 * Read a shelf from a file this app produced (.html or .zip).
 * @returns {Promise<{name, createdAt, width, height, books, image: Blob}>}
 */
export async function importShelfFile(file) {
  const fallbackName = file.name.replace(/\.[a-z0-9]+$/i, '');
  const problem = new Error('That file is not a shelf saved by Bookshelf. Choose a .html or .zip file you downloaded from here.');
  try {
    const buffer = await file.arrayBuffer();
    const isZip = new DataView(buffer).getUint32(0, true) === 0x04034b50;

    if (isZip) {
      const files = await unzip(buffer);
      const find = (suffix) => [...files.entries()].find(([name]) => name === suffix || name.endsWith(`/${suffix}`))?.[1];
      const booksJs = find('books.js');
      const photo = find('image.jpg');
      if (!booksJs || !photo) throw problem;
      const source = new TextDecoder().decode(booksJs);
      const json = source.slice(source.indexOf('{'), source.lastIndexOf('}') + 1);
      return { ...cleanShelf(JSON.parse(json), fallbackName), image: new Blob([photo], { type: 'image/jpeg' }) };
    }

    const page = new DOMParser().parseFromString(new TextDecoder().decode(buffer), 'text/html');
    const data = page.getElementById('shelf-data');
    const photo = page.getElementById('shelf-photo')?.getAttribute('src') ?? '';
    if (!data || !photo.startsWith('data:image/')) throw problem;
    const image = await (await fetch(photo)).blob();
    return { ...cleanShelf(JSON.parse(data.textContent), fallbackName), image };
  } catch {
    throw problem;
  }
}

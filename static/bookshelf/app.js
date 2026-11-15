// Bookshelf: scan a photo, keep the result in this browser, browse it, and
// download it as a file. Everything runs in the page; there is no server.

import { buildHtmlFile, buildZipFile, download, fileStem, importShelfFile } from './export.js';
import { deleteShelf, getShelf, listShelves, saveShelf } from './store.js';
import { mountShelf } from './viewer.js';

// `interestfor` (hover/focus/long-press tooltips) is native in Chromium only.
if (!('interestForElement' in HTMLButtonElement.prototype)) {
  await import('./vendor/interestfor.min.js');
}

const $ = (id) => document.getElementById(id);

// The About dialog opens declaratively (command="show-modal"); these cover browsers
// that lack invoker commands or <dialog closedby>.
const aboutDialog = $('about-dialog');
if (!('commandForElement' in HTMLButtonElement.prototype)) {
  document.querySelector('[commandfor="about-dialog"]').addEventListener('click', () => aboutDialog.showModal());
}
if (!('closedBy' in HTMLDialogElement.prototype)) {
  const outside = (event) => {
    const r = aboutDialog.getBoundingClientRect();
    return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
  };
  let pressedOutside = false;
  aboutDialog.addEventListener('pointerdown', (event) => {
    pressedOutside = outside(event);
  });
  aboutDialog.addEventListener('pointerup', (event) => {
    if (pressedOutside && outside(event)) aboutDialog.close();
  });
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'text') node.textContent = value;
    else if (key === 'class') node.className = value;
    else node.setAttribute(key, value);
  }
  node.append(...children);
  return node;
}

const newId = () => crypto.randomUUID().replaceAll('-', '').slice(0, 12);

// --- The visitor's API key --------------------------------------------------------
//
// Scanning calls Anthropic directly from this page with the visitor's own key.
// The key lives in sessionStorage (until the tab closes) or, if they ask,
// localStorage. It is never sent anywhere except api.anthropic.com.

const KEY_NAME = 'bookshelf.apiKey';
const readKey = () => sessionStorage.getItem(KEY_NAME) ?? localStorage.getItem(KEY_NAME) ?? '';

function showKeyState() {
  const key = readKey();
  $('key-state').textContent = key
    ? `A key ending in …${key.slice(-4)} is saved ${localStorage.getItem(KEY_NAME) ? 'on this device' : 'until you close this tab'}.`
    : 'No key saved yet.';
  $('forget-key').hidden = !key;
}

$('key-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const key = $('api-key').value.trim();
  if (!key) return;
  sessionStorage.removeItem(KEY_NAME);
  localStorage.removeItem(KEY_NAME);
  ($('remember-key').checked ? localStorage : sessionStorage).setItem(KEY_NAME, key);
  $('api-key').value = '';
  $('scan-error').textContent = '';
  showKeyState();
});

$('forget-key').addEventListener('click', () => {
  sessionStorage.removeItem(KEY_NAME);
  localStorage.removeItem(KEY_NAME);
  showKeyState();
});

showKeyState();

// --- Scanning -----------------------------------------------------------------

const uploadForm = $('upload-form');
const photoInput = $('photo');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = photoInput.files[0];
  if (!file) return;

  const submit = uploadForm.querySelector('button[type="submit"]');
  const bar = $('progress-bar');
  submit.disabled = true;
  $('scan-error').textContent = '';
  $('scan-progress').hidden = false;
  bar.removeAttribute('value'); // indeterminate until the scan reports steps
  $('scan-status').textContent = 'Getting ready…';

  try {
    const key = readKey();
    if (!key) {
      $('api-key').focus();
      throw Object.assign(new Error('Add your Anthropic API key above first. Scanning uses your own key.'), { name: 'ScanError' });
    }
    // The scanner and the Claude SDK are only downloaded when a scan starts.
    const [{ scanPhoto }, { createAsk }] = await Promise.all([import('./scan/pipeline.js'), import('./scan/claude.js')]);
    const result = await scanPhoto(file, {
      ask: createAsk(key),
      onProgress(progress) {
        bar.max = progress.total;
        bar.value = progress.done;
        $('scan-status').textContent = progress.message;
      },
    });

    const shelf = await saveShelf({
      id: newId(),
      name: file.name.replace(/\.[a-z0-9]+$/i, '').slice(0, 80) || 'Bookshelf',
      createdAt: new Date().toISOString(),
      width: result.width,
      height: result.height,
      books: result.books,
      image: result.image,
    });
    uploadForm.reset();
    $('scan-status').textContent = 'Scan complete.';
    location.hash = `#/shelf/${shelf.id}`;
  } catch (error) {
    $('scan-status').textContent = '';
    console.error(error);
    $('scan-error').textContent = error.name === 'ScanError' ? error.message : 'The scan failed unexpectedly. Reload the page and try again.';
  } finally {
    submit.disabled = false;
    $('scan-progress').hidden = true;
  }
});

// Dropping a photo onto the form is the same as choosing it.
for (const type of ['dragenter', 'dragover']) {
  uploadForm.addEventListener(type, (event) => {
    event.preventDefault();
    uploadForm.classList.add('dragging');
  });
}
for (const type of ['dragleave', 'drop']) {
  uploadForm.addEventListener(type, () => uploadForm.classList.remove('dragging'));
}
uploadForm.addEventListener('drop', (event) => {
  event.preventDefault();
  if (event.dataTransfer.files.length) photoInput.files = event.dataTransfer.files;
});

// --- Opening a saved shelf ------------------------------------------------------

$('open-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = $('saved-file').files[0];
  if (!file) return;
  $('open-error').textContent = '';
  try {
    const shelf = await saveShelf({ id: newId(), ...(await importShelfFile(file)) });
    event.target.reset();
    location.hash = `#/shelf/${shelf.id}`;
  } catch (error) {
    $('open-error').textContent = error.message;
  }
});

// --- Home: shelves kept in this browser -----------------------------------------

let objectUrls = [];
function imageUrlFor(blob) {
  const url = URL.createObjectURL(blob);
  objectUrls.push(url);
  return url;
}
function releaseImageUrls() {
  for (const url of objectUrls) URL.revokeObjectURL(url);
  objectUrls = [];
}

let mounted = null;
let currentShelf = null;

async function showHome() {
  mounted?.destroy();
  mounted = null;
  currentShelf = null;
  releaseImageUrls();
  $('viewer').hidden = true;
  $('home').hidden = false;
  document.title = 'Bookshelf';

  const shelves = await listShelves();
  const formatDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
  $('library').hidden = shelves.length === 0;
  $('scan-list').replaceChildren(
    ...shelves.map((shelf) => {
      const remove = el('button', { type: 'button', class: 'danger', 'aria-label': `Delete ${shelf.name}`, text: 'Delete' });
      remove.addEventListener('click', async () => {
        if (!confirm(`Delete “${shelf.name}” from this browser? Any file you downloaded is not affected.`)) return;
        await deleteShelf(shelf.id);
        showHome();
      });
      return el(
        'li',
        { class: 'scan-card' },
        el('img', { src: imageUrlFor(shelf.image), alt: '', loading: 'lazy', width: shelf.width, height: shelf.height }),
        el(
          'div',
          { class: 'card-body' },
          el(
            'div',
            {},
            el('a', { href: `#/shelf/${shelf.id}`, text: shelf.name }),
            el('p', { class: 'hint', text: `${shelf.books.length} books · ${formatDate.format(new Date(shelf.createdAt))}` }),
          ),
          remove,
        ),
      );
    }),
  );
}

// --- Shelf page -------------------------------------------------------------------

async function showShelf(id) {
  const shelf = await getShelf(id);
  if (!shelf) {
    location.hash = '#/';
    return;
  }
  mounted?.destroy();
  releaseImageUrls();
  currentShelf = shelf;

  $('viewer-title').textContent = shelf.name;
  $('shelf-name').value = shelf.name;
  $('download-status').textContent = '';
  document.title = `${shelf.name} · Bookshelf`;

  mounted = mountShelf($('shelf-root'), shelf, {
    imageUrl: imageUrlFor(shelf.image),
    // Corrections are saved straight back to this browser's copy.
    async onEdit(book, { title, author }) {
      const changed = title !== book.title || author !== book.author;
      // The model's notes described the book it thought this was.
      const updated = changed ? { ...book, title, author, blurb: '', genre: '', legibility: 'clear', edited: true } : book;
      currentShelf.books = currentShelf.books.map((b) => (b.id === book.id ? updated : b));
      await saveShelf(currentShelf);
      return updated;
    },
    async onRemove(book) {
      currentShelf.books = currentShelf.books.filter((b) => b.id !== book.id);
      await saveShelf(currentShelf);
    },
  });

  $('home').hidden = true;
  $('viewer').hidden = false;
  $('viewer-title').focus();
}

async function saveAs(build, extension) {
  const status = $('download-status');
  status.textContent = 'Preparing download…';
  try {
    download(await build(currentShelf), `${fileStem(currentShelf)}.${extension}`);
    status.textContent = `Downloaded ${fileStem(currentShelf)}.${extension}.`;
  } catch {
    status.textContent = 'The download could not be prepared. Check your connection and try again.';
  }
}
$('download-html').addEventListener('click', () => saveAs(buildHtmlFile, 'html'));
$('download-zip').addEventListener('click', () => saveAs(buildZipFile, 'zip'));

$('rename-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = $('shelf-name').value.trim();
  if (!name || !currentShelf) return;
  currentShelf.name = name;
  await saveShelf(currentShelf);
  $('viewer-title').textContent = name;
  document.title = `${name} · Bookshelf`;
  $('download-status').textContent = 'Renamed.';
});

// --- Routing ------------------------------------------------------------------------

function route() {
  const match = location.hash.match(/^#\/shelf\/([a-f0-9]{12})$/);
  if (match) showShelf(match[1]);
  else showHome();
}

addEventListener('hashchange', route);
route();

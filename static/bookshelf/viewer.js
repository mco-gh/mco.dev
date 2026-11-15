// The interactive shelf: photo, clickable spines, search, book list and the
// details dialog. This file has no imports on purpose: the app loads it as a
// module, and its source is also copied verbatim into downloaded shelf pages.

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

const displayTitle = (book) => book.title || 'Unidentified book';

const lookups = new Map();

/** Look the book up on Open Library for a cover, year and canonical page. */
function lookUp(book) {
  const key = `${book.title}|${book.author}`;
  if (!lookups.has(key)) {
    const params = new URLSearchParams({ title: book.title, limit: '1', fields: 'key,title,author_name,first_publish_year,cover_i' });
    if (book.author) params.set('author', book.author.split(/,| and | & /)[0]);
    lookups.set(
      key,
      fetch(`https://openlibrary.org/search.json?${params}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data?.docs?.[0] ?? null)
        .catch(() => null),
    );
  }
  return lookups.get(key);
}

function linksFor(book, match) {
  const query = encodeURIComponent(`${book.title} ${book.author}`.trim());
  return [
    ['Open Library', match?.key ? `https://openlibrary.org${match.key}` : `https://openlibrary.org/search?q=${query}`],
    ['Google Books', `https://www.google.com/search?tbm=bks&q=${query}`],
    ['Libraries (WorldCat)', `https://search.worldcat.org/search?q=${query}`],
    ['Bookshop.org', `https://bookshop.org/search?keywords=${query}`],
  ];
}

/**
 * Render a shelf into `root`.
 *
 * @param {HTMLElement} root
 * @param {{name: string, width: number, height: number, books: object[]}} shelf
 * @param {object} options
 * @param {string} options.imageUrl
 * @param {(book: object, changes: {title: string, author: string}) => Promise<object>} [options.onEdit]
 *   Called when a book is renamed; resolves to the updated book. Omit both callbacks for a read-only shelf.
 * @param {(book: object) => Promise<void>} [options.onRemove]
 * @param {boolean} [options.compact]  show only the photo and its hotspots (no summary, search or list)
 * @param {string} [options.idPrefix]  needed when more than one shelf is mounted on a page
 * @returns {{destroy: () => void}}
 */
export function mountShelf(root, shelf, { imageUrl, onEdit, onRemove, compact = false, idPrefix = '' }) {
  const editable = Boolean(onEdit && onRemove);
  // Element ids are prefixed so two shelves can be on one page.
  const id = (name) => `${idPrefix}${name}`;
  let books = shelf.books;
  let currentBook = null;

  // --- Structure -------------------------------------------------------------

  const summary = el('p', { class: 'lede' });
  const filterInput = el('input', {
    type: 'search',
    id: id('shelf-filter'),
    name: 'q',
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'none',
    spellcheck: 'false',
    enterkeyhint: 'search',
  });
  const filterStatus = el('p', { class: 'hint', role: 'status' });
  const filterForm = el('form', { class: 'filter' }, el('label', { for: id('shelf-filter'), text: 'Find a book on this shelf' }), filterInput, filterStatus);
  filterForm.addEventListener('submit', (event) => event.preventDefault());

  const image = el('img', { src: imageUrl, width: shelf.width, height: shelf.height, alt: `Photo of the bookshelf “${shelf.name}”` });
  const spines = el('div');
  const shelfBox = el('div', { class: 'shelf' }, image, spines);

  const listTitle = el('h2', { id: id('shelf-list-title'), text: 'All books' });
  const list = el('ol', { class: 'book-list', 'aria-labelledby': id('shelf-list-title') });

  // Details dialog
  const title = el('h2', { id: id('book-title') });
  const author = el('p', { class: 'book-author' });
  const cover = el('img', { class: 'book-cover', alt: '', hidden: '' });
  const meta = el('p', { class: 'book-meta' });
  const blurb = el('p');
  const note = el('p', { class: 'hint' });
  const links = el('ul', { class: 'book-links' });
  const dialog = el(
    'dialog',
    { closedby: 'any', 'aria-labelledby': id('book-title') },
    el('div', { class: 'dialog-head' }, title, el('form', { method: 'dialog' }, el('button', { class: 'icon-button', 'aria-label': 'Close', autofocus: '', text: '×' }))),
    author,
    el('div', { class: 'book-body' }, cover, el('div', {}, meta, blurb, note)),
    el('h3', { text: 'Find this book' }),
    links,
  );

  let editDetails;
  let editTitle;
  let editAuthor;
  let editStatus;
  if (editable) {
    editTitle = el('input', { type: 'text', id: id('edit-title'), name: 'title', required: '', maxlength: '300' });
    editAuthor = el('input', { type: 'text', id: id('edit-author'), name: 'author', maxlength: '300' });
    editStatus = el('p', { class: 'hint', role: 'status' });
    const removeButton = el('button', { type: 'button', class: 'danger', text: 'Remove this outline' });
    const editForm = el(
      'form',
      { class: 'edit-form' },
      el('div', { class: 'field' }, el('label', { for: id('edit-title') }, 'Title ', el('span', { 'aria-hidden': 'true', text: '*' })), editTitle),
      el('div', { class: 'field' }, el('label', { for: id('edit-author'), text: 'Author' }), editAuthor),
      el('div', { class: 'actions' }, el('button', { type: 'submit', class: 'primary', text: 'Save changes' }), removeButton),
      editStatus,
    );
    editDetails = el('details', {}, el('summary', { text: 'Fix this entry' }), editForm);
    dialog.append(editDetails);

    editForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        const updated = await onEdit(currentBook, { title: editTitle.value.trim(), author: editAuthor.value.trim() });
        books = books.map((book) => (book.id === updated.id ? updated : book));
        render();
        fillDialog(updated);
        editStatus.textContent = 'Saved.';
      } catch {
        editStatus.textContent = 'Could not save the change.';
      }
    });
    removeButton.addEventListener('click', async () => {
      if (!confirm(`Remove the outline for “${displayTitle(currentBook)}”? This cannot be undone.`)) return;
      try {
        await onRemove(currentBook);
        books = books.filter((book) => book.id !== currentBook.id);
        dialog.close();
        render();
      } catch {
        editStatus.textContent = 'Could not remove the outline.';
      }
    });
  }

  // <dialog closedby="any"> gives click-outside-to-close; emulate it where missing.
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (event) => {
      const r = dialog.getBoundingClientRect();
      return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
    };
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (event) => {
      pressedOutside = outside(event);
    });
    dialog.addEventListener('pointerup', (event) => {
      if (pressedOutside && outside(event)) dialog.close();
    });
  }

  if (compact) root.replaceChildren(shelfBox, dialog);
  else root.replaceChildren(summary, el('search', {}, filterForm), shelfBox, listTitle, list, dialog);

  // --- Rendering -------------------------------------------------------------

  function renderSpines() {
    const nodes = [];
    for (const book of books) {
      const xs = book.quad.map((p) => p[0]);
      const ys = book.quad.map((p) => p[1]);
      const x0 = Math.min(...xs);
      const y0 = Math.min(...ys);
      const w = Math.max(...xs) - x0 || 0.001;
      const h = Math.max(...ys) - y0 || 0.001;
      // Outline relative to the button's own box, in percent.
      const local = book.quad.map(([x, y]) => [((x - x0) / w) * 100, ((y - y0) / h) * 100]);
      const tipId = id(`tip-${book.id}`);

      // The button has no text of its own: the tooltip is its accessible name.
      const button = el('button', { type: 'button', class: 'spine', interestfor: tipId, 'aria-labelledby': tipId, 'data-book': book.id });
      button.style.cssText = `left:${x0 * 100}%;top:${y0 * 100}%;width:${w * 100}%;height:${h * 100}%`;
      button.style.setProperty('--outline', `polygon(${local.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')})`);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.setAttribute('aria-hidden', 'true');
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', local.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' '));
      polygon.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.append(polygon);
      button.append(svg);
      button.addEventListener('click', () => openBook(book.id));

      const tip = el('div', { popover: 'hint', id: tipId, class: 'tip' }, el('strong', { text: displayTitle(book) }));
      if (book.author) tip.append(' ', el('span', { text: `by ${book.author}` }));
      nodes.push(button, tip);
    }
    spines.replaceChildren(...nodes);
  }

  function renderList() {
    const items = [];
    let shelfNumber = null;
    const manyShelves = new Set(books.map((b) => b.shelf)).size > 1;
    for (const book of books) {
      if (manyShelves && book.shelf !== shelfNumber) {
        shelfNumber = book.shelf;
        items.push(el('li', { class: 'shelf-heading', text: `Shelf ${shelfNumber}` }));
      }
      const button = el('button', { type: 'button' }, displayTitle(book));
      if (book.author) button.append(el('span', { class: 'who', text: book.author }));
      button.addEventListener('click', () => openBook(book.id));
      items.push(el('li', { 'data-book': book.id }, button));
    }
    list.replaceChildren(...items);
  }

  function applyFilter() {
    const query = filterInput.value.trim().toLowerCase();
    let matches = 0;
    for (const book of books) {
      const hit = Boolean(query) && `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query);
      if (hit) matches++;
      spines.querySelector(`[data-book="${book.id}"]`)?.classList.toggle('match', hit);
      const item = list.querySelector(`[data-book="${book.id}"]`);
      if (item) item.hidden = Boolean(query) && !hit;
    }
    for (const heading of list.querySelectorAll('.shelf-heading')) heading.hidden = Boolean(query);
    shelfBox.classList.toggle('filtering', Boolean(query));
    filterStatus.textContent = query ? `${matches} of ${books.length} books match.` : '';
  }
  filterInput.addEventListener('input', applyFilter);

  function render() {
    const unidentified = books.filter((b) => !b.title).length;
    summary.textContent =
      `${books.length} books` +
      (unidentified ? `, ${unidentified} not identified` : '') +
      '. Hover over or tab to a spine for its title; select it for details.';
    renderSpines();
    renderList();
    applyFilter();
  }

  // --- Details dialog --------------------------------------------------------

  function renderLinks(book, match) {
    links.replaceChildren(
      ...linksFor(book, match).map(([label, href]) => el('li', {}, el('a', { href, target: '_blank', rel: 'noopener noreferrer', text: label }))),
    );
  }

  function fillDialog(book) {
    currentBook = book;
    title.textContent = displayTitle(book);
    author.textContent = book.author ? `by ${book.author}` : '';
    meta.textContent = book.genre;
    blurb.textContent = book.blurb;
    const fixHint = editable ? ' You can name it below.' : '';
    note.textContent = !book.title
      ? book.spineText
        ? `The spine could not be matched to a book. Text read from it: “${book.spineText}”.${fixHint}`
        : `The spine could not be read.${fixHint}`
      : book.legibility === 'partial'
        ? 'Identified from a partly legible spine, so worth a second look.'
        : '';
    cover.hidden = true;
    cover.removeAttribute('src');
    if (editable) {
      editTitle.value = book.title;
      editAuthor.value = book.author;
      editStatus.textContent = '';
      editDetails.open = !book.title;
    }

    if (!book.title) {
      links.replaceChildren(el('li', { class: 'hint', text: 'This book has not been identified, so there is nothing to search for.' }));
      return;
    }
    renderLinks(book, null);
    lookUp(book).then((match) => {
      if (currentBook !== book || !match) return;
      renderLinks(book, match);
      if (match.first_publish_year) {
        meta.textContent = [book.genre, `First published ${match.first_publish_year}`].filter(Boolean).join(' · ');
      }
      if (match.cover_i) {
        cover.src = `https://covers.openlibrary.org/b/id/${match.cover_i}-M.jpg`;
        cover.hidden = false;
      }
    });
  }

  function openBook(id) {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    fillDialog(book);
    dialog.showModal();
  }

  render();

  return {
    destroy() {
      if (dialog.open) dialog.close();
      root.replaceChildren();
    },
  };
}

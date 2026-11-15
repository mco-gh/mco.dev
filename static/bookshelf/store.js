// Shelves live in this browser only (IndexedDB). The server keeps nothing.
//
// A shelf record: { id, name, createdAt, width, height, books, image: Blob }

const DB_NAME = 'shelf-scanner';
const STORE = 'shelves';

let opening;
function database() {
  opening ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return opening;
}

async function run(mode, action) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export async function listShelves() {
  const shelves = await run('readonly', (store) => store.getAll());
  return shelves.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const getShelf = (id) => run('readonly', (store) => store.get(id));

export async function saveShelf(shelf) {
  await run('readwrite', (store) => store.put(shelf));
  // Ask the browser not to evict this data under storage pressure. Best effort.
  navigator.storage?.persist?.().catch(() => {});
  return shelf;
}

export const deleteShelf = (id) => run('readwrite', (store) => store.delete(id));

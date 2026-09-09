import type { Challenge, Entry } from './types.ts'

const DB_NAME = 'day100'
const DB_VERSION = 1

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta')
      }
      if (!db.objectStoreNames.contains('entries')) {
        db.createObjectStore('entries', { keyPath: 'dayNumber' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function withStore<T>(
  storeName: 'meta' | 'entries',
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(storeName, mode)
        const request = run(tx.objectStore(storeName))
        let result: T
        request.onsuccess = () => {
          result = request.result
        }
        request.onerror = () => reject(request.error)
        tx.oncomplete = () => {
          db.close()
          resolve(result)
        }
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error ?? new Error('aborted'))
      }),
  )
}

export function getChallenge(): Promise<Challenge | undefined> {
  return withStore('meta', 'readonly', (store) => store.get('challenge'))
}

export function saveChallenge(challenge: Challenge): Promise<void> {
  return withStore('meta', 'readwrite', (store) =>
    store.put(challenge, 'challenge'),
  ).then(() => undefined)
}

export function getAllEntries(): Promise<Entry[]> {
  return withStore('entries', 'readonly', (store) => store.getAll())
}

export function saveEntry(entry: Entry): Promise<void> {
  return withStore('entries', 'readwrite', (store) => store.put(entry)).then(
    () => undefined,
  )
}

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * A very small JSON document store.
 *
 * The point of this file is not the storage — it is the seam. Orders and
 * inventory sit behind narrow interfaces (see `orders.ts` / `inventory.ts`) so
 * this can be swapped for Postgres, Redis or the Shopify Storefront API
 * without touching the pages or route handlers.
 *
 * Two modes:
 *
 *   file    — the default when running locally. Documents live in `data/`,
 *             writes are serialised per file and go through a temp file plus a
 *             rename, so a crash mid-write cannot leave a half-written
 *             document behind.
 *
 *   memory  — used automatically when the filesystem is not writable (a
 *             serverless deployment, a read-only container) or deliberately
 *             when LEAF_AND_ROOT_STORAGE=memory. Documents live in module
 *             scope, so they survive for the life of a warm instance and are
 *             lost on restart.
 *
 * Memory mode degrades rather than breaks: the checkout still completes, and
 * the reason is logged once.
 */
const DATA_DIR = join(process.cwd(), "data");

/**
 * State lives on `globalThis`, not in module scope. Next bundles server code
 * per route, so a module-level `Map` would be duplicated — the checkout route
 * and the order page would each get their own copy and never see each other's
 * writes. `globalThis` is shared across every bundle in the process.
 */
const shared = globalThis as unknown as {
  __leafAndRootMemory?: Map<string, unknown>;
  __leafAndRootFileUnavailable?: boolean;
  __leafAndRootFallbackAnnounced?: boolean;
};

const memory = (shared.__leafAndRootMemory ??= new Map<string, unknown>());

/**
 * `undefined` means "not yet determined". The switch forces memory mode up
 * front; otherwise the first failed write decides.
 */
function fileStoreAvailable(): boolean {
  if (process.env.LEAF_AND_ROOT_STORAGE === "memory") return false;
  return shared.__leafAndRootFileUnavailable !== true;
}

function isMissingFile(error: unknown): boolean {
  return (error as NodeJS.ErrnoException | undefined)?.code === "ENOENT";
}

function degradeToMemory(error: unknown): void {
  shared.__leafAndRootFileUnavailable = true;
  if (shared.__leafAndRootFallbackAnnounced) return;
  shared.__leafAndRootFallbackAnnounced = true;
  console.warn(
    "[leaf-and-root] filesystem is not writable — using in-memory storage. " +
      "Orders and inventory will not survive a restart. " +
      `Cause: ${error instanceof Error ? error.message : String(error)}`,
  );
}

export function storageMode(): "file" | "memory" {
  return fileStoreAvailable() ? "file" : "memory";
}

/* -------------------------------------------------------------------------- */

type Queue = Promise<unknown>;
const locks = new Map<string, Queue>();

function withLock<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve();
  const next = previous.then(task, task);
  /* Keep the chain alive but never let a rejection poison it. */
  locks.set(
    key,
    next.catch(() => undefined),
  );
  return next as Promise<T>;
}

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  if (fileStoreAvailable()) {
    try {
      const raw = await readFile(join(DATA_DIR, `${name}.json`), "utf8");
      return JSON.parse(raw) as T;
    } catch (error) {
      /* A missing file just means nothing has been written yet. */
      if (!isMissingFile(error)) degradeToMemory(error);
    }
  }
  return (memory.get(name) as T | undefined) ?? fallback;
}

export async function writeJson(name: string, value: unknown): Promise<void> {
  /* Always keep memory current, so a later failure cannot serve stale data. */
  memory.set(name, value);
  if (!fileStoreAvailable()) return;

  try {
    await mkdir(DATA_DIR, { recursive: true });
    const target = join(DATA_DIR, `${name}.json`);
    const temp = join(DATA_DIR, `.${name}.${process.pid}.tmp`);
    await writeFile(temp, JSON.stringify(value, null, 2), "utf8");
    await rename(temp, target);
  } catch (error) {
    degradeToMemory(error);
  }
}

/** Read–modify–write under a per-file lock. */
export async function mutateJson<T>(
  name: string,
  fallback: T,
  mutator: (current: T) => T | Promise<T>,
): Promise<T> {
  return withLock(name, async () => {
    const current = await readJson<T>(name, fallback);
    const next = await mutator(current);
    await writeJson(name, next);
    return next;
  });
}

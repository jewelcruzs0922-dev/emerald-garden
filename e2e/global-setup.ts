import { rm } from "node:fs/promises";
import { join } from "node:path";

/**
 * Orders and inventory live in ./data as JSON (see src/lib/commerce/json-store).
 * Clearing it before a run means stock assertions start from the catalogue's
 * declared quantities rather than whatever a previous run left behind.
 */
export default async function globalSetup() {
  await rm(join(process.cwd(), "data"), { recursive: true, force: true });
}

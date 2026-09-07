import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-only. True when `<repo>/public/<rel>` exists, so pages can degrade
 * gracefully before real assets (photo, resume) are added.
 */
export function publicFileExists(rel: string): boolean {
  return existsSync(path.join(process.cwd(), "public", rel));
}

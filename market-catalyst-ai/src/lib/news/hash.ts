import { createHash } from "crypto";

/** Short, stable, URL-safe hash used to derive article/event IDs from content. */
export function stableId(input: string): string {
  return createHash("sha1").update(input).digest("hex").slice(0, 16);
}

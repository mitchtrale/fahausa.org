/**
 * Generate a URL-safe slug from a title, with the year from dateStart appended.
 * e.g. "Sauna & Swim Social" + "2026-05-09" → "sauna-swim-social-2026"
 */
export function generateSlug(title: string, dateStart: string): string {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics (ä→a, ö→o, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')    // non-alphanumeric → hyphens
    .replace(/^-+|-+$/g, '');        // trim leading/trailing hyphens

  const year = dateStart.slice(0, 4);
  return `${base}-${year}`;
}

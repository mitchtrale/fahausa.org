import type { APIRoute } from 'astro';
import { eq, gte, desc, and, ne } from 'drizzle-orm';
import { events } from '../../../db/schema';
import { generateSlug } from '../../../lib/slug';

export const GET: APIRoute = async ({ locals }) => {
  const db = (locals as any).db;
  if (!db) {
    return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
  }

  const today = new Date().toISOString().slice(0, 10);
  const result = await db
    .select()
    .from(events)
    .where(eq(events.published, true))
    .orderBy(events.dateStart);

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
};

/** Check if a slug already exists (optionally excluding a given event ID). */
export async function isSlugTaken(db: any, slug: string, excludeId?: number): Promise<boolean> {
  const conditions = [eq(events.slug, slug)];
  if (excludeId !== undefined) {
    conditions.push(ne(events.id, excludeId));
  }
  const existing = await db.select({ id: events.id }).from(events).where(and(...conditions)).limit(1);
  return existing.length > 0;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const db = (locals as any).db;
  if (!db) {
    return new Response(JSON.stringify({ error: 'No database' }), { status: 503 });
  }

  const form = await request.formData();
  const title = form.get('title')?.toString() || '';
  const dateStart = form.get('date_start')?.toString() || '';
  const slug = form.get('slug')?.toString()?.trim() || generateSlug(title, dateStart);

  const [inserted] = await db.insert(events).values({
    title,
    slug,
    description: form.get('description')?.toString() || null,
    dateStart,
    dateEnd: form.get('date_end')?.toString() || null,
    timeStart: form.get('time_start')?.toString() || null,
    timeEnd: form.get('time_end')?.toString() || null,
    location: form.get('location')?.toString() || null,
    imageUrl: form.get('image_url')?.toString() || null,
    ticketPrice: form.get('ticket_price')?.toString() || null,
    rsvpUrl: form.get('rsvp_url')?.toString() || null,
    published: form.get('published') === '1',
  }).returning();

  return new Response(null, {
    status: 303,
    headers: { Location: `/admin/events/${inserted.id}?saved=1` },
  });
};

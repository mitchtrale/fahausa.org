import type { APIRoute } from 'astro';
import { eq, gte, desc } from 'drizzle-orm';
import { events } from '../../../db/schema';

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

export const POST: APIRoute = async ({ request, locals }) => {
  const db = (locals as any).db;
  if (!db) {
    return new Response(JSON.stringify({ error: 'No database' }), { status: 503 });
  }

  const form = await request.formData();

  const [inserted] = await db.insert(events).values({
    title: form.get('title')?.toString() || '',
    description: form.get('description')?.toString() || null,
    dateStart: form.get('date_start')?.toString() || '',
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

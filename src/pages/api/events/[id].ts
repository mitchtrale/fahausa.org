import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { events, eventRecurrence } from '../../../db/schema';

export const POST: APIRoute = async ({ request, params, locals }) => {
  const db = (locals as any).db;
  if (!db) {
    return new Response(JSON.stringify({ error: 'No database' }), { status: 503 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response('Invalid ID', { status: 400 });
  }

  const form = await request.formData();
  const method = form.get('_method')?.toString();

  if (method === 'DELETE') {
    await db.delete(events).where(eq(events.id, id));
    return new Response(null, {
      status: 303,
      headers: { Location: '/admin/events?deleted=1' },
    });
  }

  if (method === 'PUT') {
    const slug = form.get('slug')?.toString()?.trim() || '';

    await db.update(events).set({
      title: form.get('title')?.toString() || '',
      slug,
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
      updatedAt: new Date().toISOString(),
    }).where(eq(events.id, id));

    return new Response(null, {
      status: 303,
      headers: { Location: `/admin/events/${id}?saved=1` },
    });
  }

  if (method === 'SET_RECURRENCE') {
    const frequency = form.get('frequency')?.toString();

    // Delete existing recurrence
    await db.delete(eventRecurrence).where(eq(eventRecurrence.parentEventId, id));

    if (frequency) {
      await db.insert(eventRecurrence).values({
        parentEventId: id,
        frequency,
        interval: 1,
        dayOfWeek: form.get('day_of_week')?.toString() ? Number(form.get('day_of_week')) : null,
        weekOfMonth: form.get('week_of_month')?.toString() ? Number(form.get('week_of_month')) : null,
        endsAt: form.get('ends_at')?.toString() || null,
      });
    }

    return new Response(null, {
      status: 303,
      headers: { Location: `/admin/events/${id}?saved=1` },
    });
  }

  return new Response('Unknown method', { status: 400 });
};

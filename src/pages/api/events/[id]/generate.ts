import type { APIRoute } from 'astro';
import { eq, and, inArray } from 'drizzle-orm';
import { events, eventRecurrence, eventOccurrences } from '../../../../db/schema';
import { generateOccurrences } from '../../../../lib/recurrence';

export const POST: APIRoute = async ({ params, locals }) => {
  const db = (locals as any).db;
  if (!db) {
    return new Response(JSON.stringify({ error: 'No database' }), { status: 503 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response('Invalid ID', { status: 400 });
  }

  // Get the event and its recurrence rule
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!event) {
    return new Response('Event not found', { status: 404 });
  }

  const [recurrence] = await db.select().from(eventRecurrence)
    .where(eq(eventRecurrence.parentEventId, id)).limit(1);
  if (!recurrence) {
    return new Response(null, {
      status: 303,
      headers: { Location: `/admin/events/${id}?error=no_recurrence` },
    });
  }

  // Generate dates
  const dates = generateOccurrences({
    frequency: recurrence.frequency as any,
    interval: recurrence.interval,
    dayOfWeek: recurrence.dayOfWeek,
    weekOfMonth: recurrence.weekOfMonth,
    startDate: event.dateStart,
    endsAt: recurrence.endsAt,
  }, 3);

  // Get existing occurrence dates to avoid duplicates
  const existing = await db.select({ date: eventOccurrences.date })
    .from(eventOccurrences)
    .where(eq(eventOccurrences.eventId, id));
  const existingDates = new Set(existing.map((e: any) => e.date));

  // Insert new occurrences
  const newDates = dates.filter((d) => !existingDates.has(d));
  if (newDates.length > 0) {
    await db.insert(eventOccurrences).values(
      newDates.map((date) => ({
        eventId: id,
        date,
        timeStart: event.timeStart,
        timeEnd: event.timeEnd,
      }))
    );
  }

  return new Response(null, {
    status: 303,
    headers: { Location: `/admin/events/${id}?generated=${newDates.length}` },
  });
};

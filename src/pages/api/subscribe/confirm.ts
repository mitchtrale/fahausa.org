import type { APIRoute } from 'astro';
import { pendingSubscribers } from '../../../db/schema';
import { addContact } from '../../../lib/brevo';
import { eq, and, gte } from 'drizzle-orm';

export const GET: APIRoute = async ({ url, locals, redirect }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return redirect('/confirm?status=invalid');
  }

  const db = (locals as any).db;
  if (!db) {
    return redirect('/confirm?status=error');
  }

  const now = new Date().toISOString();

  const [pending] = await db
    .select()
    .from(pendingSubscribers)
    .where(
      and(
        eq(pendingSubscribers.token, token),
        gte(pendingSubscribers.expiresAt, now),
      ),
    )
    .limit(1);

  if (!pending) {
    return redirect('/confirm?status=expired');
  }

  try {
    await addContact(pending.email);
  } catch (err: any) {
    // "Contact already exist" is fine — they're already on the list
    if (!err.message?.includes('Contact already exist')) {
      console.error('Brevo addContact error:', err);
      return redirect('/confirm?status=error');
    }
  }

  // Clean up the pending record
  await db.delete(pendingSubscribers).where(eq(pendingSubscribers.id, pending.id));

  return redirect('/confirm?status=success');
};

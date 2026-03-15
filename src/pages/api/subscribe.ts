import type { APIRoute } from 'astro';
import { pendingSubscribers } from '../../db/schema';
import { sendTransactionalEmail } from '../../lib/brevo';
import { buildTransactionalHtml } from '../../lib/transactionalTemplate';
import { eq } from 'drizzle-orm';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request, locals, url }) => {
  const env = (locals as any).env;
  const data = await request.json();
  const { email } = data;

  if (!email || typeof email !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Email is required' }),
      { status: 400 },
    );
  }

  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_RE.test(trimmed)) {
    return new Response(
      JSON.stringify({ error: 'Please enter a valid email address' }),
      { status: 400 },
    );
  }

  const db = (locals as any).db;
  if (!db) {
    return new Response(
      JSON.stringify({ error: 'Service unavailable' }),
      { status: 503 },
    );
  }

  // Remove any existing pending records for this email
  await db.delete(pendingSubscribers).where(eq(pendingSubscribers.email, trimmed));

  // Create a new pending record with 24h expiry
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await db.insert(pendingSubscribers).values({
    email: trimmed,
    token,
    expiresAt,
  });

  // Build confirmation URL
  const baseUrl = `${url.protocol}//${url.host}`;
  const confirmUrl = `${baseUrl}/confirm?token=${token}`;

  const bodyHtml = `
    <p>Thank you for your interest in the FAHA Newsletter!</p>
    <p>Please confirm your subscription by clicking the button below:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${confirmUrl}" style="display:inline-block;padding:12px 28px;background-color:#333333;color:#ffffff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;border-radius:4px;">
        Confirm Subscription
      </a>
    </p>
    <p style="font-size:13px;color:#666666;">
      If you did not request this, you can safely ignore this email. This link expires in 24 hours.
    </p>
  `;

  const htmlContent = buildTransactionalHtml({
    title: 'Confirm Your Subscription',
    body: bodyHtml,
    preheader: 'Please confirm your FAHA newsletter subscription',
  });

  try {
    await sendTransactionalEmail(env, {
      to: [{ email: trimmed }],
      subject: 'Confirm your FAHA Newsletter subscription',
      htmlContent,
      textContent: `Thank you for your interest in the FAHA Newsletter!\n\nPlease confirm your subscription by visiting:\n${confirmUrl}\n\nIf you did not request this, you can safely ignore this email. This link expires in 24 hours.`,
      tags: ['newsletter-confirm'],
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error('Subscribe confirmation email error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to send confirmation email' }),
      { status: 500 },
    );
  }
};

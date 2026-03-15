import type { APIRoute } from 'astro';
import { sendTransactionalEmail } from '../../lib/brevo';
import { buildTransactionalHtml } from '../../lib/transactionalTemplate';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).env;
  const data = await request.json();
  const { name, email, subject, message } = data;

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: name, email, message' }),
      { status: 400 },
    );
  }

  const contactSubject = subject || 'FAHA Contact Form';

  const bodyHtml = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
    subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : '',
    `<p><strong>Message:</strong></p>`,
    `<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
  ].join('');

  const htmlContent = buildTransactionalHtml({
    title: 'New Contact Form Submission',
    body: bodyHtml,
    preheader: `${name} — ${contactSubject}`,
  });

  const textContent = `Name: ${name}\nEmail: ${email}\nSubject: ${contactSubject}\n\nMessage:\n${message}`;

  try {
    const result = await sendTransactionalEmail(env, {
      to: [{ email: 'mtrale@fahausa.org', name: 'FAHA' }],
      subject: `[FAHA Contact] ${contactSubject}`,
      htmlContent,
      textContent,
      replyTo: { email, name },
      tags: ['contact-form'],
    });

    return new Response(JSON.stringify({ success: true, messageId: result.messageId }), {
      status: 200,
    });
  } catch (err: any) {
    console.error('Contact form email error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to send message' }),
      { status: 500 },
    );
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

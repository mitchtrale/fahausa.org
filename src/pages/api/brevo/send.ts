import type { APIRoute } from 'astro';
import { sendTransactionalEmail } from '../../../lib/brevo';
import { buildTransactionalHtml } from '../../../lib/transactionalTemplate';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).env;
  const data = await request.json();

  const { to, subject, title, body, textContent, replyTo, tags } = data;

  if (!to || !subject || !body) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: to, subject, body' }),
      { status: 400 },
    );
  }

  const recipients = Array.isArray(to)
    ? to
    : [{ email: to, name: data.toName }];

  const htmlContent = buildTransactionalHtml({
    title: title || subject,
    body,
    preheader: data.preheader,
  });

  const result = await sendTransactionalEmail(env, {
    to: recipients,
    subject,
    htmlContent,
    textContent,
    replyTo,
    tags,
  });

  return new Response(JSON.stringify(result), { status: 200 });
};

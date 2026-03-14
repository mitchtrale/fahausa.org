import type { APIRoute } from 'astro';
import { updateCampaign } from '../../../../lib/brevo';
import { buildNewsletterHtml } from '../../../../lib/emailTemplate';
import type { NewsletterSection } from '../../../../lib/emailTemplate';

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing campaign ID' }), { status: 400 });
  }

  try {
    const body = await request.json();
    const { subjectLine, previewText, title, sections } = body as {
      subjectLine: string;
      previewText: string;
      title: string;
      sections: NewsletterSection[];
    };

    const html = buildNewsletterHtml({ title, sections });
    await updateCampaign(id, {
      name: title,
      subject: subjectLine,
      previewText,
      htmlContent: html,
    });

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

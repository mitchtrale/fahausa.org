import type { APIRoute } from 'astro';
import { createCampaign } from '../../../../lib/brevo';
import { buildNewsletterHtml } from '../../../../lib/emailTemplate';
import type { NewsletterSection } from '../../../../lib/emailTemplate';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { subjectLine, previewText, title, sections } = body as {
      subjectLine: string;
      previewText: string;
      title: string;
      sections: NewsletterSection[];
    };

    const html = buildNewsletterHtml({ title, sections });
    const result = await createCampaign({
      name: title,
      subject: subjectLine,
      previewText,
      htmlContent: html,
    });

    return new Response(JSON.stringify({ id: result.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

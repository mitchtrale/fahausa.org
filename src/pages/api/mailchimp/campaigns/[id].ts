import type { APIRoute } from 'astro';
import { updateCampaign, setCampaignContent } from '../../../../lib/mailchimp';
import { buildNewsletterHtml } from '../../../../lib/emailTemplate';
import type { NewsletterSection } from '../../../../lib/emailTemplate';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('faha_admin')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
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

    // Update campaign settings
    await updateCampaign(id, { subjectLine, previewText, title });

    // Regenerate and set the HTML content
    const html = buildNewsletterHtml({ title, sections });
    await setCampaignContent(id, html);

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

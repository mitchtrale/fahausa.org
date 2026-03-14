import type { APIRoute } from 'astro';
import { createCampaign, setCampaignContent } from '../../../../lib/mailchimp';
import { buildNewsletterHtml } from '../../../../lib/emailTemplate';
import type { NewsletterSection } from '../../../../lib/emailTemplate';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Auth check
  if (cookies.get('faha_admin')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { subjectLine, previewText, title, sections } = body as {
      subjectLine: string;
      previewText: string;
      title: string;
      sections: NewsletterSection[];
    };

    // Create the campaign in Mailchimp
    const campaign = await createCampaign({
      subjectLine,
      previewText,
      title,
    });

    // Generate and set the HTML content
    const html = buildNewsletterHtml({ title, sections });
    await setCampaignContent(campaign.id, html);

    return new Response(JSON.stringify({ id: campaign.id, web_id: campaign.web_id }), {
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

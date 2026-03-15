import type { APIRoute } from 'astro';
import { createCampaign, setCampaignContent } from '../../../../lib/mailchimp';
import { buildNewsletterHtml } from '../../../../lib/emailTemplate';
import type { NewsletterSection } from '../../../../lib/emailTemplate';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).env;
  try {
    const body = await request.json();
    const { subjectLine, previewText, title, sections } = body as {
      subjectLine: string;
      previewText: string;
      title: string;
      sections: NewsletterSection[];
    };

    const campaign = await createCampaign(env, {
      subjectLine,
      previewText,
      title,
    });

    const html = buildNewsletterHtml({ title, sections });
    await setCampaignContent(env, campaign.id, html);

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

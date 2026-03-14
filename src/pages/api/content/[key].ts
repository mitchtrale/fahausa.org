import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { siteContent } from '../../../db/schema';

export const POST: APIRoute = async ({ request, params, locals }) => {
  const db = (locals as any).db;
  if (!db) {
    return new Response(JSON.stringify({ error: 'No database' }), { status: 503 });
  }

  const form = await request.formData();
  const method = form.get('_method')?.toString();

  if (method === 'PUT') {
    const content = form.get('content')?.toString() ?? '';
    await db.update(siteContent).set({
      content,
      updatedAt: new Date().toISOString(),
    }).where(eq(siteContent.sectionKey, params.key!));

    return new Response(null, {
      status: 303,
      headers: { Location: '/admin/content?saved=1' },
    });
  }

  return new Response('Unknown method', { status: 400 });
};

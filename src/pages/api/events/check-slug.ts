import type { APIRoute } from 'astro';
import { isSlugTaken } from './index';

export const GET: APIRoute = async ({ url, locals }) => {
  const db = (locals as any).db;
  if (!db) {
    return new Response(JSON.stringify({ taken: false }), { headers: { 'Content-Type': 'application/json' } });
  }

  const slug = url.searchParams.get('slug') || '';
  const excludeId = url.searchParams.get('excludeId');
  const taken = await isSlugTaken(db, slug, excludeId ? Number(excludeId) : undefined);

  return new Response(JSON.stringify({ taken }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

import type { APIRoute } from 'astro';
import { validateUpload, generateKey } from '../../lib/upload';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).env;
  if (!env?.R2) {
    return new Response(JSON.stringify({ error: 'Storage not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();
  const file = formData.get('image') as File | null;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const error = validateUpload(file);
  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = generateKey(file.name);
  const buffer = await file.arrayBuffer();

  await env.R2.put(key, buffer, {
    httpMetadata: { contentType: file.type },
  });

  // Build the public URL — uses R2_PUBLIC_URL env var or falls back to the key
  const baseUrl = env.R2_PUBLIC_URL || '';
  const url = baseUrl ? `${baseUrl}/${key}` : key;

  return new Response(JSON.stringify({ url }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

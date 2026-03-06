import type { APIRoute } from 'astro';
import { getDB } from '../../../db/index';
import { createSession, makeSetCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const formData = await request.formData();
  const password = formData.get('password')?.toString() ?? '';

  const adminPassword = env?.ADMIN_PASSWORD ?? 'admin';
  if (password !== adminPassword) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/admin?error=invalid_password' },
    });
  }

  const db = getDB(env.DB);
  const sessionId = await createSession(db);
  const isDev = import.meta.env.DEV;

  return new Response(null, {
    status: 303,
    headers: {
      Location: '/admin/events',
      'Set-Cookie': makeSetCookie(sessionId, isDev),
    },
  });
};

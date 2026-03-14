import type { APIRoute } from 'astro';
import { getDB } from '../../../db/index';
import { createSession, makeSetCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const formData = await request.formData();
  const password = formData.get('password')?.toString() ?? '';
  const redirectTo = formData.get('redirect')?.toString() ?? '/admin/events';
  const safeRedirect = redirectTo.startsWith('/admin/') ? redirectTo : '/admin/events';
  const redirectParam = safeRedirect !== '/admin/events'
    ? `&redirect=${encodeURIComponent(safeRedirect)}`
    : '';

  const adminPassword = env?.ADMIN_PASSWORD ?? 'admin';
  if (password !== adminPassword) {
    return new Response(null, {
      status: 303,
      headers: { Location: `/admin?error=invalid_password${redirectParam}` },
    });
  }

  if (!env?.DB) {
    return new Response('D1 database binding not configured', { status: 500 });
  }
  const db = getDB(env.DB);
  const sessionId = await createSession(db);
  const isDev = import.meta.env.DEV;

  return new Response(null, {
    status: 303,
    headers: {
      Location: safeRedirect,
      'Set-Cookie': makeSetCookie(sessionId, isDev),
    },
  });
};

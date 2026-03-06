import type { APIRoute } from 'astro';
import { getDB } from '../../../db/index';
import { deleteSession, getSessionIdFromCookie, makeClearCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const sessionId = getSessionIdFromCookie(request.headers.get('cookie'));
  const isDev = import.meta.env.DEV;

  if (sessionId && env?.DB) {
    const db = getDB(env.DB);
    await deleteSession(db, sessionId);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: '/admin',
      'Set-Cookie': makeClearCookie(isDev),
    },
  });
};

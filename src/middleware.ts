import { defineMiddleware } from 'astro:middleware';
import { getDB } from './db/index';
import { getSessionIdFromCookie, validateSession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, locals, redirect, url } = context;

  const env = (locals as any).runtime?.env;

  // Make db and env available to all routes if bindings exist
  if (env?.DB) {
    (locals as any).db = getDB(env.DB);
    (locals as any).env = env;
  }

  // Protect admin sub-routes (but NOT /admin itself — that's the login page)
  const isProtectedAdmin =
    url.pathname.startsWith('/admin/events') ||
    url.pathname.startsWith('/admin/content') ||
    url.pathname.startsWith('/admin/newsletter');

  // Protect API routes (except login)
  const isProtectedApi =
    url.pathname.startsWith('/api/') &&
    url.pathname !== '/api/auth/login';

  if (isProtectedAdmin || isProtectedApi) {
    if (!env?.DB) {
      return isProtectedAdmin
        ? redirect('/admin?error=no_db')
        : new Response(JSON.stringify({ error: 'Database not available' }), { status: 503 });
    }

    const db = getDB(env.DB);
    const sessionId = getSessionIdFromCookie(request.headers.get('cookie'));

    if (!sessionId) {
      return isProtectedAdmin
        ? redirect('/admin?error=not_logged_in')
        : new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const valid = await validateSession(db, sessionId);
    if (!valid) {
      return isProtectedAdmin
        ? redirect('/admin?error=session_expired')
        : new Response(JSON.stringify({ error: 'Session expired' }), { status: 401 });
    }
  }

  return next();
});

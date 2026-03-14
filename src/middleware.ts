import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect /admin routes (but not the login page itself)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return next();
  }

  // Check for auth cookie
  const authCookie = context.cookies.get('faha_admin');
  if (authCookie?.value === 'authenticated') {
    return next();
  }

  // Redirect to login
  const loginUrl = new URL('/admin/login', context.url);
  loginUrl.searchParams.set('redirect', pathname);
  return context.redirect(loginUrl.toString(), 302);
});

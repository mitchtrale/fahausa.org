import type { DB } from '../db/index';
import { sessions } from '../db/schema';
import { eq, lt } from 'drizzle-orm';

const COOKIE_NAME = 'faha_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(db: DB): Promise<string> {
  const id = generateSessionId();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  await db.insert(sessions).values({ id, createdAt: now, expiresAt });
  return id;
}

export async function validateSession(db: DB, sessionId: string): Promise<boolean> {
  const now = new Date().toISOString();
  const result = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!result.length) return false;
  if (result[0].expiresAt <= now) {
    // Clean up this expired session and any others
    await db.delete(sessions).where(lt(sessions.expiresAt, now));
    return false;
  }
  return true;
}

export async function deleteSession(db: DB, sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function getSessionIdFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match?.[1] ?? null;
}

export function makeSetCookie(sessionId: string, isDev: boolean): string {
  const secure = isDev ? '' : ' Secure;';
  return `${COOKIE_NAME}=${sessionId}; HttpOnly; SameSite=Strict;${secure} Path=/; Max-Age=86400`;
}

export function makeClearCookie(isDev: boolean): string {
  const secure = isDev ? '' : ' Secure;';
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict;${secure} Path=/; Max-Age=0`;
}

export { COOKIE_NAME };

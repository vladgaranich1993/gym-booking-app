import { auth } from './firebaseClient';
import type { User } from 'firebase/auth';

export async function finalizeLogin(
  userParam?: User,
  requireEmailVerified = true
): Promise<void> {
  const user = userParam ?? auth.currentUser;
  if (!user) throw new Error('No authenticated user. Did sign-in complete?');

  await user.reload();

  if (requireEmailVerified && !user.emailVerified) {
    throw new Error('Email not verified. Please click the verification link in your inbox.');
  }

  const idToken = await user.getIdToken(true);

  let resp: Response;
  try {
    resp = await fetch('/api/sessionLogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  } catch (e: any) {
    throw new Error(`Network error during session login: ${e.message}`);
  }

  const text = await resp.text();
  let body: any;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  if (!resp.ok) {
    const errMsg =
      typeof body === 'object' && body.error
        ? body.error
        : typeof body === 'string'
        ? body
        : resp.statusText;
    throw new Error(`Session login failed: ${errMsg}`);
  }
}

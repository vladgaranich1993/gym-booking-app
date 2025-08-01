import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

function initAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getAdminAuth();
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    const auth = initAdmin();

    try {
      await auth.verifyIdToken(idToken); // ensure token is valid
    } catch (vErr: any) {
      return NextResponse.json(
        { error: 'Invalid ID token', detail: vErr.message || String(vErr) },
        { status: 401 }
      );
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const res = NextResponse.json({ ok: true });

    // Cookie flags: omit Secure in development for localhost
    const isDev = process.env.NODE_ENV === 'development';
    const cookieParts = [
      `session=${sessionCookie}`,
      'HttpOnly',
      'Path=/',
      `Max-Age=${expiresIn / 1000}`,
      'SameSite=Strict',
    ];
    if (!isDev) cookieParts.push('Secure');

    res.headers.append('Set-Cookie', cookieParts.join('; '));
    return res;
  } catch (err: any) {
    console.error('[sessionLogin] error:', err);
    const message = err?.message || String(err);
    // In dev, return the actual message/stack to help debugging; hide in prod.
    const payload =
      process.env.NODE_ENV === 'development'
        ? { error: message, stack: err.stack }
        : { error: 'Internal server error' };
    return NextResponse.json(payload, { status: 500 });
  }
}

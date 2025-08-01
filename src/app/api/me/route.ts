import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getAdminAuth() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !rawKey) {
      throw new Error('Missing Firebase admin env vars');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: rawKey.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getAuth();
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const sessionCookie = cookieHeader
    .split('; ')
    .find((c) => c.startsWith('session='))
    ?.split('=')[1];

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({
      authenticated: true,
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch (e) {
    console.warn('Session verification failed:', (e as any).message);
    return NextResponse.json({ authenticated: false });
  }
}

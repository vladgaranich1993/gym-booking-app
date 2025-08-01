import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.append(
    'Set-Cookie',
    `session=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Strict`
  );
  return res;
}
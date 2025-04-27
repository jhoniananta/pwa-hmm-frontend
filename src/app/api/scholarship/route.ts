import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import { cookieGenerator } from '@/lib/utils';

export async function POST(req: NextRequest) {
  // 1. Tarik data session di SERVER
  const session = await verifySession();
  if (!session.isAuth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // 2. Ambil payload dari client
  const body = await req.json();

  const { access_token, refresh_token } = await verifySession();

  // 3. Teruskan ke API backend sambil menempel Authorization header
  const apiRes = await fetch(
    `${process.env.API_URL}/forms/FORM_BEASISWA/submissions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieGenerator(access_token, refresh_token),
      },
      body: JSON.stringify(body),
      // Kalau backend juga pakai cookie, kirimkan:
      credentials: 'include',
    }
  );

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}

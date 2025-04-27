// middleware.ts
import { jwtVerify, type JWTPayload } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from 'lms-types';

const key = new TextEncoder().encode(process.env.AUTH_SECRET!); // ✅ gunakan process.env langsung

console.log('process.env.AUTH_SECRET in middleware:', process.env.AUTH_SECRET);

async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload as JWTPayload & {
      userId: string;
      access_token: string;
      refresh_token: string;
      role: UserRole;
    };
  } catch (err) {
    console.log('Error decrypting session @ middleware');
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('session-hmm')?.value;
  const session = await decrypt(cookie);
  const role = session?.role;

  console.log('incoming cookie to decrypt:', cookie?.slice(0, 40)); // slice for brevity

  if (
    request.nextUrl.pathname.split('/')[1] !== 'sign-in' &&
    !session?.userId
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (
    request.nextUrl.pathname.split('/')[1] === 'portal' &&
    role !== UserRole.ADMIN
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (request.nextUrl.pathname === '/sign-in' && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// middleware.ts
import {type JWTPayload, jwtVerify} from 'jose';
import {NextRequest, NextResponse} from 'next/server';
import {UserRole} from 'lms-types';

const key = new TextEncoder().encode(process.env.AUTH_SECRET!); // ✅ gunakan process.env langsung

async function decrypt(session: string | undefined = '') {
    try {

        const {payload} = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload as JWTPayload & {
            userId: string;
            access_token: string;
            refresh_token: string;
            role: UserRole;
        };
    } catch (err) {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const cookie = request.cookies.get('session-hmm')?.value;

    const session = await decrypt(cookie);
    const role = session?.role;

    const path = request.nextUrl.pathname.split('/')[1]

    if (
        (path !== 'sign-in' && path !== 'sign-up') &&
        !session?.userId
    ) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }


    if (
        path === 'portal' &&
        role !== UserRole.ADMIN
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (request.nextUrl.pathname === '/sign-in' && session?.userId) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next|_next/static|_next/image|favicon.ico|assets|api/notification|sw.js).*)'],
};

import 'server-only';

import {type JWTPayload, jwtVerify, SignJWT} from 'jose';
import {cookies} from 'next/headers';
import {cache} from 'react';
import {NextResponse} from 'next/server';
import {getTokenFromResponse} from './utils';
import type {UserRole} from 'lms-types';
import getVerboseStatus from '@/lib/getVerboseStatus';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function encrypt(payload: JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('7day')
        .sign(key);
}

export async function decrypt(session: string | undefined = '') {
    try {
        const {payload} = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload as JWTPayload & {
            userId: string;
            role: UserRole;
            access_token: string;
            refresh_token: string;
        };
    } catch (err) {
        console.log('Error decrypting session');
        return null;
    }
}

export async function createSession(
    id: string,
    role: UserRole,
    access_token: string,
    refresh_token: string,
    expire: Date
) {
    const isVerbose = getVerboseStatus();

    const session = await encrypt({
        userId: id,
        role,
        access_token,
        refresh_token,
        expires: expire,
    });

    console.log('setting cookie...')
    console.log('session:', session)

    cookies().set('session-hmm', session, {
        httpOnly: true,
        // secure: env.NODE_ENV === 'production',
        secure: false,
        expires: expire,
        sameSite: 'lax',
        path: '/',
    });

    console.log('added cookie')
}

export async function updateSession(res: Response) {
    if (
        !res.headers.get('set-cookie')?.includes('accessToken') ||
        !res.headers.get('set-cookie')?.includes('refreshToken')
    ) {
        console.log('@updateSessions: no accessToken or refreshToken * res.headers.set-cookie:', res.headers.get('set-cookie'));
        return;
    }

    const {access_token, refresh_token, expire} = getTokenFromResponse(res);
    const session = cookies().get('session-hmm')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return;
    }

    const resn = NextResponse.next();
    resn.cookies.set({
        name: 'session-hmm',
        value: await encrypt({
            ...payload,
            expires: expire,
            access_token,
            refresh_token,
        }),
        httpOnly: true,
        // secure: env.NODE_ENV === 'production',
        secure: false,
        expires: expire,
        sameSite: 'lax',
    });

    return resn;
}

export const verifySession = cache(async () => {
    // console.log('verifying session...');
    const cookie = cookies().get('session-hmm')?.value;
    // console.log('raw cookie:', cookie); // <— cek value cookie
    if (!cookie)
        return {isAuth: false, userId: '', access_token: '', refresh_token: ''};

    const session = await decrypt(cookie);
    // console.log(`decrypted session @ ${new Date().toISOString()}`)
    // console.log('decrypted session @' + new Date().toISOString(), session); // <— cek hasil decrypt

    if (!session?.userId)
        return {isAuth: false, userId: '', access_token: '', refresh_token: ''};

    return {
        isAuth: true,
        userId: session.userId,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        role: session.role,
    };
});

export async function deleteSession() {
    cookies().set('session-hmm', '', {
        expires: new Date(0),
    });
}

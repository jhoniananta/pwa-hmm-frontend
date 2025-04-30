import {cache} from 'react';
import {updateSession, verifySession} from './session';
import {env} from '@/env';
import {handleError, PWAError} from './error';
import {$UserAPI} from "lms-types";
import {cookieGenerator} from "@/lib/utils";

export const getUser = cache(async () => {
    const session = await verifySession();
    if (!session.isAuth) return null;

    try {
        const {refresh_token, access_token, userId} = await verifySession();

        const data = await fetch(env.API_URL + $UserAPI.GetMe.generateUrl(),
            {
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieGenerator(access_token, refresh_token),
                },
            }
        );
        const user = await data.json();

        if (user.error) {
            throw new Error(user.error);
        }

        if (!data.ok) {
            throw new PWAError('Error fetching user data');
        }

        return user.data as $UserAPI.GetMe.Response["data"];
    } catch (err) {
        throw new PWAError('Error fetching user data');
    }
});

export const getFullUser = cache(async () => {
    const {refresh_token, access_token, isAuth} = await verifySession();
    if (!isAuth) return null;

    try {
        const res = await fetch(env.API_URL + $UserAPI.GetMe.generateUrl(), {
            headers: {
                Cookie: cookieGenerator(access_token, refresh_token),
            },
        });

        const {error, data} = await res.json();
        if (!res.ok || error) {
            return handleError(error);
        }

        void updateSession(res);

        return data as $UserAPI.GetMe.Response["data"];
    } catch (err) {
        throw new PWAError('Error fetching user data');
    }
});
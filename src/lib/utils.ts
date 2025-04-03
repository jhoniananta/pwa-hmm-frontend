import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {getBaseValueOfBar} from "recharts/types/util/ChartUtils";
import getVerboseStatus from "@/lib/getVerboseStatus";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const pathFormatter = (path: string) => {
    return path.toLowerCase().replace(' ', '-');
};

export const getTokenFromResponse = (res: Response) => {
    const isVerbose = getVerboseStatus()
    if (isVerbose) console.log('set-cookies: ', res.headers.get('set-cookie'))

    const set_cookies = res.headers.get('set-cookie')?.split('=');
    const access_token = set_cookies?.[1].split(';')[0];
    const refresh_token = set_cookies?.[4].split(';')[0];
    const expire = new Date(Date.now() + 1000 * 60 * 60);

    if (isVerbose) {
        console.log('access_token: ', access_token);
        console.log('refresh_token: ', refresh_token);
    }

    return {access_token, refresh_token, expire};
};

export function cookieGenerator(access_token: string, refresh_token: string) {
    return `accessToken=${access_token}; refreshToken=${refresh_token}`;
}

export function UUC2N(str: string | undefined) {
    if (!str) return 'not started';
    return str.replace(/_/g, ' ').replace(/-/g, ' ').toLowerCase();
}


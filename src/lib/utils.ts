import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import getVerboseStatus from '@/lib/getVerboseStatus';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pathFormatter = (path: string) => {
  return path.toLowerCase().replace(' ', '-');
};

export const getTokenFromResponse = (res: Response) => {
  const isVerbose = getVerboseStatus();
  // if (isVerbose) console.log('set-cookies: ', res.headers.get('set-cookie'));

  const set_cookies = res.headers.get('set-cookie')?.split('=');
  const access_token = set_cookies?.[1].split(';')[0];
  const refresh_token = set_cookies?.[4].split(';')[0];
  const expire = new Date(Date.now() + 1000 * 60 * 60);

  return { access_token, refresh_token, expire };
};

export function cookieGenerator(access_token: string, refresh_token: string) {
  return `accessToken=${access_token}; refreshToken=${refresh_token}`;
}

export function UUC2N(str: string | undefined) {
  if (!str) return 'not started';
  return str.replace(/_/g, ' ').replace(/-/g, ' ').toLowerCase();
}

export function extractMessage(err: unknown): string {
  if (!err) return 'Unknown error';

  // a) If it’s already a string
  if (typeof err === 'string') return err;

  // b) If it’s an actual Error subclass
  if (err instanceof Error) return err.message;

  // c) If it’s an object with a .message property
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as any).message === 'string'
  ) {
    return (err as any).message;
  }

  return 'Unknown error';
}

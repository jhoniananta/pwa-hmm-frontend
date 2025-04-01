import 'server-only';
import { updateSession, verifySession } from '@/lib/session';
import { env } from '@/env';
import { cookieGenerator } from '@/lib/utils';
import { handleError, PWAError } from '@/lib/error';
import { revalidatePath as rPath, revalidateTag as rTag } from 'next/cache';

export function fetchAction<T>(
  url: string,
  errorMessage?: string,
  options?: {
    queryParams?: {
      [key: string]: unknown;
    };
    bodyObject?: {
      [key: string]: unknown;
    };
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    revalidatePath?: string;
    revalidateTag?: string;
    logResponse?: boolean;
    logData?: boolean;
    cache?: 'force-cache' | 'no-cache';
    revalidate?: boolean | number;
    tags?: string[];
    name?: string;
  }
): () => Promise<T> {
  return (async () => {
    const {
      queryParams,
      bodyObject,
      logResponse = false,
      logData = false,
      method = bodyObject ? 'POST' : 'GET',
      revalidatePath,
      revalidateTag,
      cache = 'force-cache',
      revalidate,
      tags,
      name,
    } = options ?? {};
    try {
      const { refresh_token, access_token, userId } = await verifySession();

      let fetchUrl = url.replace(':userId', userId);

      if (queryParams) {
        fetchUrl += '?';
        for (const key in queryParams) {
          fetchUrl += `${key}=${queryParams[key]}&`;
        }
        fetchUrl = fetchUrl.slice(0, -1);
      }

      const res = await fetch(env.API_URL + fetchUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieGenerator(access_token, refresh_token),
        },
        body: bodyObject ? JSON.stringify(bodyObject) : undefined,
        cache,
        next: {
          revalidate: typeof revalidate === 'number' ? revalidate : undefined,
          tags,
        },
      });

      {
        logResponse && console.log(res);
      }

      const { error, data } = await res.json();
      if (!res.ok || error) {
        console.log(error);
        return handleError(error, name);
      }

      void updateSession(res); // update session in case the token is refreshed

      {
        logData && console.log(data);
      }

      if (revalidatePath) {
        rPath(revalidatePath);
      }

      if (revalidateTag) {
        rTag(revalidateTag);
      }

      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError(errorMessage ?? 'Failed to fetch data');
    }
  });
}

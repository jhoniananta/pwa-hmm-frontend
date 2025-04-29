'use server';

import {fetchAction} from '@/lib/fetch';
import {actionClient} from "@/lib/action-client";
import {z} from 'zod';
import {flattenValidationErrors} from "next-safe-action";
import {verifySession} from "@/lib/session";
import {env} from "@/env";
import {cookieGenerator} from "@/lib/utils";
import {handleError, PWAError} from "@/lib/error";
import {revalidatePath, revalidateTag} from "next/cache";
import {addTagSchema, deleteTagSchema, updateTagSchema} from "@/_actions/schema/tag-schema";

export type TagResponse = {
    tagId: number,
    title: string
}

export const getTags = fetchAction<TagResponse[]>(
    '/tags',
    'Failed to fetch tags',
    {tags: ['tags'], cache: 'no-cache'}
);

export const getTagById = async (tagId: number) =>
    await fetchAction<TagResponse>(
        `/tags/${tagId}`,
        'Failed to fetch tag',
        {tags: ['tags', `tag-${tagId}`]}
    )();

export const createTag = actionClient
    .metadata({actionName: 'createTag'})
    .schema(addTagSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(env.API_URL + '/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieGenerator(access_token, refresh_token),
                },
                body: JSON.stringify(parsedInput),
            });

            const {data, error} = await res.json();
            if (!res.ok) {
                handleError(error);
            }

            revalidatePath('/portal/atur-atur/tags');
            revalidateTag('tags');
            return data as TagResponse;
        } catch (err) {
            if (err instanceof PWAError) {
                return {
                    isError: true,
                    isPWAError: true,
                    message: err.message,
                }
            }
            throw {
                isError: true,
                isPWAError: false,
                message: (err as any).message
            }
        }
    });

export const updateTag = actionClient
    .metadata({actionName: 'updateTag'})
    .schema(updateTagSchema, {
        handleValidationErrorsShape: async (ve) =>
            (flattenValidationErrors(ve)).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {tagId, ...rest} = parsedInput;
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(env.API_URL + `/tags/${tagId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieGenerator(access_token, refresh_token),
                },
                body: JSON.stringify(rest),
            });

            const {data, error} = await res.json();
            if (!res.ok) {
                return handleError(error);
            }

            revalidatePath('/portal/atur-atur/tags');
            revalidateTag('tags');
            return data as Partial<TagResponse>;
        } catch (err) {
            if (err instanceof PWAError) {
                return {
                    isError: true,
                    isPWAError: true,
                    message: err.message,
                }
            }
            throw {
                isError: true,
                isPWAError: false,
                message: (err as any).message
            }
        }
    });

export const deleteTag = actionClient
    .metadata({actionName: 'deleteTag'})
    .schema(deleteTagSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL + `/tags/${parsedInput.tagId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                }
            );
            if (!res.ok) {
                let thrownError: any = new Error();
                if (res.body) {
                    const {error} = await res.json();
                    thrownError = error;
                }
                return handleError(thrownError)
            }

            revalidatePath('/portal/atur-atur/tags');
            revalidateTag('tags');
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to delete tag');
        }
    });
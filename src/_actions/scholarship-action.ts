'use server';

import {fetchAction} from '@/lib/fetch';
import {actionClient} from '@/lib/action-client';
import {
    addScholarshipSchema,
    updateScholarshipSchema,
    deleteScholarshipSchema,
    beasiswaFormSchema,
    responseItemsSchema,
} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
import {verifySession} from '@/lib/session';
import {env} from '@/env';
import {handleError, PWAError} from '@/lib/error';
import {cookieGenerator} from '@/lib/utils';
import {revalidatePath, revalidateTag} from 'next/cache';
import {ResponseItem} from 'lms-types';

export type ScholarshipResponse = {
    scholarshipId: number,
    title: string,
    description: string,
    provider: string,
    deadline: Date,
    reference: string,
    categories: string[]
}

export type ScholarshipResponseForm = {
    createdAt: Date,
    formId: string,
    submissionId: number,
    userId: number,
    responseItems: ResponseItem[],
}

export const getScholarships = fetchAction<ScholarshipResponse[]>(
    '/scholarships',
    'Failed to fetch scholarships',
    {tags: ['scholarships'], cache: 'no-cache'}
);

export const getScholarshipForm = fetchAction<ScholarshipResponseForm[]>(
    '/forms/FORM_BEASISWA/submissions',
    'Failed to fetch scholarship form',
    {tags: ['scholarships']}
);

export const createScholarship = actionClient
    .metadata({actionName: 'createScholarship'})
    .schema(addScholarshipSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(env.API_URL + '/scholarships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieGenerator(access_token, refresh_token),
                },
                body: JSON.stringify(parsedInput),
            });

            const {data, error} = await res.json();
            if (!res.ok) {
                return handleError(error);
            }

            revalidatePath('/portal/atur-atur/scholarships');
            revalidateTag('scholarships');
            return data as ScholarshipResponse;
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to create scholarship');
        }
    });

export const updateScholarship = actionClient
    .metadata({actionName: 'updateScholarship'})
    .schema(updateScholarshipSchema, {
        handleValidationErrorsShape: async (ve) =>
            (await flattenValidationErrors(ve)).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {scholarshipId, ...rest} = parsedInput;
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(env.API_URL + `/scholarships/${scholarshipId}`, {
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

            revalidatePath('/portal/atur-atur/scholarships');
            revalidateTag('scholarships');
            revalidateTag(`scholarship-${scholarshipId}`);
            return data as Partial<ScholarshipResponse>;
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to update scholarship');
        }
    });

export const deleteScholarship = actionClient
    .metadata({actionName: 'deleteScholarship'})
    .schema(deleteScholarshipSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL + `/scholarships/${parsedInput.scholarshipId}`,
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

            revalidatePath('/portal/atur-atur/scholarships');
            revalidateTag('scholarships');
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to delete scholarship');
        }
    });

export const getScholarshipById = async (scholarshipId: number) =>
    await fetchAction<ScholarshipResponse>(
        `/scholarships/${scholarshipId}`,
        'Failed to fetch scholarship',
        {tags: ['scholarships', `scholarship-${scholarshipId}`]}
    )();

export const createInternalScholarship = actionClient
    .metadata({actionName: 'createInternalScholarship'})
    .schema(responseItemsSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {

            const {refresh_token, access_token} = await verifySession();

            const res = await fetch(
                `${env.API_URL}/forms/internalScholarshipForm/submissions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                    body: JSON.stringify({parsedInput}),
                }
            );

            const {data, error} = await res.json();
            if (!res.ok) return handleError(error);

            console.error('dataPost:', data);
            revalidatePath('/scholarship/beasiswa-internal');
            revalidateTag(`scholarship-${data.scholarshipId}`);
            return data;
        } catch (err) {
            if (err instanceof Error) throw new PWAError(err.message);
            throw new PWAError('Failed to create internal scholarship');
        }
    });

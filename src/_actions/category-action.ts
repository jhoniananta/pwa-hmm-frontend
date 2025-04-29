'use server';

import {fetchAction} from '@/lib/fetch';
import {$CourseCategoryAPI} from 'lms-types';
import {actionClient} from '@/lib/action-client';
import {addCategorySchema, updateCategorySchema, deleteCategorySchema} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
import {verifySession} from '@/lib/session';
import {env} from '@/env';
import {handleError, PWAError} from '@/lib/error';
import {cookieGenerator} from '@/lib/utils';
import {revalidatePath, revalidateTag} from 'next/cache';

export type CategoryResponse = {
    categoryId: number,
    title: string
}

export const getCategories = fetchAction<$CourseCategoryAPI.GetCategories.Response['data']>(
    $CourseCategoryAPI.GetCategories.generateUrl(),
    'Failed to fetch categories',
    {
        tags: ['categories'],
        name: 'getCategories'
    }
);

export const getCategoryById = async (categoryId: number) =>
    await fetchAction<CategoryResponse>(
        `/categories/${categoryId}`,
        'Failed to fetch categories',
        {tags: ['categories', `category-${categoryId}`]}
    )();

export const createCategory = actionClient
    .metadata({actionName: 'createCategory'})
    .schema(addCategorySchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(env.API_URL + '/categories', {
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

            revalidatePath('/portal/atur-atur/categories');
            revalidateTag('categories');
            return data as CategoryResponse;
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

export const updateCategory = actionClient
    .metadata({actionName: 'updateCategory'})
    .schema(updateCategorySchema, {
        handleValidationErrorsShape: async (ve) =>
            (flattenValidationErrors(ve)).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {categoryId, ...rest} = parsedInput;
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(env.API_URL + `/categories/${categoryId}`, {
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

            revalidatePath('/portal/atur-atur/categories');
            revalidateTag('categories');
            return data as Partial<CategoryResponse>;
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

export const deleteCategory = actionClient
    .metadata({actionName: 'deleteCategory'})
    .schema(deleteCategorySchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL + `/categories/${parsedInput.categoryId}`,
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

            revalidatePath('/portal/atur-atur/categories');
            revalidateTag('categories');
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to delete category');
        }
    });
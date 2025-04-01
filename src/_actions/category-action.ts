'use server';

import { fetchAction } from '@/lib/fetch';
import { $CourseCategoryAPI } from 'lms-types';
import { actionClient } from '@/lib/action-client';
import { addCategorySchema, updateCategorySchema, deleteCategorySchema } from '@/lib/schema';
import { flattenValidationErrors } from 'next-safe-action';
import { verifySession } from '@/lib/session';
import { env } from '@/env';
import { handleError, PWAError } from '@/lib/error';
import { cookieGenerator } from '@/lib/utils';
import { revalidatePath, revalidateTag } from 'next/cache';

export const getCategories = fetchAction<$CourseCategoryAPI.GetCategories.Response['data']>(
  $CourseCategoryAPI.GetCategories.generateUrl(),
  'Failed to fetch categories',
  {
    tags: ['categories'],
    name: 'getCategories'
  }
);

export const getCategoryById = async (categoryId: number) =>
  await fetchAction<$CourseCategoryAPI.GetCategoryById.Response['data']>(
    $CourseCategoryAPI.GetCategoryById.generateUrl(categoryId),
    'Failed to fetch category',
    {
      name: 'getCategoryById'
    }
  )();

export const createCategory = actionClient
  .metadata({ actionName: 'createCategory' })
  .schema(addCategorySchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL + $CourseCategoryAPI.CreateCategory.generateUrl(),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieGenerator(access_token, refresh_token),
          },
          body: JSON.stringify(parsedInput),
        }
      );

      const { data, error } = await res.json();
      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/portal/atur-atur/categories');
      revalidateTag('categories');
      return data as $CourseCategoryAPI.CreateCategory.Response['data'];
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to create category');
    }
  });

export const updateCategory = actionClient
  .metadata({ actionName: 'updateCategory' })
  .schema(updateCategorySchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { categoryId, ...rest } = parsedInput;
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL + $CourseCategoryAPI.UpdateCategory.generateUrl(categoryId),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieGenerator(access_token, refresh_token),
          },
          body: JSON.stringify(rest),
        }
      );

      const { data, error } = await res.json();
      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/portal/atur-atur/categories');
      return data as $CourseCategoryAPI.UpdateCategory.Response['data'];
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to update category');
    }
  });

export const deleteCategory = actionClient
  .metadata({ actionName: 'deleteCategory' })
  .schema(deleteCategorySchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL + $CourseCategoryAPI.DeleteCategory.generateUrl(parsedInput.categoryId),
        {
          method: 'DELETE',
          headers: {
            Cookie: cookieGenerator(access_token, refresh_token),
          },
        }
      );

      const { data, error } = await res.json();
      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/portal/atur-atur/categories');
      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to delete category');
    }
  }); 
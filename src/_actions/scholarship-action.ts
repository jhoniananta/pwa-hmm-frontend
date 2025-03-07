'use server';

import { fetchAction } from '@/lib/fetch';
import { $ScholarshipAPI } from 'lms-types';
import { actionClient } from '@/lib/action-client';
import { addScholarshipSchema, updateScholarshipSchema, deleteScholarshipSchema } from '@/lib/schema';
import { flattenValidationErrors } from 'next-safe-action';
import { verifySession } from '@/lib/session';
import { env } from '@/env';
import { handleError, PWAError } from '@/lib/error';
import { cookieGenerator } from '@/lib/utils';
import { revalidatePath, revalidateTag } from 'next/cache';

export const getScholarships = fetchAction<$ScholarshipAPI.GetScholarships.Response['data']>(
  $ScholarshipAPI.GetScholarships.generateUrl(),
  'Failed to fetch scholarships',
  { tags: ['scholarships'] }
);

export const createScholarship = actionClient
  .metadata({ actionName: 'createScholarship' })
  .schema(addScholarshipSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL + $ScholarshipAPI.CreateScholarship.generateUrl(),
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

      revalidatePath('/portal/atur-atur/scholarships');
      revalidateTag('scholarships');
      return data as $ScholarshipAPI.CreateScholarship.Response['data'];
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to create scholarship');
    }
  });

export const updateScholarship = actionClient
  .metadata({ actionName: 'updateScholarship' })
  .schema(updateScholarshipSchema, {
    handleValidationErrorsShape: async (ve) => (await flattenValidationErrors(ve)).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { scholarshipId, ...rest } = parsedInput;
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL + $ScholarshipAPI.UpdateScholarship.generateUrl(scholarshipId),
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

      revalidatePath('/portal/atur-atur/scholarships');
      revalidateTag('scholarships');
      revalidateTag(`scholarship-${scholarshipId}`);
      return data as $ScholarshipAPI.UpdateScholarship.Response['data'];
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to update scholarship');
    }
  });

export const deleteScholarship = actionClient
  .metadata({ actionName: 'deleteScholarship' })
  .schema(deleteScholarshipSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL + $ScholarshipAPI.DeleteScholarship.generateUrl(parsedInput.scholarshipId),
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

      revalidatePath('/portal/atur-atur/scholarships');
      revalidateTag('scholarships');
      return data as $ScholarshipAPI.DeleteScholarship.Response['data'];
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to delete scholarship');
    }
  });

export const getScholarshipById = async (scholarshipId: number) =>
  await fetchAction<$ScholarshipAPI.GetScholarshipById.Response['data']>(
    $ScholarshipAPI.GetScholarshipById.generateUrl(scholarshipId),
    'Failed to fetch scholarship',
    { tags: ['scholarships', `scholarship-${scholarshipId}`] }
  )(); 
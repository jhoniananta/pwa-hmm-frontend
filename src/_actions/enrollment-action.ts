'use server';

import { $CourseEnrollmentAPI } from 'lms-types';
import { actionClient } from '@/lib/action-client';
import { createEnrollmentSchema } from '@/lib/schema';
import { flattenValidationErrors } from 'next-safe-action';
import { verifySession } from '@/lib/session';
import { env } from '@/env';
import { handleError, PWAError } from '@/lib/error';
import { cookieGenerator } from '@/lib/utils';
import { revalidatePath, revalidateTag } from 'next/cache';

export const createEnrollment = actionClient
  .metadata({ actionName: 'createEnrollment' })
  .schema(createEnrollmentSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL + $CourseEnrollmentAPI.CreateEnrollment.generateUrl(parsedInput.courseId),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieGenerator(access_token, refresh_token),
          },
          body: JSON.stringify({ role: parsedInput.role }),
        }
      );

      const { data, error } = await res.json();
      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/courses/[id]');
      revalidateTag('enrollments');
      revalidateTag(`course-${parsedInput.courseId}-enrollments`);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to enroll in course');
    }
  }); 
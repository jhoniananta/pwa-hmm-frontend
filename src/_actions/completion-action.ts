'use server';

import {actionClient} from "@/lib/action-client";
import {handleError, PWAError} from "@/lib/error";
import {env} from "@/env";
import {verifySession} from "@/lib/session";
import {flattenValidationErrors} from "next-safe-action";
import {cookieGenerator} from "@/lib/utils";
import {revalidatePath, revalidateTag} from "next/cache";
import {createCompletionSchema, updateCompletionSchema} from "@/lib/schema";
import {$CourseClassAssignmentCompletionAPI} from "lms-types";

export const createCompletion = actionClient
  .metadata({actionName: 'createCompletion'})
  .schema(createCompletionSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({parsedInput}) => {
    const {assignmentId, classId, courseId, completionStatus} = parsedInput;
    const {userId} = await verifySession();
    try {
      const {refresh_token, access_token} = await verifySession();
      const res = await fetch(env.API_URL + $CourseClassAssignmentCompletionAPI.CreateCompletion.generateUrl(courseId, classId, assignmentId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieGenerator(access_token, refresh_token),
        },
        body: JSON.stringify({userId: Number(userId), completionStatus}),
      });

      const {data, error} = await res.json();

      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/assignments');
      revalidateTag('completions');
      revalidateTag(`assignment-${assignmentId}-completions`);

      return data as $CourseClassAssignmentCompletionAPI.CreateCompletion.Response
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to create completion');
    }
  });

export const updateCompletion = actionClient
  .metadata({actionName: 'updateCompletion'})
  .schema(updateCompletionSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({parsedInput}) => {
    const {completionId, assignmentId, classId, courseId, completionStatus} = parsedInput
    try {
      const {refresh_token, access_token} = await verifySession();
      const res = await fetch(env.API_URL + $CourseClassAssignmentCompletionAPI.UpdateCompletion.generateUrl(courseId, classId, assignmentId, completionId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieGenerator(access_token, refresh_token),
        },
        body: JSON.stringify({completionStatus}),
      });

      const {data, error} = await res.json();

      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/assignments');
      revalidateTag('completions');
      revalidateTag(`assignment-${assignmentId}-completions`);

      return data
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to update completion');
    }
  });
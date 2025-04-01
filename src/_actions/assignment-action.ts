'use server';

import { fetchAction } from '@/lib/fetch';
import {
  $CourseClassAssignmentAPI,
  $PersonalAssignmentAPI,
  $UserAPI as userAPI,
} from 'lms-types';
import { actionClient } from '@/lib/action-client';
import { handleError, PWAError } from '@/lib/error';
import { env } from '@/env';
import { verifySession } from '@/lib/session';
import {
  addAssignmentSchema,
  addPersonalAssignmentSchema,
  deleteAssignmentSchema,
  updateAssignmentSchema,
  updatePersonalAssignmentSchema,
} from '@/lib/schema';
import { flattenValidationErrors } from 'next-safe-action';
import { cookieGenerator } from '@/lib/utils';
import { revalidatePath, revalidateTag } from 'next/cache';

type getUserAssignmentsRT = userAPI.GetUserAssignments.Response['data'];

export const getUserAssignment = fetchAction<getUserAssignmentsRT>(
  '/users/:userId/assignments',
  'Failed to fetch assignments',
  { 
    tags: ['assignments'],
    name: 'getUserAssignment'
  }
);

export const getAssignments = async (courseId: number, classId: number) =>
  await fetchAction<$CourseClassAssignmentAPI.GetAssignments.Response['data']>(
    $CourseClassAssignmentAPI.GetAssignments.generateUrl(courseId, classId),
    'Failed to fetch assignments',
    { 
      tags: ['assignments', `course-${courseId}-assignments`],
      name: 'getAssignments'
    }
  )();

export const createPersonalAssignment = actionClient
  .metadata({ actionName: 'createPersonalAssignment' })
  .schema(addPersonalAssignmentSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { userId } = await verifySession();
    const bodyInput: $PersonalAssignmentAPI.CreateAssignment.Dto = {
      ...parsedInput,
    };
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL +
          $PersonalAssignmentAPI.CreateAssignment.generateUrl(),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieGenerator(access_token, refresh_token),
          },
          body: JSON.stringify(bodyInput),
        }
      );

      const { data, error } = await res.json();

      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/assignments');
      revalidateTag('assignments');

      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to create personal assignment');
    }
  });

export const updateAssignment = actionClient
  .metadata({ actionName: 'updateAssignment' })
  .schema(updateAssignmentSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { userId } = await verifySession();
    const { courseId, assignmentId, classId, ...otherInput } = parsedInput;
    const bodyInput: $CourseClassAssignmentAPI.CreateAssignment.Dto = {
      title: otherInput.title!,
      description: otherInput.description!,
      deadline: otherInput.deadline!,
      submission: otherInput.submission!,
      taskType: otherInput.taskType!,
    };

    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL +
          $CourseClassAssignmentAPI.UpdateAssignment.generateUrl(
            Number(courseId),
            Number(classId),
            Number(assignmentId)
          ),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieGenerator(access_token, refresh_token),
          },
          body: JSON.stringify(bodyInput),
        }
      );

      const { data, error } = await res.json();

      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/assignments');
      revalidateTag('assignments');
      revalidateTag(`course-${courseId}-assignments`);
      revalidateTag(`assignment-${assignmentId}`);

      return data as $CourseClassAssignmentAPI.UpdateAssignment.Response['data'];
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to update assignment');
    }
  });

export const updatePersonalAssignment = actionClient
  .metadata({ actionName: 'updatePersonalAssignment' })
  .schema(updatePersonalAssignmentSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { userId } = await verifySession();
    const { assignmentId, ...otherInput } = parsedInput;
    if (!otherInput.title || !otherInput.description || !otherInput.deadline || !otherInput.submission || !otherInput.taskType) {
      throw new PWAError('Missing required fields');
    }
    const bodyInput: $PersonalAssignmentAPI.CreateAssignment.Dto = {
      title: otherInput.title,
      description: otherInput.description,
      deadline: otherInput.deadline,
      submission: otherInput.submission,
      taskType: otherInput.taskType,
      course: '',
      completionStatus: 'NOT_STARTED'
    };

    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL +
          $PersonalAssignmentAPI.UpdateAssignment.generateUrl(
            Number(assignmentId)
          ),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieGenerator(access_token, refresh_token),
          },
          body: JSON.stringify(bodyInput),
        }
      );

      const { data, error } = await res.json();
      if (!res.ok) {
        return handleError(error);
      }

      revalidatePath('/assignments');
      revalidateTag('assignments');

      return data as $PersonalAssignmentAPI.UpdateAssignment.Response['data'];
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to update assignment');
    }
  });

export const createAssignment = actionClient
  .metadata({ actionName: 'createAssignment' })
  .schema(addAssignmentSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { courseId, classId, ...otherInput } = parsedInput;
    const bodyInput: $CourseClassAssignmentAPI.CreateAssignment.Dto = {
      ...otherInput,
      deadline: new Date(otherInput.deadline),
    };

    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL +
          $CourseClassAssignmentAPI.CreateAssignment.generateUrl(
            Number(courseId),
            Number(classId)
          ),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieGenerator(access_token, refresh_token),
          },
          body: JSON.stringify(bodyInput),
        }
      );

      const { data, error } = await res.json();
      if (error) {
        return handleError(error);
      }

      revalidatePath('/assignments');
      revalidateTag('assignments');

      return data as $CourseClassAssignmentAPI.CreateAssignment.Response['data'];
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to create assignment');
    }
  });

export const deleteAssignment = actionClient
  .metadata({ actionName: 'deleteAssignment' })
  .schema(deleteAssignmentSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    const { courseId, classId, assignmentId } = parsedInput;
    try {
      const { refresh_token, access_token } = await verifySession();
      const res = await fetch(
        env.API_URL +
          $CourseClassAssignmentAPI.DeleteAssignment.generateUrl(
            courseId,
            classId,
            assignmentId
          ),
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
      revalidatePath('/portal/atur-atur/assignments');
      revalidateTag('assignments');
      revalidateTag(`course-${courseId}-assignments`);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to delete assignment');
    }
  });

export const getAssignmentById = async (courseId: number, classId: number, assignmentId: number) =>
  await fetchAction<$CourseClassAssignmentAPI.GetAssignmentById.Response['data']>(
    $CourseClassAssignmentAPI.GetAssignmentById.generateUrl(courseId, classId, assignmentId),
    'Failed to fetch assignment',
    { 
      tags: ['assignments', `assignment-${assignmentId}`],
      name: 'getAssignmentById'
    }
  )();

'use server';

import {fetchAction} from '@/lib/fetch';
import {actionClient} from '@/lib/action-client';
import {flattenValidationErrors} from 'next-safe-action';
import {z} from 'zod';

export type InstructorResponse = {
    userId: number;
    courseId: number;
    classId: number;
    name: string;
    NIM: string;
    createdAt: Date;
}

export const getInstructors = async (courseId: string, classId: string) =>
    await fetchAction<InstructorResponse[]>(
        `/courses/${courseId}/classes/${classId}/instructors`,
        'Failed to fetch instructors',
        {
            tags: ['instructors', `course-${courseId}-classes-${classId}-instructors`],
            name: 'getInstructors',
            cache: 'no-cache'
        }
    )();

export const createInstructor = actionClient
    .metadata({
        actionName: 'createInstructor',
    })
    .schema(z.object({
        courseId: z.number(),
        classId: z.number(),
        userId: z.number(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve),
    })
    .action(async ({parsedInput}) => {
        const {courseId, classId, ...rest} = parsedInput;
        const res = await fetchAction<InstructorResponse>(
            `/courses/${courseId}/classes/${classId}/instructors`,
            'Failed to create instructor',
            {
                method: 'POST',
                bodyObject: rest,
                revalidateTag: `course-${courseId}-classes-${classId}-instructors`
            }
        )();
        return res;
    });

export const deleteInstructor = actionClient
    .metadata({
        actionName: 'deleteInstructor',
    })
    .schema(z.object({
        courseId: z.number(),
        classId: z.number(),
        userId: z.number(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {courseId, classId, userId}}) => {
        const res = await fetchAction(
            `/courses/${courseId}/classes/${classId}/instructors/${userId}`,
            'Failed to delete instructor',
            {
                method: 'DELETE',
                revalidateTag: `course-${courseId}-classes-${classId}-instructors`,
                setContentType: false
            }
        )();
        return res;
    });
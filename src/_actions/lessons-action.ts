'use server';

import {fetchAction} from '@/lib/fetch';
import {actionClient} from '@/lib/action-client';
import {flattenValidationErrors} from 'next-safe-action';
import {z} from 'zod';

export type LessonResponse = {
    lessonId: number;
    courseId: number;
    title: string;
    description?: string;
    numberOfVideos: number;
    numberOfDurations: number;
    numberOfAttachments: number;
    position: number;
    createdAt: Date;
    updatedAt: Date;
    videoPositionVersion: number;
};


export const getLessons = async (courseId: string) =>
    await fetchAction<LessonResponse>(
        `/courses/${courseId}/lessons`,
        'Failed to fetch lessons',
        {
            tags: ['lessons', `course-${courseId}-lessons`],
            name: 'getLessons',
            cache: 'no-cache'
        }
    )();

export const getLessonById = async (courseId: string, lessonId: string) =>
    await fetchAction<LessonResponse>(
        `/courses/${courseId}/lessons/${lessonId}`,
        'Failed to fetch lesson'
    )();

export const createLesson = actionClient
    .metadata({
        actionName: 'createLesson',
    })
    .schema(z.object({
        courseId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        references: z.array(z.string()).optional(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve),
    })
    .action(async ({parsedInput}) => {
        const {courseId, ...rest} = parsedInput;
        const res = await fetchAction<LessonResponse>(
            `/courses/${courseId}/lessons`,
            'Failed to create lesson',
            {
                method: 'POST',
                bodyObject: rest,
                revalidateTag: `course-${courseId}-lessons`
            }
        )();
        return res;
    });

export const updateLesson = actionClient
    .metadata({
        actionName: 'updateLesson',
    })
    .schema(z.object({
        courseId: z.number(),
        lessonId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        references: z.array(z.string()).optional(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, lessonId, ...rest} = parsedInput;
        const res = await fetchAction<Partial<LessonResponse>>(
            `/courses/${courseId}/lessons/${lessonId}`,
            'Failed to update lesson',
            {
                method: 'PATCH',
                bodyObject: rest,
                revalidateTag: `course-${courseId}-lessons`
            }
        )();
        return res;
    });

export const deleteLesson = actionClient
    .metadata({
        actionName: 'deleteLesson',
    })
    .schema(z.object({
        courseId: z.number(),
        lessonId: z.number(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {courseId, lessonId}}) => {
        const res = await fetchAction(
            `/courses/${courseId}/lessons/${lessonId}`,
            'Failed to delete lesson',
            {
                method: 'DELETE',
                revalidateTag: `course-${courseId}-lessons`,
                setContentType: false
            }
        )();
        return res;
    });
'use server';

import {cache} from 'react';
import {fetchAction} from '@/lib/fetch';
import {$CourseAPI as courseAPI, $UserAPI as userAPI, CourseModel,} from 'lms-types';
import {actionClient} from '@/lib/action-client';
import {addCategoryCourseSchema, addCourseSchema, deleteCourseSchema, updateCourseSchema,} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
import {handleError, PWAError} from '@/lib/error';
import {env} from '@/env';
import {verifySession} from '@/lib/session';
import {cookieGenerator} from '@/lib/utils';
import {revalidatePath, revalidateTag} from 'next/cache';

export type CategoryResponse = {
    categoryId: number;
    title: string;
};

export const getEnrolledCourses = fetchAction<CourseModel[]>(
    '/users/enrolled-courses',
    'Failed to fetch courses',
    {cache: 'no-cache'}
);

export const getCourses = fetchAction<courseAPI.GetCourses.Response['data']>(
    courseAPI.GetCourses.generateUrl(),
    'Failed to fetch courses',
    {
        queryParams: {
            limit: 999,
        },
        tags: ['courses'],
        name: 'getCourses',
        cache: 'no-cache',
    }
);
export type CoursesResponse = {
    courseId: number;
    code: string;
    image: string;
    title: string;
    status: 'PUBLISHED' | 'DRAFT';
    description?: string;
    numberOfStudents: number;
    numberOfInstructors: number;
    numberOfClasses: number;
    numberOfAssignments: number;
    numberOfLessons: number;
    numberOfVideos: number;
    numberOfDurations: number;
    numberOfAttachments: number;
    categories: { categoryId: number, title: string }[];
    createdAt: Date;
    updatedAt: Date;
    lessonPositionVersion: number;
}

export const getCourseById = async (courseId: number) =>
    await fetchAction<CoursesResponse>(
        `/courses/${courseId}`,
        'Failed to fetch course',
        {
            tags: ['courses', `course-${courseId}`],
            cache: 'no-cache',
        }
    )();

export const getVideoData = cache(async (videoId: string) => {
    const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        {cache: 'force-cache'}
    );

    if (!res.ok) {
        throw new PWAError('YouTube video not found!');
    }

    return res.json();
});

export const getVideoDuration = cache(async (videoId: string) => {
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${env.YOUTUBE_API_SECRET_KEY}`,
        {cache: 'force-cache'}
    );

    if (!res.ok) {
        throw new PWAError('YouTube video not found!');
    }

    const body = await res.json();

    if (body.items.length === 0) {
        throw new PWAError('YouTube video not found!');
    }

    const durationString = body.items[0].contentDetails.duration;

    const hour = durationString.match(/PT(\d+)H/)
        ? Number(durationString.match(/PT(\d+)H/)?.[1])
        : 0;
    const minute = durationString.match(/(\d+)M/)
        ? Number(durationString.match(/(\d+)M/)?.[1])
        : 0;
    const second = durationString.match(/(\d+)S/)
        ? Number(durationString.match(/(\d+)S/)?.[1])
        : 0;

    return hour * 3600 + minute * 60 + second;
});

export const deleteCourse = actionClient
    .metadata({
        actionName: 'deleteCourse',
    })
    .schema(deleteCourseSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {courseId}}) => {
        const res = await fetchAction(
            `/courses/${courseId}`,
            'Failed to delete course',
            {
                method: 'DELETE',
                setContentType: false
            }
        )();
        return res;
    });

export const createCourse = actionClient
    .metadata({
        actionName: 'createCourse',
    })
    .schema(addCourseSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {categoryId, ...rest} = parsedInput;
        const res = await fetchAction<courseAPI.CreateCourse.Response['data']>(
            courseAPI.CreateCourse.generateUrl(),
            'Failed to create course',
            {
                method: 'POST',
                bodyObject: {
                    ...rest,
                    categoryId: !!categoryId ? Number(categoryId) : undefined,
                },
                revalidateTag: 'courses',
            }
        )();
        return res;
    });

export const getMe = fetchAction<userAPI.GetMe.Response['data']>(
    userAPI.GetMe.generateUrl(),
    'Failed to fetch current user',
    {
        tags: ['me'],
        name: 'getMe',
    }
);

export const updateCourse = actionClient
    .metadata({
        actionName: 'updateCourse',
    })
    .schema(updateCourseSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, code, status, categoryId, ...rest} = parsedInput;

        // Update basic course info
        const courseRes = await fetchAction<
            courseAPI.UpdateCourse.Response['data']
        >(courseAPI.UpdateCourse.generateUrl(courseId), 'Failed to update course', {
            method: 'PATCH',
            bodyObject: rest,
            revalidateTag: 'courses',
        })();

        return courseRes;
    });

export const addCategoryCourse = actionClient
    .metadata({
        actionName: 'addCategoryCourse',
    })
    .schema(addCategoryCourseSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                `${env.API_URL}/courses/${parsedInput.courseId}/add-category`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                    body: JSON.stringify({categoryId: parsedInput.categoryId}),
                }
            );

            if (!res.ok) {
                const {error} = await res.json();
                return handleError(error);
            }

            // Invalidate caches
            revalidatePath('/portal/atur-atur/courses');
            revalidatePath(`/portal/admin/courses/edit/${parsedInput.categoryId}`);
            revalidateTag('tags');
            revalidateTag(`scholarship-${parsedInput.categoryId}`);

            return;
        } catch (err) {
            if (err instanceof Error) throw new PWAError(err.message);
            throw new PWAError('Failed to add category to courses');
        }
    });

export const deleteCategoryCourse = actionClient
    .metadata({
        actionName: 'deleteCategoryCourse',
    })
    .schema(addCategoryCourseSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                `${env.API_URL}/courses/${parsedInput.courseId}/remove-category/${parsedInput.categoryId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                    body: JSON.stringify({categoryId: parsedInput.categoryId}),
                }
            );

            if (!res.ok) {
                const {error} = await res.json();
                return handleError(error);
            }

            revalidatePath('/portal/atur-atur/courses');
            revalidatePath(`/portal/admin/courses/edit/${parsedInput.categoryId}`);
            revalidateTag('tags');
            revalidateTag(`scholarship-${parsedInput.categoryId}`);

            return {}
        } catch (err) {
            if (err instanceof Error) throw new PWAError(err.message);
            throw new PWAError('Failed to remove category from courses');
        }
    });

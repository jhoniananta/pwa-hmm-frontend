'use server';

import {cache} from 'react';
import {fetchAction} from '@/lib/fetch';
import {$CourseAPI as courseAPI, $UserAPI as userAPI, CourseModel,} from 'lms-types';
import {actionClient} from '@/lib/action-client';
import {addCourseSchema, deleteCourseSchema, updateCourseSchema} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
import {PWAError} from "@/lib/error";
import {env} from "@/env";


export const getEnrolledCourses = fetchAction<
    CourseModel[]
>(
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
        cache: 'no-cache'
    }
);

export const getCourseById = async (courseId: string) =>
    await fetchAction<courseAPI.GetCourseById.Response['data']>(
        courseAPI.GetCourseById.generateUrl(Number(courseId)),
        'Failed to fetch course'
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

    const hour = durationString.match(/PT(\d+)H/) ? Number(durationString.match(/PT(\d+)H/)?.[1]) : 0;
    const minute = durationString.match(/(\d+)M/) ? Number(durationString.match(/(\d+)M/)?.[1]) : 0;
    const second = durationString.match(/(\d+)S/) ? Number(durationString.match(/(\d+)S/)?.[1]) : 0;

    return hour * 3600 + minute * 60 + second
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
        const res = await fetchAction<void>(
            courseAPI.DeleteCourse.generateUrl(courseId),
            'Failed to delete course'
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
                bodyObject: {...rest, categoryId: !!categoryId ? Number(categoryId) : undefined},
                revalidateTag: 'courses'
            }
        )();
        return res;
    });

export const getMe = fetchAction<userAPI.GetMe.Response['data']>(
    userAPI.GetMe.generateUrl(),
    'Failed to fetch current user',
    {
        tags: ['me'],
        name: 'getMe'
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
        const courseRes = await fetchAction<courseAPI.UpdateCourse.Response['data']>(
            courseAPI.UpdateCourse.generateUrl(courseId),
            'Failed to update course',
            {
                method: 'PATCH',
                bodyObject: rest,
                revalidateTag: 'courses'
            }
        )();

        return courseRes;
    });

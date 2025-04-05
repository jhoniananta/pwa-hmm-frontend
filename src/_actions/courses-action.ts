'use server';

import {cache} from 'react';
import {fetchAction} from '@/lib/fetch';
import {
    $UserAPI as userAPI,
    $CourseAPI as courseAPI,
    $CourseLessonVideoAPI as videoAPI, CourseModel,
} from 'lms-types';
import {actionClient} from '@/lib/action-client';
import {addCourseSchema, deleteCourseSchema, updateCourseSchema} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
import {z} from 'zod';
import {getLessons as getLessonsAction} from './lessons-action';


export const getEnrolledCourses = fetchAction<
    CourseModel[]
>(
    '/users/enrolled-courses',
    'Failed to fetch courses'
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
    }
);

export const getCourseById = async (courseId: string) =>
    await fetchAction<courseAPI.GetCourseById.Response['data']>(
        courseAPI.GetCourseById.generateUrl(Number(courseId)),
        'Failed to fetch course'
    )();

export const getLessons = getLessonsAction;

export const getVideos = async (
    courseId: string | number,
    lessonId: string | number
) =>
    await fetchAction<videoAPI.GetVideos.Response['data']>(
        videoAPI.GetVideos.generateUrl(Number(courseId), Number(lessonId)),
        'Failed to fetch videos'
    )();

export const getVideoData = cache(async (videoId: string) => {
    const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        {cache: 'force-cache'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch video data');
    }

    return res.json();
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

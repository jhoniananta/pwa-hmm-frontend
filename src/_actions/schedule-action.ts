'use server';

import {fetchAction} from '@/lib/fetch';
import {$CourseScheduleAPI} from 'lms-types';
import {actionClient} from '@/lib/action-client';
import {createScheduleSchema, deleteScheduleSchema, updateScheduleSchema} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
import {verifySession} from '@/lib/session';
import {env} from '@/env';
import {handleError, PWAError} from '@/lib/error';
import {cookieGenerator} from '@/lib/utils';
import {revalidatePath, revalidateTag} from 'next/cache';
import getVerboseStatus from "@/lib/getVerboseStatus";


export type  UserScheduleResponse = {
    scheduleId: number;

    userId: number;

    title: string;

    description: string;

    location: string;

    startDate: Date;

    endDate: Date;
}


export const getUserSchedules = async () =>
    await fetchAction<UserScheduleResponse[]>(
        '/user-schedules',
        'Failed to fetch user schedules',
        {tags: ['user-schedules', `user-schedules`]}
    )();

export const getSchedules = async (courseId: number) =>
    await fetchAction<$CourseScheduleAPI.GetSchedules.Response['data']>(
        $CourseScheduleAPI.GetSchedules.generateUrl(courseId),
        'Failed to fetch schedules',
        {tags: ['schedules', `course-${courseId}-schedules`]}
    )();

export const getScheduleById = async (courseId: number, scheduleId: number) =>
    await fetchAction<$CourseScheduleAPI.GetScheduleById.Response['data']>(
        $CourseScheduleAPI.GetScheduleById.generateUrl(courseId, scheduleId),
        'Failed to fetch schedule',
        {tags: ['schedules', `schedule-${scheduleId}`]}
    )();

export const createSchedule = actionClient
    .metadata({actionName: 'createSchedule'})
    .schema(createScheduleSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {courseId, ...rest} = parsedInput;
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL + $CourseScheduleAPI.CreateSchedule.generateUrl(courseId),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                    body: JSON.stringify(rest),
                }
            );

            const {data, error} = await res.json();
            if (!res.ok) {
                return handleError(error);
            }

            revalidatePath('/courses/[id]');
            revalidateTag('schedules');
            revalidateTag(`course-${courseId}-schedules`);
            return data as $CourseScheduleAPI.CreateSchedule.Response['data'];
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to create schedule');
        }
    });

export const updateSchedule = actionClient
    .metadata({actionName: 'updateSchedule'})
    .schema(updateScheduleSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {courseId, scheduleId, ...rest} = parsedInput;
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL + $CourseScheduleAPI.UpdateSchedule.generateUrl(courseId, scheduleId),
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                    body: JSON.stringify(rest),
                }
            );

            const {data, error} = await res.json();
            if (!res.ok) {
                return handleError(error);
            }

            revalidatePath('/courses/[id]');
            revalidateTag('schedules');
            revalidateTag(`course-${courseId}-schedules`);
            revalidateTag(`schedule-${scheduleId}`);
            return data as $CourseScheduleAPI.UpdateSchedule.Response['data'];
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to update schedule');
        }
    });

export const deleteSchedule = actionClient
    .metadata({actionName: 'deleteSchedule'})
    .schema(deleteScheduleSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        try {
            const {courseId, scheduleId} = parsedInput;
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL + $CourseScheduleAPI.DeleteSchedule.generateUrl(courseId, scheduleId),
                {
                    method: 'DELETE',
                    headers: {
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                }
            );

            const {data, error} = await res.json();
            if (!res.ok) {
                return handleError(error);
            }

            revalidatePath('/courses/[id]');
            revalidateTag('schedules');
            revalidateTag(`course-${courseId}-schedules`);
            return data;
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to delete schedule');
        }
    });

// Helper function to get all schedules for enrolled courses
export const getAllUserSchedules = async () => {
    try {
        const isVerbose = getVerboseStatus();

        const userSchedules = await getUserSchedules();

        // return schedules.flat().sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) =>
        //   new Date(a.date).getTime() - new Date(b.date).getTime()
        // );
        return userSchedules
    } catch (error) {
        console.error('Failed to fetch all schedules:', error);
        return [];
    }
}; 
'use server';

import {fetchAction} from '@/lib/fetch';
import {actionClient} from '@/lib/action-client';
import {createScheduleSchema, deleteScheduleSchema, updateScheduleSchema} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
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

export type CourseScheduleResponse = {
    scheduleId: number;
    courseId: number;
    title: string;
    description?: string;
    location: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt?: Date;
}

export const getUserSchedules = async () =>
    await fetchAction<UserScheduleResponse[]>(
        '/user-schedules',
        'Failed to fetch user schedules',
        {tags: ['user-schedules', `user-schedules`]}
    )();

export const getCourseSchedules = async (courseId: string) =>
    await fetchAction<CourseScheduleResponse[]>(
        `/courses/${courseId}/schedules`,
        'Failed to fetch schedules',
        {tags: ['course-schedules', `course-${courseId}-schedules`]}
    )();

export const getCourseScheduleById = async (courseId: string, scheduleId: string) =>
    await fetchAction<CourseScheduleResponse>(
        `/courses/${courseId}/schedules/${scheduleId}`,
        'Failed to fetch schedule',
        {tags: ['course-schedule', `courses-${courseId}-schedules-${scheduleId}`]}
    )();

export const createCourseSchedule = actionClient
    .metadata({actionName: 'createCourseSchedule'})
    .schema(createScheduleSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, ...rest} = parsedInput;
        const res = await fetchAction<CourseScheduleResponse>(
            `/courses/${courseId}/schedules`,
            'Failed to create schedule',
            {
                method: 'POST',
                bodyObject: rest,
                revalidateTag: `courses-${courseId}-schedules`
            }
        )();
        return res;
    });

export const updateCourseSchedule = actionClient
    .metadata({actionName: 'updateCourseSchedule'})
    .schema(updateScheduleSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, scheduleId, ...rest} = parsedInput;
        const res = await fetchAction<Partial<CourseScheduleResponse>>(
            `/courses/${courseId}/schedules/${scheduleId}`,
            'Failed to update schedule',
            {
                method: 'PATCH',
                bodyObject: rest,
                revalidateTag: `courses-${courseId}-schedules`
            }
        )();
        return res;
        // revalidatePath('/courses/[id]');
        // revalidateTag('schedules');
        // revalidateTag(`course-${courseId}-schedules`);
        // revalidateTag(`schedule-${scheduleId}`);
        //
    });

export const deleteCourseSchedule = actionClient
    .metadata({actionName: 'deleteCourseSchedule'})
    .schema(deleteScheduleSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {courseId, scheduleId}}) => {
        const res = await fetchAction(
            `/courses/${courseId}/schedules/${scheduleId}`,
            'Failed to delete schedule',
            {
                method: 'DELETE',
                revalidateTag: `courses-${courseId}-schedules`,
                setContentType: false
            }
        )();
        return res;
        //
        // revalidatePath('/courses/[id]');
        // revalidateTag('schedules');
        // revalidateTag(`course-${courseId}-schedules`);
    });

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

export const getUpcomingUserSchedules = async () => {
    try {
        const userSchedules = await fetchAction<UserScheduleResponse[]>(
            '/user-schedules/upcoming',
            'Failed to fetch user schedules',
            {tags: ['user-schedules', `user-schedules`]}
        )();

        // return schedules.flat().sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) =>
        //   new Date(a.date).getTime() - new Date(b.date).getTime()
        // );
        return userSchedules
    } catch (error) {
        console.error('Failed to fetch all schedules:', error);
        return [];
    }
};
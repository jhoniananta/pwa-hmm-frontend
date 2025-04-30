'use server';

import {fetchAction} from '@/lib/fetch';
import {actionClient} from '@/lib/action-client';
import {flattenValidationErrors} from 'next-safe-action';
import {z} from 'zod';
import {AssignmentTaskType} from "@/_actions/enum/action-enum";

export type ClassAssignmentResponse = {
    assignmentId: number;
    courseId: number;
    classId: number;
    title: string;
    submission: string;
    deadline: Date;
    description: string;
    taskType: AssignmentTaskType;
    createdAt: Date;
    updatedAt: Date;
}


export const getClassAssignments = async (courseId: string, classId: string) =>
    await fetchAction<ClassAssignmentResponse[]>(
        `/courses/${courseId}/classes/${classId}/assignments`,
        'Failed to fetch class assignments',
        {
            tags: ['assignments', `course-${courseId}-classses-${classId}-assignments`],
            name: 'getClassAssignments',
            cache: 'no-cache'
        }
    )();

export const getClassAssignmentById = async (courseId: string, classId: string, assignmentId: string) =>
    await fetchAction<ClassAssignmentResponse>(
        `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`,
        'Failed to fetch class assignment'
    )();

export const createClassAssignment = actionClient
    .metadata({
        actionName: 'createClassAssignment',
    })
    .schema(z.object({
        courseId: z.number(),
        classId: z.number(),
        title: z.string().max(128, {message: 'The title must be at most 128 characters!'}),
        submission: z.string(),
        deadline: z.string().datetime({message: 'Invalid date format'}),
        description: z.string().max(2048, {message: 'The description must be at most 2048 characters!'}),
        taskType: z.enum([AssignmentTaskType.PERSONAL_TASK, AssignmentTaskType.GROUP_TASK], {message: 'Invalid task type'}),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve),
    })
    .action(async ({parsedInput}) => {
        const {courseId, classId, ...rest} = parsedInput;
        const res = await fetchAction<ClassAssignmentResponse>(
            `/courses/${courseId}/classes/${classId}/assignments`,
            'Failed to create class assignment',
            {
                method: 'POST',
                bodyObject: rest,
                revalidateTag: `course-${courseId}-classes-${classId}-assignments`,
            }
        )();
        return res;
    });

export const updateClassAssignment = actionClient
    .metadata({
        actionName: 'updateClassAssignment',
    })
    .schema(z.object({
        courseId: z.number(),
        classId: z.number(),
        assignmentId: z.number(),
        title: z.string().max(128, {message: 'The title must be at most 128 characters!'}).optional(),
        submission: z.string().optional(),
        deadline: z.string().datetime({message: 'Invalid date format'}).optional(),
        description: z.string().max(2048, {message: 'The description must be at most 2048 characters!'}).optional(),
        taskType: z.enum([AssignmentTaskType.PERSONAL_TASK, AssignmentTaskType.GROUP_TASK], {message: 'Invalid task type'}).optional(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, classId, assignmentId, ...rest} = parsedInput;
        const res = await fetchAction<Partial<ClassAssignmentResponse>>(
            `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`,
            'Failed to update class asssignment',
            {
                method: 'PATCH',
                bodyObject: rest,
                revalidateTag: `course-${courseId}-classes-${classId}-assignments`,
            }
        )();
        return res;
    });

export const deleteClassAssignment = actionClient
    .metadata({
        actionName: 'deleteClassAssignment',
    })
    .schema(z.object({
        courseId: z.number(),
        classId: z.number(),
        assignmentId: z.number(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {courseId, classId, assignmentId}}) => {
        const res = await fetchAction(
            `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`,
            'Failed to delete class assignment',
            {
                method: 'DELETE',
                revalidateTag: `course-${courseId}-classes-${classId}-assignments`,
                setContentType: false
            }
        )();
        return res;
    });
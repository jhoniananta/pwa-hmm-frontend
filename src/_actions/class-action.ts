'use server';

import {fetchAction} from "@/lib/fetch";
import {actionClient} from "@/lib/action-client";
import {addClassSchema, updateClassSchema, deleteClassSchema} from "@/lib/schema";
import {flattenValidationErrors} from "next-safe-action";


export type ClassResponse = {
    classId: number;
    courseId: number;
    title: string;
    numberOfInstructors: number;
    numberOfAssignments: number;
    createdAt: Date;
    updatedAt: Date;
}

export const getClasses = async (courseId: number) =>
    await fetchAction<ClassResponse[]>(
        `/courses/${courseId}/classes`,
        'Failed to fetch classes',
        {tags: ['classes', `course-${courseId}-classes`]}
    )();

export const getClassById = async (courseId: number, classId: number) =>
    await fetchAction<ClassResponse>(
        `/courses/${courseId}/classes/${classId}`,
        'Failed to fetch class',
        {tags: ['classes', `class-${classId}`]}
    )();

export const createClass = actionClient
    .metadata({actionName: 'createClass'})
    .schema(addClassSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, ...rest} = parsedInput;
        const res = await fetchAction<ClassResponse>(
            `/courses/${courseId}/classes`,
            'Failed to create class',
            {
                method: 'POST',
                bodyObject: rest,
                revalidateTag: `course-${courseId}-classes`
            }
        )();
        return res;
    });

export const updateClass = actionClient
    .metadata({actionName: 'updateClass'})
    .schema(updateClassSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, classId, ...rest} = parsedInput;
        const res = await fetchAction<Partial<ClassResponse>>(
            `/courses/${courseId}/classes/${classId}`,
            'Failed to update class',
            {
                method: 'PATCH',
                bodyObject: rest,
                revalidateTag: `course-${courseId}-classes`
            }
        )();
        return res;

        // revalidatePath('/classes');
        // revalidateTag('classes');
        // revalidateTag(`course-${courseId}-classes`);
        // revalidateTag(`class-${classId}`);

    });

export const deleteClass = actionClient
    .metadata({actionName: 'deleteClass'})
    .schema(deleteClassSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {courseId, classId}}) => {
        const res = await fetchAction(
            `/courses/${courseId}/classes/${classId}`,
            'Failed to delete class',
            {
                method: 'DELETE',
                revalidateTag: `course-${courseId}-classes`,
                setContentType: false
            }
        )();
        return res;
        //
        // revalidatePath('/classes');
        // revalidateTag('classes');
        // revalidateTag(`course-${courseId}-classes`);

    });
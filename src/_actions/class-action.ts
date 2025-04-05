'use server';

import {fetchAction} from "@/lib/fetch";
import {$CourseClassAPI} from "lms-types";
import {actionClient} from "@/lib/action-client";
import {handleError, PWAError} from "@/lib/error";
import {env} from "@/env";
import {verifySession} from "@/lib/session";
import {addClassSchema, updateClassSchema, deleteClassSchema} from "@/lib/schema";
import {flattenValidationErrors} from "next-safe-action";
import {cookieGenerator} from "@/lib/utils";
import {revalidatePath, revalidateTag} from "next/cache";

export const getClasses = async (courseId: number) =>
    await fetchAction<$CourseClassAPI.GetClasses.Response['data']>(
        $CourseClassAPI.GetClasses.generateUrl(courseId),
        'Failed to fetch classes',
        {tags: ['classes', `course-${courseId}-classes`]}
    )();

export const getClassById = async (courseId: number, classId: number) =>
    await fetchAction<$CourseClassAPI.GetClassById.Response['data']>(
        $CourseClassAPI.GetClassById.generateUrl(courseId, classId),
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
        const {courseId, ...classData} = parsedInput;
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL + $CourseClassAPI.CreateClass.generateUrl(courseId),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                    body: JSON.stringify(classData),
                }
            );

            const {data, error} = await res.json();
            if (!res.ok) {
                return handleError(error);
            }

            revalidateTag('classes');
            return data;
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message, err);
            }
            throw new PWAError('Failed to create class', err);
        }
    });

export const updateClass = actionClient
    .metadata({actionName: 'updateClass'})
    .schema(updateClassSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, classId, ...updateData} = parsedInput;
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL +
                $CourseClassAPI.UpdateClass.generateUrl(courseId, classId),
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: cookieGenerator(access_token, refresh_token),
                    },
                    body: JSON.stringify(updateData),
                }
            );

            const {data, error} = await res.json();
            if (!res.ok) {
                return handleError(error);
            }

            revalidatePath('/classes');
            revalidateTag('classes');
            revalidateTag(`course-${courseId}-classes`);
            revalidateTag(`class-${classId}`);
            return data;
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message, err);
            }
            throw new PWAError('Failed to update class', err);
        }
    });

export const deleteClass = actionClient
    .metadata({actionName: 'deleteClass'})
    .schema(deleteClassSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, classId} = parsedInput;
        try {
            const {refresh_token, access_token} = await verifySession();
            const res = await fetch(
                env.API_URL +
                $CourseClassAPI.DeleteClass.generateUrl(courseId, classId),
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

            revalidatePath('/classes');
            revalidateTag('classes');
            revalidateTag(`course-${courseId}-classes`);
            return data;
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message, err);
            }
            throw new PWAError('Failed to delete class', err);
        }
    });
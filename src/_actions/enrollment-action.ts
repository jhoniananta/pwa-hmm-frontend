'use server';


import {actionClient} from '@/lib/action-client';
import {createEnrollmentSchema} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
import {fetchAction} from "@/lib/fetch";

export type  EnrollmentResponse = {
    userId: number;
    courseId: number;
    classId: number;
    createdAt: Date;
}

export const createEnrollment = actionClient
    .metadata({actionName: 'createEnrollment'})
    .schema(createEnrollmentSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, classId} = parsedInput
        const res = await fetchAction<EnrollmentResponse>(
            `/courses/${courseId}/classes/${classId}/enrollments`,
            'Failed to create enrollment',
            {
                method: 'POST',
                setContentType: false
            }
        )();
        return res;
    });

export const deleteEnrollment = actionClient
    .metadata({actionName: 'deleteEnrollment'})
    .schema(createEnrollmentSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, classId} = parsedInput
        const res = await fetchAction<EnrollmentResponse>(
            `/courses/${courseId}/classes/${classId}/enrollments`,
            'Failed to delete enrollment',
            {
                method: 'DELETE',
                setContentType: false
            }
        )();
        return res;
    });



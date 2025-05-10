'use server';

import {actionClient} from '@/lib/action-client';
import {createEnrollmentSchema} from '@/lib/schema';
import {flattenValidationErrors} from 'next-safe-action';
import {verifySession} from '@/lib/session';
import {fetchAction} from "@/lib/fetch";
import {LessonResponse} from "@/_actions/lessons-action";

export const createEnrollment = actionClient
    .metadata({actionName: 'createEnrollment'})
    .schema(createEnrollmentSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {refresh_token, access_token} = await verifySession();
        const {courseId, classId} = parsedInput
        const res = await fetchAction<LessonResponse>(
            `/courses/${courseId}/classes/${classId}/enrollments`,
            'Failed to create enrollment',
            {
                method: 'POST',
                setContentType: false
            }
        )();
        return res;
    });
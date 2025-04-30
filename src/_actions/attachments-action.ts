'use server';

import {fetchAction} from '@/lib/fetch';
import {actionClient} from '@/lib/action-client';
import {flattenValidationErrors} from 'next-safe-action';
import {z} from 'zod';
import {addAttachmentSchema} from "@/_actions/schema/attachment-schema";

export type  AttachmentResponse = {
    attachmentId: number;
    courseId: number;
    lessonId: number;
    name: string;
    description?: string;
    file: string;
    createdAt: Date;
    updatedAt?: Date;
}

export const getAttachments = async (courseId: string, lessonId: string) =>
    await fetchAction<AttachmentResponse[]>(
        `/courses/${courseId}/lessons/${lessonId}/attachments`,
        'Failed to fetch attachments',
        {
            tags: ['attachments', `courses-${courseId}-lessons-${lessonId}-attachments`],
            name: 'getAttachments',
            cache: 'no-cache'
        }
    )();

export const getAttachmentById = async (courseId: string, lessonId: string, attachmentId: string) =>
    await fetchAction<AttachmentResponse>(
        `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`,
        'Failed to fetch attachment'
    )();

export const createAttachment = actionClient
    .metadata({
        actionName: 'createAttachment',
    })
    .schema(addAttachmentSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve),
    })
    .action(async ({parsedInput}) => {
        const {courseId, lessonId, ...rest} = parsedInput;
        const res = await fetchAction<AttachmentResponse>(
            `/courses/${courseId}/lessons/${lessonId}/attachments`,
            'Failed to create attachment',
            {
                method: 'POST',
                bodyObject: rest,
                revalidateTag: `courses-${courseId}-lessons-${lessonId}-attachments`
            }
        )();
        return res;
    });

export const updateAttachment = actionClient
    .metadata({
        actionName: 'updateAttachment',
    })
    .schema(z.object({
        courseId: z.number(),
        lessonId: z.number(),
        attachmentId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, lessonId, attachmentId, ...rest} = parsedInput;
        const res = await fetchAction<Partial<AttachmentResponse>>(
            `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`,
            'Failed to update attachment',
            {
                method: 'PATCH',
                bodyObject: rest,
                revalidateTag: `courses-${courseId}-lessons-${lessonId}-attachments`
            }
        )();
        return res;
    });

export const deleteAttachment = actionClient
    .metadata({
        actionName: 'deleteAttachment',
    })
    .schema(z.object({
        courseId: z.number(),
        lessonId: z.number(),
        attachmentId: z.number()
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {courseId, lessonId, attachmentId}}) => {
        const res = await fetchAction(
            `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`,
            'Failed to delete attachment',
            {
                method: 'DELETE',
                revalidateTag: `courses-${courseId}-lessons-${lessonId}-attachments-${attachmentId}`,
                setContentType: false
            }
        )();
        return res;
    });
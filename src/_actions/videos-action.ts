'use server';

import {fetchAction} from '@/lib/fetch';
import {actionClient} from '@/lib/action-client';
import {flattenValidationErrors} from 'next-safe-action';
import {z} from 'zod';
import {getVideoDuration} from "@/_actions/courses-action";

export type  VideoResponse = {
    videoId: number;
    courseId: number;
    lessonId: number;
    title: string;
    description?: string;
    durationInSec: number;
    youtubeLink: string;
    createdAt: Date;
    updatedAt?: Date;
}


export const getVideos = async (courseId: string, lessonId: string) =>
    await fetchAction<VideoResponse[]>(
        `/courses/${courseId}/lessons/${lessonId}/videos`,
        'Failed to fetch videos',
        {
            tags: ['videos', `courses-${courseId}-lessons-${lessonId}-videos`],
            name: 'getVideos',
            cache: 'no-cache'
        }
    )();

export const getVideoById = async (courseId: string, lessonId: string, videoId: string) =>
    await fetchAction<VideoResponse>(
        `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`,
        'Failed to fetch video'
    )();

export const createVideo = actionClient
    .metadata({
        actionName: 'createVideo',
    })
    .schema(z.object({
        courseId: z.number(),
        lessonId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        youtubeLink: z.string(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve),
    })
    .action(async ({parsedInput}) => {
        const {courseId, lessonId, ...rest} = parsedInput;

        const durationInSec = await getVideoDuration(rest.youtubeLink);
        const res = await fetchAction<VideoResponse>(
            `/courses/${courseId}/lessons/${lessonId}/videos`,
            'Failed to create video',
            {
                method: 'POST',
                bodyObject: {...rest, durationInSec},
                revalidateTag: `courses-${courseId}-lessons-${lessonId}-videos`
            }
        )();
        return res;
    });

export const updateVideo = actionClient
    .metadata({
        actionName: 'updateVideo',
    })
    .schema(z.object({
        courseId: z.number(),
        lessonId: z.number(),
        videoId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        youtubeLink: z.string().optional(),
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput}) => {
        const {courseId, lessonId, videoId, ...rest} = parsedInput;

        let durationInSec: number | undefined;
        if (rest.youtubeLink) {
            durationInSec = await getVideoDuration(rest.youtubeLink);
        }

        const res = await fetchAction<Partial<VideoResponse>>(
            `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`,
            'Failed to update video',
            {
                method: 'PATCH',
                bodyObject: {...rest, ...(durationInSec ? {durationInSec} : {})},
                revalidateTag: `courses-${courseId}-lessons-${lessonId}-videos`
            }
        )();
        return res;
    });

export const deleteVideo = actionClient
    .metadata({
        actionName: 'deleteVideo',
    })
    .schema(z.object({
        courseId: z.number(),
        lessonId: z.number(),
        videoId: z.number()
    }), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {courseId, lessonId, videoId}}) => {
        const res = await fetchAction(
            `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`,
            'Failed to delete video',
            {
                method: 'DELETE',
                revalidateTag: `courses-${courseId}-lessons-${lessonId}-videos-${videoId}`,
                setContentType: false
            }
        )();
        return res;
    });
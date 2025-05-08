'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import React, {useState} from 'react';
import {getVideoId} from "@/_actions/utils/utils";
import validationErrorToString from "@/lib/validationErrorToString";
import {updateVideo, VideoResponse} from "@/_actions/videos-action";

interface EditVideoFormProps {
    video: VideoResponse;
    courseId: string;
    lessonId: string;
    videoId: string;
}

export default function EditVideoForm({
                                          video,
                                          courseId,
                                          lessonId,
                                          videoId
                                      }: EditVideoFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description ?? '');
    const [youtubeLink, setYoutubeLink] = useState(`https://www.youtube.com/watch?v=${video.youtubeLink}`);

    const {execute: executeUpdate, status} = useAction(updateVideo, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Video updated successfully');
            router.push(`/portal/admin/courses/${courseId}/lessons/${lessonId}/videos`);
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to update video');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = getVideoId(youtubeLink)
        if (response.errorMessage) {
            toast.error(response.errorMessage);
            return;
        }

        executeUpdate({
            courseId: Number(courseId),
            lessonId: Number(lessonId),
            videoId: Number(videoId),
            title,
            description,
            youtubeLink: response.videoId as string,
        });
    };

    return (
        <form onSubmit={onSubmit} className='space-y-6'>
            <div className='space-y-2'>
                <label htmlFor='title' className='text-sm font-medium'>
                    Title
                </label>
                <Input
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Enter video title'
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='description' className='text-sm font-medium'>
                    Description
                </label>
                <Textarea
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Enter video description'
                    rows={5}
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='youtubeLink' className='text-sm font-medium'>
                    YouTube Link
                </label>
                <Input
                    id='title'
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder='Enter youtube link (e.g: https://www.youtube.com/watch?v=aircAruvnKk) - must contains "v=..."'
                />
            </div>

            <Button
                type='submit'
                disabled={status === 'executing'}
                className={cn(
                    'bg-navy hover:bg-navy/80',
                    status === 'executing' && 'opacity-50 cursor-not-allowed'
                )}
            >
                Update
            </Button>
        </form>
    );
} 
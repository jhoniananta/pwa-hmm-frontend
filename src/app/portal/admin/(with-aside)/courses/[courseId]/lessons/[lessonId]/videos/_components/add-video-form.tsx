'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import React, {useState} from 'react';
import validationErrorToString from "@/lib/validationErrorToString";
import {createVideo} from "@/_actions/videos-action";
import {getVideoId} from "@/_actions/utils/utils";
import {PWAError} from "@/lib/error";

interface AddVideoFormProps {
    courseId: string;
    lessonId: string;
}

export default function AddVideoForm({courseId, lessonId}: AddVideoFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');

    const {execute: executeCreate, status} = useAction(createVideo, {
        onSuccess: () => {
            toast.success('Video created successfully');
            router.push(`/portal/admin/courses/${courseId}/lessons/${lessonId}/videos`);
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to create class video');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title) {
            toast.error('Title is required');
            return;
        }
        if (!youtubeLink) {
            toast.error('Video Id is required');
            return;
        }

        let videoId: string = ''
        try {
            videoId = getVideoId(youtubeLink)
        } catch (error) {
            if (error instanceof PWAError) {
                toast.error(error.message);
                return;
            }
            toast.error(new PWAError().message)
            return;
        }

        executeCreate({
            courseId: Number(courseId),
            lessonId: Number(lessonId),
            title,
            description,
            youtubeLink: videoId,
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
                Create
            </Button>
        </form>
    );
} 
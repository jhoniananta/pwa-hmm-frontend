'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {createLesson} from '@/_actions/lessons-action';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {useState} from 'react';

interface AddLessonFormProps {
    courseId: string;
}

export default function AddLessonForm({courseId}: AddLessonFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const {execute: executeCreate, status} = useAction(createLesson, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Lesson created successfully');
            router.push(`/portal/admin/courses/${courseId}/lessons`);
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.error.fetchError || 'Failed to create lesson');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title) {
            toast.error('Title is required');
            return;
        }

        executeCreate({
            courseId: Number(courseId),
            title,
            description,
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
                    placeholder='Enter lesson title'
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
                    placeholder='Enter lesson description'
                    rows={5}
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
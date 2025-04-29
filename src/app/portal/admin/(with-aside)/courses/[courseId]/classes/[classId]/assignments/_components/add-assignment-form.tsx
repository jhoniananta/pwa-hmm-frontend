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
import {createClassAssignment} from "@/_actions/class-assignment-action";

interface AddAssignmentFormProps {
    courseId: string;
    classId: string;
}

export default function AddAssignmentForm({courseId, classId}: AddAssignmentFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [submission, setSubmission] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    const [taskType, setTaskType] = useState('');

    const {execute: executeCreate, status} = useAction(createClassAssignment, {
        onSuccess: () => {
            toast.success('Assignment created successfully');
            router.push(`/portal/admin/courses/${courseId}/classes/${classId}/assignments`);
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.error.fetchError || 'Failed to create class assignment');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title) {
            toast.error('Title is required');
            return;
        }
        if (!submission) {
            toast.error('Submission is required');
            return;
        }
        if (!deadline) {
            toast.error('Deadline is required');
            return;
        }
        if (!description) {
            toast.error('Description is required');
            return;
        }
        if (!taskType) {
            toast.error('Task type is required');
            return;
        }

        executeCreate({
            courseId: Number(courseId),
            classId: Number(classId),
            title,
            submission,
            deadline,
            description,
            taskType
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
                    placeholder='Enter assignment title'
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='submission' className='text-sm font-medium'>
                    Title
                </label>
                <Input
                    id='submission'
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder='Enter assignment submission'
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='deadline' className='text-sm font-medium'>
                    Deadline
                </label>
                <Input
                    id='deadline'
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder='Enter assignment deadline'
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
                    placeholder='Enter assignment description'
                    rows={5}
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='description' className='text-sm font-medium'>
                    Task type
                </label>
                <Textarea
                    id='taskType'
                    value={description}
                    onChange={(e) => setTaskType(e.target.value)}
                    placeholder='Enter assignment task type'
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
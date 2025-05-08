'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import React, {useState} from 'react';
import {createClassAssignment} from "@/_actions/class-assignment-action";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {AssignmentTaskType} from "@/_actions/enum/action-enum";
import validationErrorToString from "@/lib/validationErrorToString";
import {dateToMinutePrecisionString, fromGMT7ToUTC, fromUTCToGMT7} from "@/_actions/utils/utils";

interface AddAssignmentFormProps {
    courseId: string;
    classId: string;
}

export default function AddAssignmentForm({courseId, classId}: AddAssignmentFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [submission, setSubmission] = useState('');
    const [deadline, setDeadline] = useState(new Date().toISOString());
    const [description, setDescription] = useState('');
    const [taskType, setTaskType] = useState(AssignmentTaskType.PERSONAL_TASK);

    const {execute: executeCreate, status} = useAction(createClassAssignment, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Assignment created successfully');
            router.push(`/portal/admin/courses/${courseId}/classes/${classId}/assignments`);
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to create class assignment');
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
                    Submission
                </label>
                <Input
                    id='submission'
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder='Enter assignment submission (e.g: MS Team / Edunex)'
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='deadline' className='text-sm font-medium'>
                    Deadline
                </label>
                <Input
                    id='deadline'
                    type='datetime-local'
                    value={dateToMinutePrecisionString(fromUTCToGMT7(new Date(deadline)))}
                    onChange={(e) => {
                        return setDeadline(fromGMT7ToUTC(new Date(e.target.value)).toISOString());
                    }}
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

            <div>
                <Label>Task type</Label>
                <Select
                    onValueChange={(value) => setTaskType(value as AssignmentTaskType)}
                    defaultValue={AssignmentTaskType.PERSONAL_TASK}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select task type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={AssignmentTaskType.PERSONAL_TASK}>Personal Task</SelectItem>
                        <SelectItem value={AssignmentTaskType.GROUP_TASK}>Group Task</SelectItem>
                    </SelectContent>
                </Select>
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
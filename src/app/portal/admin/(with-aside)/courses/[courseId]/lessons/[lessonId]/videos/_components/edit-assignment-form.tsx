'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import React, {useState} from 'react';
import {ClassAssignmentResponse, updateClassAssignment} from "@/_actions/class-assignment-action";
import {dateToMinutePrecisionString, fromGMT7ToUTC, fromUTCToGMT7} from "@/_actions/utils/utils";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {AssignmentTaskType} from "@/_actions/enum/action-enum";
import validationErrorToString from "@/lib/validationErrorToString";

interface EditClassAssignmentFormProps {
    assignment: ClassAssignmentResponse;
    courseId: string;
    classId: string;
    assignmentId: string;
}

export default function EditAssignmentForm({
                                               assignment,
                                               courseId,
                                               classId,
                                               assignmentId
                                           }: EditClassAssignmentFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(assignment.title);
    const [submission, setSubmission] = useState(assignment.submission);
    const [deadline, setDeadline] = useState(new Date(assignment.deadline).toISOString());
    const [description, setDescription] = useState(assignment.description);
    const [taskType, setTaskType] = useState(assignment.taskType);

    const {execute: executeUpdate, status} = useAction(updateClassAssignment, {
        onSuccess: () => {
            toast.success('Assignment updated successfully');
            router.push(`/portal/admin/courses/${courseId}/classes/${classId}/assignments`);
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to update assignment');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        executeUpdate({
            courseId: Number(courseId),
            classId: Number(classId),
            assignmentId: Number(assignmentId),
            title,
            submission,
            deadline,
            description,
            taskType,
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
                    defaultValue={assignment.taskType}
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
                Update
            </Button>
        </form>
    );
} 
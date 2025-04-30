'use client';

import {useRouter} from 'next/navigation';
import {useAction} from 'next-safe-action/hooks';
import {CourseScheduleResponse, updateCourseSchedule} from '@/_actions/schedule-action';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import React, {useState} from 'react';
import validationErrorToString from "@/lib/validationErrorToString";
import {dateToMinutePrecisionString, fromGMT7ToUTC, fromUTCToGMT7} from "@/_actions/utils/utils";

interface EditScheduleFormProps {
    schedule: CourseScheduleResponse;
    courseId: string;
    scheduleId: string
}

export default function EditScheduleForm({schedule, courseId, scheduleId}: EditScheduleFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(schedule.title);
    const [description, setDescription] = useState(schedule.description ?? '');
    const [location, setLocation] = useState(schedule.location);
    const [startDate, setStartDate] = useState(new Date(schedule.startDate).toISOString());
    const [endDate, setEndDate] = useState(new Date(schedule.endDate).toISOString());

    const {execute: executeUpdate, status} = useAction(updateCourseSchedule, {
        onSuccess: () => {
            toast.success('Schedule updated successfully');
            router.push(`/portal/admin/courses/${courseId}/schedules`);
            router.refresh();
        },
        onError: ({error: {fetchError, validationErrors}}) => {
            toast.error(fetchError || validationErrorToString(validationErrors) || 'Failed to update schedule');
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        executeUpdate({
            courseId: Number(courseId),
            scheduleId: Number(scheduleId),
            title,
            description,
            location,
            startDate,
            endDate
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
                    placeholder='Enter schedule title'
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
                    placeholder='Enter schedule description'
                    rows={5}
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='location' className='text-sm font-medium'>
                    Location
                </label>
                <Textarea
                    id='location'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder='Enter schedule location'
                    rows={5}
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='deadline' className='text-sm font-medium'>
                    Start Date
                </label>
                <Input
                    id='deadline'
                    type='datetime-local'
                    value={dateToMinutePrecisionString(fromUTCToGMT7(new Date(startDate)))}
                    onChange={(e) => {
                        return setStartDate(fromGMT7ToUTC(new Date(e.target.value)).toISOString());
                    }}
                    placeholder='Enter schedule start date'
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='deadline' className='text-sm font-medium'>
                    End Date
                </label>
                <Input
                    id='deadline'
                    type='datetime-local'
                    value={dateToMinutePrecisionString(fromUTCToGMT7(new Date(endDate)))}
                    onChange={(e) => {
                        return setEndDate(fromGMT7ToUTC(new Date(e.target.value)).toISOString());
                    }}
                    placeholder='Enter schedule end date'
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
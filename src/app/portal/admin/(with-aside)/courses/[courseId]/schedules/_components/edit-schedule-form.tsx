'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { updateSchedule } from '@/_actions/schedule-action';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface EditScheduleFormProps {
  schedule: any;
  courseId: string;
}

export default function EditScheduleForm({ schedule, courseId }: EditScheduleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(schedule.title);
  const [description, setDescription] = useState(schedule.description || '');
  const [date, setDate] = useState(new Date(schedule.date).toISOString().slice(0, 16));

  const { execute: executeUpdate, status } = useAction(updateSchedule, {
    onSuccess: () => {
      toast.success('Schedule updated successfully');
      router.push(`/portal/admin/courses/${courseId}/schedules`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Failed to update schedule');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    executeUpdate({
      courseId: Number(courseId),
      scheduleId: schedule.id,
      title,
      description,
      date: new Date(date),
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
        <label htmlFor='date' className='text-sm font-medium'>
          Date
        </label>
        <Input
          id='date'
          type='datetime-local'
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
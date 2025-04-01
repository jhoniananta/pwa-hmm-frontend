'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { createSchedule } from '@/_actions/schedule-action';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AddScheduleFormProps {
  courseId: string;
}

export default function AddScheduleForm({ courseId }: AddScheduleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const { execute: executeCreate, status } = useAction(createSchedule, {
    onSuccess: () => {
      toast.success('Schedule created successfully');
      router.push(`/portal/admin/courses/${courseId}/schedules`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Failed to create schedule');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    executeCreate({
      courseId: Number(courseId),
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
        Create
      </Button>
    </form>
  );
} 
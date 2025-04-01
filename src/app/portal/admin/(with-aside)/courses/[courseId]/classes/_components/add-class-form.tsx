'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { createClass } from '@/_actions/class-action';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AddClassFormProps {
  courseId: string;
}

export default function AddClassForm({ courseId }: AddClassFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');

  const { execute: executeCreate, status } = useAction(createClass, {
    onSuccess: () => {
      toast.success('Class created successfully');
      router.push(`/portal/admin/courses/${courseId}/classes`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Failed to create class');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !day || !startTime || !endTime || !room) {
      toast.error('Please fill in all required fields');
      return;
    }

    executeCreate({
      courseId: Number(courseId),
      name,
      description,
      day,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      room,
    });
  };

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <label htmlFor='name' className='text-sm font-medium'>
          Name
        </label>
        <Input
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter class name'
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
          placeholder='Enter class description'
          rows={5}
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='day' className='text-sm font-medium'>
          Day
        </label>
        <Input
          id='day'
          value={day}
          onChange={(e) => setDay(e.target.value)}
          placeholder='Enter class day'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='startTime' className='text-sm font-medium'>
          Start Time
        </label>
        <Input
          id='startTime'
          type='datetime-local'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='endTime' className='text-sm font-medium'>
          End Time
        </label>
        <Input
          id='endTime'
          type='datetime-local'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='room' className='text-sm font-medium'>
          Room
        </label>
        <Input
          id='room'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder='Enter room'
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
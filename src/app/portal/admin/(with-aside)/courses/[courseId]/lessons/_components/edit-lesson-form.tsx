'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { updateLesson } from '@/_actions/lessons-action';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CourseLessonModel } from 'lms-types';

interface EditLessonFormProps {
  lesson: CourseLessonModel;
  courseId: string;
}

export default function EditLessonForm({ lesson, courseId }: EditLessonFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description || '');
  const [references, setReferences] = useState('');

  const { execute: executeUpdate, status } = useAction(updateLesson, {
    onSuccess: () => {
      toast.success('Lesson updated successfully');
      router.push(`/portal/admin/courses/${courseId}/lessons`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Failed to update lesson');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) {
      toast.error('Title is required');
      return;
    }

    executeUpdate({
      courseId: Number(courseId),
      lessonId: lesson.id,
      title,
      description,
      references: references.split(',').map(ref => ref.trim()).filter(Boolean),
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

      <div className='space-y-2'>
        <label htmlFor='references' className='text-sm font-medium'>
          References
        </label>
        <Input
          id='references'
          value={references}
          onChange={(e) => setReferences(e.target.value)}
          placeholder='Enter references (comma separated)'
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
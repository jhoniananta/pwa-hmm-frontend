'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import validationErrorToString from '@/lib/validationErrorToString';
import { createAttachment } from '@/_actions/attachments-action';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import UploadFile from '@/components/UploadFile';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addAttachmentSchema } from '@/_actions/schema/attachment-schema';

interface AddAttachmentFormProps {
  courseId: string;
  lessonId: string;
}

export default function AddAttachmentForm({
  courseId,
  lessonId,
}: AddAttachmentFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const methods = useForm<z.infer<typeof addAttachmentSchema>>({
    defaultValues: {
      name: '',
      description: '',
      file: undefined,
      courseId: Number(courseId),
      lessonId: Number(lessonId),
    },
    mode: 'onChange',
    resolver: zodResolver(addAttachmentSchema),
  });

  const { control, handleSubmit } = methods;

  const { execute: executeCreate, status } = useAction(createAttachment, {
    onSuccess: () => {
      toast.success('Attachment created successfully');
      router.push(
        `/portal/admin/courses/${courseId}/lessons/${lessonId}/attachments`
      );
      router.refresh();
    },
    onError: ({ error: { fetchError, validationErrors } }) => {
      toast.error(
        fetchError ||
          validationErrorToString(validationErrors) ||
          'Failed to create attachment'
      );
    },
  });

  const onSubmit = (data: z.infer<typeof addAttachmentSchema>) => {
    executeCreate({
        courseId: Number(courseId),
        lessonId: Number(lessonId),
        name: data.name,
        description: data.description,
        file: data.file,
    });
  };

  return (
    <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-2'>
            <label htmlFor='title' className='text-sm font-medium'>
            Title
            </label>
            <Input
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter attachment name'
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
            placeholder='Enter attachment description'
            rows={5}
            />
        </div>

        <FormField
            control={control}
            name={'file'}
            render={() => (
            <FormItem>
                <FormLabel>
                {'PDF File'}
                {true && <span className='text-red-500'>*</span>}
                </FormLabel>
                <FormControl>
                <UploadFile
                    sessionIdName={'file'}
                    accept={{ 'application/pdf': ['.pdf'] }}
                    maxSizeInBytes={5_000_000}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

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
    </FormProvider>
  );
}

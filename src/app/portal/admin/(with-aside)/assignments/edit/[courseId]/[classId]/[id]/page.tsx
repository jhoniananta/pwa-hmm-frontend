'use client';
import React from 'react';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AdminHeader from '@/components/admin/header';
import { useParams, useSearchParams } from 'next/navigation';
import Wrapper from '../../../../../../wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAssignmentSchema } from '@/lib/schema';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssignmentTaskTypeModel } from 'lms-types';
import { useAction } from 'next-safe-action/hooks';
import { updateAssignment } from '@/_actions/assignment-action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { courseId, classId, id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultValues = {
    title: searchParams.get('title') || '',
    deadline: new Date(searchParams.get('deadline') || Date.now()),
    submission: searchParams.get('submission') || '',
    taskType: searchParams.get('taskType') as AssignmentTaskTypeModel || undefined,
    description: searchParams.get('description') || '',
    courseId: Number(courseId),
    classId: Number(classId),
    assignmentId: Number(id),
  };

  type FormData = z.infer<typeof updateAssignmentSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(updateAssignmentSchema),
    defaultValues,
  });

  const { execute: executeUpdateAssignment, isExecuting } = useAction(updateAssignment, {
    onSuccess: () => {
      toast.success('Assignment updated successfully');
      router.push('/portal/atur-atur/assignments');
    },
    onError: ({ error: { serverError, validationErrors, fetchError } }) => {
      toast.error(
        serverError ||
          fetchError ||
          validationErrors?.toString() ||
          'Failed to update assignment'
      );
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    executeUpdateAssignment(data);
  };

  if (!defaultValues) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <AdminHeader title='Edit Assignment' />
      <AdminBreadcrumb />
      <Wrapper>
        <form
          className='space-y-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label
              htmlFor='title'
              className='block text-sm font-medium'
            >
              Title
            </Label>
            <Input
              type='text'
              id='title'
              {...register('title')}
              className='mt-1'
              defaultValue={defaultValues.title}
            />
          </div>
          <div>
            <Label
              htmlFor='deadline'
              className='block text-sm font-medium'
            >
              Deadline
            </Label>
            <div className='flex mt-1 space-x-2'>
              <Input
                type='datetime-local'
                id='deadline'
                {...register('deadline', {
                  valueAsDate: true,
                })}
                className='flex-1'
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor='submission'
              className='block text-sm font-medium'
            >
              Submission
            </Label>
            <Select
              onValueChange={(value) => setValue('submission', value)}
              defaultValue={defaultValues.submission}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select submission method' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ms-teams'>MS Teams</SelectItem>
                <SelectItem value='edunex'>Edunex</SelectItem>
                <SelectItem value='on-site'>On-Site</SelectItem>
                <SelectItem value='g-drive'>Google Drive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor='taskType'
              className='block text-sm font-medium'
            >
              Task Type
            </Label>
            <Select
              onValueChange={(value) =>
                setValue('taskType', value as AssignmentTaskTypeModel)
              }
              defaultValue={defaultValues.taskType}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select task type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='PERSONAL_TASK'>Personal Task</SelectItem>
                <SelectItem value='GROUP_TASK'>Group Task</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor='description'
              className='block text-sm font-medium'
            >
              Description
            </Label>
            <Textarea
              id='description'
              {...register('description')}
              rows={5}
              className='mt-1'
              defaultValue={defaultValues.description}
            />
          </div>
          <div>
            <Button
              type='submit'
              className='bg-navy'
              disabled={isExecuting}
            >
              {isExecuting ? 'Updating...' : 'Update Assignment'}
            </Button>
          </div>
        </form>
      </Wrapper>
    </>
  );
}
